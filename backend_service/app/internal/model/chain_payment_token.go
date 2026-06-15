package model

import (
	"time"
)

// Chain_payment_token 链上支付代币
type Chain_payment_token struct {
	ID              int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	CreateAt        time.Time `json:"createAt" gorm:"column:created_at;autoCreateTime"`
	UpdateAt        time.Time `json:"updateAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted       bool      `json:"isDeleted" gorm:"column:is_deleted;default:false"`
	Creator         string    `json:"creator" gorm:"column:creator"`
	Updator         string    `json:"updator" gorm:"column:updator"`
	ChainId         int       `json:"chainId" gorm:"column:chain_id;required"`
	Symbol          string    `json:"symbol" gorm:"column:symbol;required"`
	DisplayName     string    `json:"displayName" gorm:"column:display_name"`
	ContractAddress string    `json:"contractAddress" gorm:"column:contract_address;required"`
	Decimals        int       `json:"decimals" gorm:"column:decimals"`
	ConfigKey       string    `json:"configKey" gorm:"column:config_key"`
	SyncStatus      int       `json:"syncStatus" gorm:"column:sync_status"`
	LastSyncTxHash  string    `json:"lastSyncTxHash" gorm:"column:last_sync_tx_hash"`
	LastSyncAt      time.Time `json:"lastSyncAt" gorm:"column:last_sync_at"`
	SyncError       string    `json:"syncError" gorm:"column:sync_error"`
	Sort            int       `json:"sort" gorm:"column:sort"`
	Status          int       `json:"status" gorm:"column:status"`
	Remark          string    `json:"remark" gorm:"column:remark"`
}

func (Chain_payment_token) TableName() string {
	return "sys_chain_payment_token"
}
