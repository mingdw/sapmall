// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"sapphire-mall/app/internal/middleware"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type SaveProductLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 保存商品（新增/编辑）
func NewSaveProductLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveProductLogic {
	return &SaveProductLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveProductLogic) SaveProduct(req *types.SaveProductReq) (resp *types.BaseResp, err error) {
	productSpuRepository := repository.NewProductSpuRepository(
		repository.NewRepository(l.svcCtx.GormDB),
	)

	// 从 context 获取用户信息
	userInfo, ok := l.ctx.Value("userInfo").(*model.User)
	if !ok || userInfo == nil {
		// 如果没有用户信息，尝试从 context 获取 userId
		userID, ok := l.ctx.Value(middleware.ComerUinContextKey).(int64)
		if !ok {
			userID = 1 // 默认用户ID
		}
		userRepository := repository.NewUserRepository(l.svcCtx.GormDB)
		userInfo, err = userRepository.GetByID(l.ctx, userID)
		if err != nil {
			logx.Errorf("获取用户信息失败: %v", err)
			return &types.BaseResp{
				Code: 1,
				Msg:  "获取用户信息失败",
				Data: nil,
			}, nil
		}
	}

	// 通过 ID 判断是新增还是编辑
	if req.Id == 0 {
		// 新增商品
		return l.createProduct(req, productSpuRepository, userInfo)
	} else {
		// 编辑商品
		return l.updateProduct(req, productSpuRepository, userInfo)
	}
}

// createProduct 新增商品
func (l *SaveProductLogic) createProduct(req *types.SaveProductReq, productSpuRepository repository.ProductSpuRepository, userInfo *model.User) (*types.BaseResp, error) {
	// 1. 生成商品编码（如果前端未提供）
	productCode := req.Code
	if productCode == "" {
		// 生成编码：SPU + 自增序号（基于最大ID+1）
		maxID, err := productSpuRepository.GetMaxID(l.ctx)
		if err != nil {
			logx.Errorf("获取最大ID失败: %v", err)
			// 如果获取最大ID失败，使用时间戳作为后备方案
			productCode = fmt.Sprintf("SPU%d", time.Now().Unix())
		} else {
			// 使用最大ID+1生成编码
			nextID := maxID + 1
			productCode = fmt.Sprintf("SPU%08d", nextID) // 8位数字，前面补0

			// 检查生成的编码是否已存在（防止并发情况）
			for {
				existingProduct, err := productSpuRepository.GetProductSpuByCode(l.ctx, productCode)
				if err != nil && err != gorm.ErrRecordNotFound {
					logx.Errorf("检查编码是否存在失败: %v", err)
					break
				}
				if existingProduct == nil {
					// 编码不存在，可以使用
					break
				}
				// 编码已存在，递增序号重试
				nextID++
				productCode = fmt.Sprintf("SPU%08d", nextID)
			}
		}
	} else {
		// 校验编码是否已存在
		existingProduct, err := productSpuRepository.GetProductSpuByCode(l.ctx, productCode)
		if err != nil && err != gorm.ErrRecordNotFound {
			logx.Errorf("查询商品编码失败: %v", err)
			return &types.BaseResp{
				Code: 1,
				Msg:  "查询商品编码失败",
				Data: nil,
			}, nil
		}
		if existingProduct != nil {
			return &types.BaseResp{
				Code: 1,
				Msg:  "商品编码已存在",
				Data: nil,
			}, nil
		}
	}

	// 2. 转换价格类型（从 string 转为 float64）
	price, err := parsePrice(req.Price)
	if err != nil {
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("价格格式错误: %v", err),
			Data: nil,
		}, nil
	}

	realPrice, err := parsePrice(req.RealPrice)
	if err != nil {
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("原价格式错误: %v", err),
			Data: nil,
		}, nil
	}

	// 3. 设置默认值
	status := req.Status
	if status == 0 {
		status = 0 // 默认草稿状态
	}

	// 4. 创建商品
	productSpu := &model.ProductSpu{
		Code:          productCode,
		Name:          req.Name,
		Category1ID:   req.Category1Id,
		Category1Code: req.Category1Code,
		Category2ID:   req.Category2Id,
		Category2Code: req.Category2Code,
		Category3ID:   req.Category3Id,
		Category3Code: req.Category3Code,
		UserID:        req.UserId,
		UserCode:      req.UserCode,
		TotalSales:    0,
		TotalStock:    0,
		Brand:         req.Brand,
		Description:   req.Description,
		Price:         price,
		RealPrice:     realPrice,
		Status:        status,
		ChainStatus:   req.ChainStatus,
		ChainID:       req.ChainId,
		ChainTxHash:   req.ChainTxHash,
		Images:        req.Images,
		IsDeleted:     0,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		Creator:       userInfo.UserCode,
		Updator:       userInfo.UserCode,
	}

	// 如果请求中没有提供 UserID 和 UserCode，使用当前登录用户的信息
	if productSpu.UserID == 0 {
		productSpu.UserID = userInfo.ID
	}
	if productSpu.UserCode == "" {
		productSpu.UserCode = userInfo.UserCode
	}

	err = productSpuRepository.CreateProductSpu(l.ctx, productSpu)
	if err != nil {
		logx.Errorf("创建商品失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("创建商品失败: %v", err),
			Data: nil,
		}, nil
	}

	logx.Infof("创建商品成功: ID=%d, Name=%s, Code=%s", productSpu.ID, productSpu.Name, productSpu.Code)

	// 转换为响应格式
	productInfo := convertToProductSPUInfo(productSpu)

	return &types.BaseResp{
		Code: 0,
		Msg:  "创建成功",
		Data: productInfo,
	}, nil
}

