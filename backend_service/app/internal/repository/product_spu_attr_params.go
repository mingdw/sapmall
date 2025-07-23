package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
)

type ProductSpuAttrParamsRepository interface {
	GetProductSpuAttrParams(ctx context.Context, spuId int64) ([]*model.ProductSpuAttrParams, error)
	CreateProductSpuAttrParams(ctx context.Context, params *model.ProductSpuAttrParams) error
	BatchCreateProductSpuAttrParams(ctx context.Context, params []*model.ProductSpuAttrParams) error
	UpdateProductSpuAttrParams(ctx context.Context, params *model.ProductSpuAttrParams) error
	DeleteProductSpuAttrParams(ctx context.Context, spuId int64) error
}

func NewProductSpuAttrParamsRepository(r *Repository) ProductSpuAttrParamsRepository {
	return &productSpuAttrParamsRepository{Repository: r}
}

type productSpuAttrParamsRepository struct {
	*Repository
}

func (r *productSpuAttrParamsRepository) GetProductSpuAttrParams(ctx context.Context, spuId int64) ([]*model.ProductSpuAttrParams, error) {
	var params []*model.ProductSpuAttrParams
	err := r.DB(ctx).
		Where("spu_id = ? AND is_deleted = ?", spuId, 0).
		Find(&params).Error
	if err != nil {
		return nil, err
	}
	return params, nil
}

func (r *productSpuAttrParamsRepository) CreateProductSpuAttrParams(ctx context.Context, params *model.ProductSpuAttrParams) error {
	return r.DB(ctx).Create(params).Error
}

func (r *productSpuAttrParamsRepository) BatchCreateProductSpuAttrParams(ctx context.Context, params []*model.ProductSpuAttrParams) error {
	return r.DB(ctx).Create(params).Error
}

func (r *productSpuAttrParamsRepository) UpdateProductSpuAttrParams(ctx context.Context, params *model.ProductSpuAttrParams) error {
	return r.DB(ctx).
		Where("id = ?", params.ID).
		Updates(map[string]interface{}{
			"updated_at": params.UpdatedAt,
		}).Error
}

func (r *productSpuAttrParamsRepository) DeleteProductSpuAttrParams(ctx context.Context, spuId int64) error {
	return r.DB(ctx).
		Model(&model.ProductSpuAttrParams{}).
		Where("spu_id = ?", spuId).
		Update("is_deleted", 1).Error
}
