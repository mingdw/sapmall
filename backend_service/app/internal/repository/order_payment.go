package repository

import (
	"context"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type OrderPaymentRepository interface {
	Create(ctx context.Context, orderPayment *model.OrderPayment) error
	GetByID(ctx context.Context, id int64) (*model.OrderPayment, error)
	GetByIntentId(ctx context.Context, intentId string) (*model.OrderPayment, error)
	GetByTxHash(ctx context.Context, txHash string) (*model.OrderPayment, error)
	GetByOrderID(ctx context.Context, orderID int64) (*model.OrderPayment, error)
	ListByOrderIDs(ctx context.Context, orderIDs []int64) (map[int64]*model.OrderPayment, error)
	Update(ctx context.Context, orderPayment *model.OrderPayment) error
	UpdateColumnsByOrderID(ctx context.Context, orderID int64, updates map[string]interface{}) error
	SoftDeleteByOrderID(ctx context.Context, orderID int64, updator string) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, offset, limit int) ([]*model.OrderPayment, int64, error)
}

type orderPaymentRepository struct {
	*Repository
}

func NewOrderPaymentRepository(db *gorm.DB) OrderPaymentRepository {
	return &orderPaymentRepository{Repository: NewRepository(db)}
}

// NewOrder_paymentRepository 兼容旧命名
func NewOrder_paymentRepository(db *gorm.DB) OrderPaymentRepository {
	return NewOrderPaymentRepository(db)
}

func (r *orderPaymentRepository) Create(ctx context.Context, orderPayment *model.OrderPayment) error {
	return r.DB(ctx).Create(orderPayment).Error
}

func (r *orderPaymentRepository) GetByID(ctx context.Context, id int64) (*model.OrderPayment, error) {
	var row model.OrderPayment
	err := r.DB(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderPaymentRepository) GetByIntentId(ctx context.Context, intentId string) (*model.OrderPayment, error) {
	var row model.OrderPayment
	err := r.DB(ctx).Where("intent_id = ? AND is_deleted = ?", intentId, 0).First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderPaymentRepository) GetByTxHash(ctx context.Context, txHash string) (*model.OrderPayment, error) {
	var row model.OrderPayment
	err := r.DB(ctx).Where("tx_hash = ? AND is_deleted = ?", txHash, 0).First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderPaymentRepository) GetByOrderID(ctx context.Context, orderID int64) (*model.OrderPayment, error) {
	var row model.OrderPayment
	err := r.DB(ctx).
		Where("order_id = ? AND is_deleted = ?", orderID, 0).
		First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderPaymentRepository) ListByOrderIDs(ctx context.Context, orderIDs []int64) (map[int64]*model.OrderPayment, error) {
	result := make(map[int64]*model.OrderPayment)
	if len(orderIDs) == 0 {
		return result, nil
	}
	var rows []*model.OrderPayment
	if err := r.DB(ctx).
		Where("order_id IN ? AND is_deleted = ?", orderIDs, 0).
		Find(&rows).Error; err != nil {
		return nil, err
	}
	for _, row := range rows {
		result[row.OrderId] = row
	}
	return result, nil
}

func (r *orderPaymentRepository) Update(ctx context.Context, orderPayment *model.OrderPayment) error {
	return r.DB(ctx).Save(orderPayment).Error
}

func (r *orderPaymentRepository) UpdateColumnsByOrderID(ctx context.Context, orderID int64, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.DB(ctx).
		Model(&model.OrderPayment{}).
		Where("order_id = ? AND is_deleted = ?", orderID, 0).
		Updates(updates).Error
}

func (r *orderPaymentRepository) SoftDeleteByOrderID(ctx context.Context, orderID int64, updator string) error {
	return r.DB(ctx).
		Model(&model.OrderPayment{}).
		Where("order_id = ? AND is_deleted = ?", orderID, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}

func (r *orderPaymentRepository) Delete(ctx context.Context, id int64) error {
	return r.DB(ctx).Where("id = ?", id).Delete(&model.OrderPayment{}).Error
}

func (r *orderPaymentRepository) List(ctx context.Context, offset, limit int) ([]*model.OrderPayment, int64, error) {
	var rows []*model.OrderPayment
	var total int64

	db := r.DB(ctx).Model(&model.OrderPayment{}).Where("is_deleted = ?", 0)
	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := db.Order("id DESC").Offset(offset).Limit(limit).Find(&rows).Error; err != nil {
		return nil, 0, err
	}
	return rows, total, nil
}
