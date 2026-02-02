package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
)

type ProductSkuRepository interface {
	GetProductSku(ctx context.Context, id int64) (*model.ProductSku, error)
	GetProductSkuByCode(ctx context.Context, skuCode string) (*model.ProductSku, error)
	GetProductSkuByIndexs(ctx context.Context, spuId int64, indexs string) (*model.ProductSku, error) // 根据SPU ID和indexs查询SKU
	ListProductSkus(ctx context.Context, productId int64) ([]*model.ProductSku, error)
	CreateProductSku(ctx context.Context, sku *model.ProductSku) error
	UpdateProductSku(ctx context.Context, sku *model.ProductSku) error
	DeleteProductSku(ctx context.Context, id int64) error
	DeleteAllProductSkusBySpu(ctx context.Context, spuId int64, spuCode string) error // 物理删除指定SPU的所有SKU
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

func (r *productSkuRepository) GetProductSkuByCode(ctx context.Context, skuCode string) (*model.ProductSku, error) {
	var sku model.ProductSku
	err := r.DB(ctx).
		Where("sku_code = ?", skuCode).
		First(&sku).Error
	if err != nil {
		return nil, err
	}
	return &sku, nil
}

// GetProductSkuByIndexs 根据SPU ID和indexs查询SKU（用于匹配现有SKU，避免ID浪费）
func (r *productSkuRepository) GetProductSkuByIndexs(ctx context.Context, spuId int64, indexs string) (*model.ProductSku, error) {
	var sku model.ProductSku
	err := r.DB(ctx).
		Where("product_spu_id = ? AND indexs = ? AND is_deleted = ?", spuId, indexs, 0).
		First(&sku).Error
	if err != nil {
		return nil, err
	}
	return &sku, nil
}

func (r *productSkuRepository) ListProductSkus(ctx context.Context, productId int64) ([]*model.ProductSku, error) {
	var skus []*model.ProductSku
	err := r.DB(ctx).
		Where("product_spu_id = ? AND is_deleted = ?", productId, 0).
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
	updateMap := map[string]interface{}{
		"product_spu_code": sku.ProductSpuCode,
		"sku_code":         sku.SkuCode,
		"price":            sku.Price,
		"stock":            sku.Stock,
		"status":           sku.Status,
		"indexs":           sku.Indexs,
		"attr_params":      sku.AttrParams,
		"owner_params":     sku.OwnerParams,
		"images":           sku.Images,
		"title":            sku.Title,
		"sub_title":        sku.SubTitle,
		"description":      sku.Description,
		"updated_at":       sku.UpdatedAt,
		"updator":          sku.Updator,
	}
	// 如果IsDeleted字段被设置，也更新它
	if sku.IsDeleted != 0 {
		updateMap["is_deleted"] = sku.IsDeleted
	}
	return r.DB(ctx).
		Model(&model.ProductSku{}).
		Where("id = ?", sku.ID).
		Updates(updateMap).Error
}

func (r *productSkuRepository) DeleteProductSku(ctx context.Context, id int64) error {
	return r.DB(ctx).
		Where("id = ?", id).
		Delete(&model.ProductSku{}).Error
}

// DeleteAllProductSkusBySpu 物理删除指定SPU的所有SKU
func (r *productSkuRepository) DeleteAllProductSkusBySpu(ctx context.Context, spuId int64, spuCode string) error {
	return r.DB(ctx).
		Where("product_spu_id = ? AND product_spu_code = ?", spuId, spuCode).
		Delete(&model.ProductSku{}).Error
}
