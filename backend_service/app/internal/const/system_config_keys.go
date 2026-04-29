package consts

// 系统参数键（sys_config.config_key）
//
// 约定：
// - 统一使用小写点分格式，便于分组管理
// - 业务侧禁止硬编码字符串，统一复用本文件常量
const (
	// 商家保证金配置
	SYS_CONFIG_KEY_MERCHANT_DEPOSIT_AMOUNT           = "merchant.deposit.amount"            // 保证金金额
	SYS_CONFIG_KEY_MERCHANT_DEPOSIT_TOKEN_SYMBOL     = "merchant.deposit.token_symbol"      // 保证金币种符号（如 USDT）
	SYS_CONFIG_KEY_MERCHANT_DEPOSIT_TOKEN_ADDRESS    = "merchant.deposit.token_address"     // 保证金币种合约地址
	SYS_CONFIG_KEY_MERCHANT_DEPOSIT_CHAIN_ID         = "merchant.deposit.chain_id"          // 保证金链ID
	SYS_CONFIG_KEY_MERCHANT_DEPOSIT_CONTRACT_ADDRESS = "merchant.deposit.contract_address"  // 保证金合约地址
	SYS_CONFIG_KEY_MERCHANT_DEPOSIT_EXPIRE_MINS      = "merchant.deposit.intent_expire_min" // 意图单过期分钟数
)

