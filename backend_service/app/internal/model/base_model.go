package model

import "time"

type BaseModel struct {
	CreatedAt time.Time `json:"createdAt" gorm:"column:created_at;default:CURRENT_TIMESTAMP;comment:创建时间"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"column:updated_at;default:CURRENT_TIMESTAMP;comment:更新时间"`
	IsDeleted int       `json:"isDeleted" gorm:"column:is_deleted;default:0;comment:是否删除"`
	Creator   string    `json:"creator" gorm:"column:creator;not null;default:'system';comment:创建人"`
	Updator   string    `json:"updator" gorm:"column:updator;not null;default:'system';comment:更新人"`
}
