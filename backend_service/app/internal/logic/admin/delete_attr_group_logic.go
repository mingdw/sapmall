// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteAttrGroupLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除属性组
func NewDeleteAttrGroupLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteAttrGroupLogic {
	return &DeleteAttrGroupLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteAttrGroupLogic) DeleteAttrGroup(req *types.DeleteAttrGroupReq) (resp *types.BaseResp, err error) {
	attrGroupRepository := repository.NewAttrGroupRepository(l.svcCtx.GormDB)

	// 1. 查询属性组是否存在
	existingAttrGroup, err := attrGroupRepository.GetAttrGroup(l.ctx, req.ID)
	if err != nil {
		logx.Errorf("查询属性组失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询属性组失败",
			Data: nil,
		}, nil
	}

	if existingAttrGroup == nil || existingAttrGroup.ID == 0 {
		return &types.BaseResp{
			Code: 1,
			Msg:  "属性组不存在",
			Data: nil,
		}, nil
	}

	// 2. 软删除属性组（使用逻辑删除，设置 is_deleted = 1）
	err = attrGroupRepository.Delete(l.ctx, int64(req.ID))
	if err != nil {
		logx.Errorf("删除属性组失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "删除属性组失败",
			Data: nil,
		}, nil
	}

	logx.Infof("删除属性组成功: ID=%d, Name=%s", req.ID, existingAttrGroup.AttrGroupName)

	return &types.BaseResp{
		Code: 0,
		Msg:  "删除成功",
		Data: nil,
	}, nil
}
