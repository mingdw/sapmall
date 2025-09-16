package common

import (
	"context"

	"sapphire-mall/internal/svc"
	"sapphire-mall/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetNonceByAddressLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 获取随机数
func NewGetNonceByAddressLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetNonceByAddressLogic {
	return &GetNonceByAddressLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetNonceByAddressLogic) GetNonceByAddress(req *types.GetNonceByAddressReq) (resp *types.GetNonceByAddressResp, err error) {
	// todo: add your logic here and delete this line

	return
}
