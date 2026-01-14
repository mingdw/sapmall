// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type BatchDeactivateProductLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 批量下架商品
func NewBatchDeactivateProductLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BatchDeactivateProductLogic {
	return &BatchDeactivateProductLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BatchDeactivateProductLogic) BatchDeactivateProduct(req *types.BatchDeactivateProductReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
