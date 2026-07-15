package listener

import (
	"context"
	"fmt"
	"math/big"
	"strings"
	"sync"
	"time"

	orderlogic "sapphire-mall/app/internal/logic/order"
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
	paymentListenerActor = "payment_listener"
)

// paymentPaidEventTopic 是 PaymentPaid(string,string,address,address,address,uint256,uint256) 事件的 topic hash
var paymentPaidEventTopic = crypto.Keccak256Hash([]byte("PaymentPaid(string,string,address,address,address,uint256,uint256)"))

// PaymentPaidEvent 解析后的支付事件
type PaymentPaidEvent struct {
	IntentIdHash string         // keccak256 hash of intentId (indexed)
	OrderRefHash string         // keccak256 hash of orderRef (indexed)
	Payer        common.Address // 支付者地址
	Seller       common.Address // 卖家地址
	Token        common.Address // 支付代币地址
	Amount       *big.Int       // 支付金额
	Timestamp    *big.Int       // 时间戳
	IntentId     string         // 解析后的 intentId
	OrderRef     string         // 解析后的 orderRef
}

// paymentListenerManager 管理所有链的 Payment 监听器
type paymentListenerManager struct {
	svc     *svc.ServiceContext
	wg      sync.WaitGroup
	mu      sync.RWMutex
	running map[int64]context.CancelFunc // chainID -> cancel function
}

var paymentManager = &paymentListenerManager{
	running: make(map[int64]context.CancelFunc),
}

// RunPaymentListener 启动 Payment 监听器管理器
// 为每条启用的链启动独立的监听协程，监听 PaymentPaid 事件并更新订单状态
func RunPaymentListener(ctx context.Context, svc *svc.ServiceContext) {
	logx.Infof("payment_listener manager started")
	paymentManager.svc = svc

	go paymentManager.manage(ctx)
}

// manage 监听器管理协程
func (m *paymentListenerManager) manage(ctx context.Context) {
	// 初始扫描
	m.syncListeners(ctx)

	ticker := time.NewTicker(60 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			logx.Infof("payment_listener manager stopping")
			m.stopAll()
			return
		case <-ticker.C:
			m.syncListeners(ctx)
		}
	}
}

// syncListeners 同步监听器状态
func (m *paymentListenerManager) syncListeners(ctx context.Context) {
	networkRepo := repository.NewChain_networkRepository(m.svc.GormDB)
	networks, _, err := networkRepo.ListByCondition(ctx, "", "", nil, 0, 200)
	if err != nil {
		logx.Errorf("payment_listener sync: list networks error: %v", err)
		return
	}

	activeChains := make(map[int64]bool)

	for _, network := range networks {
		// 检查是否启用 Payment 监听器
		if network.PaymentListenerEnabled != 0 {
			continue
		}
		// 检查链是否启用
		if network.Status != 0 {
			continue
		}
		// 检查合约地址
		paymentRouterAddr := strings.TrimSpace(network.PaymentRouterAddress)
		rpcURL := strings.TrimSpace(network.RpcUrl)
		if rpcURL == "" || paymentRouterAddr == "" || !common.IsHexAddress(paymentRouterAddr) {
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
			logx.Infof("payment_listener stopping for chain=%d", chainID)
			cancel()
			delete(m.running, chainID)
		}
	}
	m.mu.Unlock()
}

// startChainListener 为单条链启动监听器
func (m *paymentListenerManager) startChainListener(ctx context.Context, network *model.Chain_network) {
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
		pollInterval := network.GetPaymentPollInterval()
		if pollInterval <= 0 {
			pollInterval = 12
		}
		interval := time.Duration(pollInterval) * time.Second

		logx.Infof("payment_listener started for chain=%d interval=%s", network.ChainId, interval)

		ticker := time.NewTicker(interval)
		defer ticker.Stop()

		for {
			select {
			case <-chainCtx.Done():
				logx.Infof("payment_listener stopped for chain=%d", network.ChainId)
				return
			case <-ticker.C:
				if err := scanPaymentEventsForChainOnce(chainCtx, m.svc, network); err != nil {
					logx.Errorf("payment_listener chain=%d error: %v", network.ChainId, err)
				}
			}
		}
	}()
}

