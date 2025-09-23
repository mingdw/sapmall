package user

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetRoleMenuLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取用户后台菜单
func NewGetRoleMenuLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRoleMenuLogic {
	return &GetRoleMenuLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetRoleMenuLogic) GetRoleMenu() (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
