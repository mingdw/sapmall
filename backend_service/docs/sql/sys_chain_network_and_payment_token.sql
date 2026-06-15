-- =============================================================================
-- 链网络配置 + 链上支付币种
-- 用途：
--   sys_chain_network        — 多链 RPC、平台合约地址、监听游标、签名密钥引用
--   sys_chain_payment_token  — 每条链支持的支付代币，同步至 PlatformConfig 白名单
-- Icon 暂不入库，由前端按 chainId / symbol 映射。
-- =============================================================================

SET NAMES utf8mb4;

-- ----------------------------
-- Table structure for sys_chain_network
-- ----------------------------
DROP TABLE IF EXISTS `sys_chain_payment_token`;
DROP TABLE IF EXISTS `sys_chain_network`;

CREATE TABLE `sys_chain_network` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',

  `chain_id` int NOT NULL COMMENT 'EIP-155 链 ID，如 59141(Linea Sepolia)、5042002(Arc Testnet)',
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '内部编码：linea_sepolia、arc_testnet',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '展示名称',
  `rpc_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'JSON-RPC 地址（可含 Infura 等项目路径）',
  `ws_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'WebSocket RPC，可选',
  `explorer_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '区块浏览器根 URL，如 https://testnet.arcscan.app',

  `native_symbol` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ETH' COMMENT '原生 gas 代币符号（Arc 为 USDC）',

  `platform_config_address` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'PlatformConfig 代理合约地址',
  `payment_router_address` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'PaymentRouter 代理合约地址',
  `settlement_vault_address` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'SettlementVault 合约地址',

  `signer_key_ref` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '链上写操作私钥引用（环境变量名/KMS 键，禁止存明文私钥）',

  `listener_enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用链上事件监听 0:否 1:是',
  `listener_start_block` bigint NOT NULL DEFAULT 0 COMMENT '监听起始区块高度',
  `listener_last_block` bigint NOT NULL DEFAULT 0 COMMENT '监听已处理区块游标',

  `sort` int NOT NULL DEFAULT 0 COMMENT '排序（越小越靠前，与前端导航下拉顺序一致）',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 0:启用(可切换/支付) 1:禁用(仅展示，对应前端 switchable:false)',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',

  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除 0:未删除 1:已删除',
  `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',

  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_chain_id` (`chain_id`) USING BTREE,
  UNIQUE INDEX `uk_code` (`code`) USING BTREE,
  INDEX `idx_status` (`status`) USING BTREE,
  INDEX `idx_sort` (`sort`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '区块链网络配置表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for sys_chain_payment_token
-- ----------------------------
CREATE TABLE `sys_chain_payment_token` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',

  `chain_id` int NOT NULL COMMENT '所属链 ID，关联 sys_chain_network.chain_id',
  `symbol` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '代币符号：USDC、EURC、cirBTC、SAP',
  `display_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '展示名称，空则使用 symbol',
  `contract_address` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'ERC-20 合约地址（小写存储推荐）',
  `decimals` int NOT NULL DEFAULT 6 COMMENT '代币精度',
  `config_key` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'PlatformConfig 配置键，如 payment.token.usdc',

  `sync_status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '链上同步状态 0:待同步 1:同步中 2:已同步 3:失败',
  `last_sync_tx_hash` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '最近一次同步交易哈希',
  `last_sync_at` datetime NULL DEFAULT NULL COMMENT '最近一次同步时间',
  `sync_error` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '同步失败原因',

  `sort` int NOT NULL DEFAULT 0 COMMENT '排序（越小越靠前）',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态 0:启用 1:禁用',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '备注',

  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除 0:未删除 1:已删除',
  `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
  `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',

  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_chain_symbol` (`chain_id`, `symbol`) USING BTREE,
  UNIQUE INDEX `uk_chain_contract` (`chain_id`, `contract_address`) USING BTREE,
  INDEX `idx_chain_id` (`chain_id`) USING BTREE,
  INDEX `idx_sync_status` (`sync_status`) USING BTREE,
  INDEX `idx_status` (`status`) USING BTREE,
  INDEX `idx_sort` (`sort`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '链上支付代币配置表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- 初始数据：与前端 walletUiNetworks.ts 导航下拉一致
--   switchable: true  → status=0（启用，可切换 / 支付链）
--   switchable: false → status=1（禁用，仅展示不可选）
-- 支付代币仅配置 status=0 的三条支付链（Linea Sepolia / Arc Testnet / Base Sepolia）
-- ----------------------------
INSERT INTO `sys_chain_network` (
  `chain_id`, `code`, `name`, `rpc_url`, `explorer_url`, `native_symbol`,
  `platform_config_address`, `payment_router_address`, `settlement_vault_address`,
  `signer_key_ref`, `listener_enabled`, `sort`, `status`, `remark`, `creator`, `updator`
) VALUES
-- switchable: true（status=0）
(
  59141, 'linea_sepolia', 'Linea Sepolia', 'https://rpc.sepolia.linea.build', 'https://sepolia.lineascan.build', 'ETH',
  '0x54d25b938b0dca958928295231f716694c4d80a2', '', '',
  'CHAIN_SIGNER_LINEA_SEPOLIA', 1, 10, 0, 'wallet_ui:switchable', 'system', 'system'
),
(
  5042002, 'arc_testnet', 'Arc Testnet', 'https://rpc.testnet.arc.network', 'https://testnet.arcscan.app', 'USDC',
  '', '', '',
  'CHAIN_SIGNER_ARC_TESTNET', 1, 20, 0, 'wallet_ui:switchable', 'system', 'system'
),
(
  84532, 'base_sepolia', 'Base Sepolia', 'https://sepolia.base.org', 'https://sepolia.basescan.org', 'ETH',
  '', '', '',
  'CHAIN_SIGNER_BASE_SEPOLIA', 1, 30, 0, 'wallet_ui:switchable', 'system', 'system'
),
-- switchable: false（status=1，仅展示）
(
  1, 'ethereum', 'Ethereum', '', 'https://etherscan.io', 'ETH',
  '', '', '', '', 0, 40, 1, 'wallet_ui:display_only', 'system', 'system'
),
(
  8453, 'base', 'Base', '', 'https://basescan.org', 'ETH',
  '', '', '', '', 0, 50, 1, 'wallet_ui:display_only', 'system', 'system'
),
(
  11155111, 'sepolia', 'Sepolia', '', 'https://sepolia.etherscan.io', 'ETH',
  '', '', '', '', 0, 60, 1, 'wallet_ui:display_only', 'system', 'system'
),
(
  5, 'goerli', 'Goerli', '', 'https://goerli.etherscan.io', 'ETH',
  '', '', '', '', 0, 70, 1, 'wallet_ui:display_only', 'system', 'system'
),
(
  17000, 'holesky', 'Holesky', '', 'https://holesky.etherscan.io', 'ETH',
  '', '', '', '', 0, 80, 1, 'wallet_ui:display_only', 'system', 'system'
),
(
  56, 'bsc', 'BSC', '', 'https://bscscan.com', 'BNB',
  '', '', '', '', 0, 90, 1, 'wallet_ui:display_only', 'system', 'system'
),
(
  137, 'polygon', 'Polygon', '', 'https://polygonscan.com', 'MATIC',
  '', '', '', '', 0, 100, 1, 'wallet_ui:display_only', 'system', 'system'
);

INSERT INTO `sys_chain_payment_token` (
  `chain_id`, `symbol`, `display_name`, `contract_address`, `decimals`, `config_key`,
  `sync_status`, `sort`, `status`, `creator`, `updator`
) VALUES
-- Linea Sepolia（支付链）
(59141, 'USDC', 'USDC', '0xfece4462d57bd51a6a552365a011b95f0e16d9b7', 6, 'payment.token.usdc', 0, 10, 0, 'system', 'system'),
-- Arc Testnet（支付链）
(5042002, 'USDC', 'USDC', '0x3600000000000000000000000000000000000000', 6, 'payment.token.usdc', 0, 10, 0, 'system', 'system'),
(5042002, 'EURC', 'EURC', '0x89b50855aa3be2f677cd6303cec089b5f319d72a', 6, 'payment.token.eurc', 0, 20, 0, 'system', 'system'),
(5042002, 'cirBTC', 'cirBTC', '0xf0c4a4ce82a5746abaad9425360ab04fbba432bf', 8, 'payment.token.cirbtc', 0, 30, 0, 'system', 'system'),
-- Base Sepolia（支付链）
(84532, 'USDC', 'USDC', '0x036cbd53842c542663c028d8e0b8708ff7dd4b7', 6, 'payment.token.usdc', 0, 10, 0, 'system', 'system');
