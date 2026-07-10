package repository

import (
	"context"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type OrderLogisticsRepository interface {
	Create(ctx context.Context, row *model.OrderLogistics) error
	GetByID(ctx context.Context, id int64) (*model.OrderLogistics, error)
	GetByOrderID(ctx context.Context, orderID int64) (*model.OrderLogistics, error)
	GetByOrderCode(ctx context.Context, orderCode string) (*model.OrderLogistics, error)
	Update(ctx context.Context, row *model.OrderLogistics) error
}

type orderLogisticsRepository struct {
	*Repository
}

func NewOrderLogisticsRepository(db *gorm.DB) OrderLogisticsRepository {
	return &orderLogisticsRepository{Repository: NewRepository(db)}
}

// NewOrder_logisticsRepository 兼容 sapctl 旧命名
func NewOrder_logisticsRepository(db *gorm.DB) OrderLogisticsRepository {
	return NewOrderLogisticsRepository(db)
}

func (r *orderLogisticsRepository) Create(ctx context.Context, row *model.OrderLogistics) error {
	return r.DB(ctx).Create(row).Error
}

func (r *orderLogisticsRepository) GetByID(ctx context.Context, id int64) (*model.OrderLogistics, error) {
	var row model.OrderLogistics
	err := r.DB(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderLogisticsRepository) GetByOrderID(ctx context.Context, orderID int64) (*model.OrderLogistics, error) {
	var row model.OrderLogistics
	err := r.DB(ctx).
		Where("order_id = ? AND is_deleted = ?", orderID, 0).
		First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderLogisticsRepository) GetByOrderCode(ctx context.Context, orderCode string) (*model.OrderLogistics, error) {
	var row model.OrderLogistics
	err := r.DB(ctx).
		Where("order_code = ? AND is_deleted = ?", orderCode, 0).
		First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderLogisticsRepository) Update(ctx context.Context, row *model.OrderLogistics) error {
	return r.DB(ctx).Save(row).Error
}
