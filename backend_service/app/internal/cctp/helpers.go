package cctp

import (
	"strings"

	"github.com/ethereum/go-ethereum/common"
)

// PadAddressToBytes32 将 EVM 地址左填充为 bytes32 hex
func PadAddressToBytes32(addr string) string {
	a := common.HexToAddress(strings.TrimSpace(addr))
	return common.BytesToHash(common.LeftPadBytes(a.Bytes(), 32)).Hex()
}
