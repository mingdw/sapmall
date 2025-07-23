package product

import (
	"context"
	"encoding/json"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"strings"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

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

	productRepository := repository.NewProductRepository(l.svcCtx.GormDB)

	categoryRepository := repository.NewCategoryRepository(l.svcCtx.GormDB)

	// 解析请求中的分类编码
	var categoryCodes []string
	if req.CategoryCodes != "" {
		categoryCodes = strings.Split(req.CategoryCodes, ",")
	}

	categoryMap := make(map[string]*model.Category)

	// 获取分类信息
	if len(categoryCodes) > 0 {
		categories, err := categoryRepository.GetCategories(l.ctx, categoryCodes)
		if err != nil {
			return nil, err
		}
		for _, category := range categories {
			categoryMap[category.Code] = category
		}
	} else {
		// 如果没有指定分类，默认获取一级分类
		categories, err := categoryRepository.GetCategoriesByParams(l.ctx, &model.Category{Level: 1})
		if err != nil {
			return nil, err
		}
		for _, category := range categories {
			categoryCodes = append(categoryCodes, category.Code)
			categoryMap[category.Code] = category
		}
	}

	// 构造返回结果
	var productCategories = make([]*types.CategoryProducts, 0)

	for _, categoryCode := range categoryCodes {
		category := categoryMap[categoryCode]
		if category == nil {
			continue
		}

		// 获取该分类下的商品
		products, total, err := productRepository.GetProductsBycategoryCode(l.ctx, categoryCode, req.ProductName, req.Page, req.PageSize)
		if err != nil {
			return nil, err
		}

		// 构造商品列表
		var productSpus []*types.Product
		for _, product := range products {
			productSpus = append(productSpus, &types.Product{
				Id:            product.SPU.ID,
				Code:          product.SPU.Code,
				Name:          product.SPU.Name,
				Category1Id:   product.SPU.Category1ID,
				Category1Code: product.SPU.Category1Code,
				Category2Id:   product.SPU.Category2ID,
				Category2Code: product.SPU.Category2Code,
				Category3Id:   product.SPU.Category3ID,
				Category3Code: product.SPU.Category3Code,
				Brand:         product.SPU.Brand,
				Price:         product.SPU.Price,
				RealPrice:     product.SPU.RealPrice,
				TotalSales:    product.SPU.TotalSales,
				TotalStock:    product.SPU.TotalStock,
				Status:        product.SPU.Status,
				Images: func() []string {
					if product.SPU.Images == "" {
						return []string{}
					}
					images := strings.Split(product.SPU.Images, ",")
					var result []string
					for _, img := range images {
						img = strings.TrimSpace(img)
						if img == "" {
							continue
						}
						if strings.HasPrefix(img, "http://") || strings.HasPrefix(img, "https://") || strings.HasPrefix(img, "/") {
							result = append(result, img)
						}
					}
					return result
				}(),
				Description: product.SPU.Description,
			})
		}

		productCategories = append(productCategories, &types.CategoryProducts{
			CategoryId:   int64(category.ID),
			CategoryCode: category.Code,
			CategoryName: category.Name,
			ProductCount: total,
			Products:     productSpus,
		})
	}
	productCategoriesJson, err := json.Marshal(productCategories)

	return &types.ListProductsResp{
		Code: 0,
		Msg:  "success",
		Data: string(productCategoriesJson),
	}, nil
}
