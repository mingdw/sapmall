package model

import (
	"time"
)

// ProductOnChain sys_product_onchain 模型（字段使用驼峰命名）
type ProductOnChain struct {
	ID              int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	CreatedAt       time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt       time.Time `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted       int       `json:"isDeleted" gorm:"column:is_deleted;default:0"`
	Creator         string    `json:"creator" gorm:"column:creator"`
	Updator         string    `json:"updator" gorm:"column:updator"`
	ProductSpuID    int64     `json:"productSpuId" gorm:"column:product_spu_id;not null"`
	ProductSpuCode  string    `json:"productSpuCode" gorm:"column:product_spu_code;not null"`
	ChainID         int       `json:"chainId" gorm:"column:chain_id;not null"`
	ContractAddress string    `json:"contractAddress" gorm:"column:contract_address;not null"`
	OnchainItemID   string    `json:"onchainItemId" gorm:"column:onchain_item_id"`
	MetadataURI     string    `json:"metadataUri" gorm:"column:metadata_uri"`
	MetadataHash    string    `json:"metadataHash" gorm:"column:metadata_hash"`
	Version         int       `json:"version" gorm:"column:version"`
	OnchainStatus   int       `json:"onchainStatus" gorm:"column:onchain_status"`
	LastTxHash      string    `json:"lastTxHash" gorm:"column:last_tx_hash"`
	LastBlockNumber int64     `json:"lastBlockNumber" gorm:"column:last_block_number"`
	LastLogIndex    int       `json:"lastLogIndex" gorm:"column:last_log_index"`
	Confirmations   int       `json:"confirmations" gorm:"column:confirmations"`
	SyncTime        time.Time `json:"syncTime" gorm:"column:sync_time"`
}

// 兼容现有引用（repository 等仍在使用 model.Product_onchain）
type Product_onchain = ProductOnChain

// TableName 指定表名
func (ProductOnChain) TableName() string {
	return "sys_product_onchain"
}
