package model

// AttrGroup 属性组
type AttrGroup struct {
	BaseModel
	ID            uint   `json:"id" gorm:"primaryKey"`
	AttrGroupName string `json:"attrGroupName" gorm:"column:attr_group_name;not null;default:'';comment:名称"`
	AttrGroupCode string `json:"attrGroupCode" gorm:"column:attr_group_code;not null;default:'';comment:编码"`
	Type          int    `json:"type" gorm:"column:type;not null;default:0;comment:类型"`
	Status        int    `json:"status" gorm:"column:status;not null;default:0;comment:状态"`
	Sort          int    `json:"sort" gorm:"column:sort;not null;default:0;comment:排序"`
	Description   string `json:"description" gorm:"column:description;not null;default:'';comment:描述"`
}

// TableName 表名
func (m *AttrGroup) TableName() string {
	return "sys_attr_group"
}
