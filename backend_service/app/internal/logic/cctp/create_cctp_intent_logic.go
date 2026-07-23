package cctp

import (
	"context"
	"fmt"
	"strings"
	"time"

	"sapphire-mall/app/internal/customererrors"
	cctppkg "sapphire-mall/app/internal/cctp"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type CreateCctpIntentLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewCreateCctpIntentLogic(ctx context.Context, svcCtx *svc.ServiceContext) *CreateCctpIntentLogic {
	return &CreateCctpIntentLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *CreateCctpIntentLogic) CreateCctpIntent(req *types.CreateCctpIntentReq) (*types.BaseResp, error) {
	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		l.Errorf("获取用户信息失败: %v", authErr)
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	amountIn := strings.TrimSpace(req.AmountIn)
	if amountIn == "" || amountIn == "0" {
		return customererrors.ParamErrorResp("amountIn 无效"), nil
	}

	sourceChainID := int(req.SourceChainId)
	destChainID := int(req.DestChainId)
	if sourceChainID == 0 {
		sourceChainID = cctppkg.BaseSepoliaChainID
	}
	if destChainID == 0 {
		destChainID = cctppkg.ArcTestnetChainID
	}
	l.Infof("[CCTP] create intent sourceChainId=%d destChainId=%d amountIn=%s", sourceChainID, destChainID, amountIn)

	if destChainID != cctppkg.ArcTestnetChainID {
		return customererrors.ParamErrorResp("当前仅支持跨入 Arc Testnet"), nil
	}

	sourceMeta, ok := cctppkg.ResolveArcSource(sourceChainID)
	if !ok {
		return customererrors.ParamErrorResp(
			fmt.Sprintf("源链 %d 不支持跨入 Arc，请选择 Circle CCTP 支持的测试网", sourceChainID),
		), nil
	}

	tokenSymbol := strings.TrimSpace(req.TokenSymbol)
	if tokenSymbol == "" {
		tokenSymbol = cctppkg.USDCSymbol
	}
	tokenDecimals := int(req.TokenDecimals)
	if tokenDecimals <= 0 {
		tokenDecimals = cctppkg.USDCDecimals
	}

	intentID := fmt.Sprintf("cctp_%d", time.Now().UnixNano())
	userAddr := strings.ToLower(strings.TrimSpace(userInfo.UserCode))
	mintRecipient := cctppkg.PadAddressToBytes32(userAddr)

	// Fast Transfer 必须带合理 maxFee，否则 Iris 会 pending + insufficient_fee
	irisBase := strings.TrimSpace(l.svcCtx.Config.Cctp.IrisBaseURL)
	feeBps, feeErr := cctppkg.FetchFastTransferFeeBps(l.ctx, irisBase, sourceMeta.Domain, cctppkg.ArcTestnetDomain)
	if feeErr != nil {
		l.Errorf("[CCTP] 查询 Iris fee 失败，使用兜底 15bps: %v", feeErr)
		feeBps = 15
	}
	maxFee := cctppkg.ComputeMaxFeeUSDC(amountIn, feeBps)
	l.Infof("[CCTP] feeBps=%d maxFee=%s amountIn=%s", feeBps, maxFee, amountIn)

	intent := &model.CctpSwapIntent{
		IntentID:      intentID,
		UserAddress:   userAddr,
		SourceChainID: sourceChainID,
		DestChainID:   destChainID,
		SourceDomain:  sourceMeta.Domain,
		DestDomain:    cctppkg.ArcTestnetDomain,
		TokenSymbol:   tokenSymbol,
		TokenDecimals: tokenDecimals,
		AmountIn:      amountIn,
		Status:        model.CctpStatusCreated,
	}

	repo := repository.NewCctpSwapIntentRepository(l.svcCtx.GormDB)
	if err := repo.Create(l.ctx, intent); err != nil {
		l.Errorf("创建 CCTP 意图失败: %v", err)
		return customererrors.DatabaseErrorResp("创建 CCTP 意图失败"), nil
	}

	return customererrors.SuccessData(types.CreateCctpIntentResp{
		IntentId:      intentID,
		Status:        int64(model.CctpStatusCreated),
		TokenSymbol:   tokenSymbol,
		TokenDecimals: int64(tokenDecimals),
		BurnParams: types.CctpBurnParams{
			SourceChainId:        int64(sourceChainID),
			DestinationDomain:    cctppkg.ArcTestnetDomain,
			TokenMessenger:       cctppkg.TokenMessengerV2,
			Usdc:                 sourceMeta.USDC,
			Amount:               amountIn,
			MintRecipient:        mintRecipient,
			MinFinalityThreshold: cctppkg.MinFinalityThreshold,
			DestinationCaller:    cctppkg.ZeroBytes32,
			MaxFee:               maxFee,
		},
	}), nil
}