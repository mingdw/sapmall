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

type DeleteDictItemLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除字典项
func NewDeleteDictItemLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteDictItemLogic {
	return &DeleteDictItemLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteDictItemLogic) DeleteDictItem(req *types.DeleteDictItemReq) (resp *types.BaseResp, err error) {
	itemRepo := repository.NewDictItemRepository(l.svcCtx.GormDB)
	_, getErr := itemRepo.GetByID(l.ctx, req.ID)
	if getErr != nil {
		if errors.Is(getErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("字典项不存在"), nil
		}
		l.Errorf("get dict item by id failed, id=%d, err=%v", req.ID, getErr)
		return customererrors.DatabaseErrorResp("查询字典项失败"), nil
	}

	if deleteErr := itemRepo.SoftDelete(l.ctx, req.ID, "system"); deleteErr != nil {
		l.Errorf("delete dict item failed, id=%d, err=%v", req.ID, deleteErr)
		return customererrors.DatabaseErrorResp("删除字典项失败"), nil
	}

	return customererrors.SuccessMsg("删除字典项成功"), nil
}
