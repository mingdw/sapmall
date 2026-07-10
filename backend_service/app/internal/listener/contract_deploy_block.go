package listener

import (
	"fmt"
	"math/big"
	"strings"
)

// ValidateStartBlock 校验起始区块是否有效
// 如果 startBlock 为 0，返回错误提示需要人工配置
func ValidateStartBlock(listenerName string, startBlock int64, contractAddr string) error {
	if startBlock > 0 {
		return nil
	}

	return fmt.Errorf(
		"%s: 起始区块未配置（start_block=0），请通过区块链浏览器查询合约 %s 的部署区块，然后在管理后台配置起始区块",
		listenerName,
		contractAddr,
	)
}

// ParseBlockNumber 解析区块号字符串
func ParseBlockNumber(s string) int64 {
	s = strings.TrimSpace(s)
	if s == "" {
		return 0
	}
	n := new(big.Int)
	_, ok := n.SetString(s, 10)
	if !ok {
		return 0
	}
	return n.Int64()
}
