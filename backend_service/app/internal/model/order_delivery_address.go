package model

import "time"

// OrderDeliveryAddress 订单收货/联系信息
type OrderDeliveryAddress struct {
	ID            int64     `json:"id" gorm:"column:id;primaryKey"`
	OrderId       int64     `json:"orderId" gorm:"column:order_id"`
	OrderCode     string    `json:"orderCode" gorm:"column:order_code"`
	UserId        int64     `json:"userId" gorm:"column:user_id"`
	UserCode      string    `json:"userCode" gorm:"column:user_code"`
	ReceiverName  string    `json:"receiverName" gorm:"column:receiver_name"`
	ReceiverPhone string    `json:"receiverPhone" gorm:"column:receiver_phone"`
	ReceiverEmail string    `json:"receiverEmail" gorm:"column:receiver_email"`
	CreatedAt     time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt     time.Time `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted     int       `json:"isDeleted" gorm:"column:is_deleted;default:0"`
	Creator       string    `json:"creator" gorm:"column:creator"`
	Updator       string    `json:"updator" gorm:"column:updator"`
}

func (OrderDeliveryAddress) TableName() string {
	return "sys_order_delivery_address"
}
