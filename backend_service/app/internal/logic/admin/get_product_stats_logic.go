// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetProductStatsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取商品统计信息
func NewGetProductStatsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetProductStatsLogic {
	return &GetProductStatsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetProductStatsLogic) GetProductStats(req *types.GetProductStatsReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
