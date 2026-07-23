package cctp

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"net/url"
	"strings"
	"time"

	"sapphire-mall/app/internal/config"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	gethtypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

const messageTransmitterABI = `[{"inputs":[{"internalType":"bytes","name":"message","type":"bytes"},{"internalType":"bytes","name":"attestation","type":"bytes"}],"name":"receiveMessage","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]`

// Relayer CCTP attestation 轮询 + 可选 Arc mint
type Relayer struct {
	repo                  repository.CctpSwapIntentRepository
	irisBase              string
	relayerPrivateKey     string
	arcRPC                string
	arcMessageTransmitter string
	pollInterval          time.Duration
	logx.Logger
	stopCh chan struct{}
}

// NewRelayer 从 yaml Config.Cctp 构建 relayer
func NewRelayer(db *gorm.DB, cfg config.CctpConfig) *Relayer {
	irisBase := strings.TrimSpace(cfg.IrisBaseURL)
	if irisBase == "" {
		irisBase = DefaultIrisBaseURL
	}
	pollSec := cfg.PollIntervalSec
	if pollSec <= 0 {
		pollSec = 12
	}
	transmitter := strings.TrimSpace(cfg.ArcMessageTransmitter)
	if transmitter == "" {
		transmitter = ArcMessageTransmitter
	}
	return &Relayer{
		repo:                  repository.NewCctpSwapIntentRepository(db),
		irisBase:              strings.TrimRight(irisBase, "/"),
		relayerPrivateKey:     strings.TrimSpace(cfg.RelayerPrivateKey),
		arcRPC:                strings.TrimSpace(cfg.ArcRPC),
		arcMessageTransmitter: transmitter,
		pollInterval:          time.Duration(pollSec) * time.Second,
		Logger:                logx.WithContext(context.Background()),
		stopCh:                make(chan struct{}),
	}
}

// Start 后台轮询 burned / attested 意图
func (r *Relayer) Start() {
	go r.loop()
	logx.Infof("[CCTP Relayer] 已启动，Iris=%s poll=%s", r.irisBase, r.pollInterval)
	if r.relayerPrivateKey == "" {
		logx.Infof("[CCTP Relayer] 未配置 Cctp.RelayerPrivateKey，仅推进到 attested，需手动或后续配置 relayer 执行 mint")
	}
}

// Stop 停止轮询
func (r *Relayer) Stop() {
	select {
	case <-r.stopCh:
	default:
		close(r.stopCh)
	}
}

func (r *Relayer) loop() {
	ticker := time.NewTicker(r.pollInterval)
	defer ticker.Stop()
	for {
		select {
		case <-r.stopCh:
			return
		case <-ticker.C:
			r.tick(context.Background())
		}
	}
}

func (r *Relayer) tick(ctx context.Context) {
	if err := r.processBurned(ctx); err != nil {
		r.Errorf("[CCTP Relayer] process burned failed: %v", err)
	}
	if err := r.processAttested(ctx); err != nil {
		r.Errorf("[CCTP Relayer] process attested failed: %v", err)
	}
}

func (r *Relayer) processBurned(ctx context.Context) error {
	list, err := r.repo.ListPending(ctx, model.CctpStatusBurned, 20)
	if err != nil {
		return err
	}
	for _, intent := range list {
		if strings.TrimSpace(intent.BurnTxHash) == "" {
			continue
		}
		if err := r.fetchAndSaveAttestation(ctx, intent); err != nil {
			r.Errorf("[CCTP Relayer] attestation intent=%s err=%v", intent.IntentID, err)
		}
	}
	return nil
}

func (r *Relayer) processAttested(ctx context.Context) error {
	if r.relayerPrivateKey == "" || r.arcRPC == "" {
		return nil
	}

	list, err := r.repo.ListPending(ctx, model.CctpStatusAttested, 20)
	if err != nil {
		return err
	}
	for _, intent := range list {
		if strings.TrimSpace(intent.MessageBytes) == "" || strings.TrimSpace(intent.Attestation) == "" {
			continue
		}
		txHash, err := r.receiveMessageOnArc(ctx, intent)
		if err != nil {
			r.Errorf("[CCTP Relayer] mint intent=%s err=%v", intent.IntentID, err)
			continue
		}
		intent.Status = model.CctpStatusMinted
		intent.MintTxHash = txHash
		if gasFee, gerr := r.fetchTxGasFee(ctx, txHash); gerr != nil {
			r.Errorf("[CCTP Relayer] mint gas intent=%s err=%v", intent.IntentID, gerr)
		} else if gasFee != "" {
			intent.MintGasFee = gasFee
		}
		if err := r.repo.Update(ctx, intent); err != nil {
			r.Errorf("[CCTP Relayer] update minted intent=%s err=%v", intent.IntentID, err)
		} else {
			r.Infof("[CCTP Relayer] minted intent=%s tx=%s", intent.IntentID, txHash)
		}
	}
	return nil
}

type irisMessagesResp struct {
	Messages []irisMessage `json:"messages"`
}

type irisMessage struct {
	Message     string `json:"message"`
	Attestation string `json:"attestation"`
	Status      string `json:"status"`
}

