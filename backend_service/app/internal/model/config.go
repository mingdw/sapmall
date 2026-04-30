package model

import (
	"time"
)

// Config Config 模型
type Config struct {
	ID          int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement"`          // 主键ID
	CreateAt    time.Time `json:"createAt" gorm:"column:created_at;autoCreateTime"`      // 创建时间
	UpdateAt    time.Time `json:"updateAt" gorm:"column:updated_at;autoUpdateTime"`      // 更新时间
	IsDeleted   bool      `json:"isDeleted" gorm:"column:is_deleted;default:false"`       // 软删除标记
	Creator     string    `json:"creator" gorm:"column:creator"`                          // 创建人
	Updator     string    `json:"updator" gorm:"column:updator"`                          // 更新人
	ConfigKey   string    `json:"configKey" gorm:"column:config_key"`                     // 配置键
	ConfigName  string    `json:"configName" gorm:"column:config_name"`                   // 配置名称
	ConfigValue string    `json:"configValue" gorm:"column:config_value"`                 // 配置值
	ConfigType  string    `json:"configType" gorm:"column:config_type"`                   // 配置类型
	ConfigGroup string    `json:"configGroup" gorm:"column:config_group"`                 // 配置分组
	Description string    `json:"description" gorm:"column:description"`                   // 配置描述
	IsSystem    int       `json:"isSystem" gorm:"column:is_system"`                       // 是否系统配置
	IsEncrypted int       `json:"isEncrypted" gorm:"column:is_encrypted"`                 // 是否加密
	IsEditable  int       `json:"isEditable" gorm:"column:is_editable"`                   // 是否可编辑
	SyncChainStatus int   `json:"syncChainStatus" gorm:"column:sync_chain_status"`        // 是否同步区块链
	Sort        int       `json:"sort" gorm:"column:sort"`                                // 排序
	Status      int       `json:"status" gorm:"column:status"`                            // 状态
}

// TableName 指定表名
func (Config) TableName() string {
	return "sys_config"
}