// stopAll 停止所有监听器
func (m *paymentListenerManager) stopAll() {
	m.mu.Lock()
	for chainID, cancel := range m.running {
		cancel()
		delete(m.running, chainID)
	}
	m.mu.Unlock()
	m.wg.Wait()
}

// scanPaymentEventsForChainOnce 扫描单条链的 PaymentPaid 事件
func scanPaymentEventsForChainOnce(ctx context.Context, svc *svc.ServiceContext, network *model.Chain_network) error {
	chainID := network.ChainId
	rpcURL := strings.TrimSpace(network.RpcUrl)
	contractAddrHex := strings.TrimSpace(network.PaymentRouterAddress)

	logx.Infof("payment_listener [chain=%d] 开始扫描，contract=%s", chainID, contractAddrHex)

	if rpcURL == "" || contractAddrHex == "" || !common.IsHexAddress(contractAddrHex) {
		logx.Infof("payment_listener [chain=%d] 跳过：rpc或合约地址未配置", chainID)
		return nil
	}

	// 校验起始区块是否配置
	if err := ValidateStartBlock("payment_listener", network.PaymentListenerStartBlock, contractAddrHex); err != nil {
		logx.Errorf("payment_listener [chain=%d] 校验失败: %v", chainID, err)
		return err
	}

	scanCtx, cancel := context.WithTimeout(ctx, 120*time.Second)
	defer cancel()

	logx.Infof("payment_listener [chain=%d] 连接RPC: %s", chainID, rpcURL)
	client, err := ethclient.DialContext(scanCtx, rpcURL)
	if err != nil {
		logx.Errorf("payment_listener [chain=%d] 连接RPC失败: %v", chainID, err)
		return fmt.Errorf("dial rpc chain=%d: %w", chainID, err)
	}
	defer client.Close()

	contractAddr := common.HexToAddress(contractAddrHex)

	// 使用独立的 payment_listener 游标
	var lastProcessed int64
	if network.PaymentListenerLastBlock > 0 {
		lastProcessed = network.PaymentListenerLastBlock
		logx.Infof("payment_listener [chain=%d] 使用游标 lastBlock=%d", chainID, lastProcessed)
	} else {
		lastProcessed = network.PaymentListenerStartBlock - 1
		logx.Infof("payment_listener [chain=%d] 使用起始区块 startBlock=%d, lastProcessed=%d", chainID, network.PaymentListenerStartBlock, lastProcessed)
	}

	latest, err := client.BlockNumber(scanCtx)
	if err != nil {
		logx.Errorf("payment_listener [chain=%d] 获取最新区块失败: %v", chainID, err)
		return fmt.Errorf("block number chain=%d: %w", chainID, err)
	}
	logx.Infof("payment_listener [chain=%d] 最新区块: %d", chainID, latest)

	from := uint64(lastProcessed + 1)
	if from > latest {
		logx.Infof("payment_listener [chain=%d] 无需扫描，from=%d > latest=%d", chainID, from, latest)
		return nil
	}

	chunk := calculateChunkSize(network.BlockTime)
	to := from + uint64(chunk) - 1
	if to > latest {
		to = latest
	}
	logx.Infof("payment_listener [chain=%d] 扫描范围: %d-%d (chunk=%d)", chainID, from, to, chunk)

	// 过滤 PaymentPaid 事件
	logs, err := client.FilterLogs(scanCtx, ethereum.FilterQuery{
		FromBlock: new(big.Int).SetUint64(from),
		ToBlock:   new(big.Int).SetUint64(to),
		Addresses: []common.Address{contractAddr},
		Topics:    [][]common.Hash{{paymentPaidEventTopic}},
	})
	if err != nil {
		logx.Errorf("payment_listener [chain=%d] 查询日志失败: %v", chainID, err)
		return fmt.Errorf("filter logs chain=%d %d-%d: %w", chainID, from, to, err)
	}

	logx.Infof("payment_listener [chain=%d] 查询到 %d 条日志", chainID, len(logs))

	paymentRepo := repository.NewOrderPaymentRepository(svc.GormDB)
	orderRepo := repository.NewOrderRepository(svc.GormDB)

	for i, lg := range logs {
		logx.Infof("payment_listener [chain=%d] 处理日志 %d/%d: tx=%s block=%d",
			chainID, i+1, len(logs), lg.TxHash.Hex(), lg.BlockNumber)
		if err := handlePaymentPaidLog(scanCtx, svc, lg, chainID, contractAddrHex, paymentRepo, orderRepo); err != nil {
			logx.Errorf("payment_listener [chain=%d] 处理日志失败: tx=%s err=%v", chainID, lg.TxHash.Hex(), err)
		}
	}

	// 更新独立的 payment_listener 游标
	logx.Infof("payment_listener [chain=%d] 更新游标: lastBlock=%d", chainID, to)
	networkRepo := repository.NewChain_networkRepository(svc.GormDB)
	if updateErr := networkRepo.UpdateColumnsByID(scanCtx, network.ID, map[string]interface{}{
		"payment_listener_last_block": int64(to),
		"updator":                     paymentListenerActor,
	}); updateErr != nil {
		logx.Errorf("payment_listener [chain=%d] 更新游标失败: %v", chainID, updateErr)
		return fmt.Errorf("update payment_listener_last_block chain=%d: %w", chainID, updateErr)
	}

	logx.Infof("payment_listener [chain=%d] 扫描完成", chainID)
	return nil
}

