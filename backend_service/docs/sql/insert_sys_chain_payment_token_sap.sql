-- =============================================================================
-- 为各支付链补充 SAP 平台代币（幂等，可重复执行）
-- 合约地址：Arc Testnet SAPToken 代理（0x55f95...）；未单独部署的链暂用同一地址占位
-- =============================================================================

SET NAMES utf8mb4;

-- Linea Sepolia (59141)
INSERT INTO `sys_chain_payment_token` (
  `chain_id`, `symbol`, `display_name`, `contract_address`, `decimals`, `config_key`,
  `sync_status`, `sort`, `status`, `remark`, `creator`, `updator`
)
SELECT
  59141, 'SAP', 'SAP', '0x55f95bfd9d2c7ceba63e0124471b28043813e24e', 18, 'payment.token.sap',
  0, 5, 0, 'SAP 合约暂用 Arc 地址占位，待 Linea 部署后更新', 'system', 'system'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `sys_chain_payment_token`
  WHERE `chain_id` = 59141 AND `symbol` = 'SAP' AND `is_deleted` = 0
);

-- Arc Testnet (5042002)
INSERT INTO `sys_chain_payment_token` (
  `chain_id`, `symbol`, `display_name`, `contract_address`, `decimals`, `config_key`,
  `sync_status`, `sort`, `status`, `remark`, `creator`, `updator`
)
SELECT
  5042002, 'SAP', 'SAP', '0x55f95bfd9d2c7ceba63e0124471b28043813e24e', 18, 'payment.token.sap',
  0, 5, 0, 'Arc Testnet SAPToken 代理合约', 'system', 'system'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `sys_chain_payment_token`
  WHERE `chain_id` = 5042002 AND `symbol` = 'SAP' AND `is_deleted` = 0
);

-- Base Sepolia (84532)
INSERT INTO `sys_chain_payment_token` (
  `chain_id`, `symbol`, `display_name`, `contract_address`, `decimals`, `config_key`,
  `sync_status`, `sort`, `status`, `remark`, `creator`, `updator`
)
SELECT
  84532, 'SAP', 'SAP', '0x55f95bfd9d2c7ceba63e0124471b28043813e24e', 18, 'payment.token.sap',
  0, 5, 0, 'SAP 合约暂用 Arc 地址占位，待 Base 部署后更新', 'system', 'system'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM `sys_chain_payment_token`
  WHERE `chain_id` = 84532 AND `symbol` = 'SAP' AND `is_deleted` = 0
);
