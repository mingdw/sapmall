package product

import (
	"context"

	"sapphire-mall/internal/svc"
	"sapphire-mall/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ProductsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 分页查询多个产品
func NewProductsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ProductsLogic {
	return &ProductsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ProductsLogic) Products(req *types.ListProductsReq) (resp *types.ListProductsResp, err error) {
	// todo: add your logic here and delete this line

	return
}
