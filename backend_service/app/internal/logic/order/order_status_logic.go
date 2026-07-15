package order

import (
	"context"
	"strings"
	"time"

	"sapphire-mall/app/internal/chain"
	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type OrderStatusLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewOrderStatusLogic(ctx context.Context, svcCtx *svc.ServiceContext) *OrderStatusLogic {
	return &OrderStatusLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// GetOrderStatus 前端轮询支付状态。查库 + 按需查链上。
func (l *OrderStatusLogic) GetOrderStatus(req *types.OrderStatusReq) (resp *types.BaseResp, err error) {
	if strings.TrimSpace(req.OrderCode) == "" {
		return customererrors.ParamErrorResp("orderCode 不能为空"), nil
	}

	orderRepo := repository.NewOrderRepository(l.svcCtx.GormDB)
	orderRow, orderErr := orderRepo.GetByOrderCode(l.ctx, req.OrderCode)
	if orderErr != nil {
		return customererrors.NotFoundResp("订单不存在"), nil
	}

	paymentRepo := repository.NewOrderPaymentRepository(l.svcCtx.GormDB)
	paymentRow, payErr := paymentRepo.GetByOrderID(l.ctx, orderRow.ID)
	if payErr != nil {
		return customererrors.NotFoundResp("支付记录不存在"), nil
	}

	respData := buildOrderStatusResp(orderRow, paymentRow, req.TxHash)

	// 已支付成功，直接返回
	if paymentRow.PaymentStatus == PaymentStatusPaid {
		return customererrors.SuccessData(respData), nil
	}

	// 已关闭（支付失败/已取消），直接返回
	if paymentRow.PaymentStatus == PaymentStatusClosed {
		return customererrors.SuccessData(respData), nil
	}

	// 链上确认中或前端已提交 tx（尚未落库）时，按 txHash 查链同步
	reqTxHash := strings.TrimSpace(req.TxHash)
	if reqTxHash != "" && strings.TrimSpace(paymentRow.TxHash) == "" {
		paymentRow.TxHash = reqTxHash
	}
	shouldSyncChain := strings.TrimSpace(paymentRow.TxHash) != "" &&
		(paymentRow.PaymentStatus == PaymentStatusConfirming ||
			(paymentRow.PaymentStatus == PaymentStatusUnpaid && reqTxHash != ""))
	if shouldSyncChain {
		chainUpdated := l.syncChainStatus(orderRow.ID, paymentRow, req.ChainId)

		// 链上状态有更新，重新读取数据库获取最新状态
		if chainUpdated {
			orderRow2, _ := orderRepo.GetByOrderCode(l.ctx, req.OrderCode)
			paymentRow2, _ := paymentRepo.GetByOrderID(l.ctx, orderRow.ID)
			if orderRow2 != nil && paymentRow2 != nil {
				orderRow = orderRow2
				paymentRow = paymentRow2
			}
		}
		// 链上仍为确认中，不更新数据库，继续返回当前确认中状态给前端
	}

	return customererrors.SuccessData(buildOrderStatusResp(orderRow, paymentRow, req.TxHash)), nil
}

func buildOrderStatusResp(orderRow *model.Order, paymentRow *model.OrderPayment, fallbackTxHash string) types.OrderStatusResp {
	gasFeeUsdc := paymentRow.EstGasFee
	if paymentRow.ActGasFee > 0 {
		gasFeeUsdc = paymentRow.ActGasFee
	}
	paidAt := paymentRow.PaidAt
	if paidAt.IsZero() {
		paidAt = paymentRow.ConfirmedAt
	}
	totalAmount := orderRow.TotalAmount
	if totalAmount <= 0 && orderRow.PayableAmount > 0 {
		totalAmount = orderRow.PayableAmount + orderRow.DiscountAmount
	}
	txHash := strings.TrimSpace(paymentRow.TxHash)
	if txHash == "" {
		txHash = strings.TrimSpace(fallbackTxHash)
	}
	return types.OrderStatusResp{
		OrderCode:         orderRow.OrderCode,
		OrderStatus:       int64(orderRow.OrderStatus),
		PaymentStatus:     int64(paymentRow.PaymentStatus),
		TxHash:            txHash,
		TotalAmount:       totalAmount,
		DiscountAmount:    orderRow.DiscountAmount,
		PayableAmount:     orderRow.PayableAmount,
		PlatformFeeAmount: orderRow.PlatformFeeAmount,
		PayAmount:         paymentRow.PayAmount,
		TokenSymbol:       paymentRow.TokenSymbol,
		ChainId:           paymentRow.ChainId,
		GasFeeUsdc:        gasFeeUsdc,
		PaidAt:            formatTimeRFC3339(paidAt),
		FailReason:        paymentRow.FailReason,
	}
}

// syncChainStatus 同步链上支付状态，返回是否有更新
func (l *OrderStatusLogic) syncChainStatus(orderID int64, paymentRow *model.OrderPayment, chainId int64) bool {
	rpcURL := ""

	// 优先使用请求传入的 chainId 从 sys_chain_network 查询 RPC
	if chainId > 0 {
		networkRepo := repository.NewChain_networkRepository(l.svcCtx.GormDB)
		network, err := networkRepo.GetByChainId(l.ctx, int(chainId))
		if err == nil && network != nil {
			rpcURL = strings.TrimSpace(network.RpcUrl)
		}
	}

	// fallback: 从 payment 记录的 chain_id 查询
	if rpcURL == "" && paymentRow.ChainId > 0 {
		networkRepo := repository.NewChain_networkRepository(l.svcCtx.GormDB)
		network, err := networkRepo.GetByChainId(l.ctx, int(paymentRow.ChainId))
		if err == nil && network != nil {
			rpcURL = strings.TrimSpace(network.RpcUrl)
		}
	}

	// fallback: 使用配置文件中的 RPC
	if rpcURL == "" {
		rpcURL = strings.TrimSpace(l.svcCtx.Config.ChainMonitor.RPCURL)
	}

	if rpcURL == "" {
		l.Infof("syncChainStatus: RPCURL not configured, orderCode=%s", paymentRow.OrderCode)
		return false
	}

	contractAddr := strings.TrimSpace(paymentRow.ContractAddress)
	if contractAddr == "" || !commonIsHexAddress(contractAddr) {
		l.Infof("syncChainStatus: invalid contract address, orderCode=%s, contractAddr=%s", paymentRow.OrderCode, contractAddr)
		return false
	}

	result, err := chain.VerifyPaymentTx(l.ctx, rpcURL, contractAddr, paymentRow.TxHash)
	if err != nil {
		l.Infof("syncChainStatus: verify tx failed, orderCode=%s, txHash=%s, err=%v", paymentRow.OrderCode, paymentRow.TxHash, err)
		return false
	}
	if result == nil {
		// receipt 为空，交易还在 pending
		l.Infof("syncChainStatus: tx still pending, orderCode=%s, txHash=%s", paymentRow.OrderCode, paymentRow.TxHash)
		return false
	}

	// 链上交易已确认
	if result.Receipt.Status == 1 {
		// 交易成功，验证事件参数
		if result.Event != nil {
			vErr := chain.VerifyPaymentParams(
				result.Event,
				paymentRow.IntentId,
				paymentRow.OrderCode,
				paymentRow.AmountRaw,
				paymentRow.TokenAddress,
				paymentRow.PayerAddress,
				sellerCodeOrEmpty(paymentRow.SellerCode),
			)
			if vErr != nil {
				l.Infof("syncChainStatus: event params mismatch, orderCode=%s, err=%v", paymentRow.OrderCode, vErr)
				return false
			}
		}
		// 链上支付成功，更新数据库（包含实际 Gas 费）
		l.Infof("syncChainStatus: payment confirmed on chain, orderCode=%s, blockNumber=%d, gasFee=%.6f USDC", paymentRow.OrderCode, result.Receipt.BlockNumber.Int64(), result.GasFeeUSDC)
		l.markPaid(orderID, result.Receipt.BlockNumber.Int64(), result.GasFeeUSDC)
		return true
	}

	// 链上交易失败
	l.Infof("syncChainStatus: tx failed on chain, orderCode=%s, txHash=%s", paymentRow.OrderCode, paymentRow.TxHash)
	l.markFailed(orderID, "链上交易失败")
	return true
}

func (l *OrderStatusLogic) markPaid(orderID int64, blockNumber int64, actGasFee float64) {
	now := time.Now()

	err := l.svcCtx.GormDB.WithContext(l.ctx).Transaction(func(tx *gorm.DB) error {
		orderRepo := repository.NewOrderRepository(tx)
		paymentRepo := repository.NewOrderPaymentRepository(tx)

		if err := orderRepo.UpdateColumnsByID(l.ctx, orderID, map[string]interface{}{
			"order_status":        OrderStatusToShip,
			"order_status_desc":   OrderStatusDesc(OrderStatusToShip),
			"payment_status":      PaymentStatusPaid,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusPaid),
			"act_gas_fee":         actGasFee,
		}); err != nil {
			return err
		}

		if err := paymentRepo.UpdateColumnsByOrderID(l.ctx, orderID, map[string]interface{}{
			"payment_status":      PaymentStatusPaid,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusPaid),
			"block_number":        blockNumber,
			"confirmed_at":        now,
			"paid_at":             now,
			"act_gas_fee":         actGasFee,
		}); err != nil {
			return err
		}

		// 物流建单失败不应回滚支付入账（避免卡在 order_status=20）
		if err := EnsurePendingLogisticsOnPaid(l.ctx, tx, orderID, "order_status"); err != nil {
			l.Errorf("markPaid: ensure logistics failed (payment kept), orderID=%d err=%v", orderID, err)
		}
		return nil
	})
	if err != nil {
		l.Errorf("markPaid failed, orderID=%d err=%v", orderID, err)
		return
	}

	// 支付成功后，从延时队列移除
	l.removeOrderFromDelayQueue(orderID)
}

