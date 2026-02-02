// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type SaveProductLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 保存商品（新增/编辑，全量提交商品信息，返回完整的商品详情）
func NewSaveProductLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveProductLogic {
	return &SaveProductLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveProductLogic) SaveProduct(req *types.SaveProductReq) (resp *types.BaseResp, err error) {
	// 初始化 repository
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
	userInfo, err := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		return nil, errors.New("获取用户信息失败")
	}

	// 获取当前时间
	now := time.Now()
	updator := userInfo.UserCode

	// 步骤1: 处理SPU（新增或更新）
	spuId, spuCode, err := l.modifySpu(l.ctx, productSpuRepository, &req.Spu, userInfo, updator, now)
	if err != nil {
		logx.Errorf("处理SPU失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  err.Error(),
			Data: nil,
		}, nil
	}

	// 步骤2: 处理属性（基础属性、销售属性和规格属性）
	err = l.modifyAllAttributes(l.ctx, attrParamRepository, spuId, spuCode, &req.Attrs, updator, now)
	if err != nil {
		logx.Errorf("保存属性失败: %v", err)
		// 属性保存失败不影响主流程，只记录日志
	}

	// 步骤3: 处理SKU列表
	if len(req.Skus) > 0 {
		err = l.modifySkus(l.ctx, skuRepository, spuId, spuCode, req.Skus, updator, now)
		if err != nil {
			logx.Errorf("保存SKU失败: %v", err)
			return &types.BaseResp{
				Code: 1,
				Msg:  fmt.Sprintf("保存SKU失败: %v", err),
				Data: nil,
			}, nil
		}
		logx.Infof("SKU保存成功，共处理 %d 个SKU", len(req.Skus))
	}

	// 步骤4: 处理商品详情
	// 只有当详情对象存在且至少有一个内容字段不为空时才处理
	if l.hasProductDetailContent(&req.Details) {
		err = l.modifyProductDetail(l.ctx, detailRepository, spuId, spuCode, &req.Details, updator, now)
		if err != nil {
			logx.Errorf("保存商品详情失败: %v", err)
			// 详情保存失败不影响主流程，只记录日志
		}
	} else {
		// 如果所有内容字段都为空，跳过处理（不创建或更新空记录）
		logx.Infof("商品详情所有字段为空，跳过处理: ProductSpuID=%d", spuId)
	}

	// 重新查询完整的商品详情并返回（确保返回数据库中的最新实例，包含自动生成的ID、时间戳等）
	getDetailLogic := NewGetProductDetailLogic(l.ctx, l.svcCtx)
	detailReq := &types.GetProductDetailReq{Id: spuId}
	detailResp, err := getDetailLogic.GetProductDetail(detailReq)
	if err != nil {
		logx.Errorf("查询商品详情失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "保存成功，但查询详情失败",
			Data: nil,
		}, nil
	}

	// 修改返回消息为"保存成功"，表示这是保存操作的结果
	if detailResp != nil {
		detailResp.Msg = "保存成功"
	}

	return detailResp, nil
}

// populateSpuFields 填充SPU的通用字段（从请求数据到SPU模型）
func (l *SaveProductLogic) populateSpuFields(spu *model.ProductSpu, req *types.ProductSPUInfo, price, realPrice float64, updator string, now time.Time) {
	spu.Name = req.Name
	spu.Category1ID = req.Category1Id
	spu.Category1Code = req.Category1Code
	spu.Category2ID = req.Category2Id
	spu.Category2Code = req.Category2Code
	spu.Category3ID = req.Category3Id
	spu.Category3Code = req.Category3Code
	spu.Brand = req.Brand
	spu.Description = req.Description
	spu.Price = price
	spu.RealPrice = realPrice
	spu.Status = req.Status
	spu.ChainStatus = req.ChainStatus
	spu.ChainID = req.ChainId
	spu.ChainTxHash = req.ChainTxHash
	spu.Images = req.Images
	spu.UpdatedAt = now
	spu.Updator = updator
}

