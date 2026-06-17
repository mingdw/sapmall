package order

import (
	"context"
	"strings"

	"sapphire-mall/app/internal/chain"
	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
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

	respData := types.OrderStatusResp{
		OrderStatus:   int64(orderRow.OrderStatus),
		PaymentStatus: int64(paymentRow.PaymentStatus),
		TxHash:        paymentRow.TxHash,
	}

	// 已支付成功，直接返回
	if paymentRow.PaymentStatus == PaymentStatusPaid {
		return customererrors.SuccessData(respData), nil
	}

	// 已关闭（支付失败/已取消），直接返回
	if paymentRow.PaymentStatus == PaymentStatusClosed {
		return customererrors.SuccessData(respData), nil
	}

	// 链上确认中且有 txHash，查询链上最新状态
	if paymentRow.PaymentStatus == PaymentStatusConfirming && paymentRow.TxHash != "" {
		chainUpdated := l.syncChainStatus(orderRow.ID, paymentRow, req.ChainId)

		// 链上状态有更新，重新读取数据库获取最新状态
		if chainUpdated {
			orderRow2, _ := orderRepo.GetByOrderCode(l.ctx, req.OrderCode)
			paymentRow2, _ := paymentRepo.GetByOrderID(l.ctx, orderRow.ID)
			if orderRow2 != nil && paymentRow2 != nil {
				respData.OrderStatus = int64(orderRow2.OrderStatus)
				respData.PaymentStatus = int64(paymentRow2.PaymentStatus)
			}
		}
		// 链上仍为确认中，不更新数据库，继续返回当前确认中状态给前端
	}

	return customererrors.SuccessData(respData), nil
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
	orderRepo := repository.NewOrderRepository(l.svcCtx.GormDB)
	paymentRepo := repository.NewOrderPaymentRepository(l.svcCtx.GormDB)

	_ = orderRepo.UpdateColumnsByID(l.ctx, orderID, map[string]interface{}{
		"order_status":        OrderStatusPaid,
		"order_status_desc":   OrderStatusDesc(OrderStatusPaid),
		"payment_status":      PaymentStatusPaid,
		"payment_status_desc": PaymentStatusDesc(PaymentStatusPaid),
		"act_gas_fee":         actGasFee,
	})

	_ = paymentRepo.UpdateColumnsByOrderID(l.ctx, orderID, map[string]interface{}{
		"payment_status":      PaymentStatusPaid,
		"payment_status_desc": PaymentStatusDesc(PaymentStatusPaid),
		"block_number":        blockNumber,
		"act_gas_fee":         actGasFee,
	})

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