// handlePaymentPaidLog 处理单个 PaymentPaid 事件
func handlePaymentPaidLog(
	ctx context.Context,
	svc *svc.ServiceContext,
	lg gethtypes.Log,
	chainID int,
	contractAddrHex string,
	paymentRepo repository.OrderPaymentRepository,
	orderRepo repository.OrderRepository,
) error {
	txHash := lg.TxHash.Hex()
	logx.Infof("payment_listener [chain=%d] 开始处理事件: tx=%s block=%d", chainID, txHash, lg.BlockNumber)

	// 解析事件
	event, err := decodePaymentPaidLog(lg)
	if err != nil {
		logx.Errorf("payment_listener [chain=%d] 解析事件失败: tx=%s err=%v", chainID, txHash, err)
		return fmt.Errorf("decode event: %w", err)
	}
	logx.Infof("payment_listener [chain=%d] 事件解析成功: payer=%s token=%s amount=%s",
		chainID, event.Payer.Hex(), event.Token.Hex(), event.Amount.String())

	// 获取区块时间
	var blockTime time.Time
	if lg.BlockNumber > 0 {
		client, err := ethclient.DialContext(ctx, strings.TrimSpace(svc.Config.ChainMonitor.RPCURL))
		if err == nil {
			defer client.Close()
			blk, err := client.HeaderByNumber(ctx, big.NewInt(int64(lg.BlockNumber)))
			if err == nil && blk != nil {
				blockTime = time.Unix(int64(blk.Time), 0)
			}
		}
	}
	if blockTime.IsZero() {
		blockTime = time.Now()
	}

	// 查找匹配的待确认支付记录
	// 使用 txHash 查询
	logx.Infof("payment_listener [chain=%d] 查询支付记录: tx=%s", chainID, txHash)
	payment, err := paymentRepo.GetByTxHash(ctx, txHash)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			logx.Infof("payment_listener [chain=%d] 未通过txHash找到支付记录，尝试intentId查询", chainID)
			// 尝试使用 intentId 查询
			if event.IntentId != "" {
				payment, err = paymentRepo.GetByIntentId(ctx, event.IntentId)
			}
			if err == gorm.ErrRecordNotFound {
				logx.Infof("payment_listener [chain=%d] 未找到匹配的支付记录: tx=%s intentId=%s",
					chainID, txHash, event.IntentId)
				return nil
			}
		}
		if err != nil {
			logx.Errorf("payment_listener [chain=%d] 查询支付记录失败: %v", chainID, err)
			return fmt.Errorf("find payment record: %w", err)
		}
	}
	logx.Infof("payment_listener [chain=%d] 找到支付记录: id=%d orderId=%d status=%d",
		chainID, payment.ID, payment.OrderId, payment.PaymentStatus)

	// 验证事件参数
	if !strings.EqualFold(event.Payer.Hex(), payment.PayerAddress) {
		logx.Infof("payment_listener [chain=%d] 支付者地址不匹配: event=%s expected=%s",
			chainID, event.Payer.Hex(), payment.PayerAddress)
		return nil
	}
	if payment.SellerCode != nil && *payment.SellerCode != "" && !strings.EqualFold(event.Seller.Hex(), *payment.SellerCode) {
		logx.Infof("payment_listener [chain=%d] 卖家地址不匹配: event=%s expected=%s",
			chainID, event.Seller.Hex(), *payment.SellerCode)
		return nil
	}
	if !strings.EqualFold(event.Token.Hex(), payment.TokenAddress) {
		logx.Infof("payment_listener [chain=%d] 代币地址不匹配: event=%s expected=%s",
			chainID, event.Token.Hex(), payment.TokenAddress)
		return nil
	}

	// 检查金额
	eventAmount := event.Amount
	expectedAmountStr := strings.TrimSpace(payment.AmountRaw)
	if eventAmount != nil && expectedAmountStr != "" {
		expectedAmount, ok := new(big.Int).SetString(expectedAmountStr, 10)
		if ok && expectedAmount.Sign() > 0 {
			if eventAmount.Cmp(expectedAmount) != 0 {
				logx.Infof("payment_listener [chain=%d] 金额不匹配: event=%s expected=%s",
					chainID, eventAmount.String(), expectedAmountStr)
				return nil
			}
		}
	}
	logx.Infof("payment_listener [chain=%d] 事件参数验证通过", chainID)

	// 获取安全确认区块数
	networkRepo := repository.NewChain_networkRepository(svc.GormDB)
	network, err := networkRepo.GetByChainId(ctx, chainID)
	if err != nil || network == nil {
		logx.Errorf("payment_listener [chain=%d] 获取链配置失败: %v", chainID, err)
		return fmt.Errorf("get network config: %w", err)
	}

	// 检查确认数
	latest, err := getLatestBlockNumber(ctx, svc, chainID)
	if err != nil {
		logx.Errorf("payment_listener [chain=%d] 获取最新区块失败: %v", chainID, err)
		return fmt.Errorf("get latest block: %w", err)
	}
	confirmations := latest - lg.BlockNumber + 1
	if confirmations < uint64(network.SafeConfirmations) {
		logx.Infof("payment_listener [chain=%d] 确认数不足: tx=%s current=%d required=%d",
			chainID, txHash, confirmations, network.SafeConfirmations)
		return nil
	}

	// 更新支付状态为已支付
	logx.Infof("payment_listener [chain=%d] 支付确认成功: tx=%s block=%d confirmations=%d",
		chainID, txHash, lg.BlockNumber, confirmations)

	return markPaymentPaid(ctx, svc, payment, int64(lg.BlockNumber), blockTime)
}

