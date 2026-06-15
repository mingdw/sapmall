package order

const (
	// 订单状态
	orderStatusPendingPay = 10
	orderStatusDescPendingPay = "待支付"

	// 支付状态
	paymentStatusUnpaid = 1
	paymentStatusDescUnpaid = "未支付"

	defaultCurrency     = "USDC"
	defaultTokenSymbol  = "USDC"
	defaultChainID      = int64(5042002) // Arc Testnet
	defaultExpireMins   = 30
	defaultConfirmations = 6

	maxOrderRefBytes = 64
)
