// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ExportProductLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 导出商品数据
func NewExportProductLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ExportProductLogic {
	return &ExportProductLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ExportProductLogic) ExportProduct(req *types.ExportProductReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
