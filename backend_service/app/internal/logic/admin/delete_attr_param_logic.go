// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteAttrParamLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除属性参数
func NewDeleteAttrParamLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteAttrParamLogic {
	return &DeleteAttrParamLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteAttrParamLogic) DeleteAttrParam(req *types.DeleteAttrParamReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
