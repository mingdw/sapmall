package model

import (
	"time"
)

// Chain_network 区块链网络配置
type Chain_network struct {
	ID        int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	CreateAt  time.Time `json:"createAt" gorm:"column:created_at;autoCreateTime"`
	UpdateAt  time.Time `json:"updateAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted bool      `json:"isDeleted" gorm:"column:is_deleted;default:false"`
	Creator   string    `json:"creator" gorm:"column:creator"`
	Updator   string    `json:"updator" gorm:"column:updator"`

	// 基础链信息
	ProjectID      string `json:"projectId" gorm:"column:project_id"`
	ChainId        int    `json:"chainId" gorm:"column:chain_id;required"`
	Code           string `json:"code" gorm:"column:code;unique"`
	Name           string `json:"name" gorm:"column:name;required"`
	RpcUrl         string `json:"rpcUrl" gorm:"column:rpc_url"`
	WsUrl          string `json:"wsUrl" gorm:"column:ws_url"`
	ExplorerUrl    string `json:"explorerUrl" gorm:"column:explorer_url"`
	NativeSymbol   string `json:"nativeSymbol" gorm:"column:native_symbol"`
	BlockTime      int    `json:"blockTime" gorm:"column:block_time"`
	SafeConfirmations int `json:"safeConfirmations" gorm:"column:safe_confirmations"`

	// 合约地址
	PlatformConfigAddress  string `json:"platformConfigAddress" gorm:"column:platform_config_address"`
	PaymentRouterAddress   string `json:"paymentRouterAddress" gorm:"column:payment_router_address"`
	SettlementVaultAddress string `json:"settlementVaultAddress" gorm:"column:settlement_vault_address"`
	SwapRouterAddress      string `json:"swapRouterAddress" gorm:"column:swap_router_address"`
	SignerKeyRef           string `json:"signerKeyRef" gorm:"column:signer_key_ref"`

	// Swap 监听器配置
	SwapListenerEnabled      int   `json:"swapListenerEnabled" gorm:"column:swap_listener_enabled"`
	SwapListenerPollInterval int   `json:"swapListenerPollInterval" gorm:"column:swap_listener_poll_interval"`
	SwapListenerStartBlock   int64 `json:"swapListenerStartBlock" gorm:"column:swap_listener_start_block"`
	SwapListenerLastBlock    int64 `json:"swapListenerLastBlock" gorm:"column:swap_listener_last_block"`

	// Config 监听器配置
	ConfigListenerEnabled      int   `json:"configListenerEnabled" gorm:"column:config_listener_enabled"`
	ConfigListenerPollInterval int   `json:"configListenerPollInterval" gorm:"column:config_listener_poll_interval"`
	ConfigListenerStartBlock   int64 `json:"configListenerStartBlock" gorm:"column:config_listener_start_block"`
	ConfigListenerLastBlock    int64 `json:"configListenerLastBlock" gorm:"column:config_listener_last_block"`

	// Payment 监听器配置
	PaymentListenerEnabled      int   `json:"paymentListenerEnabled" gorm:"column:payment_listener_enabled"`
	PaymentListenerPollInterval int   `json:"paymentListenerPollInterval" gorm:"column:payment_listener_poll_interval"`
	PaymentListenerStartBlock   int64 `json:"paymentListenerStartBlock" gorm:"column:payment_listener_start_block"`
	PaymentListenerLastBlock    int64 `json:"paymentListenerLastBlock" gorm:"column:payment_listener_last_block"`

	// 其他配置
	Sort   int    `json:"sort" gorm:"column:sort"`
	Status int    `json:"status" gorm:"column:status"`
	Remark string `json:"remark" gorm:"column:remark"`
}

func (Chain_network) TableName() string {
	return "sys_chain_network"
}

// GetSwapPollInterval 获取 Swap 监听器轮询间隔，如果未配置则使用 block_time
func (n *Chain_network) GetSwapPollInterval() int {
	if n.SwapListenerPollInterval > 0 {
		return n.SwapListenerPollInterval
	}
	return n.BlockTime
}

// GetConfigPollInterval 获取 Config 监听器轮询间隔，如果未配置则使用 block_time
func (n *Chain_network) GetConfigPollInterval() int {
	if n.ConfigListenerPollInterval > 0 {
		return n.ConfigListenerPollInterval
	}
	return n.BlockTime
}

// GetPaymentPollInterval 获取 Payment 监听器轮询间隔，如果未配置则使用 block_time
func (n *Chain_network) GetPaymentPollInterval() int {
	if n.PaymentListenerPollInterval > 0 {
		return n.PaymentListenerPollInterval
	}
	return n.BlockTime
}
