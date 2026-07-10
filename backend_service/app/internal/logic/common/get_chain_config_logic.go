// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package common

import (
	"context"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetChainConfigLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取链配置信息（含支持的支付代币，无需授权）
func NewGetChainConfigLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetChainConfigLogic {
	return &GetChainConfigLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetChainConfigLogic) GetChainConfig(req *types.GetChainConfigReq) (resp *types.BaseResp, err error) {
	// 1. 查询所有链网络（含 status=1 仅展示链，供钱包导航下拉；支付侧按 status=0 过滤）
	networkRepo := repository.NewChain_networkRepository(l.svcCtx.GormDB)
	networkList, _, listErr := networkRepo.ListByCondition(l.ctx, "", "", nil, 0, 100)
	if listErr != nil {
		l.Errorf("list chain network failed, err=%v", listErr)
		return customererrors.DatabaseErrorResp("查询链网络配置失败"), nil
	}

	// 2. 收集所有 chainId
	chainIds := make([]int, 0, len(networkList))
	for _, item := range networkList {
		chainIds = append(chainIds, item.ChainId)
	}

	// 3. 批量查询所有启用的支付代币
	tokenRepo := repository.NewChain_payment_tokenRepository(l.svcCtx.GormDB)
	tokenMap, tokenErr := tokenRepo.ListByChainIds(l.ctx, chainIds)
	if tokenErr != nil {
		l.Errorf("list chain payment token failed, err=%v", tokenErr)
		return customererrors.DatabaseErrorResp("查询支付代币配置失败"), nil
	}

	// 4. 组装返回数据
	result := make([]types.CommonChainNetworkInfo, 0, len(networkList))
	for _, item := range networkList {
		tokens := tokenMap[item.ChainId]
		filteredTokens := filterEnabledTokens(tokens)
		result = append(result, toCommonChainNetworkInfo(item, filteredTokens))
	}

	return customererrors.SuccessData(types.GetChainConfigResp{
		List: result,
	}), nil
}

// filterEnabledTokens 过滤出启用的代币 (status=0)
func filterEnabledTokens(tokens []*model.Chain_payment_token) []*model.Chain_payment_token {
	if len(tokens) == 0 {
		return tokens
	}
	result := make([]*model.Chain_payment_token, 0, len(tokens))
	for _, t := range tokens {
		if t.Status == 0 {
			result = append(result, t)
		}
	}
	return result
}

// toCommonChainNetworkInfo 转换为公共链网络信息（不含敏感字段）
func toCommonChainNetworkInfo(item *model.Chain_network, tokens []*model.Chain_payment_token) types.CommonChainNetworkInfo {
	info := types.CommonChainNetworkInfo{
		ChainID:                int64(item.ChainId),
		Code:                   item.Code,
		Name:                   item.Name,
		RpcURL:                 item.RpcUrl,
		ExplorerURL:            item.ExplorerUrl,
		NativeSymbol:           item.NativeSymbol,
		PlatformConfigAddress:  item.PlatformConfigAddress,
		PaymentRouterAddress:   item.PaymentRouterAddress,
		SettlementVaultAddress: item.SettlementVaultAddress,
		SwapRouterAddress:      item.SwapRouterAddress,
		Sort:                   int64(item.Sort),
		Status:                 int64(item.Status),
	}
	if len(tokens) > 0 {
		info.PaymentTokens = toCommonPaymentTokenInfoList(tokens)
	} else {
		info.PaymentTokens = []types.CommonPaymentTokenInfo{}
	}
	return info
}

// toCommonPaymentTokenInfoList 转换为公共支付代币信息列表
func toCommonPaymentTokenInfoList(items []*model.Chain_payment_token) []types.CommonPaymentTokenInfo {
	result := make([]types.CommonPaymentTokenInfo, 0, len(items))
	for _, item := range items {
		result = append(result, types.CommonPaymentTokenInfo{
			Symbol:          item.Symbol,
			DisplayName:     item.DisplayName,
			ContractAddress: item.ContractAddress,
			Decimals:        int64(item.Decimals),
			Sort:            int64(item.Sort),
		})
	}
	return result
}