// parsePrices 解析价格字符串为 float64
func (l *SaveProductLogic) parsePrices(req *types.ProductSPUInfo) (price, realPrice float64, err error) {
	price, err = strconv.ParseFloat(req.Price, 64)
	if err != nil {
		logx.Errorf("解析价格失败: %v", err)
		return 0, 0, fmt.Errorf("价格格式错误")
	}

	if req.RealPrice != "" {
		realPrice, err = strconv.ParseFloat(req.RealPrice, 64)
		if err != nil {
			logx.Errorf("解析原价失败: %v", err)
			realPrice = 0
		}
	}
	return price, realPrice, nil
}

// modifySpu 处理SPU的新增或更新
// 根据 req.Id 判断是新增（Id == 0）还是更新（Id > 0）
func (l *SaveProductLogic) modifySpu(
	ctx context.Context,
	productSpuRepository repository.ProductSpuRepository,
	req *types.ProductSPUInfo,
	userInfo *model.User,
	updator string,
	now time.Time,
) (spuId int64, spuCode string, err error) {
	// 解析价格
	price, realPrice, err := l.parsePrices(req)
	if err != nil {
		return 0, "", err
	}

	// 判断是新增还是更新
	isNew := req.Id == 0

	if isNew {
		// 新增商品
		// 生成商品编码
		maxID, err := productSpuRepository.GetMaxID(ctx)
		if err != nil {
			logx.Errorf("获取最大ID失败: %v", err)
			return 0, "", fmt.Errorf("生成商品编码失败")
		}
		spuCode = fmt.Sprintf("SPU%08d", maxID+1)

		spu := &model.ProductSpu{
			Code:       spuCode,
			UserID:     userInfo.ID,
			UserCode:   userInfo.UserCode,
			TotalSales: 0,
			TotalStock: 0,
			CreatedAt:  now,
			IsDeleted:  0,
			Creator:    updator,
		}

		// 填充通用字段
		l.populateSpuFields(spu, req, price, realPrice, updator, now)

		err = productSpuRepository.CreateProductSpu(ctx, spu)
		if err != nil {
			logx.Errorf("创建商品SPU失败: %v", err)
			return 0, "", fmt.Errorf("创建商品失败")
		}

		spuId = spu.ID
		spuCode = spu.Code
		logx.Infof("创建商品成功: ID=%d, Code=%s, Name=%s", spuId, spuCode, spu.Name)
	} else {
		// 更新商品
		spuId = req.Id
		spuCode = req.Code

		// 查询现有商品
		existingSpu, err := productSpuRepository.GetProductSpu(ctx, spuId)
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return 0, "", fmt.Errorf("商品不存在")
			}
			logx.Errorf("查询商品失败: %v", err)
			return 0, "", fmt.Errorf("查询商品失败")
		}

		// 检查商品是否属于当前用户
		if existingSpu.UserCode != userInfo.UserCode {
			return 0, "", fmt.Errorf("无权修改该商品")
		}

		// 填充通用字段
		l.populateSpuFields(existingSpu, req, price, realPrice, updator, now)

		err = productSpuRepository.UpdateProductSpu(ctx, existingSpu)
		if err != nil {
			logx.Errorf("更新商品SPU失败: %v", err)
			return 0, "", fmt.Errorf("更新商品失败")
		}

		logx.Infof("更新商品成功: ID=%d, Code=%s, Name=%s", spuId, spuCode, existingSpu.Name)
	}

	return spuId, spuCode, nil
}

