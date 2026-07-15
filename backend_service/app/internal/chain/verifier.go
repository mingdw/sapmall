package chain

import (
	"context"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

// PaymentPaidEvent 的 event signature
// event PaymentPaid(string indexed intentId, string indexed orderRef, address indexed payer, address seller, address token, uint256 amount, uint256 timestamp)
var paymentPaidEventSig = crypto.Keccak256Hash([]byte("PaymentPaid(string,string,address,address,address,uint256,uint256)"))

type PaymentEvent struct {
	IntentIdHash string   // keccak256 hash of intentId (indexed string stored as hash)
	OrderRefHash string   // keccak256 hash of orderRef (indexed string stored as hash)
	Payer        common.Address
	Seller       common.Address
	Token        common.Address
	Amount       *big.Int
	Timestamp    *big.Int
}

type VerifyResult struct {
	Receipt  *types.Receipt
	Event    *PaymentEvent
	GasFeeUSDC float64 // 实际 Gas 费（USDC 计价）
}

// VerifyPaymentTx 通过 RPC 查询链上交易，验证支付事件参数
func VerifyPaymentTx(ctx context.Context, rpcURL string, contractAddr string, txHash string) (*VerifyResult, error) {
	scanCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	client, err := ethclient.DialContext(scanCtx, rpcURL)
	if err != nil {
		return nil, fmt.Errorf("dial rpc: %w", err)
	}
	defer client.Close()

	hash := common.HexToHash(txHash)
	receipt, err := client.TransactionReceipt(scanCtx, hash)
	if err != nil {
		return nil, fmt.Errorf("get receipt: %w", err)
	}
	if receipt == nil {
		return nil, nil // 还在 pending
	}

	contract := common.HexToAddress(contractAddr)
	event, err := parsePaymentPaidEvent(receipt, contract)
	if err != nil {
		// 交易已上链但 revert 时不会有 PaymentPaid 事件，交由上层按 receipt.Status 标记失败
		if receipt.Status == types.ReceiptStatusFailed {
			gasFeeUSDC := calcGasFeeUSDC(receipt)
			return &VerifyResult{Receipt: receipt, Event: nil, GasFeeUSDC: gasFeeUSDC}, nil
		}
		return nil, err
	}

	gasFeeUSDC := calcGasFeeUSDC(receipt)
	if gasFeeUSDC == 0 {
		if tx, _, txErr := client.TransactionByHash(scanCtx, hash); txErr == nil && tx != nil {
			gasPrice := tx.GasPrice()
			if gasPrice != nil && gasPrice.Sign() > 0 {
				gasFeeUSDC = calcGasFeeFromUsedAndPrice(receipt.GasUsed, gasPrice)
			}
		}
	}

	return &VerifyResult{
		Receipt:    receipt,
		Event:      event,
		GasFeeUSDC: gasFeeUSDC,
	}, nil
}

// parsePaymentPaidEvent 从交易回执中解析 PaymentPaid 事件
func parsePaymentPaidEvent(receipt *types.Receipt, contractAddr common.Address) (*PaymentEvent, error) {
	if receipt.Status != types.ReceiptStatusFailed {
		// 即使 status=1 也要检查事件
	}

	for _, log := range receipt.Logs {
		if log.Address != contractAddr {
			continue
		}
		if len(log.Topics) == 0 || log.Topics[0] != paymentPaidEventSig {
			continue
		}
		return decodePaymentPaidLog(log)
	}
	return nil, fmt.Errorf("PaymentPaid event not found in tx logs")
}

// decodePaymentPaidLog 解码 PaymentPaid 事件日志
func decodePaymentPaidLog(log *types.Log) (*PaymentEvent, error) {
	if len(log.Topics) < 4 {
		return nil, fmt.Errorf("invalid PaymentPaid event topics")
	}

	event := &PaymentEvent{
		IntentIdHash: log.Topics[1].Hex(),
		OrderRefHash: log.Topics[2].Hex(),
		Payer:        common.BytesToAddress(log.Topics[3].Bytes()),
	}

	// 非 indexed 参数在 Data 中：seller(address), token(address), amount(uint256), timestamp(uint256)
	if len(log.Data) >= 128 {
		event.Seller = common.BytesToAddress(log.Data[12:32])
		event.Token = common.BytesToAddress(log.Data[44:64])
		event.Amount = new(big.Int).SetBytes(log.Data[64:96])
		event.Timestamp = new(big.Int).SetBytes(log.Data[96:128])
	} else {
		return nil, fmt.Errorf("invalid PaymentPaid event data length: %d", len(log.Data))
	}

	return event, nil
}

// calcGasFeeUSDC 从交易回执计算 Gas 费（USDC 计价）
// Arc 使用 USDC 作为原生 gas token（18 decimals），EIP-1559 定价模型
func calcGasFeeUSDC(receipt *types.Receipt) float64 {
	if receipt == nil {
		return 0
	}

	if receipt.EffectiveGasPrice != nil && receipt.EffectiveGasPrice.Sign() > 0 {
		return calcGasFeeFromUsedAndPrice(receipt.GasUsed, receipt.EffectiveGasPrice)
	}
	return 0
}

func calcGasFeeFromUsedAndPrice(gasUsed uint64, gasPrice *big.Int) float64 {
	if gasPrice == nil || gasPrice.Sign() == 0 || gasUsed == 0 {
		return 0
	}

	totalGasFee := new(big.Int).Mul(new(big.Int).SetUint64(gasUsed), gasPrice)

	// 转换为 USDC：除以 10^18
	decimalFactor := new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil)
	usdcFloat := new(big.Float).Quo(
		new(big.Float).SetInt(totalGasFee),
		new(big.Float).SetInt(decimalFactor),
	)

	result, _ := usdcFloat.Float64()
	return result
}

