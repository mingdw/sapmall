package listener

import (
	"context"
	"encoding/json"
	"fmt"
	"math/big"
	"strings"
	"time"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"

	"github.com/ethereum/go-ethereum/accounts/abi"
	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/redis/go-redis/v9"
	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

const (
	merchantDepositBusinessType = "merchant_deposit"
	merchantDepositEventName    = "DepositPaid"
)

const merchantDepositABI = `[
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "intentId", "type": "string"},
      {"indexed": false, "internalType": "address", "name": "payer", "type": "address"},
      {"indexed": false, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "DepositPaid",
    "type": "event"
  }
]`

type depositPaidEvent struct {
	IntentId string
	Payer    common.Address
	Token    common.Address
	Amount   *big.Int
}

func StartMerchantDepositListener(ctx context.Context, svcCtx *svc.ServiceContext) {
	cfg := svcCtx.Config.ChainMonitor
	if !cfg.Enabled {
		logx.Infof("[chain-listener] merchant deposit listener disabled")
		return
	}
	if strings.TrimSpace(cfg.RPCURL) == "" {
		logx.Errorf("[chain-listener] RPCURL is empty, skip listener")
		return
	}

	contractAddress := strings.TrimSpace(svcCtx.Config.MerchantDeposit.ContractAddress)
	if contractAddress == "" || !common.IsHexAddress(contractAddress) {
		logx.Errorf("[chain-listener] invalid merchant deposit contract address: %s", contractAddress)
		return
	}

	parsedABI, err := abi.JSON(strings.NewReader(merchantDepositABI))
	if err != nil {
		logx.Errorf("[chain-listener] parse ABI failed: %v", err)
		return
	}
	eventDef, ok := parsedABI.Events[merchantDepositEventName]
	if !ok {
		logx.Errorf("[chain-listener] event definition not found: %s", merchantDepositEventName)
		return
	}

	client, err := ethclient.DialContext(ctx, cfg.RPCURL)
	if err != nil {
		logx.Errorf("[chain-listener] connect rpc failed: %v", err)
		return
	}
	defer client.Close()

	pollSec := cfg.PollIntervalSec
	if pollSec <= 0 {
		pollSec = 8
	}
	confirmReq := cfg.ConfirmationsReq
	if confirmReq <= 0 {
		confirmReq = 6
	}

	ticker := time.NewTicker(time.Duration(pollSec) * time.Second)
	defer ticker.Stop()

	logx.Infof("[chain-listener] merchant deposit listener started, contract=%s", contractAddress)

	// 立即执行一次，再按周期轮询
	if err := syncMerchantDepositLogs(ctx, svcCtx, client, parsedABI, eventDef, common.HexToAddress(contractAddress), confirmReq, cfg.StartBlock); err != nil {
		logx.Errorf("[chain-listener] initial sync failed: %v", err)
	}

	for {
		select {
		case <-ctx.Done():
			logx.Infof("[chain-listener] merchant deposit listener stopped")
			return
		case <-ticker.C:
			if err := syncMerchantDepositLogs(ctx, svcCtx, client, parsedABI, eventDef, common.HexToAddress(contractAddress), confirmReq, cfg.StartBlock); err != nil {
				logx.Errorf("[chain-listener] sync failed: %v", err)
			}
		}
	}
}

func syncMerchantDepositLogs(
	ctx context.Context,
	svcCtx *svc.ServiceContext,
	client *ethclient.Client,
	parsedABI abi.ABI,
	eventDef abi.Event,
	contract common.Address,
	confirmReq int64,
	startBlockCfg uint64,
) error {
	chainID := svcCtx.Config.MerchantDeposit.ChainID
	checkpointKey := fmt.Sprintf("chain:listener:merchant_deposit:last_block:%d:%s", chainID, strings.ToLower(contract.Hex()))
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
	userDepositRepo := repository.NewUserDepositRepository(svcCtx.GormDB)
	chainEventRepo := repository.NewChain_eventRepository(svcCtx.GormDB)
	userRepo := repository.NewUserRepository(svcCtx.GormDB)

	for begin := fromBlock; begin <= latest; {
		end := begin + batchSize - 1
		if end > latest {
			end = latest
		}

		query := ethereumFilterQuery(begin, end, contract, eventDef.ID)
		logs, qerr := client.FilterLogs(ctx, query)
		if qerr != nil {
			return qerr
		}

		for _, lg := range logs {
			ev, derr := decodeDepositPaidEvent(parsedABI, lg)
			if derr != nil {
				logx.Errorf("[chain-listener] decode log failed tx=%s idx=%d err=%v", lg.TxHash.Hex(), lg.Index, derr)
				continue
			}
			if strings.TrimSpace(ev.IntentId) == "" {
				continue
			}

			deposit, ferr := userDepositRepo.GetByIntentId(ctx, ev.IntentId)
			if ferr != nil {
				if ferr != gorm.ErrRecordNotFound {
					logx.Errorf("[chain-listener] query deposit by intent failed: %v", ferr)
				}
				continue
			}

			confirmations := int64(0)
			if latest >= lg.BlockNumber {
				confirmations = int64(latest-lg.BlockNumber) + 1
			}

			now := time.Now()
			deposit.TxHash = lg.TxHash.Hex()
			deposit.BlockNumber = int64(lg.BlockNumber)
			deposit.Confirmations = int(confirmations)
			if deposit.PaidAt.IsZero() {
				deposit.PaidAt = now
			}
			if confirmations >= confirmReq {
				deposit.DepositStatus = 3
				deposit.DepositStatusDesc = "已确认"
				if deposit.ConfirmedAt.IsZero() {
					deposit.ConfirmedAt = now
				}
				_ = userRepo.UpdateColumnsByID(ctx, deposit.UserId, map[string]interface{}{
					"merchant_deposit_status": 3,
				})
			} else {
				deposit.DepositStatus = 2
				deposit.DepositStatusDesc = "链上确认中"
				_ = userRepo.UpdateColumnsByID(ctx, deposit.UserId, map[string]interface{}{
					"merchant_deposit_status": 2,
				})
			}

			if uerr := userDepositRepo.Update(ctx, deposit); uerr != nil {
				logx.Errorf("[chain-listener] update deposit failed, intent=%s err=%v", ev.IntentId, uerr)
				continue
			}

			payload, _ := json.Marshal(map[string]interface{}{
				"intentId":      ev.IntentId,
				"payer":         ev.Payer.Hex(),
				"token":         ev.Token.Hex(),
				"amount":        ev.Amount.String(),
				"confirmations": confirmations,
			})
			rawLogJSON, _ := json.Marshal(lg)
			_ = chainEventRepo.Create(ctx, &model.Chain_event{
				BusinessType:    merchantDepositBusinessType,
				BusinessID:      deposit.ID,
				BusinessCode:    ev.IntentId,
				ChainID:         int(chainID),
				ContractAddress: strings.ToLower(contract.Hex()),
				TxHash:          lg.TxHash.Hex(),
				BlockNumber:     int64(lg.BlockNumber),
				TxIndex:         int(lg.TxIndex),
				LogIndex:        int(lg.Index),
				EventName:       merchantDepositEventName,
				EventSig:        eventDef.ID.Hex(),
				EventPayload:    string(payload),
				RawLog:          string(rawLogJSON),
				EventTime:       now,
				Confirmations:   int(confirmations),
				ProcessStatus:   1,
				RetryCount:      0,
				ErrorMsg:        "",
				Creator:         "chain-listener",
				Updator:         "chain-listener",
			})
		}

		// 按批次推进断点，避免重复扫描
		if serr := setLastBlock(ctx, svcCtx.Redis, checkpointKey, end+1); serr != nil {
			logx.Errorf("[chain-listener] save checkpoint failed: %v", serr)
		}
		begin = end + 1
	}

	return nil
}

func decodeDepositPaidEvent(parsedABI abi.ABI, lg types.Log) (*depositPaidEvent, error) {
	var decoded depositPaidEvent
	if len(lg.Topics) == 0 {
		return nil, fmt.Errorf("empty topics")
	}
	if err := parsedABI.UnpackIntoInterface(&decoded, merchantDepositEventName, lg.Data); err != nil {
		return nil, err
	}
	return &decoded, nil
}

func getStartBlock(ctx context.Context, rdb *redis.Client, key string, fallback uint64) (uint64, error) {
	if rdb == nil {
		return fallback, nil
	}
	val, err := rdb.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return fallback, nil
		}
		return 0, err
	}
	var num uint64
	if _, scanErr := fmt.Sscanf(val, "%d", &num); scanErr != nil {
		return fallback, nil
	}
	return num, nil
}

func setLastBlock(ctx context.Context, rdb *redis.Client, key string, block uint64) error {
	if rdb == nil {
		return nil
	}
	return rdb.Set(ctx, key, fmt.Sprintf("%d", block), 0).Err()
}

func ethereumFilterQuery(from, to uint64, contract common.Address, eventID common.Hash) ethereum.FilterQuery {
	return ethereum.FilterQuery{
		FromBlock: big.NewInt(int64(from)),
		ToBlock:   big.NewInt(int64(to)),
		Addresses: []common.Address{contract},
		Topics:    [][]common.Hash{{eventID}},
	}
}

