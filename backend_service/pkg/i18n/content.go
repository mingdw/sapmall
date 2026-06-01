package i18n

import "encoding/json"

const (
	TableSysCategory   = "sys_category"
	TableSysAttrGroup  = "sys_attr_group"
	TableSysAttr       = "sys_attr"
)

// Fields 与 sys_translations.json_content 字段对齐。
type Fields struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// FieldsMap business_id -> 翻译字段。
type FieldsMap map[int64]Fields

func ParseFieldsMap(raw map[int64]string) FieldsMap {
	if len(raw) == 0 {
		return nil
	}
	out := make(FieldsMap, len(raw))
	for id, content := range raw {
		var fields Fields
		if err := json.Unmarshal([]byte(content), &fields); err != nil {
			continue
		}
		out[id] = fields
	}
	return out
}

func (m FieldsMap) Name(id int64, fallback string) string {
	if m == nil {
		return fallback
	}
	if fields, ok := m[id]; ok && fields.Name != "" {
		return fields.Name
	}
	return fallback
}

func (m FieldsMap) Description(id int64, fallback string) string {
	if m == nil {
		return fallback
	}
	if fields, ok := m[id]; ok && fields.Description != "" {
		return fields.Description
	}
	return fallback
}
