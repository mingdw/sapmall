package admin

import (
	"context"
	"sapphire-mall/app/internal/customererrors"
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

// 删除目录
func NewDeleteCategoryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteCategoryLogic {
	return &DeleteCategoryLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteCategoryLogic) DeleteCategory(req *types.DeleteCategoryReq) (resp *types.BaseResp, err error) {
	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)

	// 1. 查询目录是否存在
	existingCategory, err := categoryRepository.GetCategory(l.ctx, int64(req.ID))
	if err != nil {
		logx.Errorf("查询目录失败: %v", err)
		return customererrors.FailMsg("查询目录失败"), nil
	}

	if existingCategory == nil || existingCategory.ID == 0 {
		return customererrors.FailMsg("目录不存在"), nil
	}

	// 2. 软删除目录（使用逻辑删除，设置 is_deleted = 1）
	// 注意：前端会进行子目录检查和提示，后端不需要重复检查
	err = categoryRepository.Delete(l.ctx, int64(req.ID))
	if err != nil {
		logx.Errorf("删除目录失败: %v", err)
		return customererrors.FailMsg("删除目录失败"), nil
	}

	logx.Infof("删除目录成功: ID=%d, Name=%s", req.ID, existingCategory.Name)
	return customererrors.SuccessMsg("删除成功"), nil
}
