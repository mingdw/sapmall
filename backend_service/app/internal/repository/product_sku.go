package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
)

type ProductSkuRepository interface {
	GetProductSku(ctx context.Context, id int64) (*model.ProductSku, error)
	ListProductSkus(ctx context.Context, productId int64) ([]*model.ProductSku, error)
	CreateProductSku(ctx context.Context, sku *model.ProductSku) error
	UpdateProductSku(ctx context.Context, sku *model.ProductSku) error
	DeleteProductSku(ctx context.Context, id int64) error
}

func NewProductSkuRepository(
	r *Repository,
) ProductSkuRepository {
	return &productSkuRepository{
		Repository: r,
	}
}

type productSkuRepository struct {
	*Repository
}

func (r *productSkuRepository) GetProductSku(ctx context.Context, id int64) (*model.ProductSku, error) {
	var sku model.ProductSku
	err := r.DB(ctx).
		Where("id = ?", id).
		First(&sku).Error
	if err != nil {
		return nil, err
	}
	return &sku, nil
}

func (r *productSkuRepository) ListProductSkus(ctx context.Context, productId int64) ([]*model.ProductSku, error) {
	var skus []*model.ProductSku
	err := r.DB(ctx).
		Where("product_id = ?", productId).
		Find(&skus).Error
	if err != nil {
		return nil, err
	}
	return skus, nil
}

func (r *productSkuRepository) CreateProductSku(ctx context.Context, sku *model.ProductSku) error {
	return r.DB(ctx).Create(sku).Error
}

func (r *productSkuRepository) UpdateProductSku(ctx context.Context, sku *model.ProductSku) error {
	return r.DB(ctx).
		Where("id = ?", sku.ID).
		Updates(map[string]interface{}{

			"sku_code":   sku.SkuCode,
			"price":      sku.Price,
			"stock":      sku.Stock,
			"status":     sku.Status,
			"updated_at": sku.UpdatedAt,
		}).Error
}

func (r *productSkuRepository) DeleteProductSku(ctx context.Context, id int64) error {
	return r.DB(ctx).
		Where("id = ?", id).
		Delete(&model.ProductSku{}).Error
}
