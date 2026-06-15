-- 与 docs/sapphire_mall_schema.sql 订单/checkout 段保持一致
-- 订单主状态 order_status：10待支付 20链上确认中 30已支付 40待发货 50已发货 60已完成 70已取消 80已过期 90支付失败
-- 链上子状态 chain_status（sys_order_payment）：0未发起 1链上确认中 2链上已成功 3已关闭

DROP TABLE IF EXISTS `sys_order_promotion`;
DROP TABLE IF EXISTS `sys_order_payment`;
DROP TABLE IF EXISTS `sys_order_delivery_address`;
DROP TABLE IF EXISTS `sys_order`;

-- 详见 sapphire_mall_schema.sql 中 sys_order / sys_order_promotion / sys_order_payment 等定义
