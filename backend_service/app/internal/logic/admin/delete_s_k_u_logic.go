// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteSKULogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除SKU
func NewDeleteSKULogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteSKULogic {
	return &DeleteSKULogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteSKULogic) DeleteSKU(req *types.DeleteSKUReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
