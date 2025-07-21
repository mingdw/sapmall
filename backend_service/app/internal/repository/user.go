package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// UserRepository User 数据访问接口
type UserRepository interface {
	Create(ctx context.Context, user *model.User) error
	GetByID(ctx context.Context, id int64) (*model.User, error)
	GetByAddress(ctx context.Context, address string) (*model.User, error)
	Update(ctx context.Context, user *model.User) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, offset, limit int) ([]*model.User, int64, error)
	GetMaxID(ctx context.Context) (int64, error)
}

// userRepository User 数据访问实现
type userRepository struct {
	db *gorm.DB
}

// NewUserRepository 创建 User repository
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// Create 创建 User
func (r *userRepository) Create(ctx context.Context, user *model.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

// GetByID 根据ID获取 User
func (r *userRepository) GetByID(ctx context.Context, id int64) (*model.User, error) {
	var user model.User
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Update 更新 User
func (r *userRepository) Update(ctx context.Context, user *model.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}

// Delete 删除 User
func (r *userRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.User{}).Error
}

// List 获取 User 列表
func (r *userRepository) List(ctx context.Context, offset, limit int) ([]*model.User, int64, error) {
	var users []*model.User
	var total int64

	// 获取总数
	if err := r.db.WithContext(ctx).Model(&model.User{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 获取列表
	if err := r.db.WithContext(ctx).Offset(offset).Limit(limit).Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// GetByAddress 根据地址获取 User
func (r *userRepository) GetByAddress(ctx context.Context, address string) (*model.User, error) {
	var user model.User
	err := r.db.WithContext(ctx).Where("user_code = ? and is_deleted = ?", address, "0").First(&user).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}
	return nil, nil
}

func (r *userRepository) GetMaxID(ctx context.Context) (int64, error) {
	var maxID int64
	err := r.db.WithContext(ctx).Model(&model.User{}).Select("MAX(id)").Scan(&maxID).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return 0, err
	}
	return maxID, nil
}
