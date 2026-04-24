package model

import "time"

// OperationLog 系统公用操作日志
type OperationLog struct {
	ID            int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`                   // 主键ID
	UserID        int64     `gorm:"column:user_id;not null;default:0" json:"userId"`                // 操作人用户ID
	Username      string    `gorm:"column:username;not null;default:''" json:"username"`            // 操作人用户名
	BizModule     string    `gorm:"column:biz_module;not null;default:''" json:"bizModule"`         // 业务模块
	ActionType    string    `gorm:"column:action_type;not null;default:''" json:"actionType"`       // 动作类型编码
	ActionSummary string    `gorm:"column:action_summary;not null;default:''" json:"actionSummary"` // 动作摘要
	Before        string    `gorm:"column:before" json:"before"`                                    // 操作前快照
	After         string    `gorm:"column:after" json:"after"`                                      // 操作后快照
	ObjectType    string    `gorm:"column:object_type;not null;default:''" json:"objectType"`       // 操作对象类型
	ObjectID      string    `gorm:"column:object_id;not null;default:''" json:"objectId"`           // 操作对象ID
	DetailJSON    string    `gorm:"column:detail_json" json:"detailJson"`                           // 扩展信息JSON
	ResultStatus  int       `gorm:"column:result_status;not null;default:1" json:"resultStatus"`    // 结果：1成功 2失败 3部分成功
	ErrorMessage  string    `gorm:"column:error_message;not null;default:''" json:"errorMessage"`   // 失败错误摘要
	ClientType    string    `gorm:"column:client_type;not null;default:''" json:"clientType"`       // 客户端类型
	RequestID     string    `gorm:"column:request_id;not null;default:''" json:"requestId"`         // 请求链路ID
	IP            string    `gorm:"column:ip;not null;default:''" json:"ip"`                        // 来源IP
	Item1         string    `gorm:"column:item1;not null;default:''" json:"item1"`                  // 扩展字段1
	Item2         string    `gorm:"column:item2;not null;default:''" json:"item2"`                  // 扩展字段2
	Item3         string    `gorm:"column:item3;not null;default:''" json:"item3"`                  // 扩展字段3
	CreatedAt     time.Time `gorm:"column:created_at;autoCreateTime" json:"createdAt"`              // 发生时间
	UpdatedAt     time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updatedAt"`              // 更新时间
	IsDeleted     int       `gorm:"column:is_deleted;default:0" json:"isDeleted"`                   // 是否删除
	Creator       string    `gorm:"column:creator;not null;default:''" json:"creator"`              // 创建人
	Updator       string    `gorm:"column:updator;not null;default:''" json:"updator"`              // 更新人
}

// TableName 表名
func (OperationLog) TableName() string {
	return "sys_operation_log"
}
