package model

import "gorm.io/gorm"

type UserAddress struct {
	gorm.Model
	ID           int64  `gorm:"column:id;not null;primary_key;auto_increment" json:"id"`      // 主键id
	UserID       int64  `gorm:"column:user_id;not null;default:0" json:"userId"`              // 用户id
	UserCode     string `gorm:"column:user_code;not null;default:''" json:"userCode"`         // 用户编码
	ReciverName  string `gorm:"column:reciver_name;not null;default:''" json:"reciverName"`   // 收货人姓名
	ReciverPhone string `gorm:"column:reciver_phone;not null;default:''" json:"reciverPhone"` // 手机号
	ProvinceCode string `gorm:"column:province_code;not null;default:''" json:"provinceCode"` // 省编码
	ProvinceName string `gorm:"column:province_name;not null;default:''" json:"provinceName"` // 省名称
	CityCode     string `gorm:"column:city_code;not null;default:''" json:"cityCode"`         // 市编码
	CityName     string `gorm:"column:city_name;not null;default:''" json:"cityName"`         // 市名称
	DistrictCode string `gorm:"column:district_code;not null;default:''" json:"districtCode"` // 区编码
	DistrictName string `gorm:"column:district_name;not null;default:''" json:"districtName"` // 区名称
	StreetCode   string `gorm:"column:street_code;not null;default:''" json:"streetCode"`     // 街道编码
	StreetName   string `gorm:"column:street_name;not null;default:''" json:"streetName"`     // 街道名称
	HouseAddress string `gorm:"column:house_address;not null;default:''" json:"houseAddress"` // 门牌号
	FullAddress  string `gorm:"column:full_address;not null;default:''" json:"fullAddress"`   // 完整地址
	IsDefault    int    `gorm:"column:is_default;not null;default:0" json:"isDefault"`        // 是否默认
	Longitude    string `gorm:"column:longitude;not null;default:''" json:"longitude"`        // 经度
	Latitude     string `gorm:"column:latitude;not null;default:''" json:"latitude"`          // 纬度
}

func (m *UserAddress) TableName() string {
	return "sys_user_address"
}
