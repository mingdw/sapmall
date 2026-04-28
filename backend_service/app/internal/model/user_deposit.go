package model

import (
	"time"
)

// UserDeposit UserDeposit 模型
type UserDeposit struct {
	ID                int64     `json:"id" gorm:"column:id;primaryKey"`                      // 主键ID
	CreateAt          time.Time `json:"createAt" gorm:"column:create_at;autoCreateTime"`     // 创建时间
	UpdateAt          time.Time `json:"updateAt" gorm:"column:update_at;autoUpdateTime"`     // 更新时间
	IsDeleted         bool      `json:"isDeleted" gorm:"column:is_deleted;default:false"`    // 软删除标记
	Creator           string    `json:"creator" gorm:"column:creator"`                       // 创建人
	Updator           string    `json:"updator" gorm:"column:updator"`                       // 更新人
	IntentId          string    `json:"intentId" gorm:"column:intent_id;unique"`             // IntentId 字段
	UserId            int64     `json:"userId" gorm:"column:user_id;required"`               // UserId 字段
	UserCode          string    `json:"userCode" gorm:"column:user_code"`                    // UserCode 字段
	BusinessType      string    `json:"businessType" gorm:"column:business_type"`            // BusinessType 字段
	DepositStatus     int       `json:"depositStatus" gorm:"column:deposit_status;required"` // DepositStatus 字段
	DepositStatusDesc string    `json:"depositStatusDesc" gorm:"column:deposit_status_desc"` // DepositStatusDesc 字段
	Amount            string    `json:"amount" gorm:"column:amount"`                         // Amount 字段
	TokenSymbol       string    `json:"tokenSymbol" gorm:"column:token_symbol"`              // TokenSymbol 字段
	TokenAddress      string    `json:"tokenAddress" gorm:"column:token_address"`            // TokenAddress 字段
	ChainId           int       `json:"chainId" gorm:"column:chain_id"`                      // ChainId 字段
	ContractAddress   string    `json:"contractAddress" gorm:"column:contract_address"`      // ContractAddress 字段
	TxHash            string    `json:"txHash" gorm:"column:tx_hash"`                        // TxHash 字段
	BlockNumber       int64     `json:"blockNumber" gorm:"column:block_number"`              // BlockNumber 字段
	Confirmations     int       `json:"confirmations" gorm:"column:confirmations"`           // Confirmations 字段
	RefundTxHash      string    `json:"refundTxHash" gorm:"column:refund_tx_hash"`           // RefundTxHash 字段
	ExpireAt          time.Time `json:"expireAt" gorm:"column:expire_at"`                    // ExpireAt 字段
	PaidAt            time.Time `json:"paidAt" gorm:"column:paid_at"`                        // PaidAt 字段
	ConfirmedAt       time.Time `json:"confirmedAt" gorm:"column:confirmed_at"`              // ConfirmedAt 字段
	RefundedAt        time.Time `json:"refundedAt" gorm:"column:refunded_at"`                // RefundedAt 字段
	FailReason        string    `json:"failReason" gorm:"column:fail_reason"`                // FailReason 字段
	Remark            string    `json:"remark" gorm:"column:remark"`                         // Remark 字段
}

// TableName 指定表名
func (UserDeposit) TableName() string {
	return "sys_user_deposit"
}
