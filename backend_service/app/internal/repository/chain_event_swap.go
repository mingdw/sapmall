package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// ChainEventSwapRepository 兑换记录专用查询接口（复用 sys_chain_event 表）
type ChainEventSwapRepository interface {
	// Create 创建链上事件记录
	Create(ctx context.Context, event *model.ChainEvent) error
	// GetByID 根据ID获取
	GetByID(ctx context.Context, id int64) (*model.ChainEvent, error)
	// GetLatestPendingByCreator 获取用户最新待处理/处理中的兑换记录
	GetLatestPendingByCreator(ctx context.Context, creator string) (*model.ChainEvent, error)
	// UpdateColumns 按ID更新指定列
	UpdateColumns(ctx context.Context, id int64, columns map[string]interface{}) error
	// GetByCreatorAndTxHash 根据创建者和tx_hash查询（listener回填时使用）
	GetByCreatorAndChainID(ctx context.Context, creator string, chainID int) (*model.ChainEvent, error)
}

type chainEventSwapRepository struct {
	db *gorm.DB
}

func NewChainEventSwapRepository(db *gorm.DB) ChainEventSwapRepository {
	return &chainEventSwapRepository{db: db}
}

func (r *chainEventSwapRepository) Create(ctx context.Context, event *model.ChainEvent) error {
	return r.db.WithContext(ctx).Create(event).Error
}

func (r *chainEventSwapRepository) GetByID(ctx context.Context, id int64) (*model.ChainEvent, error) {
	var event model.ChainEvent
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = 0", id).First(&event).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *chainEventSwapRepository) GetLatestPendingByCreator(ctx context.Context, creator string) (*model.ChainEvent, error) {
	var event model.ChainEvent
	err := r.db.WithContext(ctx).
		Where("business_type = ? AND creator = ? AND process_status IN ? AND is_deleted = 0",
			"swap", creator, []int{0, 1}).
		Order("id DESC").
		First(&event).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *chainEventSwapRepository) UpdateColumns(ctx context.Context, id int64, columns map[string]interface{}) error {
	return r.db.WithContext(ctx).Model(&model.ChainEvent{}).
		Where("id = ?", id).
		Updates(columns).Error
}

func (r *chainEventSwapRepository) GetByCreatorAndChainID(ctx context.Context, creator string, chainID int) (*model.ChainEvent, error) {
	var event model.ChainEvent
	err := r.db.WithContext(ctx).
		Where("business_type = ? AND creator = ? AND chain_id = ? AND process_status IN ? AND is_deleted = 0",
			"swap", creator, chainID, []int{0, 1}).
		Order("id DESC").
		First(&event).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}
