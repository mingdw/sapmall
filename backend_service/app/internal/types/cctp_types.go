package types

// CreateCctpIntentReq 创建 CCTP 意图请求
type CreateCctpIntentReq struct {
	SourceChainId int64  `json:"sourceChainId"`
	DestChainId   int64  `json:"destChainId"`
	AmountIn      string `json:"amountIn"`
	// TokenSymbol 可选，默认 USDC
	TokenSymbol string `json:"tokenSymbol,optional"`
	// TokenDecimals 可选，默认 6
	TokenDecimals int64 `json:"tokenDecimals,optional"`
}

// CctpBurnParams depositForBurn V2 参数
type CctpBurnParams struct {
	SourceChainId        int64  `json:"sourceChainId"`
	DestinationDomain    int64  `json:"destinationDomain"`
	TokenMessenger       string `json:"tokenMessenger"`
	Usdc                 string `json:"usdc"`
	Amount               string `json:"amount"`
	MintRecipient        string `json:"mintRecipient"`
	MinFinalityThreshold int64  `json:"minFinalityThreshold"`
	DestinationCaller    string `json:"destinationCaller"`
	// MaxFee Fast Transfer 愿意支付的最大手续费（USDC 最小单位）；过低会导致 Iris insufficient_fee
	MaxFee string `json:"maxFee"`
}

// CreateCctpIntentResp 创建 CCTP 意图响应
type CreateCctpIntentResp struct {
	IntentId      string         `json:"intentId"`
	Status        int64          `json:"status"`
	TokenSymbol   string         `json:"tokenSymbol"`
	TokenDecimals int64          `json:"tokenDecimals"`
	BurnParams    CctpBurnParams `json:"burnParams"`
}

// SubmitCctpBurnReq 提交 burn 交易
type SubmitCctpBurnReq struct {
	IntentId   string `json:"intentId"`
	BurnTxHash string `json:"burnTxHash"`
	// BurnGasFee 源链实际 Gas（原生币 wei 字符串），可选
	BurnGasFee string `json:"burnGasFee,optional"`
}

// SubmitCctpSwapReq 提交 swap 交易
type SubmitCctpSwapReq struct {
	IntentId   string `json:"intentId"`
	SwapTxHash string `json:"swapTxHash"`
	// SwapGasFee 目标链实际 Gas（原生币最小单位），可选
	SwapGasFee string `json:"swapGasFee,optional"`
}

// GetCctpIntentReq 查询意图（path 参数）
type GetCctpIntentReq struct {
	IntentId string `path:"intent_id"`
}

// GetCctpIntentResp 意图详情
type GetCctpIntentResp struct {
	IntentId      string `json:"intentId"`
	UserAddress   string `json:"userAddress"`
	SourceChainId int64  `json:"sourceChainId"`
	DestChainId   int64  `json:"destChainId"`
	SourceDomain  int64  `json:"sourceDomain"`
	DestDomain    int64  `json:"destDomain"`
	TokenSymbol   string `json:"tokenSymbol"`
	TokenDecimals int64  `json:"tokenDecimals"`
	AmountIn      string `json:"amountIn"`
	BurnTxHash    string `json:"burnTxHash,omitempty"`
	BurnGasFee    string `json:"burnGasFee,omitempty"`
	MessageHash   string `json:"messageHash,omitempty"`
	MintTxHash    string `json:"mintTxHash,omitempty"`
	MintGasFee    string `json:"mintGasFee,omitempty"`
	SwapTxHash    string `json:"swapTxHash,omitempty"`
	SwapGasFee    string `json:"swapGasFee,omitempty"`
	Status        int64  `json:"status"`
	StatusDesc    string `json:"statusDesc"`
	ErrorMsg      string `json:"errorMsg,omitempty"`
	CompletedAt   string `json:"completedAt,omitempty"`
	CreatedAt     string `json:"createdAt,omitempty"`
	UpdatedAt     string `json:"updatedAt,omitempty"`
}
