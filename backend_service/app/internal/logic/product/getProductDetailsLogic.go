package product

import (
	"context"
	"encoding/json"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

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
	// 获取单个商品信息
	productRepository := repository.NewProductRepository(l.svcCtx.GormDB)

	product, err := productRepository.GetProduct(l.ctx, req.ProductId)
	if err != nil {
		return nil, err
	}
	productInfoJson, err := json.Marshal(product)
	if err != nil {
		return nil, err
	}

	return &types.GetProductResp{
		Code: 0,
		Msg:  "success",
		Data: string(productInfoJson),
	}, err
}
