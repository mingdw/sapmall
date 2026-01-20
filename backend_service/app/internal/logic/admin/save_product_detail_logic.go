// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type SaveProductDetailLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 保存商品详情（包含详情、包装清单、售后服务）
func NewSaveProductDetailLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveProductDetailLogic {
	return &SaveProductDetailLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveProductDetailLogic) SaveProductDetail(req *types.SaveProductDetailReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
