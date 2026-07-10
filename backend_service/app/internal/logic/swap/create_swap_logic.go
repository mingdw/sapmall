package swap

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type CreateSwapLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewCreateSwapLogic(ctx context.Context, svcCtx *svc.ServiceContext) *CreateSwapLogic {
	return &CreateSwapLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// CreateSwap 用户点击兑换时创建一条待处理记录
func (l *CreateSwapLogic) CreateSwap(req *types.CreateSwapReq) (resp *types.BaseResp, err error) {
	// 1. 获取当前登录用户（creator = 用户钱包地址 = user_code）
	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		l.Errorf("获取用户信息失败: %v", authErr)
		return customererrors.FailMsg("获取用户信息失败"), nil
	}

	if req.ChainId == 0 || req.RouterAddress == "" || req.TokenInAddress == "" || req.AmountInRaw == "" {
		return customererrors.ParamErrorResp("参数不完整"), nil
	}

	// 2. 构建兑换详情 JSON（存入 event_payload）
	swapDetail := map[string]interface{}{
		"direction":       req.Direction,
		"tokenInSymbol":   req.TokenInSymbol,
		"tokenInAddress":  req.TokenInAddress,
		"tokenInDecimals": req.TokenInDecimals,
		"amountIn":        req.AmountIn,
		"amountInRaw":     req.AmountInRaw,
		"amountOut":       req.AmountOut,
		"amountOutRaw":    req.AmountOutRaw,
		"feeRaw":          req.FeeRaw,
		"minAmountOutRaw": req.MinAmountOutRaw,
		"routerAddress":   req.RouterAddress,
	}
	payloadBytes, _ := json.Marshal(swapDetail)

	// 3. 生成业务编码
	businessCode := fmt.Sprintf("swp_%d", time.Now().UnixNano())

	// 4. 创建 sys_chain_event 记录
	chainEvent := &model.ChainEvent{
		BusinessType:    "swap",
		BusinessCode:    businessCode,
		ChainID:         int(req.ChainId),
		ContractAddress: req.RouterAddress,
		EventPayload:    string(payloadBytes),
		ProcessStatus:   0, // 0=待处理
		Creator:         userInfo.UserCode, // 用户钱包地址
	}

	swapRepo := repository.NewChainEventSwapRepository(l.svcCtx.GormDB)
	if createErr := swapRepo.Create(l.ctx, chainEvent); createErr != nil {
		l.Errorf("创建兑换记录失败: %v", createErr)
		return customererrors.DatabaseErrorResp("创建兑换记录失败"), nil
	}

	return customererrors.SuccessData(types.CreateSwapResp{
		SwapId:        chainEvent.ID,
		BusinessCode:  businessCode,
		ProcessStatus: 0,
	}), nil
}
