package model

import "time"

// ProductSpuAttrParams 商品spu属性详情表
type ProductSpuAttrParams struct {
	ID             int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	ProductSpuID   int64     `gorm:"column:product_spu_id;not null" json:"productSpuId"`     // 商品spu id
	ProductSpuCode string    `gorm:"column:product_spu_code;not null" json:"productSpuCode"` // 商品spu编码
	Code           string    `gorm:"column:code;not null" json:"code"`                       // 编码
	Name           string    `gorm:"column:name;not null" json:"name"`                       // 名称
	AttrType       int       `gorm:"column:attr_type;not null" json:"attrType"`              // 类型：1-基本属性，2-销售属性，3-规格属性
	ValueType      int       `gorm:"column:value_type;not null" json:"valueType"`            // 值类型：1-文本，2-图片，3-视频，4-音频，5-链接，6-其它
	Value          string    `gorm:"column:value;not null" json:"value"`                     // 值
	Sort           int       `gorm:"column:sort;not null" json:"sort"`                       // 排序
	Status         int       `gorm:"column:status;not null" json:"status"`                   // 状态
	IsRequired     int       `gorm:"column:is_required;not null" json:"isRequired"`          // 是否必填
	IsGeneric      int       `gorm:"column:is_generic;not null" json:"isGeneric"`            // 是否通用
	CreatedAt      time.Time `gorm:"column:created_at" json:"createdAt"`                     // 创建时间
	UpdatedAt      time.Time `gorm:"column:updated_at" json:"updatedAt"`                     // 更新时间
	IsDeleted      int       `gorm:"column:is_deleted" json:"isDeleted"`                     // 是否删除
	Creator        string    `gorm:"column:creator;not null" json:"creator"`                 // 创建人
	Updator        string    `gorm:"column:updator;not null" json:"updator"`                 // 更新人
}

// TableName 表名
func (p *ProductSpuAttrParams) TableName() string {
	return "sys_product_spu_attr_params"
}
