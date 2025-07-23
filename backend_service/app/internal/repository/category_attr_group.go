package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type CategoryAttrGroupRepository interface {
	FindAll(ctx context.Context) ([]model.CategoryAttrGroup, error)
	DeleteByCategoryIDs(ctx context.Context, ids []uint) error
	FindByCategoryID(ctx context.Context, id int64) ([]model.CategoryAttrGroup, error)
	Create(ctx context.Context, categoryAttrGroup *model.CategoryAttrGroup) (uint, error)
}

type categoryAttrGroupRepository struct {
	db *gorm.DB
}

func NewCategoryAttrGroupRepository(db *gorm.DB) CategoryAttrGroupRepository {
	return &categoryAttrGroupRepository{
		db: db,
	}
}

func (r *categoryAttrGroupRepository) FindAll(ctx context.Context) ([]model.CategoryAttrGroup, error) {
	var categoryAttrGroups []model.CategoryAttrGroup
	if err := r.db.WithContext(ctx).Find(&categoryAttrGroups).Error; err != nil {
		return nil, err
	}
	return categoryAttrGroups, nil
}

func (r *categoryAttrGroupRepository) DeleteByCategoryIDs(ctx context.Context, ids []uint) error {
	return r.db.WithContext(ctx).Where("category_id IN (?)", ids).Delete(&model.CategoryAttrGroup{}).Error
}

func (r *categoryAttrGroupRepository) FindByCategoryID(ctx context.Context, id int64) ([]model.CategoryAttrGroup, error) {
	var categoryAttrGroups []model.CategoryAttrGroup
	if err := r.db.WithContext(ctx).Where("category_id = ?", id).Find(&categoryAttrGroups).Error; err != nil {
		return nil, err
	}
	return categoryAttrGroups, nil
}

func (r *categoryAttrGroupRepository) Create(ctx context.Context, categoryAttrGroup *model.CategoryAttrGroup) (uint, error) {
	err := r.db.WithContext(ctx).Create(categoryAttrGroup).Error
	if err != nil {
		return 0, err
	}
	return categoryAttrGroup.ID, nil
}
