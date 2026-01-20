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
	// 根据用户编码和ID列表查询商品
	GetProductSpusByUserCode(ctx context.Context, ids []int64, userCode string) ([]*model.ProductSpu, error)
	// 批量物理删除商品
	BatchDeleteProductSpus(ctx context.Context, ids []int64) (int64, error)
	// 列表查询商品（支持多种筛选条件）
	ListProducts(ctx context.Context, userCode string, categoryCodes []string, productName, productCode string, status int, chainStatus string, startTime, endTime interface{}, page, pageSize int) ([]*model.ProductSpu, int64, error)
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
			"code":           spu.Code,
			"name":           spu.Name,
			"category1_id":   spu.Category1ID,
			"category1_code": spu.Category1Code,
			"category2_id":   spu.Category2ID,
			"category2_code": spu.Category2Code,
			"category3_id":   spu.Category3ID,
			"category3_code": spu.Category3Code,
			"user_id":        spu.UserID,
			"user_code":      spu.UserCode,
			"total_sales":    spu.TotalSales,
			"total_stock":    spu.TotalStock,
			"brand":          spu.Brand,
			"description":    spu.Description,
			"price":          spu.Price,
			"real_price":     spu.RealPrice,
			"status":         spu.Status,
			"chain_status":   spu.ChainStatus,
			"chain_id":       spu.ChainID,
			"chain_tx_hash":  spu.ChainTxHash,
			"images":         spu.Images,
			"updated_at":     spu.UpdatedAt,
			"updator":        spu.Updator,
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

// GetProductSpusByUserCode 根据用户编码和ID列表查询商品
func (r *productSpuRepository) GetProductSpusByUserCode(ctx context.Context, ids []int64, userCode string) ([]*model.ProductSpu, error) {
	var products []*model.ProductSpu
	err := r.DB(ctx).
		Where("id IN ? AND user_code = ?", ids, userCode).
		Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}

// BatchDeleteProductSpus 批量物理删除商品
func (r *productSpuRepository) BatchDeleteProductSpus(ctx context.Context, ids []int64) (int64, error) {
	result := r.DB(ctx).
		Where("id IN ?", ids).
		Delete(&model.ProductSpu{})
	if result.Error != nil {
		return 0, result.Error
	}
	return result.RowsAffected, nil
}

// ListProducts 列表查询商品（支持多种筛选条件）
func (r *productSpuRepository) ListProducts(ctx context.Context, userCode string, categoryCodes []string, productName, productCode string, status int, chainStatus string, startTime, endTime interface{}, page, pageSize int) ([]*model.ProductSpu, int64, error) {
	var products []*model.ProductSpu
	var total int64

	query := r.DB(ctx).Model(&model.ProductSpu{}).
		Where("is_deleted = ?", 0).
		Where("user_code = ?", userCode)

	// 分类编码筛选
	if len(categoryCodes) > 0 {
		query = query.Where("category1_code IN ? OR category2_code IN ? OR category3_code IN ?",
			categoryCodes, categoryCodes, categoryCodes)
	}

	// 商品名称模糊搜索
	if productName != "" {
		query = query.Where("name LIKE ?", "%"+productName+"%")
	}

	// 商品编码精确搜索
	if productCode != "" {
		query = query.Where("code = ?", productCode)
	}

	// 商品状态筛选（status >= 0 && status <= 3 时进行筛选）
	if status >= 0 && status <= 3 {
		query = query.Where("status = ?", status)
	}

	// 链上状态筛选
	if chainStatus != "" {
		query = query.Where("chain_status = ?", chainStatus)
	}

	// 时间范围筛选
	if startTime != nil {
		query = query.Where("created_at >= ?", startTime)
	}
	if endTime != nil {
		query = query.Where("created_at <= ?", endTime)
	}

	// 获取总数
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询
	offset := (page - 1) * pageSize
	err = query.Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&products).Error

	if err != nil {
		return nil, 0, err
	}

	return products, total, nil
}
