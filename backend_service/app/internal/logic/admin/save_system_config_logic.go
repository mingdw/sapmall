// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"errors"
	"fmt"
	"math/big"
	"strconv"
	"strings"
	"time"

	platformconfig "sapphire-mall/app/internal/contract/abi/bin"
	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/zeromicro/go-zero/core/logx"
)

type SaveSystemConfigLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 新增/修改系统参数
func NewSaveSystemConfigLogic(ctx context.Context, svcCtx *svc.ServiceContext) *SaveSystemConfigLogic {
	return &SaveSystemConfigLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *SaveSystemConfigLogic) SaveSystemConfig(req *types.SaveSystemConfigReq) (resp *types.BaseResp, err error) {
	const (
		syncStatusUnsynced = int64(0) // 未同步
		syncStatusSyncing  = int64(1) // 同步中
		syncStatusSynced   = int64(2) // 已同步
		syncStatusDeleted  = int64(3) // 已删除
	)

	// 从 context 获取用户信息
	userInfo, err := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if err != nil {
		return nil, errors.New("获取用户信息失败")
	}

	configKey := strings.TrimSpace(req.ConfigKey)
	configName := strings.TrimSpace(req.ConfigName)
	if configKey == "" || configName == "" {
		return customererrors.ParamErrorResp("配置键和配置名称不能为空"), nil
	}

	configRepo := repository.NewConfigRepository(l.svcCtx.GormDB)

	validateBinaryFlag := func(name string, value int64) error {
		if value != 0 && value != 1 {
			return fmt.Errorf("%s仅支持0或1", name)
		}
		return nil
	}
	validateSyncChainStatus := func(value int64) error {
		if value < syncStatusUnsynced || value > syncStatusDeleted {
			return fmt.Errorf("syncChainStatus仅支持0~3")
		}
		return nil
	}
	if err := validateBinaryFlag("isSystem", req.IsSystem); err != nil {
		return customererrors.ParamErrorResp(err.Error()), nil
	}
	if err := validateBinaryFlag("isEncrypted", req.IsEncrypted); err != nil {
		return customererrors.ParamErrorResp(err.Error()), nil
	}
	if err := validateBinaryFlag("isEditable", req.IsEditable); err != nil {
		return customererrors.ParamErrorResp(err.Error()), nil
	}
	if err := validateSyncChainStatus(req.SyncChainStatus); err != nil {
		return customererrors.ParamErrorResp(err.Error()), nil
	}
	if err := validateBinaryFlag("status", req.Status); err != nil {
		return customererrors.ParamErrorResp(err.Error()), nil
	}
	//系统参数更新和报错的逻辑如下:
	//先根据请求的key检查数据库中是否存在相同的key，如果存在则返回前端配置键已经存在
	//再根据请求的id是否为0判断新增还是保存
	if req.ID > 0 {
		//代表着更新，不需要校验上送的configkey是否存在，直接根据id更新最细的结果即可
		//根据请求参数构建	updates := map[string]interface{}，并且调用configRepo.UpdateColumnsByID(l.ctx, req.ID, updates)更新
		// 先查询旧数据：如果进入“同步中(1)”且旧状态不是同步中，则在更新后触发链上同步流程
		existingConfig, queryErr := configRepo.GetByID(l.ctx, req.ID)
		if queryErr != nil {
			l.Errorf("query config failed before update, id=%d, err=%v", req.ID, queryErr)
			return customererrors.DatabaseErrorResp("查询系统参数失败"), nil
		}
		shouldSyncToChain := int64(existingConfig.SyncChainStatus) == syncStatusUnsynced && req.SyncChainStatus == syncStatusSyncing

		updates := make(map[string]interface{})
		if req.ConfigKey != "" {
			updates["config_key"] = req.ConfigKey
		}
		if req.ConfigName != "" {
			updates["config_name"] = req.ConfigName
		}
		if req.ConfigValue != "" {
			updates["config_value"] = req.ConfigValue
		}
		if req.ConfigType != "" {
			updates["config_type"] = req.ConfigType
		}
		if req.ConfigGroup != "" {
			updates["config_group"] = req.ConfigGroup
		}
		if req.Description != "" {
			updates["description"] = req.Description
		}
		updates["is_system"] = req.IsSystem
		updates["is_encrypted"] = req.IsEncrypted
		updates["is_editable"] = req.IsEditable
		updates["sync_chain_status"] = req.SyncChainStatus
		updates["sort"] = req.Sort
		updates["status"] = req.Status
		if updateErr := configRepo.UpdateColumnsByID(l.ctx, req.ID, updates); updateErr != nil {
			l.Errorf("update config failed, id=%d, err=%v", req.ID, updateErr)
			return customererrors.DatabaseErrorResp("更新系统参数失败"), nil
		}

		if shouldSyncToChain {
			if syncErr := l.syncConfigToChain(req); syncErr != nil {
				// 同步失败回退为“未同步”
				_ = configRepo.UpdateColumnsByID(l.ctx, req.ID, map[string]interface{}{
					"sync_chain_status": syncStatusUnsynced,
				})
				l.Errorf("sync config to chain failed, id=%d, key=%s, err=%v", req.ID, req.ConfigKey, syncErr)
			} else {
				// 同步成功回写“已同步”
				_ = configRepo.UpdateColumnsByID(l.ctx, req.ID, map[string]interface{}{
					"sync_chain_status": syncStatusSynced,
				})
			}
		}
		return customererrors.SuccessMsg("更新系统参数成功"), nil
	} else {
		//新增，需要校验上送的configkey是否存在
		exists, existsErr := configRepo.ExistsByConfigKey(l.ctx, configKey)
		if existsErr != nil {
			l.Errorf("check config key exists failed, key=%s, err=%v", configKey, existsErr)
			return customererrors.DatabaseErrorResp("校验配置键失败"), nil
		}
		if exists {
			return customererrors.ParamErrorResp("配置键已存在"), nil
		}
		//创建model.Config
		createModel := &model.Config{
			ConfigKey:       configKey,
			ConfigName:      configName,
			ConfigValue:     req.ConfigValue,
			ConfigType:      req.ConfigType,
			ConfigGroup:     req.ConfigGroup,
			Description:     req.Description,
			IsSystem:        int(req.IsSystem),
			IsEncrypted:     int(req.IsEncrypted),
			IsEditable:      int(req.IsEditable),
			SyncChainStatus: int(req.SyncChainStatus),
			Sort:            int(req.Sort),
			Status:          int(req.Status),
			Creator:         userInfo.UserCode,
			Updator:         userInfo.UserCode,
		}
		if createErr := configRepo.Create(l.ctx, createModel); createErr != nil {
			l.Errorf("create config failed, key=%s, err=%v", configKey, createErr)
			return customererrors.DatabaseErrorResp("新增系统参数失败"), nil
		}
		return customererrors.SuccessMsg("新增系统参数成功"), nil
	}

}

