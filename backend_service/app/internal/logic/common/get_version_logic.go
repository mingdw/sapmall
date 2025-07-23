package common

import (
	"context"
	"errors"
	"runtime"
	"time"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetVersionLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取版本信息
func NewGetVersionLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetVersionLogic {
	return &GetVersionLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetVersionLogic) GetVersion() (resp *types.VersionResp, err error) {
	// 返回版本信息
	resp = &types.VersionResp{
		Version:   l.svcCtx.Config.Version,
		BuildTime: time.Now().Format("2006-01-02 15:04:05"),
		GitCommit: "",
		GoVersion: runtime.Version(),
	}
	err = errors.New("test")
	return resp, err
}
