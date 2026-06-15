// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"strings"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ListChainPaymentTokenLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 查询链上支付代币列表（按需刷新/独立查询）。请求：ListChainPaymentTokenReq；响应 Data：ListChainPaymentTokenResp { list, total }
func NewListChainPaymentTokenLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListChainPaymentTokenLogic {
	return &ListChainPaymentTokenLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListChainPaymentTokenLogic) ListChainPaymentToken(req *types.ListChainPaymentTokenReq) (resp *types.BaseResp, err error) {
	_, pageSize, offset := normalizeChainPage(req.Page, req.PageSize)

	var chainIdPtr *int64
	if req.ChainID > 0 {
		chainId := req.ChainID
		chainIdPtr = &chainId
	}

	var statusPtr *int64
	if req.Status != 0 {
		status := req.Status
		statusPtr = &status
	}

	var syncStatusPtr *int64
	if req.SyncStatus != 0 {
		syncStatus := req.SyncStatus
		syncStatusPtr = &syncStatus
	}

	tokenRepo := repository.NewChain_payment_tokenRepository(l.svcCtx.GormDB)
	tokenList, total, listErr := tokenRepo.ListByCondition(
		l.ctx,
		chainIdPtr,
		strings.TrimSpace(req.Symbol),
		statusPtr,
		syncStatusPtr,
		offset,
		int(pageSize),
	)
	if listErr != nil {
		l.Errorf("list chain payment token failed, err=%v", listErr)
		return customererrors.DatabaseErrorResp("查询链上支付代币失败"), nil
	}

	result := toChainPaymentTokenInfoList(tokenList)
	return customererrors.SuccessData(types.ListChainPaymentTokenResp{
		List:  result,
		Total: total,
	}), nil
}
