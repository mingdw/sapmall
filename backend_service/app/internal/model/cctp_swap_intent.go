package model

import "time"

// CctpSwapIntentStatus CCTP 意图状态
const (
	CctpStatusCreated  int8 = 0
	CctpStatusBurned   int8 = 1
	CctpStatusAttested int8 = 2
	CctpStatusMinted   int8 = 3
	CctpStatusSwapped  int8 = 4
	CctpStatusFailed   int8 = 5
)

// CctpSwapIntent CCTP 跨链兑换意图
type CctpSwapIntent struct {
	ID            int64      `json:"id" gorm:"column:id;primaryKey"`
	IntentID      string     `json:"intentId" gorm:"column:intent_id;uniqueIndex"`
	UserAddress   string     `json:"userAddress" gorm:"column:user_address"`
	SourceChainID int        `json:"sourceChainId" gorm:"column:source_chain_id"`
	DestChainID   int        `json:"destChainId" gorm:"column:dest_chain_id"`
	SourceDomain  int        `json:"sourceDomain" gorm:"column:source_domain"`
	DestDomain    int        `json:"destDomain" gorm:"column:dest_domain"`
	TokenSymbol   string     `json:"tokenSymbol" gorm:"column:token_symbol"`
	TokenDecimals int        `json:"tokenDecimals" gorm:"column:token_decimals"`
	AmountIn      string     `json:"amountIn" gorm:"column:amount_in"`
	BurnTxHash    string     `json:"burnTxHash" gorm:"column:burn_tx_hash"`
	BurnGasFee    string     `json:"burnGasFee" gorm:"column:burn_gas_fee"`
	MessageBytes  string     `json:"messageBytes" gorm:"column:message_bytes;type:text"`
	MessageHash   string     `json:"messageHash" gorm:"column:message_hash"`
	Attestation   string     `json:"attestation" gorm:"column:attestation;type:text"`
	MintTxHash    string     `json:"mintTxHash" gorm:"column:mint_tx_hash"`
	MintGasFee    string     `json:"mintGasFee" gorm:"column:mint_gas_fee"`
	SwapTxHash    string     `json:"swapTxHash" gorm:"column:swap_tx_hash"`
	SwapGasFee    string     `json:"swapGasFee" gorm:"column:swap_gas_fee"`
	Status        int8       `json:"status" gorm:"column:status"`
	ErrorMsg      string     `json:"errorMsg" gorm:"column:error_msg"`
	CompletedAt   *time.Time `json:"completedAt" gorm:"column:completed_at"`
	CreatedAt     time.Time  `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt     time.Time  `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted     int        `json:"isDeleted" gorm:"column:is_deleted;default:0"`
}

func (CctpSwapIntent) TableName() string {
	return "sys_cctp_swap_intent"
}
