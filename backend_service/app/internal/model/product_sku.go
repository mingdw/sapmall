package model

import (
	"time"
)

// ProductSku 商品sku表
type ProductSku struct {
	ID             int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	ProductSpuID   int64     `gorm:"column:product_spu_id;not null" json:"productSpuId"`     // 商品spu id
	ProductSpuCode string    `gorm:"column:product_spu_code;not null" json:"productSpuCode"` // 商品spu编码
	SkuCode        string    `gorm:"column:sku_code;not null" json:"skuCode"`                // sku编码
	Price          float64   `gorm:"column:price;not null" json:"price"`                     // 价格
	Stock          int       `gorm:"column:stock;not null" json:"stock"`                     // 库存
	SaleCount      int       `gorm:"column:sale_count;not null" json:"saleCount"`            // 销量
	Status         int       `gorm:"column:status;not null" json:"status"`                   // 状态
	Indexs         string    `gorm:"column:indexs;not null" json:"indexs"`                   // 规格索引
	AttrParams     string    `gorm:"column:attr_params" json:"attrParams"`                   // 属性参数
	OwnerParams    string    `gorm:"column:owner_params" json:"ownerParams"`                 // 属性参数
	Images         string    `gorm:"column:images" json:"images"`                            // 图片
	Title          string    `gorm:"column:title" json:"title"`                              // 标题
	SubTitle       string    `gorm:"column:sub_title" json:"subTitle"`                       // 副标题
	Description    string    `gorm:"column:description" json:"description"`                  // 描述
	CreatedAt      time.Time `gorm:"column:created_at" json:"createdAt"`                     // 创建时间
	UpdatedAt      time.Time `gorm:"column:updated_at" json:"updatedAt"`                     // 更新时间
	IsDeleted      int       `gorm:"column:is_deleted" json:"isDeleted"`                     // 是否删除
	Creator        string    `gorm:"column:creator;not null" json:"creator"`                 // 创建人
	Updator        string    `gorm:"column:updator;not null" json:"updator"`                 // 更新人
}

// TableName 表名
func (p *ProductSku) TableName() string {
	return "sys_product_sku"
}
