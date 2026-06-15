package order

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/ethereum/go-ethereum/common"
	"github.com/google/uuid"
)

func normalizePayerAddress(addr string) (string, bool) {
	addr = strings.TrimSpace(addr)
	if !common.IsHexAddress(addr) {
		return "", false
	}
	return strings.ToLower(common.HexToAddress(addr).Hex()), true
}

func generateOrderCode() string {
	// 作为 payOrder.orderRef，须 ≤64 字节
	suffix := strings.ReplaceAll(uuid.NewString(), "-", "")
	if len(suffix) > 16 {
		suffix = suffix[:16]
	}
	return fmt.Sprintf("ORD%s", suffix)
}

func generateIntentID() string {
	return "opi_" + uuid.NewString()
}

func validateOrderCodeLength(code string) bool {
	return utf8.RuneCountInString(code) > 0 && len([]byte(code)) <= maxOrderRefBytes
}

func payAmountToAmountRaw(payAmount float64, decimals int) string {
	if decimals < 0 {
		decimals = 0
	}
	scale := math.Pow(10, float64(decimals))
	raw := int64(math.Round(payAmount * scale))
	return strconv.FormatInt(raw, 10)
}

func orderExpireAt(now time.Time, expireMins int64) time.Time {
	if expireMins <= 0 {
		expireMins = defaultExpireMins
	}
	return now.Add(time.Duration(expireMins) * time.Minute)
}

func resolveExpireMins(configMins int64) int64 {
	if configMins > 0 {
		return configMins
	}
	return defaultExpireMins
}

func hasDeliveryInput(name, phone, email string) bool {
	return strings.TrimSpace(name) != "" ||
		strings.TrimSpace(phone) != "" ||
		strings.TrimSpace(email) != ""
}
