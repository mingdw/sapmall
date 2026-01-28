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

	// 步骤2: 处理属性（基础属性和销售属性）
	if len(req.Attrs.BaseAttrs) > 0 {
		err = l.modifyAttributes(l.ctx, attrParamRepository, spuId, spuCode, req.Attrs.BaseAttrs, 1, updator, now)
		if err != nil {
			logx.Errorf("保存基础属性失败: %v", err)
			// 属性保存失败不影响主流程，只记录日志
		}
	}

	if len(req.Attrs.SaleAttrs) > 0 {
		err = l.modifyAttributes(l.ctx, attrParamRepository, spuId, spuCode, req.Attrs.SaleAttrs, 2, updator, now)
		if err != nil {
			logx.Errorf("保存销售属性失败: %v", err)
			// 属性保存失败不影响主流程，只记录日志
		}
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
	if req.Details.ProductSpuId > 0 {
		err = l.modifyProductDetail(l.ctx, detailRepository, spuId, spuCode, &req.Details, updator, now)
		if err != nil {
			logx.Errorf("保存商品详情失败: %v", err)
			// 详情保存失败不影响主流程，只记录日志
		}
	}

	// 重新查询完整的商品详情并返回
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

	return detailResp, nil
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
	// 解析价格字符串为 float64
	price, err := strconv.ParseFloat(req.Price, 64)
	if err != nil {
		logx.Errorf("解析价格失败: %v", err)
		return 0, "", fmt.Errorf("价格格式错误")
	}

	var realPrice float64
	if req.RealPrice != "" {
		realPrice, err = strconv.ParseFloat(req.RealPrice, 64)
		if err != nil {
			logx.Errorf("解析原价失败: %v", err)
			realPrice = 0
		}
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
			Code:          spuCode,
			Name:          req.Name,
			Category1ID:   req.Category1Id,
			Category1Code: req.Category1Code,
			Category2ID:   req.Category2Id,
			Category2Code: req.Category2Code,
			Category3ID:   req.Category3Id,
			Category3Code: req.Category3Code,
			UserID:        userInfo.ID,
			UserCode:      userInfo.UserCode,
			TotalSales:    0,
			TotalStock:    0,
			Brand:         req.Brand,
			Description:   req.Description,
			Price:         price,
			RealPrice:     realPrice,
			Status:        req.Status,
			ChainStatus:   req.ChainStatus,
			ChainID:       req.ChainId,
			ChainTxHash:   req.ChainTxHash,
			Images:        req.Images,
			CreatedAt:     now,
			UpdatedAt:     now,
			IsDeleted:     0,
			Creator:       updator,
			Updator:       updator,
		}

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

		// 更新商品信息
		existingSpu.Name = req.Name
		existingSpu.Category1ID = req.Category1Id
		existingSpu.Category1Code = req.Category1Code
		existingSpu.Category2ID = req.Category2Id
		existingSpu.Category2Code = req.Category2Code
		existingSpu.Category3ID = req.Category3Id
		existingSpu.Category3Code = req.Category3Code
		existingSpu.Brand = req.Brand
		existingSpu.Description = req.Description
		existingSpu.Price = price
		existingSpu.RealPrice = realPrice
		existingSpu.Status = req.Status
		existingSpu.ChainStatus = req.ChainStatus
		existingSpu.ChainID = req.ChainId
		existingSpu.ChainTxHash = req.ChainTxHash
		existingSpu.Images = req.Images
		existingSpu.UpdatedAt = now
		existingSpu.Updator = updator

		err = productSpuRepository.UpdateProductSpu(ctx, existingSpu)
		if err != nil {
			logx.Errorf("更新商品SPU失败: %v", err)
			return 0, "", fmt.Errorf("更新商品失败")
		}

		logx.Infof("更新商品成功: ID=%d, Code=%s, Name=%s", spuId, spuCode, existingSpu.Name)
	}

	return spuId, spuCode, nil
}

