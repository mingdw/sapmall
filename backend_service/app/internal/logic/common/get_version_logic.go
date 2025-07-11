package common

import (
	"context"
	"runtime"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetVersionLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetVersionLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetVersionLogic {
	return &GetVersionLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetVersionLogic) GetVersion(req *types.VersionReq) (resp *types.VersionResp, err error) {
	// 返回版本信息
	resp = &types.VersionResp{
		Version:   "1.0.0",
		BuildTime: "2024-01-01T00:00:00Z",
		GitCommit: "abc123def456",
		GoVersion: runtime.Version(),
	}
	return
}
