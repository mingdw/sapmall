// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package order

import (
	"context"
	"errors"
	"strings"
	"time"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

const (
	orderActionCancel     = "cancel"
	orderActionDelete     = "delete"
	orderActionResumePay  = "resumePay"
	orderActionConfirming = "confirming"
)

type ModifyOrderLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 订单修改。action：cancel 取消 | delete 软删除 | resumePay 继续支付；请求：ModifyOrderReq
func NewModifyOrderLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ModifyOrderLogic {
	return &ModifyOrderLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ModifyOrderLogic) ModifyOrder(req *types.ModifyOrderReq) (resp *types.BaseResp, err error) {
	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		if errors.Is(authErr, user.ErrUserNotLoggedIn) || errors.Is(authErr, user.ErrUserNotFound) {
			return customererrors.AuthFailedResp("请先登录"), nil
		}
		return customererrors.AuthFailedResp("获取用户信息失败"), nil
	}

	if req.Id <= 0 && req.OrderCode == "" {
		return customererrors.ParamErrorResp("订单 ID 或订单号不能为空"), nil
	}

	action := strings.ToLower(strings.TrimSpace(req.Action))
	switch action {
	case orderActionCancel, orderActionDelete, orderActionResumePay, orderActionConfirming:
	default:
		return customererrors.ParamErrorResp("不支持的订单操作"), nil
	}

	orderRepo := repository.NewOrderRepository(l.svcCtx.GormDB)
	var orderRow *model.Order
	var getErr error
	if req.Id > 0 {
		orderRow, getErr = orderRepo.GetByID(l.ctx, req.Id)
	} else {
		orderRow, getErr = orderRepo.GetByOrderCode(l.ctx, req.OrderCode)
	}
	if getErr != nil {
		if errors.Is(getErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("订单不存在"), nil
		}
		l.Errorf("get order failed, id=%d, err=%v", req.Id, getErr)
		return customererrors.DatabaseErrorResp("查询订单失败"), nil
	}

	paymentRepo := repository.NewOrderPaymentRepository(l.svcCtx.GormDB)
	paymentRow, payErr := paymentRepo.GetByOrderID(l.ctx, orderRow.ID)
	if payErr != nil {
		if errors.Is(payErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("支付记录不存在"), nil
		}
		l.Errorf("get order payment failed, id=%d, err=%v", req.Id, payErr)
		return customererrors.DatabaseErrorResp("查询支付记录失败"), nil
	}

	if orderRow.UserId != userInfo.ID {
		return customererrors.PermissionDeniedResp("无权操作该订单"), nil
	}

	updator := strings.TrimSpace(userInfo.UserCode)
	if updator == "" {
		updator = strings.TrimSpace(userInfo.UniqueId)
	}

	switch action {
	case orderActionCancel:
		if errResp := l.cancelOrder(orderRow, paymentRow, updator); errResp != nil {
			return errResp, nil
		}
	case orderActionDelete:
		if errResp := l.deleteOrder(req.Id, updator); errResp != nil {
			return errResp, nil
		}
	case orderActionResumePay:
		if errResp := l.resumePay(orderRow, paymentRow, req.ExtendExpireMinutes, updator); errResp != nil {
			return errResp, nil
		}
	case orderActionConfirming:
		if errResp := l.markConfirming(orderRow, paymentRow, req.TxHash, updator); errResp != nil {
			return errResp, nil
		}
	}

	if remark := strings.TrimSpace(req.OrderRemark); remark != "" {
		if updateErr := orderRepo.UpdateColumnsByID(l.ctx, orderRow.ID, map[string]interface{}{
			"order_remark": remark,
			"updator":      updator,
		}); updateErr != nil {
			l.Errorf("update order remark failed, id=%d, err=%v", req.Id, updateErr)
			return customererrors.DatabaseErrorResp("更新订单备注失败"), nil
		}
	}

	return customererrors.SuccessMsg("操作成功"), nil
}

