// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type BatchDeleteProductLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 批量删除商品
func NewBatchDeleteProductLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BatchDeleteProductLogic {
	return &BatchDeleteProductLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BatchDeleteProductLogic) BatchDeleteProduct(req *types.BatchDeleteProductReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