func (l *SaveSystemConfigLogic) syncConfigToChain(req *types.SaveSystemConfigReq) error {
	chainCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	rpcURL := strings.TrimSpace(l.svcCtx.Config.ChainMonitor.RPCURL)
	contractAddress := strings.TrimSpace(l.svcCtx.Config.PlatformConfig.ContractAddress)
	privateKeyHex := strings.TrimPrefix(strings.TrimSpace(l.svcCtx.Config.PlatformConfig.SignerPrivateKey), "0x")
	if rpcURL == "" || contractAddress == "" || privateKeyHex == "" {
		return fmt.Errorf("platform config chain settings are incomplete")
	}
	if !common.IsHexAddress(contractAddress) {
		return fmt.Errorf("invalid platform config contract address")
	}

	client, err := ethclient.DialContext(chainCtx, rpcURL)
	if err != nil {
		return fmt.Errorf("dial rpc failed: %w", err)
	}
	defer client.Close()

	chainID, err := client.ChainID(chainCtx)
	logx.Infof("chainID: %s", chainID)
	if err != nil {
		return fmt.Errorf("get chain id failed: %w", err)
	}
	privateKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		return fmt.Errorf("parse private key failed: %w", err)
	}
	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		return fmt.Errorf("build transactor failed: %w", err)
	}
	auth.Context = chainCtx

	contract, err := platformconfig.NewPlatformConfig(common.HexToAddress(contractAddress), client)
	if err != nil {
		return fmt.Errorf("init platform config contract failed: %w", err)
	}

	key := strings.TrimSpace(req.ConfigKey)
	valueType := strings.TrimSpace(req.ConfigType)
	group := strings.TrimSpace(req.ConfigGroup)
	desc := strings.TrimSpace(req.Description)
	status := uint8(req.Status)

	existsOnChain, err := contract.Exists(&bind.CallOpts{Context: chainCtx}, key)
	if err != nil {
		return fmt.Errorf("check config exists on chain failed: %w", err)
	}
	if existsOnChain {
		_, err = contract.UpdateConfig(auth, key, req.ConfigValue, valueType, group, desc, status)
	} else {
		_, err = contract.CreateConfig(auth, key, req.ConfigValue, valueType, group, desc, status)
	}
	if err != nil {
		return fmt.Errorf("upsert config on chain failed: %w", err)
	}

	if strings.EqualFold(valueType, "number") {
		uintValue, parseErr := parseConfigUintValue(req.ConfigValue)
		if parseErr != nil {
			return parseErr
		}
		if _, err = contract.SetConfigUintValue(auth, key, uintValue); err != nil {
			return fmt.Errorf("set config uint value failed: %w", err)
		}
	}
	return nil
}

func parseConfigUintValue(raw string) (*big.Int, error) {
	value := strings.TrimSpace(raw)
	if value == "" {
		return nil, fmt.Errorf("number config value is empty")
	}
	if strings.Contains(value, ".") {
		return nil, fmt.Errorf("number config value must be integer")
	}
	if strings.HasPrefix(value, "-") {
		return nil, fmt.Errorf("number config value must be unsigned")
	}
	if _, err := strconv.ParseUint(value, 10, 64); err == nil {
		parsed := new(big.Int)
		parsed.SetString(value, 10)
		return parsed, nil
	}
	parsed, ok := new(big.Int).SetString(value, 10)
	if !ok || parsed.Sign() < 0 {
		return nil, fmt.Errorf("invalid number config value: %s", raw)
	}
	return parsed, nil
}
