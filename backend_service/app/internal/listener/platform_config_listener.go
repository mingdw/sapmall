package listener

import (
	"context"
	"errors"
	"fmt"
	"math/big"
	"sort"
	"strings"
	"sync"
	"time"

	platformconfig "sapphire-mall/app/internal/contract/abi/bin"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	gethtypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

const (
	syncChainStatusSynced  = 2
	configListenerActor    = "platform_config_listener"
)

// configListenerManager 管理所有链的 Config 监听器
type configListenerManager struct {
	svc     *svc.ServiceContext
	wg      sync.WaitGroup
	mu      sync.RWMutex
	running map[int64]context.CancelFunc // chainID -> cancel function
}

var configManager = &configListenerManager{
	running: make(map[int64]context.CancelFunc),
}

// RunPlatformConfigListener 启动 Config 监听器管理器
// 为每条启用的链启动独立的监听协程，使用各自的轮询间隔和游标
func RunPlatformConfigListener(ctx context.Context, svc *svc.ServiceContext) {
	logx.Infof("platform_config_listener manager started")
	configManager.svc = svc

	// 启动监听器管理协程
	go configManager.manage(ctx)
}

// manage 监听器管理协程
func (m *configListenerManager) manage(ctx context.Context) {
	// 初始扫描
	m.syncListeners(ctx)

	ticker := time.NewTicker(60 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			logx.Infof("platform_config_listener manager stopping")
			m.stopAll()
			return
		case <-ticker.C:
			m.syncListeners(ctx)
		}
	}
}

// syncListeners 同步监听器状态
func (m *configListenerManager) syncListeners(ctx context.Context) {
	networkRepo := repository.NewChain_networkRepository(m.svc.GormDB)
	networks, _, err := networkRepo.ListByCondition(ctx, "", "", nil, 0, 200)
	if err != nil {
		logx.Errorf("platform_config_listener sync: list networks error: %v", err)
		return
	}

	activeChains := make(map[int64]bool)

	for _, network := range networks {
		// 检查是否启用 Config 监听器
		if network.ConfigListenerEnabled != 0 {
			continue
		}
		// 检查链是否启用
		if network.Status != 0 {
			continue
		}
		// 检查合约地址
		contractAddr := strings.TrimSpace(network.PlatformConfigAddress)
		rpcURL := strings.TrimSpace(network.RpcUrl)
		if rpcURL == "" || contractAddr == "" || !common.IsHexAddress(contractAddr) {
			continue
		}

		activeChains[int64(network.ChainId)] = true

		// 检查是否已在运行
		m.mu.RLock()
		_, running := m.running[int64(network.ChainId)]
		m.mu.RUnlock()

		if !running {
			m.startChainListener(ctx, network)
		}
	}

	// 停止已禁用的链
	m.mu.Lock()
	for chainID, cancel := range m.running {
		if !activeChains[chainID] {
			logx.Infof("platform_config_listener stopping for chain=%d", chainID)
			cancel()
			delete(m.running, chainID)
		}
	}
	m.mu.Unlock()
}

// startChainListener 为单条链启动监听器
func (m *configListenerManager) startChainListener(ctx context.Context, network *model.Chain_network) {
	chainCtx, cancel := context.WithCancel(ctx)

	m.mu.Lock()
	m.running[int64(network.ChainId)] = cancel
	m.mu.Unlock()

	m.wg.Add(1)
	go func() {
		defer m.wg.Done()
		defer func() {
			m.mu.Lock()
			delete(m.running, int64(network.ChainId))
			m.mu.Unlock()
		}()

		// 获取轮询间隔
		pollInterval := network.GetConfigPollInterval()
		if pollInterval <= 0 {
			pollInterval = 12
		}
		interval := time.Duration(pollInterval) * time.Second

		logx.Infof("platform_config_listener started for chain=%d interval=%s", network.ChainId, interval)

		ticker := time.NewTicker(interval)
		defer ticker.Stop()

		for {
			select {
			case <-chainCtx.Done():
				logx.Infof("platform_config_listener stopped for chain=%d", network.ChainId)
				return
			case <-ticker.C:
				if err := scanPlatformConfigForChainOnce(chainCtx, m.svc, network); err != nil {
					logx.Errorf("platform_config_listener chain=%d error: %v", network.ChainId, err)
				}
			}
		}
	}()
}

// stopAll 停止所有监听器
func (m *configListenerManager) stopAll() {
	m.mu.Lock()
	for chainID, cancel := range m.running {
		cancel()
		delete(m.running, chainID)
	}
	m.mu.Unlock()
	m.wg.Wait()
}

