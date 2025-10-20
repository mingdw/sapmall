package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type CategoryRepository interface {
	GetCategory(ctx context.Context, id int64) (*model.Category, error)
	FindAll(ctx context.Context, menuType int) ([]model.Category, error)
	GetCategories(ctx context.Context, categoryCodes []string) ([]*model.Category, error)
	GetCategoriesByParams(ctx context.Context, params *model.Category) ([]*model.Category, error)
	Create(ctx context.Context, category *model.Category) error
	Update(ctx context.Context, category *model.Category) error
	GetCategoryByCode(ctx context.Context, code string) (*model.Category, error)
	Delete(ctx context.Context, id int64) error
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(
	db *gorm.DB,
) CategoryRepository {
	return &categoryRepository{
		db: db,
	}
}

func (r *categoryRepository) GetCategory(ctx context.Context, id int64) (*model.Category, error) {
	var category model.Category
	if err := r.db.WithContext(ctx).Debug().Model(&category).Where("id = ?", id).Find(&category).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) FindAll(ctx context.Context, menuType int) ([]model.Category, error) {
	var categories []model.Category
	if err := r.db.WithContext(ctx).Where("is_deleted = ? and menu_type = ?", 0, menuType).Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *categoryRepository) GetCategories(ctx context.Context, categoryCodes []string) ([]*model.Category, error) {
	var categories []*model.Category
	if err := r.db.WithContext(ctx).Where("is_deleted = ?", 0).Where("code IN ?", categoryCodes).Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *categoryRepository) GetCategoriesByParams(ctx context.Context, params *model.Category) ([]*model.Category, error) {
	var categories []*model.Category
	if err := r.db.WithContext(ctx).Where("is_deleted = ?", 0).Where(params).Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *categoryRepository) Create(ctx context.Context, category *model.Category) error {
	return r.db.WithContext(ctx).Create(category).Error
}

func (r *categoryRepository) Update(ctx context.Context, category *model.Category) error {
	return r.db.WithContext(ctx).Updates(category).Error
}

func (r *categoryRepository) GetCategoryByCode(ctx context.Context, code string) (*model.Category, error) {
	var category model.Category
	if err := r.db.WithContext(ctx).Where("code = ? and is_deleted = 0", code).First(&category).Limit(1).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &category, nil
}

func (r *categoryRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ? and is_deleted = 0", id).Delete(&model.Category{}).Error
}
