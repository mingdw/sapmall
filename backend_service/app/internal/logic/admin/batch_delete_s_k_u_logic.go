// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type BatchDeleteSKULogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 批量删除SKU
func NewBatchDeleteSKULogic(ctx context.Context, svcCtx *svc.ServiceContext) *BatchDeleteSKULogic {
	return &BatchDeleteSKULogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BatchDeleteSKULogic) BatchDeleteSKU(req *types.BatchDeleteSKUReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
