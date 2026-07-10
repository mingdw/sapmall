package swap

import (
	"context"
	"strings"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateSwapLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateSwapLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateSwapLogic {
	return &UpdateSwapLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// UpdateSwap 授权通过后更新状态为处理中（process_status=1）
func (l *UpdateSwapLogic) UpdateSwap(req *types.UpdateSwapReq) (resp *types.BaseResp, err error) {
	// 1. 校验用户身份
	_, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		l.Errorf("获取用户信息失败: %v", authErr)
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	if req.SwapId == 0 {
		return customererrors.ParamErrorResp("swapId 不能为空"), nil
	}

	swapRepo := repository.NewChainEventSwapRepository(l.svcCtx.GormDB)
	event, getErr := swapRepo.GetByID(l.ctx, req.SwapId)
	if getErr != nil {
		l.Errorf("查询兑换记录失败: swapId=%d, err=%v", req.SwapId, getErr)
		return customererrors.NotFoundResp("兑换记录不存在"), nil
	}

	// 2. 状态校验：仅待处理(0)的记录可以更新为处理中(1)
	if event.ProcessStatus != 0 {
		return customererrors.FailMsg("当前状态不允许更新"), nil
	}

	// 3. 更新为处理中
	updates := map[string]interface{}{
		"process_status": 1,
	}
	if txHash := strings.TrimSpace(req.TxHash); txHash != "" {
		updates["tx_hash"] = txHash
	}

	if updateErr := swapRepo.UpdateColumns(l.ctx, req.SwapId, updates); updateErr != nil {
		l.Errorf("更新兑换状态失败: swapId=%d, err=%v", req.SwapId, updateErr)
		return customererrors.DatabaseErrorResp("更新兑换状态失败"), nil
	}

	return customererrors.SuccessData(types.UpdateSwapResp{
		SwapId:        req.SwapId,
		ProcessStatus: 1,
	}), nil
}
