// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetProductFullDetailLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取商品完整详情（包含SKU、属性参数、详情等）
func NewGetProductFullDetailLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetProductFullDetailLogic {
	return &GetProductFullDetailLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetProductFullDetailLogic) GetProductFullDetail(req *types.GetProductDetailReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
