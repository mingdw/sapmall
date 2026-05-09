package listener

import (
	"context"
	"encoding/json"
	"fmt"
	"math/big"
	"strings"
	"time"

	platformconfig "sapphire-mall/app/internal/contract/abi/bin"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/zeromicro/go-zero/core/logx"
)

const platformConfigBusinessType = "platform_config"

// Infura 等对 eth_getLogs 有严格 QPS；单轮同步内限制批次数 + 批次间 sleep，避免 429。
const (
	platformLogBatchBlocks     uint64 = 1000
	platformMaxBatchesPerTick        = 25
	platformBetweenBatchSleep        = 200 * time.Millisecond
)

func isRateLimitRPCError(err error) bool {
	if err == nil {
		return false
	}
	s := strings.ToLower(err.Error())
	return strings.Contains(s, "429") ||
		strings.Contains(s, "too many requests") ||
		strings.Contains(s, "-32005")
}

// resolveListenerChainID 优先用 yaml ChainMonitor.ChainId，避免启动时 eth_chainId 被 Infura 限流；未配置时再带退重重试 RPC。
func resolveListenerChainID(ctx context.Context, client *ethclient.Client, configured int64) (*big.Int, error) {
	if configured > 0 {
		logx.Infof("[chain-listener] using ChainMonitor.ChainID=%d from config (skip eth_chainId)", configured)
		return big.NewInt(configured), nil
	}
	const maxAttempts = 10
	backoff := 3 * time.Second
	var lastErr error
	for attempt := 1; attempt <= maxAttempts; attempt++ {
		id, err := client.ChainID(ctx)
		if err == nil {
			if attempt > 1 {
				logx.Infof("[chain-listener] eth_chainId succeeded after %d attempts, chainId=%s", attempt, id.String())
			}
			return id, nil
		}
		lastErr = err
		if isRateLimitRPCError(err) {
			logx.Errorf("[chain-listener] eth_chainId rate limited (attempt %d/%d): %v", attempt, maxAttempts, err)
		} else {
			logx.Errorf("[chain-listener] eth_chainId failed (attempt %d/%d): %v", attempt, maxAttempts, err)
		}
		if attempt == maxAttempts {
			break
		}
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(backoff):
		}
		if backoff < 45*time.Second {
			backoff += 5 * time.Second
		}
	}
	return nil, lastErr
}

func StartPlatformConfigListener(ctx context.Context, svcCtx *svc.ServiceContext) {
	cfg := svcCtx.Config.ChainMonitor
	if !cfg.Enabled {
		logx.Infof("[chain-listener] platform config listener disabled")
		return
	}
	if strings.TrimSpace(cfg.RPCURL) == "" {
		logx.Errorf("[chain-listener] platform config listener RPCURL is empty")
		return
	}

	contractAddress := strings.TrimSpace(svcCtx.Config.PlatformConfig.ContractAddress)
	if contractAddress == "" || !common.IsHexAddress(contractAddress) {
		logx.Errorf("[chain-listener] invalid platform config contract address: %s", contractAddress)
		return
	}

	client, err := ethclient.DialContext(ctx, cfg.RPCURL)
	if err != nil {
		logx.Errorf("[chain-listener] connect rpc failed: %v", err)
		return
	}
	defer client.Close()

	filterer, err := platformconfig.NewPlatformConfigFilterer(common.HexToAddress(contractAddress), client)
	if err != nil {
		logx.Errorf("[chain-listener] bind platform config filterer failed: %v", err)
		return
	}

	chainID, err := resolveListenerChainID(ctx, client, cfg.ChainID)
	if err != nil {
		logx.Errorf("[chain-listener] platform config listener resolve chain id failed: %v", err)
		return
	}

	startBlock := resolveChainMonitorStartBlock(ctx, svcCtx.GormDB, cfg.StartBlock)

	pollSec := cfg.PollIntervalSec
	if pollSec <= 0 {
		pollSec = 8
	}
	ticker := time.NewTicker(time.Duration(pollSec) * time.Second)
	defer ticker.Stop()

	logx.Infof("[chain-listener] platform config listener started, contract=%s chainId=%s", contractAddress, chainID.String())
	if err := syncPlatformConfigLogs(ctx, svcCtx, client, filterer, common.HexToAddress(contractAddress), startBlock, chainID); err != nil {
		logx.Errorf("[chain-listener] platform config initial sync failed: %v", err)
		if isRateLimitRPCError(err) {
			time.Sleep(30 * time.Second)
		}
	}

	for {
		select {
		case <-ctx.Done():
			logx.Infof("[chain-listener] platform config listener stopped")
			return
		case <-ticker.C:
			if err := syncPlatformConfigLogs(ctx, svcCtx, client, filterer, common.HexToAddress(contractAddress), startBlock, chainID); err != nil {
				logx.Errorf("[chain-listener] platform config sync failed: %v", err)
				if isRateLimitRPCError(err) {
					time.Sleep(30 * time.Second)
				}
			}
		}
	}
}

