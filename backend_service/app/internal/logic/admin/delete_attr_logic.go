// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteAttrLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除属性
func NewDeleteAttrLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteAttrLogic {
	return &DeleteAttrLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteAttrLogic) DeleteAttr(req *types.DeleteAttrReq) (resp *types.BaseResp, err error) {
	attrRepository := repository.NewAttrRepository(l.svcCtx.GormDB)

	// 1. 查询属性是否存在
	existingAttr, err := attrRepository.GetAttr(l.ctx, req.ID)
	if err != nil {
		logx.Errorf("查询属性失败: %v", err)
		return customererrors.FailMsg("查询属性失败"), nil
	}

	if existingAttr == nil || existingAttr.ID == 0 {
		return customererrors.FailMsg("属性不存在"), nil
	}

	// 2. 软删除属性（使用逻辑删除，设置 is_deleted = 1）
	err = attrRepository.Delete(l.ctx, int64(req.ID))
	if err != nil {
		logx.Errorf("删除属性失败: %v", err)
		return customererrors.FailMsg("删除属性失败"), nil
	}

	logx.Infof("删除属性成功: ID=%d, Name=%s", req.ID, existingAttr.AttrName)
	return customererrors.SuccessData(nil), nil
}
