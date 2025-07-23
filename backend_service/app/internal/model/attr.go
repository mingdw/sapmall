package model

type Attr struct {
	ID            uint   `json:"id" gorm:"primaryKey"`
	AttrName      string `json:"attrName" gorm:"column:attr_name;not null;default:'';comment:名称"`
	AttrCode      string `json:"attrCode" gorm:"column:attr_code;not null;default:'';comment:编码"`
	AttrGroupID   uint   `json:"attrGroupId" gorm:"column:attr_group_id;not null;default:0;comment:属性组id"`
	AttrGroupCode string `json:"attrGroupCode" gorm:"column:attr_group_code;not null;default:'';comment:属性组编码"`
	Icon          string `json:"icon" gorm:"column:icon;not null;default:'';comment:图标"`
	AttrType      int    `json:"attrType" gorm:"column:attr_type;not null;default:0;comment:属性类型"`
	Status        int    `json:"status" gorm:"column:status;not null;default:0;comment:状态"`
	Description   string `json:"description" gorm:"column:description;not null;default:'';comment:描述"`
	Sort          int    `json:"sort" gorm:"column:sort;not null;default:0;comment:排序"`
	BaseModel
}

// TableName 表名
func (m *Attr) TableName() string {
	return "sys_attr"
}
