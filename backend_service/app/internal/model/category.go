package model

// Category 商品目录分类
type Category struct {
	BaseModel
	ID         uint   `json:"id" gorm:"primaryKey"`
	Code       string `json:"code" gorm:"column:code;not null;default:'';comment:编码"`
	Name       string `json:"name" gorm:"column:name;not null;default:'';comment:名称"`
	ParentID   uint   `json:"parentId" gorm:"column:parent_id;not null;default:0;comment:父级id"`
	ParentCode string `json:"parentCode" gorm:"column:parent_code;not null;default:'';comment:父级编码"`
	Level      int    `json:"level" gorm:"column:level;not null;default:0;comment:级别"`
	Sort       int    `json:"sort" gorm:"column:sort;not null;default:0;comment:排序"`
	Icon       string `json:"icon" gorm:"column:icon;not null;default:'';comment:图标"`
	Status     int    `json:"status" gorm:"column:status;not null;default:0;comment:状态"`
	IsDeleted  int    `json:"isDeleted" gorm:"column:is_deleted;default:0;comment:是否删除"`
}

// TableName 表名
func (m *Category) TableName() string {
	return "sys_category"
}
