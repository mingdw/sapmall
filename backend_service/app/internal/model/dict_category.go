package model

import (
	"time"
)

// Dict_category Dict_category 模型
type DictCategory struct {
	ID        int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`     // 主键ID
	CreateAt  time.Time `json:"createAt" gorm:"column:created_at;autoCreateTime"` // 创建时间
	UpdateAt  time.Time `json:"updateAt" gorm:"column:updated_at;autoUpdateTime"` // 更新时间
	IsDeleted bool      `json:"isDeleted" gorm:"column:is_deleted;default:false"` // 软删除标记
	Creator   string    `json:"creator" gorm:"column:creator"`                    // 创建人
	Updator   string    `json:"updator" gorm:"column:updator"`                    // 更新人
	DictType  string    `json:"dictType" gorm:"column:dict_type"`                 // 字典类型
	Code      string    `json:"code" gorm:"column:code"`                          // 分类编码
	Name      string    `json:"name" gorm:"column:name"`                          // 分类名称
	Desc      string    `json:"desc" gorm:"column:desc"`                          // 分类描述
	Level     int       `json:"level" gorm:"column:level"`                        // 层级
	Sort      int       `json:"sort" gorm:"column:sort"`                          // 排序
	Status    int       `json:"status" gorm:"column:status"`                      // 状态
}

// TableName 指定表名
func (DictCategory) TableName() string {
	return "sys_dict_category"
}
