package model

import (
	"time"
)

// Order 商城订单主表（含商品快照，Phase 1 单 SKU）
type Order struct {
	ID                      int64     `json:"id" gorm:"column:id;primaryKey"`
	OrderCode               string    `json:"orderCode" gorm:"column:order_code;unique"`
	UserId                  int64     `json:"userId" gorm:"column:user_id;required"`
	UserCode                string    `json:"userCode" gorm:"column:user_code"`
	SpuId                   int64     `json:"spuId" gorm:"column:spu_id"`
	SpuCode                 string    `json:"spuCode" gorm:"column:spu_code"`
	SkuId                   int64     `json:"skuId" gorm:"column:sku_id"`
	SkuCode                 string    `json:"skuCode" gorm:"column:sku_code"`
	SkuImgs                 string    `json:"skuImgs" gorm:"column:sku_imgs"`
	ProductName             string    `json:"productName" gorm:"column:product_name"`
	ProductPrice            float64   `json:"productPrice" gorm:"column:product_price"`
	ProductQuantity         int       `json:"productQuantity" gorm:"column:product_quantity"`
	TotalAmount             float64   `json:"totalAmount" gorm:"column:total_amount"`
	ProductRemark           string    `json:"productRemark" gorm:"column:product_remark"`
	OrderStatus             int       `json:"orderStatus" gorm:"column:order_status"`
	OrderStatusDesc         string    `json:"orderStatusDesc" gorm:"column:order_status_desc"`
	PaymentStatus           int       `json:"paymentStatus" gorm:"column:payment_status"`
	PaymentStatusDesc       string    `json:"paymentStatusDesc" gorm:"column:payment_status_desc"`
	OrderDate               time.Time `json:"orderDate" gorm:"column:order_date"`
	Currency       string  `json:"currency" gorm:"column:currency"`
	SettleCurrency string  `json:"settleCurrency" gorm:"column:settle_currency"`
	DiscountAmount float64 `json:"discountAmount" gorm:"column:discount_amount"`
	PayableAmount           float64   `json:"payableAmount" gorm:"column:payable_amount"`
	PlatformFeeAmount       float64   `json:"platformFeeAmount" gorm:"column:platform_fee_amount"`
	EstGasFee               float64   `json:"estGasFee" gorm:"column:est_gas_fee"`
	ActGasFee               float64   `json:"actGasFee" gorm:"column:act_gas_fee"`
	PayAmount               float64   `json:"payAmount" gorm:"column:pay_amount"`
	RealAmount              float64   `json:"realAmount" gorm:"column:real_amount"`
	OrderRemark             string    `json:"orderRemark" gorm:"column:order_remark"`
	ExpireAt                time.Time `json:"expireAt" gorm:"column:expire_at"`
	CreatedAt               time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt               time.Time `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted               int       `json:"isDeleted" gorm:"column:is_deleted;default:0"`
	Creator                 string    `json:"creator" gorm:"column:creator"`
	Updator                 string    `json:"updator" gorm:"column:updator"`
}

func (Order) TableName() string {
	return "sys_order"
}
