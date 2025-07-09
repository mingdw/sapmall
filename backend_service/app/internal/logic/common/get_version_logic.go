package common

import (
	"context"

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
	// todo: add your logic here and delete this line

	return
}
