package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// UserRoleRepository UserRole 数据访问接口
type UserRoleRepository interface {
	Create(ctx context.Context, userRole *model.UserRole) error
	GetByUserID(ctx context.Context, userID int64) ([]*model.UserRole, error)
	DeleteByUserID(ctx context.Context, userID int64) error
}

// userRoleRepository UserRole 数据访问实现
type userRoleRepository struct {
	db *gorm.DB
}

// NewUserRoleRepository 创建 UserRole repository
func NewUserRoleRepository(db *gorm.DB) UserRoleRepository {
	return &userRoleRepository{db: db}
}

// Create 创建 UserRole
func (r *userRoleRepository) Create(ctx context.Context, userRole *model.UserRole) error {
	return r.db.WithContext(ctx).Create(userRole).Error
}

// GetByUserID 根据用户ID获取 UserRole 列表
func (r *userRoleRepository) GetByUserID(ctx context.Context, userID int64) ([]*model.UserRole, error) {
	var userRoles []*model.UserRole
	err := r.db.WithContext(ctx).
		Preload("Roles").
		Where("user_id = ? and is_deleted = ?", userID, 0).
		Find(&userRoles).Error
	if err != nil {
		return nil, err
	}
	return userRoles, nil
}

// DeleteByUserID 根据用户ID删除 UserRole
func (r *userRoleRepository) DeleteByUserID(ctx context.Context, userID int64) error {
	return r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Update("is_deleted", 1).Error
}
