package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// DictCategoryRepository Dict_category 数据访问接口
type DictCategoryRepository interface {
	Create(ctx context.Context, dict_category *model.DictCategory) error
	GetByID(ctx context.Context, id int64) (*model.DictCategory, error)
	GetByDictTypeAndCode(ctx context.Context, dictType, code string) (*model.DictCategory, error)
	GetByCode(ctx context.Context, code string) (*model.DictCategory, error)
	Update(ctx context.Context, dict_category *model.DictCategory) error
	UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error
	Delete(ctx context.Context, id int64) error
	SoftDelete(ctx context.Context, id int64, updator string) error
	List(ctx context.Context, offset, limit int) ([]*model.DictCategory, int64, error)
	ListByCondition(ctx context.Context, dictType, code string, status *int64, offset, limit int) ([]*model.DictCategory, int64, error)
	ExistsByDictTypeAndCode(ctx context.Context, dictType, code string, excludeID int64) (bool, error)
}

// dictCategoryRepository Dict_category 数据访问实现
type dictCategoryRepository struct {
	db *gorm.DB
}

// NewDict_categoryRepository 创建 Dict_category repository
func NewDictCategoryRepository(db *gorm.DB) DictCategoryRepository {
	return &dictCategoryRepository{db: db}
}

// Create 创建 Dict_category
func (r *dictCategoryRepository) Create(ctx context.Context, dict_category *model.DictCategory) error {
	return r.db.WithContext(ctx).Create(dict_category).Error
}

// GetByID 根据ID获取 Dict_category
func (r *dictCategoryRepository) GetByID(ctx context.Context, id int64) (*model.DictCategory, error) {
	var dict_category model.DictCategory
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&dict_category).Error
	if err != nil {
		return nil, err
	}
	return &dict_category, nil
}

// GetByDictTypeAndCode 根据字典类型和编码查询
func (r *dictCategoryRepository) GetByDictTypeAndCode(ctx context.Context, dictType, code string) (*model.DictCategory, error) {
	var dictCategory model.DictCategory
	err := r.db.WithContext(ctx).
		Where("dict_type = ? AND code = ? AND is_deleted = ?", dictType, code, 0).
		First(&dictCategory).Error
	if err != nil {
		return nil, err
	}
	return &dictCategory, nil
}

// GetByCode 根据分类编码查询
func (r *dictCategoryRepository) GetByCode(ctx context.Context, code string) (*model.DictCategory, error) {
	var dictCategory model.DictCategory
	err := r.db.WithContext(ctx).
		Where("code = ? AND is_deleted = ?", code, 0).
		First(&dictCategory).Error
	if err != nil {
		return nil, err
	}
	return &dictCategory, nil
}

// Update 更新 Dict_category
func (r *dictCategoryRepository) Update(ctx context.Context, dict_category *model.DictCategory) error {
	return r.db.WithContext(ctx).Save(dict_category).Error
}

// UpdateColumnsByID 按列更新
func (r *dictCategoryRepository) UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).
		Model(&model.DictCategory{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(updates).Error
}

// Delete 删除 Dict_category
func (r *dictCategoryRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.DictCategory{}).Error
}

// SoftDelete 软删除
func (r *dictCategoryRepository) SoftDelete(ctx context.Context, id int64, updator string) error {
	return r.db.WithContext(ctx).
		Model(&model.DictCategory{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}

// List 获取 Dict_category 列表
func (r *dictCategoryRepository) List(ctx context.Context, offset, limit int) ([]*model.DictCategory, int64, error) {
	var dict_categorys []*model.DictCategory
	var total int64

	// 获取总数
	if err := r.db.WithContext(ctx).Model(&model.DictCategory{}).Where("is_deleted = ?", 0).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 获取列表
	if err := r.db.WithContext(ctx).
		Where("is_deleted = ?", 0).
		Order("sort ASC, id DESC").
		Offset(offset).
		Limit(limit).
		Find(&dict_categorys).Error; err != nil {
		return nil, 0, err
	}

	return dict_categorys, total, nil
}

// ListByCondition 按条件分页查询字典类目
func (r *dictCategoryRepository) ListByCondition(
	ctx context.Context,
	dictType, code string,
	status *int64,
	offset, limit int,
) ([]*model.DictCategory, int64, error) {
	var (
		list  []*model.DictCategory
		total int64
	)

	db := r.db.WithContext(ctx).Model(&model.DictCategory{}).Where("is_deleted = ?", 0)
	if dictType != "" {
		db = db.Where("dict_type LIKE ?", "%"+dictType+"%")
	}
	if code != "" {
		db = db.Where("code LIKE ?", "%"+code+"%")
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

// ExistsByDictTypeAndCode 判断字典类目是否已存在
func (r *dictCategoryRepository) ExistsByDictTypeAndCode(ctx context.Context, dictType, code string, excludeID int64) (bool, error) {
	var count int64
	db := r.db.WithContext(ctx).Model(&model.DictCategory{}).
		Where("dict_type = ? AND code = ? AND is_deleted = ?", dictType, code, 0)
	if excludeID > 0 {
		db = db.Where("id <> ?", excludeID)
	}
	if err := db.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