func syncPlatformConfigLogs(
	ctx context.Context,
	svcCtx *svc.ServiceContext,
	client *ethclient.Client,
	filterer *platformconfig.PlatformConfigFilterer,
	contract common.Address,
	startBlockCfg uint64,
	chainID *big.Int,
) error {
	checkpointKey := fmt.Sprintf("chain:listener:platform_config:last_block:%s:%s", chainID.String(), strings.ToLower(contract.Hex()))
	fromBlock, err := getStartBlock(ctx, svcCtx.Redis, checkpointKey, startBlockCfg)
	if err != nil {
		return err
	}

	latest, err := client.BlockNumber(ctx)
	if err != nil {
		return err
	}
	if latest < fromBlock {
		return nil
	}

	batchSize := platformLogBatchBlocks
	configRepo := repository.NewConfigRepository(svcCtx.GormDB)
	chainEventRepo := repository.NewChain_eventRepository(svcCtx.GormDB)

	batchesThisTick := 0
	for begin := fromBlock; begin <= latest; {
		if batchesThisTick >= platformMaxBatchesPerTick {
			logx.Infof("[chain-listener] platform config: reached max batches (%d) this tick, resume from block %d next poll",
				platformMaxBatchesPerTick, begin)
			return nil
		}
		batchesThisTick++

		end := begin + batchSize - 1
		if end > latest {
			end = latest
		}
		opts := &bind.FilterOpts{Start: begin, End: &end, Context: ctx}

		if err := consumePlatformConfigCreated(ctx, opts, filterer, configRepo, chainEventRepo, chainID.Int64(), contract.Hex()); err != nil {
			return err
		}
		if err := consumePlatformConfigUpdated(ctx, opts, filterer, configRepo, chainEventRepo, chainID.Int64(), contract.Hex()); err != nil {
			return err
		}
		if err := consumePlatformConfigDeleted(ctx, opts, filterer, configRepo, chainEventRepo, chainID.Int64(), contract.Hex()); err != nil {
			return err
		}

		if serr := setLastBlock(ctx, svcCtx.Redis, checkpointKey, end+1); serr != nil {
			logx.Errorf("[chain-listener] save platform checkpoint failed: %v", serr)
		}
		begin = end + 1
		if begin <= latest {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(platformBetweenBatchSleep):
			}
		}
	}
	return nil
}

func consumePlatformConfigCreated(ctx context.Context, opts *bind.FilterOpts, filterer *platformconfig.PlatformConfigFilterer, configRepo repository.ConfigRepository, chainEventRepo repository.Chain_eventRepository, chainID int64, contractAddress string) error {
	iter, err := filterer.FilterConfigCreated(opts, nil)
	if err != nil {
		return err
	}
	defer iter.Close()
	for iter.Next() {
		ev := iter.Event
		payload := map[string]interface{}{
			"keyHash":   ev.Key.Hex(),
			"value":     ev.Value,
			"valueType": ev.ValueType,
			"group":     ev.Group,
			"status":    ev.Status,
		}
		_ = persistPlatformConfigEvent(ctx, configRepo, chainEventRepo, chainID, contractAddress, "ConfigCreated", ev.Key.Hex(), 2, payload, ev.Raw)
	}
	return iter.Error()
}

