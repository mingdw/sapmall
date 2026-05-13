// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package admin

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	platformconfig "sapphire-mall/app/internal/contract/abi/bin"
	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	gethTypes "github.com/ethereum/go-ethereum/core/types"
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
			chainRec, syncErr := l.syncConfigToChain(req)
			if syncErr != nil {
				// 同步失败回退为“未同步”
				_ = configRepo.UpdateColumnsByID(l.ctx, req.ID, map[string]interface{}{
					"sync_chain_status": syncStatusUnsynced,
				})
				l.Errorf("sync config to chain failed, id=%d, key=%s, err=%v", req.ID, req.ConfigKey, syncErr)
				l.writePlatformConfigChainSyncOperationLog(userInfo, req, chainRec, syncErr)
			} else {
				// 同步成功回写“已同步”
				_ = configRepo.UpdateColumnsByID(l.ctx, req.ID, map[string]interface{}{
					"sync_chain_status": syncStatusSynced,
				})
				l.writePlatformConfigChainSyncOperationLog(userInfo, req, chainRec, nil)
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

// platformConfigChainReceipt 交易已成功提交到 RPC 后的可审计信息（写入 sys_operation_log.detail_json）。
// 当前不等待回执：BlockNumber、GasUsed 为 0；链上确认结果由后续扫块/索引或人工在浏览器核对 txHash。
type platformConfigChainReceipt struct {
	TxHash       string `json:"txHash"`
	BlockNumber  uint64 `json:"blockNumber"` // 未等回执时为 0
	GasUsed      uint64 `json:"gasUsed"`     // 未等回执时为 0
	ChainID      string `json:"chainId"`
	ContractAddr string `json:"contractAddress"`
	Action       string `json:"action"` // createConfig | updateConfig
}

func (l *SaveSystemConfigLogic) writePlatformConfigChainSyncOperationLog(
	opUser *model.User,
	req *types.SaveSystemConfigReq,
	rec *platformConfigChainReceipt,
	syncErr error,
) {
	detail := map[string]interface{}{
		"configId":   req.ID,
		"configKey":  strings.TrimSpace(req.ConfigKey),
		"configType": strings.TrimSpace(req.ConfigType),
	}
	if rec != nil {
		detail["chain"] = rec
	}
	if syncErr != nil {
		detail["error"] = syncErr.Error()
	}
	detailJSON, _ := json.Marshal(detail)

	resultStatus := 1
	errMsg := ""
	if syncErr != nil {
		resultStatus = 2
		errMsg = syncErr.Error()
		if len(errMsg) > 500 {
			errMsg = errMsg[:500]
		}
	}

	summary := "系统参数同步至链上 PlatformConfig"
	if syncErr != nil {
		summary = "系统参数同步链上失败"
	}

	after := map[string]interface{}{
		"syncChainStatus": 2,
		"configKey":       strings.TrimSpace(req.ConfigKey),
	}
	if syncErr != nil {
		after["syncChainStatus"] = 0
		after["error"] = syncErr.Error()
	}
	afterJSON, _ := json.Marshal(after)

	repo := repository.NewRepository(l.svcCtx.GormDB)
	logRepo := repository.NewOperationLogRepository(repo)
	logCtx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	logErr := logRepo.CreateOperationLog(logCtx, &model.OperationLog{
		UserID:        opUser.ID,
		Username:      opUser.UserCode,
		BizModule:     "admin",
		ActionType:    "sync_sys_config_platform_config",
		ActionSummary: summary,
		Before:        "{}",
		After:         string(afterJSON),
		ObjectType:    "sys_config",
		ObjectID:      fmt.Sprintf("%d", req.ID),
		DetailJSON:    string(detailJSON),
		ResultStatus:  resultStatus,
		ErrorMessage:  errMsg,
		Item1:         rec.TxHash,
		Item2:         rec.ChainID,
		Item3:         rec.Action,
		Creator:       opUser.UserCode,
		Updator:       opUser.UserCode,
	})
	if logErr != nil {
		l.Errorf("create platform config chain sync operation log failed, userID=%d, configId=%d, err=%v", opUser.ID, req.ID, logErr)
	}
}

func (l *SaveSystemConfigLogic) syncConfigToChain(req *types.SaveSystemConfigReq) (*platformConfigChainReceipt, error) {
	// Dial、ChainID、Exists、发交易共用同一 deadline；公网 RPC 在拥堵或限流时单次 eth_call 也可能较慢。
	chainCtx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()

	rpcURL := strings.TrimSpace(l.svcCtx.Config.ChainMonitor.RPCURL)
	contractAddress := strings.TrimSpace(l.svcCtx.Config.PlatformConfig.ContractAddress)
	privateKeyHex := strings.TrimPrefix(strings.TrimSpace(l.svcCtx.Config.PlatformConfig.SignerPrivateKey), "0x")
	if rpcURL == "" || contractAddress == "" || privateKeyHex == "" {
		return nil, fmt.Errorf("platform config chain settings are incomplete")
	}
	if !common.IsHexAddress(contractAddress) {
		return nil, fmt.Errorf("invalid platform config contract address")
	}

	client, err := ethclient.DialContext(chainCtx, rpcURL)
	if err != nil {
		return nil, fmt.Errorf("dial rpc failed: %w", err)
	}
	defer client.Close()

	chainID, err := client.ChainID(chainCtx)
	if err != nil {
		return nil, fmt.Errorf("get chain id failed: %w", err)
	}
	l.Infof("syncConfigToChain chainID=%s", chainID.String())
	privateKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		return nil, fmt.Errorf("parse private key failed: %w", err)
	}
	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		return nil, fmt.Errorf("build transactor failed: %w", err)
	}
	auth.Context = chainCtx
	if err := fillPlatformConfigTransactGas(chainCtx, client, auth); err != nil {
		return nil, fmt.Errorf("suggest gas fees: %w", err)
	}
	l.Infof("syncConfigToChain gasPrice=%s gasTipCap=%s gasFeeCap=%s",
		stringOrNilBig(auth.GasPrice), stringOrNilBig(auth.GasTipCap), stringOrNilBig(auth.GasFeeCap))
	contract, err := platformconfig.NewPlatformConfig(common.HexToAddress(contractAddress), client)
	if err != nil {
		return nil, fmt.Errorf("init platform config contract failed: %w", err)
	}

	key := strings.TrimSpace(req.ConfigKey)
	valueType := strings.TrimSpace(req.ConfigType)
	desc := strings.TrimSpace(req.Description)
	status := uint8(req.Status)

	existsOnChain, err := contract.Exists(&bind.CallOpts{Context: chainCtx}, key)
	if err != nil {
		l.Errorf("syncConfigToChain Exists failed, contract=%s err=%v", contractAddress, err)
		return nil, fmt.Errorf("check config exists on chain failed: %w", err)
	}
	l.Infof("syncConfigToChain existsOnChain=%v reqKey=%q", existsOnChain, key)

	var tx *gethTypes.Transaction
	action := "createConfig"
	if existsOnChain {
		action = "updateConfig"
		tx, err = contract.UpdateConfig(auth, key, req.ConfigValue, valueType, desc, status)
	} else {
		tx, err = contract.CreateConfig(auth, key, req.ConfigValue, valueType, desc, status)
	}
	if err != nil {
		l.Errorf("upsert config on chain failed: %s, err=%v", contractAddress, err)
		return nil, fmt.Errorf("upsert config on chain failed: %s, err=%v", contractAddress, err)
	}
	// abigen Transact：RPC 接受交易后返回的 *Transaction 已含确定 tx.Hash()，无需等回执即可记录。
	return &platformConfigChainReceipt{
		TxHash:       tx.Hash().Hex(),
		BlockNumber:  0,
		GasUsed:      0,
		ChainID:      chainID.String(),
		ContractAddr: strings.ToLower(contractAddress),
		Action:       action,
	}, nil
}