// updateProduct 编辑商品
func (l *SaveProductLogic) updateProduct(req *types.SaveProductReq, productSpuRepository repository.ProductSpuRepository, userInfo *model.User) (*types.BaseResp, error) {
	// 1. 查询商品是否存在
	existingProduct, err := productSpuRepository.GetProductSpu(l.ctx, req.Id)
	if err != nil {
		logx.Errorf("查询商品失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "商品不存在",
			Data: nil,
		}, nil
	}

	if existingProduct == nil || existingProduct.ID == 0 {
		return &types.BaseResp{
			Code: 1,
			Msg:  "商品不存在",
			Data: nil,
		}, nil
	}

	// 2. 如果更新编码，检查新编码是否已被其他商品使用
	productCode := existingProduct.Code
	if req.Code != "" && req.Code != existingProduct.Code {
		var count int64
		err = productSpuRepository.DB(l.ctx).
			Model(&model.ProductSpu{}).
			Where("code = ? AND id != ? AND is_deleted = ?", req.Code, req.Id, 0).
			Count(&count).Error
		if err != nil {
			logx.Errorf("查询商品编码失败: %v", err)
			return &types.BaseResp{
				Code: 1,
				Msg:  "查询商品编码失败",
				Data: nil,
			}, nil
		}
		if count > 0 {
			return &types.BaseResp{
				Code: 1,
				Msg:  "商品编码已被使用",
				Data: nil,
			}, nil
		}
		productCode = req.Code
	}

	// 3. 转换价格类型
	price := existingProduct.Price
	if req.Price != "" {
		parsedPrice, err := parsePrice(req.Price)
		if err != nil {
			return &types.BaseResp{
				Code: 1,
				Msg:  fmt.Sprintf("价格格式错误: %v", err),
				Data: nil,
			}, nil
		}
		price = parsedPrice
	}

	realPrice := existingProduct.RealPrice
	if req.RealPrice != "" {
		parsedRealPrice, err := parsePrice(req.RealPrice)
		if err != nil {
			return &types.BaseResp{
				Code: 1,
				Msg:  fmt.Sprintf("原价格式错误: %v", err),
				Data: nil,
			}, nil
		}
		realPrice = parsedRealPrice
	}

	// 4. 准备更新数据
	updateProduct := &model.ProductSpu{
		ID:            req.Id,
		Code:          productCode,
		Name:          req.Name,
		Category1ID:   req.Category1Id,
		Category1Code: req.Category1Code,
		Category2ID:   req.Category2Id,
		Category2Code: req.Category2Code,
		Category3ID:   req.Category3Id,
		Category3Code: req.Category3Code,
		Brand:         req.Brand,
		Description:   req.Description,
		Price:         price,
		RealPrice:     realPrice,
		Status:        req.Status,
		Images:        req.Images,
		UpdatedAt:     time.Now(),
		Updator:       userInfo.UserCode,
	}

	// 如果请求中提供了链上相关字段，则更新
	if req.ChainStatus != "" {
		updateProduct.ChainStatus = req.ChainStatus
	} else {
		updateProduct.ChainStatus = existingProduct.ChainStatus
	}
	if req.ChainId != 0 {
		updateProduct.ChainID = req.ChainId
	} else {
		updateProduct.ChainID = existingProduct.ChainID
	}
	if req.ChainTxHash != "" {
		updateProduct.ChainTxHash = req.ChainTxHash
	} else {
		updateProduct.ChainTxHash = existingProduct.ChainTxHash
	}

	// 如果请求中提供了用户信息，则更新
	if req.UserId > 0 {
		updateProduct.UserID = req.UserId
	} else {
		updateProduct.UserID = existingProduct.UserID
	}
	if req.UserCode != "" {
		updateProduct.UserCode = req.UserCode
	} else {
		updateProduct.UserCode = existingProduct.UserCode
	}

	// 5. 执行更新
	err = productSpuRepository.UpdateProductSpu(l.ctx, updateProduct)
	if err != nil {
		logx.Errorf("更新商品失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  fmt.Sprintf("更新商品失败: %v", err),
			Data: nil,
		}, nil
	}

	logx.Infof("更新商品成功: ID=%d, Name=%s", req.Id, req.Name)

	// 获取更新后的商品信息
	updatedProduct, err := productSpuRepository.GetProductSpu(l.ctx, req.Id)
	if err != nil {
		logx.Errorf("获取更新后的商品信息失败: %v", err)
	}

	if updatedProduct != nil {
		productInfo := convertToProductSPUInfo(updatedProduct)
		return &types.BaseResp{
			Code: 0,
			Msg:  "更新成功",
			Data: productInfo,
		}, nil
	}

	return &types.BaseResp{
		Code: 0,
		Msg:  "更新成功",
		Data: convertToProductSPUInfo(updateProduct),
	}, nil
}

// parsePrice 解析价格字符串为 float64
func parsePrice(priceStr string) (float64, error) {
	if priceStr == "" {
		return 0, nil
	}
	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		return 0, fmt.Errorf("无法解析价格: %v", err)
	}
	return price, nil
}

// convertToProductSPUInfo 将 model.ProductSpu 转换为 types.ProductSPUInfo
func convertToProductSPUInfo(spu *model.ProductSpu) *types.ProductSPUInfo {
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
