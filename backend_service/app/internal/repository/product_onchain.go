package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
	"gorm.io/gorm"
)

// Product_onchainRepository Product_onchain 数据访问接口
type Product_onchainRepository interface {
	Create(ctx context.Context, product_onchain *model.Product_onchain) error
	GetByID(ctx context.Context, id int64) (*model.Product_onchain, error)
	Update(ctx context.Context, product_onchain *model.Product_onchain) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, offset, limit int) ([]*model.Product_onchain, int64, error)
}

// product_onchainRepository Product_onchain 数据访问实现
type product_onchainRepository struct {
	db *gorm.DB
}

// NewProduct_onchainRepository 创建 Product_onchain repository
func NewProduct_onchainRepository(db *gorm.DB) Product_onchainRepository {
	return &product_onchainRepository{db: db}
}

// Create 创建 Product_onchain
func (r *product_onchainRepository) Create(ctx context.Context, product_onchain *model.Product_onchain) error {
	return r.db.WithContext(ctx).Create(product_onchain).Error
}

// GetByID 根据ID获取 Product_onchain
func (r *product_onchainRepository) GetByID(ctx context.Context, id int64) (*model.Product_onchain, error) {
	var product_onchain model.Product_onchain
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&product_onchain).Error
	if err != nil {
		return nil, err
	}
	return &product_onchain, nil
}

// Update 更新 Product_onchain
func (r *product_onchainRepository) Update(ctx context.Context, product_onchain *model.Product_onchain) error {
	return r.db.WithContext(ctx).Save(product_onchain).Error
}

// Delete 删除 Product_onchain
func (r *product_onchainRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Product_onchain{}).Error
}

// List 获取 Product_onchain 列表
func (r *product_onchainRepository) List(ctx context.Context, offset, limit int) ([]*model.Product_onchain, int64, error) {
	var product_onchains []*model.Product_onchain
	var total int64
	
	// 获取总数
	if err := r.db.WithContext(ctx).Model(&model.Product_onchain{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	// 获取列表
	if err := r.db.WithContext(ctx).Offset(offset).Limit(limit).Find(&product_onchains).Error; err != nil {
		return nil, 0, err
	}
	
	return product_onchains, total, nil
}
