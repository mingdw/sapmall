package cctp

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"math/big"
	"net/http"
	"sync"
	"time"
)

type irisFeeItem struct {
	FinalityThreshold int64   `json:"finalityThreshold"`
	MinimumFee        float64 `json:"minimumFee"` // Iris 可能返回小数 bps（如 1.3）
}

// ── Direction D: Iris fee bps 内存缓存 ──
// fee bps 极少变动（由 Circle 设定），缓存 5 分钟可避免每次 createIntent 都发 HTTP，
// 将 createIntent 延迟从 ~2.5s 降至 ~50ms（仅 DB 操作）。
const feesCacheTTL = 5 * time.Minute

type feeCacheEntry struct {
	bps    int64
	expire time.Time
}

var feesCache = struct {
	sync.RWMutex
	entries map[string]feeCacheEntry
}{
	entries: make(map[string]feeCacheEntry),
}

// FetchFastTransferFeeBps 查询 Iris sandbox Fast Transfer 最低费率（bps）
// 优先使用内存缓存（TTL 5min），缓存未命中时才发 HTTP 请求。
func FetchFastTransferFeeBps(ctx context.Context, irisBase string, sourceDomain, destDomain int) (int64, error) {
	cacheKey := fmt.Sprintf("%d-%d", sourceDomain, destDomain)

	// 先查缓存
	feesCache.RLock()
	if entry, ok := feesCache.entries[cacheKey]; ok && time.Now().Before(entry.expire) {
		feesCache.RUnlock()
		return entry.bps, nil
	}
	feesCache.RUnlock()

	// 缓存未命中，走 HTTP
	bps, err := fetchFastTransferFeeBpsFromIris(ctx, irisBase, sourceDomain, destDomain)
	if err != nil {
		return 0, err
	}

	// 写缓存（仅缓存有效值）
	if bps > 0 {
		feesCache.Lock()
		feesCache.entries[cacheKey] = feeCacheEntry{bps: bps, expire: time.Now().Add(feesCacheTTL)}
		feesCache.Unlock()
	}

	return bps, nil
}

// fetchFastTransferFeeBpsFromIris 直接向 Iris API 查询 fee bps（不经过缓存）
func fetchFastTransferFeeBpsFromIris(ctx context.Context, irisBase string, sourceDomain, destDomain int) (int64, error) {
	base := irisBase
	if base == "" {
		base = DefaultIrisBaseURL
	}
	url := fmt.Sprintf("%s/v2/burn/USDC/fees/%d/%d", stringsTrimRightSlash(base), sourceDomain, destDomain)

	// 不绑定请求 ctx：前端超时取消时仍可快速失败；整体硬限制 2.5s
	reqCtx, cancel := context.WithTimeout(context.Background(), 2500*time.Millisecond)
	defer cancel()
	_ = ctx

	req, err := http.NewRequestWithContext(reqCtx, http.MethodGet, url, nil)
	if err != nil {
		return 0, err
	}
	client := &http.Client{Timeout: 2500 * time.Millisecond}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("iris fees status=%d body=%s", resp.StatusCode, string(body))
	}
	var items []irisFeeItem
	if err := json.Unmarshal(body, &items); err != nil {
		return 0, err
	}
	pick := func(fee float64) int64 {
		if fee <= 0 {
			return 0
		}
		// 向上取整，避免 maxFee 偏低触发 insufficient_fee
		return int64(math.Ceil(fee))
	}
	for _, item := range items {
		if item.FinalityThreshold == MinFinalityThreshold {
			return pick(item.MinimumFee), nil
		}
	}
	for _, item := range items {
		if item.MinimumFee > 0 {
			return pick(item.MinimumFee), nil
		}
	}
	return 0, nil
}

func stringsTrimRightSlash(s string) string {
	for len(s) > 0 && s[len(s)-1] == '/' {
		s = s[:len(s)-1]
	}
	return s
}

// ComputeMaxFeeUSDC 按 bps 计算 maxFee（最小单位），并加 20% 缓冲。
// Circle：maxFee 过低会导致 Fast Transfer 降级/挂起（Iris delayReason=insufficient_fee）。
func ComputeMaxFeeUSDC(amountIn string, feeBps int64) string {
	amount := new(big.Int)
	if _, ok := amount.SetString(amountIn, 10); !ok || amount.Sign() <= 0 {
		return "0"
	}
	if feeBps <= 0 {
		return "0"
	}
	fee := new(big.Int).Mul(amount, big.NewInt(feeBps))
	fee.Div(fee, big.NewInt(10_000))
	buf := new(big.Int).Mul(fee, big.NewInt(20))
	buf.Div(buf, big.NewInt(100))
	fee.Add(fee, buf)
	if fee.Sign() == 0 {
		fee.SetInt64(1)
	}
	if fee.Cmp(amount) >= 0 {
		fee.Sub(amount, big.NewInt(1))
		if fee.Sign() < 0 {
			return "0"
		}
	}
	return fee.String()
}