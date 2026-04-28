package product

import (
	"context"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sync"

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

func (l *ProductsLogic) Products(req *types.ListProductsReq) (resp *types.BaseResp, err error) {
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
	var productCategories = make([]*types.CategoryProducts, 0, len(categoryCodes))

	type queryResult struct {
		index int
		data  *types.CategoryProducts
		err   error
	}

	results := make([]*queryResult, len(categoryCodes))
	var wg sync.WaitGroup
	sem := make(chan struct{}, 4) // 控制并发，避免数据库瞬时压力过大

	for idx, categoryCode := range categoryCodes {
		category := categoryMap[categoryCode]
		if category == nil {
			continue
		}

		wg.Add(1)
		go func(i int, code string, c *model.Category) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			// 获取该分类下的商品
			products, total, queryErr := productRepository.GetProductsBycategoryCode(l.ctx, code, req.ProductName, req.Page, req.PageSize)
			if queryErr != nil {
				results[i] = &queryResult{index: i, err: queryErr}
				return
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
					UserId:        product.SPU.UserID,
					UserCode:      product.SPU.UserCode,
					TotalSales:    product.SPU.TotalSales,
					TotalStock:    product.SPU.TotalStock,
					Brand:         product.SPU.Brand,
					Price:         product.SPU.Price,
					RealPrice:     product.SPU.RealPrice,
					Status:        product.SPU.Status,
					ChainStatus:   product.SPU.ChainStatus,
					ChainId:       product.SPU.ChainID,
					ChainTxHash:   product.SPU.ChainTxHash,
					Images:        strings.Split(product.SPU.Images, ","), // 直接返回字符串，保持与API定义一致
					Description:   product.SPU.Description,
				})
			}

			results[i] = &queryResult{
				index: i,
				data: &types.CategoryProducts{
					CategoryId:   int64(c.ID),
					CategoryCode: c.Code,
					CategoryName: c.Name,
					ProductCount: total,
					Products:     productSpus,
				},
			}
		}(idx, categoryCode, category)
	}

	wg.Wait()

	for _, result := range results {
		if result == nil {
			continue
		}
		if result.err != nil {
			return nil, result.err
		}
		productCategories = append(productCategories, result.data)
	}
	return &types.BaseResp{
		Code:    0,
		Message: "success",
		Data:    productCategories,
		Total:   len(productCategories),
	}, nil
}
