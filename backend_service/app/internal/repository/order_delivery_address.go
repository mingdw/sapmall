package repository

import (
	"context"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type OrderDeliveryAddressRepository interface {
	Create(ctx context.Context, orderDeliveryAddress *model.OrderDeliveryAddress) error
	GetByID(ctx context.Context, id int64) (*model.OrderDeliveryAddress, error)
	GetByOrderID(ctx context.Context, orderID int64) (*model.OrderDeliveryAddress, error)
	GetByOrderCode(ctx context.Context, orderCode string) (*model.OrderDeliveryAddress, error)
	Update(ctx context.Context, orderDeliveryAddress *model.OrderDeliveryAddress) error
	Delete(ctx context.Context, id int64) error
	SoftDeleteByOrderID(ctx context.Context, orderID int64, updator string) error
}

type orderDeliveryAddressRepository struct {
	*Repository
}

func NewOrderDeliveryAddressRepository(db *gorm.DB) OrderDeliveryAddressRepository {
	return &orderDeliveryAddressRepository{Repository: NewRepository(db)}
}

func (r *orderDeliveryAddressRepository) Create(ctx context.Context, orderDeliveryAddress *model.OrderDeliveryAddress) error {
	return r.DB(ctx).Create(orderDeliveryAddress).Error
}

func (r *orderDeliveryAddressRepository) GetByID(ctx context.Context, id int64) (*model.OrderDeliveryAddress, error) {
	var row model.OrderDeliveryAddress
	err := r.DB(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderDeliveryAddressRepository) GetByOrderID(ctx context.Context, orderID int64) (*model.OrderDeliveryAddress, error) {
	var row model.OrderDeliveryAddress
	err := r.DB(ctx).
		Where("order_id = ? AND is_deleted = ?", orderID, 0).
		First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderDeliveryAddressRepository) GetByOrderCode(ctx context.Context, orderCode string) (*model.OrderDeliveryAddress, error) {
	var row model.OrderDeliveryAddress
	err := r.DB(ctx).
		Where("order_code = ? AND is_deleted = ?", orderCode, 0).
		First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderDeliveryAddressRepository) Update(ctx context.Context, orderDeliveryAddress *model.OrderDeliveryAddress) error {
	return r.DB(ctx).Save(orderDeliveryAddress).Error
}

func (r *orderDeliveryAddressRepository) Delete(ctx context.Context, id int64) error {
	return r.DB(ctx).Where("id = ?", id).Delete(&model.OrderDeliveryAddress{}).Error
}

func (r *orderDeliveryAddressRepository) SoftDeleteByOrderID(ctx context.Context, orderID int64, updator string) error {
	return r.DB(ctx).
		Model(&model.OrderDeliveryAddress{}).
		Where("order_id = ? AND is_deleted = ?", orderID, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}