func consumePlatformConfigUpdated(ctx context.Context, opts *bind.FilterOpts, filterer *platformconfig.PlatformConfigFilterer, configRepo repository.ConfigRepository, chainEventRepo repository.Chain_eventRepository, chainID int64, contractAddress string) error {
	iter, err := filterer.FilterConfigUpdated(opts, nil)
	if err != nil {
		return err
	}
	defer iter.Close()
	for iter.Next() {
		ev := iter.Event
		payload := map[string]interface{}{
			"keyHash":   ev.Key.Hex(),
			"oldValue":  ev.OldValue,
			"newValue":  ev.NewValue,
			"newStatus": ev.Status,
		}
		_ = persistPlatformConfigEvent(ctx, configRepo, chainEventRepo, chainID, contractAddress, "ConfigUpdated", ev.Key.Hex(), 2, payload, ev.Raw)
	}
	return iter.Error()
}

func consumePlatformConfigDeleted(ctx context.Context, opts *bind.FilterOpts, filterer *platformconfig.PlatformConfigFilterer, configRepo repository.ConfigRepository, chainEventRepo repository.Chain_eventRepository, chainID int64, contractAddress string) error {
	iter, err := filterer.FilterConfigDeleted(opts, nil)
	if err != nil {
		return err
	}
	defer iter.Close()
	for iter.Next() {
		ev := iter.Event
		payload := map[string]interface{}{"keyHash": ev.Key.Hex()}
		_ = persistPlatformConfigEvent(ctx, configRepo, chainEventRepo, chainID, contractAddress, "ConfigDeleted", ev.Key.Hex(), 3, payload, ev.Raw)
	}
	return iter.Error()
}

func persistPlatformConfigEvent(
	ctx context.Context,
	configRepo repository.ConfigRepository,
	chainEventRepo repository.Chain_eventRepository,
	chainID int64,
	contractAddress string,
	eventName string,
	keyHash string,
	syncStatus int,
	payload map[string]interface{},
	raw types.Log,
) error {
	payloadJSON, _ := json.Marshal(payload)
	rawJSON, _ := json.Marshal(raw)
	_ = chainEventRepo.Create(ctx, &model.Chain_event{
		BusinessType:    platformConfigBusinessType,
		BusinessID:      0,
		BusinessCode:    strings.ToLower(keyHash),
		ChainID:         int(chainID),
		ContractAddress: strings.ToLower(contractAddress),
		TxHash:          raw.TxHash.Hex(),
		BlockNumber:     int64(raw.BlockNumber),
		TxIndex:         int(raw.TxIndex),
		LogIndex:        int(raw.Index),
		EventName:       eventName,
		EventSig:        raw.Topics[0].Hex(),
		EventPayload:    string(payloadJSON),
		RawLog:          string(rawJSON),
		EventTime:       time.Now(),
		Confirmations:   1,
		ProcessStatus:   1,
		RetryCount:      0,
		ErrorMsg:        "",
		Creator:         "chain-listener",
		Updator:         "chain-listener",
	})

	configID, err := findConfigIDByHash(ctx, configRepo, keyHash)
	if err != nil || configID == 0 {
		return err
	}
	return configRepo.UpdateColumnsByID(ctx, configID, map[string]interface{}{
		"sync_chain_status": syncStatus,
		"updator":           "chain-listener",
	})
}

func findConfigIDByHash(ctx context.Context, configRepo repository.ConfigRepository, keyHash string) (int64, error) {
	list, _, err := configRepo.List(ctx, 0, 10000)
	if err != nil {
		return 0, err
	}
	target := strings.TrimPrefix(strings.ToLower(keyHash), "0x")
	for _, item := range list {
		hashed := strings.TrimPrefix(strings.ToLower(crypto.Keccak256Hash([]byte(item.ConfigKey)).Hex()), "0x")
		if hashed == target {
			return item.ID, nil
		}
	}
	return 0, nil
}
