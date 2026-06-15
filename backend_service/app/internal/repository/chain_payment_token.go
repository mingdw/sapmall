package repository

import (
	"context"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

type Chain_payment_tokenRepository interface {
	Create(ctx context.Context, chain_payment_token *model.Chain_payment_token) error
	GetByID(ctx context.Context, id int64) (*model.Chain_payment_token, error)
	Update(ctx context.Context, chain_payment_token *model.Chain_payment_token) error
	UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error
	Delete(ctx context.Context, id int64) error
	SoftDelete(ctx context.Context, id int64, updator string) error
	SoftDeleteByChainId(ctx context.Context, chainId int, updator string) error
	List(ctx context.Context, offset, limit int) ([]*model.Chain_payment_token, int64, error)
	ListByCondition(
		ctx context.Context,
		chainId *int64,
		symbol string,
		status, syncStatus *int64,
		offset, limit int,
	) ([]*model.Chain_payment_token, int64, error)
	ListByChainIds(ctx context.Context, chainIds []int) (map[int][]*model.Chain_payment_token, error)
	ExistsByChainIdAndSymbol(ctx context.Context, chainId int, symbol string, excludeID int64) (bool, error)
	// GetEnabledByChainIdAndSymbol 按链 ID 与代币符号查询已启用的支付代币
	GetEnabledByChainIdAndSymbol(ctx context.Context, chainId int, symbol string) (*model.Chain_payment_token, error)
}

type chain_payment_tokenRepository struct {
	db *gorm.DB
}

func NewChain_payment_tokenRepository(db *gorm.DB) Chain_payment_tokenRepository {
	return &chain_payment_tokenRepository{db: db}
}

func (r *chain_payment_tokenRepository) Create(ctx context.Context, chain_payment_token *model.Chain_payment_token) error {
	return r.db.WithContext(ctx).Create(chain_payment_token).Error
}

func (r *chain_payment_tokenRepository) GetByID(ctx context.Context, id int64) (*model.Chain_payment_token, error) {
	var chain_payment_token model.Chain_payment_token
	err := r.db.WithContext(ctx).Where("id = ? AND is_deleted = ?", id, 0).First(&chain_payment_token).Error
	if err != nil {
		return nil, err
	}
	return &chain_payment_token, nil
}

func (r *chain_payment_tokenRepository) Update(ctx context.Context, chain_payment_token *model.Chain_payment_token) error {
	return r.db.WithContext(ctx).Save(chain_payment_token).Error
}

func (r *chain_payment_tokenRepository) UpdateColumnsByID(ctx context.Context, id int64, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).
		Model(&model.Chain_payment_token{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(updates).Error
}

func (r *chain_payment_tokenRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Chain_payment_token{}).Error
}

func (r *chain_payment_tokenRepository) SoftDelete(ctx context.Context, id int64, updator string) error {
	return r.db.WithContext(ctx).
		Model(&model.Chain_payment_token{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}

func (r *chain_payment_tokenRepository) SoftDeleteByChainId(ctx context.Context, chainId int, updator string) error {
	return r.db.WithContext(ctx).
		Model(&model.Chain_payment_token{}).
		Where("chain_id = ? AND is_deleted = ?", chainId, 0).
		Updates(map[string]interface{}{
			"is_deleted": 1,
			"updator":    updator,
		}).Error
}

func (r *chain_payment_tokenRepository) List(ctx context.Context, offset, limit int) ([]*model.Chain_payment_token, int64, error) {
	var chain_payment_tokens []*model.Chain_payment_token
	var total int64

	if err := r.db.WithContext(ctx).Model(&model.Chain_payment_token{}).Where("is_deleted = ?", 0).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := r.db.WithContext(ctx).
		Where("is_deleted = ?", 0).
		Order("sort ASC, id ASC").
		Offset(offset).
		Limit(limit).
		Find(&chain_payment_tokens).Error; err != nil {
		return nil, 0, err
	}

	return chain_payment_tokens, total, nil
}

func (r *chain_payment_tokenRepository) ListByCondition(
	ctx context.Context,
	chainId *int64,
	symbol string,
	status, syncStatus *int64,
	offset, limit int,
) ([]*model.Chain_payment_token, int64, error) {
	var (
		list  []*model.Chain_payment_token
		total int64
	)

	db := r.db.WithContext(ctx).Model(&model.Chain_payment_token{}).Where("is_deleted = ?", 0)
	if chainId != nil {
		db = db.Where("chain_id = ?", *chainId)
	}
	if symbol != "" {
		db = db.Where("symbol LIKE ?", "%"+symbol+"%")
	}
	if status != nil {
		db = db.Where("status = ?", *status)
	}
	if syncStatus != nil {
		db = db.Where("sync_status = ?", *syncStatus)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	if err := db.Order("sort ASC, id ASC").Offset(offset).Limit(limit).Find(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}

func (r *chain_payment_tokenRepository) ListByChainIds(ctx context.Context, chainIds []int) (map[int][]*model.Chain_payment_token, error) {
	result := make(map[int][]*model.Chain_payment_token)
	if len(chainIds) == 0 {
		return result, nil
	}

	var tokens []*model.Chain_payment_token
	if err := r.db.WithContext(ctx).
		Where("chain_id IN ? AND is_deleted = ?", chainIds, 0).
		Order("sort ASC, id ASC").
		Find(&tokens).Error; err != nil {
		return nil, err
	}

	for _, token := range tokens {
		result[token.ChainId] = append(result[token.ChainId], token)
	}
	return result, nil
}

func (r *chain_payment_tokenRepository) ExistsByChainIdAndSymbol(ctx context.Context, chainId int, symbol string, excludeID int64) (bool, error) {
	var count int64
	db := r.db.WithContext(ctx).Model(&model.Chain_payment_token{}).
		Where("chain_id = ? AND symbol = ? AND is_deleted = ?", chainId, symbol, 0)
	if excludeID > 0 {
		db = db.Where("id != ?", excludeID)
	}
	if err := db.Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *chain_payment_tokenRepository) GetEnabledByChainIdAndSymbol(ctx context.Context, chainId int, symbol string) (*model.Chain_payment_token, error) {
	var token model.Chain_payment_token
	err := r.db.WithContext(ctx).
		Where("chain_id = ? AND symbol = ? AND status = 0 AND is_deleted = ?", chainId, symbol, 0).
		First(&token).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}