func (l *ModifyOrderLogic) cancelOrder(orderRow *model.Order, paymentRow *model.OrderPayment, updator string) *types.BaseResp {
	if orderRow.PaymentStatus == PaymentStatusPaid && orderRow.OrderStatus == OrderStatusCancelled {
		return nil
	}

	txErr := l.svcCtx.GormDB.WithContext(l.ctx).Transaction(func(tx *gorm.DB) error {
		orderRepo := repository.NewOrderRepository(tx)
		paymentRepo := repository.NewOrderPaymentRepository(tx)
		if err := orderRepo.UpdateColumnsByID(l.ctx, orderRow.ID, map[string]interface{}{
			"order_status":        OrderStatusCancelled,
			"order_status_desc":   OrderStatusDesc(OrderStatusCancelled),
			"payment_status":      PaymentStatusClosed,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusClosed),
			"updator":             updator,
		}); err != nil {
			return err
		}
		return paymentRepo.UpdateColumnsByOrderID(l.ctx, orderRow.ID, map[string]interface{}{
			"payment_status":      PaymentStatusClosed,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusClosed),
			"updator":             updator,
		})
	})
	if txErr != nil {
		l.Errorf("cancel order failed, id=%d, err=%v", orderRow.ID, txErr)
		return customererrors.DatabaseErrorResp("取消订单失败")
	}
	_ = paymentRow
	return nil
}

func (l *ModifyOrderLogic) deleteOrder(orderID int64, updator string) *types.BaseResp {
	txErr := l.svcCtx.GormDB.WithContext(l.ctx).Transaction(func(tx *gorm.DB) error {
		orderRepo := repository.NewOrderRepository(tx)
		paymentRepo := repository.NewOrderPaymentRepository(tx)
		if err := orderRepo.SoftDelete(l.ctx, orderID, updator); err != nil {
			return err
		}
		if err := paymentRepo.SoftDeleteByOrderID(l.ctx, orderID, updator); err != nil {
			return err
		}
		return tx.WithContext(l.ctx).
			Model(&model.OrderPromotion{}).
			Where("order_id = ? AND is_deleted = ?", orderID, 0).
			Updates(map[string]interface{}{
				"is_deleted": 1,
				"updator":    updator,
			}).Error
	})
	if txErr != nil {
		l.Errorf("delete order failed, id=%d, err=%v", orderID, txErr)
		return customererrors.DatabaseErrorResp("删除订单失败")
	}
	return nil
}

func (l *ModifyOrderLogic) resumePay(orderRow *model.Order, paymentRow *model.OrderPayment, extendMins int64, updator string) *types.BaseResp {
	if orderRow.PaymentStatus == PaymentStatusPaid {
		return customererrors.ParamErrorResp("订单已支付，无需继续支付")
	}
	if extendMins <= 0 {
		extendMins = 30
	}
	newExpire := time.Now().Add(time.Duration(extendMins) * time.Minute)

	txErr := l.svcCtx.GormDB.WithContext(l.ctx).Transaction(func(tx *gorm.DB) error {
		orderRepo := repository.NewOrderRepository(tx)
		paymentRepo := repository.NewOrderPaymentRepository(tx)
		orderUpdates := map[string]interface{}{
			"expire_at":           newExpire,
			"payment_status":      PaymentStatusUnpaid,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusUnpaid),
			"updator":             updator,
		}
		if orderRow.OrderStatus == OrderStatusCancelled ||
			orderRow.OrderStatus == OrderStatusExpired ||
			orderRow.OrderStatus == OrderStatusPayFailed {
			orderUpdates["order_status"] = OrderStatusPendingPay
			orderUpdates["order_status_desc"] = OrderStatusDesc(OrderStatusPendingPay)
		}
		if err := orderRepo.UpdateColumnsByID(l.ctx, orderRow.ID, orderUpdates); err != nil {
			return err
		}
		return paymentRepo.UpdateColumnsByOrderID(l.ctx, orderRow.ID, map[string]interface{}{
			"expire_at":           newExpire,
			"payment_status":      PaymentStatusUnpaid,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusUnpaid),
			"fail_reason":         "",
			"updator":             updator,
		})
	})
	if txErr != nil {
		l.Errorf("resume order pay failed, id=%d, err=%v", orderRow.ID, txErr)
		return customererrors.DatabaseErrorResp("继续支付操作失败")
	}
	_ = paymentRow
	return nil
}

