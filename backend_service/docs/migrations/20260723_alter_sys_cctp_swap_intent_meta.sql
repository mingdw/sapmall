-- 为已存在的 sys_cctp_swap_intent 补充代币/Gas/完成时间字段（MySQL 5.7+）
-- 若列已存在会报 Duplicate column，可忽略对应语句后继续执行

ALTER TABLE `sys_cctp_swap_intent`
  ADD COLUMN `token_symbol` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USDC' COMMENT '代币符号' AFTER `dest_domain`;

ALTER TABLE `sys_cctp_swap_intent`
  ADD COLUMN `token_decimals` int(11) NOT NULL DEFAULT 6 COMMENT '代币小数精度' AFTER `token_symbol`;

ALTER TABLE `sys_cctp_swap_intent`
  ADD COLUMN `burn_gas_fee` varchar(78) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '源链 burn 实际 Gas（原生币 wei）' AFTER `burn_tx_hash`;

ALTER TABLE `sys_cctp_swap_intent`
  ADD COLUMN `mint_gas_fee` varchar(78) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '目标链 mint 实际 Gas（原生币最小单位）' AFTER `mint_tx_hash`;

ALTER TABLE `sys_cctp_swap_intent`
  ADD COLUMN `swap_gas_fee` varchar(78) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '目标链 swap 实际 Gas（原生币最小单位）' AFTER `swap_tx_hash`;

ALTER TABLE `sys_cctp_swap_intent`
  ADD COLUMN `completed_at` datetime NULL DEFAULT NULL COMMENT '交易完成时间（swapped/failed）' AFTER `error_msg`;

-- CREATE INDEX `idx_completed_at` ON `sys_cctp_swap_intent` (`completed_at`);