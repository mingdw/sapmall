package listener

import (
	"context"
	"errors"
	"fmt"
	"math/big"
	"sort"
	"strconv"
	"strings"
	"time"

	consts "sapphire-mall/app/internal/const"
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
	syncChainStatusSynced = 2
	listenerActor         = "platform_config_listener"
)

// RunPlatformConfigListener 在独立 goroutine 中轮询 PlatformConfig 合约日志并回写 sys_config。
// 游标存 sys_config.chain.listener.last_processed_block（无/空/无效时首次按 BootstrapLookbackBlocks 回溯扫描，见 scanPlatformConfigOnce）；起始块见 chain.listener.start_block。
// ctx 取消时退出（与 HTTP 服务同生命周期）。
func RunPlatformConfigListener(ctx context.Context, svc *svc.ServiceContext) {
	interval := time.Duration(svc.Config.ChainListener.PollIntervalSec) * time.Second
	if interval <= 0 {
		interval = 12 * time.Second
	}
	chunk := svc.Config.ChainListener.MaxBlocksChunk
	if chunk <= 0 {
		chunk = 3000
	}

	logx.Infof("platform_config_listener started poll=%s chunk=%d", interval, chunk)
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			logx.Infof("platform_config_listener stopped")
			return
		case <-ticker.C:
			if err := scanPlatformConfigOnce(ctx, svc, chunk); err != nil {
				logx.Errorf("platform_config_listener scan: %v", err)
			}
		}
	}
}

func scanPlatformConfigOnce(ctx context.Context, svc *svc.ServiceContext, maxChunk int) error {
	scanCtx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()

	rpcURL := strings.TrimSpace(svc.Config.ChainMonitor.RPCURL)
	addrHex := strings.TrimSpace(svc.Config.PlatformConfig.ContractAddress)
	if rpcURL == "" || addrHex == "" || !common.IsHexAddress(addrHex) {
		return fmt.Errorf("chain listener: rpc or contract address not configured")
	}

	client, err := ethclient.DialContext(scanCtx, rpcURL)
	if err != nil {
		return fmt.Errorf("dial rpc: %w", err)
	}
	defer client.Close()

	cfgRepo := repository.NewConfigRepository(svc.GormDB)
	startBlock, err := loadStartBlockFromDB(scanCtx, cfgRepo)
	if err != nil {
		return err
	}
	if startBlock == 0 {
		return nil
	}

	latest, err := client.BlockNumber(scanCtx)
	if err != nil {
		return fmt.Errorf("block number: %w", err)
	}

	lastProcessed, fromDB, err := loadLastProcessedBlock(scanCtx, cfgRepo, startBlock)
	if err != nil {
		return err
	}

	bootstrapLookback := svc.Config.ChainListener.BootstrapLookbackBlocks
	if bootstrapLookback <= 0 {
		bootstrapLookback = 128
	}
	lb := uint64(bootstrapLookback)

	if !fromDB {
		// 首次：从 max(startBlock, latest-lookback+1) 起扫，避免「只扫 latest」在链头前进后漏掉上一块内的日志
		if latest > 0 {
			var minFrom uint64
			if latest >= lb {
				minFrom = latest - lb + 1
			} else {
				minFrom = 1
			}
			if minFrom < startBlock {
				minFrom = startBlock
			}
			if minFrom > latest {
				lastProcessed = startBlock - 1
			} else {
				lastProcessed = minFrom - 1
			}
			logx.Infof("platform_config_listener last_processed unset/invalid, bootstrap first_scan_from=%d last_processed=%d (latest=%d start_block=%d lookback_blocks=%d)",
				lastProcessed+1, lastProcessed, latest, startBlock, bootstrapLookback)
		}
	} else if lastProcessed < startBlock-1 {
		lastProcessed = startBlock - 1
	}

	contractAddr := common.HexToAddress(addrHex)

	from := lastProcessed + 1
	if from > latest {
		return nil
	}
	to := from + uint64(maxChunk) - 1
	if to > latest {
		to = latest
	}

	logs, err := client.FilterLogs(scanCtx, ethereum.FilterQuery{
		FromBlock: new(big.Int).SetUint64(from),
		ToBlock:   new(big.Int).SetUint64(to),
		Addresses: []common.Address{contractAddr},
	})
	if err != nil {
		return fmt.Errorf("filter logs %d-%d: %w", from, to, err)
	}

	logx.Infof("platform_config_listener filter contract=%s from=%d to=%d latest=%d logs=%d",
		contractAddr.Hex(), from, to, latest, len(logs))

	platformContract, err := platformconfig.NewPlatformConfig(contractAddr, client)
	if err != nil {
		return fmt.Errorf("bind platform config: %w", err)
	}

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
			logx.Errorf("platform_config_listener handle log block=%d txIndex=%d index=%d: %v", lg.BlockNumber, lg.TxIndex, lg.Index, err)
		}
	}

	if err := saveLastProcessedBlock(scanCtx, cfgRepo, to); err != nil {
		return fmt.Errorf("save last block: %w", err)
	}
	logx.Infof("platform_config_listener advanced last_block=%d (scanned %d-%d, logs=%d)", to, from, to, len(logs))
	return nil
}

