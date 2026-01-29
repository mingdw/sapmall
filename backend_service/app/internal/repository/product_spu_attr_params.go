package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
)

type ProductSpuAttrParamsRepository interface {
	GetProductSpuAttrParams(ctx context.Context, spuId int64, attrType int) ([]*model.ProductSpuAttrParams, error)
	GetAllProductSpuAttrParams(ctx context.Context, spuId int64) ([]*model.ProductSpuAttrParams, error) // 一次性查询所有属性（按 attr_type 分组）
	GetProductSpuAttrParamByID(ctx context.Context, id int64) (*model.ProductSpuAttrParams, error)
	GetProductSpuAttrParamByCode(ctx context.Context, spuId int64, code string, attrType int) (*model.ProductSpuAttrParams, error)
	CreateProductSpuAttrParams(ctx context.Context, params *model.ProductSpuAttrParams) error
	BatchCreateProductSpuAttrParams(ctx context.Context, params []*model.ProductSpuAttrParams) error
	UpdateProductSpuAttrParams(ctx context.Context, params *model.ProductSpuAttrParams) error
	DeleteProductSpuAttrParams(ctx context.Context, id int64) error
	BatchDeleteProductSpuAttrParams(ctx context.Context, ids []int64) error
	ListProductSpuAttrParams(ctx context.Context, spuId int64, spuCode string, attrType int, status int, page, pageSize int) ([]*model.ProductSpuAttrParams, int64, error)
}

func NewProductSpuAttrParamsRepository(r *Repository) ProductSpuAttrParamsRepository {
	return &productSpuAttrParamsRepository{Repository: r}
}

type productSpuAttrParamsRepository struct {
	*Repository
}

func (r *productSpuAttrParamsRepository) GetProductSpuAttrParams(ctx context.Context, spuId int64, attrType int) ([]*model.ProductSpuAttrParams, error) {
	var params []*model.ProductSpuAttrParams
	query := r.DB(ctx).Where("product_spu_id = ? AND is_deleted = ?", spuId, 0)
	if attrType > 0 {
		query = query.Where("attr_type = ?", attrType)
	}
	err := query.Find(&params).Error
	if err != nil {
		return nil, err
	}
	return params, nil
}

// GetAllProductSpuAttrParams 一次性查询商品的所有属性（基础属性、销售属性、规格属性）
// 返回结果按 attr_type 排序，便于后续分组处理
func (r *productSpuAttrParamsRepository) GetAllProductSpuAttrParams(ctx context.Context, spuId int64) ([]*model.ProductSpuAttrParams, error) {
	var params []*model.ProductSpuAttrParams
	err := r.DB(ctx).
		Where("product_spu_id = ? AND is_deleted = ? AND attr_type IN ?", spuId, 0, []int{1, 2, 3}).
		Order("attr_type ASC, sort ASC, id ASC").
		Find(&params).Error
	if err != nil {
		return nil, err
	}
	return params, nil
}

func (r *productSpuAttrParamsRepository) GetProductSpuAttrParamByID(ctx context.Context, id int64) (*model.ProductSpuAttrParams, error) {
	var param model.ProductSpuAttrParams
	err := r.DB(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&param).Error
	if err != nil {
		return nil, err
	}
	return &param, nil
}

func (r *productSpuAttrParamsRepository) GetProductSpuAttrParamByCode(ctx context.Context, spuId int64, code string, attrType int) (*model.ProductSpuAttrParams, error) {
	var param model.ProductSpuAttrParams
	err := r.DB(ctx).
		Where("product_spu_id = ? AND code = ? AND attr_type = ? AND is_deleted = ?", spuId, code, attrType, 0).
		First(&param).Error
	if err != nil {
		return nil, err
	}
	return &param, nil
}

func (r *productSpuAttrParamsRepository) CreateProductSpuAttrParams(ctx context.Context, params *model.ProductSpuAttrParams) error {
	return r.DB(ctx).Create(params).Error
}

func (r *productSpuAttrParamsRepository) BatchCreateProductSpuAttrParams(ctx context.Context, params []*model.ProductSpuAttrParams) error {
	return r.DB(ctx).Create(params).Error
}

func (r *productSpuAttrParamsRepository) UpdateProductSpuAttrParams(ctx context.Context, params *model.ProductSpuAttrParams) error {
	return r.DB(ctx).
		Model(&model.ProductSpuAttrParams{}).
		Where("id = ?", params.ID).
		Updates(map[string]interface{}{
			"product_spu_id":   params.ProductSpuID,
			"product_spu_code": params.ProductSpuCode,
			"code":             params.Code,
			"name":             params.Name,
			"attr_type":        params.AttrType,
			"value_type":       params.ValueType,
			"value":            params.Value,
			"sort":             params.Sort,
			"status":           params.Status,
			"is_required":      params.IsRequired,
			"is_generic":       params.IsGeneric,
			"updated_at":       params.UpdatedAt,
			"updator":          params.Updator,
		}).Error
}

func (r *productSpuAttrParamsRepository) DeleteProductSpuAttrParams(ctx context.Context, id int64) error {
	return r.DB(ctx).
		Model(&model.ProductSpuAttrParams{}).
		Where("id = ?", id).
		Update("is_deleted", 1).Error
}

func (r *productSpuAttrParamsRepository) BatchDeleteProductSpuAttrParams(ctx context.Context, ids []int64) error {
	return r.DB(ctx).
		Model(&model.ProductSpuAttrParams{}).
		Where("id IN ?", ids).
		Update("is_deleted", 1).Error
}

func (r *productSpuAttrParamsRepository) ListProductSpuAttrParams(ctx context.Context, spuId int64, spuCode string, attrType int, status int, page, pageSize int) ([]*model.ProductSpuAttrParams, int64, error) {
	var params []*model.ProductSpuAttrParams
	var total int64

	query := r.DB(ctx).Model(&model.ProductSpuAttrParams{}).Where("is_deleted = ?", 0)

	if spuId > 0 {
		query = query.Where("product_spu_id = ?", spuId)
	}
	if spuCode != "" {
		query = query.Where("product_spu_code = ?", spuCode)
	}
	if attrType > 0 {
		// 如果明确指定了属性类型，则查询指定类型
		query = query.Where("attr_type = ?", attrType)
	} else {
		// 如果未指定属性类型（attrType = 0 或未传入），默认只查询基础属性和销售属性（不包含规格属性）
		query = query.Where("attr_type IN ?", []int{1, 2})
	}
	if status >= 0 {
		query = query.Where("status = ?", status)
	}

	// 获取总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 分页查询
	offset := (page - 1) * pageSize
	err := query.Order("sort ASC, id ASC").Offset(offset).Limit(pageSize).Find(&params).Error
	if err != nil {
		return nil, 0, err
	}

	return params, total, nil
}
