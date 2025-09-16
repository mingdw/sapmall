package product

import (
	"context"

	"sapphire-mall/internal/svc"
	"sapphire-mall/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetProductDetailsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 查询产品详细信息
func NewGetProductDetailsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetProductDetailsLogic {
	return &GetProductDetailsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetProductDetailsLogic) GetProductDetails(req *types.GetProductReq) (resp *types.GetProductResp, err error) {
	// todo: add your logic here and delete this line

	return
}
