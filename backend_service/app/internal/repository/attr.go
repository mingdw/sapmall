package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type AttrRepository interface {
	FindAll(ctx context.Context) ([]model.Attr, error)
	DeleteByAttrGroupID(ctx context.Context, id int64) error
	GetAttrByCode(ctx context.Context, code string) (*model.Attr, error)
	Create(ctx context.Context, attr *model.Attr) error
	Update(ctx context.Context, attr *model.Attr) error
	Delete(ctx context.Context, id int64) error
}

func NewAttrRepository(db *gorm.DB) AttrRepository {
	return &attrRepository{
		db: db,
	}
}

type attrRepository struct {
	db *gorm.DB
}

func (r *attrRepository) FindAll(ctx context.Context) ([]model.Attr, error) {
	var attrs []model.Attr
	if err := r.db.WithContext(ctx).Find(&attrs).Error; err != nil {
		return nil, err
	}
	return attrs, nil
}

func (r *attrRepository) DeleteByAttrGroupID(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("attr_group_id = ? and is_deleted = 0  and  attr_type = 0", id).Delete(&model.Attr{}).Error
}

func (r *attrRepository) GetAttrByCode(ctx context.Context, code string) (*model.Attr, error) {
	var attr model.Attr
	if err := r.db.WithContext(ctx).Where("attr_code = ? and is_deleted = 0", code).First(&attr).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &attr, nil
}

func (r *attrRepository) Create(ctx context.Context, attr *model.Attr) error {
	return r.db.WithContext(ctx).Create(attr).Error
}

func (r *attrRepository) Update(ctx context.Context, attr *model.Attr) error {
	return r.db.WithContext(ctx).Model(&model.Attr{}).Where("id = ? and is_deleted = 0", attr.ID).Select("status", "sort", "attr_type", "updated_at", "updator").Updates(attr).Error
}

func (r *attrRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ? and is_deleted = 0", id).Delete(&model.Attr{}).Error
}