// modifyAllAttributes 统一处理所有属性类型（基础属性、销售属性、规格属性）
// 采用 UPDATE + INSERT + DELETE 模式，通过 code + attr_type 匹配现有记录，保留原ID，避免ID浪费
func (l *SaveProductLogic) modifyAllAttributes(
	ctx context.Context,
	attrParamRepository repository.ProductSpuAttrParamsRepository,
	spuId int64,
	spuCode string,
	attrsInfo *types.ProductAttrsInfo,
	updator string,
	now time.Time,
) error {
	// 步骤1: 查询现有属性（类型1,2,3），构建映射表 key: code+attrType -> value: existingAttr
	existingAttrs, err := attrParamRepository.GetAllProductSpuAttrParams(ctx, spuId)
	if err != nil {
		logx.Errorf("查询现有属性失败: %v", err)
		return fmt.Errorf("查询现有属性失败: %v", err)
	}

	// 构建现有属性的映射表：key = code + "_" + strconv.Itoa(attrType)
	existingAttrMap := make(map[string]*model.ProductSpuAttrParams)
	for _, attr := range existingAttrs {
		key := fmt.Sprintf("%s_%d", attr.Code, attr.AttrType)
		existingAttrMap[key] = attr
	}

	// 步骤2: 收集所有需要处理的属性
	allAttrs := make([]types.ProductAttrParamInfo, 0, len(attrsInfo.BaseAttrs)+len(attrsInfo.SaleAttrs)+len(attrsInfo.SpecAttrs))
	allAttrs = append(allAttrs, attrsInfo.BaseAttrs...)
	allAttrs = append(allAttrs, attrsInfo.SaleAttrs...)
	allAttrs = append(allAttrs, attrsInfo.SpecAttrs...)

	// 步骤3: 处理每个属性：UPDATE（存在）或 INSERT（不存在）
	processedKeys := make(map[string]bool) // 记录已处理的属性key
	updateCount := 0
	insertCount := 0

	for _, attrInfo := range allAttrs {
		key := fmt.Sprintf("%s_%d", attrInfo.Code, attrInfo.AttrType)
		processedKeys[key] = true

		if existingAttr, exists := existingAttrMap[key]; exists {
			// 属性已存在，执行UPDATE（保留原ID）
			existingAttr.ProductSpuCode = spuCode
			existingAttr.Name = attrInfo.Name
			existingAttr.ValueType = attrInfo.ValueType
			existingAttr.Value = attrInfo.Value
			existingAttr.Sort = attrInfo.Sort
			existingAttr.Status = attrInfo.Status
			existingAttr.IsRequired = attrInfo.IsRequired
			existingAttr.IsGeneric = attrInfo.IsGeneric
			existingAttr.UpdatedAt = now
			existingAttr.Updator = updator
			existingAttr.IsDeleted = 0 // 确保未删除

			err = attrParamRepository.UpdateProductSpuAttrParams(ctx, existingAttr)
			if err != nil {
				logx.Errorf("更新属性失败: Code=%s, AttrType=%d, Error=%v", attrInfo.Code, attrInfo.AttrType, err)
				return fmt.Errorf("更新属性失败: %v", err)
			}
			updateCount++
		} else {
			// 属性不存在，执行INSERT（新ID）
			newAttr := &model.ProductSpuAttrParams{
				ProductSpuID:   spuId,
				ProductSpuCode: spuCode,
				Code:           attrInfo.Code,
				Name:           attrInfo.Name,
				AttrType:       attrInfo.AttrType,
				ValueType:      attrInfo.ValueType,
				Value:          attrInfo.Value,
				Sort:           attrInfo.Sort,
				Status:         attrInfo.Status,
				IsRequired:     attrInfo.IsRequired,
				IsGeneric:      attrInfo.IsGeneric,
				CreatedAt:      now,
				UpdatedAt:      now,
				IsDeleted:      0,
				Creator:        updator,
				Updator:        updator,
			}

			err = attrParamRepository.CreateProductSpuAttrParams(ctx, newAttr)
			if err != nil {
				logx.Errorf("创建属性失败: Code=%s, AttrType=%d, Error=%v", attrInfo.Code, attrInfo.AttrType, err)
				return fmt.Errorf("创建属性失败: %v", err)
			}
			insertCount++
		}
	}

	// 步骤4: 删除多余的属性（在现有属性中存在，但在请求中不存在的）
	deleteCount := 0
	for key, existingAttr := range existingAttrMap {
		if !processedKeys[key] {
			// 该属性在请求中不存在，执行软删除
			err = attrParamRepository.DeleteProductSpuAttrParams(ctx, existingAttr.ID)
			if err != nil {
				logx.Errorf("删除属性失败: ID=%d, Code=%s, AttrType=%d, Error=%v", existingAttr.ID, existingAttr.Code, existingAttr.AttrType, err)
				return fmt.Errorf("删除属性失败: %v", err)
			}
			deleteCount++
		}
	}

	logx.Infof("属性处理完成（SPU ID=%d, Code=%s）: 更新 %d 个，新增 %d 个，删除 %d 个", spuId, spuCode, updateCount, insertCount, deleteCount)
	return nil
}

