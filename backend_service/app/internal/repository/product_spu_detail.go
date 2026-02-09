package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
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
		Where("product_spu_id = ? AND is_deleted = ?", spuId, 0).
		First(&detail).Error
	if err != nil {
		// 如果记录不存在，返回空结构体而不是报错
		if err == gorm.ErrRecordNotFound {
			return &model.ProductSpuDetail{}, nil
		}
		// 其他错误正常返回
		return nil, err
	}
	return &detail, nil
}

func (r *productSpuDetailRepository) CreateProductSpuDetail(ctx context.Context, detail *model.ProductSpuDetail) error {
	return r.DB(ctx).Create(detail).Error
}

func (r *productSpuDetailRepository) UpdateProductSpuDetail(ctx context.Context, detail *model.ProductSpuDetail) error {
	return r.DB(ctx).
		Model(&model.ProductSpuDetail{}).
		Where("product_spu_id = ?", detail.ProductSpuID).
		Updates(map[string]interface{}{
			"detail":       detail.Detail,
			"packing_list": detail.PackingList,
			"after_sale":   detail.AfterSale,
			"updated_at":   detail.UpdatedAt,
			"updator":      detail.Updator,
		}).Error
}

func (r *productSpuDetailRepository) DeleteProductSpuDetail(ctx context.Context, spuId int64) error {
	return r.DB(ctx).
		Model(&model.ProductSpuDetail{}).
		Where("product_spu_id = ?", spuId).
		Update("is_deleted", 1).Error
}
