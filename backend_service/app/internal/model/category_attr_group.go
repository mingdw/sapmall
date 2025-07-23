package model

// CategoryAttrGroup 目录-属性组关联
type CategoryAttrGroup struct {
	BaseModel
	ID            uint   `json:"id" gorm:"primaryKey"`
	CategoryID    uint   `json:"categoryId" gorm:"column:category_id;not null;default:0;comment:商品目录分类id"`
	CategoryCode  string `json:"categoryCode" gorm:"column:category_code;not null;default:'';comment:商品目录分类编码"`
	AttrGroupID   uint   `json:"attrGroupId" gorm:"column:attr_group_id;not null;default:0;comment:属性组id"`
	AttrGroupCode string `json:"attrGroupCode" gorm:"column:attr_group_code;not null;default:'';comment:属性组编码"`
	Status        int    `json:"status" gorm:"column:status;not null;default:0;comment:状态"`
}

// TableName 表名
func (m *CategoryAttrGroup) TableName() string {
	return "sys_category_attr_group"
}

// Attr 属性
