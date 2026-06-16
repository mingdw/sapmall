package repository

import (
	"context"
	"time"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// OrderListFilter 订单列表筛选条件
type OrderListFilter struct {
	OrderCode      string
	UserCode       string
	UserId         *int64
	OrderStatus    *int
	PaymentStatus  *int
	OrderDateStart *time.Time
	OrderDateEnd   *time.Time
}

// OrderRepository Order 数据访问接口
type OrderRepository interface {
	Create(ctx context.Context, order *model.Order) error
	GetByID(ctx context.Context, id int64) (*model.Order, error)
	GetByOrderCode(ctx context.Context, orderCode string) (*model.Order, error)
	Update(ctx context.Context, order *model.Order) error
	UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error
	Delete(ctx context.Context, id int64) error
	SoftDelete(ctx context.Context, id int64, updator string) error
	List(ctx context.Context, offset, limit int) ([]*model.Order, int64, error)
	ListByCondition(ctx context.Context, filter OrderListFilter, offset, limit int) ([]*model.Order, int64, error)
}

type orderRepository struct {
	*Repository
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{Repository: NewRepository(db)}
}

func (r *orderRepository) Create(ctx context.Context, order *model.Order) error {
	return r.DB(ctx).Create(order).Error
}

func (r *orderRepository) GetByID(ctx context.Context, id int64) (*model.Order, error) {
	var order model.Order
	err := r.DB(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) GetByOrderCode(ctx context.Context, orderCode string) (*model.Order, error) {
	var order model.Order
	err := r.DB(ctx).Where("order_code = ? AND is_deleted = ?", orderCode, 0).First(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) Update(ctx context.Context, order *model.Order) error {
	return r.DB(ctx).Save(order).Error
}

func (r *orderRepository) UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.DB(ctx).
		Model(&model.Order{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(updates).Error
}

func (r *orderRepository) Delete(ctx context.Context, id int64) error {
	return r.DB(ctx).Where("id = ?", id).Delete(&model.Order{}).Error
}

func (r *orderRepository) SoftDelete(ctx context.Context, id int64, updator string) error {
	return r.DB(ctx).
		Model(&model.Order{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}

func (r *orderRepository) List(ctx context.Context, offset, limit int) ([]*model.Order, int64, error) {
	var orders []*model.Order
	var total int64

	db := r.DB(ctx).Model(&model.Order{}).Where("is_deleted = ?", 0)
	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := db.Order("id DESC").Offset(offset).Limit(limit).Find(&orders).Error; err != nil {
		return nil, 0, err
	}
	return orders, total, nil
}

func (r *orderRepository) ListByCondition(ctx context.Context, filter OrderListFilter, offset, limit int) ([]*model.Order, int64, error) {
	var orders []*model.Order
	var total int64

	db := r.DB(ctx).Model(&model.Order{}).Where("is_deleted = ?", 0)
	if filter.OrderCode != "" {
		db = db.Where("order_code LIKE ?", "%"+filter.OrderCode+"%")
	}
	if filter.UserCode != "" {
		db = db.Where("user_code LIKE ?", "%"+filter.UserCode+"%")
	}
	if filter.UserId != nil {
		db = db.Where("user_id = ?", *filter.UserId)
	}
	if filter.OrderStatus != nil {
		db = db.Where("order_status = ?", *filter.OrderStatus)
	}
	if filter.PaymentStatus != nil {
		db = db.Where("payment_status = ?", *filter.PaymentStatus)
	}
	if filter.OrderDateStart != nil {
		db = db.Where("order_date >= ?", *filter.OrderDateStart)
	}
	if filter.OrderDateEnd != nil {
		db = db.Where("order_date <= ?", *filter.OrderDateEnd)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := db.Order("id DESC").Offset(offset).Limit(limit).Find(&orders).Error; err != nil {
		return nil, 0, err
	}
	return orders, total, nil
}
