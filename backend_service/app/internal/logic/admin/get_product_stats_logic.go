// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetProductStatsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取商品统计信息
func NewGetProductStatsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetProductStatsLogic {
	return &GetProductStatsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetProductStatsLogic) GetProductStats(req *types.GetProductStatsReq) (resp *types.BaseResp, err error) {
	// 根据周期参数返回不同的统计数据
	// 目前返回固定数据，后续可以接入数据库查询
	var statsResp types.ProductStatsResp

	// 默认使用 day 周期
	period := req.Period
	if period == "" {
		period = "day"
	}

	switch period {
	case "day":
		statsResp = types.ProductStatsResp{
			TotalProducts:      8,
			TotalOrders:        156,
			TotalRevenue:       "125,680",
			NewUsers:           23,
			TotalProductsTrend: "+2",
			TotalOrdersTrend:   "+12.5%",
			TotalRevenueTrend:  "+8.3%",
			NewUsersTrend:      "+15.0%",
		}
	case "week":
		statsResp = types.ProductStatsResp{
			TotalProducts:      8,
			TotalOrders:        1024,
			TotalRevenue:       "856,320",
			NewUsers:           156,
			TotalProductsTrend: "+3",
			TotalOrdersTrend:   "+25.8%",
			TotalRevenueTrend:  "+18.6%",
			NewUsersTrend:      "+22.4%",
		}
	case "month":
		statsResp = types.ProductStatsResp{
			TotalProducts:      8,
			TotalOrders:        4567,
			TotalRevenue:       "3,856,900",
			NewUsers:           678,
			TotalProductsTrend: "+5",
			TotalOrdersTrend:   "+45.2%",
			TotalRevenueTrend:  "+32.1%",
			NewUsersTrend:      "+38.7%",
		}
	default:
		// 默认返回日统计数据
		statsResp = types.ProductStatsResp{
			TotalProducts:      8,
			TotalOrders:        156,
			TotalRevenue:       "125,680",
			NewUsers:           23,
			TotalProductsTrend: "+2",
			TotalOrdersTrend:   "+12.5%",
			TotalRevenueTrend:  "+8.3%",
			NewUsersTrend:      "+15.0%",
		}
	}

	logx.Infof("获取商品统计信息成功: period=%s", period)

	return &types.BaseResp{
		Code: 0,
		Msg:  "获取成功",
		Data: statsResp,
	}, nil
}