func (l *OrderStatusLogic) markFailed(orderID int64, reason string) {
	orderRepo := repository.NewOrderRepository(l.svcCtx.GormDB)
	paymentRepo := repository.NewOrderPaymentRepository(l.svcCtx.GormDB)

	_ = orderRepo.UpdateColumnsByID(l.ctx, orderID, map[string]interface{}{
		"order_status":        OrderStatusPayFailed,
		"order_status_desc":   OrderStatusDesc(OrderStatusPayFailed),
		"payment_status":      PaymentStatusClosed,
		"payment_status_desc": PaymentStatusDesc(PaymentStatusClosed),
	})

	_ = paymentRepo.UpdateColumnsByOrderID(l.ctx, orderID, map[string]interface{}{
		"payment_status":      PaymentStatusClosed,
		"payment_status_desc": PaymentStatusDesc(PaymentStatusClosed),
		"fail_reason":         reason,
	})
}

// removeOrderFromDelayQueue 支付成功后，从延时队列移除订单
func (l *OrderStatusLogic) removeOrderFromDelayQueue(orderID int64) {
	if l.svcCtx.OrderDelayQueue == nil {
		return
	}

	orderRepo := repository.NewOrderRepository(l.svcCtx.GormDB)
	order, err := orderRepo.GetByID(l.ctx, orderID)
	if err != nil {
		return
	}

	if err := l.svcCtx.OrderDelayQueue.Remove(l.ctx, order.OrderCode); err != nil {
		l.Errorf("remove order from delay queue failed, orderCode=%s, err=%v", order.OrderCode, err)
	}
}
