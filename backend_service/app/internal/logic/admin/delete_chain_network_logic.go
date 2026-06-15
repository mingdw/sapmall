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

type DeleteChainNetworkLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 删除区块链网络配置（软删，并软删该链下全部支付代币）。路径参数：id；响应 Data：null
func NewDeleteChainNetworkLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteChainNetworkLogic {
	return &DeleteChainNetworkLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteChainNetworkLogic) DeleteChainNetwork(req *types.DeleteChainNetworkReq) (resp *types.BaseResp, err error) {
	networkRepo := repository.NewChain_networkRepository(l.svcCtx.GormDB)
	existing, getErr := networkRepo.GetByID(l.ctx, req.ID)
	if getErr != nil {
		if errors.Is(getErr, gorm.ErrRecordNotFound) {
			return customererrors.NotFoundResp("区块链网络配置不存在"), nil
		}
		l.Errorf("get chain network by id failed, id=%d, err=%v", req.ID, getErr)
		return customererrors.DatabaseErrorResp("查询区块链网络配置失败"), nil
	}

	tokenRepo := repository.NewChain_payment_tokenRepository(l.svcCtx.GormDB)
	if tokenDeleteErr := tokenRepo.SoftDeleteByChainId(l.ctx, existing.ChainId, chainOperator); tokenDeleteErr != nil {
		l.Errorf("soft delete chain payment tokens failed, chainId=%d, err=%v", existing.ChainId, tokenDeleteErr)
		return customererrors.DatabaseErrorResp("删除链上支付代币失败"), nil
	}

	if deleteErr := networkRepo.SoftDelete(l.ctx, req.ID, chainOperator); deleteErr != nil {
		l.Errorf("delete chain network failed, id=%d, err=%v", req.ID, deleteErr)
		return customererrors.DatabaseErrorResp("删除区块链网络配置失败"), nil
	}

	return customererrors.SuccessMsg("删除区块链网络配置成功"), nil
}
