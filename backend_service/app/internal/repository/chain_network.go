package repository

import (
	"context"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type Chain_networkRepository interface {
	Create(ctx context.Context, chain_network *model.Chain_network) error
	GetByID(ctx context.Context, id int64) (*model.Chain_network, error)
	GetByCode(ctx context.Context, code string) (*model.Chain_network, error)
	GetByChainId(ctx context.Context, chainId int) (*model.Chain_network, error)
	Update(ctx context.Context, chain_network *model.Chain_network) error
	UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error
	Delete(ctx context.Context, id int64) error
	SoftDelete(ctx context.Context, id int64, updator string) error
	List(ctx context.Context, offset, limit int) ([]*model.Chain_network, int64, error)
	ListByCondition(ctx context.Context, code, name string, status *int64, offset, limit int) ([]*model.Chain_network, int64, error)
	ExistsByCode(ctx context.Context, code string, excludeID int64) (bool, error)
	ExistsByChainId(ctx context.Context, chainId int, excludeID int64) (bool, error)
}

type chain_networkRepository struct {
	db *gorm.DB
}

func NewChain_networkRepository(db *gorm.DB) Chain_networkRepository {
	return &chain_networkRepository{db: db}
}

func (r *chain_networkRepository) Create(ctx context.Context, chain_network *model.Chain_network) error {
	return r.db.WithContext(ctx).Create(chain_network).Error
}

func (r *chain_networkRepository) GetByID(ctx context.Context, id int64) (*model.Chain_network, error) {
	var chain_network model.Chain_network
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&chain_network).Error
	if err != nil {
		return nil, err
	}
	return &chain_network, nil
}

func (r *chain_networkRepository) GetByCode(ctx context.Context, code string) (*model.Chain_network, error) {
	var chain_network model.Chain_network
	err := r.db.WithContext(ctx).Where("code = ? AND is_deleted = ?", code, 0).First(&chain_network).Error
	if err != nil {
		return nil, err
	}
	return &chain_network, nil
}

func (r *chain_networkRepository) GetByChainId(ctx context.Context, chainId int) (*model.Chain_network, error) {
	var chain_network model.Chain_network
	err := r.db.WithContext(ctx).Where("chain_id = ? AND is_deleted = ?", chainId, 0).First(&chain_network).Error
	if err != nil {
		return nil, err
	}
	return &chain_network, nil
}

func (r *chain_networkRepository) Update(ctx context.Context, chain_network *model.Chain_network) error {
	return r.db.WithContext(ctx).Save(chain_network).Error
}

func (r *chain_networkRepository) UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).
		Model(&model.Chain_network{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(updates).Error
}

func (r *chain_networkRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Chain_network{}).Error
}

func (r *chain_networkRepository) SoftDelete(ctx context.Context, id int64, updator string) error {
	return r.db.WithContext(ctx).
		Model(&model.Chain_network{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}

func (r *chain_networkRepository) List(ctx context.Context, offset, limit int) ([]*model.Chain_network, int64, error) {
	var chain_networks []*model.Chain_network
	var total int64

	if err := r.db.WithContext(ctx).Model(&model.Chain_network{}).Where("is_deleted = ?", 0).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := r.db.WithContext(ctx).
		Where("is_deleted = ?", 0).
		Order("sort ASC, id DESC").
		Offset(offset).
		Limit(limit).
		Find(&chain_networks).Error; err != nil {
		return nil, 0, err
	}

	return chain_networks, total, nil
}

func (r *chain_networkRepository) ListByCondition(
	ctx context.Context,
	code, name string,
	status *int64,
	offset, limit int,
) ([]*model.Chain_network, int64, error) {
	var (
		list  []*model.Chain_network
		total int64
	)

	db := r.db.WithContext(ctx).Model(&model.Chain_network{}).Where("is_deleted = ?", 0)
	if code != "" {
		db = db.Where("code LIKE ?", "%"+code+"%")
	}
	if name != "" {
		db = db.Where("name LIKE ?", "%"+name+"%")
	}
	if status != nil {
		db = db.Where("status = ?", *status)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := db.Order("sort ASC, id DESC").Offset(offset).Limit(limit).Find(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}

func (r *chain_networkRepository) ExistsByCode(ctx context.Context, code string, excludeID int64) (bool, error) {
	var count int64
	db := r.db.WithContext(ctx).Model(&model.Chain_network{}).
		Where("code = ? AND is_deleted = ?", code, 0)
	if excludeID > 0 {
		db = db.Where("id != ?", excludeID)
	}
	if err := db.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *chain_networkRepository) ExistsByChainId(ctx context.Context, chainId int, excludeID int64) (bool, error) {
	var count int64
	db := r.db.WithContext(ctx).Model(&model.Chain_network{}).
		Where("chain_id = ? AND is_deleted = ?", chainId, 0)
	if excludeID > 0 {
		db = db.Where("id != ?", excludeID)
	}
	if err := db.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