func loadStartBlockFromDB(ctx context.Context, cfgRepo repository.ConfigRepository) (uint64, error) {
	row, err := cfgRepo.GetByConfigKey(ctx, consts.SYS_CONFIG_KEY_CHAIN_LISTENER_START_BLOCK)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			logx.Infof("platform_config_listener skip: sys_config %q not found", consts.SYS_CONFIG_KEY_CHAIN_LISTENER_START_BLOCK)
			return 0, nil
		}
		return 0, fmt.Errorf("get start block config: %w", err)
	}
	v := strings.TrimSpace(row.ConfigValue)
	if v == "" {
		logx.Infof("platform_config_listener skip: %q empty", consts.SYS_CONFIG_KEY_CHAIN_LISTENER_START_BLOCK)
		return 0, nil
	}
	n, err := strconv.ParseUint(v, 10, 64)
	if err != nil || n == 0 {
		return 0, fmt.Errorf("invalid start block %q: %w", v, err)
	}
	return n, nil
}

// loadLastProcessedBlock 读取链监听游标。第二个返回值表示是否从 DB 读到了合法非空数字；
// 若为 false，调用方应使用链上最新高度做兜底（见 scanPlatformConfigOnce）。
func loadLastProcessedBlock(ctx context.Context, cfgRepo repository.ConfigRepository, startBlock uint64) (uint64, bool, error) {
	row, err := cfgRepo.GetByConfigKey(ctx, consts.SYS_CONFIG_KEY_CHAIN_LISTENER_LAST_PROCESSED_BLOCK)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, false, nil
		}
		return 0, false, fmt.Errorf("get last processed block: %w", err)
	}
	v := strings.TrimSpace(row.ConfigValue)
	if v == "" {
		return 0, false, nil
	}
	n, perr := strconv.ParseUint(v, 10, 64)
	if perr != nil {
		logx.Infof("platform_config_listener invalid last_processed %q, will bootstrap from tip: %v", v, perr)
		return 0, false, nil
	}
	if n < startBlock-1 {
		n = startBlock - 1
	}
	return n, true, nil
}

func saveLastProcessedBlock(ctx context.Context, cfgRepo repository.ConfigRepository, last uint64) error {
	val := strconv.FormatUint(last, 10)
	row, err := cfgRepo.GetByConfigKey(ctx, consts.SYS_CONFIG_KEY_CHAIN_LISTENER_LAST_PROCESSED_BLOCK)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return cfgRepo.Create(ctx, &model.Config{
				ConfigKey:       consts.SYS_CONFIG_KEY_CHAIN_LISTENER_LAST_PROCESSED_BLOCK,
				ConfigName:      "链监听已处理区块(系统)",
				ConfigValue:     val,
				ConfigType:      "number",
				ConfigGroup:     "chain",
				Description:     "PlatformConfig 日志扫描游标，由 listener 自动维护",
				IsSystem:        1,
				IsEncrypted:     0,
				IsEditable:      0,
				SyncChainStatus: 0,
				Sort:            999999,
				Status:          1,
				Creator:         listenerActor,
				Updator:         listenerActor,
			})
		}
		return err
	}
	return cfgRepo.UpdateColumnsByID(ctx, row.ID, map[string]interface{}{
		"config_value": val,
		"updator":      listenerActor,
	})
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
		"updator":           listenerActor,
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
		"updator":           listenerActor,
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
	return cfgRepo.SoftDelete(ctx, row.ID, listenerActor)
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
		"updator":           listenerActor,
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
		"updator":           listenerActor,
	})
}