// modifyAttributes 处理属性的新增或更新
// 根据 attrInfo.Id 判断是新增（Id == 0）还是更新（Id > 0）
func (l *SaveProductLogic) modifyAttributes(
	ctx context.Context,
	attrParamRepository repository.ProductSpuAttrParamsRepository,
	spuId int64,
	spuCode string,
	attrs []types.ProductAttrParamInfo,
	attrType int,
	updator string,
	now time.Time,
) error {
	// 处理每个属性
	for _, attrInfo := range attrs {
		if attrInfo.Id > 0 {
			// 更新现有属性（根据 ID）
			existingAttr, err := attrParamRepository.GetProductSpuAttrParamByID(ctx, attrInfo.Id)
			if err != nil {
				if err == gorm.ErrRecordNotFound {
					// 如果查询不到，创建新属性
					logx.Infof("属性不存在 (ID=%d)，将创建新属性", attrInfo.Id)
					newAttr := &model.ProductSpuAttrParams{
						ProductSpuID:   spuId,
						ProductSpuCode: spuCode,
						Code:           attrInfo.Code,
						Name:           attrInfo.Name,
						AttrType:       attrType,
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
						logx.Errorf("创建属性失败: %v", err)
						return fmt.Errorf("创建属性失败: %v", err)
					}
					continue
				}
				logx.Errorf("查询属性失败 (ID=%d): %v", attrInfo.Id, err)
				return fmt.Errorf("查询属性失败: %v", err)
			}

			// 验证属性是否属于当前商品
			if existingAttr.ProductSpuID != spuId {
				logx.Errorf("属性不属于当前商品: attrId=%d, attrSpuId=%d, currentSpuId=%d",
					attrInfo.Id, existingAttr.ProductSpuID, spuId)
				return fmt.Errorf("属性不属于当前商品")
			}

			// 更新属性
			existingAttr.ProductSpuCode = spuCode
			existingAttr.Code = attrInfo.Code
			existingAttr.Name = attrInfo.Name
			existingAttr.AttrType = attrType
			existingAttr.ValueType = attrInfo.ValueType
			existingAttr.Value = attrInfo.Value
			existingAttr.Sort = attrInfo.Sort
			existingAttr.Status = attrInfo.Status
			existingAttr.IsRequired = attrInfo.IsRequired
			existingAttr.IsGeneric = attrInfo.IsGeneric
			existingAttr.UpdatedAt = now
			existingAttr.Updator = updator

			err = attrParamRepository.UpdateProductSpuAttrParams(ctx, existingAttr)
			if err != nil {
				logx.Errorf("更新属性失败 (ID=%d): %v", attrInfo.Id, err)
				return fmt.Errorf("更新属性失败: %v", err)
			}
			logx.Infof("更新属性成功: ID=%d, Name=%s", attrInfo.Id, attrInfo.Name)
		} else {
			// 创建新属性
			newAttr := &model.ProductSpuAttrParams{
				ProductSpuID:   spuId,
				ProductSpuCode: spuCode,
				Code:           attrInfo.Code,
				Name:           attrInfo.Name,
				AttrType:       attrType,
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

			err := attrParamRepository.CreateProductSpuAttrParams(ctx, newAttr)
			if err != nil {
				logx.Errorf("创建属性失败: %v", err)
				return fmt.Errorf("创建属性失败: %v", err)
			}
			logx.Infof("创建属性成功: Name=%s", attrInfo.Name)
		}
	}

	return nil
}

// modifySkus 处理SKU的新增、更新或删除
// 根据 skuInfo.Id 判断是新增（Id == 0）还是更新（Id > 0）
// 对于不在请求中的现有SKU，将被删除（软删除）
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

	// 步骤1: 查询该SPU的所有现有SKU
	existingSkus, err := skuRepository.ListProductSkus(ctx, spuId)
	if err != nil {
		logx.Errorf("查询现有SKU列表失败: %v", err)
		return fmt.Errorf("查询现有SKU列表失败: %v", err)
	}
	logx.Infof("查询到现有SKU数量: %d, SPU ID: %d", len(existingSkus), spuId)
	for _, sku := range existingSkus {
		logx.Infof("现有SKU: ID=%d, Indexs=%s", sku.ID, sku.Indexs)
	}

	// 步骤2: 构建请求中的SKU映射（ID -> Indexs 和 Indexs -> 是否存在）
	// 用于判断哪些SKU需要保留，哪些需要删除
	requestedSkuMap := make(map[int64]string)   // ID -> Indexs 映射
	requestedIndexsSet := make(map[string]bool) // Indexs 集合
	logx.Infof("请求中的SKU数量: %d", len(skus))
	for _, skuInfo := range skus {
		if skuInfo.Id > 0 {
			requestedSkuMap[skuInfo.Id] = skuInfo.Indexs
			logx.Infof("请求SKU: ID=%d, Indexs=%s", skuInfo.Id, skuInfo.Indexs)
		} else {
			logx.Infof("请求新SKU: Indexs=%s", skuInfo.Indexs)
		}
		if skuInfo.Indexs != "" {
			requestedIndexsSet[skuInfo.Indexs] = true
		}
	}

	// 步骤3: 删除不在请求中的现有SKU（软删除：设置is_deleted=1）
	for _, existingSku := range existingSkus {
		shouldDelete := false

		if existingSku.ID > 0 {
			// 如果SKU有ID，检查是否在请求中
			requestedIndexs, existsInRequest := requestedSkuMap[existingSku.ID]
			if !existsInRequest {
				// ID不在请求中，检查indexs是否在请求中
				if !requestedIndexsSet[existingSku.Indexs] {
					// indexs也不在请求中，应该删除
					shouldDelete = true
				}
			} else {
				// ID在请求中，但indexs可能不同（用户修改了规格）
				// 如果indexs不同，旧的SKU应该被删除（因为会被新SKU替换）
				if requestedIndexs != existingSku.Indexs {
					shouldDelete = true
				}
			}
		} else {
			// SKU没有ID（理论上不应该出现），检查indexs是否在请求中
			if !requestedIndexsSet[existingSku.Indexs] {
				shouldDelete = true
			}
		}

		if shouldDelete {
			logx.Infof("删除SKU: ID=%d, Indexs=%s (不在请求列表中或indexs已变更)", existingSku.ID, existingSku.Indexs)
			// 使用软删除：更新is_deleted字段
			existingSku.IsDeleted = 1
			existingSku.UpdatedAt = now
			existingSku.Updator = updator
			err = skuRepository.UpdateProductSku(ctx, existingSku)
			if err != nil {
				logx.Errorf("删除SKU失败 (ID=%d): %v", existingSku.ID, err)
				// 删除失败不影响主流程，只记录日志
			} else {
				logx.Infof("删除SKU成功: ID=%d, Indexs=%s", existingSku.ID, existingSku.Indexs)
			}
		}
	}

	// 步骤4: 处理请求中的每个SKU（新增或更新）
	for _, skuInfo := range skus {
		price, err := parsePrice(skuInfo.Price)
		if err != nil {
			logx.Errorf("SKU价格解析失败: %v", err)
			return err
		}

		if skuInfo.Id > 0 {
			// 更新现有SKU（根据 ID）
			existingSKU, err := skuRepository.GetProductSku(ctx, skuInfo.Id)
			if err != nil {
				if err == gorm.ErrRecordNotFound {
					// 如果查询不到，创建新SKU
					logx.Infof("SKU不存在 (ID=%d)，将创建新SKU", skuInfo.Id)
					// 如果 skuCode 为空，自动生成唯一编码（格式：SPUCode-Indexs）
					generatedSkuCode := skuInfo.SkuCode
					if generatedSkuCode == "" {
						generatedSkuCode = fmt.Sprintf("%s-%s", spuCode, skuInfo.Indexs)
						logx.Infof("SKU编码为空，自动生成: %s", generatedSkuCode)
					}

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
					logx.Infof("创建SKU成功: ID=%d, Indexs=%s, SkuCode=%s", newSKU.ID, skuInfo.Indexs, generatedSkuCode)
					continue
				}
				logx.Errorf("查询SKU失败 (ID=%d): %v", skuInfo.Id, err)
				return fmt.Errorf("查询SKU失败: %v", err)
			}

			// 验证SKU是否属于当前商品
			if existingSKU.ProductSpuID != spuId {
				logx.Errorf("SKU不属于当前商品: skuId=%d, skuSpuId=%d, currentSpuId=%d",
					skuInfo.Id, existingSKU.ProductSpuID, spuId)
				return fmt.Errorf("SKU不属于当前商品")
			}

			// 更新SKU
			existingSKU.ProductSpuCode = spuCode
			existingSKU.SkuCode = skuInfo.SkuCode
			existingSKU.Price = price
			existingSKU.Stock = skuInfo.Stock
			existingSKU.Status = skuInfo.Status
			existingSKU.Indexs = skuInfo.Indexs
			existingSKU.AttrParams = skuInfo.AttrParams
			existingSKU.OwnerParams = skuInfo.OwnerParams
			existingSKU.Images = skuInfo.Images
			existingSKU.Title = skuInfo.Title
			existingSKU.SubTitle = skuInfo.SubTitle
			existingSKU.Description = skuInfo.Description
			existingSKU.UpdatedAt = now
			existingSKU.Updator = updator

			err = skuRepository.UpdateProductSku(ctx, existingSKU)
			if err != nil {
				logx.Errorf("更新SKU失败 (ID=%d): %v", skuInfo.Id, err)
				return fmt.Errorf("更新SKU失败: %v", err)
			}
			logx.Infof("更新SKU成功: ID=%d, SkuCode=%s", skuInfo.Id, skuInfo.SkuCode)
		} else {
			// 创建新SKU
			// 如果 skuCode 为空，自动生成唯一编码（格式：SPUCode-Indexs）
			generatedSkuCode := skuInfo.SkuCode
			if generatedSkuCode == "" {
				// 使用 SPU编码 + "-" + 规格索引 作为SKU编码
				generatedSkuCode = fmt.Sprintf("%s-%s", spuCode, skuInfo.Indexs)
				logx.Infof("SKU编码为空，自动生成: %s", generatedSkuCode)
			}

			// 检查是否已存在相同skuCode的SKU（包括已删除的）
			existingSkuByCode, err := skuRepository.GetProductSkuByCode(ctx, generatedSkuCode)
			if err == nil && existingSkuByCode != nil {
				// 如果找到相同skuCode的SKU，检查是否属于当前SPU
				if existingSkuByCode.ProductSpuID == spuId {
					// 属于当前SPU，恢复并更新（可能是之前被软删除的）
					logx.Infof("发现已存在的SKU（可能被软删除），恢复并更新: SkuCode=%s, ID=%d", generatedSkuCode, existingSkuByCode.ID)
					existingSkuByCode.ProductSpuCode = spuCode
					existingSkuByCode.Price = price
					existingSkuByCode.Stock = skuInfo.Stock
					existingSkuByCode.Status = skuInfo.Status
					existingSkuByCode.Indexs = skuInfo.Indexs
					existingSkuByCode.AttrParams = skuInfo.AttrParams
					existingSkuByCode.OwnerParams = skuInfo.OwnerParams
					existingSkuByCode.Images = skuInfo.Images
					existingSkuByCode.Title = skuInfo.Title
					existingSkuByCode.SubTitle = skuInfo.SubTitle
					existingSkuByCode.Description = skuInfo.Description
					existingSkuByCode.IsDeleted = 0 // 恢复
					existingSkuByCode.UpdatedAt = now
					existingSkuByCode.Updator = updator

					err = skuRepository.UpdateProductSku(ctx, existingSkuByCode)
					if err != nil {
						logx.Errorf("恢复并更新SKU失败: SkuCode=%s, Error=%v", generatedSkuCode, err)
						return fmt.Errorf("恢复并更新SKU失败: %v", err)
					}
					logx.Infof("恢复并更新SKU成功: ID=%d, Indexs=%s, SkuCode=%s", existingSkuByCode.ID, skuInfo.Indexs, generatedSkuCode)
					continue
				} else {
					// 不属于当前SPU，生成新的唯一编码（添加时间戳）
					generatedSkuCode = fmt.Sprintf("%s-%s-%d", spuCode, skuInfo.Indexs, now.Unix())
					logx.Infof("SKU编码冲突（属于其他SPU），生成新编码: %s", generatedSkuCode)
				}
			} else if err != nil && err != gorm.ErrRecordNotFound {
				// 查询出错（非"未找到"错误）
				logx.Errorf("查询SKU编码失败: SkuCode=%s, Error=%v", generatedSkuCode, err)
				return fmt.Errorf("查询SKU编码失败: %v", err)
			}

			// 创建新SKU
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
				// 如果创建失败且是唯一键冲突错误，尝试恢复已删除的记录
				if strings.Contains(err.Error(), "Duplicate entry") && strings.Contains(err.Error(), "uk_sku_code") {
					logx.Infof("检测到唯一键冲突，尝试恢复已删除的SKU: SkuCode=%s", generatedSkuCode)
					// 重新查询，这次应该能找到已删除的记录
					existingSkuByCode, queryErr := skuRepository.GetProductSkuByCode(ctx, generatedSkuCode)
					if queryErr == nil && existingSkuByCode != nil && existingSkuByCode.ProductSpuID == spuId {
						// 恢复并更新已删除的记录
						existingSkuByCode.ProductSpuCode = spuCode
						existingSkuByCode.Price = price
						existingSkuByCode.Stock = skuInfo.Stock
						existingSkuByCode.Status = skuInfo.Status
						existingSkuByCode.Indexs = skuInfo.Indexs
						existingSkuByCode.AttrParams = skuInfo.AttrParams
						existingSkuByCode.OwnerParams = skuInfo.OwnerParams
						existingSkuByCode.Images = skuInfo.Images
						existingSkuByCode.Title = skuInfo.Title
						existingSkuByCode.SubTitle = skuInfo.SubTitle
						existingSkuByCode.Description = skuInfo.Description
						existingSkuByCode.IsDeleted = 0 // 恢复
						existingSkuByCode.UpdatedAt = now
						existingSkuByCode.Updator = updator

						updateErr := skuRepository.UpdateProductSku(ctx, existingSkuByCode)
						if updateErr != nil {
							logx.Errorf("恢复并更新SKU失败: SkuCode=%s, Error=%v", generatedSkuCode, updateErr)
							return fmt.Errorf("恢复并更新SKU失败: %v", updateErr)
						}
						logx.Infof("恢复并更新SKU成功: ID=%d, Indexs=%s, SkuCode=%s", existingSkuByCode.ID, skuInfo.Indexs, generatedSkuCode)
						continue
					}
				}
				logx.Errorf("创建SKU失败: Indexs=%s, SkuCode=%s, Error=%v", skuInfo.Indexs, generatedSkuCode, err)
				return fmt.Errorf("创建SKU失败: %v", err)
			}
			logx.Infof("创建SKU成功: ID=%d, Indexs=%s, SkuCode=%s", newSKU.ID, skuInfo.Indexs, generatedSkuCode)
		}
	}

	return nil
}

