// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"fmt"
	"strings"
	"time"

	"sapphire-mall/app/internal/middleware"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ListProductLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取商品列表（分页、搜索、筛选）
func NewListProductLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListProductLogic {
	return &ListProductLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListProductLogic) ListProduct(req *types.ListProductReq) (resp *types.BaseResp, err error) {
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

	// 处理分类编码（支持多个，用逗号分隔）
	var categoryCodes []string
	if req.CategoryCodes != "" {
		codes := strings.Split(req.CategoryCodes, ",")
		// 去除空格并过滤空字符串
		for _, code := range codes {
			trimmedCode := strings.TrimSpace(code)
			if trimmedCode != "" {
				categoryCodes = append(categoryCodes, trimmedCode)
			}
		}
	}

	// 处理时间范围
	var startTime, endTime interface{}
	if req.TimeRange != "" {
		startTimePtr, endTimePtr := l.getTimeRange(req.TimeRange)
		if startTimePtr != nil {
			startTime = *startTimePtr
		}
		if endTimePtr != nil {
			endTime = *endTimePtr
		}
	}

	// 分页参数处理
	page := req.Page
	if page < 1 {
		page = 1
	}
	pageSize := req.PageSize
	if pageSize < 1 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100 // 限制最大每页数量
	}

	// 调用 repository 方法查询商品列表
	spus, total, err := productSpuRepository.ListProducts(
		l.ctx,
		userInfo.UserCode,
		categoryCodes,
		req.ProductName,
		req.ProductCode,
		req.Status,
		req.ChainStatus,
		startTime,
		endTime,
		page,
		pageSize,
	)

	if err != nil {
		logx.Errorf("查询商品列表失败: %v", err)
		return &types.BaseResp{
			Code: 1,
			Msg:  "查询商品列表失败",
			Data: nil,
		}, nil
	}

	// 转换为响应格式
	list := make([]types.ProductSPUInfo, 0, len(spus))
	for _, spu := range spus {
		list = append(list, *l.convertToProductSPUInfo(spu))
	}

	return &types.BaseResp{
		Code: 0,
		Msg:  "查询成功",
		Data: &types.ListProductResp{
			List:  list,
			Total: total,
		},
	}, nil
}

// getTimeRange 根据时间范围字符串返回开始和结束时间
func (l *ListProductLogic) getTimeRange(timeRange string) (startTime *time.Time, endTime *time.Time) {
	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	switch timeRange {
	case "today":
		// 今天：从今天00:00:00到23:59:59
		start := today
		end := today.Add(24*time.Hour - time.Second)
		return &start, &end
	case "yesterday":
		// 昨天：从昨天00:00:00到昨天23:59:59
		yesterday := today.Add(-24 * time.Hour)
		start := yesterday
		end := yesterday.Add(24*time.Hour - time.Second)
		return &start, &end
	case "week":
		// 最近7天：从7天前的00:00:00到现在
		weekAgo := today.AddDate(0, 0, -7)
		return &weekAgo, nil
	case "month":
		// 最近30天：从30天前的00:00:00到现在
		monthAgo := today.AddDate(0, 0, -30)
		return &monthAgo, nil
	case "quarter":
		// 最近90天：从90天前的00:00:00到现在
		quarterAgo := today.AddDate(0, 0, -90)
		return &quarterAgo, nil
	default:
		return nil, nil
	}
}

// convertToProductSPUInfo 将 model.ProductSpu 转换为 types.ProductSPUInfo
func (l *ListProductLogic) convertToProductSPUInfo(spu *model.ProductSpu) *types.ProductSPUInfo {
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