func (r *Relayer) fetchAndSaveAttestation(ctx context.Context, intent *model.CctpSwapIntent) error {
	endpoint := fmt.Sprintf("%s/v2/messages/%d", r.irisBase, intent.SourceDomain)
	q := url.Values{}
	q.Set("transactionHash", intent.BurnTxHash)
	reqURL := endpoint + "?" + q.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL, nil)
	if err != nil {
		return err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("iris status=%d body=%s", resp.StatusCode, string(body))
	}

	var parsed irisMessagesResp
	if err := json.Unmarshal(body, &parsed); err != nil {
		return fmt.Errorf("parse iris response: %w", err)
	}
	if len(parsed.Messages) == 0 {
		return nil
	}
	msg := parsed.Messages[0]
	attestation := strings.TrimSpace(msg.Attestation)
	message := strings.TrimSpace(msg.Message)
	// Iris 未就绪时可能返回 attestation=PENDING / message=null
	if message == "" || attestation == "" || strings.EqualFold(attestation, "PENDING") {
		r.Infof("[CCTP Relayer] attestation 未就绪 intent=%s status=%s", intent.IntentID, msg.Status)
		return nil
	}

	messageBytes, err := decodeHexBytes(message)
	if err != nil {
		return err
	}
	intent.MessageBytes = message
	intent.MessageHash = crypto.Keccak256Hash(messageBytes).Hex()
	intent.Attestation = attestation
	intent.Status = model.CctpStatusAttested
	return r.repo.Update(ctx, intent)
}

func decodeHexBytes(hexStr string) ([]byte, error) {
	s := strings.TrimPrefix(strings.TrimSpace(hexStr), "0x")
	return hex.DecodeString(s)
}

func (r *Relayer) receiveMessageOnArc(ctx context.Context, intent *model.CctpSwapIntent) (string, error) {
	messageBytes, err := decodeHexBytes(intent.MessageBytes)
	if err != nil {
		return "", err
	}
	attestationBytes, err := decodeHexBytes(intent.Attestation)
	if err != nil {
		return "", err
	}

	parsedABI, err := abi.JSON(strings.NewReader(messageTransmitterABI))
	if err != nil {
		return "", err
	}
	data, err := parsedABI.Pack("receiveMessage", messageBytes, attestationBytes)
	if err != nil {
		return "", err
	}

	client, err := ethclient.DialContext(ctx, r.arcRPC)
	if err != nil {
		return "", err
	}
	defer client.Close()

	chainID, err := client.ChainID(ctx)
	if err != nil {
		return "", err
	}
	privateKey, err := crypto.HexToECDSA(strings.TrimPrefix(r.relayerPrivateKey, "0x"))
	if err != nil {
		return "", fmt.Errorf("parse relayer private key: %w", err)
	}
	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		return "", err
	}
	auth.Context = ctx
	if err := fillTransactGas(ctx, client, auth); err != nil {
		return "", err
	}

	to := common.HexToAddress(r.arcMessageTransmitter)
	nonce, err := client.PendingNonceAt(ctx, auth.From)
	if err != nil {
		return "", err
	}

	var signedTx *gethtypes.Transaction
	if auth.GasPrice != nil {
		signedTx, err = auth.Signer(auth.From, gethtypes.NewTx(&gethtypes.LegacyTx{
			Nonce:    nonce,
			To:       &to,
			Value:    big.NewInt(0),
			Gas:      600_000,
			GasPrice: auth.GasPrice,
			Data:     data,
		}))
	} else {
		signedTx, err = auth.Signer(auth.From, gethtypes.NewTx(&gethtypes.DynamicFeeTx{
			ChainID:   chainID,
			Nonce:     nonce,
			GasTipCap: auth.GasTipCap,
			GasFeeCap: auth.GasFeeCap,
			Gas:       600_000,
			To:        &to,
			Value:     big.NewInt(0),
			Data:      data,
		}))
	}
	if err != nil {
		return "", fmt.Errorf("sign receiveMessage tx: %w", err)
	}
	if err := client.SendTransaction(ctx, signedTx); err != nil {
		return "", fmt.Errorf("send receiveMessage tx: %w", err)
	}
	return signedTx.Hash().Hex(), nil
}


// fetchTxGasFee 查询交易实际 Gas 花费（gasUsed * effectiveGasPrice）
func (r *Relayer) fetchTxGasFee(ctx context.Context, txHash string) (string, error) {
	if strings.TrimSpace(r.arcRPC) == "" || strings.TrimSpace(txHash) == "" {
		return "", nil
	}
	client, err := ethclient.DialContext(ctx, r.arcRPC)
	if err != nil {
		return "", err
	}
	defer client.Close()

	receipt, err := client.TransactionReceipt(ctx, common.HexToHash(txHash))
	if err != nil {
		return "", err
	}
	price := receipt.EffectiveGasPrice
	if price == nil {
		price = big.NewInt(0)
	}
	fee := new(big.Int).Mul(new(big.Int).SetUint64(receipt.GasUsed), price)
	return fee.String(), nil
}
// fillTransactGas 为 relayer 交易填充 gas 参数
func fillTransactGas(ctx context.Context, client *ethclient.Client, auth *bind.TransactOpts) error {
	header, err := client.HeaderByNumber(ctx, nil)
	if err != nil {
		return err
	}
	if header.BaseFee == nil {
		gasPrice, err := client.SuggestGasPrice(ctx)
		if err != nil {
			return err
		}
		auth.GasPrice = gasPrice
		return nil
	}
	tip, err := client.SuggestGasTipCap(ctx)
	if err != nil {
		return err
	}
	if tip.Sign() == 0 {
		tip = big.NewInt(1_000_000_000)
	}
	feeCap := new(big.Int).Add(new(big.Int).Mul(header.BaseFee, big.NewInt(2)), tip)
	auth.GasTipCap = tip
	auth.GasFeeCap = feeCap
	return nil
}