// VerifyPaymentParams 验证事件参数是否与订单匹配
func VerifyPaymentParams(event *PaymentEvent, expectedIntentId string, expectedOrderCode string, expectedAmount string, expectedToken string, expectedPayer string, expectedSeller string) error {
	if event == nil {
		return fmt.Errorf("event is nil")
	}

	// indexed string 在 EVM 中存储为 keccak256 哈希，需要比较哈希值
	expectedIntentIdHash := crypto.Keccak256Hash([]byte(expectedIntentId)).Hex()
	if !strings.EqualFold(event.IntentIdHash, expectedIntentIdHash) {
		return fmt.Errorf("intentId mismatch: got hash %s, want hash %s (expected %s)", event.IntentIdHash, expectedIntentIdHash, expectedIntentId)
	}

	expectedOrderCodeHash := crypto.Keccak256Hash([]byte(expectedOrderCode)).Hex()
	if !strings.EqualFold(event.OrderRefHash, expectedOrderCodeHash) {
		return fmt.Errorf("orderCode mismatch: got hash %s, want hash %s (expected %s)", event.OrderRefHash, expectedOrderCodeHash, expectedOrderCode)
	}

	eventAmount := event.Amount.String()
	if eventAmount != expectedAmount {
		return fmt.Errorf("amount mismatch: got %s, want %s", eventAmount, expectedAmount)
	}

	eventToken := event.Token.Hex()
	if !strings.EqualFold(eventToken, expectedToken) {
		return fmt.Errorf("token mismatch: got %s, want %s", eventToken, expectedToken)
	}

	if expectedPayer != "" {
		eventPayer := event.Payer.Hex()
		if !strings.EqualFold(eventPayer, expectedPayer) {
			return fmt.Errorf("payer mismatch: got %s, want %s", eventPayer, expectedPayer)
		}
	}

	if expectedSeller != "" {
		eventSeller := event.Seller.Hex()
		if !strings.EqualFold(eventSeller, expectedSeller) {
			return fmt.Errorf("seller mismatch: got %s, want %s", eventSeller, expectedSeller)
		}
	}

	return nil
}

// GetLatestBlockNumber 获取链上最新区块号
func GetLatestBlockNumber(ctx context.Context, rpcURL string) (uint64, error) {
	scanCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	client, err := ethclient.DialContext(scanCtx, rpcURL)
	if err != nil {
		return 0, fmt.Errorf("dial rpc: %w", err)
	}
	defer client.Close()

	return client.BlockNumber(scanCtx)
}

// FilterLogs 查询指定合约的事件日志
func FilterLogs(ctx context.Context, rpcURL string, contractAddr common.Address, fromBlock, toBlock uint64) ([]types.Log, error) {
	scanCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	client, err := ethclient.DialContext(scanCtx, rpcURL)
	if err != nil {
		return nil, fmt.Errorf("dial rpc: %w", err)
	}
	defer client.Close()

	return client.FilterLogs(scanCtx, ethereum.FilterQuery{
		FromBlock: new(big.Int).SetUint64(fromBlock),
		ToBlock:   new(big.Int).SetUint64(toBlock),
		Addresses: []common.Address{contractAddr},
	})
}