// scanPlatformConfigForChainOnce 扫描单条链的 PlatformConfig 事件
func scanPlatformConfigForChainOnce(ctx context.Context, svc *svc.ServiceContext, network *model.Chain_network) error {
	chainID := network.ChainId
	rpcURL := strings.TrimSpace(network.RpcUrl)
	contractAddrHex := strings.TrimSpace(network.PlatformConfigAddress)

	if rpcURL == "" || contractAddrHex == "" || !common.IsHexAddress(contractAddrHex) {
		return nil
	}

	// 校验起始区块是否配置
	if err := ValidateStartBlock("config_listener", network.ConfigListenerStartBlock, contractAddrHex); err != nil {
		return err
	}

	scanCtx, cancel := context.WithTimeout(ctx, 120*time.Second)
	defer cancel()

	client, err := ethclient.DialContext(scanCtx, rpcURL)
	if err != nil {
		return fmt.Errorf("dial rpc chain=%d: %w", chainID, err)
	}
	defer client.Close()

	contractAddr := common.HexToAddress(contractAddrHex)

	// 使用独立的 config_listener 游标
	var lastProcessed int64
	if network.ConfigListenerLastBlock > 0 {
		lastProcessed = network.ConfigListenerLastBlock
	} else {
		lastProcessed = network.ConfigListenerStartBlock - 1
	}

	latest, err := client.BlockNumber(scanCtx)
	if err != nil {
		return fmt.Errorf("block number chain=%d: %w", chainID, err)
	}

	from := uint64(lastProcessed + 1)
	if from > latest {
		return nil
	}

	chunk := calculateChunkSize(network.BlockTime)
	to := from + uint64(chunk) - 1
	if to > latest {
		to = latest
	}

	logs, err := client.FilterLogs(scanCtx, ethereum.FilterQuery{
		FromBlock: new(big.Int).SetUint64(from),
		ToBlock:   new(big.Int).SetUint64(to),
		Addresses: []common.Address{contractAddr},
	})
	if err != nil {
		return fmt.Errorf("filter logs chain=%d %d-%d: %w", chainID, from, to, err)
	}

	logx.Infof("platform_config_listener chain=%d contract=%s from=%d to=%d latest=%d logs=%d",
		chainID, contractAddrHex, from, to, latest, len(logs))

	platformContract, err := platformconfig.NewPlatformConfig(contractAddr, client)
	if err != nil {
		return fmt.Errorf("bind platform config chain=%d: %w", chainID, err)
	}

	cfgRepo := repository.NewConfigRepository(svc.GormDB)
	keyHashToKey, err := buildIndexedKeyMap(scanCtx, cfgRepo)
	if err != nil {
		return err
	}

	sort.SliceStable(logs, func(i, j int) bool {
		if logs[i].BlockNumber != logs[j].BlockNumber {
			return logs[i].BlockNumber < logs[j].BlockNumber
		}
		if logs[i].TxIndex != logs[j].TxIndex {
			return logs[i].TxIndex < logs[j].TxIndex
		}
		return logs[i].Index < logs[j].Index
	})

	for _, lg := range logs {
		if err := dispatchPlatformConfigLog(scanCtx, cfgRepo, platformContract, keyHashToKey, lg); err != nil {
			logx.Errorf("platform_config_listener handle log chain=%d block=%d txIndex=%d index=%d: %v",
				chainID, lg.BlockNumber, lg.TxIndex, lg.Index, err)
		}
	}

	// 更新独立的 config_listener 游标
	networkRepo := repository.NewChain_networkRepository(svc.GormDB)
	if updateErr := networkRepo.UpdateColumnsByID(scanCtx, network.ID, map[string]interface{}{
		"config_listener_last_block": int64(to),
		"updator":                    configListenerActor,
	}); updateErr != nil {
		return fmt.Errorf("update config_listener_last_block chain=%d: %w", chainID, updateErr)
	}

	logx.Infof("platform_config_listener chain=%d advanced last_block=%d (scanned %d-%d, logs=%d)",
		chainID, to, from, to, len(logs))
	return nil
}

func buildIndexedKeyMap(ctx context.Context, cfgRepo repository.ConfigRepository) (map[common.Hash]string, error) {
	const maxKeys = 5000
	list, _, err := cfgRepo.List(ctx, 0, maxKeys)
	if err != nil {
		return nil, fmt.Errorf("list configs for key map: %w", err)
	}
	m := make(map[common.Hash]string, len(list))
	for _, c := range list {
		k := strings.TrimSpace(c.ConfigKey)
		if k == "" {
			continue
		}
		m[crypto.Keccak256Hash([]byte(k))] = k
	}
	return m, nil
}

