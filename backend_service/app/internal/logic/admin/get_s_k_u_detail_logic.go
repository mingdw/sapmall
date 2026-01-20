// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetSKUDetailLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取SKU详情
func NewGetSKUDetailLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetSKUDetailLogic {
	return &GetSKUDetailLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetSKUDetailLogic) GetSKUDetail(req *types.GetSKUDetailReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
