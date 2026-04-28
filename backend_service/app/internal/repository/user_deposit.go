package repository

import (
	"context"
	"sapphire-mall/app/internal/model"
	"gorm.io/gorm"
)

// UserDepositRepository UserDeposit 数据访问接口
type UserDepositRepository interface {
	Create(ctx context.Context, userdeposit *model.UserDeposit) error
	GetByID(ctx context.Context, id int64) (*model.UserDeposit, error)
	GetByIntentId(ctx context.Context, intentId string) (*model.UserDeposit, error)
	GetLatestByUserID(ctx context.Context, userID int64) (*model.UserDeposit, error)
	Update(ctx context.Context, userdeposit *model.UserDeposit) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, offset, limit int) ([]*model.UserDeposit, int64, error)
}

// userdepositRepository UserDeposit 数据访问实现
type userdepositRepository struct {
	db *gorm.DB
}

// NewUserDepositRepository 创建 UserDeposit repository
func NewUserDepositRepository(db *gorm.DB) UserDepositRepository {
	return &userdepositRepository{db: db}
}

// Create 创建 UserDeposit
func (r *userdepositRepository) Create(ctx context.Context, userdeposit *model.UserDeposit) error {
	return r.db.WithContext(ctx).Create(userdeposit).Error
}

// GetByID 根据ID获取 UserDeposit
func (r *userdepositRepository) GetByID(ctx context.Context, id int64) (*model.UserDeposit, error) {
	var userdeposit model.UserDeposit
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&userdeposit).Error
	if err != nil {
		return nil, err
	}
	return &userdeposit, nil
}

// GetByIntentId 根据IntentId获取 UserDeposit
func (r *userdepositRepository) GetByIntentId(ctx context.Context, intentId string) (*model.UserDeposit, error) {
	var userdeposit model.UserDeposit
	err := r.db.WithContext(ctx).Where("intent_id = ?", intentId).First(&userdeposit).Error
	if err != nil {
		return nil, err
	}
	return &userdeposit, nil
}

// GetLatestByUserID 按用户查询最新的保证金记录
func (r *userdepositRepository) GetLatestByUserID(ctx context.Context, userID int64) (*model.UserDeposit, error) {
	var userdeposit model.UserDeposit
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND is_deleted = ?", userID, 0).
		Order("id DESC").
		First(&userdeposit).Error
	if err != nil {
		return nil, err
	}
	return &userdeposit, nil
}

// Update 更新 UserDeposit
func (r *userdepositRepository) Update(ctx context.Context, userdeposit *model.UserDeposit) error {
	return r.db.WithContext(ctx).Save(userdeposit).Error
}

// Delete 删除 UserDeposit
func (r *userdepositRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.UserDeposit{}).Error
}

// List 获取 UserDeposit 列表
func (r *userdepositRepository) List(ctx context.Context, offset, limit int) ([]*model.UserDeposit, int64, error) {
	var userdeposits []*model.UserDeposit
	var total int64
	
	// 获取总数
	if err := r.db.WithContext(ctx).Model(&model.UserDeposit{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	
	// 获取列表
	if err := r.db.WithContext(ctx).Offset(offset).Limit(limit).Find(&userdeposits).Error; err != nil {
		return nil, 0, err
	}
	
	return userdeposits, total, nil
}
