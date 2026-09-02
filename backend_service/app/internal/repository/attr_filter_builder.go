package repository

import (
	"context"
	"strconv"
	"strings"
)

func ParseAttrIDStrings(raw string) []uint {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}

	parts := strings.Split(raw, ",")
	ids := make([]uint, 0, len(parts))
	seen := make(map[uint]struct{}, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		id64, err := strconv.ParseUint(part, 10, 64)
		if err != nil || id64 == 0 {
			continue
		}
		id := uint(id64)
		if _, ok := seen[id]; ok {
			continue
		}
		seen[id] = struct{}{}
		ids = append(ids, id)
	}
	return ids
}

func ParseAttrCodeStrings(raw string) []string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}

	parts := strings.Split(raw, ",")
	codes := make([]string, 0, len(parts))
	seen := make(map[string]struct{}, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		if _, ok := seen[part]; ok {
			continue
		}
		seen[part] = struct{}{}
		codes = append(codes, part)
	}
	return codes
}

func BuildAttrFilterConditionsFromCodes(
	ctx context.Context,
	attrRepo AttrRepository,
	attrCodes []string,
) ([]AttrFilterCondition, error) {
	if len(attrCodes) == 0 {
		return nil, nil
	}

	attrs, err := attrRepo.GetAttrsByCodes(ctx, attrCodes)
	if err != nil {
		return nil, err
	}
	if len(attrs) == 0 {
		return nil, nil
	}

	codeSet := make(map[string]struct{}, len(attrCodes))
	for _, code := range attrCodes {
		codeSet[code] = struct{}{}
	}

	groupCodes := make(map[string][]string)
	groupOrder := make([]string, 0)
	for _, attr := range attrs {
		if attr.AttrGroupCode == "" || attr.AttrCode == "" {
			continue
		}
		if _, requested := codeSet[attr.AttrCode]; !requested {
			continue
		}
		if _, ok := groupCodes[attr.AttrGroupCode]; !ok {
			groupOrder = append(groupOrder, attr.AttrGroupCode)
			groupCodes[attr.AttrGroupCode] = make([]string, 0, 1)
		}
		groupCodes[attr.AttrGroupCode] = appendUniqueString(groupCodes[attr.AttrGroupCode], attr.AttrCode)
	}

	filters := make([]AttrFilterCondition, 0, len(groupOrder))
	for _, groupCode := range groupOrder {
		codes := groupCodes[groupCode]
		if len(codes) == 0 {
			continue
		}
		filters = append(filters, AttrFilterCondition{AttrCodes: codes})
	}
	return filters, nil
}

// BuildAttrFilterConditionsFromIDs 兼容旧 attrIds 参数，先解析为 code 再分组。
func BuildAttrFilterConditionsFromIDs(
	ctx context.Context,
	attrRepo AttrRepository,
	attrIDs []uint,
) ([]AttrFilterCondition, error) {
	if len(attrIDs) == 0 {
		return nil, nil
	}
	attrs, err := attrRepo.GetAttrsByIDs(ctx, attrIDs)
	if err != nil {
		return nil, err
	}
	codes := make([]string, 0, len(attrs))
	for _, attr := range attrs {
		if strings.TrimSpace(attr.AttrCode) != "" {
			codes = append(codes, attr.AttrCode)
		}
	}
	return BuildAttrFilterConditionsFromCodes(ctx, attrRepo, codes)
}

func appendUniqueString(items []string, value string) []string {
	for _, item := range items {
		if item == value {
			return items
		}
	}
	return append(items, value)
}
