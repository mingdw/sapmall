package repository

import (
	"encoding/json"

	"gorm.io/gorm"
)

// AttrFilterCondition 目录属性筛选：同一属性组内 OR，不同属性组之间 AND。
type AttrFilterCondition struct {
	AttrCodes []string
}

func applyAttrFilters(query *gorm.DB, attrFilters []AttrFilterCondition) *gorm.DB {
	if len(attrFilters) == 0 {
		return query
	}

	existsSQL := `
EXISTS (
	SELECT 1 FROM sys_product_spu_attr_params ap
	WHERE ap.product_spu_id = sys_product_spu.id
	AND ap.code = 'BASIC_ATTRS'
	AND ap.is_deleted = 0
	AND ap.catalog_attr_codes IS NOT NULL`

	args := make([]interface{}, 0, len(attrFilters))
	for _, groupFilter := range attrFilters {
		if len(groupFilter.AttrCodes) == 0 {
			continue
		}
		codesJSON, err := json.Marshal(groupFilter.AttrCodes)
		if err != nil || string(codesJSON) == "[]" {
			continue
		}
		existsSQL += `
	AND JSON_OVERLAPS(ap.catalog_attr_codes, CAST(? AS JSON))`
		args = append(args, string(codesJSON))
	}

	existsSQL += `
)`
	if len(args) == 0 {
		return query
	}

	return query.Where(existsSQL, args...)
}
