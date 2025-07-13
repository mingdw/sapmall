package model

import (
	"time"
)

// User User 模型
type User struct {
	ID         int64       `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	UniqueId   string      `gorm:"column:unique_id;not null;default:'';comment:平台编号"`
	UserCode   string      `gorm:"column:user_code;not null;default:'';comment:用户编码"`
	Nickname   string      `gorm:"column:nickname;not null;default:'';comment:昵称"`
	Avatar     string      `gorm:"column:avatar;not null;default:'';comment:头像"`
	Gender     int         `gorm:"column:gender;not null;default:0;comment:性别"`
	Birthday   time.Time   `gorm:"column:birthday;comment:生日"`
	Email      string      `gorm:"column:email;not null;default:'';comment:邮箱"`
	Phone      string      `gorm:"column:phone;not null;default:'';comment:手机号"`
	Password   string      `gorm:"column:password;not null;default:'';comment:密码"`
	Status     int         `gorm:"column:status;not null;default:0;comment:状态"`
	StatusDesc string      `gorm:"column:status_desc;not null;default:'';comment:状态描述"`
	Type       int         `gorm:"column:type;not null;default:0;comment:类型"`
	TypeDesc   string      `gorm:"column:type_desc;not null;default:'';comment:类型描述"`
	IsDeleted  int         `gorm:"column:is_deleted;default:0;comment:是否删除"`
	CreatedAt  time.Time   `gorm:"column:created_at;default:CURRENT_TIMESTAMP;comment:创建时间"`
	UpdatedAt  time.Time   `gorm:"column:updated_at;default:CURRENT_TIMESTAMP;comment:更新时间"`
	Creator    string      `gorm:"column:creator;not null;default:'';comment:创建人"`
	Updator    string      `gorm:"column:updator;not null;default:'';comment:更新人"`
	UserRoles  []*UserRole `gorm:"many2many:sys_user_role;foreignKey:ID;joinForeignKey:user_id;references:ID;joinReferences:role_id"`
}

// TableName 指定表名
func (User) TableName() string {
	return "sys_user"
}
