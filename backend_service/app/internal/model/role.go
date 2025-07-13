package model

import "time"

type Role struct {
	ID          int64     `gorm:"primaryKey;column:id"`
	Name        string    `gorm:"column:name;not null" json:"name"`               // 名称
	Code        string    `gorm:"column:code;not null" json:"code"`               // 编码
	Description string    `gorm:"column:description;not null" json:"description"` // 描述
	CreatedAt   time.Time `gorm:"column:created_at" json:"createdAt"`             // 创建时间
	UpdatedAt   time.Time `gorm:"column:updated_at" json:"updatedAt"`             // 更新时间
	IsDeleted   int       `gorm:"column:is_deleted" json:"isDeleted"`             // 是否删除
	Creator     string    `gorm:"column:creator;not null" json:"creator"`         // 创建人
	Updator     string    `gorm:"column:updator;not null" json:"updator"`         // 更新人
}

func (Role) TableName() string {
	return "sys_role" // 使用主表名称
}
