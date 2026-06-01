package repository

import (
	"context"
	"sapphire-mall/pkg/i18n"

	"gorm.io/gorm"
)

type translationRow struct {
	BusinessID  int64  `gorm:"column:business_id"`
	JSONContent string `gorm:"column:json_content"`
}

type TranslationRepository interface {
	BatchGetJSONContent(ctx context.Context, tableName, locale string) (map[int64]string, error)
	BatchGetFields(ctx context.Context, tableName, locale string) (i18n.FieldsMap, error)
}

type translationRepository struct {
	db *gorm.DB
}

func NewTranslationRepository(db *gorm.DB) TranslationRepository {
	return &translationRepository{db: db}
}

func (r *translationRepository) BatchGetJSONContent(ctx context.Context, tableName, locale string) (map[int64]string, error) {
	if locale == "" || locale == i18n.DefaultLocale {
		return nil, nil
	}

	var rows []translationRow
	if err := r.db.WithContext(ctx).
		Table("sys_translations").
		Select("business_id", "json_content").
		Where("table_name = ? AND locale = ? AND is_deleted = 0", tableName, locale).
		Find(&rows).Error; err != nil {
		return nil, err
	}

	out := make(map[int64]string, len(rows))
	for _, row := range rows {
		out[row.BusinessID] = row.JSONContent
	}
	return out, nil
}

func (r *translationRepository) BatchGetFields(ctx context.Context, tableName, locale string) (i18n.FieldsMap, error) {
	raw, err := r.BatchGetJSONContent(ctx, tableName, locale)
	if err != nil {
		return nil, err
	}
	return i18n.ParseFieldsMap(raw), nil
}
