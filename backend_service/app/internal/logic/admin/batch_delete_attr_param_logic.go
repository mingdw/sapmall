// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type BatchDeleteAttrParamLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 批量删除属性参数
func NewBatchDeleteAttrParamLogic(ctx context.Context, svcCtx *svc.ServiceContext) *BatchDeleteAttrParamLogic {
	return &BatchDeleteAttrParamLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *BatchDeleteAttrParamLogic) BatchDeleteAttrParam(req *types.BatchDeleteAttrParamReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