// modifySkus 处理SKU的新增或更新
// 采用 UPDATE + INSERT + DELETE 模式，通过 indexs 匹配现有记录，保留原ID，避免ID浪费
func (l *SaveProductLogic) modifySkus(
	ctx context.Context,
	skuRepository repository.ProductSkuRepository,
	spuId int64,
	spuCode string,
	skus []types.ProductSKUInfo,
	updator string,
	now time.Time,
) error {
	// 解析价格字符串为 float64
	parsePrice := func(priceStr string) (float64, error) {
		price, err := strconv.ParseFloat(priceStr, 64)
		if err != nil {
			return 0, fmt.Errorf("解析SKU价格失败: %v", err)
		}
		return price, nil
	}

	// 步骤1: 查询现有SKU，构建映射表 key: indexs -> value: existingSku
	existingSkus, err := skuRepository.ListProductSkus(ctx, spuId)
	if err != nil {
		logx.Errorf("查询现有SKU失败: %v", err)
		return fmt.Errorf("查询现有SKU失败: %v", err)
	}

	// 构建现有SKU的映射表：key = indexs
	existingSkuMap := make(map[string]*model.ProductSku)
	for _, sku := range existingSkus {
		existingSkuMap[sku.Indexs] = sku
	}

	// 步骤2: 处理每个SKU：UPDATE（存在）或 INSERT（不存在）
	processedIndexs := make(map[string]bool) // 记录已处理的indexs
	updateCount := 0
	insertCount := 0

	for _, skuInfo := range skus {
		processedIndexs[skuInfo.Indexs] = true

		price, err := parsePrice(skuInfo.Price)
		if err != nil {
			logx.Errorf("SKU价格解析失败: %v", err)
			return err
		}

		// 如果 skuCode 为空，自动生成唯一编码（格式：SPUCode-Indexs）
		generatedSkuCode := skuInfo.SkuCode
		if generatedSkuCode == "" {
			generatedSkuCode = fmt.Sprintf("%s-%s", spuCode, skuInfo.Indexs)
		}

		if existingSku, exists := existingSkuMap[skuInfo.Indexs]; exists {
			// SKU已存在，执行UPDATE（保留原ID和SaleCount）
			existingSku.ProductSpuCode = spuCode
			existingSku.SkuCode = generatedSkuCode
			existingSku.Price = price
			existingSku.Stock = skuInfo.Stock
			// SaleCount 保持不变，不覆盖
			existingSku.Status = skuInfo.Status
			existingSku.AttrParams = skuInfo.AttrParams
			existingSku.OwnerParams = skuInfo.OwnerParams
			existingSku.Images = skuInfo.Images
			existingSku.Title = skuInfo.Title
			existingSku.SubTitle = skuInfo.SubTitle
			existingSku.Description = skuInfo.Description
			existingSku.UpdatedAt = now
			existingSku.Updator = updator
			existingSku.IsDeleted = 0 // 确保未删除

			err = skuRepository.UpdateProductSku(ctx, existingSku)
			if err != nil {
				logx.Errorf("更新SKU失败: Indexs=%s, SkuCode=%s, Error=%v", skuInfo.Indexs, generatedSkuCode, err)
				return fmt.Errorf("更新SKU失败: %v", err)
			}
			updateCount++
		} else {
			// SKU不存在，执行INSERT（新ID）
			newSKU := &model.ProductSku{
				ProductSpuID:   spuId,
				ProductSpuCode: spuCode,
				SkuCode:        generatedSkuCode,
				Price:          price,
				Stock:          skuInfo.Stock,
				SaleCount:      0,
				Status:         skuInfo.Status,
				Indexs:         skuInfo.Indexs,
				AttrParams:     skuInfo.AttrParams,
				OwnerParams:    skuInfo.OwnerParams,
				Images:         skuInfo.Images,
				Title:          skuInfo.Title,
				SubTitle:       skuInfo.SubTitle,
				Description:    skuInfo.Description,
				CreatedAt:      now,
				UpdatedAt:      now,
				IsDeleted:      0,
				Creator:        updator,
				Updator:        updator,
			}

			err = skuRepository.CreateProductSku(ctx, newSKU)
			if err != nil {
				logx.Errorf("创建SKU失败: Indexs=%s, SkuCode=%s, Error=%v", skuInfo.Indexs, generatedSkuCode, err)
				return fmt.Errorf("创建SKU失败: %v", err)
			}
			insertCount++
		}
	}

	// 步骤3: 删除多余的SKU（在现有SKU中存在，但在请求中不存在的）
	deleteCount := 0
	for indexs, existingSku := range existingSkuMap {
		if !processedIndexs[indexs] {
			// 该SKU在请求中不存在，执行物理删除
			err = skuRepository.DeleteProductSku(ctx, existingSku.ID)
			if err != nil {
				logx.Errorf("删除SKU失败: ID=%d, Indexs=%s, Error=%v", existingSku.ID, indexs, err)
				return fmt.Errorf("删除SKU失败: %v", err)
			}
			deleteCount++
		}
	}

	logx.Infof("SKU处理完成（SPU ID=%d, Code=%s）: 更新 %d 个，新增 %d 个，删除 %d 个", spuId, spuCode, updateCount, insertCount, deleteCount)
	return nil
}

