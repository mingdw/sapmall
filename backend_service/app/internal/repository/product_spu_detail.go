package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
)

type ProductSpuDetailRepository interface {
	GetProductSpuDetail(ctx context.Context, spuId int64) (*model.ProductSpuDetail, error)
	CreateProductSpuDetail(ctx context.Context, detail *model.ProductSpuDetail) error
	UpdateProductSpuDetail(ctx context.Context, detail *model.ProductSpuDetail) error
	DeleteProductSpuDetail(ctx context.Context, spuId int64) error
}

func NewProductSpuDetailRepository(r *Repository) ProductSpuDetailRepository {
	return &productSpuDetailRepository{Repository: r}
}

type productSpuDetailRepository struct {
	*Repository
}

func (r *productSpuDetailRepository) GetProductSpuDetail(ctx context.Context, spuId int64) (*model.ProductSpuDetail, error) {
	var detail model.ProductSpuDetail
	err := r.DB(ctx).
		Where("spu_id = ? AND is_deleted = ?", spuId, 0).
		First(&detail).Error
	if err != nil {
		return nil, err
	}
	return &detail, nil
}

func (r *productSpuDetailRepository) CreateProductSpuDetail(ctx context.Context, detail *model.ProductSpuDetail) error {
	return r.DB(ctx).Create(detail).Error
}

func (r *productSpuDetailRepository) UpdateProductSpuDetail(ctx context.Context, detail *model.ProductSpuDetail) error {
	return r.DB(ctx).
		Where("spu_id = ?", detail.ID).
		Updates(map[string]interface{}{
			"updated_at": detail.UpdatedAt,
		}).Error
}

func (r *productSpuDetailRepository) DeleteProductSpuDetail(ctx context.Context, spuId int64) error {
	return r.DB(ctx).
		Model(&model.ProductSpuDetail{}).
		Where("spu_id = ?", spuId).
		Update("is_deleted", 1).Error
}
