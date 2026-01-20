// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ListSKULogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取SKU列表
func NewListSKULogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListSKULogic {
	return &ListSKULogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListSKULogic) ListSKU(req *types.ListSKUReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
