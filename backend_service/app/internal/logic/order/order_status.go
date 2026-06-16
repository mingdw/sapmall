package order

// 订单主状态
const (
	OrderStatusPendingPay        = 10
	OrderStatusOnChainConfirming = 20
	OrderStatusPaid              = 30
	OrderStatusToShip            = 40
	OrderStatusShipped           = 50
	OrderStatusCompleted         = 60
	OrderStatusCancelled         = 70
	OrderStatusExpired           = 80
	OrderStatusPayFailed         = 90
)

// 支付状态
const (
	PaymentStatusUnpaid     = 1 //未支付
	PaymentStatusConfirming = 2 //链上确认中
	PaymentStatusPaid       = 3 //已支付
	PaymentStatusClosed     = 4 //已关闭
)

func OrderStatusDesc(status int) string {
	switch status {
	case OrderStatusPendingPay:
		return "待支付"
	case OrderStatusOnChainConfirming:
		return "链上确认中"
	case OrderStatusPaid:
		return "已支付"
	case OrderStatusToShip:
		return "待发货"
	case OrderStatusShipped:
		return "已发货"
	case OrderStatusCompleted:
		return "已完成"
	case OrderStatusCancelled:
		return "已取消"
	case OrderStatusExpired:
		return "已过期"
	case OrderStatusPayFailed:
		return "支付失败"
	default:
		return "未知"
	}
}

func PaymentStatusDesc(status int) string {
	switch status {
	case PaymentStatusUnpaid:
		return "未支付"
	case PaymentStatusConfirming:
		return "链上确认中"
	case PaymentStatusPaid:
		return "已支付"
	case PaymentStatusClosed:
		return "已关闭"
	default:
		return "未知"
	}
}
