package listener

import (
	"context"
	"encoding/json"
	"fmt"
	"math/big"
	"strings"
	"sync"
	"time"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

const (
	swapListenerActor = "swap_listener"
)

// swapExecutedEventTopic 是 SwapExecuted(address,uint8,address,uint256,uint256,uint256,uint256) 事件的 topic hash
var swapExecutedEventTopic = crypto.Keccak256Hash([]byte("SwapExecuted(address,uint8,address,uint256,uint256,uint256,uint256)"))

// swapListenerManager 管理所有链的 Swap 监听器
type swapListenerManager struct {
	svc     *svc.ServiceContext
	cancel  context.CancelFunc
	wg      sync.WaitGroup
	mu      sync.RWMutex
	running map[int64]context.CancelFunc // chainID -> cancel function
}

var swapManager = &swapListenerManager{
	running: make(map[int64]context.CancelFunc),
}

// RunSwapListener 启动 Swap 监听器管理器
// 为每条启用的链启动独立的监听协程，使用各自的轮询间隔和游标
func RunSwapListener(ctx context.Context, svc *svc.ServiceContext) {
	logx.Infof("swap_listener manager started")
	swapManager.svc = svc

	// 启动监听器管理协程
	go swapManager.manage(ctx)
}

// manage 监听器管理协程，负责启动/停止各链的监听器
func (m *swapListenerManager) manage(ctx context.Context) {
	// 初始扫描
	m.syncListeners(ctx)

	ticker := time.NewTicker(60 * time.Second) // 每60秒检查一次是否有新的链需要监听
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			logx.Infof("swap_listener manager stopping")
			m.stopAll()
			return
		case <-ticker.C:
			m.syncListeners(ctx)
		}
	}
}

// syncListeners 同步监听器状态，启动新链的监听器，停止已禁用的链
func (m *swapListenerManager) syncListeners(ctx context.Context) {
	networkRepo := repository.NewChain_networkRepository(m.svc.GormDB)
	networks, _, err := networkRepo.ListByCondition(ctx, "", "", nil, 0, 200)
	if err != nil {
		logx.Errorf("swap_listener sync: list networks error: %v", err)
		return
	}

	activeChains := make(map[int64]bool)

	for _, network := range networks {
		// 检查是否启用 Swap 监听器
		if network.SwapListenerEnabled != 0 {
			continue
		}
		// 检查链是否启用
		if network.Status != 0 {
			continue
		}
		// 检查合约地址
		swapRouterAddr := strings.TrimSpace(network.SwapRouterAddress)
		rpcURL := strings.TrimSpace(network.RpcUrl)
		if swapRouterAddr == "" || rpcURL == "" || !common.IsHexAddress(swapRouterAddr) {
			continue
		}

		activeChains[int64(network.ChainId)] = true

		// 检查是否已在运行
		m.mu.RLock()
		_, running := m.running[int64(network.ChainId)]
		m.mu.RUnlock()

		if !running {
			// 启动新的监听器
			m.startChainListener(ctx, network)
		}
	}

	// 停止已禁用的链
	m.mu.Lock()
	for chainID, cancel := range m.running {
		if !activeChains[chainID] {
			logx.Infof("swap_listener stopping for chain=%d", chainID)
			cancel()
			delete(m.running, chainID)
		}
	}
	m.mu.Unlock()
}

// startChainListener 为单条链启动监听器
func (m *swapListenerManager) startChainListener(ctx context.Context, network *model.Chain_network) {
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

		// 获取轮询间隔，使用链特有的配置
		pollInterval := network.GetSwapPollInterval()
		if pollInterval <= 0 {
			pollInterval = 12
		}
		interval := time.Duration(pollInterval) * time.Second

		logx.Infof("swap_listener started for chain=%d interval=%s", network.ChainId, interval)

		ticker := time.NewTicker(interval)
		defer ticker.Stop()

		for {
			select {
			case <-chainCtx.Done():
				logx.Infof("swap_listener stopped for chain=%d", network.ChainId)
				return
			case <-ticker.C:
				if err := scanSwapEventsForChainOnce(chainCtx, m.svc, network); err != nil {
					logx.Errorf("swap_listener chain=%d error: %v", network.ChainId, err)
				}
			}
		}
	}()
}

// stopAll 停止所有监听器
func (m *swapListenerManager) stopAll() {
	m.mu.Lock()
	for chainID, cancel := range m.running {
		cancel()
		delete(m.running, chainID)
	}
	m.mu.Unlock()
	m.wg.Wait()
}

