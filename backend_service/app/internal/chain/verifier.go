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
// event PaymentPaid(string indexed intentId, string indexed orderRef, address indexed payer, address token, uint256 amount, uint256 timestamp)
var paymentPaidEventSig = crypto.Keccak256Hash([]byte("PaymentPaid(string,string,address,address,uint256,uint256)"))

type PaymentEvent struct {
	IntentId  string
	OrderRef  string
	Payer     common.Address
	Token     common.Address
	Amount    *big.Int
	Timestamp *big.Int
}

type VerifyResult struct {
	Receipt *types.Receipt
	Event   *PaymentEvent
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
		return nil, err
	}

	return &VerifyResult{
		Receipt: receipt,
		Event:   event,
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
		IntentId: string(log.Topics[1].Bytes()),
		Payer:    common.BytesToAddress(log.Topics[3].Bytes()),
	}

	// orderRef 是 indexed string，存储在 Topics[2]
	event.OrderRef = string(log.Topics[2].Bytes())

	// 非 indexed 参数在 Data 中：token(address), amount(uint256), timestamp(uint256)
	// 每个参数 32 字节
	if len(log.Data) >= 96 {
		event.Token = common.BytesToAddress(log.Data[12:32]) // address 左对齐，取后 20 字节
		event.Amount = new(big.Int).SetBytes(log.Data[32:64])
		event.Timestamp = new(big.Int).SetBytes(log.Data[64:96])
	} else if len(log.Data) >= 64 {
		event.Token = common.BytesToAddress(log.Data[12:32])
		event.Amount = new(big.Int).SetBytes(log.Data[32:64])
	} else {
		return nil, fmt.Errorf("invalid PaymentPaid event data length: %d", len(log.Data))
	}

	return event, nil
}

// VerifyPaymentParams 验证事件参数是否与订单匹配
func VerifyPaymentParams(event *PaymentEvent, expectedIntentId string, expectedOrderCode string, expectedAmount string, expectedToken string, expectedPayer string) error {
	if event == nil {
		return fmt.Errorf("event is nil")
	}

	// 去除 indexed string 的尾部零字节
	eventIntentId := strings.TrimRight(string(event.IntentId), "\x00")
	eventOrderRef := strings.TrimRight(string(event.OrderRef), "\x00")

	if eventIntentId != expectedIntentId {
		return fmt.Errorf("intentId mismatch: got %s, want %s", eventIntentId, expectedIntentId)
	}

	if eventOrderRef != expectedOrderCode {
		return fmt.Errorf("orderCode mismatch: got %s, want %s", eventOrderRef, expectedOrderCode)
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
