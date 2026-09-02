package repository

import (
	"context"
	"encoding/json"
	"strings"

	"sapphire-mall/app/internal/model"

	"gorm.io/gorm"
)

// ResolveCatalogAttrCodesFromBasicValue 从 BASIC_ATTRS 中文 JSON 解析并匹配目录属性 code。
// 匹配规则：JSON key = 属性组名称，value 与属性名称完全相等或包含属性名称。
func ResolveCatalogAttrCodesFromBasicValue(ctx context.Context, db *gorm.DB, basicValue string) (string, error) {
	basicValue = strings.TrimSpace(basicValue)
	if basicValue == "" {
		return "[]", nil
	}

	var displayAttrs map[string]string
	if err := json.Unmarshal([]byte(basicValue), &displayAttrs); err != nil {
		return "[]", nil
	}
	if len(displayAttrs) == 0 {
		return "[]", nil
	}

	groupRepo := NewAttrGroupRepository(db)
	attrRepo := NewAttrRepository(db)

	groups, err := groupRepo.FindAll(ctx)
	if err != nil {
		return "[]", err
	}
	attrs, err := attrRepo.FindAll(ctx)
	if err != nil {
		return "[]", err
	}

	groupNameToID := make(map[string]uint, len(groups))
	for _, group := range groups {
		if group.IsDeleted != 0 {
			continue
		}
		name := strings.TrimSpace(group.AttrGroupName)
		if name == "" {
			continue
		}
		groupNameToID[name] = group.ID
	}

	attrsByGroupID := make(map[uint][]model.Attr)
	for _, attr := range attrs {
		if attr.IsDeleted != 0 || attr.AttrGroupID == 0 {
			continue
		}
		attrsByGroupID[attr.AttrGroupID] = append(attrsByGroupID[attr.AttrGroupID], attr)
	}

	codes := make([]string, 0, len(displayAttrs))
	seen := make(map[string]struct{})
	for key, rawValue := range displayAttrs {
		groupID, ok := groupNameToID[strings.TrimSpace(key)]
		if !ok {
			continue
		}
		value := strings.TrimSpace(rawValue)
		if value == "" {
			continue
		}
		for _, attr := range attrsByGroupID[groupID] {
			attrName := strings.TrimSpace(attr.AttrName)
			if attrName == "" || strings.TrimSpace(attr.AttrCode) == "" {
				continue
			}
			if attrName != value && !strings.Contains(value, attrName) {
				continue
			}
			if _, exists := seen[attr.AttrCode]; exists {
				continue
			}
			seen[attr.AttrCode] = struct{}{}
			codes = append(codes, attr.AttrCode)
		}
	}

	payload, err := json.Marshal(codes)
	if err != nil {
		return "[]", err
	}
	return string(payload), nil
}

// BackfillCatalogAttrCodes 为所有 BASIC_ATTRS 行回填 catalog_attr_codes。
func BackfillCatalogAttrCodes(ctx context.Context, db *gorm.DB) (int, error) {
	var rows []model.ProductSpuAttrParams
	if err := db.WithContext(ctx).
		Model(&model.ProductSpuAttrParams{}).
		Where("code = ? AND is_deleted = ?", "BASIC_ATTRS", 0).
		Find(&rows).Error; err != nil {
		return 0, err
	}

	updated := 0
	for _, row := range rows {
		codes, err := ResolveCatalogAttrCodesFromBasicValue(ctx, db, row.Value)
		if err != nil {
			return updated, err
		}
		if codes == row.CatalogAttrCodes {
			continue
		}
		if err := db.WithContext(ctx).
			Model(&model.ProductSpuAttrParams{}).
			Where("id = ?", row.ID).
			Update("catalog_attr_codes", codes).Error; err != nil {
			return updated, err
		}
		updated++
	}
	return updated, nil
}
