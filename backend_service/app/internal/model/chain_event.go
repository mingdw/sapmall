package model

import (
	"time"
)

// ChainEvent sys_chain_event 模型（字段使用驼峰命名）
type ChainEvent struct {
	ID              int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	CreatedAt       time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt       time.Time `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted       int       `json:"isDeleted" gorm:"column:is_deleted;default:0"`
	Creator         string    `json:"creator" gorm:"column:creator"`
	Updator         string    `json:"updator" gorm:"column:updator"`
	BusinessType    string    `json:"businessType" gorm:"column:business_type;not null"`
	BusinessID      int64     `json:"businessId" gorm:"column:business_id;not null"`
	BusinessCode    string    `json:"businessCode" gorm:"column:business_code"`
	ChainID         int       `json:"chainId" gorm:"column:chain_id;not null"`
	ContractAddress string    `json:"contractAddress" gorm:"column:contract_address;not null"`
	TxHash          string    `json:"txHash" gorm:"column:tx_hash;not null"`
	BlockNumber     int64     `json:"blockNumber" gorm:"column:block_number"`
	TxIndex         int       `json:"txIndex" gorm:"column:tx_index"`
	LogIndex        int       `json:"logIndex" gorm:"column:log_index"`
	EventName       string    `json:"eventName" gorm:"column:event_name"`
	EventSig        string    `json:"eventSig" gorm:"column:event_sig"`
	EventPayload    string    `json:"eventPayload" gorm:"column:event_payload"`
	RawLog          string    `json:"rawLog" gorm:"column:raw_log"`
	EventTime       time.Time `json:"eventTime" gorm:"column:event_time"`
	Confirmations   int       `json:"confirmations" gorm:"column:confirmations"`
	ProcessStatus   int       `json:"processStatus" gorm:"column:process_status"`
	RetryCount      int       `json:"retryCount" gorm:"column:retry_count"`
	ErrorMsg        string    `json:"errorMsg" gorm:"column:error_msg"`
}

// 兼容现有引用（repository 等仍在使用 model.Chain_event）
type Chain_event = ChainEvent

// TableName 指定表名
func (ChainEvent) TableName() string {
	return "sys_chain_event"
}
