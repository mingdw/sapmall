// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"
	"fmt"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type GetProductDetailLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取商品详情
func NewGetProductDetailLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetProductDetailLogic {
	return &GetProductDetailLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetProductDetailLogic) GetProductDetail(req *types.GetProductDetailReq) (resp *types.BaseResp, err error) {
	productSpuRepository := repository.NewProductSpuRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)
	attrParamRepository := repository.NewProductSpuAttrParamsRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)
	skuRepository := repository.NewProductSkuRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)
	detailRepository := repository.NewProductSpuDetailRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)
	// 从 context 获取用户信息
	_, err = user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		return nil, errors.New("获取用户信息失败")
	}

	// 查询商品SPU信息
	spu, err := productSpuRepository.GetProductSpu(l.ctx, req.Id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return &types.BaseResp{
				Code: 0,
				Msg:  "success",
				Data: nil,
			}, nil
		}
		logx.Errorf("查询商品详情失败: %v", err)
		return nil, errors.New("查询商品详情失败")
	}

	// 一次性查询所有属性（基础属性、销售属性、规格属性），然后按 attr_type 分组
	allAttrs, err := attrParamRepository.GetAllProductSpuAttrParams(l.ctx, req.Id)
	if err != nil {
		logx.Errorf("查询商品属性失败: %v", err)
		allAttrs = []*model.ProductSpuAttrParams{} // 如果查询失败，返回空数组
	}

	// 按 attr_type 分组：1-基础属性，2-销售属性，3-规格属性
	baseAttrs := make([]*model.ProductSpuAttrParams, 0)
	saleAttrs := make([]*model.ProductSpuAttrParams, 0)
	specAttrs := make([]*model.ProductSpuAttrParams, 0)
	for _, attr := range allAttrs {
		if attr == nil {
			continue
		}
		switch attr.AttrType {
		case 1:
			baseAttrs = append(baseAttrs, attr)
		case 2:
			saleAttrs = append(saleAttrs, attr)
		case 3:
			specAttrs = append(specAttrs, attr)
		}
	}

	// 查询SKU列表
	skus, err := skuRepository.ListProductSkus(l.ctx, req.Id)
	if err != nil {
		logx.Errorf("查询SKU列表失败: %v", err)
		skus = []*model.ProductSku{} // 如果查询失败，返回空数组
	}

	// 查询商品详情
	detail, err := detailRepository.GetProductSpuDetail(l.ctx, req.Id)
	if err != nil && err != gorm.ErrRecordNotFound {
		logx.Errorf("查询商品详情失败: %v", err)
		detail = nil // 如果查询失败，返回nil
	}

	// 转换为响应格式
	spuInfo := l.convertToProductSPUInfo(spu)
	detailInfo := l.convertToProductDetailInfo(detail)

	productDetailResp := &types.ProductDetailResp{
		Spu:     *spuInfo,
		Attrs:   l.convertToProductAttrsInfo(baseAttrs, saleAttrs, specAttrs),
		Skus:    l.convertToProductSKUInfoList(skus),
		Details: *detailInfo,
	}

	return &types.BaseResp{
		Code: 0,
		Msg:  "查询成功",
		Data: productDetailResp,
	}, nil
}

// convertToProductSPUInfo 将 model.ProductSpu 转换为 types.ProductSPUInfo
func (l *GetProductDetailLogic) convertToProductSPUInfo(spu *model.ProductSpu) *types.ProductSPUInfo {
	if spu == nil {
		return nil
	}

	return &types.ProductSPUInfo{
		Id:            spu.ID,
		Code:          spu.Code,
		Name:          spu.Name,
		Category1Id:   spu.Category1ID,
		Category1Code: spu.Category1Code,
		Category2Id:   spu.Category2ID,
		Category2Code: spu.Category2Code,
		Category3Id:   spu.Category3ID,
		Category3Code: spu.Category3Code,
		UserId:        spu.UserID,
		UserCode:      spu.UserCode,
		TotalSales:    int64(spu.TotalSales),
		TotalStock:    int64(spu.TotalStock),
		Brand:         spu.Brand,
		Description:   spu.Description,
		Price:         fmt.Sprintf("%.2f", spu.Price),
		RealPrice:     fmt.Sprintf("%.2f", spu.RealPrice),
		Status:        spu.Status,
		ChainStatus:   spu.ChainStatus,
		ChainId:       spu.ChainID,
		ChainTxHash:   spu.ChainTxHash,
		Images:        spu.Images,
		CreatedAt:     spu.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:     spu.UpdatedAt.Format("2006-01-02 15:04:05"),
		Creator:       spu.Creator,
		Updator:       spu.Updator,
	}
}

