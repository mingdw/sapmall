package category

import (
	"context"

	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteCategoryLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除商品目录
func NewDeleteCategoryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteCategoryLogic {
	return &DeleteCategoryLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteCategoryLogic) DeleteCategory(req *types.DeleteCategoryReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line
	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)
	categoryAttrGroupRepository := repository.NewCategoryAttrGroupRepository(l.svcCtx.GormDB)
	attrGroupRepository := repository.NewAttrGroupRepository(l.svcCtx.GormDB)

	categoryAttrGroups, err := categoryAttrGroupRepository.FindByCategoryID(l.ctx, req.CategoryID)
	if err != nil {
		return nil, err
	}

	attrGroupsIds := make([]uint, 0)
	categoryIds := make([]uint, 0)
	for _, cag := range categoryAttrGroups {
		attrGroupsIds = append(attrGroupsIds, cag.AttrGroupID)
		categoryIds = append(categoryIds, cag.CategoryID)
	}

	// 删除属性组
	if len(attrGroupsIds) > 0 {
		err = attrGroupRepository.DeleteByCategoryID(l.ctx, attrGroupsIds)
		if err != nil {
			return nil, err
		}
	}

	// 删除目录-属性组关联
	if len(categoryIds) > 0 {
		err = categoryAttrGroupRepository.DeleteByCategoryIDs(l.ctx, categoryIds)
		if err != nil {
			return nil, err
		}
	}

	// 删除目录
	err = categoryRepository.Delete(l.ctx, req.CategoryID)
	if err != nil {
		return nil, err
	}
	return &types.BaseResp{
		Code: 0,
		Msg:  "success",
		Data: nil,
	}, nil
}
