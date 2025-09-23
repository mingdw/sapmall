package repository

import (
	"context"
	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// RoleRepository Role 数据访问接口
type RoleRepository interface {
	GetByCode(ctx context.Context, code string) (*model.Role, error)
	Create(ctx context.Context, role *model.Role) error
	GetByID(ctx context.Context, id int64) (*model.Role, error)
}

// roleRepository Role 数据访问实现
type roleRepository struct {
	db *gorm.DB
}

// NewRoleRepository 创建 Role repository
func NewRoleRepository(db *gorm.DB) RoleRepository {
	return &roleRepository{db: db}
}

// GetByCode 根据编码获取 Role
func (r *roleRepository) GetByCode(ctx context.Context, code string) (*model.Role, error) {
	var role model.Role
	err := r.db.WithContext(ctx).Where("code = ? and is_deleted = ?", code, 0).First(&role).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // 角色不存在，返回 nil, nil
		}
		return nil, err // 其他错误
	}
	return &role, nil
}

// Create 创建 Role
func (r *roleRepository) Create(ctx context.Context, role *model.Role) error {
	return r.db.WithContext(ctx).Create(role).Error
}

// GetByID 根据ID获取 Role
func (r *roleRepository) GetByID(ctx context.Context, id int64) (*model.Role, error) {
	var role model.Role
	err := r.db.WithContext(ctx).Where("id = ? and is_deleted = ?", id, 0).First(&role).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // 角色不存在，返回 nil, nil
		}
		return nil, err // 其他错误
	}
	return &role, nil
}
