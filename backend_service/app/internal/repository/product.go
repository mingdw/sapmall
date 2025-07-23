package repository

import (
	"context"
	"gorm.io/gorm"
	"sapphire-mall/app/internal/model"
)

type ProductRepository interface {
	GetProduct(ctx context.Context, id int64) (*model.Product, error)
	ListProductsByCategoryCodes(ctx context.Context, categoryCodes []string, productName string, page, pageSize int) ([]*model.Product, int64, error)
	GetCategories(ctx context.Context, categoryCodes []string) ([]*model.Category, error)
	//GetProductSpuRepository() ProductSpuRepository
	GetProductsBycategoryCode(ctx context.Context, categoryCode string, productName string, page, pageSize int) ([]*model.Product, int64, error)
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) GetProduct(ctx context.Context, id int64) (*model.Product, error) {
	var product model.Product

	// 打印 SQL 语句以便调试
	db := r.db.WithContext(ctx).Debug()

	err := db.Model(&product.SPU).
		Where("id = ? AND is_deleted = ?", id, 0).
		First(&product.SPU).Error
	if err != nil {
		return nil, err
	}

	// 分别查询关联数据
	if err := db.Model(&product.SKUs).
		Where("product_spu_id = ?", id).
		Find(&product.SKUs).Error; err != nil {
		return nil, err
	}

	if err := db.Model(&product.SPUDetail).
		Where("product_spu_id = ?", id).
		First(&product.SPUDetail).Error; err != nil {
		return nil, err
	}

	if err := db.Model(&product.SPUAttrParams).
		Where("product_spu_id = ?", id).
		Find(&product.SPUAttrParams).Error; err != nil {
		return nil, err
	}

	return &product, nil
}

func (r *productRepository) ListProductsByCategoryCodes(
	ctx context.Context,
	categoryCodes []string,
	productName string,
	page,
	pageSize int,
) ([]*model.Product, int64, error) {
	var products []*model.Product
	var total int64

	// 基础查询
	query := r.db.WithContext(ctx).Debug().Model(&model.ProductSpu{}).
		Where("is_deleted = ?", 0)

	if len(categoryCodes) > 0 {
		query = query.Where("category1_code in ? OR category2_code in ? OR category3_code in ?", categoryCodes, categoryCodes, categoryCodes)
	}

	if productName != "" {
		query = query.Where("name LIKE ?", "%"+productName+"%")
	}

	// 执行 COUNT 查询
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 查询 SPU 基础数据
	var spus []*model.ProductSpu
	err = query.Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&spus).Error
	if err != nil {
		return nil, 0, err
	}

	// 如果有 SPU 数据，查询关联数据
	if len(spus) > 0 {
		for _, spu := range spus {
			// 查询 SKUs
			var skus []*model.ProductSku
			if err := r.db.WithContext(ctx).Where("product_spu_id = ? AND is_deleted = ?", spu.ID, 0).Find(&skus).Error; err != nil {
				return nil, 0, err
			}

			// 查询属性参数
			var attrParams []*model.ProductSpuAttrParams
			if err := r.db.WithContext(ctx).Where("product_spu_id = ? AND is_deleted = ?", spu.ID, 0).Find(&attrParams).Error; err != nil {
				return nil, 0, err
			}

			// 构建完整的 Product 对象
			product := &model.Product{
				SPU:           spu,
				SKUs:          skus,
				SPUAttrParams: attrParams,
			}
			products = append(products, product)
		}
	}

	return products, total, nil
}

func (r *productRepository) GetCategories(ctx context.Context, categoryCodes []string) ([]*model.Category, error) {
	var categories []*model.Category

	query := r.db.WithContext(ctx)
	if len(categoryCodes) > 0 {
		query = query.Where("code IN ?", categoryCodes)
	}

	err := query.Find(&categories).Error
	if err != nil {
		return nil, err
	}

	return categories, nil
}

//func (r *productRepository) GetProductSpuRepository() ProductSpuRepository {
//	return r.productSpuRepository
//}

func (r *productRepository) GetProductsBycategoryCode(ctx context.Context, categoryCode string, productName string, page, pageSize int) ([]*model.Product, int64, error) {

	var products []*model.Product
	var total int64

	// 基础查询
	query := r.db.WithContext(ctx).Debug().Model(&model.ProductSpu{}).
		Where("is_deleted = ?", 0)

	if categoryCode != "" {
		query = query.Where("category1_code = ? OR category2_code = ? OR category3_code = ?", categoryCode, categoryCode, categoryCode)
	}

	if productName != "" {
		query = query.Where("name LIKE ?", "%"+productName+"%")
	}

	// 执行 COUNT 查询
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 查询 SPU 基础数据
	var spus []*model.ProductSpu
	err = query.Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&spus).Error
	if err != nil {
		return nil, 0, err
	}

	// 如果有 SPU 数据，查询关联数据
	if len(spus) > 0 {
		for _, spu := range spus {
			// 查询 SKUs
			var skus []*model.ProductSku
			if err := r.db.WithContext(ctx).Where("product_spu_id = ? AND is_deleted = ?", spu.ID, 0).Find(&skus).Error; err != nil {
				return nil, 0, err
			}

			// 查询属性参数
			var attrParams []*model.ProductSpuAttrParams
			if err := r.db.WithContext(ctx).Where("product_spu_id = ? AND is_deleted = ?", spu.ID, 0).Find(&attrParams).Error; err != nil {
				return nil, 0, err
			}

			// 构建完整的 Product 对象
			product := &model.Product{
				SPU:           spu,
				SKUs:          skus,
				SPUAttrParams: attrParams,
			}
			products = append(products, product)
		}
	}

	return products, total, nil

}
