package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// DictItemRepository Dict_item 数据访问接口
type DictItemRepository interface {
	Create(ctx context.Context, dictItem *model.DictItem) error
	GetByID(ctx context.Context, id int64) (*model.DictItem, error)
	GetByCategoryCodeAndCode(ctx context.Context, dictCategoryCode, code string) (*model.DictItem, error)
	Update(ctx context.Context, dictItem *model.DictItem) error
	UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error
	Delete(ctx context.Context, id int64) error
	SoftDelete(ctx context.Context, id int64, updator string) error
	List(ctx context.Context, offset, limit int) ([]*model.DictItem, int64, error)
	ListByCondition(ctx context.Context, dictCategoryCode, code string, status *int64, offset, limit int) ([]*model.DictItem, int64, error)
	ListByCategoryCode(ctx context.Context, dictCategoryCode string, status *int64, offset, limit int) ([]*model.DictItem, int64, error)
	ExistsByCategoryCodeAndCode(ctx context.Context, dictCategoryCode, code string, excludeID int64) (bool, error)
}

// dictItemRepository Dict_item 数据访问实现
type dictItemRepository struct {
	db *gorm.DB
}

// NewDictItemRepository 创建 Dict_item repository
func NewDictItemRepository(db *gorm.DB) DictItemRepository {
	return &dictItemRepository{db: db}
}

// Create 创建 Dict_item
func (r *dictItemRepository) Create(ctx context.Context, dictItem *model.DictItem) error {
	return r.db.WithContext(ctx).Create(dictItem).Error
}

// GetByID 根据ID获取 Dict_item
func (r *dictItemRepository) GetByID(ctx context.Context, id int64) (*model.DictItem, error) {
	var dictItem model.DictItem
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&dictItem).Error
	if err != nil {
		return nil, err
	}
	return &dictItem, nil
}

// GetByCategoryCodeAndCode 根据字典类目编码和字典项编码查询
func (r *dictItemRepository) GetByCategoryCodeAndCode(ctx context.Context, dictCategoryCode, code string) (*model.DictItem, error) {
	var dictItem model.DictItem
	err := r.db.WithContext(ctx).
		Where("dict_category_code = ? AND code = ? AND is_deleted = ?", dictCategoryCode, code, 0).
		First(&dictItem).Error
	if err != nil {
		return nil, err
	}
	return &dictItem, nil
}

// Update 更新 Dict_item
func (r *dictItemRepository) Update(ctx context.Context, dictItem *model.DictItem) error {
	return r.db.WithContext(ctx).Save(dictItem).Error
}

// UpdateColumnsByID 按列更新
func (r *dictItemRepository) UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).
		Model(&model.DictItem{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(updates).Error
}

// Delete 删除 Dict_item
func (r *dictItemRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.DictItem{}).Error
}

// SoftDelete 软删除
func (r *dictItemRepository) SoftDelete(ctx context.Context, id int64, updator string) error {
	return r.db.WithContext(ctx).
		Model(&model.DictItem{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}

// List 获取 Dict_item 列表
func (r *dictItemRepository) List(ctx context.Context, offset, limit int) ([]*model.DictItem, int64, error) {
	var dictItems []*model.DictItem
	var total int64

	// 获取总数
	if err := r.db.WithContext(ctx).Model(&model.DictItem{}).Where("is_deleted = ?", 0).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 获取列表
	if err := r.db.WithContext(ctx).
		Where("is_deleted = ?", 0).
		Order("sort ASC, id DESC").
		Offset(offset).
		Limit(limit).
		Find(&dictItems).Error; err != nil {
		return nil, 0, err
	}

	return dictItems, total, nil
}

// ListByCondition 按条件分页查询字典项
func (r *dictItemRepository) ListByCondition(
	ctx context.Context,
	dictCategoryCode, code string,
	status *int64,
	offset, limit int,
) ([]*model.DictItem, int64, error) {
	var (
		list  []*model.DictItem
		total int64
	)

	db := r.db.WithContext(ctx).Model(&model.DictItem{}).Where("is_deleted = ?", 0)
	if dictCategoryCode != "" {
		db = db.Where("dict_category_code LIKE ?", "%"+dictCategoryCode+"%")
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

// ListByCategoryCode 根据字典类目编码分页查询字典项
func (r *dictItemRepository) ListByCategoryCode(
	ctx context.Context,
	dictCategoryCode string,
	status *int64,
	offset, limit int,
) ([]*model.DictItem, int64, error) {
	var (
		list  []*model.DictItem
		total int64
	)

	db := r.db.WithContext(ctx).Model(&model.DictItem{}).
		Where("dict_category_code = ? AND is_deleted = ?", dictCategoryCode, 0)
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

// ExistsByCategoryCodeAndCode 判断字典项是否已存在
func (r *dictItemRepository) ExistsByCategoryCodeAndCode(ctx context.Context, dictCategoryCode, code string, excludeID int64) (bool, error) {
	var count int64
	db := r.db.WithContext(ctx).Model(&model.DictItem{}).
		Where("dict_category_code = ? AND code = ? AND is_deleted = ?", dictCategoryCode, code, 0)
	if excludeID > 0 {
		db = db.Where("id <> ?", excludeID)
	}
	if err := db.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
