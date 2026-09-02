package repository

import (
	"context"
	"errors"
	"strings"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type ProductRepository interface {
	GetProduct(ctx context.Context, id int64) (*model.Product, error)
	GetProductByCode(ctx context.Context, code string) (*model.Product, error)
	ListProductsByCategoryCodes(ctx context.Context, categoryCodes []string, productName string, attrFilters []AttrFilterCondition, page, pageSize int) ([]*model.Product, int64, error)
	GetCategories(ctx context.Context, categoryCodes []string) ([]*model.Category, error)
	//GetProductSpuRepository() ProductSpuRepository
	GetProductsBycategoryCode(ctx context.Context, categoryCode string, productName string, attrFilters []AttrFilterCondition, page, pageSize int) ([]*model.Product, int64, error)
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) loadProductRelations(
	ctx context.Context,
	db *gorm.DB,
	spuID int64,
	product *model.Product,
) error {
	product.SKUs = nil
	product.SPUDetail = nil
	product.SPUAttrParams = nil

	var skus []*model.ProductSku
	if err := db.Model(&model.ProductSku{}).
		Where("product_spu_id = ?", spuID).
		Find(&skus).Error; err != nil {
		return err
	}
	if len(skus) > 0 {
		product.SKUs = skus
	}

	var detail model.ProductSpuDetail
	err := db.Model(&model.ProductSpuDetail{}).
		Where("product_spu_id = ?", spuID).
		First(&detail).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
	} else {
		product.SPUDetail = &detail
	}

	var attrs []*model.ProductSpuAttrParams
	if err := db.Model(&model.ProductSpuAttrParams{}).
		Where("product_spu_id = ?", spuID).
		Find(&attrs).Error; err != nil {
		return err
	}
	if len(attrs) > 0 {
		product.SPUAttrParams = attrs
	}

	return nil
}

func (r *productRepository) GetProduct(ctx context.Context, id int64) (*model.Product, error) {
	var product model.Product
	var spu model.ProductSpu

	db := r.db.WithContext(ctx)

	err := db.Model(&model.ProductSpu{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		First(&spu).Error
	if err != nil {
		return nil, err
	}
	product.SPU = &spu

	if err := r.loadProductRelations(ctx, db, spu.ID, &product); err != nil {
		return nil, err
	}

	return &product, nil
}

func (r *productRepository) GetProductByCode(ctx context.Context, code string) (*model.Product, error) {
	var product model.Product
	var spu model.ProductSpu

	db := r.db.WithContext(ctx)
	code = strings.TrimSpace(code)

	err := db.Model(&model.ProductSpu{}).
		Where("code = ? AND is_deleted = ?", code, 0).
		First(&spu).Error
	if err != nil {
		return nil, err
	}
	product.SPU = &spu

	if err := r.loadProductRelations(ctx, db, spu.ID, &product); err != nil {
		return nil, err
	}

	return &product, nil
}

// buildListProductsFromSpus 列表接口仅返回 SPU 字段，不加载 SKU / 属性（详情走 GetProduct* + loadProductRelations）。
func buildListProductsFromSpus(spus []*model.ProductSpu) []*model.Product {
	products := make([]*model.Product, 0, len(spus))
	for _, spu := range spus {
		products = append(products, &model.Product{
			SPU:           spu,
			SKUs:          []*model.ProductSku{},
			SPUAttrParams: []*model.ProductSpuAttrParams{},
		})
	}
	return products
}

func (r *productRepository) listProductSpus(
	ctx context.Context,
	categoryCodes []string,
	singleCategoryCode string,
	productName string,
	attrFilters []AttrFilterCondition,
	page,
	pageSize int,
) ([]*model.ProductSpu, int64, error) {
	query := r.db.WithContext(ctx).Model(&model.ProductSpu{}).
		Where("is_deleted = ?", 0)

	if singleCategoryCode != "" {
		query = query.Where(
			"category1_code = ? OR category2_code = ? OR category3_code = ?",
			singleCategoryCode, singleCategoryCode, singleCategoryCode,
		)
	} else if len(categoryCodes) > 0 {
		query = query.Where(
			"category1_code IN ? OR category2_code IN ? OR category3_code IN ?",
			categoryCodes, categoryCodes, categoryCodes,
		)
	}

	if productName != "" {
		query = query.Where("name LIKE ?", "%"+productName+"%")
	}

	query = applyAttrFilters(query, attrFilters)

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var spus []*model.ProductSpu
	if err := query.Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&spus).Error; err != nil {
		return nil, 0, err
	}

	return spus, total, nil
}

func (r *productRepository) ListProductsByCategoryCodes(
	ctx context.Context,
	categoryCodes []string,
	productName string,
	attrFilters []AttrFilterCondition,
	page,
	pageSize int,
) ([]*model.Product, int64, error) {
	spus, total, err := r.listProductSpus(ctx, categoryCodes, "", productName, attrFilters, page, pageSize)
	if err != nil {
		return nil, 0, err
	}
	return buildListProductsFromSpus(spus), total, nil
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

func (r *productRepository) GetProductsBycategoryCode(ctx context.Context, categoryCode string, productName string, attrFilters []AttrFilterCondition, page, pageSize int) ([]*model.Product, int64, error) {
	spus, total, err := r.listProductSpus(ctx, nil, categoryCode, productName, attrFilters, page, pageSize)
	if err != nil {
		return nil, 0, err
	}
	return buildListProductsFromSpus(spus), total, nil
}
