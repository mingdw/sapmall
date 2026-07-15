package model

import "time"

// OrderLogistics 订单物流信息
type OrderLogistics struct {
	ID                 int64     `json:"id" gorm:"column:id;primaryKey"`
	OrderId            int64     `json:"orderId" gorm:"column:order_id"`
	OrderCode          string    `json:"orderCode" gorm:"column:order_code"`
	DeliveryType       int       `json:"deliveryType" gorm:"column:delivery_type"`
	LogisticsStatus    int       `json:"logisticsStatus" gorm:"column:logistics_status"`
	ExceptionStatus    int       `json:"exceptionStatus" gorm:"column:exception_status"`
	ReceiverName       string    `json:"receiverName" gorm:"column:receiver_name"`
	ReceiverPhone      string    `json:"receiverPhone" gorm:"column:receiver_phone"`
	ReceiverEmail      string    `json:"receiverEmail" gorm:"column:receiver_email"`
	ProvinceCode       string    `json:"provinceCode" gorm:"column:province_code"`
	ProvinceName       string    `json:"provinceName" gorm:"column:province_name"`
	CityCode           string    `json:"cityCode" gorm:"column:city_code"`
	CityName           string    `json:"cityName" gorm:"column:city_name"`
	DistrictCode       string    `json:"districtCode" gorm:"column:district_code"`
	DistrictName       string    `json:"districtName" gorm:"column:district_name"`
	Street             string    `json:"street" gorm:"column:street"`
	DetailAddress      string    `json:"detailAddress" gorm:"column:detail_address"`
	SellerId           int64     `json:"sellerId" gorm:"column:seller_id;default:0"`
	SellerCode         string    `json:"sellerCode" gorm:"column:seller_code;default:''"`
	LogisticsCode      string    `json:"logisticsCode" gorm:"column:logistics_code"`
	LogisticsName      string    `json:"logisticsName" gorm:"column:logistics_name"`
	PlatformTrackingNo string    `json:"platformTrackingNo" gorm:"column:platform_tracking_no"`
	TrackingNo         string    `json:"trackingNo" gorm:"column:tracking_no"`
	Weight             float64   `json:"weight" gorm:"column:weight"`
	ShipTime           time.Time `json:"shipTime" gorm:"column:ship_time"`
	SignTime           time.Time `json:"signTime" gorm:"column:sign_time"`
	ExpectArrival      time.Time `json:"expectArrival" gorm:"column:expect_arrival"`
	LastUpdateTime     time.Time `json:"lastUpdateTime" gorm:"column:last_update_time"`
	FreightAmount      float64   `json:"freightAmount" gorm:"column:freight_amount"`
	InsuranceAmount    float64   `json:"insuranceAmount" gorm:"column:insurance_amount"`
	ShipRemark         string    `json:"shipRemark" gorm:"column:ship_remark"`
	ExceptionRemark    string    `json:"exceptionRemark" gorm:"column:exception_remark"`
	CreatedAt          time.Time `json:"createdAt" gorm:"column:created_at;autoCreateTime"`
	UpdatedAt          time.Time `json:"updatedAt" gorm:"column:updated_at;autoUpdateTime"`
	IsDeleted          int       `json:"isDeleted" gorm:"column:is_deleted;default:0"` // 0否 1是
	Creator            string    `json:"creator" gorm:"column:creator"`
	Updator            string    `json:"updator" gorm:"column:updator"`
}

func (OrderLogistics) TableName() string {
	return "sys_order_logistics"
}

// Order_logistics 兼容 sapctl 旧命名
type Order_logistics = OrderLogistics
