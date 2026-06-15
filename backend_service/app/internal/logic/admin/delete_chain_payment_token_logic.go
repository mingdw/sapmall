// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type DeleteChainPaymentTokenLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除链上支付代币（软删）。路径参数：id；响应 Data：null
func NewDeleteChainPaymentTokenLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteChainPaymentTokenLogic {
	return &DeleteChainPaymentTokenLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteChainPaymentTokenLogic) DeleteChainPaymentToken(req *types.DeleteChainPaymentTokenReq) (resp *types.BaseResp, err error) {
	tokenRepo := repository.NewChain_payment_tokenRepository(l.svcCtx.GormDB)
	_, getErr := tokenRepo.GetByID(l.ctx, req.ID)
	if getErr != nil {
		if errors.Is(getErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("链上支付代币不存在"), nil
		}
		l.Errorf("get chain payment token by id failed, id=%d, err=%v", req.ID, getErr)
		return customererrors.DatabaseErrorResp("查询链上支付代币失败"), nil
	}

	if deleteErr := tokenRepo.SoftDelete(l.ctx, req.ID, chainOperator); deleteErr != nil {
		l.Errorf("delete chain payment token failed, id=%d, err=%v", req.ID, deleteErr)
		return customererrors.DatabaseErrorResp("删除链上支付代币失败"), nil
	}

	return customererrors.SuccessMsg("删除链上支付代币成功"), nil
}
