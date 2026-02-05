package model

import (
	"time"
)

// File File 模型
type File struct {
	ID              int64      `json:"id" gorm:"primaryKey"`                               // 主键ID
	CreateAt        time.Time  `json:"created_at" gorm:"column:created_at;autoCreateTime"` // 创建时间
	UpdateAt        time.Time  `json:"updated_at" gorm:"column:updated_at;autoUpdateTime"` // 更新时间
	IsDeleted       bool       `json:"is_deleted" gorm:"column:is_deleted;default:false"`  // 软删除标记
	Creator         string     `json:"creator" gorm:""`                                    // 创建人
	Updator         string     `json:"updator" gorm:""`                                    // 更新人
	Hash            string     `json:"hash" gorm:"unique"`                                 // hash 字段
	StorageUrl      string     `json:"storage_url" gorm:""`                                // storage_url 字段
	Url             string     `json:"url" gorm:""`                                        // url 字段
	OriginalName    string     `json:"original_name" gorm:""`                              // original_name 字段
	Name            string     `json:"name" gorm:""`                                       // name 字段
	Extension       string     `json:"extension" gorm:""`                                  // extension 字段
	Type            string     `json:"type" gorm:""`                                       // type 字段
	Size            int64      `json:"size" gorm:""`                                       // size 字段
	AccessUrlExpire *time.Time `json:"access_url_expire" gorm:"column:access_url_expire"`  // access_url_expire 字段（访问URL过期时间，私有文件）
	StorageType     string     `json:"storage_type" gorm:""`                               // storage_type 字段
	BusinessType    string     `json:"business_type" gorm:""`                              // business_type 字段
	BusinessId      int64      `json:"business_id" gorm:""`                                // business_id 字段
	Tags            string     `json:"tags" gorm:""`                                       // tags 字段
	Description     string     `json:"description" gorm:""`                                // description 字段
	Metadata        string     `json:"metadata" gorm:""`                                   // metadata 字段
	AccessType      int        `json:"access_type" gorm:""`                                // access_type 字段
	ViewCount       int64      `json:"view_count" gorm:""`                                 // view_count 字段
	DownloadCount   int64      `json:"download_count" gorm:""`                             // download_count 字段
	Status          int        `json:"status" gorm:""`                                     // status 字段
	StatusDesc      string     `json:"status_desc" gorm:""`                                // status_desc 字段
	// 注意：使用 IsDeleted 字段进行软删除，不使用 GORM 的 DeletedAt（避免自动添加 deleted_at 查询条件）
}

// TableName 指定表名
func (File) TableName() string {
	return "sys_file"
}
