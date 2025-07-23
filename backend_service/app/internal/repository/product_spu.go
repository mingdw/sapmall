package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type ProductSpuRepository interface {
	GetProductSpu(ctx context.Context, id int64) (*model.ProductSpu, error)
	ListProductSpus(ctx context.Context, productId int64) ([]*model.ProductSpu, error)
	CreateProductSpu(ctx context.Context, spu *model.ProductSpu) error
	UpdateProductSpu(ctx context.Context, spu *model.ProductSpu) error
	DeleteProductSpu(ctx context.Context, id int64) error
	DB(ctx context.Context) *gorm.DB
	ListProductsByCategoryCodes(ctx context.Context, categoryCodes []string, productName string, page, pageSize int) ([]*model.ProductSpu, int64, error)
}

func NewProductSpuRepository(
	r *Repository,
) ProductSpuRepository {
	return &productSpuRepository{
		Repository: r,
	}
}

type productSpuRepository struct {
	*Repository
}

func (r *productSpuRepository) GetProductSpu(ctx context.Context, id int64) (*model.ProductSpu, error) {
	var spu model.ProductSpu
	err := r.DB(ctx).Where("id = ? AND is_deleted = ?", id, 0).
		First(&spu).Error
	if err != nil {
		return nil, err
	}
	return &spu, nil
}

func (r *productSpuRepository) ListProductSpus(ctx context.Context, productId int64) ([]*model.ProductSpu, error) {
	var spus []*model.ProductSpu
	err := r.DB(ctx).Where("product_id = ? AND is_deleted = ?", productId, 0).
		Find(&spus).Error
	if err != nil {
		return nil, err
	}
	return spus, nil
}

func (r *productSpuRepository) CreateProductSpu(ctx context.Context, spu *model.ProductSpu) error {
	return r.DB(ctx).Create(spu).Error
}

func (r *productSpuRepository) UpdateProductSpu(ctx context.Context, spu *model.ProductSpu) error {
	return r.DB(ctx).Where("id = ?", spu.ID).
		Updates(map[string]interface{}{
			"product_id": spu.ID,
			"name":       spu.Name,
			"status":     spu.Status,
			"updated_at": spu.UpdatedAt,
		}).Error
}

func (r *productSpuRepository) DeleteProductSpu(ctx context.Context, id int64) error {
	return r.DB(ctx).
		Model(&model.ProductSpu{}).
		Where("id = ?", id).
		Update("is_deleted", 1).Error
}

func (r *productSpuRepository) ListProductsByCategoryCodes(
	ctx context.Context,
	categoryCodes []string,
	productName string,
	page,
	pageSize int,
) ([]*model.ProductSpu, int64, error) {
	var products []*model.ProductSpu
	var total int64

	query := r.DB(ctx).Model(&model.ProductSpu{})

	if len(categoryCodes) > 0 {
		query = query.Where("category3_code IN ?", categoryCodes)
	}

	if productName != "" {
		query = query.Where("name LIKE ?", "%"+productName+"%")
	}

	// Count total before pagination
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Apply pagination
	offset := (page - 1) * pageSize
	err = query.Offset(offset).Limit(pageSize).Find(&products).Error
	if err != nil {
		return nil, 0, err
	}

	return products, total, nil
}