// hasProductDetailContent 检查商品详情是否至少有一个内容字段不为空
func (l *SaveProductLogic) hasProductDetailContent(detailInfo *types.ProductDetailInfo) bool {
	if detailInfo == nil {
		return false
	}
	// 检查所有内容字段（detail、packingList、afterSale）是否都为空
	detail := strings.TrimSpace(detailInfo.Detail)
	packingList := strings.TrimSpace(detailInfo.PackingList)
	afterSale := strings.TrimSpace(detailInfo.AfterSale)
	// 至少有一个字段不为空才返回 true
	return detail != "" || packingList != "" || afterSale != ""
}

// modifyProductDetail 处理商品详情的新增或更新
// 先删除该SPU的详情，然后新增新详情
// 注意：调用此函数前应确保至少有一个内容字段不为空（通过 hasProductDetailContent 检查）
func (l *SaveProductLogic) modifyProductDetail(
	ctx context.Context,
	detailRepository repository.ProductSpuDetailRepository,
	spuId int64,
	spuCode string,
	detailInfo *types.ProductDetailInfo,
	updator string,
	now time.Time,
) error {
	// 再次检查内容是否为空（防御性编程）
	if !l.hasProductDetailContent(detailInfo) {
		logx.Infof("商品详情所有字段为空，跳过处理: ProductSpuID=%d", spuId)
		return nil
	}

	// 步骤1: 删除现有详情（软删除）
	err := detailRepository.DeleteProductSpuDetail(ctx, spuId)
	if err != nil {
		// 如果删除失败，可能是记录不存在，继续执行新增操作
		logx.Infof("删除商品详情失败或记录不存在: ProductSpuID=%d, Error=%v", spuId, err)
	} else {
		logx.Infof("删除商品详情成功: ProductSpuID=%d", spuId)
	}

	// 步骤2: 创建新详情
	newDetail := &model.ProductSpuDetail{
		ProductSpuID:   spuId,
		ProductSpuCode: spuCode,
		Detail:         []byte(detailInfo.Detail),
		PackingList:    []byte(detailInfo.PackingList),
		AfterSale:      []byte(detailInfo.AfterSale),
		CreatedAt:      now,
		UpdatedAt:      now,
		IsDeleted:      0,
		Creator:        updator,
		Updator:        updator,
	}

	err = detailRepository.CreateProductSpuDetail(ctx, newDetail)
	if err != nil {
		logx.Errorf("创建商品详情失败: %v", err)
		return fmt.Errorf("创建商品详情失败: %v", err)
	}
	logx.Infof("创建商品详情成功: ProductSpuID=%d", spuId)

	return nil
}
