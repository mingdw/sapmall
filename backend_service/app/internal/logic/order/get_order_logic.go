// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package order

import (
	"context"
	"errors"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type GetOrderLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 按订单号查询订单及支付结果（供结果页轮询）。响应 Data：GetOrderResp { order, payment, promotions, delivery }
func NewGetOrderLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetOrderLogic {
	return &GetOrderLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetOrderLogic) GetOrder(req *types.GetOrderReq) (resp *types.BaseResp, err error) {
	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		if errors.Is(authErr, user.ErrUserNotLoggedIn) || errors.Is(authErr, user.ErrUserNotFound) {
			return customererrors.AuthFailedResp("请先登录"), nil
		}
		return customererrors.AuthFailedResp("获取用户信息失败"), nil
	}

	orderCode := req.OrderCode
	if orderCode == "" {
		return customererrors.ParamErrorResp("订单号不能为空"), nil
	}

	orderRepo := repository.NewOrderRepository(l.svcCtx.GormDB)
	orderRow, orderErr := orderRepo.GetByOrderCode(l.ctx, orderCode)
	if orderErr != nil {
		if errors.Is(orderErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("订单不存在"), nil
		}
		l.Errorf("get order failed, orderCode=%s, err=%v", orderCode, orderErr)
		return customererrors.DatabaseErrorResp("查询订单失败"), nil
	}
	if orderRow.UserId != userInfo.ID {
		return customererrors.PermissionDeniedResp("无权查看该订单"), nil
	}

	var paymentRow model.OrderPayment
	paymentErr := l.svcCtx.GormDB.WithContext(l.ctx).
		Where("order_id = ? AND is_deleted = ?", orderRow.ID, 0).
		First(&paymentRow).Error
	if paymentErr != nil {
		if errors.Is(paymentErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("支付记录不存在"), nil
		}
		l.Errorf("get order payment failed, orderId=%d, err=%v", orderRow.ID, paymentErr)
		return customererrors.DatabaseErrorResp("查询支付记录失败"), nil
	}

	var promotionRows []model.OrderPromotion
	if err := l.svcCtx.GormDB.WithContext(l.ctx).
		Where("order_id = ? AND is_deleted = ?", orderRow.ID, 0).
		Find(&promotionRows).Error; err != nil {
		l.Errorf("list order promotion failed, orderId=%d, err=%v", orderRow.ID, err)
		return customererrors.DatabaseErrorResp("查询促销明细失败"), nil
	}

	var deliveryRow model.OrderDeliveryAddress
	deliveryErr := l.svcCtx.GormDB.WithContext(l.ctx).
		Where("order_id = ? AND is_deleted = ?", orderRow.ID, 0).
		First(&deliveryRow).Error

	var delivery types.OrderDeliveryInput
	hasDelivery := false
	if deliveryErr == nil {
		delivery = types.OrderDeliveryInput{
			ReceiverName:  deliveryRow.ReceiverName,
			ReceiverPhone: deliveryRow.ReceiverPhone,
			ReceiverEmail: deliveryRow.ReceiverEmail,
		}
		hasDelivery = true
	} else if !errors.Is(deliveryErr, gorm.ErrRecordNotFound) {
		l.Errorf("get order delivery failed, orderId=%d, err=%v", orderRow.ID, deliveryErr)
		return customererrors.DatabaseErrorResp("查询收货信息失败"), nil
	}

	respData := types.GetOrderResp{
		Order:      toOrderInfo(orderRow),
		Payment:    toOrderPaymentInfo(&paymentRow),
		Promotions: toPromotionItems(promotionRows),
	}
	if hasDelivery {
		respData.Delivery = delivery
	}
	return customererrors.SuccessData(respData), nil
}