func (l *ModifyOrderLogic) markConfirming(orderRow *model.Order, paymentRow *model.OrderPayment, txHash string, updator string) *types.BaseResp {
	txHash = strings.TrimSpace(txHash)

	// 已支付：幂等成功，不再重复触发确认
	if orderRow.PaymentStatus == PaymentStatusPaid ||
		orderRow.OrderStatus == OrderStatusPaid ||
		orderRow.OrderStatus == OrderStatusToShip ||
		orderRow.OrderStatus == OrderStatusShipped ||
		orderRow.OrderStatus == OrderStatusCompleted {
		return nil
	}
	if paymentRow.PaymentStatus == PaymentStatusClosed {
		return customererrors.ParamErrorResp("订单已关闭")
	}

	// 已在链上确认中：幂等成功，仅补全 txHash
	if orderRow.PaymentStatus == PaymentStatusConfirming ||
		orderRow.OrderStatus == OrderStatusOnChainConfirming {
		return l.idempotentConfirming(orderRow, paymentRow, txHash, updator)
	}

	if orderRow.OrderStatus != OrderStatusPendingPay {
		return customererrors.ParamErrorResp("订单状态不支持此操作")
	}

	txErr := l.svcCtx.GormDB.WithContext(l.ctx).Transaction(func(tx *gorm.DB) error {
		orderRepo := repository.NewOrderRepository(tx)
		paymentRepo := repository.NewOrderPaymentRepository(tx)
		if err := orderRepo.UpdateColumnsByID(l.ctx, orderRow.ID, map[string]interface{}{
			"order_status":        OrderStatusOnChainConfirming,
			"order_status_desc":   OrderStatusDesc(OrderStatusOnChainConfirming),
			"payment_status":      PaymentStatusConfirming,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusConfirming),
			"updator":             updator,
		}); err != nil {
			return err
		}
		paymentUpdates := map[string]interface{}{
			"payment_status":      PaymentStatusConfirming,
			"payment_status_desc": PaymentStatusDesc(PaymentStatusConfirming),
			"updator":             updator,
		}
		if txHash != "" {
			paymentUpdates["tx_hash"] = txHash
		}
		return paymentRepo.UpdateColumnsByOrderID(l.ctx, orderRow.ID, paymentUpdates)
	})
	if txErr != nil {
		l.Errorf("mark confirming failed, id=%d, err=%v", orderRow.ID, txErr)
		return customererrors.DatabaseErrorResp("更新订单状态失败")
	}

	if txHash != "" {
		go AsyncConfirmOrder(l.ctx, l.svcCtx, orderRow.ID, txHash)
	}

	return nil
}

// idempotentConfirming 订单已在确认中时幂等处理：补全 txHash，不重复 AsyncConfirmOrder
func (l *ModifyOrderLogic) idempotentConfirming(
	orderRow *model.Order,
	paymentRow *model.OrderPayment,
	txHash string,
	updator string,
) *types.BaseResp {
	existingTx := strings.TrimSpace(paymentRow.TxHash)
	if txHash != "" && existingTx != "" && !strings.EqualFold(existingTx, txHash) {
		return customererrors.ParamErrorResp("交易哈希与当前订单不一致")
	}

	needUpdateTx := txHash != "" && existingTx == ""
	if !needUpdateTx {
		return nil
	}

	txErr := l.svcCtx.GormDB.WithContext(l.ctx).Transaction(func(tx *gorm.DB) error {
		paymentRepo := repository.NewOrderPaymentRepository(tx)
		return paymentRepo.UpdateColumnsByOrderID(l.ctx, orderRow.ID, map[string]interface{}{
			"tx_hash": txHash,
			"updator": updator,
		})
	})
	if txErr != nil {
		l.Errorf("idempotent confirming update tx failed, id=%d, err=%v", orderRow.ID, txErr)
		return customererrors.DatabaseErrorResp("更新交易哈希失败")
	}

	go AsyncConfirmOrder(l.ctx, l.svcCtx, orderRow.ID, txHash)
	return nil
}
