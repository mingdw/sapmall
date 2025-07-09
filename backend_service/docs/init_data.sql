-- 1.商品目录分类表
drop table if exists `sys_category`;
CREATE TABLE `sys_category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL default '' COMMENT '编码',
    `name` VARCHAR(255) NOT NULL default '' COMMENT '名称',
    `parent_id` BIGINT NOT NULL default 0 COMMENT '父级id',
    `parent_code` VARCHAR(255) NOT NULL default '' COMMENT '父级编码',
    `level` INT NOT NULL default 0 COMMENT '级别',
    `sort` INT NOT NULL default 0 COMMENT '排序',
    `status` INT NOT NULL default 0 COMMENT '状态',
    `icon` VARCHAR(255) NOT NULL default '' COMMENT '图标',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.属性组
drop table if exists `sys_attr_group`;
CREATE TABLE `sys_attr_group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `attr_group_name` VARCHAR(255) NOT NULL default '' COMMENT '名称',
    `attr_group_code` VARCHAR(255) NOT NULL default '' COMMENT '编码',
    `type` VARCHAR(64) NOT NULL default '' COMMENT '类型',
    `status` INT NOT NULL default 0 COMMENT '状态',
    `sort` INT NOT NULL default 0 COMMENT '排序',
    `description` VARCHAR(255) NOT NULL default '' COMMENT '描述',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.属性
