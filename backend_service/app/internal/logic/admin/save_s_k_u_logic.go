// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type SaveSKULogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 保存SKU（新增/编辑）
func NewSaveSKULogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveSKULogic {
	return &SaveSKULogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveSKULogic) SaveSKU(req *types.SaveSKUReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