func dispatchPlatformConfigLog(
	ctx context.Context,
	cfgRepo repository.ConfigRepository,
	pc *platformconfig.PlatformConfig,
	keyMap map[common.Hash]string,
	lg gethtypes.Log,
) error {
	if ev, err := pc.ParseConfigUpdated(lg); err == nil {
		return applyConfigUpdated(ctx, cfgRepo, keyMap, ev)
	}
	if ev, err := pc.ParseConfigCreated(lg); err == nil {
		return applyConfigCreated(ctx, cfgRepo, keyMap, ev)
	}
	if ev, err := pc.ParseConfigDeleted(lg); err == nil {
		return applyConfigDeleted(ctx, cfgRepo, keyMap, ev)
	}
	if ev, err := pc.ParseConfigStatusChanged(lg); err == nil {
		return applyConfigStatusChanged(ctx, cfgRepo, keyMap, ev)
	}
	if ev, err := pc.ParseConfigUintValueUpdated(lg); err == nil {
		return applyConfigUintValueUpdated(ctx, cfgRepo, keyMap, ev)
	}
	return nil
}

func resolveKey(h common.Hash, keyMap map[common.Hash]string) (string, bool) {
	k, ok := keyMap[h]
	return k, ok && k != ""
}

func applyConfigUpdated(ctx context.Context, cfgRepo repository.ConfigRepository, keyMap map[common.Hash]string, ev *platformconfig.PlatformConfigConfigUpdated) error {
	keyStr, ok := resolveKey(ev.Key, keyMap)
	if !ok {
		return nil
	}
	row, err := cfgRepo.GetByConfigKey(ctx, keyStr)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	return cfgRepo.UpdateColumnsByID(ctx, row.ID, map[string]interface{}{
		"config_value":      ev.NewValue,
		"status":            int(ev.Status),
		"sync_chain_status": syncChainStatusSynced,
		"updator":           configListenerActor,
	})
}

func applyConfigCreated(ctx context.Context, cfgRepo repository.ConfigRepository, keyMap map[common.Hash]string, ev *platformconfig.PlatformConfigConfigCreated) error {
	keyStr, ok := resolveKey(ev.Key, keyMap)
	if !ok {
		return nil
	}
	row, err := cfgRepo.GetByConfigKey(ctx, keyStr)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	return cfgRepo.UpdateColumnsByID(ctx, row.ID, map[string]interface{}{
		"config_value":      ev.Value,
		"config_type":       ev.ValueType,
		"status":            int(ev.Status),
		"sync_chain_status": syncChainStatusSynced,
		"updator":           configListenerActor,
	})
}

func applyConfigDeleted(ctx context.Context, cfgRepo repository.ConfigRepository, keyMap map[common.Hash]string, ev *platformconfig.PlatformConfigConfigDeleted) error {
	keyStr, ok := resolveKey(ev.Key, keyMap)
	if !ok {
		return nil
	}
	row, err := cfgRepo.GetByConfigKey(ctx, keyStr)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	return cfgRepo.SoftDelete(ctx, row.ID, configListenerActor)
}

func applyConfigStatusChanged(ctx context.Context, cfgRepo repository.ConfigRepository, keyMap map[common.Hash]string, ev *platformconfig.PlatformConfigConfigStatusChanged) error {
	keyStr, ok := resolveKey(ev.Key, keyMap)
	if !ok {
		return nil
	}
	row, err := cfgRepo.GetByConfigKey(ctx, keyStr)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	return cfgRepo.UpdateColumnsByID(ctx, row.ID, map[string]interface{}{
		"status":            int(ev.NewStatus),
		"sync_chain_status": syncChainStatusSynced,
		"updator":           configListenerActor,
	})
}

func applyConfigUintValueUpdated(ctx context.Context, cfgRepo repository.ConfigRepository, keyMap map[common.Hash]string, ev *platformconfig.PlatformConfigConfigUintValueUpdated) error {
	keyStr, ok := resolveKey(ev.Key, keyMap)
	if !ok {
		return nil
	}
	row, err := cfgRepo.GetByConfigKey(ctx, keyStr)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	val := ""
	if ev.NewValue != nil {
		val = ev.NewValue.String()
	}
	return cfgRepo.UpdateColumnsByID(ctx, row.ID, map[string]interface{}{
		"config_value":      val,
		"sync_chain_status": syncChainStatusSynced,
		"updator":           configListenerActor,
	})
}
