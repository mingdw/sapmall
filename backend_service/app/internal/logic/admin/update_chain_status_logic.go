// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateChainStatusLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 更新商品链上状态
func NewUpdateChainStatusLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateChainStatusLogic {
	return &UpdateChainStatusLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateChainStatusLogic) UpdateChainStatus(req *types.UpdateChainStatusReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
