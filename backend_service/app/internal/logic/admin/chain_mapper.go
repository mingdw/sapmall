package admin

import (
	"time"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/types"
)

func formatChainTime(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	return t.Format(time.DateTime)
}

func toChainPaymentTokenInfo(item *model.Chain_payment_token) types.ChainPaymentTokenInfo {
	if item == nil {
		return types.ChainPaymentTokenInfo{}
	}
	return types.ChainPaymentTokenInfo{
		ID:              item.ID,
		ChainID:         int64(item.ChainId),
		Symbol:          item.Symbol,
		DisplayName:     item.DisplayName,
		ContractAddress: item.ContractAddress,
		Decimals:        int64(item.Decimals),
		ConfigKey:       item.ConfigKey,
		SyncStatus:      int64(item.SyncStatus),
		LastSyncTxHash:  item.LastSyncTxHash,
		LastSyncAt:      formatChainTime(item.LastSyncAt),
		SyncError:       item.SyncError,
		Sort:            int64(item.Sort),
		Status:          int64(item.Status),
		Remark:          item.Remark,
		CreatedAt:       formatChainTime(item.CreateAt),
		UpdatedAt:       formatChainTime(item.UpdateAt),
		Creator:         item.Creator,
		Updator:         item.Updator,
	}
}

func toChainPaymentTokenInfoList(items []*model.Chain_payment_token) []types.ChainPaymentTokenInfo {
	result := make([]types.ChainPaymentTokenInfo, 0, len(items))
	for _, item := range items {
		result = append(result, toChainPaymentTokenInfo(item))
	}
	return result
}

func toChainNetworkInfo(item *model.Chain_network, tokens []*model.Chain_payment_token) types.ChainNetworkInfo {
	info := types.ChainNetworkInfo{
		ID:                     item.ID,
		ProjectID:              item.ProjectID,
		ChainID:                int64(item.ChainId),
		Code:                   item.Code,
		Name:                   item.Name,
		RpcURL:                 item.RpcUrl,
		WsURL:                  item.WsUrl,
		ExplorerURL:            item.ExplorerUrl,
		NativeSymbol:           item.NativeSymbol,
		BlockTime:              int64(item.BlockTime),
		SafeConfirmations:      int64(item.SafeConfirmations),
		PlatformConfigAddress:  item.PlatformConfigAddress,
		PaymentRouterAddress:   item.PaymentRouterAddress,
		SettlementVaultAddress: item.SettlementVaultAddress,
		SwapRouterAddress:      item.SwapRouterAddress,
		SignerKeyRef:           item.SignerKeyRef,
		// Swap 监听器配置
		SwapListenerEnabled:      int64(item.SwapListenerEnabled),
		SwapListenerPollInterval: int64(item.SwapListenerPollInterval),
		SwapListenerStartBlock:   item.SwapListenerStartBlock,
		SwapListenerLastBlock:    item.SwapListenerLastBlock,
		// Config 监听器配置
		ConfigListenerEnabled:      int64(item.ConfigListenerEnabled),
		ConfigListenerPollInterval: int64(item.ConfigListenerPollInterval),
		ConfigListenerStartBlock:   item.ConfigListenerStartBlock,
		ConfigListenerLastBlock:    item.ConfigListenerLastBlock,
		// Payment 监听器配置
		PaymentListenerEnabled:      int64(item.PaymentListenerEnabled),
		PaymentListenerPollInterval: int64(item.PaymentListenerPollInterval),
		PaymentListenerStartBlock:   item.PaymentListenerStartBlock,
		PaymentListenerLastBlock:    item.PaymentListenerLastBlock,
		// 其他
		Sort:      int64(item.Sort),
		Status:    int64(item.Status),
		Remark:    item.Remark,
		CreatedAt: formatChainTime(item.CreateAt),
		UpdatedAt: formatChainTime(item.UpdateAt),
		Creator:   item.Creator,
		Updator:   item.Updator,
	}
	if len(tokens) > 0 {
		info.PaymentTokens = toChainPaymentTokenInfoList(tokens)
	} else {
		info.PaymentTokens = []types.ChainPaymentTokenInfo{}
	}
	return info
}

func normalizeChainPage(page, pageSize int64) (int64, int64, int) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 20
	}
	if pageSize > 200 {
		pageSize = 200
	}
	return page, pageSize, int((page - 1) * pageSize)
}