// modifyProductDetail 处理商品详情的新增或更新
// 根据 detailInfo.ProductSpuId 和数据库查询结果判断是新增还是更新
func (l *SaveProductLogic) modifyProductDetail(
	ctx context.Context,
	detailRepository repository.ProductSpuDetailRepository,
	spuId int64,
	spuCode string,
	detailInfo *types.ProductDetailInfo,
	updator string,
	now time.Time,
) error {
	// 查询现有详情
	existingDetail, err := detailRepository.GetProductSpuDetail(ctx, spuId)
	if err != nil && err != gorm.ErrRecordNotFound {
		logx.Errorf("查询商品详情失败: %v", err)
		return fmt.Errorf("查询商品详情失败: %v", err)
	}

	if existingDetail != nil && existingDetail.ProductSpuID > 0 {
		// 更新现有详情
		existingDetail.Detail = []byte(detailInfo.Detail)
		existingDetail.PackingList = []byte(detailInfo.PackingList)
		existingDetail.AfterSale = []byte(detailInfo.AfterSale)
		existingDetail.UpdatedAt = now
		existingDetail.Updator = updator

		err = detailRepository.UpdateProductSpuDetail(ctx, existingDetail)
		if err != nil {
			logx.Errorf("更新商品详情失败: %v", err)
			return fmt.Errorf("更新商品详情失败: %v", err)
		}
		logx.Infof("更新商品详情成功: ProductSpuID=%d", spuId)
	} else {
		// 创建新详情
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
	}

	return nil
}
