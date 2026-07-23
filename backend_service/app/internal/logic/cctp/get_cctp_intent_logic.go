package cctp

import (
	"context"
	"strings"

	"sapphire-mall/app/internal/customererrors"
	cctppkg "sapphire-mall/app/internal/cctp"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetCctpIntentLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetCctpIntentLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetCctpIntentLogic {
	return &GetCctpIntentLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetCctpIntentLogic) GetCctpIntent(req *types.GetCctpIntentReq) (*types.BaseResp, error) {
	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	intentID := strings.TrimSpace(req.IntentId)
	if intentID == "" {
		return customererrors.ParamErrorResp("intent_id 不能为空"), nil
	}

	repo := repository.NewCctpSwapIntentRepository(l.svcCtx.GormDB)
	intent, err := repo.GetByIntentID(l.ctx, intentID)
	if err != nil {
		return customererrors.FailMsg("意图不存在"), nil
	}
	if strings.ToLower(intent.UserAddress) != strings.ToLower(userInfo.UserCode) {
		return customererrors.FailMsg("无权查看该意图"), nil
	}

	tokenSymbol := intent.TokenSymbol
	if tokenSymbol == "" {
		tokenSymbol = cctppkg.USDCSymbol
	}
	tokenDecimals := intent.TokenDecimals
	if tokenDecimals <= 0 {
		tokenDecimals = cctppkg.USDCDecimals
	}

	resp := types.GetCctpIntentResp{
		IntentId:      intent.IntentID,
		UserAddress:   intent.UserAddress,
		SourceChainId: int64(intent.SourceChainID),
		DestChainId:   int64(intent.DestChainID),
		SourceDomain:  int64(intent.SourceDomain),
		DestDomain:    int64(intent.DestDomain),
		TokenSymbol:   tokenSymbol,
		TokenDecimals: int64(tokenDecimals),
		AmountIn:      intent.AmountIn,
		BurnTxHash:    intent.BurnTxHash,
		BurnGasFee:    intent.BurnGasFee,
		MessageHash:   intent.MessageHash,
		MintTxHash:    intent.MintTxHash,
		MintGasFee:    intent.MintGasFee,
		SwapTxHash:    intent.SwapTxHash,
		SwapGasFee:    intent.SwapGasFee,
		Status:        int64(intent.Status),
		StatusDesc:    cctppkg.StatusDesc(intent.Status),
		ErrorMsg:      intent.ErrorMsg,
		CreatedAt:     intent.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:     intent.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
	if intent.CompletedAt != nil {
		resp.CompletedAt = intent.CompletedAt.Format("2006-01-02 15:04:05")
	}

	return customererrors.SuccessData(resp), nil
}