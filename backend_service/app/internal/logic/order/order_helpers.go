package order

import (
	"crypto/rand"
	"fmt"
	"math/big"
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
	// SP + yyyymmddhhmmss + 4 位随机数；作为 payOrder.orderRef，须 ≤64 字节
	ts := time.Now().Format("20060102150405")
	n, err := rand.Int(rand.Reader, big.NewInt(10000))
	if err != nil {
		n = big.NewInt(time.Now().UnixNano() % 10000)
	}
	return fmt.Sprintf("SP%s%04d", ts, n.Int64())
}

func generateIntentID() string {
	return "opi_" + uuid.NewString()
}

func validateOrderCodeLength(code string) bool {
	return utf8.RuneCountInString(code) > 0 && len([]byte(code)) <= maxOrderRefBytes
}

func payAmountToAmountRaw(payAmount float64, decimals int) string {
	if payAmount <= 0 {
		return "0"
	}
	if decimals < 0 {
		decimals = 0
	}

	// 18 位精度代币（如 SAP）乘积会超过 int64，必须用 big.Int
	rat, ok := new(big.Rat).SetString(strconv.FormatFloat(payAmount, 'f', -1, 64))
	if !ok || rat.Sign() <= 0 {
		return "0"
	}

	scale := new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(decimals)), nil)
	scaled := new(big.Rat).Mul(rat, new(big.Rat).SetInt(scale))

	// 四舍五入到最小单位整数
	half := big.NewRat(1, 2)
	scaled.Add(scaled, half)

	rawInt := new(big.Int).Quo(scaled.Num(), scaled.Denom())
	if rawInt.Sign() <= 0 {
		return "0"
	}
	return rawInt.String()
}

func isPositiveAmountRaw(raw string) bool {
	v, ok := new(big.Int).SetString(strings.TrimSpace(raw), 10)
	return ok && v.Sign() > 0
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

func sellerCodeOrEmpty(v *string) string {
	if v == nil {
		return ""
	}
	return strings.TrimSpace(*v)
}

func derefStr(v *string) string {
	if v == nil {
		return ""
	}
	return *v
}

