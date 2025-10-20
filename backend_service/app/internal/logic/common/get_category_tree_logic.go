package common

import (
	"context"
	"encoding/json"
	"sort"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/pkg/utils" // 添加utils包导入

	"github.com/zeromicro/go-zero/core/logx"
)

type GetCategoryTreeLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取导航目录结构
func NewGetCategoryTreeLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetCategoryTreeLogic {
	return &GetCategoryTreeLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetCategoryTreeLogic) GetCategoryTree(req *types.GetCategoryTreeReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)
	categoryAttrGroupRepository := repository.NewCategoryAttrGroupRepository(l.svcCtx.GormDB)
	atrGroupRepository := repository.NewAttrGroupRepository(l.svcCtx.GormDB)
	attrRepository := repository.NewAttrRepository(l.svcCtx.GormDB)

	// 1. 获取所有目录
	categories, err := categoryRepository.FindAll(l.ctx, req.CategoryType)
	if err != nil {
		return nil, err
	}

	// 2. 获取所有目录-属性组关联
	categoryAttrGroups, err := categoryAttrGroupRepository.FindAll(l.ctx)
	if err != nil {
		return nil, err
	}

	// 3. 获取所有属性组
	attrGroups, err := atrGroupRepository.FindAll(l.ctx)
	if err != nil {
		return nil, err
	}

	// 4. 获取所有属性
	attrs, err := attrRepository.FindAll(l.ctx)
	if err != nil {
		return nil, err
	}

	// 5. 构建属性组-属性映射
	attrGroupMap := make(map[uint][]model.Attr)
	for _, attr := range attrs {
		groupID := uint(attr.AttrGroupID)
		attrGroupMap[groupID] = append(attrGroupMap[groupID], attr)
	}

	// 6. 构建目录-属性组映射
	categoryAttrGroupMap := make(map[uint][]model.AttrGroup)
	for _, cag := range categoryAttrGroups {
		for _, ag := range attrGroups {
			if cag.AttrGroupID == ag.ID {
				categoryID := uint(cag.CategoryID)
				categoryAttrGroupMap[categoryID] = append(categoryAttrGroupMap[categoryID], ag)
			}
		}
	}

	// 7. 构建目录树，从顶级目录开始
	categoryTree := buildCategoryTree(categories, categoryAttrGroupMap, attrGroupMap, 0)

	// 使用utils包格式化JSON
	formattedJSON, err := utils.PrettyJSON(categoryTree)
	if err != nil {
		return nil, err
	}

	// 直接返回格式化的JSON字符串，而不是包装在BaseResp中
	return &types.BaseResp{
		Code: 0,
		Msg:  "success",
		Data: json.RawMessage(formattedJSON), // 使用json.RawMessage避免二次转义
	}, nil
}

// buildCategoryTree 构建目录树
func buildCategoryTree(categories []model.Category, categoryAttrGroupMap map[uint][]model.AttrGroup, attrGroupMap map[uint][]model.Attr, parentID uint) []types.CategoryTreeResponse {
	var nodes []types.CategoryTreeResponse

	for _, category := range categories {
		if uint(category.ParentID) == parentID {
			node := &types.CategoryTreeResponse{
				ID:       category.ID,
				Code:     category.Code,
				Name:     category.Name,
				ParentID: uint(category.ParentID),
				Level:    category.Level,
				Sort:     category.Sort,
				Icon:     category.Icon,
			}

			// 添加属性组信息
			if attrGroups, exists := categoryAttrGroupMap[uint(category.ID)]; exists {
				for _, ag := range attrGroups {
					attrGroupResp := &types.AttrGroupResponse{
						ID:          uint(ag.ID),
						Name:        ag.AttrGroupName,
						Code:        ag.AttrGroupCode,
						Sort:        ag.Sort,
						Type:        ag.Type,
						Status:      ag.Status,
						Description: ag.Description,
					}

					// 添加属性信息
					if attrs, exists := attrGroupMap[uint(ag.ID)]; exists {
						for _, attr := range attrs {
							attrResp := &types.AttrResponse{
								ID:          attr.ID,
								Name:        attr.AttrName,
								Code:        attr.AttrCode,
								Sort:        attr.Sort,
								Status:      attr.Status,
								Type:        attr.AttrType,
								GroupID:     uint(ag.ID),
								Description: attr.Description,
							}
							attrGroupResp.Attrs = append(attrGroupResp.Attrs, *attrResp)
						}
					}
					node.AttrGroups = append(node.AttrGroups, *attrGroupResp)
				}
			}

			// 递归构建子目录
			children := buildCategoryTree(categories, categoryAttrGroupMap, attrGroupMap, uint(category.ID))
			if len(children) > 0 {
				node.Children = children
			}

			nodes = append(nodes, *node)
		}
	}

	// 按照排序字段排序
	sort.Slice(nodes, func(i, j int) bool {
		return nodes[i].Sort < nodes[j].Sort
	})

	return nodes
}
