/*
  SapMall 标签体系设计
  ─────────────────────────────────────────────────────────────────
  目标：统一 DAO / 商品 / 帮助 / 文件 等模块的标签，拆分为：
    1. sys_system_tag   — 系统标签（平台定义、规则驱动、影响排序/展示/权限）
    2. sys_business_tag — 业务标签（运营预置或用户/商家可选、多选扩展）
    3. sys_tag_binding  — 标签与业务实体的多对多关联（必需配套表）

  scope 域（entity_type / scope 共用同一套编码）：
    dao_proposal      治理提案
    dao_discussion    DAO 讨论帖
    dao_event         DAO 活动（若未来从 category 迁移为 tag）
    product_spu       商品 SPU
    help_article      帮助文章
    sys_file          系统文件

  与现有前端常量映射见文件末尾 COMMENT 区块。
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ────────────────────────────────────────────────────────────────
-- 1. 系统标签表
-- ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `sys_system_tag`;
CREATE TABLE `sys_system_tag` (
  `id`            bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `code`          varchar(64)  NOT NULL DEFAULT '' COMMENT '标签编码（scope 内唯一，稳定标识）',
  `scope`         varchar(64)  NOT NULL DEFAULT '' COMMENT '适用域：dao_proposal/dao_discussion/product_spu/help_article/sys_file',
  `name`          varchar(100) NOT NULL DEFAULT '' COMMENT '默认展示名（无 i18n 时 fallback）',
  `i18n_key`      varchar(128) NOT NULL DEFAULT '' COMMENT 'i18n 键，如 dao.topicTags.pinned',
  `tag_group`     varchar(32)  NOT NULL DEFAULT '' COMMENT '分组：moderation/badge/status/sort/meta',
  `apply_mode`    tinyint      NOT NULL DEFAULT 0 COMMENT '挂载方式：0=人工 1=规则自动 2=系统内置不可手动',
  `rule_config`   json         NULL COMMENT '自动打标规则 JSON（销量阈值、发布时间等）',
  `style_token`   varchar(64)  NOT NULL DEFAULT '' COMMENT '前端样式 token，如 topicTagGovernance',
  `icon`          varchar(64)  NOT NULL DEFAULT '' COMMENT '图标名或 URL',
  `sort_weight`   int          NOT NULL DEFAULT 0 COMMENT '排序权重（越小越靠前，用于列表加权）',
  `max_per_entity` int  NOT NULL DEFAULT 1 COMMENT '单实体最多挂载数（角标类通常为 1）',
  `status`        tinyint      NOT NULL DEFAULT 1 COMMENT '0=禁用 1=启用',
  `is_visible`    tinyint      NOT NULL DEFAULT 1 COMMENT '0=仅后台/规则可见 1=前台展示',
  `description`   varchar(255) NOT NULL DEFAULT '' COMMENT '说明',
  `metadata`      json         NULL COMMENT '扩展元数据',
  `created_at`    datetime     NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    datetime     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`    int          NULL DEFAULT 0 COMMENT '0=未删除 1=已删除',
  `creator`       varchar(64)  NOT NULL DEFAULT '' COMMENT '创建人',
  `updator`       varchar(64)  NOT NULL DEFAULT '' COMMENT '更新人',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scope_code` (`scope`, `code`) USING BTREE,
  INDEX `idx_scope_status` (`scope`, `status`, `is_deleted`) USING BTREE,
  INDEX `idx_tag_group` (`tag_group`) USING BTREE,
  INDEX `idx_sort_weight` (`sort_weight`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '系统标签表' ROW_FORMAT = DYNAMIC;


-- ────────────────────────────────────────────────────────────────
-- 2. 业务标签表
-- ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `sys_business_tag`;
CREATE TABLE `sys_business_tag` (
  `id`                   bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `code`                 varchar(64)  NOT NULL DEFAULT '' COMMENT '标签编码',
  `scope`                varchar(64)  NOT NULL DEFAULT '' COMMENT '适用域，同 sys_system_tag.scope',
  `name`                 varchar(100) NOT NULL DEFAULT '' COMMENT '默认展示名',
  `i18n_key`             varchar(128) NOT NULL DEFAULT '' COMMENT 'i18n 键；用户自建标签可为空',
  `owner_type`           varchar(32)  NOT NULL DEFAULT 'platform' COMMENT '归属：platform/user/merchant',
  `owner_id`             bigint       NOT NULL DEFAULT 0 COMMENT '归属 ID，platform 预置时为 0',
  `style_token`          varchar(64)  NOT NULL DEFAULT '' COMMENT '前端样式 token',
  `icon`                 varchar(64)  NOT NULL DEFAULT '' COMMENT '图标',
  `sort`                 int          NOT NULL DEFAULT 0 COMMENT '展示排序',
  `status`               tinyint      NOT NULL DEFAULT 1 COMMENT '0=禁用 1=启用 2=待审核（用户自建）',
  `is_user_selectable`   tinyint      NOT NULL DEFAULT 1 COMMENT '0=仅运营后台 1=用户/商家表单可选',
  `max_select_per_entity`int  NOT NULL DEFAULT 0 COMMENT '单实体最多可选数，0=不限制',
  `usage_count`          bigint       NOT NULL DEFAULT 0 COMMENT '引用次数（冗余，异步维护）',
  `description`          varchar(255) NOT NULL DEFAULT '' COMMENT '说明',
  `metadata`             json         NULL COMMENT '扩展元数据',
  `created_at`           datetime     NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`           datetime     NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`           int          NULL DEFAULT 0 COMMENT '0=未删除 1=已删除',
  `creator`              varchar(64)  NOT NULL DEFAULT '' COMMENT '创建人',
  `updator`              varchar(64)  NOT NULL DEFAULT '' COMMENT '更新人',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_scope_owner_code` (`scope`, `owner_type`, `owner_id`, `code`) USING BTREE,
  INDEX `idx_scope_selectable` (`scope`, `is_user_selectable`, `status`, `is_deleted`) USING BTREE,
  INDEX `idx_owner` (`owner_type`, `owner_id`) USING BTREE,
  INDEX `idx_sort` (`sort`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '业务标签表' ROW_FORMAT = DYNAMIC;


-- ────────────────────────────────────────────────────────────────
-- 3. 标签关联表（实体 ↔ 标签，必需）
-- ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `sys_tag_binding`;
CREATE TABLE `sys_tag_binding` (
  `id`          bigint      NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tag_kind`    tinyint     NOT NULL DEFAULT 1 COMMENT '1=系统标签 2=业务标签',
  `tag_id`      bigint      NOT NULL DEFAULT 0 COMMENT 'sys_system_tag.id 或 sys_business_tag.id',
  `entity_type` varchar(64) NOT NULL DEFAULT '' COMMENT '实体类型，与 scope 对齐',
  `entity_id`   bigint      NOT NULL DEFAULT 0 COMMENT '实体主键 ID',
  `source`      varchar(32) NOT NULL DEFAULT 'manual' COMMENT '来源：manual/auto/import/migration',
  `sort`        int         NOT NULL DEFAULT 0 COMMENT '实体上的展示顺序',
  `expires_at`  datetime    NULL DEFAULT NULL COMMENT '过期时间（限时营销标签等）',
  `created_at`  datetime    NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `creator`     varchar(64) NOT NULL DEFAULT '' COMMENT '创建人/打标人',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_entity_tag` (`tag_kind`, `tag_id`, `entity_type`, `entity_id`) USING BTREE,
  INDEX `idx_entity` (`entity_type`, `entity_id`) USING BTREE,
  INDEX `idx_tag` (`tag_kind`, `tag_id`) USING BTREE,
  INDEX `idx_expires` (`expires_at`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '标签与业务实体关联表' ROW_FORMAT = DYNAMIC;


SET FOREIGN_KEY_CHECKS = 1;


-- ════════════════════════════════════════════════════════════════
-- 种子数据（与当前前端 Mock 对齐）
-- ════════════════════════════════════════════════════════════════

-- ── 系统标签：DAO 讨论（版主/规则向） ──
INSERT INTO `sys_system_tag`
  (`code`, `scope`, `name`, `i18n_key`, `tag_group`, `apply_mode`, `style_token`, `sort_weight`, `max_per_entity`, `is_visible`, `description`)
VALUES
  ('pinned',        'dao_discussion', '置顶',   'dao.topicTags.pinned',        'moderation', 2, 'topicTagPinned',        1, 1, 1, '版主置顶，用户不可自选'),
  ('urgent',        'dao_discussion', '紧急',   'dao.topicTags.urgent',        'moderation', 0, 'topicTagUrgent',        3, 1, 1, '版主标记紧急'),
  ('trending_week', 'dao_discussion', '本周热', 'dao.topicTags.trendingWeek','sort',       1, 'topicTagTrendingWeek',  4, 1, 1, '规则：近 7 日互动量 Top N'),
  ('official',      'dao_discussion', '官方',   'dao.topicTags.official',      'moderation', 2, 'topicTagOfficial',      5, 1, 1, '官方账号发帖自动打标'),
  ('featured',      'dao_discussion', '精选',   'dao.topicTags.featured',    'moderation', 0, 'topicTagFeatured',      6, 1, 1, '运营精选'),
  ('new',           'dao_discussion', '新帖',   'dao.topicTags.new',         'status',     1, 'topicTagNew',           8, 1, 1, '发帖 7 天内自动打标'),
  ('resolved',      'dao_discussion', '已解决', 'dao.topicTags.resolved',    'status',     0, 'topicTagResolved',     13, 1, 1, '楼主/版主标记已解决');

-- ── 系统标签：商品角标（规则计算，前台最多展示 1 个） ──
INSERT INTO `sys_system_tag`
  (`code`, `scope`, `name`, `i18n_key`, `tag_group`, `apply_mode`, `rule_config`, `style_token`, `sort_weight`, `max_per_entity`, `description`)
VALUES
  ('sold_out', 'product_spu', '售罄',   'product.badges.soldOut',  'badge', 1, '{"stock_lte":0}',                    'badgeSoldOut',  1, 1, '库存为 0'),
  ('sale',     'product_spu', '促销',   'product.badges.sale',     'badge', 1, '{"has_promotion":true}',             'badgeSale',     2, 1, '有促销价'),
  ('limited',  'product_spu', '限量',   'product.badges.limited',  'badge', 1, '{"stock_lte":10,"stock_gt":0}',      'badgeLimited',  3, 1, '低库存'),
  ('hot',      'product_spu', '热卖',   'product.badges.hot',      'badge', 1, '{"sales_gte":100}',                  'badgeHot',      4, 1, '销量阈值'),
  ('new',      'product_spu', '新品',   'product.badges.new',      'badge', 1, '{"status":2,"published_days_lte":30}','badgeNew',     5, 1, '上架 30 天内'),
  ('featured', 'product_spu', '精品',   'product.badges.featured', 'badge', 0, NULL,                                 'badgeFeatured', 6, 1, '运营手动精品');

-- ── 业务标签：DAO 提案（用户多选，当前 7 类） ──
INSERT INTO `sys_business_tag`
  (`code`, `scope`, `name`, `i18n_key`, `owner_type`, `style_token`, `sort`, `is_user_selectable`, `max_select_per_entity`)
VALUES
  ('governance', 'dao_proposal', '治理',   'dao.list.proposals.tags.governance',  'platform', 'topicTagGovernance',  1, 1, 5),
  ('treasury',   'dao_proposal', '金库',   'dao.list.proposals.tags.treasury',    'platform', 'topicTagTreasury',    2, 1, 5),
  ('marketplace','dao_proposal', '商城',   'dao.list.proposals.tags.marketplace', 'platform', 'topicTagMarketplace', 3, 1, 5),
  ('staking',    'dao_proposal', '质押',   'dao.list.proposals.tags.staking',     'platform', 'topicTagStaking',     4, 1, 5),
  ('grant',      'dao_proposal', 'Grant',  'dao.list.proposals.tags.grant',       'platform', 'topicTagGrant',       5, 1, 5),
  ('multisig',   'dao_proposal', '多签',   'dao.list.proposals.tags.multisig',    'platform', 'topicTagMultisig',    6, 1, 5),
  ('security',   'dao_proposal', '安全',   'dao.list.proposals.tags.security',    'platform', 'topicTagSecurity',    7, 1, 5);

-- ── 业务标签：DAO 讨论（用户发帖可选，最多 3 个） ──
INSERT INTO `sys_business_tag`
  (`code`, `scope`, `name`, `i18n_key`, `owner_type`, `style_token`, `sort`, `is_user_selectable`, `max_select_per_entity`)
VALUES
  ('hot',        'dao_discussion', '热门',   'dao.topicTags.hot',        'platform', 'topicTagHot',        1, 1, 3),
  ('governance', 'dao_discussion', '治理',   'dao.topicTags.governance', 'platform', 'topicTagGovernance', 2, 1, 3),
  ('poll',       'dao_discussion', '投票',   'dao.topicTags.poll',       'platform', 'topicTagPoll',       3, 1, 3),
  ('bounty',     'dao_discussion', '悬赏',   'dao.topicTags.bounty',     'platform', 'topicTagBounty',     4, 1, 3),
  ('qa',         'dao_discussion', '问答',   'dao.topicTags.qa',         'platform', 'topicTagQa',         5, 1, 3),
  ('feedback',   'dao_discussion', '反馈',   'dao.topicTags.feedback',   'platform', 'topicTagFeedback',   6, 1, 3);

-- ── 业务标签：商品营销（运营配置，可与系统角标并存） ──
INSERT INTO `sys_business_tag`
  (`code`, `scope`, `name`, `i18n_key`, `owner_type`, `style_token`, `sort`, `is_user_selectable`, `max_select_per_entity`)
VALUES
  ('flash_sale',  'product_spu', '限时优惠', 'product.marketing.flashSale',  'platform', 'marketingFlashSale',  1, 0, 3),
  ('premium',     'product_spu', '精品推荐', 'product.marketing.premium',    'platform', 'marketingPremium',    2, 0, 3),
  ('chain_goods', 'product_spu', '链上商品', 'product.marketing.chainGoods', 'platform', 'marketingChain',      3, 0, 3);

-- ── 业务标签：帮助文章（检索用） ──
INSERT INTO `sys_business_tag`
  (`code`, `scope`, `name`, `i18n_key`, `owner_type`, `sort`, `is_user_selectable`)
VALUES
  ('flow',     'help_article', '流程', 'help.tags.flow',     'platform', 1, 0),
  ('wallet',   'help_article', '钱包', 'help.tags.wallet',   'platform', 2, 0),
  ('security', 'help_article', '安全', 'help.tags.security', 'platform', 3, 0);


/*
  ── 设计说明 ──────────────────────────────────────────────────

  【系统标签 vs 业务标签】

  | 维度         | sys_system_tag              | sys_business_tag                |
  |--------------|-----------------------------|---------------------------------|
  | 定义方       | 平台                        | 平台预置 + 用户/商家扩展        |
  | 典型用途     | 置顶/官方/角标/自动状态     | 话题分类/提案类型/营销文案      |
  | 是否多选     | 通常单值或互斥（角标）      | 多选（提案≤5、讨论≤3）          |
  | 打标方式     | 规则引擎 / 版主 / 系统      | 用户表单 / 运营后台             |
  | 能否用户创建 | 否                          | 可选（owner_type=user/merchant）|

  【查询示例】

  -- 某讨论帖的全部标签（系统 + 业务）
  SELECT b.entity_id, b.tag_kind, b.sort,
         COALESCE(st.code, bt.code) AS tag_code,
         COALESCE(st.i18n_key, bt.i18n_key) AS i18n_key,
         COALESCE(st.style_token, bt.style_token) AS style_token
  FROM sys_tag_binding b
  LEFT JOIN sys_system_tag st ON b.tag_kind = 1 AND b.tag_id = st.id
  LEFT JOIN sys_business_tag bt ON b.tag_kind = 2 AND b.tag_id = bt.id
  WHERE b.entity_type = 'dao_discussion' AND b.entity_id = ?
  ORDER BY b.sort, COALESCE(st.sort_weight, bt.sort);

  -- 用户发帖可选的业务标签
  SELECT * FROM sys_business_tag
  WHERE scope = 'dao_discussion'
    AND is_user_selectable = 1 AND status = 1 AND is_deleted = 0
  ORDER BY sort;

  【与现有代码映射】

  | 现有前端                          | 新表归属        | code              |
  |-----------------------------------|-----------------|-------------------|
  | DAO_PROPOSAL_TAG_KEYS (7)         | business        | governance 等     |
  | discussionCreateTags (6)          | business        | hot, poll 等      |
  | pinned/official/new/resolved (7)| system          | 同名              |
  | generateProductBadges             | system (badge)  | hot/limited/new…  |
  | marketingTags.mock                | business        | flash_sale 等     |
  | help tagKeys                      | business        | flow/wallet…      |
  | sys_file.tags (CSV)               | 迁移至 binding  | 需清洗为 code     |

  【API 建议】

  GET  /api/tags/system?scope=dao_discussion     — 后台/规则用
  GET  /api/tags/business?scope=dao_proposal&selectable=1  — 发帖表单
  PUT  /api/{entityType}/{id}/tags               — 批量更新业务标签
  POST /api/admin/tags/system/{id}/bind          — 版主打系统标签

  【注意】
  - DAO API 当前 proposal_type 为单字符串，与 tagKeys[] 不一致；
    建议：proposal_type 保留主分类，tagKeys 走 sys_tag_binding。
  - 商品 status=1 是「待审核」不是「新品」，新品角标应对 status=2 + 时间规则。
  - sys_file.tags  varchar 字段可在迁移后废弃，改查 sys_tag_binding。
*/
