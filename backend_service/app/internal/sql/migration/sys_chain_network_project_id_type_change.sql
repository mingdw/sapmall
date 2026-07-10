-- =====================================================
-- sys_chain_network 表修改 project_id 字段类型
-- 日期: 2026-07-08
-- 说明: 将 project_id 从 bigint 改为 varchar(64)
-- =====================================================

-- 修改 project_id 字段类型
ALTER TABLE `sys_chain_network`
MODIFY COLUMN `project_id` varchar(64) NOT NULL DEFAULT '' COMMENT '项目ID，用于区分不同项目使用的链配置';

-- 验证修改结果
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'sys_chain_network'
    AND COLUMN_NAME = 'project_id';
