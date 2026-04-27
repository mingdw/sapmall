package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
	"gorm.io/gorm"
)

// ConfigRepository Config 数据访问接口
type ConfigRepository interface {
	Create(ctx context.Context, config *model.Config) error
	GetByID(ctx context.Context, id int64) (*model.Config, error)
	GetByConfigKey(ctx context.Context, configKey string) (*model.Config, error)
	Update(ctx context.Context, config *model.Config) error
	UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error
	Delete(ctx context.Context, id int64) error
	SoftDelete(ctx context.Context, id int64, updator string) error
	List(ctx context.Context, offset, limit int) ([]*model.Config, int64, error)
	ListByCondition(
		ctx context.Context,
		configKey, configName, configType, configGroup string,
		status *int64,
		offset, limit int,
	) ([]*model.Config, int64, error)
	ExistsByConfigKey(ctx context.Context, configKey string, excludeID int64) (bool, error)
}

// configRepository Config 数据访问实现
type configRepository struct {
	db *gorm.DB
}

// NewConfigRepository 创建 Config repository
func NewConfigRepository(db *gorm.DB) ConfigRepository {
	return &configRepository{db: db}
}

// Create 创建 Config
func (r *configRepository) Create(ctx context.Context, config *model.Config) error {
	return r.db.WithContext(ctx).Create(config).Error
}

// GetByID 根据ID获取 Config
func (r *configRepository) GetByID(ctx context.Context, id int64) (*model.Config, error) {
	var config model.Config
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&config).Error
	if err != nil {
		return nil, err
	}
	return &config, nil
}

// GetByConfigKey 根据配置键获取配置
func (r *configRepository) GetByConfigKey(ctx context.Context, configKey string) (*model.Config, error) {
	var config model.Config
	err := r.db.WithContext(ctx).
		Where("config_key = ? AND is_deleted = ?", configKey, 0).
		First(&config).Error
	if err != nil {
		return nil, err
	}
	return &config, nil
}

// Update 更新 Config
func (r *configRepository) Update(ctx context.Context, config *model.Config) error {
	return r.db.WithContext(ctx).Save(config).Error
}

// UpdateColumnsByID 按列更新
func (r *configRepository) UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).
		Model(&model.Config{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(updates).Error
}

// Delete 删除 Config
func (r *configRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Config{}).Error
}

// SoftDelete 软删除
func (r *configRepository) SoftDelete(ctx context.Context, id int64, updator string) error {
	return r.db.WithContext(ctx).
		Model(&model.Config{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}

// List 获取 Config 列表
func (r *configRepository) List(ctx context.Context, offset, limit int) ([]*model.Config, int64, error) {
	var configs []*model.Config
	var total int64
	
	// 获取总数
	if err := r.db.WithContext(ctx).Model(&model.Config{}).Where("is_deleted = ?", 0).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	// 获取列表
	if err := r.db.WithContext(ctx).
		Where("is_deleted = ?", 0).
		Order("sort ASC, id DESC").
		Offset(offset).
		Limit(limit).
		Find(&configs).Error; err != nil {
		return nil, 0, err
	}
	
	return configs, total, nil
}

// ListByCondition 按条件分页查询系统参数
func (r *configRepository) ListByCondition(
	ctx context.Context,
	configKey, configName, configType, configGroup string,
	status *int64,
	offset, limit int,
) ([]*model.Config, int64, error) {
	var (
		list  []*model.Config
		total int64
	)

	db := r.db.WithContext(ctx).Model(&model.Config{}).Where("is_deleted = ?", 0)
	if configKey != "" {
		db = db.Where("config_key LIKE ?", "%"+configKey+"%")
	}
	if configName != "" {
		db = db.Where("config_name LIKE ?", "%"+configName+"%")
	}
	if configType != "" {
		db = db.Where("config_type = ?", configType)
	}
	if configGroup != "" {
		db = db.Where("config_group = ?", configGroup)
	}
	if status != nil {
		db = db.Where("status = ?", *status)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := db.Order("sort ASC, id DESC").Offset(offset).Limit(limit).Find(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}

// ExistsByConfigKey 判断配置键是否已存在
func (r *configRepository) ExistsByConfigKey(ctx context.Context, configKey string, excludeID int64) (bool, error) {
	var count int64
	db := r.db.WithContext(ctx).Model(&model.Config{}).Where("is_deleted = ?", 0)
	if excludeID > 0 {
		db = db.Where("id = ?", excludeID)
	} else {
		db = db.Where("config_key = ?", configKey)
	}
	if err := db.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
