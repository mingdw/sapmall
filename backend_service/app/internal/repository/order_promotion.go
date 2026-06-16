package repository

import (
	"context"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type OrderPromotionRepository interface {
	Create(ctx context.Context, orderPromotion *model.OrderPromotion) error
	CreateBatch(ctx context.Context, orderPromotions []model.OrderPromotion) error
	GetByID(ctx context.Context, id int64) (*model.OrderPromotion, error)
	GetByOrderID(ctx context.Context, orderID int64) ([]*model.OrderPromotion, error)
	GetByOrderCode(ctx context.Context, orderCode string) ([]*model.OrderPromotion, error)
	Update(ctx context.Context, orderPromotion *model.OrderPromotion) error
	Delete(ctx context.Context, id int64) error
	SoftDeleteByOrderID(ctx context.Context, orderID int64, updator string) error
}

type orderPromotionRepository struct {
	*Repository
}

func NewOrderPromotionRepository(db *gorm.DB) OrderPromotionRepository {
	return &orderPromotionRepository{Repository: NewRepository(db)}
}

func (r *orderPromotionRepository) Create(ctx context.Context, orderPromotion *model.OrderPromotion) error {
	return r.DB(ctx).Create(orderPromotion).Error
}

func (r *orderPromotionRepository) CreateBatch(ctx context.Context, orderPromotions []model.OrderPromotion) error {
	if len(orderPromotions) == 0 {
		return nil
	}
	return r.DB(ctx).Create(&orderPromotions).Error
}

func (r *orderPromotionRepository) GetByID(ctx context.Context, id int64) (*model.OrderPromotion, error) {
	var row model.OrderPromotion
	err := r.DB(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&row).Error
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *orderPromotionRepository) GetByOrderID(ctx context.Context, orderID int64) ([]*model.OrderPromotion, error) {
	var rows []*model.OrderPromotion
	err := r.DB(ctx).
		Where("order_id = ? AND is_deleted = ?", orderID, 0).
		Find(&rows).Error
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *orderPromotionRepository) GetByOrderCode(ctx context.Context, orderCode string) ([]*model.OrderPromotion, error) {
	var rows []*model.OrderPromotion
	err := r.DB(ctx).
		Where("order_code = ? AND is_deleted = ?", orderCode, 0).
		Find(&rows).Error
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (r *orderPromotionRepository) Update(ctx context.Context, orderPromotion *model.OrderPromotion) error {
	return r.DB(ctx).Save(orderPromotion).Error
}

func (r *orderPromotionRepository) Delete(ctx context.Context, id int64) error {
	return r.DB(ctx).Where("id = ?", id).Delete(&model.OrderPromotion{}).Error
}

func (r *orderPromotionRepository) SoftDeleteByOrderID(ctx context.Context, orderID int64, updator string) error {
	return r.DB(ctx).
		Model(&model.OrderPromotion{}).
		Where("order_id = ? AND is_deleted = ?", orderID, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}
