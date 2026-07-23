package cctp

import (
	"context"
	"strings"
	"time"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type SubmitCctpSwapLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewSubmitCctpSwapLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SubmitCctpSwapLogic {
	return &SubmitCctpSwapLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SubmitCctpSwapLogic) SubmitCctpSwap(req *types.SubmitCctpSwapReq) (*types.BaseResp, error) {
	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	intentID := strings.TrimSpace(req.IntentId)
	swapTx := strings.TrimSpace(req.SwapTxHash)
	if intentID == "" || swapTx == "" {
		return customererrors.ParamErrorResp("参数不完整"), nil
	}

	repo := repository.NewCctpSwapIntentRepository(l.svcCtx.GormDB)
	intent, err := repo.GetByIntentID(l.ctx, intentID)
	if err != nil {
		return customererrors.FailMsg("意图不存在"), nil
	}
	if strings.ToLower(intent.UserAddress) != strings.ToLower(userInfo.UserCode) {
		return customererrors.FailMsg("无权操作该意图"), nil
	}

	now := time.Now()
	intent.SwapTxHash = swapTx
	if fee := strings.TrimSpace(req.SwapGasFee); fee != "" {
		intent.SwapGasFee = fee
	}
	intent.Status = model.CctpStatusSwapped
	intent.CompletedAt = &now
	if err := repo.Update(l.ctx, intent); err != nil {
		l.Errorf("更新 swap 状态失败: %v", err)
		return customererrors.DatabaseErrorResp("更新 swap 状态失败"), nil
	}

	return customererrors.SuccessDefault(), nil
}