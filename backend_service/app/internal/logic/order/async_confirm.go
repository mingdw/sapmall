package order

import (
	"context"
	"fmt"
	"strings"
	"time"

	"sapphire-mall/app/internal/chain"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"

	"github.com/ethereum/go-ethereum/core/types"
	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

const (
	asyncConfirmPollInterval = 3 * time.Second
	asyncConfirmMaxWait      = 5 * time.Minute
)

// AsyncConfirmOrder 在独立 goroutine 中轮询链上交易确认状态。
func AsyncConfirmOrder(ctx context.Context, svcCtx *svc.ServiceContext, orderID int64, txHash string) {
	l := logx.WithContext(ctx)

	rpcURL := strings.TrimSpace(svcCtx.Config.ChainMonitor.RPCURL)
	if rpcURL == "" {
		l.Errorf("async_confirm: rpc url not configured")
		return
	}

	paymentRepo := repository.NewOrderPaymentRepository(svcCtx.GormDB)
	paymentRow, err := paymentRepo.GetByOrderID(ctx, orderID)
	if err != nil {
		l.Errorf("async_confirm: get payment record failed: %v", err)
		return
	}

	contractAddr := strings.TrimSpace(paymentRow.ContractAddress)
	if contractAddr == "" || !commonIsHexAddress(contractAddr) {
		l.Errorf("async_confirm: contract address invalid: %s", contractAddr)
		return
	}

	ticker := time.NewTicker(asyncConfirmPollInterval)
	defer ticker.Stop()

	deadline := time.Now().Add(asyncConfirmMaxWait)
	l.Infof("async_confirm started: orderID=%d txHash=%s", orderID, txHash)

	for {
		select {
		case <-ctx.Done():
			l.Infof("async_confirm cancelled, orderID=%d", orderID)
			return
		case <-ticker.C:
			result, verifyErr := chain.VerifyPaymentTx(ctx, rpcURL, contractAddr, txHash)
			if verifyErr != nil {
				l.Errorf("async_confirm: verify failed, orderID=%d err=%v", orderID, verifyErr)
				if time.Now().After(deadline) {
					setOrderFailed(ctx, svcCtx, orderID, paymentRepo, "链上查询超时")
					return
				}
				continue
			}

			if result == nil {
				if time.Now().After(deadline) {
					setOrderFailed(ctx, svcCtx, orderID, paymentRepo, "支付超时未确认")
					return
				}
				continue
			}

			if result.Receipt.Status == 1 {
				if result.Event != nil {
					if vErr := chain.VerifyPaymentParams(
						result.Event,
						paymentRow.IntentId,
						paymentRow.OrderCode,
						paymentRow.AmountRaw,
						paymentRow.TokenAddress,
						paymentRow.PayerAddress,
					); vErr != nil {
						l.Errorf("async_confirm: verify params failed, orderID=%d err=%v", orderID, vErr)
						setOrderFailed(ctx, svcCtx, orderID, paymentRepo, fmt.Sprintf("参数验证失败: %v", vErr))
						return
					}
				}
				setOrderPaid(ctx, svcCtx, orderID, paymentRepo, result.Receipt)
				return
			}

			setOrderFailed(ctx, svcCtx, orderID, paymentRepo, "链上交易失败(reverted)")
			return
		}
	}
}

func setOrderPaid(ctx context.Context, svcCtx *svc.ServiceContext, orderID int64, paymentRepo repository.OrderPaymentRepository, receipt *types.Receipt) {
	now := time.Now()
	var blockNumber int64
	if receipt != nil {
		blockNumber = receipt.BlockNumber.Int64()
	}

	err := svcCtx.GormDB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		oRepo := repository.NewOrderRepository(tx)
		pRepo := repository.NewOrderPaymentRepository(tx)

		if err := oRepo.UpdateColumnsByID(ctx, orderID, map[string]interface{}{
			"order_status":      OrderStatusPaid,
			"order_status_desc": OrderStatusDesc(OrderStatusPaid),
			"payment_status":    PaymentStatusPaid,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusPaid),
		}); err != nil {
			return err
		}

		return pRepo.UpdateColumnsByOrderID(ctx, orderID, map[string]interface{}{
			"payment_status":      PaymentStatusPaid,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusPaid),
			"block_number":        blockNumber,
			"confirmed_at":        now,
		})
	})

	if err != nil {
		logx.WithContext(ctx).Errorf("async_confirm: set paid failed, orderID=%d err=%v", orderID, err)
	} else {
		logx.WithContext(ctx).Infof("async_confirm: order %d marked as paid, block=%d", orderID, blockNumber)
	}
}

func setOrderFailed(ctx context.Context, svcCtx *svc.ServiceContext, orderID int64, paymentRepo repository.OrderPaymentRepository, reason string) {
	err := svcCtx.GormDB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		oRepo := repository.NewOrderRepository(tx)
		pRepo := repository.NewOrderPaymentRepository(tx)

		if err := oRepo.UpdateColumnsByID(ctx, orderID, map[string]interface{}{
			"order_status":      OrderStatusPayFailed,
			"order_status_desc": OrderStatusDesc(OrderStatusPayFailed),
			"payment_status":    PaymentStatusClosed,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusClosed),
		}); err != nil {
			return err
		}

		return pRepo.UpdateColumnsByOrderID(ctx, orderID, map[string]interface{}{
			"payment_status":      PaymentStatusClosed,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusClosed),
			"fail_reason":         reason,
		})
	})

	if err != nil {
		logx.WithContext(ctx).Errorf("async_confirm: set failed err=%v", err)
	} else {
		logx.WithContext(ctx).Infof("async_confirm: order %d failed, reason=%s", orderID, reason)
	}
}
