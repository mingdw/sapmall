package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
	"gorm.io/gorm"
)

// Chain_eventRepository Chain_event 数据访问接口
type Chain_eventRepository interface {
	Create(ctx context.Context, chain_event *model.Chain_event) error
	GetByID(ctx context.Context, id int64) (*model.Chain_event, error)
	Update(ctx context.Context, chain_event *model.Chain_event) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, offset, limit int) ([]*model.Chain_event, int64, error)
}

// chain_eventRepository Chain_event 数据访问实现
type chain_eventRepository struct {
	db *gorm.DB
}

// NewChain_eventRepository 创建 Chain_event repository
func NewChain_eventRepository(db *gorm.DB) Chain_eventRepository {
	return &chain_eventRepository{db: db}
}

// Create 创建 Chain_event
func (r *chain_eventRepository) Create(ctx context.Context, chain_event *model.Chain_event) error {
	return r.db.WithContext(ctx).Create(chain_event).Error
}

// GetByID 根据ID获取 Chain_event
func (r *chain_eventRepository) GetByID(ctx context.Context, id int64) (*model.Chain_event, error) {
	var chain_event model.Chain_event
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&chain_event).Error
	if err != nil {
		return nil, err
	}
	return &chain_event, nil
}

// Update 更新 Chain_event
func (r *chain_eventRepository) Update(ctx context.Context, chain_event *model.Chain_event) error {
	return r.db.WithContext(ctx).Save(chain_event).Error
}

// Delete 删除 Chain_event
func (r *chain_eventRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Chain_event{}).Error
}

// List 获取 Chain_event 列表
func (r *chain_eventRepository) List(ctx context.Context, offset, limit int) ([]*model.Chain_event, int64, error) {
	var chain_events []*model.Chain_event
	var total int64
	
	// 获取总数
	if err := r.db.WithContext(ctx).Model(&model.Chain_event{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	// 获取列表
	if err := r.db.WithContext(ctx).Offset(offset).Limit(limit).Find(&chain_events).Error; err != nil {
		return nil, 0, err
	}
	
	return chain_events, total, nil
}
