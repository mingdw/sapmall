package model

import (
	"time"
	"gorm.io/gorm"
)

// Product_onchain Product_onchain 模型
type Product_onchain struct {
	ID int64 `json:"id" gorm:"primaryKey"` // 主键ID
	CreateAt time.Time `json:"createat" gorm:"autoCreateTime"` // 创建时间
	UpdateAt time.Time `json:"updateat" gorm:"autoUpdateTime"` // 更新时间
	IsDeleted bool `json:"isdeleted" gorm:"default:false"` // 软删除标记
	Creator string `json:"creator" gorm:""` // 创建人
	Updator string `json:"updator" gorm:""` // 更新人
	product_spu_id int64 `json:"product_spu_id" gorm:"required"` // product_spu_id 字段
	product_spu_code string `json:"product_spu_code" gorm:"required"` // product_spu_code 字段
	chain_id int `json:"chain_id" gorm:"required"` // chain_id 字段
	contract_address string `json:"contract_address" gorm:"required"` // contract_address 字段
	onchain_item_id string `json:"onchain_item_id" gorm:""` // onchain_item_id 字段
	metadata_uri string `json:"metadata_uri" gorm:""` // metadata_uri 字段
	metadata_hash string `json:"metadata_hash" gorm:""` // metadata_hash 字段
	version int `json:"version" gorm:""` // version 字段
	onchain_status int `json:"onchain_status" gorm:""` // onchain_status 字段
	last_tx_hash string `json:"last_tx_hash" gorm:""` // last_tx_hash 字段
	last_block_number int64 `json:"last_block_number" gorm:""` // last_block_number 字段
	last_log_index int `json:"last_log_index" gorm:""` // last_log_index 字段
	confirmations int `json:"confirmations" gorm:""` // confirmations 字段
	sync_time time.Time `json:"sync_time" gorm:""` // sync_time 字段
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// TableName 指定表名
func (Product_onchain) TableName() string {
	return "sys_product_onchain"
}
