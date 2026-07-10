package order

import (
	"time"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/types"
)

func FormatTimeRFC3339(t time.Time) string {
	return formatTimeRFC3339(t)
}

func formatTimeRFC3339(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	return t.UTC().Format(time.RFC3339)
}

func toOrderInfo(o *model.Order) types.OrderInfo {
	return MapOrderInfo(o)
}

func MapOrderInfo(o *model.Order) types.OrderInfo {
	return types.OrderInfo{
		OrderCode:               o.OrderCode,
		SpuId:                   o.SpuId,
		SpuCode:                 o.SpuCode,
		SkuId:                   o.SkuId,
		SkuCode:                 o.SkuCode,
		SkuImgs:                 o.SkuImgs,
		ProductName:             o.ProductName,
		ProductPrice:            o.ProductPrice,
		ProductQuantity:         int64(o.ProductQuantity),
		TotalAmount:             o.TotalAmount,
		ProductRemark:           o.ProductRemark,
		OrderStatus:             int64(o.OrderStatus),
		OrderStatusDesc:         o.OrderStatusDesc,
		PaymentStatus:           int64(o.PaymentStatus),
		PaymentStatusDesc:       o.PaymentStatusDesc,
		OrderDate:               formatTimeRFC3339(o.OrderDate),
		Currency:          o.Currency,
		SettleCurrency:    o.SettleCurrency,
		DiscountAmount:    o.DiscountAmount,
		PayableAmount:     o.PayableAmount,
		PlatformFeeAmount:       o.PlatformFeeAmount,
		EstGasFee:               o.EstGasFee,
		ActGasFee:               o.ActGasFee,
		PayAmount:               o.PayAmount,
		RealAmount:              o.RealAmount,
		OrderRemark:             o.OrderRemark,
		ExpireAt:                formatTimeRFC3339(o.ExpireAt),
	}
}

func toOrderPaymentInfo(p *model.OrderPayment, sellerAddress string) types.OrderPaymentInfo {
	return MapOrderPaymentInfo(p, sellerAddress)
}

func MapOrderPaymentInfo(p *model.OrderPayment, sellerAddress string) types.OrderPaymentInfo {
	return types.OrderPaymentInfo{
		IntentId:              p.IntentId,
		OrderCode:             p.OrderCode,
		PayerAddress:          p.PayerAddress,
		ChainId:               p.ChainId,
		TokenSymbol:           p.TokenSymbol,
		TokenAddress:          p.TokenAddress,
		ContractAddress:       p.ContractAddress,
		AmountRaw:             p.AmountRaw,
		TokenDecimals:         int64(p.TokenDecimals),
		PayAmount:             p.PayAmount,
		EstGasFee:             p.EstGasFee,
		ActGasFee:             p.ActGasFee,
		PaymentStatus:         int64(p.PaymentStatus),
		PaymentStatusDesc:     p.PaymentStatusDesc,
		TxHash:                p.TxHash,
		BlockNumber:           p.BlockNumber,
		Confirmations:         int64(p.Confirmations),
		RequiredConfirmations: int64(p.RequiredConfirmations),
		ExpireAt:              formatTimeRFC3339(p.ExpireAt),
		PaidAt:                formatTimeRFC3339(p.PaidAt),
		ConfirmedAt:           formatTimeRFC3339(p.ConfirmedAt),
		FailReason:            p.FailReason,
		SellerAddress:         sellerAddress,
	}
}

func toPromotionItems(list []model.OrderPromotion) []types.OrderPromotionItem {
	return MapPromotionItems(list)
}

func MapPromotionItems(list []model.OrderPromotion) []types.OrderPromotionItem {
	if len(list) == 0 {
		return nil
	}
	out := make([]types.OrderPromotionItem, 0, len(list))
	for _, item := range list {
		out = append(out, types.OrderPromotionItem{
			PromoId:  item.PromoId,
			LabelKey: item.LabelKey,
			Label:    item.Label,
			Amount:   item.Amount,
		})
	}
	return out
}

func toPromotionItemsFromReq(list []types.OrderPromotionItem) []types.OrderPromotionItem {
	if len(list) == 0 {
		return nil
	}
	out := make([]types.OrderPromotionItem, len(list))
	copy(out, list)
	return out
}
