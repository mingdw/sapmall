// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type SaveAttrParamLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 保存属性参数（新增/编辑）
func NewSaveAttrParamLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveAttrParamLogic {
	return &SaveAttrParamLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveAttrParamLogic) SaveAttrParam(req *types.SaveAttrParamReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
