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
	GetMaxID(ctx context.Context) (int64, error)
	GetProductSpuByCode(ctx context.Context, code string) (*model.ProductSpu, error)
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
	// 注意：表结构中无 product_id 字段，此处使用 id 字段查询
	// 如需根据用户查询，请使用 user_id 字段
	err := r.DB(ctx).Where("id = ? AND is_deleted = ?", productId, 0).
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
	return r.DB(ctx).Model(&model.ProductSpu{}).
		Where("id = ?", spu.ID).
		Updates(map[string]interface{}{
			"code":          spu.Code,
			"name":          spu.Name,
			"category1_id": spu.Category1ID,
			"category1_code": spu.Category1Code,
			"category2_id": spu.Category2ID,
			"category2_code": spu.Category2Code,
			"category3_id": spu.Category3ID,
			"category3_code": spu.Category3Code,
			"user_id":      spu.UserID,
			"user_code":    spu.UserCode,
			"total_sales":  spu.TotalSales,
			"total_stock":  spu.TotalStock,
			"brand":        spu.Brand,
			"description": spu.Description,
			"price":        spu.Price,
			"real_price":   spu.RealPrice,
			"status":       spu.Status,
			"chain_status": spu.ChainStatus,
			"chain_id":     spu.ChainID,
			"chain_tx_hash": spu.ChainTxHash,
			"images":       spu.Images,
			"updated_at":   spu.UpdatedAt,
			"updator":      spu.Updator,
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

// GetMaxID 获取最大ID，用于生成编码
func (r *productSpuRepository) GetMaxID(ctx context.Context) (int64, error) {
	var maxID *int64
	err := r.DB(ctx).Model(&model.ProductSpu{}).Select("MAX(id)").Scan(&maxID).Error
	if err != nil {
		return 0, err
	}
	if maxID == nil {
		return 0, nil
	}
	return *maxID, nil
}

// GetProductSpuByCode 根据编码获取商品
func (r *productSpuRepository) GetProductSpuByCode(ctx context.Context, code string) (*model.ProductSpu, error) {
	var spu model.ProductSpu
	err := r.DB(ctx).Where("code = ? AND is_deleted = ?", code, 0).First(&spu).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &spu, nil
}