// scanSwapEventsForChainOnce 扫描单条链的 SwapExecuted 事件
func scanSwapEventsForChainOnce(ctx context.Context, svc *svc.ServiceContext, network *model.Chain_network) error {
	chainID := network.ChainId
	rpcURL := strings.TrimSpace(network.RpcUrl)
	contractAddrHex := strings.TrimSpace(network.SwapRouterAddress)

	logx.Infof("swap_listener [chain=%d] 开始扫描，contract=%s", chainID, contractAddrHex)

	if rpcURL == "" || contractAddrHex == "" || !common.IsHexAddress(contractAddrHex) {
		logx.Infof("swap_listener [chain=%d] 跳过：rpc或合约地址未配置", chainID)
		return nil
	}

	// 校验起始区块是否配置
	if err := ValidateStartBlock("swap_listener", network.SwapListenerStartBlock, contractAddrHex); err != nil {
		logx.Errorf("swap_listener [chain=%d] 校验失败: %v", chainID, err)
		return err
	}

	scanCtx, cancel := context.WithTimeout(ctx, 120*time.Second)
	defer cancel()

	logx.Infof("swap_listener [chain=%d] 连接RPC: %s", chainID, rpcURL)
	client, err := ethclient.DialContext(scanCtx, rpcURL)
	if err != nil {
		logx.Errorf("swap_listener [chain=%d] 连接RPC失败: %v", chainID, err)
		return fmt.Errorf("dial rpc chain=%d: %w", chainID, err)
	}
	defer client.Close()

	contractAddr := common.HexToAddress(contractAddrHex)

	// 使用独立的 swap_listener 游标
	var lastProcessed int64
	if network.SwapListenerLastBlock > 0 {
		lastProcessed = network.SwapListenerLastBlock
		logx.Infof("swap_listener [chain=%d] 使用游标 lastBlock=%d", chainID, lastProcessed)
	} else {
		lastProcessed = network.SwapListenerStartBlock - 1
		logx.Infof("swap_listener [chain=%d] 使用起始区块 startBlock=%d, lastProcessed=%d", chainID, network.SwapListenerStartBlock, lastProcessed)
	}

	latest, err := client.BlockNumber(scanCtx)
	if err != nil {
		logx.Errorf("swap_listener [chain=%d] 获取最新区块失败: %v", chainID, err)
		return fmt.Errorf("block number chain=%d: %w", chainID, err)
	}
	logx.Infof("swap_listener [chain=%d] 最新区块: %d", chainID, latest)

	from := uint64(lastProcessed + 1)
	if from > latest {
		logx.Infof("swap_listener [chain=%d] 无需扫描，from=%d > latest=%d", chainID, from, latest)
		return nil
	}

	// 根据链的出块时间动态计算每次扫描的区块数
	chunk := calculateChunkSize(network.BlockTime)
	to := from + uint64(chunk) - 1
	if to > latest {
		to = latest
	}
	logx.Infof("swap_listener [chain=%d] 扫描范围: %d-%d (chunk=%d)", chainID, from, to, chunk)

	// 过滤 SwapExecuted 事件
	logs, err := client.FilterLogs(scanCtx, ethereum.FilterQuery{
		FromBlock: new(big.Int).SetUint64(from),
		ToBlock:   new(big.Int).SetUint64(to),
		Addresses: []common.Address{contractAddr},
		Topics:    [][]common.Hash{{swapExecutedEventTopic}},
	})
	if err != nil {
		logx.Errorf("swap_listener [chain=%d] 查询日志失败: %v", chainID, err)
		return fmt.Errorf("filter logs chain=%d %d-%d: %w", chainID, from, to, err)
	}

	logx.Infof("swap_listener [chain=%d] 查询到 %d 条日志", chainID, len(logs))

	swapRepo := repository.NewChainEventSwapRepository(svc.GormDB)

	for _, lg := range logs {
		if len(lg.Topics) < 2 {
			logx.Infof("swap_listener [chain=%d] 跳过无效日志: tx=%s", chainID, lg.TxHash.Hex())
			continue
		}

		// 解析 SwapExecuted 事件
		userAddr := common.BytesToAddress(lg.Topics[1].Bytes())
		logx.Infof("swap_listener [chain=%d] 解析事件: tx=%s block=%d user=%s",
			chainID, lg.TxHash.Hex(), lg.BlockNumber, userAddr.Hex())

		// 解析非 indexed 数据
		data := lg.Data
		if len(data) < 6*32 {
			logx.Errorf("swap_listener [chain=%d] 事件数据过短: tx=%s dataLen=%d", chainID, lg.TxHash.Hex(), len(data))
			continue
		}

		direction := uint8(new(big.Int).SetBytes(data[0:32]).Uint64())
		tokenIn := common.BytesToAddress(data[32:64])
		amountIn := new(big.Int).SetBytes(data[64:96])
		amountOut := new(big.Int).SetBytes(data[96:128])
		fee := new(big.Int).SetBytes(data[128:160])
		timestamp := new(big.Int).SetBytes(data[160:192])

		logx.Infof("swap_listener [chain=%d] 事件详情: direction=%d tokenIn=%s amountIn=%s amountOut=%s fee=%s",
			chainID, direction, tokenIn.Hex(), amountIn.String(), amountOut.String(), fee.String())

		// 尝试获取区块时间
		var blockTime *time.Time
		if lg.BlockNumber > 0 {
			blk, err := client.HeaderByNumber(scanCtx, big.NewInt(int64(lg.BlockNumber)))
			if err == nil && blk != nil {
				t := time.Unix(int64(blk.Time), 0)
				blockTime = &t
			}
		}

		// 构建事件负载 JSON
		eventPayload := map[string]interface{}{
			"direction":  direction,
			"tokenIn":    tokenIn.Hex(),
			"amountIn":   amountIn.String(),
			"amountOut":  amountOut.String(),
			"fee":        fee.String(),
			"timestamp":  timestamp.Int64(),
			"user":       userAddr.Hex(),
			"txHash":     lg.TxHash.Hex(),
		}
		payloadBytes, _ := json.Marshal(eventPayload)

		creator := strings.ToLower(userAddr.Hex())

		logx.Infof("swap_listener [chain=%d] 查询匹配的兑换记录: user=%s", chainID, creator)
		event, findErr := swapRepo.GetByCreatorAndChainID(scanCtx, creator, chainID)
		if findErr != nil {
			if findErr == gorm.ErrRecordNotFound {
				logx.Infof("swap_listener [chain=%d] 未找到匹配的兑换记录，保存链上事件: user=%s tx=%s",
					chainID, userAddr.Hex(), lg.TxHash.Hex())
				chainEvent := &model.ChainEvent{
					BusinessType:    "swap",
					BusinessCode:    fmt.Sprintf("swp_chain_%d_%d", chainID, lg.BlockNumber),
					ChainID:         chainID,
					ContractAddress: contractAddrHex,
					TxHash:          lg.TxHash.Hex(),
					BlockNumber:     int64(lg.BlockNumber),
					TxIndex:         int(lg.TxIndex),
					LogIndex:        int(lg.Index),
					EventName:       "SwapExecuted",
					EventSig:        swapExecutedEventTopic.Hex(),
					EventPayload:    string(payloadBytes),
					ProcessStatus:   2,
					Creator:         creator,
				}
				if blockTime != nil {
					chainEvent.EventTime = *blockTime
				}
				if createErr := swapRepo.Create(scanCtx, chainEvent); createErr != nil {
					logx.Errorf("swap_listener [chain=%d] 保存链上事件失败: %v", chainID, createErr)
				} else {
					logx.Infof("swap_listener [chain=%d] 链上事件保存成功: id=%d", chainID, chainEvent.ID)
				}
				continue
			}
			logx.Errorf("swap_listener [chain=%d] 查询兑换记录失败: %v", chainID, findErr)
			continue
		}
		logx.Infof("swap_listener [chain=%d] 找到匹配的兑换记录: id=%d", chainID, event.ID)

		// 更新兑换记录为处理成功
		logx.Infof("swap_listener [chain=%d] 更新兑换记录: id=%d", chainID, event.ID)
		updates := map[string]interface{}{
			"process_status": 2,
			"tx_hash":        lg.TxHash.Hex(),
			"block_number":   int64(lg.BlockNumber),
			"tx_index":       int(lg.TxIndex),
			"log_index":      int(lg.Index),
			"event_name":     "SwapExecuted",
			"event_sig":      swapExecutedEventTopic.Hex(),
			"event_payload":  string(payloadBytes),
			"updator":        swapListenerActor,
		}
		if blockTime != nil {
			updates["event_time"] = *blockTime
		}

		if updateErr := swapRepo.UpdateColumns(scanCtx, event.ID, updates); updateErr != nil {
			logx.Errorf("swap_listener [chain=%d] 更新兑换记录失败: id=%d err=%v", chainID, event.ID, updateErr)
		} else {
			logx.Infof("swap_listener [chain=%d] 兑换记录更新成功: id=%d user=%s tx=%s amountIn=%s amountOut=%s",
				chainID, event.ID, userAddr.Hex(), lg.TxHash.Hex(), amountIn.String(), amountOut.String())
		}
	}

	// 更新独立的 swap_listener 游标
	logx.Infof("swap_listener [chain=%d] 更新游标: lastBlock=%d", chainID, to)
	networkRepo := repository.NewChain_networkRepository(svc.GormDB)
	if updateErr := networkRepo.UpdateColumnsByID(scanCtx, network.ID, map[string]interface{}{
		"swap_listener_last_block": int64(to),
		"updator":                  swapListenerActor,
	}); updateErr != nil {
		logx.Errorf("swap_listener [chain=%d] 更新游标失败: %v", chainID, updateErr)
		return fmt.Errorf("update swap_listener_last_block chain=%d: %w", chainID, updateErr)
	}

	logx.Infof("swap_listener [chain=%d] 扫描完成", chainID)
	return nil
}

// calculateChunkSize 根据出块时间动态计算每次扫描的区块数
// 出块快的链扫描更多区块，出块慢的链扫描更少区块
func calculateChunkSize(blockTime int) int {
	if blockTime <= 0 {
		blockTime = 12
	}
	// 目标：每次扫描覆盖约60秒的区块
	targetSeconds := 60
	chunk := targetSeconds / blockTime
	if chunk < 10 {
		chunk = 10
	}
	if chunk > 500 {
		chunk = 500
	}
	return chunk
}
