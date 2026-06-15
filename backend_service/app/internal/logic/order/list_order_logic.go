// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package order

import (
	"context"
	"errors"
	"strings"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type ListOrderLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 订单列表查询。请求：ListOrderReq；响应 Data：ListOrderResp { list, total }
func NewListOrderLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListOrderLogic {
	return &ListOrderLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListOrderLogic) ListOrder(req *types.ListOrderReq) (resp *types.BaseResp, err error) {
	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		if errors.Is(authErr, user.ErrUserNotLoggedIn) || errors.Is(authErr, user.ErrUserNotFound) {
			return customererrors.AuthFailedResp("请先登录"), nil
		}
		return customererrors.AuthFailedResp("获取用户信息失败"), nil
	}

	_, pageSize, offset := normalizeOrderPage(req.Page, req.PageSize)

	startAt, startErr := parseOptionalDate(req.OrderDateStart, false)
	if startErr != nil {
		return customererrors.ParamErrorResp("下单开始时间格式无效"), nil
	}
	endAt, endErr := parseOptionalDate(req.OrderDateEnd, true)
	if endErr != nil {
		return customererrors.ParamErrorResp("下单结束时间格式无效"), nil
	}

	userID := userInfo.ID
	filter := repository.OrderListFilter{
		OrderCode:      strings.TrimSpace(req.OrderCode),
		UserId:         &userID,
		OrderDateStart: startAt,
		OrderDateEnd:   endAt,
	}
	if req.OrderStatus != 0 {
		status := int(req.OrderStatus)
		filter.OrderStatus = &status
	}
	if req.PaymentStatus != 0 {
		status := int(req.PaymentStatus)
		filter.PaymentStatus = &status
	}

	orderRepo := repository.NewOrderRepository(l.svcCtx.GormDB)
	orderList, total, listErr := orderRepo.ListByCondition(l.ctx, filter, offset, int(pageSize))
	if listErr != nil {
		l.Errorf("list order failed, err=%v", listErr)
		return customererrors.DatabaseErrorResp("查询订单列表失败"), nil
	}

	orderIDs := make([]int64, 0, len(orderList))
	for _, item := range orderList {
		orderIDs = append(orderIDs, item.ID)
	}

	paymentRepo := repository.NewOrderPaymentRepository(l.svcCtx.GormDB)
	paymentMap, paymentErr := paymentRepo.ListByOrderIDs(l.ctx, orderIDs)
	if paymentErr != nil {
		l.Errorf("list order payment failed, err=%v", paymentErr)
		return customererrors.DatabaseErrorResp("查询订单支付信息失败"), nil
	}

	result := make([]types.AdminOrderSummary, 0, len(orderList))
	for _, item := range orderList {
		result = append(result, toAdminOrderSummary(item, paymentMap[item.ID]))
	}

	return customererrors.SuccessData(types.ListOrderResp{
		List:  result,
		Total: total,
	}), nil
}
