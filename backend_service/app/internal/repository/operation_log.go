package repository

import (
	"context"

	"sapphire-mall/app/internal/model"
)

type OperationLogRepository interface {
	GetOperationLog(ctx context.Context, id int64) (*model.OperationLog, error)
	ListOperationLogs(ctx context.Context, offset, limit int) ([]*model.OperationLog, int64, error)
	ListOperationLogsByUserID(ctx context.Context, userID int64, offset, limit int) ([]*model.OperationLog, int64, error)
	CreateOperationLog(ctx context.Context, operationLog *model.OperationLog) error
	UpdateOperationLog(ctx context.Context, operationLog *model.OperationLog) error
	DeleteOperationLog(ctx context.Context, id int64) error
}

func NewOperationLogRepository(
	r *Repository,
) OperationLogRepository {
	return &operationLogRepository{
		Repository: r,
	}
}

type operationLogRepository struct {
	*Repository
}

func (r *operationLogRepository) GetOperationLog(ctx context.Context, id int64) (*model.OperationLog, error) {
	var operationLog model.OperationLog
	err := r.DB(ctx).
		Where("id = ? AND is_deleted = ?", id, 0).
		First(&operationLog).Error
	if err != nil {
		return nil, err
	}
	return &operationLog, nil
}

func (r *operationLogRepository) ListOperationLogs(
	ctx context.Context,
	offset, limit int,
) ([]*model.OperationLog, int64, error) {
	var operationLogs []*model.OperationLog
	var total int64

	if err := r.DB(ctx).
		Model(&model.OperationLog{}).
		Where("is_deleted = ?", 0).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.DB(ctx).
		Where("is_deleted = ?", 0).
		Order("id DESC").
		Offset(offset).
		Limit(limit).
		Find(&operationLogs).Error; err != nil {
		return nil, 0, err
	}

	return operationLogs, total, nil
}

func (r *operationLogRepository) ListOperationLogsByUserID(
	ctx context.Context,
	userID int64,
	offset, limit int,
) ([]*model.OperationLog, int64, error) {
	var operationLogs []*model.OperationLog
	var total int64

	base := r.DB(ctx).Model(&model.OperationLog{}).
		Where("user_id = ? AND is_deleted = ?", userID, 0)

	if err := base.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.DB(ctx).
		Where("user_id = ? AND is_deleted = ?", userID, 0).
		Order("id DESC").
		Offset(offset).
		Limit(limit).
		Find(&operationLogs).Error; err != nil {
		return nil, 0, err
	}

	return operationLogs, total, nil
}

func (r *operationLogRepository) CreateOperationLog(ctx context.Context, operationLog *model.OperationLog) error {
	return r.DB(ctx).Create(operationLog).Error
}

func (r *operationLogRepository) UpdateOperationLog(ctx context.Context, operationLog *model.OperationLog) error {
	return r.DB(ctx).
		Model(&model.OperationLog{}).
		Where("id = ? AND is_deleted = ?", operationLog.ID, 0).
		Updates(operationLog).Error
}

func (r *operationLogRepository) DeleteOperationLog(ctx context.Context, id int64) error {
	return r.DB(ctx).
		Model(&model.OperationLog{}).
		Where("id = ? AND is_deleted = ?", id, 0).
		Update("is_deleted", 1).Error
}
