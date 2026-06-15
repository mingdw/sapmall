// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"
	"strings"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

const chainOperator = "system"

type SaveChainNetworkLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 新增/修改区块链网络配置。请求：SaveChainNetworkReq（id 为空或 0 为新增）；响应 Data：null
func NewSaveChainNetworkLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveChainNetworkLogic {
	return &SaveChainNetworkLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveChainNetworkLogic) SaveChainNetwork(req *types.SaveChainNetworkReq) (resp *types.BaseResp, err error) {
	code := strings.TrimSpace(req.Code)
	name := strings.TrimSpace(req.Name)
	if code == "" || name == "" {
		return customererrors.ParamErrorResp("链编码和名称不能为空"), nil
	}
	if req.Status != 0 && req.Status != 1 {
		return customererrors.ParamErrorResp("状态仅支持0或1"), nil
	}
	if req.ListenerEnabled != 0 && req.ListenerEnabled != 1 {
		return customererrors.ParamErrorResp("listenerEnabled仅支持0或1"), nil
	}

	networkRepo := repository.NewChain_networkRepository(l.svcCtx.GormDB)

	codeExists, codeErr := networkRepo.ExistsByCode(l.ctx, code, req.ID)
	if codeErr != nil {
		l.Errorf("check chain network code exists failed, code=%s, err=%v", code, codeErr)
		return customererrors.DatabaseErrorResp("校验链编码失败"), nil
	}
	if codeExists {
		return customererrors.ParamErrorResp("链编码已存在"), nil
	}

	if req.ID > 0 {
		existing, getErr := networkRepo.GetByID(l.ctx, req.ID)
		if getErr != nil {
			if errors.Is(getErr, gorm.ErrRecordNotFound) {
				return customererrors.NotFoundResp("区块链网络配置不存在"), nil
			}
			l.Errorf("get chain network by id failed, id=%d, err=%v", req.ID, getErr)
			return customererrors.DatabaseErrorResp("查询区块链网络配置失败"), nil
		}
		if req.ChainID > 0 && int64(existing.ChainId) != req.ChainID {
			return customererrors.ParamErrorResp("链ID不可修改"), nil
		}

		nativeSymbol := strings.TrimSpace(req.NativeSymbol)
		if nativeSymbol == "" {
			nativeSymbol = "ETH"
		}

		updates := map[string]interface{}{
			"code":                     code,
			"name":                     name,
			"rpc_url":                  strings.TrimSpace(req.RpcURL),
			"ws_url":                   strings.TrimSpace(req.WsURL),
			"explorer_url":             strings.TrimSpace(req.ExplorerURL),
			"native_symbol":            nativeSymbol,
			"platform_config_address":  strings.TrimSpace(req.PlatformConfigAddress),
			"payment_router_address":   strings.TrimSpace(req.PaymentRouterAddress),
			"settlement_vault_address": strings.TrimSpace(req.SettlementVaultAddress),
			"signer_key_ref":           strings.TrimSpace(req.SignerKeyRef),
			"listener_enabled":         int(req.ListenerEnabled),
			"listener_start_block":     req.ListenerStartBlock,
			"listener_last_block":      req.ListenerLastBlock,
			"sort":                     int(req.Sort),
			"status":                   int(req.Status),
			"remark":                   req.Remark,
			"updator":                  chainOperator,
		}
		if updateErr := networkRepo.UpdateColumnsByID(l.ctx, req.ID, updates); updateErr != nil {
			l.Errorf("update chain network failed, id=%d, err=%v", req.ID, updateErr)
			return customererrors.DatabaseErrorResp("更新区块链网络配置失败"), nil
		}
		return customererrors.SuccessMsg("更新区块链网络配置成功"), nil
	}

	if req.ChainID <= 0 {
		return customererrors.ParamErrorResp("链ID不能为空"), nil
	}

	chainIdExists, chainIdErr := networkRepo.ExistsByChainId(l.ctx, int(req.ChainID), 0)
	if chainIdErr != nil {
		l.Errorf("check chain network chainId exists failed, chainId=%d, err=%v", req.ChainID, chainIdErr)
		return customererrors.DatabaseErrorResp("校验链ID失败"), nil
	}
	if chainIdExists {
		return customererrors.ParamErrorResp("链ID已存在"), nil
	}

	nativeSymbol := strings.TrimSpace(req.NativeSymbol)
	if nativeSymbol == "" {
		nativeSymbol = "ETH"
	}

	listenerEnabled := 1
	if req.ListenerEnabled == 0 || req.ListenerEnabled == 1 {
		listenerEnabled = int(req.ListenerEnabled)
	}

	createModel := &model.Chain_network{
		ChainId:                int(req.ChainID),
		Code:                   code,
		Name:                   name,
		RpcUrl:                 strings.TrimSpace(req.RpcURL),
		WsUrl:                  strings.TrimSpace(req.WsURL),
		ExplorerUrl:            strings.TrimSpace(req.ExplorerURL),
		NativeSymbol:           nativeSymbol,
		PlatformConfigAddress:  strings.TrimSpace(req.PlatformConfigAddress),
		PaymentRouterAddress:   strings.TrimSpace(req.PaymentRouterAddress),
		SettlementVaultAddress: strings.TrimSpace(req.SettlementVaultAddress),
		SignerKeyRef:           strings.TrimSpace(req.SignerKeyRef),
		ListenerEnabled:        listenerEnabled,
		ListenerStartBlock:     req.ListenerStartBlock,
		ListenerLastBlock:      req.ListenerLastBlock,
		Sort:                   int(req.Sort),
		Status:                 int(req.Status),
		Remark:                 req.Remark,
		Creator:                chainOperator,
		Updator:                chainOperator,
	}
	if createErr := networkRepo.Create(l.ctx, createModel); createErr != nil {
		l.Errorf("create chain network failed, code=%s, chainId=%d, err=%v", code, req.ChainID, createErr)
		return customererrors.DatabaseErrorResp("新增区块链网络配置失败"), nil
	}

	return customererrors.SuccessMsg("新增区块链网络配置成功"), nil
}
