// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type BatchActivateProductLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 批量上架商品
func NewBatchActivateProductLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BatchActivateProductLogic {
	return &BatchActivateProductLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BatchActivateProductLogic) BatchActivateProduct(req *types.BatchActivateProductReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
