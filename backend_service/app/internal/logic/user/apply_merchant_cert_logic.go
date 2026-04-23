// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package user

import (
	"context"

	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ApplyMerchantCertLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 申请商家认证
func NewApplyMerchantCertLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ApplyMerchantCertLogic {
	return &ApplyMerchantCertLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ApplyMerchantCertLogic) ApplyMerchantCert(req *types.ApplyMerchantCertReq) (resp *types.BaseResp, err error) {
	// todo: add your logic here and delete this line

	return
}
