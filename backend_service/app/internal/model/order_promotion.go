package model

import "time"

// OrderPromotion 订单促销明细
type OrderPromotion struct {
	ID        int64     `json:"id" gorm:"column:id;primaryKey"`
	OrderId   int64     `json:"orderId" gorm:"column:order_id"`
	OrderCode string    `json:"orderCode" gorm:"column:order_code"`
	PromoId   string    `json:"promoId" gorm:"column:promo_id"`
	LabelKey  string    `json:"labelKey" gorm:"column:label_key"`
	Label     string    `json:"label" gorm:"column:label"`
	Amount    float64   `json:"amount" gorm:"column:amount"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted int       `json:"isDeleted" gorm:"column:is_deleted;default:0"`
	Creator   string    `json:"creator" gorm:"column:creator"`
	Updator   string    `json:"updator" gorm:"column:updator"`
}

func (OrderPromotion) TableName() string {
	return "sys_order_promotion"
}