// convertToProductAttrsInfo 将属性列表转换为 types.ProductAttrsInfo
func (l *GetProductDetailLogic) convertToProductAttrsInfo(baseAttrs, saleAttrs, specAttrs []*model.ProductSpuAttrParams) types.ProductAttrsInfo {
	// 处理基础属性：使用 make 确保返回非nil的空切片
	baseAttrsList := make([]types.ProductAttrParamInfo, 0)
	for _, attr := range baseAttrs {
		if attr != nil {
			baseAttrsList = append(baseAttrsList, l.convertToProductAttrParamInfo(attr))
		}
	}

	// 处理销售属性：使用 make 确保返回非nil的空切片，避免JSON序列化时字段被省略
	// 即使 saleAttrs 为空或nil，也会返回一个非nil的空切片，确保 sale_attrs 字段始终存在于JSON响应中
	saleAttrsList := make([]types.ProductAttrParamInfo, 0)
	for _, attr := range saleAttrs {
		if attr != nil {
			saleAttrsList = append(saleAttrsList, l.convertToProductAttrParamInfo(attr))
		}
	}

	// 处理规格属性：使用 make 确保返回非nil的空切片，避免JSON序列化时字段被省略
	// 即使 specAttrs 为空或nil，也会返回一个非nil的空切片，确保 spec_attrs 字段始终存在于JSON响应中
	specAttrsList := make([]types.ProductAttrParamInfo, 0)
	for _, attr := range specAttrs {
		if attr != nil {
			specAttrsList = append(specAttrsList, l.convertToProductAttrParamInfo(attr))
		}
	}

	return types.ProductAttrsInfo{
		BaseAttrs: baseAttrsList,
		SaleAttrs: saleAttrsList, // 确保返回非nil的空切片，即使没有销售属性
		SpecAttrs: specAttrsList, // 确保返回非nil的空切片，即使没有规格属性
	}
}

// convertToProductAttrParamInfo 将 model.ProductSpuAttrParams 转换为 types.ProductAttrParamInfo
func (l *GetProductDetailLogic) convertToProductAttrParamInfo(param *model.ProductSpuAttrParams) types.ProductAttrParamInfo {
	if param == nil {
		return types.ProductAttrParamInfo{}
	}

	return types.ProductAttrParamInfo{
		Id:             param.ID,
		ProductSpuId:   param.ProductSpuID,
		ProductSpuCode: param.ProductSpuCode,
		Code:           param.Code,
		Name:           param.Name,
		AttrType:       param.AttrType,
		ValueType:      param.ValueType,
		Value:          param.Value,
		Sort:           param.Sort,
		Status:         param.Status,
		IsRequired:     param.IsRequired,
		IsGeneric:      param.IsGeneric,
		CreatedAt:      param.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:      param.UpdatedAt.Format("2006-01-02 15:04:05"),
		Creator:        param.Creator,
		Updator:        param.Updator,
	}
}

// convertToProductSKUInfoList 将 SKU 列表转换为 types.ProductSKUInfo 列表
func (l *GetProductDetailLogic) convertToProductSKUInfoList(skus []*model.ProductSku) []types.ProductSKUInfo {
	if skus == nil {
		return []types.ProductSKUInfo{}
	}

	skuList := make([]types.ProductSKUInfo, 0, len(skus))
	for _, sku := range skus {
		skuList = append(skuList, l.convertToProductSKUInfo(sku))
	}

	return skuList
}

// convertToProductSKUInfo 将 model.ProductSku 转换为 types.ProductSKUInfo
func (l *GetProductDetailLogic) convertToProductSKUInfo(sku *model.ProductSku) types.ProductSKUInfo {
	if sku == nil {
		return types.ProductSKUInfo{}
	}

	return types.ProductSKUInfo{
		Id:             sku.ID,
		ProductSpuId:   sku.ProductSpuID,
		ProductSpuCode: sku.ProductSpuCode,
		SkuCode:        sku.SkuCode,
		Price:          fmt.Sprintf("%.2f", sku.Price),
		Stock:          sku.Stock,
		SaleCount:      sku.SaleCount,
		Status:         sku.Status,
		Indexs:         sku.Indexs,
		AttrParams:     sku.AttrParams,
		OwnerParams:    sku.OwnerParams,
		Images:         sku.Images,
		Title:          sku.Title,
		SubTitle:       sku.SubTitle,
		Description:    sku.Description,
		CreatedAt:      sku.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:      sku.UpdatedAt.Format("2006-01-02 15:04:05"),
		Creator:        sku.Creator,
		Updator:        sku.Updator,
	}
}

// convertToProductDetailInfo 将 model.ProductSpuDetail 转换为 types.ProductDetailInfo
func (l *GetProductDetailLogic) convertToProductDetailInfo(detail *model.ProductSpuDetail) *types.ProductDetailInfo {
	if detail == nil {
		return nil
	}

	return &types.ProductDetailInfo{
		ProductSpuId:   detail.ProductSpuID,
		ProductSpuCode: detail.ProductSpuCode,
		Detail:         string(detail.Detail),
		PackingList:    string(detail.PackingList),
		AfterSale:      string(detail.AfterSale),
		CreatedAt:      detail.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:      detail.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
}