// fillPlatformConfigTransactGas 为 TransactOpts 填入节点可接受的 gas 价格，避免 Infura 等报
// "Gas price below configured minimum gas price"（未设置时使用默认值易低于网络/节点下限）。
//
// Linea Sepolia 等 L2 上 BaseFee、SuggestGasTipCap 常接近 0，按公式算出的 maxFeePerGas 只有几十 wei，
// 仍低于 RPC 网关的最低费率，因此必须对 GasTipCap / GasFeeCap 做 wei 级下限并与 SuggestGasPrice 取大。
func fillPlatformConfigTransactGas(ctx context.Context, client *ethclient.Client, auth *bind.TransactOpts) error {
	const (
		minTipCapWei  = 1_000_000_000  // 1 gwei，建议 tip 为 0 时的下限
		minFeeCapWei  = 10_000_000_000 // 10 gwei，覆盖 Infura 等对 maxFeePerGas 的最低要求（测试网可接受）
		suggestGasMul = 130            // SuggestGasPrice 再上浮比例（%）
	)
	minTip := big.NewInt(minTipCapWei)
	minFeeFloor := big.NewInt(minFeeCapWei)

	header, err := client.HeaderByNumber(ctx, nil)
	if err != nil {
		return fmt.Errorf("header by number: %w", err)
	}
	if header.BaseFee == nil {
		gasPrice, err := client.SuggestGasPrice(ctx)
		if err != nil {
			return fmt.Errorf("suggest gas price: %w", err)
		}
		auth.GasPrice = maxBigInt(bumpBigIntPercent(gasPrice, 120), minFeeFloor)
		auth.GasTipCap = nil
		auth.GasFeeCap = nil
		return nil
	}
	tip, err := client.SuggestGasTipCap(ctx)
	if err != nil {
		return fmt.Errorf("suggest gas tip cap: %w", err)
	}
	tipCap := bumpBigIntPercent(tip, 110)
	if tipCap.Sign() == 0 || tipCap.Cmp(minTip) < 0 {
		tipCap = new(big.Int).Set(minTip)
	}
	// feeCap ≈ 2*baseFee + tip，再上浮；L2 上仍可能极小
	feeCap := new(big.Int).Mul(header.BaseFee, big.NewInt(2))
	feeCap.Add(feeCap, tip)
	feeCap = bumpBigIntPercent(feeCap, 115)
	minLondon := new(big.Int).Add(header.BaseFee, tipCap)
	if feeCap.Cmp(minLondon) < 0 {
		feeCap = new(big.Int).Set(minLondon)
	}
	if feeCap.Cmp(minFeeFloor) < 0 {
		feeCap = new(big.Int).Set(minFeeFloor)
	}
	if gp, err := client.SuggestGasPrice(ctx); err == nil && gp.Sign() > 0 {
		gpBumped := bumpBigIntPercent(gp, suggestGasMul)
		if feeCap.Cmp(gpBumped) < 0 {
			feeCap = new(big.Int).Set(gpBumped)
		}
	}
	// 再保证 EIP-1559 约束 feeCap >= baseFee + tipCap
	minLondon = new(big.Int).Add(header.BaseFee, tipCap)
	if feeCap.Cmp(minLondon) < 0 {
		feeCap = new(big.Int).Set(minLondon)
	}
	// SuggestGasPrice 在 L2 上也可能极小，最后再卡一次节点最低 maxFee
	if feeCap.Cmp(minFeeFloor) < 0 {
		feeCap = new(big.Int).Set(minFeeFloor)
	}
	auth.GasTipCap = tipCap
	auth.GasFeeCap = feeCap
	auth.GasPrice = nil
	return nil
}

func bumpBigIntPercent(x *big.Int, percent int64) *big.Int {
	if percent <= 100 {
		return new(big.Int).Set(x)
	}
	out := new(big.Int).Mul(x, big.NewInt(percent))
	out.Add(out, big.NewInt(99))
	out.Div(out, big.NewInt(100))
	return out
}

func maxBigInt(a, b *big.Int) *big.Int {
	if a.Cmp(b) >= 0 {
		return new(big.Int).Set(a)
	}
	return new(big.Int).Set(b)
}

func stringOrNilBig(x *big.Int) string {
	if x == nil {
		return "<nil>"
	}
	return x.String()
}
