package repository

import (
	"context"
	"fmt"
	"strings"
	"time"

	"sapphire-mall/app/internal/model"
)

type ProductSkuRepository interface {
	GetProductSku(ctx context.Context, id int64) (*model.ProductSku, error)
	GetProductSkuByCode(ctx context.Context, skuCode string) (*model.ProductSku, error)
	GetProductSkuByIndexs(ctx context.Context, spuId int64, indexs string) (*model.ProductSku, error)
	ListProductSkus(ctx context.Context, productId int64) ([]*model.ProductSku, error)
	CreateProductSku(ctx context.Context, sku *model.ProductSku) error
	BatchCreateProductSkus(ctx context.Context, skus []*model.ProductSku) error
	UpdateProductSku(ctx context.Context, sku *model.ProductSku) error
	BatchUpdateProductSkus(ctx context.Context, skus []*model.ProductSku) error
	DeleteProductSku(ctx context.Context, id int64) error
	BatchDeleteProductSkus(ctx context.Context, ids []int64) error
	DeleteAllProductSkusBySpu(ctx context.Context, spuId int64, spuCode string) error
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

func (r *productSkuRepository) BatchCreateProductSkus(ctx context.Context, skus []*model.ProductSku) error {
	if len(skus) == 0 {
		return nil
	}
	return r.DB(ctx).CreateInBatches(skus, 100).Error
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
	if sku.IsDeleted != 0 {
		updateMap["is_deleted"] = sku.IsDeleted
	}
	return r.DB(ctx).
		Model(&model.ProductSku{}).
		Where("id = ?", sku.ID).
		Updates(updateMap).Error
}

// BatchUpdateProductSkus 用一条 CASE WHEN SQL 批量更新 SKU，减少远端 RDS 往返。
func (r *productSkuRepository) BatchUpdateProductSkus(ctx context.Context, skus []*model.ProductSku) error {
	if len(skus) == 0 {
		return nil
	}

	ids := make([]int64, 0, len(skus))
	for _, sku := range skus {
		ids = append(ids, sku.ID)
	}

	args := make([]interface{}, 0, len(skus)*14+len(skus))
	appendCase := func(b *strings.Builder, get func(*model.ProductSku) interface{}) {
		for _, sku := range skus {
			b.WriteString("WHEN ? THEN ? ")
			args = append(args, sku.ID, get(sku))
		}
	}

	var (
		spuCodeCase   strings.Builder
		skuCodeCase   strings.Builder
		priceCase     strings.Builder
		stockCase     strings.Builder
		statusCase    strings.Builder
		indexsCase    strings.Builder
		attrCase      strings.Builder
		ownerCase     strings.Builder
		imagesCase    strings.Builder
		titleCase     strings.Builder
		subTitleCase  strings.Builder
		descCase      strings.Builder
		updatedAtCase strings.Builder
		updatorCase   strings.Builder
	)

	appendCase(&spuCodeCase, func(s *model.ProductSku) interface{} { return s.ProductSpuCode })
	appendCase(&skuCodeCase, func(s *model.ProductSku) interface{} { return s.SkuCode })
	appendCase(&priceCase, func(s *model.ProductSku) interface{} { return s.Price })
	appendCase(&stockCase, func(s *model.ProductSku) interface{} { return s.Stock })
	appendCase(&statusCase, func(s *model.ProductSku) interface{} { return s.Status })
	appendCase(&indexsCase, func(s *model.ProductSku) interface{} { return s.Indexs })
	appendCase(&attrCase, func(s *model.ProductSku) interface{} { return s.AttrParams })
	appendCase(&ownerCase, func(s *model.ProductSku) interface{} { return s.OwnerParams })
	appendCase(&imagesCase, func(s *model.ProductSku) interface{} { return s.Images })
	appendCase(&titleCase, func(s *model.ProductSku) interface{} { return s.Title })
	appendCase(&subTitleCase, func(s *model.ProductSku) interface{} { return s.SubTitle })
	appendCase(&descCase, func(s *model.ProductSku) interface{} { return s.Description })
	appendCase(&updatedAtCase, func(s *model.ProductSku) interface{} {
		if s.UpdatedAt.IsZero() {
			return time.Now()
		}
		return s.UpdatedAt
	})
	appendCase(&updatorCase, func(s *model.ProductSku) interface{} { return s.Updator })

	placeholders := make([]string, len(ids))
	for i, id := range ids {
		placeholders[i] = "?"
		args = append(args, id)
	}

	sql := fmt.Sprintf(`
UPDATE sys_product_sku SET
	product_spu_code = CASE id %s END,
	sku_code = CASE id %s END,
	price = CASE id %s END,
	stock = CASE id %s END,
	status = CASE id %s END,
	indexs = CASE id %s END,
	attr_params = CASE id %s END,
	owner_params = CASE id %s END,
	images = CASE id %s END,
	title = CASE id %s END,
	sub_title = CASE id %s END,
	description = CASE id %s END,
	updated_at = CASE id %s END,
	updator = CASE id %s END,
	is_deleted = 0
WHERE id IN (%s)`,
		spuCodeCase.String(),
		skuCodeCase.String(),
		priceCase.String(),
		stockCase.String(),
		statusCase.String(),
		indexsCase.String(),
		attrCase.String(),
		ownerCase.String(),
		imagesCase.String(),
		titleCase.String(),
		subTitleCase.String(),
		descCase.String(),
		updatedAtCase.String(),
		updatorCase.String(),
		strings.Join(placeholders, ","),
	)

	return r.DB(ctx).Exec(sql, args...).Error
}

func (r *productSkuRepository) DeleteProductSku(ctx context.Context, id int64) error {
	return r.DB(ctx).
		Where("id = ?", id).
		Delete(&model.ProductSku{}).Error
}

func (r *productSkuRepository) BatchDeleteProductSkus(ctx context.Context, ids []int64) error {
	if len(ids) == 0 {
		return nil
	}
	return r.DB(ctx).
		Where("id IN ?", ids).
		Delete(&model.ProductSku{}).Error
}

// DeleteAllProductSkusBySpu 物理删除指定SPU的所有SKU
func (r *productSkuRepository) DeleteAllProductSkusBySpu(ctx context.Context, spuId int64, spuCode string) error {
	return r.DB(ctx).
		Where("product_spu_id = ? AND product_spu_code = ?", spuId, spuCode).
		Delete(&model.ProductSku{}).Error
}
