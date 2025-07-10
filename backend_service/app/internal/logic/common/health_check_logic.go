package common

import (
	"context"
	"time"

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

func (l *HealthCheckLogic) HealthCheck(req *types.HealthCheckReq) (resp *types.HealthCheckResp, err error) {
	// todo: add your logic here and delete this line
	resp = &types.HealthCheckResp{
		Code:    0,
		Msg:     "success",
		Service: req.Service,
		Status:  "ok",
		Time:    time.Now().Unix(),
	}
	return
}
