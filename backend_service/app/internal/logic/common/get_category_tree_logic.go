package common

import (
	"context"
	"encoding/json"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/logic/categorytree"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/pkg/utils"

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
	categoryTree, err := categorytree.Build(l.ctx, l.svcCtx.GormDB, req.CategoryType)
	if err != nil {
		return nil, err
	}

	formattedJSON, err := utils.PrettyJSON(categoryTree)
	if err != nil {
		return nil, err
	}

	return customererrors.SuccessData(json.RawMessage(formattedJSON)), nil
}
