package model

import (
	"time"
)

// Chain_network 区块链网络配置
type Chain_network struct {
	ID                     int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	CreateAt               time.Time `json:"createAt" gorm:"column:created_at;autoCreateTime"`
	UpdateAt               time.Time `json:"updateAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted              bool      `json:"isDeleted" gorm:"column:is_deleted;default:false"`
	Creator                string    `json:"creator" gorm:"column:creator"`
	Updator                string    `json:"updator" gorm:"column:updator"`
	ChainId                int       `json:"chainId" gorm:"column:chain_id;required"`
	Code                   string    `json:"code" gorm:"column:code;unique"`
	Name                   string    `json:"name" gorm:"column:name;required"`
	RpcUrl                 string    `json:"rpcUrl" gorm:"column:rpc_url"`
	WsUrl                  string    `json:"wsUrl" gorm:"column:ws_url"`
	ExplorerUrl            string    `json:"explorerUrl" gorm:"column:explorer_url"`
	NativeSymbol           string    `json:"nativeSymbol" gorm:"column:native_symbol"`
	PlatformConfigAddress  string    `json:"platformConfigAddress" gorm:"column:platform_config_address"`
	PaymentRouterAddress   string    `json:"paymentRouterAddress" gorm:"column:payment_router_address"`
	SettlementVaultAddress string    `json:"settlementVaultAddress" gorm:"column:settlement_vault_address"`
	SignerKeyRef           string    `json:"signerKeyRef" gorm:"column:signer_key_ref"`
	ListenerEnabled        int       `json:"listenerEnabled" gorm:"column:listener_enabled"`
	ListenerStartBlock     int64     `json:"listenerStartBlock" gorm:"column:listener_start_block"`
	ListenerLastBlock      int64     `json:"listenerLastBlock" gorm:"column:listener_last_block"`
	Sort                   int       `json:"sort" gorm:"column:sort"`
	Status                 int       `json:"status" gorm:"column:status"`
	Remark                 string    `json:"remark" gorm:"column:remark"`
}

func (Chain_network) TableName() string {
	return "sys_chain_network"
}
