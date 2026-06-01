package categorytree

import (
	"context"
	"sort"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/pkg/i18n"

	"gorm.io/gorm"
)

// Build 构建目录树；非默认语言时合并 sys_translations 翻译。
func Build(ctx context.Context, db *gorm.DB, menuType int) ([]types.CategoryTreeResponse, error) {
	categoryRepository := repository.NewCategoryRepository(db)
	categoryAttrGroupRepository := repository.NewCategoryAttrGroupRepository(db)
	attrGroupRepository := repository.NewAttrGroupRepository(db)
	attrRepository := repository.NewAttrRepository(db)

	categories, err := categoryRepository.FindAll(ctx, menuType)
	if err != nil {
		return nil, err
	}

	categoryAttrGroups, err := categoryAttrGroupRepository.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	attrGroups, err := attrGroupRepository.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	attrs, err := attrRepository.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	attrGroupMap := make(map[uint][]model.Attr)
	for _, attr := range attrs {
		groupID := uint(attr.AttrGroupID)
		attrGroupMap[groupID] = append(attrGroupMap[groupID], attr)
	}

	categoryAttrGroupMap := make(map[uint][]model.AttrGroup)
	for _, cag := range categoryAttrGroups {
		for _, ag := range attrGroups {
			if cag.AttrGroupID == ag.ID {
				categoryID := uint(cag.CategoryID)
				categoryAttrGroupMap[categoryID] = append(categoryAttrGroupMap[categoryID], ag)
			}
		}
	}

	translations, err := loadTranslations(ctx, db)
	if err != nil {
		return nil, err
	}

	return buildCategoryTree(categories, categoryAttrGroupMap, attrGroupMap, translations, 0), nil
}

type translationBundle struct {
	categories  i18n.FieldsMap
	attrGroups  i18n.FieldsMap
	attrs       i18n.FieldsMap
}

func loadTranslations(ctx context.Context, db *gorm.DB) (*translationBundle, error) {
	locale := i18n.LocaleFrom(ctx)
	if locale == i18n.DefaultLocale {
		return nil, nil
	}

	transRepo := repository.NewTranslationRepository(db)
	categoryFields, err := transRepo.BatchGetFields(ctx, i18n.TableSysCategory, locale)
	if err != nil {
		return nil, err
	}
	attrGroupFields, err := transRepo.BatchGetFields(ctx, i18n.TableSysAttrGroup, locale)
	if err != nil {
		return nil, err
	}
	attrFields, err := transRepo.BatchGetFields(ctx, i18n.TableSysAttr, locale)
	if err != nil {
		return nil, err
	}

	return &translationBundle{
		categories: categoryFields,
		attrGroups: attrGroupFields,
		attrs:      attrFields,
	}, nil
}

func buildCategoryTree(
	categories []model.Category,
	categoryAttrGroupMap map[uint][]model.AttrGroup,
	attrGroupMap map[uint][]model.Attr,
	translations *translationBundle,
	parentID uint,
) []types.CategoryTreeResponse {
	var nodes []types.CategoryTreeResponse

	for _, category := range categories {
		if uint(category.ParentID) != parentID {
			continue
		}

		name := category.Name
		if translations != nil {
			name = translations.categories.Name(int64(category.ID), name)
		}

		node := types.CategoryTreeResponse{
			ID:       category.ID,
			Code:     category.Code,
			Name:     name,
			ParentID: uint(category.ParentID),
			Level:    category.Level,
			Sort:     category.Sort,
			Icon:     category.Icon,
		}

		if attrGroups, exists := categoryAttrGroupMap[uint(category.ID)]; exists {
			for _, ag := range attrGroups {
				groupName := ag.AttrGroupName
				groupDesc := ag.Description
				if translations != nil {
					groupName = translations.attrGroups.Name(int64(ag.ID), groupName)
					groupDesc = translations.attrGroups.Description(int64(ag.ID), groupDesc)
				}

				attrGroupResp := types.AttrGroupResponse{
					ID:          uint(ag.ID),
					Name:        groupName,
					Code:        ag.AttrGroupCode,
					Sort:        ag.Sort,
					Type:        ag.Type,
					Status:      ag.Status,
					Description: groupDesc,
				}

				if attrs, exists := attrGroupMap[uint(ag.ID)]; exists {
					for _, attr := range attrs {
						attrName := attr.AttrName
						attrDesc := attr.Description
						if translations != nil {
							attrName = translations.attrs.Name(int64(attr.ID), attrName)
							attrDesc = translations.attrs.Description(int64(attr.ID), attrDesc)
						}

						attrGroupResp.Attrs = append(attrGroupResp.Attrs, types.AttrResponse{
							ID:          attr.ID,
							Name:        attrName,
							Code:        attr.AttrCode,
							Sort:        attr.Sort,
							Status:      attr.Status,
							Type:        attr.AttrType,
							GroupID:     uint(ag.ID),
							Description: attrDesc,
						})
					}
				}
				node.AttrGroups = append(node.AttrGroups, attrGroupResp)
			}
		}

		children := buildCategoryTree(categories, categoryAttrGroupMap, attrGroupMap, translations, uint(category.ID))
		if len(children) > 0 {
			node.Children = children
		}

		nodes = append(nodes, node)
	}

	sort.Slice(nodes, func(i, j int) bool {
		return nodes[i].Sort < nodes[j].Sort
	})

	return nodes
}