drop table if exists `sys_attr`;
CREATE TABLE `sys_attr` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `attr_name` VARCHAR(255) NOT NULL default '' COMMENT '名称',
    `attr_code` VARCHAR(255) NOT NULL default '' COMMENT '编码',
    `attr_group_id` BIGINT NOT NULL default 0 COMMENT '属性组id',
    `attr_group_code` VARCHAR(255) NOT NULL default '' COMMENT '属性组编码',
    `icon` VARCHAR(255) NOT NULL default '' COMMENT '图标',
    `attr_type` INT NOT NULL default 0 COMMENT '属性类型',
    `status` INT NOT NULL default 0 COMMENT '状态',
    `description` VARCHAR(255) NOT NULL default '' COMMENT '描述',
    `sort` INT NOT NULL default 0 COMMENT '排序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default ''  COMMENT '更新人',
    PRIMARY KEY (`id`),
    KEY `idx_attr_group_id` (`attr_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.目录属性组关联表
drop table if exists `sys_category_attr_group`;
CREATE TABLE `sys_category_attr_group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `category_id` BIGINT NOT NULL default 0 COMMENT '商品目录分类id',
    `category_code` VARCHAR(255) NOT NULL default '' COMMENT '商品目录分类编码',
    `attr_group_id` BIGINT NOT NULL default 0 COMMENT '属性组id',
    `attr_group_code` VARCHAR(255) NOT NULL default '' COMMENT '属性组编码',
    `status` INT NOT NULL default 0 COMMENT '状态',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_attr_group_id` (`attr_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5.商品spu
drop table if exists `sys_product_spu`;
CREATE TABLE `sys_product_spu` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL default '' COMMENT '编码',
    `name` VARCHAR(255) NOT NULL default '' COMMENT '名称',
    `category1_id` BIGINT NOT NULL default 0 COMMENT '商品目录1分类id',
    `category1_code` VARCHAR(255) NOT NULL default '' COMMENT '商品目录分类编码',
    `category2_id` BIGINT NOT NULL default 0 COMMENT '商品目录2分类id',
    `category2_code` VARCHAR(255) NOT NULL default '' COMMENT '商品目录2分类编码',
    `category3_id` BIGINT NOT NULL default 0 COMMENT '商品目录3分类id',
    `category3_code` VARCHAR(255) NOT NULL default '' COMMENT '商品目录3分类编码',
    `total_sales` INT NOT NULL default 0 COMMENT '总销量',
    `total_stock` INT NOT NULL default 0 COMMENT '总库存',
    `brand` VARCHAR(255) NOT NULL default '' COMMENT '品牌',
    `description` VARCHAR(255) NOT NULL default '' COMMENT '描述',
    `price` DECIMAL(10,2) NOT NULL default 0 COMMENT '价格',
    `real_price` DECIMAL(10,2) NOT NULL default 0 COMMENT '原价',
    `status` INT NOT NULL default 0 COMMENT '状态',
    `images` VARCHAR(1000) NOT NULL default '' COMMENT '图片',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6.商品spu详情
drop table if exists `sys_product_spu_detail`;
CREATE TABLE `sys_product_spu_detail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_spu_id` BIGINT NOT NULL default 0 COMMENT '商品spu id',
    `product_spu_code` VARCHAR(255) NOT NULL default '' COMMENT '商品spu编码',
    `detail` LONGBLOB COMMENT '详情',
    `packing_list` LONGBLOB COMMENT '包装清单',
    `after_sale` LONGBLOB COMMENT '售后服务',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`),
    KEY `idx_product_spu_id` (`product_spu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7.商品spu属性详情表
drop table if exists `sys_product_spu_attr_params`;
CREATE TABLE `sys_product_spu_attr_params` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_spu_id` BIGINT NOT NULL default 0 COMMENT '商品spu id',
    `product_spu_code` VARCHAR(255) NOT NULL default '' COMMENT '商品spu编码',
    `code` VARCHAR(255) NOT NULL default '' COMMENT '编码',
    `name` VARCHAR(255) NOT NULL default '' COMMENT '名称',
    `attr_type` INT NOT NULL default 0 COMMENT '类型：1-基本属性，2-销售属性，3-规格属性',
    `value_type` INT NOT NULL default 0 COMMENT '值类型：1-文本，2-图片，3-视频，4-音频，5-链接，6-其它',
    `value` TEXT NOT NULL  COMMENT '值',
    `sort` INT NOT NULL default 0 COMMENT '排序',
    `status` INT NOT NULL default 0 COMMENT '状态',
    `is_required` INT NOT NULL default 0 COMMENT '是否必填',
    `is_generic` INT NOT NULL default 0 COMMENT '是否通用',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`),
    KEY `idx_product_spu_id` (`product_spu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8.商品sku
drop table if exists `sys_product_sku`;
CREATE TABLE `sys_product_sku` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_spu_id` BIGINT NOT NULL default 0 COMMENT '商品spu id',
    `product_spu_code` VARCHAR(255) NOT NULL default '' COMMENT '商品spu编码',
    `sku_code` VARCHAR(255) NOT NULL default '' COMMENT 'sku编码',
    `price` DECIMAL(10,2) NOT NULL default 0 COMMENT '价格',
    `stock` INT NOT NULL default 0 COMMENT '库存',
    `sale_count` INT NOT NULL COMMENT '销量',
    `status` INT NOT NULL COMMENT '状态',
    `indexs` VARCHAR(64) NOT NULL default '' COMMENT '规格索引',
    `attr_params` TEXT  COMMENT '属性参数json',
    `owner_params` TEXT  COMMENT '属性参数json',
    `images` VARCHAR(1000) COMMENT '图片',
    `title` VARCHAR(255) COMMENT '标题',
    `sub_title` VARCHAR(255) COMMENT '副标题',
    `description` VARCHAR(255) COMMENT '描述',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`),
    KEY `idx_product_spu_id` (`product_spu_id`),
    UNIQUE KEY `uk_sku_code` (`sku_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9.订单表
drop table if exists `sys_order`;
CREATE TABLE `sys_order` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_code` VARCHAR(255) NOT NULL default '' COMMENT '订单编码',
    `user_id` BIGINT NOT NULL default 0 COMMENT '用户id',
    `user_code` VARCHAR(255) NOT NULL default '' COMMENT '用户编码',
    `order_status` INT NOT NULL default 0 COMMENT '订单状态',
    `order_status_desc` VARCHAR(255) NOT NULL default '' COMMENT '订单状态描述',
    `payment_status` INT NOT NULL default 0 COMMENT '支付状态',
    `payment_status_desc` VARCHAR(255) NOT NULL default '' COMMENT '支付状态描述',
    `order_date` DATETIME NOT NULL default CURRENT_TIMESTAMP COMMENT '订单日期',
    `order_amount` DECIMAL(10,2) NOT NULL default 0 COMMENT '订单金额',
    `order_discount` DECIMAL(10,2) NOT NULL default 0 COMMENT '订单折扣',
    `order_total` DECIMAL(10,2) NOT NULL default 0 COMMENT '订单总价',
    `order_remark` VARCHAR(255) NOT NULL default '' COMMENT '订单备注',
    `order_pay_type` INT NOT NULL default 0 COMMENT '支付方式',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10.订单商品表
drop table if exists `sys_order_product`;
CREATE TABLE `sys_order_product` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL default 0 COMMENT '订单id',
    `order_code` VARCHAR(255) NOT NULL default '' COMMENT '订单编码',
    `spu_id` BIGINT NOT NULL default 0 COMMENT 'spu id',
    `spu_code` VARCHAR(255) NOT NULL default '' COMMENT 'spu编码',
    `sku_id` BIGINT NOT NULL default 0 COMMENT 'sku id',
    `sku_code` VARCHAR(255) NOT NULL default '' COMMENT 'sku编码',
    `product_name` VARCHAR(255) NOT NULL default '' COMMENT '商品名称',
    `product_price` DECIMAL(10,2) NOT NULL default 0 COMMENT '商品价格',
    `product_quantity` INT NOT NULL default 0 COMMENT '商品数量',
    `product_total` DECIMAL(10,2) NOT NULL default 0 COMMENT '商品总价',
    `product_remark` VARCHAR(255) NOT NULL default '' COMMENT '商品备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11.订单支付表
drop table if exists `sys_order_payment`;
CREATE TABLE `sys_order_payment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL default 0 COMMENT '订单id',
    `order_code` VARCHAR(255) NOT NULL default '' COMMENT '订单编码',
    `payment_type` INT NOT NULL default 0 COMMENT '支付方式',
    `payment_type_desc` VARCHAR(255) NOT NULL default '' COMMENT '支付方式描述',
    `payment_amount` DECIMAL(10,2) NOT NULL default 0 COMMENT '支付金额',
    `payment_time` DATETIME COMMENT '支付时间',
    `payment_status` INT NOT NULL default 0 COMMENT '支付状态',
    `payment_status_desc` VARCHAR(255) NOT NULL default '' COMMENT '支付状态描述',
    `channel_payment_no` VARCHAR(255) NOT NULL default '' COMMENT '渠道支付单号',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12.订单配送地址
drop table if exists `sys_order_delivery_address`;
CREATE TABLE `sys_order_delivery_address` ( 
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL default 0 COMMENT '订单id',
    `order_code` VARCHAR(255) NOT NULL default '' COMMENT '订单编码',
    `user_id` BIGINT NOT NULL default 0 COMMENT '用户id',
    `user_code` VARCHAR(255) NOT NULL default '' COMMENT '用户编码',
    `receiver_name` VARCHAR(255) NOT NULL default '' COMMENT '收货人姓名',
    `receiver_phone` VARCHAR(255) NOT NULL default '' COMMENT '收货人手机号',
    `province_code` VARCHAR(255) NOT NULL default '' COMMENT '省编码',
    `province_name` VARCHAR(255) NOT NULL default '' COMMENT '省名称',
    `city_code` VARCHAR(255) NOT NULL default '' COMMENT '市编码',
    `city_name` VARCHAR(255) NOT NULL default '' COMMENT '市名称',
    `area_code` VARCHAR(255) NOT NULL default '' COMMENT '区编码',
    `area_name` VARCHAR(255) NOT NULL default '' COMMENT '区名称',
    `detail_address` VARCHAR(255) NOT NULL default '' COMMENT '详细地址',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13.订单物流表
drop table if exists `sys_order_logistics`;
CREATE TABLE `sys_order_logistics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL default 0 COMMENT '订单id',
    `order_code` VARCHAR(255) NOT NULL default '' COMMENT '订单编码',
    `logistics_company_code` VARCHAR(255) NOT NULL default '' COMMENT '物流公司编码',
    `logistics_company_name` VARCHAR(255) NOT NULL default '' COMMENT '物流公司名称',
    `logistics_no` VARCHAR(255) NOT NULL default '' COMMENT '物流单号',
    `logistics_status` INT NOT NULL default 0 COMMENT '物流状态',
    `logistics_status_desc` VARCHAR(255) NOT NULL default '' COMMENT '物流状态描述',
    `ship_time` DATETIME COMMENT '发货时间',
    `expect_delivery_time` DATETIME COMMENT '预计送达时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. 售后表
drop table if exists `sys_order_after_sale`;
CREATE TABLE `sys_order_after_sale` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL default 0 COMMENT '订单id',
    `order_code` VARCHAR(255) NOT NULL default '' COMMENT '订单编码',
    `after_sale_type` INT NOT NULL default 0 COMMENT '售后类型',
    `after_sale_type_desc` VARCHAR(255) NOT NULL default '' COMMENT '售后类型描述',
    `after_sale_status` INT NOT NULL default 0 COMMENT '售后状态',
    `after_sale_status_desc` VARCHAR(255) NOT NULL default '' COMMENT '售后状态描述',
    `apply_time` DATETIME COMMENT '申请时间',
    `reason` VARCHAR(255) NOT NULL default '' COMMENT '售后原因',
    `images` VARCHAR(1000) COMMENT '图片',
    `after_sale_remark` VARCHAR(255) NOT NULL default '' COMMENT '售后备注',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15.订单评价表
drop table if exists `sys_order_reviews`;
CREATE TABLE `sys_order_reviews` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_id` BIGINT NOT NULL default 0 COMMENT '订单id',
    `order_code` VARCHAR(255) NOT NULL default '' COMMENT '订单编码',
    `user_id` BIGINT NOT NULL default 0 COMMENT '用户id',
    `user_code` VARCHAR(255) NOT NULL default '' COMMENT '用户编码',
    `product_id` BIGINT NOT NULL default 0 COMMENT '商品id',
    `content` VARCHAR(255) NOT NULL default '' COMMENT '评价内容',
    `rating` INT NOT NULL default 0 COMMENT '评分',
    `review_time` DATETIME COMMENT '评价时间',
    `images` VARCHAR(1000) COMMENT '图片',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16.用户表
drop table if exists `sys_user`;
CREATE TABLE `sys_user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `unique_id` VARCHAR(255) NOT NULL default '' COMMENT '平台编号',
    `user_code` VARCHAR(255) NOT NULL default '' COMMENT '用户编码',
    `nickname` VARCHAR(255) NOT NULL default '' COMMENT '昵称',
    `avatar` VARCHAR(255) NOT NULL default '' COMMENT '头像',
    `gender` INT NOT NULL default 0 COMMENT '性别',
    `birthday` DATETIME COMMENT '生日',
    `email` VARCHAR(255) NOT NULL default '' COMMENT '邮箱',
    `phone` VARCHAR(255) NOT NULL default '' COMMENT '手机号',
    `password` VARCHAR(255) NOT NULL default '' COMMENT '密码',
    `status` INT NOT NULL default 0 COMMENT '状态',
    `status_desc` VARCHAR(255) NOT NULL default '' COMMENT '状态描述',
    `type` INT NOT NULL default 0 COMMENT '类型',
    `type_desc` VARCHAR(255) NOT NULL default '' COMMENT '类型描述',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 17. 用户表


-- 17.全国地址表
drop table if exists `sys_address`;
CREATE TABLE `sys_address` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL default '' COMMENT '地址编码',
    `name` VARCHAR(255) NOT NULL default '' COMMENT '地址名称',
    `parent_code` VARCHAR(255) NOT NULL default '' COMMENT '父级编码',
    `level` INT NOT NULL default 0 COMMENT '级别',
    `province_code` VARCHAR(255) NOT NULL default '' COMMENT '省编码',
    `province_name` VARCHAR(255) NOT NULL default '' COMMENT '省名称',
    `city_code` VARCHAR(255) NOT NULL default '' COMMENT '市编码',
    `city_name` VARCHAR(255) NOT NULL default '' COMMENT '市名称',
    `district_code` VARCHAR(255) NOT NULL default '' COMMENT '区编码',
    `district_name` VARCHAR(255) NOT NULL default '' COMMENT '区名称',
    `street_code` VARCHAR(255) NOT NULL default '' COMMENT '街道编码',
    `street_name` VARCHAR(255) NOT NULL default '' COMMENT '街道名称',
    `full_address` VARCHAR(255) NOT NULL default '' COMMENT '完整地址',
    `postcode` VARCHAR(255) NOT NULL default '' COMMENT '邮编',
    `sort` INT NOT NULL default 0 COMMENT '排序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 18. 用户地址表
drop table if exists `sys_user_address`;
CREATE TABLE `sys_user_address` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL default 0 COMMENT '用户id',
    `user_code` VARCHAR(255) NOT NULL default '' COMMENT '用户编码',
    `reciver_name` VARCHAR(32) NOT NULL default '' COMMENT '收货人姓名',
    `reciver_phone` VARCHAR(32) NOT NULL default '' COMMENT '收货人手机号',
    `province_code` VARCHAR(255) NOT NULL default '' COMMENT '省编码',
    `province_name` VARCHAR(255) NOT NULL default '' COMMENT '省名称',
    `city_code` VARCHAR(255) NOT NULL default '' COMMENT '市编码',
    `city_name` VARCHAR(255) NOT NULL default '' COMMENT '市名称',
    `district_code` VARCHAR(255) NOT NULL default '' COMMENT '区编码',
    `district_name` VARCHAR(255) NOT NULL default '' COMMENT '区名称',
    `street_code` VARCHAR(255) NOT NULL default '' COMMENT '街道编码',
    `street_name` VARCHAR(255) NOT NULL default '' COMMENT '街道名称',
    `house_address` VARCHAR(255) NOT NULL default '' COMMENT '门牌号',
    `full_address` VARCHAR(255) NOT NULL default '' COMMENT '完整地址',
    `is_default` INT NOT NULL default 0 COMMENT '是否默认',
    `longitude` VARCHAR(255) NOT NULL default '' COMMENT '经度',
    `latitude` VARCHAR(255) NOT NULL default '' COMMENT '纬度',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间', 
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19 角色表
drop table if exists `sys_role`;
CREATE TABLE `sys_role` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL default '' COMMENT '角色名称',
    `code` VARCHAR(255) NOT NULL default '' COMMENT '角色编码',
    `description` VARCHAR(255) NOT NULL default '' COMMENT '角色描述',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20.权限表
drop table if exists `sys_permission`;
CREATE TABLE `sys_permission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL default '' COMMENT '权限名称',
    `code` VARCHAR(255) NOT NULL default '' COMMENT '权限编码',
    `description` VARCHAR(255) NOT NULL default '' COMMENT '权限描述',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 21. 角色权限表
drop table if exists `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `role_id` BIGINT NOT NULL default 0 COMMENT '角色id',
    `role_code` VARCHAR(255) NOT NULL default '' COMMENT '角色编码',
    `permission_id` BIGINT NOT NULL default 0 COMMENT '权限id', 
    `permission_code` VARCHAR(255) NOT NULL default '' COMMENT '权限编码',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22 用户角色表
drop table if exists `sys_user_role`;
CREATE TABLE `sys_user_role` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL default 0 COMMENT '用户id',
    `user_code` VARCHAR(255) NOT NULL default '' COMMENT '用户编码',
    `role_id` BIGINT NOT NULL default 0 COMMENT '角色id',
    `role_code` VARCHAR(255) NOT NULL default '' COMMENT '角色编码',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` INT DEFAULT 0 COMMENT '是否删除',
    `creator` VARCHAR(64) NOT NULL default '' COMMENT '创建人',
    `updator` VARCHAR(64) NOT NULL default '' COMMENT '更新人', 
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;