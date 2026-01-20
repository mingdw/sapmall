// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"fmt"

	"sapphire-mall/app/internal/middleware"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

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

	// 从 context 获取用户信息
	userInfo, ok := l.ctx.Value("userInfo").(*model.User)
	if !ok || userInfo == nil {
		// 如果没有用户信息，尝试从 context 获取 userId
		userID, ok := l.ctx.Value(middleware.ComerUinContextKey).(int64)
		if !ok {
			logx.Errorf("无法获取用户信息")
			return &types.BaseResp{
				Code: 401,
				Msg:  "用户未登录",
				Data: nil,
			}, nil
		}
		userRepository := repository.NewUserRepository(l.svcCtx.GormDB)
		userInfo, err = userRepository.GetByID(l.ctx, userID)
		if err != nil {
			logx.Errorf("获取用户信息失败: %v", err)
			return &types.BaseResp{
				Code: 401,
				Msg:  "获取用户信息失败",
				Data: nil,
			}, nil
		}
	}

	// 查询商品详情
	spu, err := productSpuRepository.GetProductSpu(l.ctx, req.Id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return &types.BaseResp{
				Code: 1,
				Msg:  "商品不存在",
				Data: nil,
			}, nil
		}
		logx.Errorf("查询商品详情失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询商品详情失败",
			Data: nil,
		}, nil
	}

	// 检查商品是否属于当前用户
	if spu.UserCode != userInfo.UserCode {
		return &types.BaseResp{
			Code: 403,
			Msg:  "无权访问该商品",
			Data: nil,
		}, nil
	}

	// 检查商品是否已删除
	if spu.IsDeleted != 0 {
		return &types.BaseResp{
			Code: 1,
			Msg:  "商品已删除",
			Data: nil,
		}, nil
	}

	// 转换为响应格式
	productInfo := l.convertToProductSPUInfo(spu)

	return &types.BaseResp{
		Code: 0,
		Msg:  "查询成功",
		Data: productInfo,
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
