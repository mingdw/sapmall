package category

import (
	"context"
	"encoding/json"
	"sapphire-mall/app/internal/repository"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetCategoryLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取商品目录
func NewGetCategoryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetCategoryLogic {
	return &GetCategoryLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetCategoryLogic) GetCategory(req *types.CategoryRequest) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line
	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)
	category, err := categoryRepository.GetCategory(l.ctx, req.ID)
	if err != nil {
		return nil, err
	}
	categoryJson, err := json.Marshal(category)
	if err != nil {
		return nil, err
	}
	return &types.BaseResp{
		Code: 0,
		Msg:  "success",
		Data: string(categoryJson),
	}, nil
}
