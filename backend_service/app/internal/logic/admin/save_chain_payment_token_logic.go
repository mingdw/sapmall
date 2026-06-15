// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type SaveChainPaymentTokenLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 新增/修改链上支付代币。请求：SaveChainPaymentTokenReq（id 为空或 0 为新增）；响应 Data：null
func NewSaveChainPaymentTokenLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveChainPaymentTokenLogic {
	return &SaveChainPaymentTokenLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveChainPaymentTokenLogic) SaveChainPaymentToken(req *types.SaveChainPaymentTokenReq) (resp *types.BaseResp, err error) {
	symbol := strings.TrimSpace(req.Symbol)
	contractAddress := strings.TrimSpace(req.ContractAddress)
	if req.ChainID <= 0 {
		return customererrors.ParamErrorResp("链ID不能为空"), nil
	}
	if symbol == "" || contractAddress == "" {
		return customererrors.ParamErrorResp("代币符号和合约地址不能为空"), nil
	}
	if req.Status != 0 && req.Status != 1 {
		return customererrors.ParamErrorResp("状态仅支持0或1"), nil
	}

	networkRepo := repository.NewChain_networkRepository(l.svcCtx.GormDB)
	_, networkErr := networkRepo.GetByChainId(l.ctx, int(req.ChainID))
	if networkErr != nil {
		if errors.Is(networkErr, gorm.ErrRecordNotFound) {
			return customererrors.ParamErrorResp("区块链网络配置不存在，请先创建链网络"), nil
		}
		l.Errorf("get chain network by chainId failed, chainId=%d, err=%v", req.ChainID, networkErr)
		return customererrors.DatabaseErrorResp("校验链网络配置失败"), nil
	}

	tokenRepo := repository.NewChain_payment_tokenRepository(l.svcCtx.GormDB)
	symbolExists, symbolErr := tokenRepo.ExistsByChainIdAndSymbol(l.ctx, int(req.ChainID), symbol, req.ID)
	if symbolErr != nil {
		l.Errorf("check symbol exists failed, chainId=%d, symbol=%s, err=%v", req.ChainID, symbol, symbolErr)
		return customererrors.DatabaseErrorResp("校验代币符号失败"), nil
	}
	if symbolExists {
		return customererrors.ParamErrorResp("该链下代币符号已存在"), nil
	}

	decimals := int(req.Decimals)
	if decimals <= 0 {
		decimals = 6
	}

	configKey := strings.TrimSpace(req.ConfigKey)
	if configKey == "" {
		configKey = fmt.Sprintf("payment.token.%s", strings.ToLower(symbol))
	}

	displayName := strings.TrimSpace(req.DisplayName)
	if displayName == "" {
		displayName = symbol
	}

	if req.ID > 0 {
		_, getErr := tokenRepo.GetByID(l.ctx, req.ID)
		if getErr != nil {
			if errors.Is(getErr, gorm.ErrRecordNotFound) {
				return customererrors.NotFoundResp("链上支付代币不存在"), nil
			}
			l.Errorf("get chain payment token by id failed, id=%d, err=%v", req.ID, getErr)
			return customererrors.DatabaseErrorResp("查询链上支付代币失败"), nil
		}

		updates := map[string]interface{}{
			"chain_id":         int(req.ChainID),
			"symbol":           symbol,
			"display_name":     displayName,
			"contract_address": contractAddress,
			"decimals":         decimals,
			"config_key":       configKey,
			"sort":             int(req.Sort),
			"status":           int(req.Status),
			"remark":           req.Remark,
			"updator":          chainOperator,
		}
		if updateErr := tokenRepo.UpdateColumnsByID(l.ctx, req.ID, updates); updateErr != nil {
			l.Errorf("update chain payment token failed, id=%d, err=%v", req.ID, updateErr)
			return customererrors.DatabaseErrorResp("更新链上支付代币失败"), nil
		}
		return customererrors.SuccessMsg("更新链上支付代币成功"), nil
	}

	createModel := &model.Chain_payment_token{
		ChainId:         int(req.ChainID),
		Symbol:          symbol,
		DisplayName:     displayName,
		ContractAddress: contractAddress,
		Decimals:        decimals,
		ConfigKey:       configKey,
		SyncStatus:      0,
		Sort:            int(req.Sort),
		Status:          int(req.Status),
		Remark:          req.Remark,
		Creator:         chainOperator,
		Updator:         chainOperator,
	}
	if createErr := tokenRepo.Create(l.ctx, createModel); createErr != nil {
		l.Errorf("create chain payment token failed, chainId=%d, symbol=%s, err=%v", req.ChainID, symbol, createErr)
		return customererrors.DatabaseErrorResp("新增链上支付代币失败"), nil
	}

	return customererrors.SuccessMsg("新增链上支付代币成功"), nil
}
