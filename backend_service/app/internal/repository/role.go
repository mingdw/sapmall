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
	GetByID(ctx context.Context, id int64) ([]*model.Role, error)
	GetRoleCategorys(ctx context.Context, roleID int64) ([]model.Category, error)
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
func (r *roleRepository) GetByID(ctx context.Context, id int64) ([]*model.Role, error) {
	var role []*model.Role
	err := r.db.WithContext(ctx).Where("id = ? and is_deleted = ?", id, 0).Find(&role).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // 角色不存在，返回 nil, nil
		}
		return nil, err // 其他错误
	}
	return role, nil
}

// GetRoleMenus 根据角色ID获取菜单权限
func (r *roleRepository) GetRoleCategorys(ctx context.Context, roleID int64) ([]model.Category, error) {
	var menus []model.Category
	err := r.db.WithContext(ctx).
		Table("sys_category m").
		Joins("INNER JOIN sys_role_category rm ON m.id = rm.category_id").
		Where("rm.role_id = ? AND m.status = ? AND m.menu_type = ? AND m.is_deleted = ?", roleID, 1, 1, 0).
		Order("m.level ASC, m.sort ASC").
		Find(&menus).Error
	if err != nil {
		return nil, err
	}
	return menus, nil
}
