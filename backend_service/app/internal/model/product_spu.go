package model

import "time"

// ProductSpu 商品spu表
type ProductSpu struct {
	ID            int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Code          string    `gorm:"column:code;not null" json:"code"`                    // 编码
	Name          string    `gorm:"column:name;not null" json:"name"`                    // 名称
	Category1ID   int64     `gorm:"column:category1_id;not null" json:"category1Id"`     // 商品目录1分类id
	Category1Code string    `gorm:"column:category1_code;not null" json:"category1Code"` // 商品目录1分类编码
	Category2ID   int64     `gorm:"column:category2_id;not null" json:"category2Id"`     // 商品目录2分类id
	Category2Code string    `gorm:"column:category2_code;not null" json:"category2Code"` // 商品目录2分类编码
	Category3ID   int64     `gorm:"column:category3_id;not null" json:"category3Id"`     // 商品目录3分类id
	Category3Code string    `gorm:"column:category3_code;not null" json:"category3Code"` // 商品目录3分类编码
	Brand         string    `gorm:"column:brand;not null" json:"brand"`                  // 品牌
	Description   string    `gorm:"column:description;not null" json:"description"`      // 描述
	Status        int       `gorm:"column:status;not null" json:"status"`                // 状态
	Images        string    `gorm:"column:images;not null" json:"images"`                // 图片
	TotalSales    int       `gorm:"column:total_sales;not null" json:"totalSales"`       // 总销量
	TotalStock    int       `gorm:"column:total_stock;not null" json:"totalStock"`       // 总库存
	CreatedAt     time.Time `gorm:"column:created_at" json:"createdAt"`                  // 创建时间
	UpdatedAt     time.Time `gorm:"column:updated_at" json:"updatedAt"`                  // 更新时间
	IsDeleted     int       `gorm:"column:is_deleted" json:"isDeleted"`                  // 是否删除
	Creator       string    `gorm:"column:creator;not null" json:"creator"`              // 创建人
	Updator       string    `gorm:"column:updator;not null" json:"updator"`              // 更新人
	Price         float64   `gorm:"column:price;not null" json:"price"`                  // 价格
	RealPrice     float64   `gorm:"column:real_price;not null" json:"realPrice"`         // 原价
}

// TableName 表名
func (p *ProductSpu) TableName() string {
	return "sys_product_spu"
}
