package listener

import (
	"context"
	"errors"
	"strconv"
	"strings"

	consts "sapphire-mall/app/internal/const"
	"sapphire-mall/app/internal/repository"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

// resolveChainMonitorStartBlock 解析链监听起始区块：优先使用 sys_config，其次 yaml。
// 仅在 listener 启动时调用一次即可；修改库表后需重启进程生效。
func resolveChainMonitorStartBlock(ctx context.Context, db *gorm.DB, yamlStart uint64) uint64 {
	if db == nil {
		return yamlStart
	}
	repo := repository.NewConfigRepository(db)
	row, err := repo.GetByConfigKey(ctx, consts.SYS_CONFIG_KEY_CHAIN_LISTENER_START_BLOCK)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return yamlStart
		}
		logx.Errorf("[chain-listener] read sys_config %s failed: %v, using yaml StartBlock=%d",
			consts.SYS_CONFIG_KEY_CHAIN_LISTENER_START_BLOCK, err, yamlStart)
		return yamlStart
	}
	if row == nil {
		return yamlStart
	}
	v := strings.TrimSpace(row.ConfigValue)
	if v == "" {
		return yamlStart
	}
	parsed, perr := strconv.ParseUint(v, 10, 64)
	if perr != nil {
		logx.Errorf("[chain-listener] invalid sys_config %s=%q: %v, using yaml StartBlock=%d",
			consts.SYS_CONFIG_KEY_CHAIN_LISTENER_START_BLOCK, v, perr, yamlStart)
		return yamlStart
	}
	if parsed != yamlStart {
		logx.Infof("[chain-listener] start block from sys_config %s=%d (yaml StartBlock=%d)",
			consts.SYS_CONFIG_KEY_CHAIN_LISTENER_START_BLOCK, parsed, yamlStart)
	}
	return parsed
}
