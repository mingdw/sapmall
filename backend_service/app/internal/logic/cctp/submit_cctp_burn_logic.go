package cctp

import (
	"context"
	"strings"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type SubmitCctpBurnLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewSubmitCctpBurnLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SubmitCctpBurnLogic {
	return &SubmitCctpBurnLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SubmitCctpBurnLogic) SubmitCctpBurn(req *types.SubmitCctpBurnReq) (*types.BaseResp, error) {
	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	intentID := strings.TrimSpace(req.IntentId)
	burnTx := strings.TrimSpace(req.BurnTxHash)
	if intentID == "" || burnTx == "" {
		return customererrors.ParamErrorResp("参数不完整"), nil
	}
	if !strings.HasPrefix(strings.ToLower(burnTx), "0x") {
		return customererrors.ParamErrorResp("burnTxHash 格式无效"), nil
	}

	repo := repository.NewCctpSwapIntentRepository(l.svcCtx.GormDB)
	intent, err := repo.GetByIntentID(l.ctx, intentID)
	if err != nil {
		return customererrors.FailMsg("意图不存在"), nil
	}
	if strings.ToLower(intent.UserAddress) != strings.ToLower(userInfo.UserCode) {
		return customererrors.FailMsg("无权操作该意图"), nil
	}
	if intent.Status != model.CctpStatusCreated && intent.Status != model.CctpStatusBurned {
		return customererrors.FailMsg("当前状态不可提交 burn"), nil
	}

	intent.BurnTxHash = burnTx
	if fee := strings.TrimSpace(req.BurnGasFee); fee != "" {
		intent.BurnGasFee = fee
	}
	intent.Status = model.CctpStatusBurned
	if err := repo.Update(l.ctx, intent); err != nil {
		l.Errorf("更新 burn 状态失败: %v", err)
		return customererrors.DatabaseErrorResp("更新 burn 状态失败"), nil
	}

	return customererrors.SuccessDefault(), nil
}