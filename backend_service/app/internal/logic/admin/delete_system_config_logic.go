// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type DeleteSystemConfigLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除系统参数
func NewDeleteSystemConfigLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteSystemConfigLogic {
	return &DeleteSystemConfigLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteSystemConfigLogic) DeleteSystemConfig(req *types.DeleteSystemConfigReq) (resp *types.BaseResp, err error) {
	configRepo := repository.NewConfigRepository(l.svcCtx.GormDB)
	existing, getErr := configRepo.GetByID(l.ctx, req.ID)
	if getErr != nil {
		if errors.Is(getErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("系统参数不存在"), nil
		}
		l.Errorf("get config by id failed, id=%d, err=%v", req.ID, getErr)
		return customererrors.DatabaseErrorResp("查询系统参数失败"), nil
	}
	if existing.IsSystem == 1 {
		return customererrors.PermissionDeniedResp("系统内置参数不允许删除"), nil
	}
	if deleteErr := configRepo.SoftDelete(l.ctx, req.ID, "system"); deleteErr != nil {
		l.Errorf("delete config failed, id=%d, err=%v", req.ID, deleteErr)
		return customererrors.DatabaseErrorResp("删除系统参数失败"), nil
	}

	return customererrors.SuccessMsg("删除系统参数成功"), nil
}
