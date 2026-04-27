package model

import (
	"time"
)

// Dict_item Dict_item 模型
type DictItem struct {
	ID               int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`      // 主键ID
	CreateAt         time.Time `json:"createAt" gorm:"column:created_at;autoCreateTime"`  // 创建时间
	UpdateAt         time.Time `json:"updateAt" gorm:"column:updated_at;autoUpdateTime"`  // 更新时间
	IsDeleted        bool      `json:"isDeleted" gorm:"column:is_deleted;default:false"`  // 软删除标记
	Creator          string    `json:"creator" gorm:"column:creator"`                     // 创建人
	Updator          string    `json:"updator" gorm:"column:updator"`                     // 更新人
	DictCategoryCode string    `json:"dictCategoryCode" gorm:"column:dict_category_code"` // 所属字典类目编码
	Code             string    `json:"code" gorm:"column:code"`                           // 字典项编码
	Value            string    `json:"value" gorm:"column:value"`                         // 字典值
	Desc             string    `json:"desc" gorm:"column:desc"`                           // 字典描述
	Level            int       `json:"level" gorm:"column:level"`                         // 层级
	Sort             int       `json:"sort" gorm:"column:sort"`                           // 排序
	Status           int       `json:"status" gorm:"column:status"`                       // 状态
}

// TableName 指定表名
func (DictItem) TableName() string {
	return "sys_dict_item"
}
