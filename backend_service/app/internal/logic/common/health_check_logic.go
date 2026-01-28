package common

import (
	"context"
	"time"

	"sapphire-mall/app/internal/errors"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type HealthCheckLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewHealthCheckLogic(ctx context.Context, svcCtx *svc.ServiceContext) *HealthCheckLogic {
	return &HealthCheckLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *HealthCheckLogic) HealthCheck(req *types.HealthCheckReq) (resp *types.BaseResp, err error) {
	healthData := &types.HealthCheckResp{
		Status: "ok",
		Time:   time.Now().Unix(),
	}

	// 使用统一的成功返回函数，将 HealthCheckResp 放入 BaseResp 的 Data 字段
	return errors.SuccessResp(healthData), nil
}
