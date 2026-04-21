package model

import (
	"time"
	"gorm.io/gorm"
)

// Chain_event Chain_event 模型
type Chain_event struct {
	ID int64 `json:"id" gorm:"primaryKey"` // 主键ID
	CreateAt time.Time `json:"createat" gorm:"autoCreateTime"` // 创建时间
	UpdateAt time.Time `json:"updateat" gorm:"autoUpdateTime"` // 更新时间
	IsDeleted bool `json:"isdeleted" gorm:"default:false"` // 软删除标记
	Creator string `json:"creator" gorm:""` // 创建人
	Updator string `json:"updator" gorm:""` // 更新人
	business_type string `json:"business_type" gorm:"required"` // business_type 字段
	business_id int64 `json:"business_id" gorm:"required"` // business_id 字段
	business_code string `json:"business_code" gorm:""` // business_code 字段
	chain_id int `json:"chain_id" gorm:"required"` // chain_id 字段
	contract_address string `json:"contract_address" gorm:"required"` // contract_address 字段
	tx_hash string `json:"tx_hash" gorm:"required"` // tx_hash 字段
	block_number int64 `json:"block_number" gorm:""` // block_number 字段
	tx_index int `json:"tx_index" gorm:""` // tx_index 字段
	log_index int `json:"log_index" gorm:""` // log_index 字段
	event_name string `json:"event_name" gorm:""` // event_name 字段
	event_sig string `json:"event_sig" gorm:""` // event_sig 字段
	event_payload string `json:"event_payload" gorm:""` // event_payload 字段
	raw_log string `json:"raw_log" gorm:""` // raw_log 字段
	event_time time.Time `json:"event_time" gorm:""` // event_time 字段
	confirmations int `json:"confirmations" gorm:""` // confirmations 字段
	process_status int `json:"process_status" gorm:""` // process_status 字段
	retry_count int `json:"retry_count" gorm:""` // retry_count 字段
	error_msg string `json:"error_msg" gorm:""` // error_msg 字段
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// TableName 指定表名
func (Chain_event) TableName() string {
	return "sys_chain_event"
}
