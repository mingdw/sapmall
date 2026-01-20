// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ListAttrParamLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取属性参数列表
func NewListAttrParamLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListAttrParamLogic {
	return &ListAttrParamLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListAttrParamLogic) ListAttrParam(req *types.ListAttrParamReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
