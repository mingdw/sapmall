-- 将原 sys_order_product 商品快照字段合并进 sys_order（Phase 1 单 SKU）
-- 新库请直接使用 sapphire_mall_schema.sql；已有库执行本脚本后 DROP sys_order_product

ALTER TABLE `sys_order`
  ADD COLUMN `spu_id` bigint NOT NULL DEFAULT 0 COMMENT 'spu id' AFTER `user_code`,
  ADD COLUMN `spu_code` varchar(64) NOT NULL DEFAULT '' COMMENT 'spu编码' AFTER `spu_id`,
  ADD COLUMN `sku_id` bigint NOT NULL DEFAULT 0 COMMENT 'sku id' AFTER `spu_code`,
  ADD COLUMN `sku_code` varchar(64) NOT NULL DEFAULT '' COMMENT 'sku编码' AFTER `sku_id`,
  ADD COLUMN `product_name` varchar(255) NOT NULL DEFAULT '' COMMENT '商品名称快照' AFTER `sku_code`,
  ADD COLUMN `product_price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '商品单价快照' AFTER `product_name`,
  ADD COLUMN `product_quantity` int NOT NULL DEFAULT 0 COMMENT '购买数量' AFTER `product_price`,
  ADD COLUMN `product_total` decimal(12, 2) NOT NULL DEFAULT 0.00 COMMENT '商品行小计（单价×数量）' AFTER `product_quantity`,
  ADD COLUMN `product_remark` varchar(255) NOT NULL DEFAULT '' COMMENT '商品备注' AFTER `product_total`,
  ADD INDEX `idx_spu_id` (`spu_id`),
  ADD INDEX `idx_sku_id` (`sku_id`);

DROP TABLE IF EXISTS `sys_order_product`;
