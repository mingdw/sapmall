package model

import (
	"time"
)

// OrderPayment 订单链上支付记录
type OrderPayment struct {
	ID                    int64     `json:"id" gorm:"column:id;primaryKey"`
	OrderId               int64     `json:"orderId" gorm:"column:order_id;required"`
	OrderCode             string    `json:"orderCode" gorm:"column:order_code"`
	IntentId              string    `json:"intentId" gorm:"column:intent_id;unique"`
	PayerAddress          string    `json:"payerAddress" gorm:"column:payer_address"`
	ChainId               int64     `json:"chainId" gorm:"column:chain_id"`
	TokenSymbol           string    `json:"tokenSymbol" gorm:"column:token_symbol"`
	TokenAddress          string    `json:"tokenAddress" gorm:"column:token_address"`
	ContractAddress       string    `json:"contractAddress" gorm:"column:contract_address"`
	AmountRaw             string    `json:"amountRaw" gorm:"column:amount_raw"`
	TokenDecimals         int       `json:"tokenDecimals" gorm:"column:token_decimals"`
	PayAmount             float64   `json:"payAmount" gorm:"column:pay_amount"`
	PaymentStatus         int       `json:"paymentStatus" gorm:"column:payment_status"`
	PaymentStatusDesc     string    `json:"paymentStatusDesc" gorm:"column:payment_status_desc"`
	TxHash                string    `json:"txHash" gorm:"column:tx_hash"`
	BlockNumber           int64     `json:"blockNumber" gorm:"column:block_number"`
	Confirmations         int       `json:"confirmations" gorm:"column:confirmations"`
	RequiredConfirmations int       `json:"requiredConfirmations" gorm:"column:required_confirmations"`
	ExpireAt              time.Time `json:"expireAt" gorm:"column:expire_at"`
	PaidAt                time.Time `json:"paidAt" gorm:"column:paid_at"`
	ConfirmedAt           time.Time `json:"confirmedAt" gorm:"column:confirmed_at"`
	FailReason            string    `json:"failReason" gorm:"column:fail_reason"`
	CreatedAt             time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt             time.Time `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted             int       `json:"isDeleted" gorm:"column:is_deleted;default:0"`
	Creator               string    `json:"creator" gorm:"column:creator"`
	Updator               string    `json:"updator" gorm:"column:updator"`
}

func (OrderPayment) TableName() string {
	return "sys_order_payment"
}

// Order_payment 兼容旧引用
type Order_payment = OrderPayment
