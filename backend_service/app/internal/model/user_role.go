package model

import "time"

type UserRole struct {
	ID        int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	UserID    int64     `gorm:"column:user_id;not null" json:"userId"`
	UserCode  string    `gorm:"column:user_code;not null" json:"userCode"`
	RoleID    int64     `gorm:"column:role_id;not null" json:"roleId"`
	RoleCode  string    `gorm:"column:role_code;not null" json:"roleCode"`
	IsDeleted int       `gorm:"column:is_deleted;not null" json:"isDeleted"`
	CreatedAt time.Time `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updatedAt"`
	Creator   string    `gorm:"column:creator;not null" json:"creator"`
	Updator   string    `gorm:"column:updator;not null" json:"updator"`
	Roles     []*Role   `gorm:"many2many:sys_user_role;foreignKey:ID;joinForeignKey:user_id;references:ID;joinReferences:role_id"`
}

func (UserRole) TableName() string {
	return "sys_user_role"
}
