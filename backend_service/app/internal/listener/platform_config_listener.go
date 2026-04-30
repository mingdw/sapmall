package listener

import (
	"context"
	"encoding/json"
	"fmt"
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

	pollSec := cfg.PollIntervalSec
	if pollSec <= 0 {
		pollSec = 8
	}
	ticker := time.NewTicker(time.Duration(pollSec) * time.Second)
	defer ticker.Stop()

	logx.Infof("[chain-listener] platform config listener started, contract=%s", contractAddress)
	if err := syncPlatformConfigLogs(ctx, svcCtx, client, filterer, common.HexToAddress(contractAddress), cfg.StartBlock); err != nil {
		logx.Errorf("[chain-listener] platform config initial sync failed: %v", err)
	}

	for {
		select {
		case <-ctx.Done():
			logx.Infof("[chain-listener] platform config listener stopped")
			return
		case <-ticker.C:
			if err := syncPlatformConfigLogs(ctx, svcCtx, client, filterer, common.HexToAddress(contractAddress), cfg.StartBlock); err != nil {
				logx.Errorf("[chain-listener] platform config sync failed: %v", err)
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
) error {
	chainID, err := client.ChainID(ctx)
	if err != nil {
		return err
	}
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

	const batchSize uint64 = 2000
	configRepo := repository.NewConfigRepository(svcCtx.GormDB)
	chainEventRepo := repository.NewChain_eventRepository(svcCtx.GormDB)

	for begin := fromBlock; begin <= latest; {
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
