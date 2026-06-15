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

type ListChainNetworkLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 查询区块链网络配置列表（含各链支付代币）。请求：ListChainNetworkReq；响应 Data：ListChainNetworkResp { list: ChainNetworkInfo[], total }，每条 ChainNetworkInfo 含 paymentTokens
func NewListChainNetworkLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListChainNetworkLogic {
	return &ListChainNetworkLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListChainNetworkLogic) ListChainNetwork(req *types.ListChainNetworkReq) (resp *types.BaseResp, err error) {
	_, pageSize, offset := normalizeChainPage(req.Page, req.PageSize)

	var statusPtr *int64
	if req.Status != 0 {
		status := req.Status
		statusPtr = &status
	}

	networkRepo := repository.NewChain_networkRepository(l.svcCtx.GormDB)
	networkList, total, listErr := networkRepo.ListByCondition(
		l.ctx,
		strings.TrimSpace(req.Code),
		strings.TrimSpace(req.Name),
		statusPtr,
		offset,
		int(pageSize),
	)
	if listErr != nil {
		l.Errorf("list chain network failed, err=%v", listErr)
		return customererrors.DatabaseErrorResp("查询链网络配置失败"), nil
	}

	chainIds := make([]int, 0, len(networkList))
	for _, item := range networkList {
		chainIds = append(chainIds, item.ChainId)
	}

	tokenRepo := repository.NewChain_payment_tokenRepository(l.svcCtx.GormDB)
	tokenMap, tokenErr := tokenRepo.ListByChainIds(l.ctx, chainIds)
	if tokenErr != nil {
		l.Errorf("list chain payment token by chain ids failed, err=%v", tokenErr)
		return customererrors.DatabaseErrorResp("查询链上支付代币失败"), nil
	}

	result := make([]types.ChainNetworkInfo, 0, len(networkList))
	for _, item := range networkList {
		result = append(result, toChainNetworkInfo(item, tokenMap[item.ChainId]))
	}

	return customererrors.SuccessData(types.ListChainNetworkResp{
		List:  result,
		Total: total,
	}), nil
}
