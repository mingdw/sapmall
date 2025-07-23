package model

type Product struct {
	ID            int64                   `gorm:"primaryKey;column:id"`
	SPU           *ProductSpu             `gorm:"foreignKey:ID;references:ID"`
	SPUDetail     *ProductSpuDetail       `gorm:"foreignKey:ProductSpuID;references:ID"`
	SPUAttrParams []*ProductSpuAttrParams `gorm:"foreignKey:ProductSpuID;references:ID"`
	SKUs          []*ProductSku           `gorm:"foreignKey:ProductSpuID;references:ID"`
}

func (Product) TableName() string {
	return "sys_product" // 使用主表名称
}
