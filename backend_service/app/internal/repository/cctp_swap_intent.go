package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// CctpSwapIntentRepository CCTP 意图仓储
type CctpSwapIntentRepository interface {
	Create(ctx context.Context, intent *model.CctpSwapIntent) error
	Update(ctx context.Context, intent *model.CctpSwapIntent) error
	GetByIntentID(ctx context.Context, intentID string) (*model.CctpSwapIntent, error)
	ListPending(ctx context.Context, status int8, limit int) ([]*model.CctpSwapIntent, error)
}

type cctpSwapIntentRepository struct {
	db *gorm.DB
}

func NewCctpSwapIntentRepository(db *gorm.DB) CctpSwapIntentRepository {
	return &cctpSwapIntentRepository{db: db}
}

func (r *cctpSwapIntentRepository) Create(ctx context.Context, intent *model.CctpSwapIntent) error {
	return r.db.WithContext(ctx).Create(intent).Error
}

func (r *cctpSwapIntentRepository) Update(ctx context.Context, intent *model.CctpSwapIntent) error {
	return r.db.WithContext(ctx).Save(intent).Error
}

func (r *cctpSwapIntentRepository) GetByIntentID(ctx context.Context, intentID string) (*model.CctpSwapIntent, error) {
	var intent model.CctpSwapIntent
	err := r.db.WithContext(ctx).
		Where("intent_id = ? AND is_deleted = 0", intentID).
		First(&intent).Error
	if err != nil {
		return nil, err
	}
	return &intent, nil
}

func (r *cctpSwapIntentRepository) ListPending(ctx context.Context, status int8, limit int) ([]*model.CctpSwapIntent, error) {
	if limit <= 0 {
		limit = 50
	}
	var list []*model.CctpSwapIntent
	err := r.db.WithContext(ctx).
		Where("status = ? AND is_deleted = 0", status).
		Order("id ASC").
		Limit(limit).
		Find(&list).Error
	if err != nil {
		return nil, err
	}
	return list, nil
}