// decodePaymentPaidLog 解码 PaymentPaid 事件日志
func decodePaymentPaidLog(log gethtypes.Log) (*PaymentPaidEvent, error) {
	if len(log.Topics) < 4 {
		return nil, fmt.Errorf("invalid PaymentPaid event topics count: %d", len(log.Topics))
	}

	event := &PaymentPaidEvent{
		IntentIdHash: log.Topics[1].Hex(),
		OrderRefHash: log.Topics[2].Hex(),
		Payer:        common.BytesToAddress(log.Topics[3].Bytes()),
	}

	// 非 indexed 参数在 Data 中：seller(address), token(address), amount(uint256), timestamp(uint256)
	data := log.Data
	if len(data) >= 128 {
		event.Seller = common.BytesToAddress(data[12:32])
		event.Token = common.BytesToAddress(data[44:64])
		event.Amount = new(big.Int).SetBytes(data[64:96])
		event.Timestamp = new(big.Int).SetBytes(data[96:128])
	} else {
		return nil, fmt.Errorf("invalid PaymentPaid event data length: %d", len(data))
	}

	// 注意：indexed string 参数存储为 keccak256 hash，无法直接还原
	// 需要通过数据库中的 intentId 验证

	return event, nil
}

// markPaymentPaid 标记支付成功
func markPaymentPaid(ctx context.Context, svc *svc.ServiceContext, payment *model.OrderPayment, blockNumber int64, blockTime time.Time) error {
	logx.Infof("payment_listener 开始更新订单状态: orderId=%d block=%d", payment.OrderId, blockNumber)

	return svc.GormDB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		oRepo := repository.NewOrderRepository(tx)
		pRepo := repository.NewOrderPaymentRepository(tx)

		// 更新订单状态
		logx.Infof("payment_listener 更新订单状态: orderId=%d -> Paid", payment.OrderId)
		if err := oRepo.UpdateColumnsByID(ctx, payment.OrderId, map[string]interface{}{
			"order_status":        orderlogic.OrderStatusToShip,
			"order_status_desc":   orderlogic.OrderStatusDesc(orderlogic.OrderStatusToShip),
			"payment_status":      orderlogic.PaymentStatusPaid,
			"payment_status_desc": orderlogic.PaymentStatusDesc(orderlogic.PaymentStatusPaid),
		}); err != nil {
			logx.Errorf("payment_listener 更新订单状态失败: orderId=%d err=%v", payment.OrderId, err)
			return err
		}
		logx.Infof("payment_listener 订单状态更新成功: orderId=%d", payment.OrderId)

		// 更新支付记录
		logx.Infof("payment_listener 更新支付记录: orderId=%d", payment.OrderId)
		if err := pRepo.UpdateColumnsByOrderID(ctx, payment.OrderId, map[string]interface{}{
			"payment_status":      orderlogic.PaymentStatusPaid,
			"payment_status_desc": orderlogic.PaymentStatusDesc(orderlogic.PaymentStatusPaid),
			"block_number":        blockNumber,
			"confirmed_at":        blockTime,
			"paid_at":             blockTime,
		}); err != nil {
			logx.Errorf("payment_listener 更新支付记录失败: orderId=%d err=%v", payment.OrderId, err)
			return err
		}
		logx.Infof("payment_listener 支付记录更新成功: orderId=%d", payment.OrderId)

		// 从延时队列移除
		if svc.OrderDelayQueue != nil {
			order, err := oRepo.GetByID(ctx, payment.OrderId)
			if err == nil && order != nil {
				logx.Infof("payment_listener 从延时队列移除订单: orderCode=%s", order.OrderCode)
				if removeErr := svc.OrderDelayQueue.Remove(ctx, order.OrderCode); removeErr != nil {
					logx.Errorf("payment_listener 从延时队列移除订单失败: orderCode=%s err=%v", order.OrderCode, removeErr)
				} else {
					logx.Infof("payment_listener 订单已从延时队列移除: orderCode=%s", order.OrderCode)
				}
			}
		}

		if err := orderlogic.EnsurePendingLogisticsOnPaid(ctx, tx, payment.OrderId, "payment_listener"); err != nil {
			// 物流建单失败不应回滚支付入账
			logx.Errorf("payment_listener ensure logistics failed (payment kept): orderId=%d err=%v", payment.OrderId, err)
		}

		logx.Infof("payment_listener 订单支付成功: orderId=%d block=%d", payment.OrderId, blockNumber)
		return nil
	})
}

// getLatestBlockNumber 获取最新区块号
func getLatestBlockNumber(ctx context.Context, svc *svc.ServiceContext, chainID int) (uint64, error) {
	networkRepo := repository.NewChain_networkRepository(svc.GormDB)
	network, err := networkRepo.GetByChainId(ctx, chainID)
	if err != nil || network == nil {
		return 0, fmt.Errorf("network not found: %d", chainID)
	}

	rpcURL := strings.TrimSpace(network.RpcUrl)
	if rpcURL == "" {
		rpcURL = strings.TrimSpace(svc.Config.ChainMonitor.RPCURL)
	}

	client, err := ethclient.DialContext(ctx, rpcURL)
	if err != nil {
		return 0, err
	}
	defer client.Close()

	return client.BlockNumber(ctx)
}
