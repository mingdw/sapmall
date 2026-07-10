package order

import (
	"strings"
	"time"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/types"
)

func normalizeOrderPage(page, pageSize int64) (int64, int64, int) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 20
	}
	if pageSize > 200 {
		pageSize = 200
	}
	return page, pageSize, int((page - 1) * pageSize)
}

func parseOptionalDate(value string, endOfDay bool) (*time.Time, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil, nil
	}
	layouts := []string{
		time.RFC3339,
		"2006-01-02 15:04:05",
		"2006-01-02",
	}
	var parsed time.Time
	var err error
	for _, layout := range layouts {
		parsed, err = time.ParseInLocation(layout, value, time.Local)
		if err == nil {
			if layout == "2006-01-02" && endOfDay {
				end := parsed.Add(24*time.Hour - time.Nanosecond)
				return &end, nil
			}
			return &parsed, nil
		}
	}
	return nil, err
}

func toAdminOrderSummary(o *model.Order, payment *model.OrderPayment, chainName string) types.AdminOrderSummary {
	item := types.AdminOrderSummary{
		Id:                o.ID,
		OrderCode:         o.OrderCode,
		UserId:            o.UserId,
		UserCode:          o.UserCode,
		ProductName:       o.ProductName,
		ProductQuantity:   int64(o.ProductQuantity),
		SkuImgs:           o.SkuImgs,
		TotalAmount:       o.TotalAmount,
		PayAmount:         o.PayAmount,
		RealAmount:        o.RealAmount,
		Currency:          o.Currency,
		SettleCurrency:    o.SettleCurrency,
		PlatformFeeAmount: o.PlatformFeeAmount,
		ActGasFee:         o.ActGasFee,
		OrderStatus:       int64(o.OrderStatus),
		OrderStatusDesc:   o.OrderStatusDesc,
		PaymentStatus:     int64(o.PaymentStatus),
		PaymentStatusDesc: o.PaymentStatusDesc,
		OrderDate:         FormatTimeRFC3339(o.OrderDate),
		ExpireAt:          FormatTimeRFC3339(o.ExpireAt),
		CreatedAt:         FormatTimeRFC3339(o.CreatedAt),
	}
	if payment != nil {
		item.PayerAddress = payment.PayerAddress
		item.ChainId = payment.ChainId
		item.TokenSymbol = payment.TokenSymbol
		if !payment.ConfirmedAt.IsZero() {
			item.ConfirmedAt = FormatTimeRFC3339(payment.ConfirmedAt)
		}
		// 如果主表 settle_currency 为空，用 payment.token_symbol 兜底
		if item.SettleCurrency == "" {
			item.SettleCurrency = payment.TokenSymbol
		}
	}
	if chainName != "" {
		item.ChainName = chainName
	}
	return item
}
