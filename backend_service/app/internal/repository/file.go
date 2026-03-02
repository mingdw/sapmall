package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// FileRepository File 数据访问接口
type FileRepository interface {
	Create(ctx context.Context, file *model.File) error
	GetByID(ctx context.Context, id int64) (*model.File, error)
	GetByHash(ctx context.Context, hash string) (*model.File, error)
	GetByStorageUrl(ctx context.Context, storageUrl string) (*model.File, error)
	GetByHashes(ctx context.Context, hashes []string) ([]*model.File, error)
	GetByStorageUrls(ctx context.Context, storageUrls []string) ([]*model.File, error)
	GetByBusiness(ctx context.Context, businessType string, businessId int64) ([]*model.File, error)
	Update(ctx context.Context, file *model.File) error
	Delete(ctx context.Context, id int64) error
	DeleteByHash(ctx context.Context, hash string) error
	DeleteByHashes(ctx context.Context, hashes []string) error
	DeleteByBusiness(ctx context.Context, businessType string, businessId int64) error
	List(ctx context.Context, offset, limit int) ([]*model.File, int64, error)
}

// fileRepository File 数据访问实现
type fileRepository struct {
	db *gorm.DB
}

// NewFileRepository 创建 File repository
func NewFileRepository(db *gorm.DB) FileRepository {
	return &fileRepository{db: db}
}

// Create 创建 File
func (r *fileRepository) Create(ctx context.Context, file *model.File) error {
	return r.db.WithContext(ctx).Create(file).Error
}

// GetByID 根据ID获取 File（排除已删除的记录）
func (r *fileRepository) GetByID(ctx context.Context, id int64) (*model.File, error) {
	var file model.File
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, false).First(&file).Error
	if err != nil {
		return nil, err
	}
	return &file, nil
}

// GetByHash 根据Hash获取 File（排除已删除的记录）
// 如果文件不存在，返回 nil, nil（文件不存在是正常情况）
// 如果是其他错误（如超时、连接失败等），返回 nil, error
func (r *fileRepository) GetByHash(ctx context.Context, hash string) (*model.File, error) {
	var file model.File
	err := r.db.WithContext(ctx).Where("hash = ? AND is_deleted = ?", hash, false).First(&file).Error
	if err != nil {
		// 文件不存在是正常情况，返回 nil, nil
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		// 其他错误（如超时、连接失败等）才返回错误
		return nil, err
	}
	return &file, nil
}

// GetByStorageUrl 根据StorageUrl获取 File（排除已删除的记录）
// 如果文件不存在，返回 nil, nil（文件不存在是正常情况）
// 如果是其他错误（如超时、连接失败等），返回 nil, error
func (r *fileRepository) GetByStorageUrl(ctx context.Context, storageUrl string) (*model.File, error) {
	var file model.File
	err := r.db.WithContext(ctx).Where("storage_url = ? AND is_deleted = ?", storageUrl, false).First(&file).Error
	if err != nil {
		// 文件不存在是正常情况，返回 nil, nil
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		// 其他错误（如超时、连接失败等）才返回错误
		return nil, err
	}
	return &file, nil
}

// Update 更新 File
func (r *fileRepository) Update(ctx context.Context, file *model.File) error {
	return r.db.WithContext(ctx).Save(file).Error
}

// Delete 软删除 File（更新 is_deleted 字段为 true）
func (r *fileRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Model(&model.File{}).Where("id = ?", id).Update("is_deleted", true).Error
}

// GetByHashes 根据Hash集合批量获取 File（排除已删除的记录）
func (r *fileRepository) GetByHashes(ctx context.Context, hashes []string) ([]*model.File, error) {
	if len(hashes) == 0 {
		return []*model.File{}, nil
	}

	var files []*model.File
	err := r.db.WithContext(ctx).Where("hash IN ? AND is_deleted = ?", hashes, false).Find(&files).Error
	if err != nil {
		return nil, err
	}
	return files, nil
}

// DeleteByHash 根据Hash软删除所有匹配的 File（更新 is_deleted 字段为 true）
// 用于删除所有相同hash的文件记录（可能有多个记录指向同一个文件）
func (r *fileRepository) DeleteByHash(ctx context.Context, hash string) error {
	return r.db.WithContext(ctx).Model(&model.File{}).Where("hash = ? AND is_deleted = ?", hash, false).Update("is_deleted", true).Error
}

// GetByStorageUrls 根据StorageUrl或Url集合批量获取 File（排除已删除的记录）
// 同时查询 storage_url 和 url 字段，以支持不同的URL格式
func (r *fileRepository) GetByStorageUrls(ctx context.Context, storageUrls []string) ([]*model.File, error) {
	if len(storageUrls) == 0 {
		return []*model.File{}, nil
	}

	var files []*model.File
	// 同时查询 storage_url 和 url 字段，以支持不同的URL格式
	err := r.db.WithContext(ctx).Where("(storage_url IN ? OR url IN ?) AND is_deleted = ?", storageUrls, storageUrls, false).Find(&files).Error
	if err != nil {
		return nil, err
	}
	return files, nil
}

// DeleteByHashes 根据Hash集合批量物理删除所有匹配的 File
func (r *fileRepository) DeleteByHashes(ctx context.Context, hashes []string) error {
	if len(hashes) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Where("hash IN ?", hashes).Delete(&model.File{}).Error
}

// GetByBusiness 根据业务类型和业务ID获取 File 列表（排除已删除的记录）
func (r *fileRepository) GetByBusiness(ctx context.Context, businessType string, businessId int64) ([]*model.File, error) {
	var files []*model.File
	query := r.db.WithContext(ctx).Where("is_deleted = ?", false)

	if businessType != "" {
		query = query.Where("business_type = ?", businessType)
	}
	if businessId > 0 {
		query = query.Where("business_id = ?", businessId)
	}

	err := query.Find(&files).Error
	if err != nil {
		return nil, err
	}
	return files, nil
}

// DeleteByBusiness 根据业务类型和业务ID删除文件（物理删除）
func (r *fileRepository) DeleteByBusiness(ctx context.Context, businessType string, businessId int64) error {
	query := r.db.WithContext(ctx).Model(&model.File{})

	if businessType != "" {
		query = query.Where("business_type = ?", businessType)
	}
	if businessId > 0 {
		query = query.Where("business_id = ?", businessId)
	}

	return query.Delete(&model.File{}).Error
}

// List 获取 File 列表（排除已删除的记录）
func (r *fileRepository) List(ctx context.Context, offset, limit int) ([]*model.File, int64, error) {
	var files []*model.File
	var total int64

	// 获取总数（排除已删除的记录）
	if err := r.db.WithContext(ctx).Model(&model.File{}).Where("is_deleted = ?", false).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 获取列表（排除已删除的记录）
	if err := r.db.WithContext(ctx).Where("is_deleted = ?", false).Offset(offset).Limit(limit).Find(&files).Error; err != nil {
		return nil, 0, err
	}

	return files, total, nil
}
