package model

import "time"

// ProductSpuDetail 商品spu详情表
type ProductSpuDetail struct {
	ID             int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	ProductSpuID   int64     `gorm:"column:product_spu_id;not null" json:"productSpuId"`     // 商品spu id
	ProductSpuCode string    `gorm:"column:product_spu_code;not null" json:"productSpuCode"` // 商品spu编码
	Detail         []byte    `gorm:"column:detail" json:"detail"`                            // 详情
	PackingList    []byte    `gorm:"column:packing_list" json:"packingList"`                 // 包装清单
	AfterSale      []byte    `gorm:"column:after_sale" json:"afterSale"`                     // 售后服务
	CreatedAt      time.Time `gorm:"column:created_at" json:"createdAt"`                     // 创建时间
	UpdatedAt      time.Time `gorm:"column:updated_at" json:"updatedAt"`                     // 更新时间
	IsDeleted      int       `gorm:"column:is_deleted" json:"isDeleted"`                     // 是否删除
	Creator        string    `gorm:"column:creator;not null" json:"creator"`                 // 创建人
	Updator        string    `gorm:"column:updator;not null" json:"updator"`                 // 更新人
}

// TableName 表名
func (p *ProductSpuDetail) TableName() string {
	return "sys_product_spu_detail"
}
