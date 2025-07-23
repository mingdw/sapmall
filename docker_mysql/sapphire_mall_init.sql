-- add ddl sql
create database if not exists sapphire_mall;

use sapphire_mall;

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




-- ----------------------------
-- Table structure for sys_address
-- ----------------------------
INSERT INTO `sys_address` VALUES (1, '110000', '北京市', '0', 1, '110000', '北京市', '', '', '', '', '', '', '北京市', '100000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);

-- ----------------------------
-- Records of sys_address
-- ----------------------------
DROP TABLE IF EXISTS `sys_address`;
CREATE TABLE `sys_address`  (
                                `id` bigint NOT NULL AUTO_INCREMENT,
                                `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '地址编码',
                                `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '地址名称',
                                `parent_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '父级编码',
                                `level` int NOT NULL DEFAULT 0 COMMENT '级别',
                                `province_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '省编码',
                                `province_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '省名称',
                                `city_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '市编码',
                                `city_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '市名称',
                                `district_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '区编码',
                                `district_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '区名称',
                                `street_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '街道编码',
                                `street_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '街道名称',
                                `full_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '完整地址',
                                `postcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '邮编',
                                `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
                                `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 418 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;
INSERT INTO `sys_address` VALUES (2, '110100', '北京市', '110000', 2, '110000', '北京市', '110100', '北京市', '', '', '', '', '北京市', '100000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (3, '110101', '东城区', '110100', 3, '110000', '北京市', '110100', '北京市', '110101', '东城区', '', '', '北京市东城区', '100010', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (4, '110102', '西城区', '110100', 3, '110000', '北京市', '110100', '北京市', '110102', '西城区', '', '', '北京市西城区', '100032', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (5, '110105', '朝阳区', '110100', 3, '110000', '北京市', '110100', '北京市', '110105', '朝阳区', '', '', '北京市朝阳区', '100020', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (6, '110106', '丰台区', '110100', 3, '110000', '北京市', '110100', '北京市', '110106', '丰台区', '', '', '北京市丰台区', '100071', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (7, '110107', '石景山区', '110100', 3, '110000', '北京市', '110100', '北京市', '110107', '石景山区', '', '', '北京市石景山区', '100043', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (8, '110108', '海淀区', '110100', 3, '110000', '北京市', '110100', '北京市', '110108', '海淀区', '', '', '北京市海淀区', '100089', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (9, '110109', '门头沟区', '110100', 3, '110000', '北京市', '110100', '北京市', '110109', '门头沟区', '', '', '北京市门头沟区', '102300', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (10, '110111', '房山区', '110100', 3, '110000', '北京市', '110100', '北京市', '110111', '房山区', '', '', '北京市房山区', '102488', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (11, '110112', '通州区', '110100', 3, '110000', '北京市', '110100', '北京市', '110112', '通州区', '', '', '北京市通州区', '101100', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (12, '110113', '顺义区', '110100', 3, '110000', '北京市', '110100', '北京市', '110113', '顺义区', '', '', '北京市顺义区', '101300', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (13, '110114', '昌平区', '110100', 3, '110000', '北京市', '110100', '北京市', '110114', '昌平区', '', '', '北京市昌平区', '102200', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (14, '110115', '大兴区', '110100', 3, '110000', '北京市', '110100', '北京市', '110115', '大兴区', '', '', '北京市大兴区', '102600', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (15, '110116', '怀柔区', '110100', 3, '110000', '北京市', '110100', '北京市', '110116', '怀柔区', '', '', '北京市怀柔区', '101400', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (16, '110117', '平谷区', '110100', 3, '110000', '北京市', '110100', '北京市', '110117', '平谷区', '', '', '北京市平谷区', '101200', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (17, '110118', '密云区', '110100', 3, '110000', '北京市', '110100', '北京市', '110118', '密云区', '', '', '北京市密云区', '101500', 15, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (18, '110119', '延庆区', '110100', 3, '110000', '北京市', '110100', '北京市', '110119', '延庆区', '', '', '北京市延庆区', '102100', 16, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (19, '110105001', '朝阳门街道', '110105', 4, '110000', '北京市', '110100', '北京市', '110105', '朝阳区', '110105001', '朝阳门街道', '北京市朝阳区朝阳门街道', '100020', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (20, '110105002', '建国门外街道', '110105', 4, '110000', '北京市', '110100', '北京市', '110105', '朝阳区', '110105002', '建国门外街道', '北京市朝阳区建国门外街道', '100020', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (21, '110105003', '呼家楼街道', '110105', 4, '110000', '北京市', '110100', '北京市', '110105', '朝阳区', '110105003', '呼家楼街道', '北京市朝阳区呼家楼街道', '100020', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (22, '110105004', '三里屯街道', '110105', 4, '110000', '北京市', '110100', '北京市', '110105', '朝阳区', '110105004', '三里屯街道', '北京市朝阳区三里屯街道', '100020', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (23, '110108001', '万寿路街道', '110108', 4, '110000', '北京市', '110100', '北京市', '110108', '海淀区', '110108001', '万寿路街道', '北京市海淀区万寿路街道', '100089', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (24, '110108002', '中关村街道', '110108', 4, '110000', '北京市', '110100', '北京市', '110108', '海淀区', '110108002', '中关村街道', '北京市海淀区中关村街道', '100089', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (25, '110108003', '海淀街道', '110108', 4, '110000', '北京市', '110100', '北京市', '110108', '海淀区', '110108003', '海淀街道', '北京市海淀区海淀街道', '100089', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (26, '110108004', '清华园街道', '110108', 4, '110000', '北京市', '110100', '北京市', '110108', '海淀区', '110108004', '清华园街道', '北京市海淀区清华园街道', '100089', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (27, '310000', '上海市', '0', 1, '310000', '上海市', '', '', '', '', '', '', '上海市', '200000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (28, '310100', '上海市', '310000', 2, '310000', '上海市', '310100', '上海市', '', '', '', '', '上海市', '200000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (29, '310101', '黄浦区', '310100', 3, '310000', '上海市', '310100', '上海市', '310101', '黄浦区', '', '', '上海市黄浦区', '200001', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (30, '310104', '徐汇区', '310100', 3, '310000', '上海市', '310100', '上海市', '310104', '徐汇区', '', '', '上海市徐汇区', '200030', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (31, '310105', '长宁区', '310100', 3, '310000', '上海市', '310100', '上海市', '310105', '长宁区', '', '', '上海市长宁区', '200050', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (32, '310106', '静安区', '310100', 3, '310000', '上海市', '310100', '上海市', '310106', '静安区', '', '', '上海市静安区', '200040', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (33, '310107', '普陀区', '310100', 3, '310000', '上海市', '310100', '上海市', '310107', '普陀区', '', '', '上海市普陀区', '200333', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (34, '310109', '虹口区', '310100', 3, '310000', '上海市', '310100', '上海市', '310109', '虹口区', '', '', '上海市虹口区', '200086', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (35, '310110', '杨浦区', '310100', 3, '310000', '上海市', '310100', '上海市', '310110', '杨浦区', '', '', '上海市杨浦区', '200082', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (36, '310112', '闵行区', '310100', 3, '310000', '上海市', '310100', '上海市', '310112', '闵行区', '', '', '上海市闵行区', '201100', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (37, '310113', '宝山区', '310100', 3, '310000', '上海市', '310100', '上海市', '310113', '宝山区', '', '', '上海市宝山区', '201900', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (38, '310114', '嘉定区', '310100', 3, '310000', '上海市', '310100', '上海市', '310114', '嘉定区', '', '', '上海市嘉定区', '201800', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (39, '310115', '浦东新区', '310100', 3, '310000', '上海市', '310100', '上海市', '310115', '浦东新区', '', '', '上海市浦东新区', '200120', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (40, '310116', '金山区', '310100', 3, '310000', '上海市', '310100', '上海市', '310116', '金山区', '', '', '上海市金山区', '200540', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (41, '310117', '松江区', '310100', 3, '310000', '上海市', '310100', '上海市', '310117', '松江区', '', '', '上海市松江区', '201600', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (42, '310118', '青浦区', '310100', 3, '310000', '上海市', '310100', '上海市', '310118', '青浦区', '', '', '上海市青浦区', '201700', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (43, '310120', '奉贤区', '310100', 3, '310000', '上海市', '310100', '上海市', '310120', '奉贤区', '', '', '上海市奉贤区', '201400', 15, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (44, '310151', '崇明区', '310100', 3, '310000', '上海市', '310100', '上海市', '310151', '崇明区', '', '', '上海市崇明区', '202150', 16, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (45, '120000', '天津市', '0', 1, '120000', '天津市', '', '', '', '', '', '', '天津市', '300000', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (46, '120100', '天津市', '120000', 2, '120000', '天津市', '120100', '天津市', '', '', '', '', '天津市', '300000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (47, '120101', '和平区', '120100', 3, '120000', '天津市', '120100', '天津市', '120101', '和平区', '', '', '天津市和平区', '300041', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (48, '120102', '河东区', '120100', 3, '120000', '天津市', '120100', '天津市', '120102', '河东区', '', '', '天津市河东区', '300171', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (49, '120103', '河西区', '120100', 3, '120000', '天津市', '120100', '天津市', '120103', '河西区', '', '', '天津市河西区', '300202', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (50, '120104', '南开区', '120100', 3, '120000', '天津市', '120100', '天津市', '120104', '南开区', '', '', '天津市南开区', '300100', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (51, '120105', '河北区', '120100', 3, '120000', '天津市', '120100', '天津市', '120105', '河北区', '', '', '天津市河北区', '300143', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (52, '120106', '红桥区', '120100', 3, '120000', '天津市', '120100', '天津市', '120106', '红桥区', '', '', '天津市红桥区', '300131', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (53, '120110', '东丽区', '120100', 3, '120000', '天津市', '120100', '天津市', '120110', '东丽区', '', '', '天津市东丽区', '300300', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (54, '120111', '西青区', '120100', 3, '120000', '天津市', '120100', '天津市', '120111', '西青区', '', '', '天津市西青区', '300380', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (55, '120112', '津南区', '120100', 3, '120000', '天津市', '120100', '天津市', '120112', '津南区', '', '', '天津市津南区', '300350', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (56, '120113', '北辰区', '120100', 3, '120000', '天津市', '120100', '天津市', '120113', '北辰区', '', '', '天津市北辰区', '300400', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (57, '120114', '武清区', '120100', 3, '120000', '天津市', '120100', '天津市', '120114', '武清区', '', '', '天津市武清区', '301700', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (58, '120115', '宝坻区', '120100', 3, '120000', '天津市', '120100', '天津市', '120115', '宝坻区', '', '', '天津市宝坻区', '301800', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (59, '120116', '滨海新区', '120100', 3, '120000', '天津市', '120100', '天津市', '120116', '滨海新区', '', '', '天津市滨海新区', '300450', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (60, '120117', '宁河区', '120100', 3, '120000', '天津市', '120100', '天津市', '120117', '宁河区', '', '', '天津市宁河区', '301500', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (61, '120118', '静海区', '120100', 3, '120000', '天津市', '120100', '天津市', '120118', '静海区', '', '', '天津市静海区', '301600', 15, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (62, '120119', '蓟州区', '120100', 3, '120000', '天津市', '120100', '天津市', '120119', '蓟州区', '', '', '天津市蓟州区', '301900', 16, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (63, '120101001', '劝业场街道', '120101', 4, '120000', '天津市', '120100', '天津市', '120101', '和平区', '120101001', '劝业场街道', '天津市和平区劝业场街道', '300041', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (64, '120101002', '小白楼街道', '120101', 4, '120000', '天津市', '120100', '天津市', '120101', '和平区', '120101002', '小白楼街道', '天津市和平区小白楼街道', '300041', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (65, '120101003', '新兴街道', '120101', 4, '120000', '天津市', '120100', '天津市', '120101', '和平区', '120101003', '新兴街道', '天津市和平区新兴街道', '300041', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (66, '120101004', '五大道街道', '120101', 4, '120000', '天津市', '120100', '天津市', '120101', '和平区', '120101004', '五大道街道', '天津市和平区五大道街道', '300041', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (67, '500000', '重庆市', '0', 1, '500000', '重庆市', '', '', '', '', '', '', '重庆市', '400000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (68, '500100', '重庆市', '500000', 2, '500000', '重庆市', '500100', '重庆市', '', '', '', '', '重庆市', '400000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (69, '500101', '万州区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500101', '万州区', '', '', '重庆市万州区', '404000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (70, '500102', '涪陵区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500102', '涪陵区', '', '', '重庆市涪陵区', '408000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (71, '500103', '渝中区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500103', '渝中区', '', '', '重庆市渝中区', '400010', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (72, '500104', '大渡口区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500104', '大渡口区', '', '', '重庆市大渡口区', '400080', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (73, '500105', '江北区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500105', '江北区', '', '', '重庆市江北区', '400020', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (74, '500106', '沙坪坝区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500106', '沙坪坝区', '', '', '重庆市沙坪坝区', '400030', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (75, '500107', '九龙坡区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500107', '九龙坡区', '', '', '重庆市九龙坡区', '400050', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (76, '500108', '南岸区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500108', '南岸区', '', '', '重庆市南岸区', '400064', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (77, '500109', '北碚区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500109', '北碚区', '', '', '重庆市北碚区', '400700', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (78, '500110', '綦江区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500110', '綦江区', '', '', '重庆市綦江区', '401420', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (79, '500111', '大足区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500111', '大足区', '', '', '重庆市大足区', '402360', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (80, '500112', '渝北区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500112', '渝北区', '', '', '重庆市渝北区', '401120', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (81, '500113', '巴南区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500113', '巴南区', '', '', '重庆市巴南区', '401320', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (82, '500114', '黔江区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500114', '黔江区', '', '', '重庆市黔江区', '409700', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (83, '500115', '长寿区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500115', '长寿区', '', '', '重庆市长寿区', '401220', 15, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (84, '500116', '江津区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500116', '江津区', '', '', '重庆市江津区', '402260', 16, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (85, '500117', '合川区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500117', '合川区', '', '', '重庆市合川区', '401520', 17, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (86, '500118', '永川区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500118', '永川区', '', '', '重庆市永川区', '402160', 18, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (87, '500119', '南川区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500119', '南川区', '', '', '重庆市南川区', '408400', 19, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (88, '500120', '璧山区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500120', '璧山区', '', '', '重庆市璧山区', '402760', 20, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (89, '500151', '铜梁区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500151', '铜梁区', '', '', '重庆市铜梁区', '402560', 21, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (90, '500152', '潼南区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500152', '潼南区', '', '', '重庆市潼南区', '402660', 22, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (91, '500153', '荣昌区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500153', '荣昌区', '', '', '重庆市荣昌区', '402460', 23, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (92, '500154', '开州区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500154', '开州区', '', '', '重庆市开州区', '405400', 24, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (93, '500155', '梁平区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500155', '梁平区', '', '', '重庆市梁平区', '405200', 25, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (94, '500156', '武隆区', '500100', 3, '500000', '重庆市', '500100', '重庆市', '500156', '武隆区', '', '', '重庆市武隆区', '408500', 26, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (95, '500103001', '解放碑街道', '500103', 4, '500000', '重庆市', '500100', '重庆市', '500103', '渝中区', '500103001', '解放碑街道', '重庆市渝中区解放碑街道', '400010', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (96, '500103002', '南纪门街道', '500103', 4, '500000', '重庆市', '500100', '重庆市', '500103', '渝中区', '500103002', '南纪门街道', '重庆市渝中区南纪门街道', '400010', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (97, '500103003', '七星岗街道', '500103', 4, '500000', '重庆市', '500100', '重庆市', '500103', '渝中区', '500103003', '七星岗街道', '重庆市渝中区七星岗街道', '400010', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (98, '500103004', '大坪街道', '500103', 4, '500000', '重庆市', '500100', '重庆市', '500103', '渝中区', '500103004', '大坪街道', '重庆市渝中区大坪街道', '400010', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (99, '320000', '江苏省', '0', 1, '320000', '江苏省', '', '', '', '', '', '', '江苏省', '', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (100, '320100', '南京市', '320000', 2, '320000', '江苏省', '320100', '南京市', '', '', '', '', '江苏省南京市', '210008', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (101, '320200', '无锡市', '320000', 2, '320000', '江苏省', '320200', '无锡市', '', '', '', '', '江苏省无锡市', '214000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (102, '320300', '徐州市', '320000', 2, '320000', '江苏省', '320300', '徐州市', '', '', '', '', '江苏省徐州市', '221000', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (103, '320400', '常州市', '320000', 2, '320000', '江苏省', '320400', '常州市', '', '', '', '', '江苏省常州市', '213000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (104, '320500', '苏州市', '320000', 2, '320000', '江苏省', '320500', '苏州市', '', '', '', '', '江苏省苏州市', '215000', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (105, '320600', '南通市', '320000', 2, '320000', '江苏省', '320600', '南通市', '', '', '', '', '江苏省南通市', '226000', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (106, '320700', '连云港市', '320000', 2, '320000', '江苏省', '320700', '连云港市', '', '', '', '', '江苏省连云港市', '222000', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (107, '320800', '淮安市', '320000', 2, '320000', '江苏省', '320800', '淮安市', '', '', '', '', '江苏省淮安市', '223001', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (108, '320900', '盐城市', '320000', 2, '320000', '江苏省', '320900', '盐城市', '', '', '', '', '江苏省盐城市', '224000', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (109, '321000', '扬州市', '320000', 2, '320000', '江苏省', '321000', '扬州市', '', '', '', '', '江苏省扬州市', '225000', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (110, '321100', '镇江市', '320000', 2, '320000', '江苏省', '321100', '镇江市', '', '', '', '', '江苏省镇江市', '212000', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (111, '321200', '泰州市', '320000', 2, '320000', '江苏省', '321200', '泰州市', '', '', '', '', '江苏省泰州市', '225300', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (112, '321300', '宿迁市', '320000', 2, '320000', '江苏省', '321300', '宿迁市', '', '', '', '', '江苏省宿迁市', '223800', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (113, '330000', '浙江省', '0', 1, '330000', '浙江省', '', '', '', '', '', '', '浙江省', '', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (114, '330100', '杭州市', '330000', 2, '330000', '浙江省', '330100', '杭州市', '', '', '', '', '浙江省杭州市', '310000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (115, '330200', '宁波市', '330000', 2, '330000', '浙江省', '330200', '宁波市', '', '', '', '', '浙江省宁波市', '315000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (116, '330300', '温州市', '330000', 2, '330000', '浙江省', '330300', '温州市', '', '', '', '', '浙江省温州市', '325000', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (117, '330400', '嘉兴市', '330000', 2, '330000', '浙江省', '330400', '嘉兴市', '', '', '', '', '浙江省嘉兴市', '314000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (118, '330500', '湖州市', '330000', 2, '330000', '浙江省', '330500', '湖州市', '', '', '', '', '浙江省湖州市', '313000', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (119, '330600', '绍兴市', '330000', 2, '330000', '浙江省', '330600', '绍兴市', '', '', '', '', '浙江省绍兴市', '312000', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (120, '330700', '金华市', '330000', 2, '330000', '浙江省', '330700', '金华市', '', '', '', '', '浙江省金华市', '321000', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (121, '330800', '衢州市', '330000', 2, '330000', '浙江省', '330800', '衢州市', '', '', '', '', '浙江省衢州市', '324000', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (122, '330900', '舟山市', '330000', 2, '330000', '浙江省', '330900', '舟山市', '', '', '', '', '浙江省舟山市', '316000', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (123, '331000', '台州市', '330000', 2, '330000', '浙江省', '331000', '台州市', '', '', '', '', '浙江省台州市', '318000', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (124, '331100', '丽水市', '330000', 2, '330000', '浙江省', '331100', '丽水市', '', '', '', '', '浙江省丽水市', '323000', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (125, '340000', '安徽省', '0', 1, '340000', '安徽省', '', '', '', '', '', '', '安徽省', '', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (126, '340100', '合肥市', '340000', 2, '340000', '安徽省', '340100', '合肥市', '', '', '', '', '安徽省合肥市', '230000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (127, '340200', '芜湖市', '340000', 2, '340000', '安徽省', '340200', '芜湖市', '', '', '', '', '安徽省芜湖市', '241000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (128, '340300', '蚌埠市', '340000', 2, '340000', '安徽省', '340300', '蚌埠市', '', '', '', '', '安徽省蚌埠市', '233000', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (129, '340400', '淮南市', '340000', 2, '340000', '安徽省', '340400', '淮南市', '', '', '', '', '安徽省淮南市', '232000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (130, '340500', '马鞍山市', '340000', 2, '340000', '安徽省', '340500', '马鞍山市', '', '', '', '', '安徽省马鞍山市', '243000', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (131, '340600', '淮北市', '340000', 2, '340000', '安徽省', '340600', '淮北市', '', '', '', '', '安徽省淮北市', '235000', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (132, '340700', '铜陵市', '340000', 2, '340000', '安徽省', '340700', '铜陵市', '', '', '', '', '安徽省铜陵市', '244000', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (133, '340800', '安庆市', '340000', 2, '340000', '安徽省', '340800', '安庆市', '', '', '', '', '安徽省安庆市', '246000', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (134, '341000', '黄山市', '340000', 2, '340000', '安徽省', '341000', '黄山市', '', '', '', '', '安徽省黄山市', '245000', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (135, '341100', '滁州市', '340000', 2, '340000', '安徽省', '341100', '滁州市', '', '', '', '', '安徽省滁州市', '239000', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (136, '341200', '阜阳市', '340000', 2, '340000', '安徽省', '341200', '阜阳市', '', '', '', '', '安徽省阜阳市', '236000', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (137, '341300', '宿州市', '340000', 2, '340000', '安徽省', '341300', '宿州市', '', '', '', '', '安徽省宿州市', '234000', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (138, '341500', '六安市', '340000', 2, '340000', '安徽省', '341500', '六安市', '', '', '', '', '安徽省六安市', '237000', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (139, '341600', '亳州市', '340000', 2, '340000', '安徽省', '341600', '亳州市', '', '', '', '', '安徽省亳州市', '236800', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (140, '341700', '池州市', '340000', 2, '340000', '安徽省', '341700', '池州市', '', '', '', '', '安徽省池州市', '247100', 15, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (141, '341800', '宣城市', '340000', 2, '340000', '安徽省', '341800', '宣城市', '', '', '', '', '安徽省宣城市', '242000', 16, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (142, '350000', '福建省', '0', 1, '350000', '福建省', '', '', '', '', '', '', '福建省', '', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (143, '350100', '福州市', '350000', 2, '350000', '福建省', '350100', '福州市', '', '', '', '', '福建省福州市', '350000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (144, '350200', '厦门市', '350000', 2, '350000', '福建省', '350200', '厦门市', '', '', '', '', '福建省厦门市', '361000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (145, '350300', '莆田市', '350000', 2, '350000', '福建省', '350300', '莆田市', '', '', '', '', '福建省莆田市', '351100', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (146, '350400', '三明市', '350000', 2, '350000', '福建省', '350400', '三明市', '', '', '', '', '福建省三明市', '365000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (147, '350500', '泉州市', '350000', 2, '350000', '福建省', '350500', '泉州市', '', '', '', '', '福建省泉州市', '362000', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (148, '350600', '漳州市', '350000', 2, '350000', '福建省', '350600', '漳州市', '', '', '', '', '福建省漳州市', '363000', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (149, '350700', '南平市', '350000', 2, '350000', '福建省', '350700', '南平市', '', '', '', '', '福建省南平市', '353000', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (150, '350800', '龙岩市', '350000', 2, '350000', '福建省', '350800', '龙岩市', '', '', '', '', '福建省龙岩市', '364000', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (151, '350900', '宁德市', '350000', 2, '350000', '福建省', '350900', '宁德市', '', '', '', '', '福建省宁德市', '352100', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (152, '440000', '广东省', '0', 1, '440000', '广东省', '', '', '', '', '', '', '广东省', '', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (153, '440100', '广州市', '440000', 2, '440000', '广东省', '440100', '广州市', '', '', '', '', '广东省广州市', '510000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (154, '440200', '韶关市', '440000', 2, '440000', '广东省', '440200', '韶关市', '', '', '', '', '广东省韶关市', '512000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (155, '440300', '深圳市', '440000', 2, '440000', '广东省', '440300', '深圳市', '', '', '', '', '广东省深圳市', '518000', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (156, '440400', '珠海市', '440000', 2, '440000', '广东省', '440400', '珠海市', '', '', '', '', '广东省珠海市', '519000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (157, '440500', '汕头市', '440000', 2, '440000', '广东省', '440500', '汕头市', '', '', '', '', '广东省汕头市', '515000', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (158, '440600', '佛山市', '440000', 2, '440000', '广东省', '440600', '佛山市', '', '', '', '', '广东省佛山市', '528000', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (159, '440700', '江门市', '440000', 2, '440000', '广东省', '440700', '江门市', '', '', '', '', '广东省江门市', '529000', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (160, '440800', '湛江市', '440000', 2, '440000', '广东省', '440800', '湛江市', '', '', '', '', '广东省湛江市', '524000', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (161, '440900', '茂名市', '440000', 2, '440000', '广东省', '440900', '茂名市', '', '', '', '', '广东省茂名市', '525000', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (162, '441200', '肇庆市', '440000', 2, '440000', '广东省', '441200', '肇庆市', '', '', '', '', '广东省肇庆市', '526000', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (163, '441300', '惠州市', '440000', 2, '440000', '广东省', '441300', '惠州市', '', '', '', '', '广东省惠州市', '516000', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (164, '441400', '梅州市', '440000', 2, '440000', '广东省', '441400', '梅州市', '', '', '', '', '广东省梅州市', '514000', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (165, '441500', '汕尾市', '440000', 2, '440000', '广东省', '441500', '汕尾市', '', '', '', '', '广东省汕尾市', '516600', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (166, '441600', '河源市', '440000', 2, '440000', '广东省', '441600', '河源市', '', '', '', '', '广东省河源市', '517000', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (167, '441700', '阳江市', '440000', 2, '440000', '广东省', '441700', '阳江市', '', '', '', '', '广东省阳江市', '529500', 15, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (168, '441800', '清远市', '440000', 2, '440000', '广东省', '441800', '清远市', '', '', '', '', '广东省清远市', '511500', 16, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (169, '441900', '东莞市', '440000', 2, '440000', '广东省', '441900', '东莞市', '', '', '', '', '广东省东莞市', '523000', 17, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (170, '442000', '中山市', '440000', 2, '440000', '广东省', '442000', '中山市', '', '', '', '', '广东省中山市', '528400', 18, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (171, '445100', '潮州市', '440000', 2, '440000', '广东省', '445100', '潮州市', '', '', '', '', '广东省潮州市', '521000', 19, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (172, '445200', '揭阳市', '440000', 2, '440000', '广东省', '445200', '揭阳市', '', '', '', '', '广东省揭阳市', '522000', 20, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (173, '445300', '云浮市', '440000', 2, '440000', '广东省', '445300', '云浮市', '', '', '', '', '广东省云浮市', '527300', 21, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (174, '450000', '广西壮族自治区', '0', 1, '450000', '广西壮族自治区', '', '', '', '', '', '', '广西壮族自治区', '', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (175, '450100', '南宁市', '450000', 2, '450000', '广西壮族自治区', '450100', '南宁市', '', '', '', '', '广西壮族自治区南宁市', '530000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (176, '450200', '柳州市', '450000', 2, '450000', '广西壮族自治区', '450200', '柳州市', '', '', '', '', '广西壮族自治区柳州市', '545000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (177, '450300', '桂林市', '450000', 2, '450000', '广西壮族自治区', '450300', '桂林市', '', '', '', '', '广西壮族自治区桂林市', '541000', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (178, '450400', '梧州市', '450000', 2, '450000', '广西壮族自治区', '450400', '梧州市', '', '', '', '', '广西壮族自治区梧州市', '543000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (179, '450500', '北海市', '450000', 2, '450000', '广西壮族自治区', '450500', '北海市', '', '', '', '', '广西壮族自治区北海市', '536000', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (180, '450600', '防城港市', '450000', 2, '450000', '广西壮族自治区', '450600', '防城港市', '', '', '', '', '广西壮族自治区防城港市', '538000', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (181, '450700', '钦州市', '450000', 2, '450000', '广西壮族自治区', '450700', '钦州市', '', '', '', '', '广西壮族自治区钦州市', '535000', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (182, '450800', '贵港市', '450000', 2, '450000', '广西壮族自治区', '450800', '贵港市', '', '', '', '', '广西壮族自治区贵港市', '537100', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (183, '450900', '玉林市', '450000', 2, '450000', '广西壮族自治区', '450900', '玉林市', '', '', '', '', '广西壮族自治区玉林市', '537000', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (184, '451000', '百色市', '450000', 2, '450000', '广西壮族自治区', '451000', '百色市', '', '', '', '', '广西壮族自治区百色市', '533000', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (185, '451100', '贺州市', '450000', 2, '450000', '广西壮族自治区', '451100', '贺州市', '', '', '', '', '广西壮族自治区贺州市', '542800', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (186, '451200', '河池市', '450000', 2, '450000', '广西壮族自治区', '451200', '河池市', '', '', '', '', '广西壮族自治区河池市', '547000', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (187, '451300', '来宾市', '450000', 2, '450000', '广西壮族自治区', '451300', '来宾市', '', '', '', '', '广西壮族自治区来宾市', '546100', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (188, '451400', '崇左市', '450000', 2, '450000', '广西壮族自治区', '451400', '崇左市', '', '', '', '', '广西壮族自治区崇左市', '532200', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (189, '460000', '海南省', '0', 1, '460000', '海南省', '', '', '', '', '', '', '海南省', '', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (190, '460100', '海口市', '460000', 2, '460000', '海南省', '460100', '海口市', '', '', '', '', '海南省海口市', '570000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (191, '460200', '三亚市', '460000', 2, '460000', '海南省', '460200', '三亚市', '', '', '', '', '海南省三亚市', '572000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (192, '460300', '三沙市', '460000', 2, '460000', '海南省', '460300', '三沙市', '', '', '', '', '海南省三沙市', '573100', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (193, '460400', '儋州市', '460000', 2, '460000', '海南省', '460400', '儋州市', '', '', '', '', '海南省儋州市', '571700', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (194, '410000', '河南省', '0', 1, '410000', '河南省', '', '', '', '', '', '', '河南省', '', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (195, '410100', '郑州市', '410000', 2, '410000', '河南省', '410100', '郑州市', '', '', '', '', '河南省郑州市', '450000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (196, '410200', '开封市', '410000', 2, '410000', '河南省', '410200', '开封市', '', '', '', '', '河南省开封市', '475000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (197, '410300', '洛阳市', '410000', 2, '410000', '河南省', '410300', '洛阳市', '', '', '', '', '河南省洛阳市', '471000', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (198, '410400', '平顶山市', '410000', 2, '410000', '河南省', '410400', '平顶山市', '', '', '', '', '河南省平顶山市', '467000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (199, '410500', '安阳市', '410000', 2, '410000', '河南省', '410500', '安阳市', '', '', '', '', '河南省安阳市', '455000', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (200, '410600', '鹤壁市', '410000', 2, '410000', '河南省', '410600', '鹤壁市', '', '', '', '', '河南省鹤壁市', '458000', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (201, '410700', '新乡市', '410000', 2, '410000', '河南省', '410700', '新乡市', '', '', '', '', '河南省新乡市', '453000', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (202, '410800', '焦作市', '410000', 2, '410000', '河南省', '410800', '焦作市', '', '', '', '', '河南省焦作市', '454000', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (203, '410900', '濮阳市', '410000', 2, '410000', '河南省', '410900', '濮阳市', '', '', '', '', '河南省濮阳市', '457000', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (204, '411000', '许昌市', '410000', 2, '410000', '河南省', '411000', '许昌市', '', '', '', '', '河南省许昌市', '461000', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (205, '411100', '漯河市', '410000', 2, '410000', '河南省', '411100', '漯河市', '', '', '', '', '河南省漯河市', '462000', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (206, '411200', '三门峡市', '410000', 2, '410000', '河南省', '411200', '三门峡市', '', '', '', '', '河南省三门峡市', '472000', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (207, '411300', '南阳市', '410000', 2, '410000', '河南省', '411300', '南阳市', '', '', '', '', '河南省南阳市', '473000', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (208, '411400', '商丘市', '410000', 2, '410000', '河南省', '411400', '商丘市', '', '', '', '', '河南省商丘市', '476000', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (209, '411500', '信阳市', '410000', 2, '410000', '河南省', '411500', '信阳市', '', '', '', '', '河南省信阳市', '464000', 15, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (210, '411600', '周口市', '410000', 2, '410000', '河南省', '411600', '周口市', '', '', '', '', '河南省周口市', '466000', 16, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (211, '411700', '驻马店市', '410000', 2, '410000', '河南省', '411700', '驻马店市', '', '', '', '', '河南省驻马店市', '463000', 17, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (212, '419001', '济源市', '410000', 2, '410000', '河南省', '419001', '济源市', '', '', '', '', '河南省济源市', '454650', 18, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (213, '420000', '湖北省', '0', 1, '420000', '湖北省', '', '', '', '', '', '', '湖北省', '', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (214, '420100', '武汉市', '420000', 2, '420000', '湖北省', '420100', '武汉市', '', '', '', '', '湖北省武汉市', '430000', 1, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (215, '420200', '黄石市', '420000', 2, '420000', '湖北省', '420200', '黄石市', '', '', '', '', '湖北省黄石市', '435000', 2, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (216, '420300', '十堰市', '420000', 2, '420000', '湖北省', '420300', '十堰市', '', '', '', '', '湖北省十堰市', '442000', 3, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (217, '420500', '宜昌市', '420000', 2, '420000', '湖北省', '420500', '宜昌市', '', '', '', '', '湖北省宜昌市', '443000', 4, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (218, '420600', '襄阳市', '420000', 2, '420000', '湖北省', '420600', '襄阳市', '', '', '', '', '湖北省襄阳市', '441000', 5, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (219, '420700', '鄂州市', '420000', 2, '420000', '湖北省', '420700', '鄂州市', '', '', '', '', '湖北省鄂州市', '436000', 6, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (220, '420800', '荆门市', '420000', 2, '420000', '湖北省', '420800', '荆门市', '', '', '', '', '湖北省荆门市', '448000', 7, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (221, '420900', '孝感市', '420000', 2, '420000', '湖北省', '420900', '孝感市', '', '', '', '', '湖北省孝感市', '432100', 8, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (222, '421000', '荆州市', '420000', 2, '420000', '湖北省', '421000', '荆州市', '', '', '', '', '湖北省荆州市', '434000', 9, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (223, '421100', '黄冈市', '420000', 2, '420000', '湖北省', '421100', '黄冈市', '', '', '', '', '湖北省黄冈市', '438000', 10, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (224, '421200', '咸宁市', '420000', 2, '420000', '湖北省', '421200', '咸宁市', '', '', '', '', '湖北省咸宁市', '437000', 11, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (225, '421300', '随州市', '420000', 2, '420000', '湖北省', '421300', '随州市', '', '', '', '', '湖北省随州市', '441300', 12, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (226, '422800', '恩施土家族苗族自治州', '420000', 2, '420000', '湖北省', '422800', '恩施土家族苗族自治州', '', '', '', '', '湖北省恩施土家族苗族自治州', '445000', 13, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (227, '429004', '仙桃市', '420000', 2, '420000', '湖北省', '429004', '仙桃市', '', '', '', '', '湖北省仙桃市', '433000', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (228, '429005', '潜江市', '420000', 2, '420000', '湖北省', '429005', '潜江市', '', '', '', '', '湖北省潜江市', '433100', 15, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (229, '429006', '天门市', '420000', 2, '420000', '湖北省', '429006', '天门市', '', '', '', '', '湖北省天门市', '431700', 16, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (230, '429021', '神农架林区', '420000', 2, '420000', '湖北省', '429021', '神农架林区', '', '', '', '', '湖北省神农架林区', '442400', 17, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (231, '430000', '湖南省', '0', 1, '430000', '湖南省', '', '', '', '', '', '', '湖南省', '', 14, '2025-03-11 23:02:13', '2025-03-11 23:02:13', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (232, '430100', '长沙市', '430000', 2, '430000', '湖南省', '430100', '长沙市', '', '', '', '', '湖南省长沙市', '410000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (233, '430200', '株洲市', '430000', 2, '430000', '湖南省', '430200', '株洲市', '', '', '', '', '湖南省株洲市', '412000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (234, '430300', '湘潭市', '430000', 2, '430000', '湖南省', '430300', '湘潭市', '', '', '', '', '湖南省湘潭市', '411100', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (235, '430400', '衡阳市', '430000', 2, '430000', '湖南省', '430400', '衡阳市', '', '', '', '', '湖南省衡阳市', '421000', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (236, '430500', '邵阳市', '430000', 2, '430000', '湖南省', '430500', '邵阳市', '', '', '', '', '湖南省邵阳市', '422000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (237, '430600', '岳阳市', '430000', 2, '430000', '湖南省', '430600', '岳阳市', '', '', '', '', '湖南省岳阳市', '414000', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (238, '430700', '常德市', '430000', 2, '430000', '湖南省', '430700', '常德市', '', '', '', '', '湖南省常德市', '415000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (239, '430800', '张家界市', '430000', 2, '430000', '湖南省', '430800', '张家界市', '', '', '', '', '湖南省张家界市', '427000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (240, '430900', '益阳市', '430000', 2, '430000', '湖南省', '430900', '益阳市', '', '', '', '', '湖南省益阳市', '413000', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (241, '431000', '郴州市', '430000', 2, '430000', '湖南省', '431000', '郴州市', '', '', '', '', '湖南省郴州市', '423000', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (242, '431100', '永州市', '430000', 2, '430000', '湖南省', '431100', '永州市', '', '', '', '', '湖南省永州市', '425000', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (243, '431200', '怀化市', '430000', 2, '430000', '湖南省', '431200', '怀化市', '', '', '', '', '湖南省怀化市', '418000', 12, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (244, '431300', '娄底市', '430000', 2, '430000', '湖南省', '431300', '娄底市', '', '', '', '', '湖南省娄底市', '417000', 13, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (245, '433100', '湘西土家族苗族自治州', '430000', 2, '430000', '湖南省', '433100', '湘西土家族苗族自治州', '', '', '', '', '湖南省湘西土家族苗族自治州', '416000', 14, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (246, '140000', '山西省', '0', 1, '140000', '山西省', '', '', '', '', '', '', '山西省', '', 15, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (247, '140100', '太原市', '140000', 2, '140000', '山西省', '140100', '太原市', '', '', '', '', '山西省太原市', '030000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (248, '140200', '大同市', '140000', 2, '140000', '山西省', '140200', '大同市', '', '', '', '', '山西省大同市', '037000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (249, '140300', '阳泉市', '140000', 2, '140000', '山西省', '140300', '阳泉市', '', '', '', '', '山西省阳泉市', '045000', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (250, '140400', '长治市', '140000', 2, '140000', '山西省', '140400', '长治市', '', '', '', '', '山西省长治市', '046000', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (251, '140500', '晋城市', '140000', 2, '140000', '山西省', '140500', '晋城市', '', '', '', '', '山西省晋城市', '048000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (252, '140600', '朔州市', '140000', 2, '140000', '山西省', '140600', '朔州市', '', '', '', '', '山西省朔州市', '038500', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (253, '140700', '晋中市', '140000', 2, '140000', '山西省', '140700', '晋中市', '', '', '', '', '山西省晋中市', '030600', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (254, '140800', '运城市', '140000', 2, '140000', '山西省', '140800', '运城市', '', '', '', '', '山西省运城市', '044000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (255, '140900', '忻州市', '140000', 2, '140000', '山西省', '140900', '忻州市', '', '', '', '', '山西省忻州市', '034000', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (256, '141000', '临汾市', '140000', 2, '140000', '山西省', '141000', '临汾市', '', '', '', '', '山西省临汾市', '041000', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (257, '141100', '吕梁市', '140000', 2, '140000', '山西省', '141100', '吕梁市', '', '', '', '', '山西省吕梁市', '033000', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (258, '150000', '内蒙古自治区', '0', 1, '150000', '内蒙古自治区', '', '', '', '', '', '', '内蒙古自治区', '', 16, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (259, '150100', '呼和浩特市', '150000', 2, '150000', '内蒙古自治区', '150100', '呼和浩特市', '', '', '', '', '内蒙古自治区呼和浩特市', '010000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (260, '150200', '包头市', '150000', 2, '150000', '内蒙古自治区', '150200', '包头市', '', '', '', '', '内蒙古自治区包头市', '014000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (261, '150300', '乌海市', '150000', 2, '150000', '内蒙古自治区', '150300', '乌海市', '', '', '', '', '内蒙古自治区乌海市', '016000', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (262, '150400', '赤峰市', '150000', 2, '150000', '内蒙古自治区', '150400', '赤峰市', '', '', '', '', '内蒙古自治区赤峰市', '024000', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (263, '150500', '通辽市', '150000', 2, '150000', '内蒙古自治区', '150500', '通辽市', '', '', '', '', '内蒙古自治区通辽市', '028000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (264, '150600', '鄂尔多斯市', '150000', 2, '150000', '内蒙古自治区', '150600', '鄂尔多斯市', '', '', '', '', '内蒙古自治区鄂尔多斯市', '017000', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (265, '150700', '呼伦贝尔市', '150000', 2, '150000', '内蒙古自治区', '150700', '呼伦贝尔市', '', '', '', '', '内蒙古自治区呼伦贝尔市', '021000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (266, '150800', '巴彦淖尔市', '150000', 2, '150000', '内蒙古自治区', '150800', '巴彦淖尔市', '', '', '', '', '内蒙古自治区巴彦淖尔市', '015000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (267, '150900', '乌兰察布市', '150000', 2, '150000', '内蒙古自治区', '150900', '乌兰察布市', '', '', '', '', '内蒙古自治区乌兰察布市', '012000', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (268, '152200', '兴安盟', '150000', 2, '150000', '内蒙古自治区', '152200', '兴安盟', '', '', '', '', '内蒙古自治区兴安盟', '137400', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (269, '152500', '锡林郭勒盟', '150000', 2, '150000', '内蒙古自治区', '152500', '锡林郭勒盟', '', '', '', '', '内蒙古自治区锡林郭勒盟', '026000', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (270, '152900', '阿拉善盟', '150000', 2, '150000', '内蒙古自治区', '152900', '阿拉善盟', '', '', '', '', '内蒙古自治区阿拉善盟', '750306', 12, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (271, '130000', '河北省', '0', 1, '130000', '河北省', '', '', '', '', '', '', '河北省', '', 17, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (272, '130100', '石家庄市', '130000', 2, '130000', '河北省', '130100', '石家庄市', '', '', '', '', '河北省石家庄市', '050000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (273, '130200', '唐山市', '130000', 2, '130000', '河北省', '130200', '唐山市', '', '', '', '', '河北省唐山市', '063000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (274, '130300', '秦皇岛市', '130000', 2, '130000', '河北省', '130300', '秦皇岛市', '', '', '', '', '河北省秦皇岛市', '066000', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (275, '130400', '邯郸市', '130000', 2, '130000', '河北省', '130400', '邯郸市', '', '', '', '', '河北省邯郸市', '056000', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (276, '130500', '邢台市', '130000', 2, '130000', '河北省', '130500', '邢台市', '', '', '', '', '河北省邢台市', '054000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (277, '130600', '保定市', '130000', 2, '130000', '河北省', '130600', '保定市', '', '', '', '', '河北省保定市', '071000', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (278, '130700', '张家口市', '130000', 2, '130000', '河北省', '130700', '张家口市', '', '', '', '', '河北省张家口市', '075000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (279, '130800', '承德市', '130000', 2, '130000', '河北省', '130800', '承德市', '', '', '', '', '河北省承德市', '067000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (280, '130900', '沧州市', '130000', 2, '130000', '河北省', '130900', '沧州市', '', '', '', '', '河北省沧州市', '061000', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (281, '131000', '廊坊市', '130000', 2, '130000', '河北省', '131000', '廊坊市', '', '', '', '', '河北省廊坊市', '065000', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (282, '131100', '衡水市', '130000', 2, '130000', '河北省', '131100', '衡水市', '', '', '', '', '河北省衡水市', '053000', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (283, '210000', '辽宁省', '0', 1, '210000', '辽宁省', '', '', '', '', '', '', '辽宁省', '', 18, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (284, '210100', '沈阳市', '210000', 2, '210000', '辽宁省', '210100', '沈阳市', '', '', '', '', '辽宁省沈阳市', '110000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (285, '210200', '大连市', '210000', 2, '210000', '辽宁省', '210200', '大连市', '', '', '', '', '辽宁省大连市', '116000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (286, '210300', '鞍山市', '210000', 2, '210000', '辽宁省', '210300', '鞍山市', '', '', '', '', '辽宁省鞍山市', '114000', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (287, '210400', '抚顺市', '210000', 2, '210000', '辽宁省', '210400', '抚顺市', '', '', '', '', '辽宁省抚顺市', '113000', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (288, '210500', '本溪市', '210000', 2, '210000', '辽宁省', '210500', '本溪市', '', '', '', '', '辽宁省本溪市', '117000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (289, '210600', '丹东市', '210000', 2, '210000', '辽宁省', '210600', '丹东市', '', '', '', '', '辽宁省丹东市', '118000', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (290, '210700', '锦州市', '210000', 2, '210000', '辽宁省', '210700', '锦州市', '', '', '', '', '辽宁省锦州市', '121000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (291, '210800', '营口市', '210000', 2, '210000', '辽宁省', '210800', '营口市', '', '', '', '', '辽宁省营口市', '115000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (292, '210900', '阜新市', '210000', 2, '210000', '辽宁省', '210900', '阜新市', '', '', '', '', '辽宁省阜新市', '123000', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (293, '211000', '辽阳市', '210000', 2, '210000', '辽宁省', '211000', '辽阳市', '', '', '', '', '辽宁省辽阳市', '111000', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (294, '211100', '盘锦市', '210000', 2, '210000', '辽宁省', '211100', '盘锦市', '', '', '', '', '辽宁省盘锦市', '124000', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (295, '211200', '铁岭市', '210000', 2, '210000', '辽宁省', '211200', '铁岭市', '', '', '', '', '辽宁省铁岭市', '112000', 12, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (296, '211300', '朝阳市', '210000', 2, '210000', '辽宁省', '211300', '朝阳市', '', '', '', '', '辽宁省朝阳市', '122000', 13, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (297, '211400', '葫芦岛市', '210000', 2, '210000', '辽宁省', '211400', '葫芦岛市', '', '', '', '', '辽宁省葫芦岛市', '125000', 14, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (298, '220000', '吉林省', '0', 1, '220000', '吉林省', '', '', '', '', '', '', '吉林省', '', 19, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (299, '220100', '长春市', '220000', 2, '220000', '吉林省', '220100', '长春市', '', '', '', '', '吉林省长春市', '130000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (300, '220200', '吉林市', '220000', 2, '220000', '吉林省', '220200', '吉林市', '', '', '', '', '吉林省吉林市', '132000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (301, '220300', '四平市', '220000', 2, '220000', '吉林省', '220300', '四平市', '', '', '', '', '吉林省四平市', '136000', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (302, '220400', '辽源市', '220000', 2, '220000', '吉林省', '220400', '辽源市', '', '', '', '', '吉林省辽源市', '136200', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (303, '220500', '通化市', '220000', 2, '220000', '吉林省', '220500', '通化市', '', '', '', '', '吉林省通化市', '134000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (304, '220600', '白山市', '220000', 2, '220000', '吉林省', '220600', '白山市', '', '', '', '', '吉林省白山市', '134300', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (305, '220700', '松原市', '220000', 2, '220000', '吉林省', '220700', '松原市', '', '', '', '', '吉林省松原市', '138000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (306, '220800', '白城市', '220000', 2, '220000', '吉林省', '220800', '白城市', '', '', '', '', '吉林省白城市', '137000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (307, '222400', '延边朝鲜族自治州', '220000', 2, '220000', '吉林省', '222400', '延边朝鲜族自治州', '', '', '', '', '吉林省延边朝鲜族自治州', '133000', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (308, '230000', '黑龙江省', '0', 1, '230000', '黑龙江省', '', '', '', '', '', '', '黑龙江省', '', 20, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (309, '230100', '哈尔滨市', '230000', 2, '230000', '黑龙江省', '230100', '哈尔滨市', '', '', '', '', '黑龙江省哈尔滨市', '150000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (310, '230200', '齐齐哈尔市', '230000', 2, '230000', '黑龙江省', '230200', '齐齐哈尔市', '', '', '', '', '黑龙江省齐齐哈尔市', '161000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (311, '230300', '鸡西市', '230000', 2, '230000', '黑龙江省', '230300', '鸡西市', '', '', '', '', '黑龙江省鸡西市', '158100', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (312, '230400', '鹤岗市', '230000', 2, '230000', '黑龙江省', '230400', '鹤岗市', '', '', '', '', '黑龙江省鹤岗市', '154100', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (313, '230500', '双鸭山市', '230000', 2, '230000', '黑龙江省', '230500', '双鸭山市', '', '', '', '', '黑龙江省双鸭山市', '155100', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (314, '230600', '大庆市', '230000', 2, '230000', '黑龙江省', '230600', '大庆市', '', '', '', '', '黑龙江省大庆市', '163000', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (315, '230700', '伊春市', '230000', 2, '230000', '黑龙江省', '230700', '伊春市', '', '', '', '', '黑龙江省伊春市', '153000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (316, '230800', '佳木斯市', '230000', 2, '230000', '黑龙江省', '230800', '佳木斯市', '', '', '', '', '黑龙江省佳木斯市', '154000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (317, '230900', '七台河市', '230000', 2, '230000', '黑龙江省', '230900', '七台河市', '', '', '', '', '黑龙江省七台河市', '154600', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (318, '231000', '牡丹江市', '230000', 2, '230000', '黑龙江省', '231000', '牡丹江市', '', '', '', '', '黑龙江省牡丹江市', '157000', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (319, '231100', '黑河市', '230000', 2, '230000', '黑龙江省', '231100', '黑河市', '', '', '', '', '黑龙江省黑河市', '164300', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (320, '231200', '绥化市', '230000', 2, '230000', '黑龙江省', '231200', '绥化市', '', '', '', '', '黑龙江省绥化市', '152000', 12, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (321, '232700', '大兴安岭地区', '230000', 2, '230000', '黑龙江省', '232700', '大兴安岭地区', '', '', '', '', '黑龙江省大兴安岭地区', '165000', 13, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (322, '610000', '陕西省', '0', 1, '610000', '陕西省', '', '', '', '', '', '', '陕西省', '', 21, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (323, '610100', '西安市', '610000', 2, '610000', '陕西省', '610100', '西安市', '', '', '', '', '陕西省西安市', '710000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (324, '610200', '铜川市', '610000', 2, '610000', '陕西省', '610200', '铜川市', '', '', '', '', '陕西省铜川市', '727000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (325, '610300', '宝鸡市', '610000', 2, '610000', '陕西省', '610300', '宝鸡市', '', '', '', '', '陕西省宝鸡市', '721000', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (326, '610400', '咸阳市', '610000', 2, '610000', '陕西省', '610400', '咸阳市', '', '', '', '', '陕西省咸阳市', '712000', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (327, '610500', '渭南市', '610000', 2, '610000', '陕西省', '610500', '渭南市', '', '', '', '', '陕西省渭南市', '714000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (328, '610600', '延安市', '610000', 2, '610000', '陕西省', '610600', '延安市', '', '', '', '', '陕西省延安市', '716000', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (329, '610700', '汉中市', '610000', 2, '610000', '陕西省', '610700', '汉中市', '', '', '', '', '陕西省汉中市', '723000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (330, '610800', '榆林市', '610000', 2, '610000', '陕西省', '610800', '榆林市', '', '', '', '', '陕西省榆林市', '719000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (331, '610900', '安康市', '610000', 2, '610000', '陕西省', '610900', '安康市', '', '', '', '', '陕西省安康市', '725000', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (332, '611000', '商洛市', '610000', 2, '610000', '陕西省', '611000', '商洛市', '', '', '', '', '陕西省商洛市', '726000', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (333, '620000', '甘肃省', '0', 1, '620000', '甘肃省', '', '', '', '', '', '', '甘肃省', '', 22, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (334, '620100', '兰州市', '620000', 2, '620000', '甘肃省', '620100', '兰州市', '', '', '', '', '甘肃省兰州市', '730000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (335, '620200', '嘉峪关市', '620000', 2, '620000', '甘肃省', '620200', '嘉峪关市', '', '', '', '', '甘肃省嘉峪关市', '735100', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (336, '620300', '金昌市', '620000', 2, '620000', '甘肃省', '620300', '金昌市', '', '', '', '', '甘肃省金昌市', '737100', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (337, '620400', '白银市', '620000', 2, '620000', '甘肃省', '620400', '白银市', '', '', '', '', '甘肃省白银市', '730900', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (338, '620500', '天水市', '620000', 2, '620000', '甘肃省', '620500', '天水市', '', '', '', '', '甘肃省天水市', '741000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (339, '620600', '武威市', '620000', 2, '620000', '甘肃省', '620600', '武威市', '', '', '', '', '甘肃省武威市', '733000', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (340, '620700', '张掖市', '620000', 2, '620000', '甘肃省', '620700', '张掖市', '', '', '', '', '甘肃省张掖市', '734000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (341, '620800', '平凉市', '620000', 2, '620000', '甘肃省', '620800', '平凉市', '', '', '', '', '甘肃省平凉市', '744000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (342, '620900', '酒泉市', '620000', 2, '620000', '甘肃省', '620900', '酒泉市', '', '', '', '', '甘肃省酒泉市', '735000', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (343, '621000', '庆阳市', '620000', 2, '620000', '甘肃省', '621000', '庆阳市', '', '', '', '', '甘肃省庆阳市', '745000', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (344, '621100', '定西市', '620000', 2, '620000', '甘肃省', '621100', '定西市', '', '', '', '', '甘肃省定西市', '743000', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (345, '621200', '陇南市', '620000', 2, '620000', '甘肃省', '621200', '陇南市', '', '', '', '', '甘肃省陇南市', '746000', 12, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (346, '622900', '临夏回族自治州', '620000', 2, '620000', '甘肃省', '622900', '临夏回族自治州', '', '', '', '', '甘肃省临夏回族自治州', '731100', 13, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (347, '623000', '甘南藏族自治州', '620000', 2, '620000', '甘肃省', '623000', '甘南藏族自治州', '', '', '', '', '甘肃省甘南藏族自治州', '747000', 14, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (348, '630000', '青海省', '0', 1, '630000', '青海省', '', '', '', '', '', '', '青海省', '', 23, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (349, '630100', '西宁市', '630000', 2, '630000', '青海省', '630100', '西宁市', '', '', '', '', '青海省西宁市', '810000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (350, '630200', '海东市', '630000', 2, '630000', '青海省', '630200', '海东市', '', '', '', '', '青海省海东市', '810600', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (351, '632200', '海北藏族自治州', '630000', 2, '630000', '青海省', '632200', '海北藏族自治州', '', '', '', '', '青海省海北藏族自治州', '812200', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (352, '632300', '黄南藏族自治州', '630000', 2, '630000', '青海省', '632300', '黄南藏族自治州', '', '', '', '', '青海省黄南藏族自治州', '811300', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (353, '632500', '海南藏族自治州', '630000', 2, '630000', '青海省', '632500', '海南藏族自治州', '', '', '', '', '青海省海南藏族自治州', '813000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (354, '632600', '果洛藏族自治州', '630000', 2, '630000', '青海省', '632600', '果洛藏族自治州', '', '', '', '', '青海省果洛藏族自治州', '814000', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (355, '632700', '玉树藏族自治州', '630000', 2, '630000', '青海省', '632700', '玉树藏族自治州', '', '', '', '', '青海省玉树藏族自治州', '815000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (356, '632800', '海西蒙古族藏族自治州', '630000', 2, '630000', '青海省', '632800', '海西蒙古族藏族自治州', '', '', '', '', '青海省海西蒙古族藏族自治州', '817000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (357, '640000', '宁夏回族自治区', '0', 1, '640000', '宁夏回族自治区', '', '', '', '', '', '', '宁夏回族自治区', '', 24, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (358, '640100', '银川市', '640000', 2, '640000', '宁夏回族自治区', '640100', '银川市', '', '', '', '', '宁夏回族自治区银川市', '750000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (359, '640200', '石嘴山市', '640000', 2, '640000', '宁夏回族自治区', '640200', '石嘴山市', '', '', '', '', '宁夏回族自治区石嘴山市', '753000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (360, '640300', '吴忠市', '640000', 2, '640000', '宁夏回族自治区', '640300', '吴忠市', '', '', '', '', '宁夏回族自治区吴忠市', '751100', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (361, '640400', '固原市', '640000', 2, '640000', '宁夏回族自治区', '640400', '固原市', '', '', '', '', '宁夏回族自治区固原市', '756000', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (362, '640500', '中卫市', '640000', 2, '640000', '宁夏回族自治区', '640500', '中卫市', '', '', '', '', '宁夏回族自治区中卫市', '755000', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (363, '650000', '新疆维吾尔自治区', '0', 1, '650000', '新疆维吾尔自治区', '', '', '', '', '', '', '新疆维吾尔自治区', '', 25, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (364, '650100', '乌鲁木齐市', '650000', 2, '650000', '新疆维吾尔自治区', '650100', '乌鲁木齐市', '', '', '', '', '新疆维吾尔自治区乌鲁木齐市', '830000', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (365, '650200', '克拉玛依市', '650000', 2, '650000', '新疆维吾尔自治区', '650200', '克拉玛依市', '', '', '', '', '新疆维吾尔自治区克拉玛依市', '834000', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (366, '650400', '吐鲁番市', '650000', 2, '650000', '新疆维吾尔自治区', '650400', '吐鲁番市', '', '', '', '', '新疆维吾尔自治区吐鲁番市', '838000', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (367, '650500', '哈密市', '650000', 2, '650000', '新疆维吾尔自治区', '650500', '哈密市', '', '', '', '', '新疆维吾尔自治区哈密市', '839000', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (368, '652300', '昌吉回族自治州', '650000', 2, '650000', '新疆维吾尔自治区', '652300', '昌吉回族自治州', '', '', '', '', '新疆维吾尔自治区昌吉回族自治州', '831100', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (369, '652700', '博尔塔拉蒙古自治州', '650000', 2, '650000', '新疆维吾尔自治区', '652700', '博尔塔拉蒙古自治州', '', '', '', '', '新疆维吾尔自治区博尔塔拉蒙古自治州', '833400', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (370, '652800', '巴音郭楞蒙古自治州', '650000', 2, '650000', '新疆维吾尔自治区', '652800', '巴音郭楞蒙古自治州', '', '', '', '', '新疆维吾尔自治区巴音郭楞蒙古自治州', '841000', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (371, '652900', '阿克苏地区', '650000', 2, '650000', '新疆维吾尔自治区', '652900', '阿克苏地区', '', '', '', '', '新疆维吾尔自治区阿克苏地区', '843000', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (372, '653000', '克孜勒苏柯尔克孜自治州', '650000', 2, '650000', '新疆维吾尔自治区', '653000', '克孜勒苏柯尔克孜自治州', '', '', '', '', '新疆维吾尔自治区克孜勒苏柯尔克孜自治州', '845350', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (373, '653100', '喀什地区', '650000', 2, '650000', '新疆维吾尔自治区', '653100', '喀什地区', '', '', '', '', '新疆维吾尔自治区喀什地区', '844000', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (374, '653200', '和田地区', '650000', 2, '650000', '新疆维吾尔自治区', '653200', '和田地区', '', '', '', '', '新疆维吾尔自治区和田地区', '848000', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (375, '654000', '伊犁哈萨克自治州', '650000', 2, '650000', '新疆维吾尔自治区', '654000', '伊犁哈萨克自治州', '', '', '', '', '新疆维吾尔自治区伊犁哈萨克自治州', '835000', 12, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (376, '654200', '塔城地区', '650000', 2, '650000', '新疆维吾尔自治区', '654200', '塔城地区', '', '', '', '', '新疆维吾尔自治区塔城地区', '834700', 13, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (377, '654300', '阿勒泰地区', '650000', 2, '650000', '新疆维吾尔自治区', '654300', '阿勒泰地区', '', '', '', '', '新疆维吾尔自治区阿勒泰地区', '836500', 14, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (378, '659001', '石河子市', '650000', 2, '650000', '新疆维吾尔自治区', '659001', '石河子市', '', '', '', '', '新疆维吾尔自治区石河子市', '832000', 15, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (379, '659002', '阿拉尔市', '650000', 2, '650000', '新疆维吾尔自治区', '659002', '阿拉尔市', '', '', '', '', '新疆维吾尔自治区阿拉尔市', '843300', 16, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (380, '659003', '图木舒克市', '650000', 2, '650000', '新疆维吾尔自治区', '659003', '图木舒克市', '', '', '', '', '新疆维吾尔自治区图木舒克市', '843806', 17, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (381, '659004', '五家渠市', '650000', 2, '650000', '新疆维吾尔自治区', '659004', '五家渠市', '', '', '', '', '新疆维吾尔自治区五家渠市', '831300', 18, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (382, '659005', '北屯市', '650000', 2, '650000', '新疆维吾尔自治区', '659005', '北屯市', '', '', '', '', '新疆维吾尔自治区北屯市', '836000', 19, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (383, '659006', '铁门关市', '650000', 2, '650000', '新疆维吾尔自治区', '659006', '铁门关市', '', '', '', '', '新疆维吾尔自治区铁门关市', '841000', 20, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (384, '659007', '双河市', '650000', 2, '650000', '新疆维吾尔自治区', '659007', '双河市', '', '', '', '', '新疆维吾尔自治区双河市', '833408', 21, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (385, '659008', '可克达拉市', '650000', 2, '650000', '新疆维吾尔自治区', '659008', '可克达拉市', '', '', '', '', '新疆维吾尔自治区可克达拉市', '835213', 22, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (386, '659009', '昆玉市', '650000', 2, '650000', '新疆维吾尔自治区', '659009', '昆玉市', '', '', '', '', '新疆维吾尔自治区昆玉市', '848116', 23, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (387, '659010', '胡杨河市', '650000', 2, '650000', '新疆维吾尔自治区', '659010', '胡杨河市', '', '', '', '', '新疆维吾尔自治区胡杨河市', '831900', 24, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (388, '810000', '香港特别行政区', '0', 1, '810000', '香港特别行政区', '', '', '', '', '', '', '香港特别行政区', '', 26, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (389, '810100', '香港岛', '810000', 2, '810000', '香港特别行政区', '810100', '香港岛', '', '', '', '', '香港特别行政区香港岛', '', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (390, '810200', '九龙', '810000', 2, '810000', '香港特别行政区', '810200', '九龙', '', '', '', '', '香港特别行政区九龙', '', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (391, '810300', '新界', '810000', 2, '810000', '香港特别行政区', '810300', '新界', '', '', '', '', '香港特别行政区新界', '', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (392, '820000', '澳门特别行政区', '0', 1, '820000', '澳门特别行政区', '', '', '', '', '', '', '澳门特别行政区', '', 27, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (393, '820100', '澳门半岛', '820000', 2, '820000', '澳门特别行政区', '820100', '澳门半岛', '', '', '', '', '澳门特别行政区澳门半岛', '', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (394, '820200', '氹仔岛', '820000', 2, '820000', '澳门特别行政区', '820200', '氹仔岛', '', '', '', '', '澳门特别行政区氹仔岛', '', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (395, '820300', '路环岛', '820000', 2, '820000', '澳门特别行政区', '820300', '路环岛', '', '', '', '', '澳门特别行政区路环岛', '', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (396, '710000', '台湾省', '0', 1, '710000', '台湾省', '', '', '', '', '', '', '台湾省', '', 28, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (397, '710100', '台北市', '710000', 2, '710000', '台湾省', '710100', '台北市', '', '', '', '', '台湾省台北市', '', 1, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (398, '710200', '高雄市', '710000', 2, '710000', '台湾省', '710200', '高雄市', '', '', '', '', '台湾省高雄市', '', 2, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (399, '710300', '台南市', '710000', 2, '710000', '台湾省', '710300', '台南市', '', '', '', '', '台湾省台南市', '', 3, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (400, '710400', '台中市', '710000', 2, '710000', '台湾省', '710400', '台中市', '', '', '', '', '台湾省台中市', '', 4, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (401, '710500', '基隆市', '710000', 2, '710000', '台湾省', '710500', '基隆市', '', '', '', '', '台湾省基隆市', '', 5, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (402, '710600', '新竹市', '710000', 2, '710000', '台湾省', '710600', '新竹市', '', '', '', '', '台湾省新竹市', '', 6, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (403, '710700', '嘉义市', '710000', 2, '710000', '台湾省', '710700', '嘉义市', '', '', '', '', '台湾省嘉义市', '', 7, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (404, '710800', '新北市', '710000', 2, '710000', '台湾省', '710800', '新北市', '', '', '', '', '台湾省新北市', '', 8, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (405, '710900', '宜兰县', '710000', 2, '710000', '台湾省', '710900', '宜兰县', '', '', '', '', '台湾省宜兰县', '', 9, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (406, '711000', '桃园市', '710000', 2, '710000', '台湾省', '711000', '桃园市', '', '', '', '', '台湾省桃园市', '', 10, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (407, '711100', '新竹县', '710000', 2, '710000', '台湾省', '711100', '新竹县', '', '', '', '', '台湾省新竹县', '', 11, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (408, '711200', '苗栗县', '710000', 2, '710000', '台湾省', '711200', '苗栗县', '', '', '', '', '台湾省苗栗县', '', 12, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (409, '711300', '彰化县', '710000', 2, '710000', '台湾省', '711300', '彰化县', '', '', '', '', '台湾省彰化县', '', 13, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (410, '711400', '南投县', '710000', 2, '710000', '台湾省', '711400', '南投县', '', '', '', '', '台湾省南投县', '', 14, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (411, '711500', '云林县', '710000', 2, '710000', '台湾省', '711500', '云林县', '', '', '', '', '台湾省云林县', '', 15, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (412, '711600', '嘉义县', '710000', 2, '710000', '台湾省', '711600', '嘉义县', '', '', '', '', '台湾省嘉义县', '', 16, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (413, '711700', '屏东县', '710000', 2, '710000', '台湾省', '711700', '屏东县', '', '', '', '', '台湾省屏东县', '', 17, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (414, '711800', '台东县', '710000', 2, '710000', '台湾省', '711800', '台东县', '', '', '', '', '台湾省台东县', '', 18, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (415, '711900', '花莲县', '710000', 2, '710000', '台湾省', '711900', '花莲县', '', '', '', '', '台湾省花莲县', '', 19, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (416, '712000', '澎湖县', '710000', 2, '710000', '台湾省', '712000', '澎湖县', '', '', '', '', '台湾省澎湖县', '', 20, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (417, '712100', '金门县', '710000', 2, '710000', '台湾省', '712100', '金门县', '', '', '', '', '台湾省金门县', '', 21, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);
INSERT INTO `sys_address` VALUES (418, '712200', '连江县', '710000', 2, '710000', '台湾省', '712200', '连江县', '', '', '', '', '台湾省连江县', '', 22, '2025-03-11 23:02:14', '2025-03-11 23:02:14', 'admin', 'admin', 0);

-- ----------------------------
-- Table structure for sys_attr
-- ----------------------------
DROP TABLE IF EXISTS `sys_attr`;
CREATE TABLE `sys_attr`  (
                             `id` bigint NOT NULL AUTO_INCREMENT,
                             `attr_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
                             `attr_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '编码',
                             `attr_group_id` bigint NOT NULL DEFAULT 0 COMMENT '属性组id',
                             `attr_group_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '属性组编码',
                             `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图标',
                             `attr_type` int NOT NULL DEFAULT 0 COMMENT '属性类型',
                             `status` int NOT NULL DEFAULT 0 COMMENT '状态',
                             `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '描述',
                             `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
                             `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                             `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                             `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                             `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                             PRIMARY KEY (`id`) USING BTREE,
                             INDEX `idx_attr_group_id`(`attr_group_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 317 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_attr
-- ----------------------------
INSERT INTO `sys_attr` VALUES (1, '艺术创作', 'NFT_APPLICATION_FIELD_ART', 1, 'NFT_APPLICATION_FIELD', '', 1, 1, '艺术创作领域', 1, '2025-03-11 22:26:36', '2025-04-07 21:51:01', 0, 'admin', '');
INSERT INTO `sys_attr` VALUES (2, '虚拟资产', 'NFT_APPLICATION_FIELD_VIRTUAL', 1, 'NFT_APPLICATION_FIELD', '', 0, 1, '虚拟资产领域', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (3, '游戏相关', 'NFT_APPLICATION_FIELD_GAME', 1, 'NFT_APPLICATION_FIELD', '', 0, 1, '游戏相关领域', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (4, '艺术收藏', 'NFT_APPLICATION_FIELD_COLLECTION', 1, 'NFT_APPLICATION_FIELD', '', 0, 1, '艺术收藏领域', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (5, '域名', 'NFT_APPLICATION_FIELD_DOMAIN', 1, 'NFT_APPLICATION_FIELD', '', 0, 1, '域名领域', 5, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (8, '区块链数字艺术品', 'NFT_TECH_FORM_BLOCKCHAIN', 2, 'NFT_TECH_FORM', '', 0, 1, '区块链数字艺术品形式', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (9, '人工智能生成艺术品', 'NFT_TECH_FORM_AI', 2, 'NFT_TECH_FORM', '', 0, 1, '人工智能生成艺术品形式', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (10, '传统数字艺术形式', 'NFT_TECH_FORM_TRADITIONAL', 2, 'NFT_TECH_FORM', '', 0, 1, '传统数字艺术形式', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (11, '赛博朋克', 'NFT_ART_STYLE_CYBERPUNK', 3, 'NFT_ART_STYLE', '', 0, 1, '赛博朋克风格', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (12, '波普艺术', 'NFT_ART_STYLE_POP', 3, 'NFT_ART_STYLE', '', 0, 1, '波普艺术风格', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (13, '新艺术运动风', 'NFT_ART_STYLE_NEW', 3, 'NFT_ART_STYLE', '', 0, 1, '新艺术运动风格', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (14, '简约', 'NFT_ART_STYLE_SIMPLE', 3, 'NFT_ART_STYLE', '', 0, 1, '简约风格', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (15, '黑白', 'NFT_ART_STYLE_BW', 3, 'NFT_ART_STYLE', '', 0, 1, '黑白风格', 5, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (18, '未来都市', 'NFT_ART_THEME_FUTURE', 4, 'NFT_ART_THEME', '', 0, 1, '未来都市主题', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (19, '复古情怀', 'NFT_ART_THEME_RETRO', 4, 'NFT_ART_THEME', '', 0, 1, '复古情怀主题', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (20, '人物', 'NFT_ART_THEME_CHARACTER', 4, 'NFT_ART_THEME', '', 0, 1, '人物主题', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (21, '汽车', 'NFT_ART_THEME_CAR', 4, 'NFT_ART_THEME', '', 0, 1, '汽车主题', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (25, '原创', 'NFT_CREATION_METHOD_ORIGINAL', 5, 'NFT_CREATION_METHOD', '', 0, 1, '原创方式', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (26, '混音', 'NFT_CREATION_METHOD_REMIX', 5, 'NFT_CREATION_METHOD', '', 0, 1, '混音方式', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (27, '采样', 'NFT_CREATION_METHOD_SAMPLE', 5, 'NFT_CREATION_METHOD', '', 0, 1, '采样方式', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (28, '电子', 'NFT_MUSIC_TYPE_ELECTRONIC', 6, 'NFT_MUSIC_TYPE', '', 0, 1, '电子音乐', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (29, '摇滚', 'NFT_MUSIC_TYPE_ROCK', 6, 'NFT_MUSIC_TYPE', '', 0, 1, '摇滚音乐', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (30, '嘻哈', 'NFT_MUSIC_TYPE_HIPHOP', 6, 'NFT_MUSIC_TYPE', '', 0, 1, '嘻哈音乐', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (31, '古典', 'NFT_MUSIC_TYPE_CLASSICAL', 6, 'NFT_MUSIC_TYPE', '', 0, 1, '古典音乐', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (35, '动画短片', 'NFT_VIDEO_TYPE_ANIMATION', 7, 'NFT_VIDEO_TYPE', '', 0, 1, '动画短片', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (36, '实验影像', 'NFT_VIDEO_TYPE_EXPERIMENTAL', 7, 'NFT_VIDEO_TYPE', '', 0, 1, '实验影像', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (37, '纪录片片段', 'NFT_VIDEO_TYPE_DOCUMENTARY', 7, 'NFT_VIDEO_TYPE', '', 0, 1, '纪录片片段', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (38, '剧情短片', 'NFT_VIDEO_TYPE_DRAMA', 7, 'NFT_VIDEO_TYPE', '', 0, 1, '剧情短片', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (42, '1分钟以内', 'NFT_VIDEO_DURATION_1MIN', 8, 'NFT_VIDEO_DURATION', '', 0, 1, '1分钟以内', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (43, '1-5分钟', 'NFT_VIDEO_DURATION_1_5MIN', 8, 'NFT_VIDEO_DURATION', '', 0, 1, '1-5分钟', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (44, '5-15分钟', 'NFT_VIDEO_DURATION_5_15MIN', 8, 'NFT_VIDEO_DURATION', '', 0, 1, '5-15分钟', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (45, '15分钟以上', 'NFT_VIDEO_DURATION_15MIN_PLUS', 8, 'NFT_VIDEO_DURATION', '', 0, 1, '15分钟以上', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (49, '诗歌', 'NFT_TEXT_GENRE_POETRY', 9, 'NFT_TEXT_GENRE', '', 0, 1, '诗歌体裁', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (50, '小说片段', 'NFT_TEXT_GENRE_NOVEL', 9, 'NFT_TEXT_GENRE', '', 0, 1, '小说片段体裁', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (51, '散文', 'NFT_TEXT_GENRE_ESSAY', 9, 'NFT_TEXT_GENRE', '', 0, 1, '散文体裁', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (52, '名言警句', 'NFT_TEXT_GENRE_QUOTE', 9, 'NFT_TEXT_GENRE', '', 0, 1, '名言警句体裁', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (56, '中文', 'NFT_TEXT_LANGUAGE_CN', 10, 'NFT_TEXT_LANGUAGE', '', 0, 1, '中文', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (57, '英文', 'NFT_TEXT_LANGUAGE_EN', 10, 'NFT_TEXT_LANGUAGE', '', 0, 1, '英文', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (58, '日文', 'NFT_TEXT_LANGUAGE_JP', 10, 'NFT_TEXT_LANGUAGE', '', 0, 1, '日文', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (59, '法文', 'NFT_TEXT_LANGUAGE_FR', 10, 'NFT_TEXT_LANGUAGE', '', 0, 1, '法文', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (63, '社交平台', 'NFT_APP_PLATFORM_SOCIAL', 11, 'NFT_APP_PLATFORM', '', 0, 1, '社交平台', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (64, '元宇宙平台', 'NFT_APP_PLATFORM_METAVERSE', 11, 'NFT_APP_PLATFORM', '', 0, 1, '元宇宙平台', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (65, '游戏平台', 'NFT_APP_PLATFORM_GAME', 11, 'NFT_APP_PLATFORM', '', 0, 1, '游戏平台', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (66, '动漫角色', 'NFT_IMAGE_SOURCE_ANIME', 12, 'NFT_IMAGE_SOURCE', '', 0, 1, '动漫角色来源', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (67, '原创角色', 'NFT_IMAGE_SOURCE_ORIGINAL', 12, 'NFT_IMAGE_SOURCE', '', 0, 1, '原创角色来源', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (68, '名人形象', 'NFT_IMAGE_SOURCE_CELEBRITY', 12, 'NFT_IMAGE_SOURCE', '', 0, 1, '名人形象来源', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (69, '动物形象', 'NFT_IMAGE_SOURCE_ANIMAL', 12, 'NFT_IMAGE_SOURCE', '', 0, 1, '动物形象来源', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (73, '普通', 'NFT_RARITY_COMMON', 13, 'NFT_RARITY', '', 0, 1, '普通稀有度', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (74, '稀有', 'NFT_RARITY_RARE', 13, 'NFT_RARITY', '', 0, 1, '稀有稀有度', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (75, '史诗', 'NFT_RARITY_EPIC', 13, 'NFT_RARITY', '', 0, 1, '史诗稀有度', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (76, '传说', 'NFT_RARITY_LEGENDARY', 13, 'NFT_RARITY', '', 0, 1, '传说稀有度', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (80, '发型', 'NFT_CUSTOM_ELEMENT_HAIR', 14, 'NFT_CUSTOM_ELEMENT', '', 0, 1, '发型定制元素', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (81, '服饰', 'NFT_CUSTOM_ELEMENT_CLOTHING', 14, 'NFT_CUSTOM_ELEMENT', '', 0, 1, '服饰定制元素', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (82, '配饰', 'NFT_CUSTOM_ELEMENT_ACCESSORY', 14, 'NFT_CUSTOM_ELEMENT', '', 0, 1, '配饰定制元素', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (83, '面部特征', 'NFT_CUSTOM_ELEMENT_FACIAL', 14, 'NFT_CUSTOM_ELEMENT', '', 0, 1, '面部特征定制元素', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (87, '社交互动', 'NFT_APPLICATION_SCENE_SOCIAL', 15, 'NFT_APPLICATION_SCENE', '', 0, 1, '社交互动场景', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (88, '游戏体验', 'NFT_APPLICATION_SCENE_GAME', 15, 'NFT_APPLICATION_SCENE', '', 0, 1, '游戏体验场景', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (89, '虚拟演出', 'NFT_APPLICATION_SCENE_PERFORMANCE', 15, 'NFT_APPLICATION_SCENE', '', 0, 1, '虚拟演出场景', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (90, '社区元老', 'NFT_IDENTITY_SYMBOL_ELDER', 16, 'NFT_IDENTITY_SYMBOL', '', 0, 1, '社区元老身份', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (91, '意见领袖', 'NFT_IDENTITY_SYMBOL_KOL', 16, 'NFT_IDENTITY_SYMBOL', '', 0, 1, '意见领袖身份', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (92, '活动大使', 'NFT_IDENTITY_SYMBOL_AMBASSADOR', 16, 'NFT_IDENTITY_SYMBOL', '', 0, 1, '活动大使身份', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (93, '优先参与权', 'NFT_PRIVILEGE_PRIORITY', 17, 'NFT_PRIVILEGE', '', 0, 1, '优先参与权特权', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (94, '专属徽章', 'NFT_PRIVILEGE_BADGE', 17, 'NFT_PRIVILEGE', '', 0, 1, '专属徽章特权', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (95, '特殊标识', 'NFT_PRIVILEGE_MARK', 17, 'NFT_PRIVILEGE', '', 0, 1, '特殊标识特权', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (96, '角色扮演', 'NFT_GAME_TYPE_RPG', 18, 'NFT_GAME_TYPE', '', 0, 1, '角色扮演游戏', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (97, '策略', 'NFT_GAME_TYPE_STRATEGY', 18, 'NFT_GAME_TYPE', '', 0, 1, '策略类游戏', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (98, '竞技', 'NFT_GAME_TYPE_COMPETITIVE', 18, 'NFT_GAME_TYPE', '', 0, 1, '竞技类游戏', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (99, '休闲', 'NFT_GAME_TYPE_CASUAL', 18, 'NFT_GAME_TYPE', '', 0, 1, '休闲类游戏', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (103, '增益', 'NFT_PROP_FUNCTION_BUFF', 19, 'NFT_PROP_FUNCTION', '', 0, 1, '增益道具', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (104, '装饰', 'NFT_PROP_FUNCTION_DECORATION', 19, 'NFT_PROP_FUNCTION', '', 0, 1, '装饰道具', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (105, '消耗品', 'NFT_PROP_FUNCTION_CONSUMABLE', 19, 'NFT_PROP_FUNCTION', '', 0, 1, '消耗品道具', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (106, '角色扮演(RPG)', 'NFT_GAME_TYPE_RPG', 18, 'NFT_GAME_TYPE', '', 0, 1, '角色扮演类游戏', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (107, '策略游戏(SLG)', 'NFT_GAME_TYPE_SLG', 18, 'NFT_GAME_TYPE', '', 0, 1, '策略类游戏', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (108, '射击游戏(FPS/TPS)', 'NFT_GAME_TYPE_FPS', 18, 'NFT_GAME_TYPE', '', 0, 1, '射击类游戏', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (109, '模拟经营(SIM)', 'NFT_GAME_TYPE_SIM', 18, 'NFT_GAME_TYPE', '', 0, 1, '模拟经营类游戏', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (113, '增强属性', 'NFT_PROP_FUNCTION_ATTR', 19, 'NFT_PROP_FUNCTION', '', 0, 1, '增强属性功能', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (114, '解锁技能', 'NFT_PROP_FUNCTION_SKILL', 19, 'NFT_PROP_FUNCTION', '', 0, 1, '解锁技能功能', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (115, '开启特殊场景', 'NFT_PROP_FUNCTION_SCENE', 19, 'NFT_PROP_FUNCTION', '', 0, 1, '开启特殊场景功能', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (116, '交易媒介', 'NFT_PROP_FUNCTION_TRADE', 19, 'NFT_PROP_FUNCTION', '', 0, 1, '交易媒介功能', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (120, '武器', 'NFT_EQUIPMENT_POSITION_WEAPON', 21, 'NFT_EQUIPMENT_POSITION', '', 0, 1, '武器装备', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (121, '防具', 'NFT_EQUIPMENT_POSITION_ARMOR', 21, 'NFT_EQUIPMENT_POSITION', '', 0, 1, '防具装备', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (122, '饰品', 'NFT_EQUIPMENT_POSITION_ACCESSORY', 21, 'NFT_EQUIPMENT_POSITION', '', 0, 1, '饰品装备', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (123, '坐骑', 'NFT_EQUIPMENT_POSITION_MOUNT', 21, 'NFT_EQUIPMENT_POSITION', '', 0, 1, '坐骑装备', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (127, '普通', 'NFT_QUALITY_NORMAL', 22, 'NFT_QUALITY', '', 0, 1, '普通品质', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (128, '精良', 'NFT_QUALITY_FINE', 22, 'NFT_QUALITY', '', 0, 1, '精良品质', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (129, '稀有', 'NFT_QUALITY_RARE', 22, 'NFT_QUALITY', '', 0, 1, '稀有品质', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (130, '史诗', 'NFT_QUALITY_EPIC', 22, 'NFT_QUALITY', '', 0, 1, '史诗品质', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (131, '传说', 'NFT_QUALITY_LEGENDARY', 22, 'NFT_QUALITY', '', 0, 1, '传说品质', 5, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (134, '战士', 'NFT_PROFESSION_WARRIOR', 23, 'NFT_PROFESSION', '', 0, 1, '战士职业', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (135, '法师', 'NFT_PROFESSION_MAGE', 23, 'NFT_PROFESSION', '', 0, 1, '法师职业', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (136, '射手', 'NFT_PROFESSION_ARCHER', 23, 'NFT_PROFESSION', '', 0, 1, '射手职业', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (137, '刺客', 'NFT_PROFESSION_ASSASSIN', 23, 'NFT_PROFESSION', '', 0, 1, '刺客职业', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (138, '辅助', 'NFT_PROFESSION_SUPPORT', 23, 'NFT_PROFESSION', '', 0, 1, '辅助职业', 5, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (141, '50级', 'NFT_LEVEL_CAP_50', 24, 'NFT_LEVEL_CAP', '', 0, 1, '50级上限', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (142, '100级', 'NFT_LEVEL_CAP_100', 24, 'NFT_LEVEL_CAP', '', 0, 1, '100级上限', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (143, '150级', 'NFT_LEVEL_CAP_150', 24, 'NFT_LEVEL_CAP', '', 0, 1, '150级上限', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (144, '150级以上', 'NFT_LEVEL_CAP_150_UP', 24, 'NFT_LEVEL_CAP', '', 0, 1, '150级级以上', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (148, '足球', 'NFT_SPORTS_FOOTBALL', 26, 'NFT_SPORTS', '', 0, 1, '足球运动', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (149, '篮球', 'NFT_SPORTS_BASKETBALL', 26, 'NFT_SPORTS', '', 0, 1, '篮球运动', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (150, '网球', 'NFT_SPORTS_TENNIS', 26, 'NFT_SPORTS', '', 0, 1, '网球运动', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (151, '田径', 'NFT_SPORTS_ATHLETICS', 26, 'NFT_SPORTS', '', 0, 1, '田径运动', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (155, '奥运会', 'NFT_COMPETITION_TYPE_OLYMPIC', 27, 'NFT_COMPETITION_TYPE', '', 0, 1, '奥运会赛事', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (156, '世界杯', 'NFT_COMPETITION_TYPE_WORLDCUP', 27, 'NFT_COMPETITION_TYPE', '', 0, 1, '世界杯赛事', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (157, '职业联赛', 'NFT_COMPETITION_TYPE_LEAGUE', 27, 'NFT_COMPETITION_TYPE', '', 0, 1, '职业联赛赛事', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (158, '洲际锦标赛', 'NFT_COMPETITION_TYPE_CONTINENTAL', 27, 'NFT_COMPETITION_TYPE', '', 0, 1, '洲际锦标赛赛事', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (162, '神话', 'NFT_HISTORICAL_PERIOD_MYTH', 28, 'NFT_HISTORICAL_PERIOD', '', 0, 1, '神话时期', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (163, '远古', 'NFT_HISTORICAL_PERIOD_ANCIENT', 28, 'NFT_HISTORICAL_PERIOD', '', 0, 1, '远古时期', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (164, '近代', 'NFT_HISTORICAL_PERIOD_MODERN', 28, 'NFT_HISTORICAL_PERIOD', '', 0, 1, '近代时期', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (165, '现代', 'NFT_HISTORICAL_PERIOD_CONTEMPORARY', 28, 'NFT_HISTORICAL_PERIOD', '', 0, 1, '现代时期', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (169, '宗教信仰', 'NFT_CULTURE_TYPE_RELIGION', 29, 'NFT_CULTURE_TYPE', '', 0, 1, '宗教信仰文化', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (170, '文物复刻', 'NFT_CULTURE_TYPE_RELIC', 29, 'NFT_CULTURE_TYPE', '', 0, 1, '文物复刻文化', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (171, '传统技艺', 'NFT_CULTURE_TYPE_CRAFT', 29, 'NFT_CULTURE_TYPE', '', 0, 1, '传统技艺文化', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (172, '民俗文化', 'NFT_CULTURE_TYPE_FOLK', 29, 'NFT_CULTURE_TYPE', '', 0, 1, '民俗文化', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (176, '影视明星', 'NFT_CELEBRITY_FIELD_ENTERTAINMENT', 30, 'NFT_CELEBRITY_FIELD', '', 0, 1, '影视明星领域', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (177, '体育明星', 'NFT_CELEBRITY_FIELD_SPORTS', 30, 'NFT_CELEBRITY_FIELD', '', 0, 1, '体育明星领域', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (178, '科技大佬', 'NFT_CELEBRITY_FIELD_TECH', 30, 'NFT_CELEBRITY_FIELD', '', 0, 1, '科技大佬领域', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (179, '艺术家', 'NFT_CELEBRITY_FIELD_ARTIST', 30, 'NFT_CELEBRITY_FIELD', '', 0, 1, '艺术家领域', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (183, '签名照', 'NFT_PERIPHERAL_FORM_SIGNATURE', 31, 'NFT_PERIPHERAL_FORM', '', 0, 1, '签名照周边', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (184, '手写笔记', 'NFT_PERIPHERAL_FORM_NOTE', 31, 'NFT_PERIPHERAL_FORM', '', 0, 1, '手写笔记周边', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (185, '私人物品复刻', 'NFT_PERIPHERAL_FORM_REPLICA', 31, 'NFT_PERIPHERAL_FORM', '', 0, 1, '私人物品复刻周边', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (186, '视频祝福', 'NFT_PERIPHERAL_FORM_VIDEO', 31, 'NFT_PERIPHERAL_FORM', '', 0, 1, '视频祝福周边', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (190, '节日', 'NFT_BADGE_THEME_FESTIVAL', 32, 'NFT_BADGE_THEME', '', 0, 1, '节日主题徽章', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (191, '活动', 'NFT_BADGE_THEME_EVENT', 32, 'NFT_BADGE_THEME', '', 0, 1, '活动主题徽章', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (192, '品牌合作', 'NFT_BADGE_THEME_BRAND', 32, 'NFT_BADGE_THEME', '', 0, 1, '品牌合作主题徽章', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (193, '公益项目', 'NFT_BADGE_THEME_CHARITY', 32, 'NFT_BADGE_THEME', '', 0, 1, '公益项目主题徽章', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (197, '专属', 'NFT_LIMITED_QUANTITY_EXCLUSIVE', 33, 'NFT_LIMITED_QUANTITY', '', 0, 1, '专属限量', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (198, '100份', 'NFT_LIMITED_QUANTITY_100', 33, 'NFT_LIMITED_QUANTITY', '', 0, 1, '100份限量', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (199, '500份', 'NFT_LIMITED_QUANTITY_500', 33, 'NFT_LIMITED_QUANTITY', '', 0, 1, '500份限量', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (200, '1000份', 'NFT_LIMITED_QUANTITY_1000', 33, 'NFT_LIMITED_QUANTITY', '', 0, 1, '1000份限量', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (201, '5000份', 'NFT_LIMITED_QUANTITY_5000', 33, 'NFT_LIMITED_QUANTITY', '', 0, 1, '5000份限量', 5, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (204, 'Decentraland', 'NFT_PLATFORM_TYPE_DECENTRALAND', 35, 'NFT_PLATFORM_TYPE', '', 0, 1, 'Decentraland平台', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (205, 'The Sandbox', 'NFT_PLATFORM_TYPE_SANDBOX', 35, 'NFT_PLATFORM_TYPE', '', 0, 1, 'The Sandbox平台', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (206, 'Somnium Space', 'NFT_PLATFORM_TYPE_SOMNIUM', 35, 'NFT_PLATFORM_TYPE', '', 0, 1, 'Somnium Space平台', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (207, 'Cryptovoxels', 'NFT_PLATFORM_TYPE_CRYPTOVOXELS', 35, 'NFT_PLATFORM_TYPE', '', 0, 1, 'Cryptovoxels平台', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (211, '中心商业区', 'NFT_LOCATION_CBD', 36, 'NFT_LOCATION', '', 0, 1, '中心商业区位置', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (212, '住宅区', 'NFT_LOCATION_RESIDENTIAL', 36, 'NFT_LOCATION', '', 0, 1, '住宅区位置', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (213, '风景区', 'NFT_LOCATION_SCENIC', 36, 'NFT_LOCATION', '', 0, 1, '风景区位置', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (214, '工业区', 'NFT_LOCATION_INDUSTRIAL', 36, 'NFT_LOCATION', '', 0, 1, '工业区位置', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (218, '100平', 'NFT_AREA_100', 37, 'NFT_AREA', '', 0, 1, '100平米面积', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (219, '500平', 'NFT_AREA_500', 37, 'NFT_AREA', '', 0, 1, '500平米面积', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (220, '1000平', 'NFT_AREA_1000', 37, 'NFT_AREA', '', 0, 1, '1000平米面积', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (221, '5000平', 'NFT_AREA_5000', 37, 'NFT_AREA', '', 0, 1, '5000平米面积', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (222, '5000平以上', 'NFT_AREA_ABOVE_5000', 37, 'NFT_AREA', '', 0, 1, '5000平米以上面积', 5, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (225, '现代简约', 'NFT_SPACE_STYLE_MODERN', 38, 'NFT_SPACE_STYLE', '', 0, 1, '现代简约风格', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (226, '欧式古典', 'NFT_SPACE_STYLE_EUROPEAN', 38, 'NFT_SPACE_STYLE', '', 0, 1, '欧式古典风格', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (227, '中式古风', 'NFT_SPACE_STYLE_CHINESE', 38, 'NFT_SPACE_STYLE', '', 0, 1, '中式古风风格', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (228, '未来科幻', 'NFT_SPACE_STYLE_FUTURE', 38, 'NFT_SPACE_STYLE', '', 0, 1, '未来科幻风格', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (232, '展览展示', 'NFT_SPACE_USE_EXHIBITION', 39, 'NFT_SPACE_USE', '', 0, 1, '展览展示用途', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (233, '社交聚会', 'NFT_SPACE_USE_SOCIAL', 39, 'NFT_SPACE_USE', '', 0, 1, '社交聚会用途', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (234, '办公场所', 'NFT_SPACE_USE_OFFICE', 39, 'NFT_SPACE_USE', '', 0, 1, '办公场所用途', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (235, '学历证书', 'NFT_CERT_TYPE_EDUCATION', 41, 'NFT_CERT_TYPE', '', 0, 1, '学历证书认证', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (236, '技能证书', 'NFT_CERT_TYPE_SKILL', 41, 'NFT_CERT_TYPE', '', 0, 1, '技能证书认证', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (237, '培训结业证书', 'NFT_CERT_TYPE_TRAINING', 41, 'NFT_CERT_TYPE', '', 0, 1, '培训结业证书认证', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (238, '知名大学', 'NFT_ISSUING_ORG_UNIVERSITY', 42, 'NFT_ISSUING_ORG', '', 0, 1, '知名大学机构', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (239, '专业培训机构', 'NFT_ISSUING_ORG_TRAINING', 42, 'NFT_ISSUING_ORG', '', 0, 1, '专业培训机构', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (240, '行业协会', 'NFT_ISSUING_ORG_ASSOCIATION', 42, 'NFT_ISSUING_ORG', '', 0, 1, '行业协会机构', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (241, '普通会员', 'NFT_MEMBER_LEVEL_NORMAL', 43, 'NFT_MEMBER_LEVEL', '', 0, 1, '普通会员等级', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (242, '银卡会员', 'NFT_MEMBER_LEVEL_SILVER', 43, 'NFT_MEMBER_LEVEL', '', 0, 1, '银卡会员等级', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (243, '金卡会员', 'NFT_MEMBER_LEVEL_GOLD', 43, 'NFT_MEMBER_LEVEL', '', 0, 1, '金卡会员等级', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (244, '钻石会员', 'NFT_MEMBER_LEVEL_DIAMOND', 43, 'NFT_MEMBER_LEVEL', '', 0, 1, '钻石会员等级', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (248, '折扣优惠', 'NFT_MEMBER_RIGHTS_DISCOUNT', 44, 'NFT_MEMBER_RIGHTS', '', 0, 1, '折扣优惠权益', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (249, '优先服务', 'NFT_MEMBER_RIGHTS_PRIORITY', 44, 'NFT_MEMBER_RIGHTS', '', 0, 1, '优先服务权益', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (250, '专属活动', 'NFT_MEMBER_RIGHTS_EXCLUSIVE', 44, 'NFT_MEMBER_RIGHTS', '', 0, 1, '专属活动权益', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (251, '演唱会', 'NFT_EVENT_TYPE_CONCERT', 45, 'NFT_EVENT_TYPE', '', 0, 1, '演唱会活动', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (252, '音乐节', 'NFT_EVENT_TYPE_MUSIC_FESTIVAL', 45, 'NFT_EVENT_TYPE', '', 0, 1, '音乐节活动', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (253, '艺术展览', 'NFT_EVENT_TYPE_ART_EXHIBITION', 45, 'NFT_EVENT_TYPE', '', 0, 1, '艺术展览活动', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (254, '体育赛事', 'NFT_EVENT_TYPE_SPORTS', 45, 'NFT_EVENT_TYPE', '', 0, 1, '体育赛事活动', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (258, 'VIP', 'NFT_SEAT_LEVEL_VIP', 46, 'NFT_SEAT_LEVEL', '', 0, 1, 'VIP座位', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (259, '前排', 'NFT_SEAT_LEVEL_FRONT', 46, 'NFT_SEAT_LEVEL', '', 0, 1, '前排座位', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (260, '中排', 'NFT_SEAT_LEVEL_MIDDLE', 46, 'NFT_SEAT_LEVEL', '', 0, 1, '中排座位', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (261, '后排', 'NFT_SEAT_LEVEL_BACK', 46, 'NFT_SEAT_LEVEL', '', 0, 1, '后排座位', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (265, '文字作品版权', 'NFT_COPYRIGHT_TYPE_TEXT', 47, 'NFT_COPYRIGHT_TYPE', '', 0, 1, '文字作品版权', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (266, '音乐作品版权', 'NFT_COPYRIGHT_TYPE_MUSIC', 47, 'NFT_COPYRIGHT_TYPE', '', 0, 1, '音乐作品版权', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (267, '美术作品版权', 'NFT_COPYRIGHT_TYPE_ART', 47, 'NFT_COPYRIGHT_TYPE', '', 0, 1, '美术作品版权', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (268, '影视作品版权', 'NFT_COPYRIGHT_TYPE_VIDEO', 47, 'NFT_COPYRIGHT_TYPE', '', 0, 1, '影视作品版权', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (272, '独家授权', 'NFT_LICENSE_TYPE_EXCLUSIVE', 48, 'NFT_LICENSE_TYPE', '', 0, 1, '独家授权方式', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (273, '非独家授权', 'NFT_LICENSE_TYPE_NON_EXCLUSIVE', 48, 'NFT_LICENSE_TYPE', '', 0, 1, '非独家授权方式', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (274, '限时授权', 'NFT_LICENSE_TYPE_LIMITED', 48, 'NFT_LICENSE_TYPE', '', 0, 1, '限时授权方式', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (275, '1年期', 'NFT_BOND_PERIOD_1Y', 50, 'NFT_BOND_PERIOD', '', 0, 1, '1年期债券', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (276, '3年期', 'NFT_BOND_PERIOD_3Y', 50, 'NFT_BOND_PERIOD', '', 0, 1, '3年期债券', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (277, '5年期', 'NFT_BOND_PERIOD_5Y', 50, 'NFT_BOND_PERIOD', '', 0, 1, '5年期债券', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (278, '10年期', 'NFT_BOND_PERIOD_10Y', 50, 'NFT_BOND_PERIOD', '', 0, 1, '10年期债券', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (282, '固定利率', 'NFT_INTEREST_TYPE_FIXED', 51, 'NFT_INTEREST_TYPE', '', 0, 1, '固定利率类型', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (283, '浮动利率', 'NFT_INTEREST_TYPE_FLOAT', 51, 'NFT_INTEREST_TYPE', '', 0, 1, '浮动利率类型', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (284, '零息债券', 'NFT_INTEREST_TYPE_ZERO', 51, 'NFT_INTEREST_TYPE', '', 0, 1, '零息债券类型', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (285, '混合利率', 'NFT_INTEREST_TYPE_HYBRID', 51, 'NFT_INTEREST_TYPE', '', 0, 1, '混合利率类型', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (289, '房地产', 'NFT_ASSET_TYPE_REAL_ESTATE', 52, 'NFT_ASSET_TYPE', '', 0, 1, '房地产资产', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (290, '艺术品', 'NFT_ASSET_TYPE_ART', 52, 'NFT_ASSET_TYPE', '', 0, 1, '艺术品资产', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (291, '贵金属', 'NFT_ASSET_TYPE_PRECIOUS_METAL', 52, 'NFT_ASSET_TYPE', '', 0, 1, '贵金属资产', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (292, '收藏品', 'NFT_ASSET_TYPE_COLLECTIBLE', 52, 'NFT_ASSET_TYPE', '', 0, 1, '收藏品资产', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (296, '资产确权', 'NFT_VOUCHER_USE_OWNERSHIP', 53, 'NFT_VOUCHER_USE', '', 0, 1, '资产确权用途', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (297, '交易流转', 'NFT_VOUCHER_USE_TRADING', 53, 'NFT_VOUCHER_USE', '', 0, 1, '交易流转用途', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (298, '融资抵押', 'NFT_VOUCHER_USE_MORTGAGE', 53, 'NFT_VOUCHER_USE', '', 0, 1, '融资抵押用途', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (299, '权益分配', 'NFT_VOUCHER_USE_DISTRIBUTION', 53, 'NFT_VOUCHER_USE', '', 0, 1, '权益分配用途', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (303, '科技创新', 'NFT_ENTERPRISE_FIELD_TECH', 54, 'NFT_ENTERPRISE_FIELD', '', 0, 1, '科技创新领域', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (304, '文化创意', 'NFT_ENTERPRISE_FIELD_CULTURE', 54, 'NFT_ENTERPRISE_FIELD', '', 0, 1, '文化创意领域', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (305, '生物医药', 'NFT_ENTERPRISE_FIELD_BIOTECH', 54, 'NFT_ENTERPRISE_FIELD', '', 0, 1, '生物医药领域', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (306, '新能源', 'NFT_ENTERPRISE_FIELD_NEW_ENERGY', 54, 'NFT_ENTERPRISE_FIELD', '', 0, 1, '新能源领域', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (310, '1%以下', 'NFT_EQUITY_RATIO_BELOW_1', 55, 'NFT_EQUITY_RATIO', '', 0, 1, '1%以下股权', 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (311, '1%-5%', 'NFT_EQUITY_RATIO_1_5', 55, 'NFT_EQUITY_RATIO', '', 0, 1, '1%-5%股权', 2, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (312, '5%-10%', 'NFT_EQUITY_RATIO_5_10', 55, 'NFT_EQUITY_RATIO', '', 0, 1, '5%-10%股权', 3, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (313, '10%-20%', 'NFT_EQUITY_RATIO_10_20', 55, 'NFT_EQUITY_RATIO', '', 0, 1, '10%-20%股权', 4, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (314, '20%以上', 'NFT_EQUITY_RATIO_ABOVE_20', 55, 'NFT_EQUITY_RATIO', '', 0, 1, '20%以上股权', 5, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr` VALUES (316, '1111nameAttr', 'attr_code_ming_01', 56, 'T_Gp_001', '', 1, 0, 'zheshi', 2, '2025-04-05 16:08:33', '2025-04-07 21:22:38', 0, '', '');

-- ----------------------------
-- Table structure for sys_attr_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_attr_group`;
CREATE TABLE `sys_attr_group`  (
                                   `id` bigint NOT NULL AUTO_INCREMENT,
                                   `attr_group_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
                                   `attr_group_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '编码',
                                   `type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '类型  1.基础属性组',
                                   `status` int NOT NULL DEFAULT 0 COMMENT '状态',
                                   `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
                                   `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '描述',
                                   `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                   `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                   `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                   `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                   `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                   PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_attr_group
-- ----------------------------
INSERT INTO `sys_attr_group` VALUES (1, '应用领域', 'NFT_APPLICATION_FIELD', '1', 1, 1, 'NFT应用领域属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (2, '技术形式', 'NFT_TECH_FORM', '1', 1, 2, 'NFT技术形式属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (3, '艺术风格', 'NFT_ART_STYLE', '1', 1, 3, '艺术作品风格属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (4, '艺术主题', 'NFT_ART_THEME', '1', 1, 4, '艺术作品主题属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (5, '创作方式', 'NFT_CREATION_METHOD', '1', 1, 5, '音乐创作方式属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (6, '音乐类型', 'NFT_MUSIC_TYPE', '1', 1, 6, '音乐类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (7, '视频类型', 'NFT_VIDEO_TYPE', '1', 1, 7, '视频类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (8, '视频时长', 'NFT_VIDEO_DURATION', '1', 1, 8, '视频时长属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (9, '文本体裁', 'NFT_TEXT_GENRE', '1', 1, 9, '文本体裁属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (10, '文本语言', 'NFT_TEXT_LANGUAGE', '1', 1, 10, '文本语言属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (11, '应用平台', 'NFT_APP_PLATFORM', '1', 1, 11, '虚拟身份应用平台属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (12, '形象来源', 'NFT_IMAGE_SOURCE', '1', 1, 12, '头像形象来源属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (13, '稀有度', 'NFT_RARITY', '1', 1, 13, 'NFT稀有度属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (14, '定制元素', 'NFT_CUSTOM_ELEMENT', '1', 1, 14, '虚拟形象定制元素属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (15, '适用场景', 'NFT_APPLICATION_SCENE', '1', 1, 15, '虚拟形象适用场景属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (16, '身份象征', 'NFT_IDENTITY_SYMBOL', '1', 1, 16, '社交身份象征属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (17, '特权', 'NFT_PRIVILEGE', '1', 1, 17, '社交身份特权属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (18, '游戏类型', 'NFT_GAME_TYPE', '1', 1, 18, '游戏类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (19, '道具功能', 'NFT_PROP_FUNCTION', '1', 1, 19, '游戏道具功能属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (20, '获取方式', 'NFT_ACQUISITION_METHOD', '1', 1, 20, '游戏道具获取方式属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (21, '装备部位', 'NFT_EQUIPMENT_POSITION', '1', 1, 21, '游戏装备部位属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (22, '品质', 'NFT_QUALITY', '1', 1, 22, '游戏装备品质属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (23, '职业', 'NFT_PROFESSION', '1', 1, 23, '游戏角色职业属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (24, '等级上限', 'NFT_LEVEL_CAP', '1', 1, 24, '游戏角色等级上限属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (25, '主题', 'NFT_COLLECTION_THEME', '1', 1, 25, '体育项目属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (26, '体育项目', 'NFT_SPORTS', '1', 1, 25, '体育项目属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (27, '赛事类型', 'NFT_COMPETITION_TYPE', '1', 1, 26, '体育赛事类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (28, '历史时期', 'NFT_HISTORICAL_PERIOD', '1', 1, 27, '历史时期属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (29, '文化类型', 'NFT_CULTURE_TYPE', '1', 1, 28, '文化类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (30, '名人领域', 'NFT_CELEBRITY_FIELD', '1', 1, 29, '名人领域属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (31, '周边形式', 'NFT_PERIPHERAL_FORM', '1', 1, 30, '名人周边形式属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (32, '徽章主题', 'NFT_BADGE_THEME', '1', 1, 31, '徽章主题属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (33, '限量数量', 'NFT_LIMITED_QUANTITY', '1', 1, 32, '限量版数量属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (34, '应用领域', 'NFT_APPLICATION_HOUSE', '1', 1, 33, '虚拟应用领域属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (35, '平台', 'NFT_PLATFORM_TYPE', '1', 1, 33, '虚拟房地产平台属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (36, '位置', 'NFT_LOCATION', '1', 1, 34, '虚拟房地产位置属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (37, '面积', 'NFT_AREA', '1', 1, 35, '虚拟房地产面积属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (38, '空间风格', 'NFT_SPACE_STYLE', '1', 1, 36, '虚拟建筑风格属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (39, '空间用途', 'NFT_SPACE_USE', '1', 1, 37, '虚拟建筑用途属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (40, '证书用途', 'NFT_CERT_TYPE_ATTR', '1', 1, 38, '证书用途属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (41, '认证类型', 'NFT_CERT_TYPE', '1', 1, 38, '教育认证类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (42, '颁发机构', 'NFT_ISSUING_ORG', '1', 1, 39, '证书颁发机构属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (43, '会员等级', 'NFT_MEMBER_LEVEL', '1', 1, 40, '会员等级属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (44, '会员权益', 'NFT_MEMBER_RIGHTS', '1', 1, 41, '会员权益属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (45, '活动类型', 'NFT_EVENT_TYPE', '1', 1, 42, '活动类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (46, '座位等级', 'NFT_SEAT_LEVEL', '1', 1, 43, '活动座位等级属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (47, '版权类型', 'NFT_COPYRIGHT_TYPE', '1', 1, 44, '数字版权类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (48, '授权方式', 'NFT_LICENSE_TYPE', '1', 1, 45, '版权授权方式属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (49, '资产类型', 'NFT_ASSET_TYPE_ATTR', '1', 1, 48, '资产类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (50, '债券期限', 'NFT_BOND_PERIOD', '1', 1, 46, '数字债券期限属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (51, '利率类型', 'NFT_INTEREST_TYPE', '1', 1, 47, '债券利率类型属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (52, '资产类别', 'NFT_ASSET_TYPE', '1', 1, 48, '资产凭证类别属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (53, '凭证用途', 'NFT_VOUCHER_USE', '1', 1, 49, '资产凭证用途属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (54, '企业领域', 'NFT_ENTERPRISE_FIELD', '1', 1, 50, '股权企业领域属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (55, '股权比例', 'NFT_EQUITY_RATIO', '1', 1, 51, '股权通证比例属性组', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_attr_group` VALUES (56, '测试属性组', 'T_Gp_001', '1', 0, 1, '这是一个测试的目录属性组222', '2025-04-05 15:27:49', '2025-04-07 21:12:11', 0, '', '');

-- ----------------------------
-- Table structure for sys_category
-- ----------------------------
DROP TABLE IF EXISTS `sys_category`;
CREATE TABLE `sys_category`  (
                                 `id` bigint NOT NULL AUTO_INCREMENT,
                                 `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '编码',
                                 `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
                                 `parent_id` bigint NOT NULL DEFAULT 0 COMMENT '父级id',
                                 `parent_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '父级编码',
                                 `level` int NOT NULL DEFAULT 0 COMMENT '级别',
                                 `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
                                 `status` int NOT NULL DEFAULT 0 COMMENT '状态',
                                 `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图标',
                                 `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                 `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                 `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                 `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                 `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                 PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 201 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_category
-- ----------------------------
INSERT INTO `sys_category` VALUES (1, '100000', 'NFT专区', 0, '', 1, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (2, '200000', '数字素材类', 0, '', 1, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (3, '300000', '学习资源类', 0, '', 1, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (4, '400000', '生活娱乐类', 0, '', 1, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (5, '500000', '会员权益类', 0, '', 1, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (6, '600000', '软件服务类', 0, '', 1, 6, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (7, '110000', '数字艺术品', 1, '100000', 2, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (8, '120000', '虚拟身份', 1, '100000', 2, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (9, '130000', '游戏资产', 1, '100000', 2, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (10, '140000', '收藏品', 1, '100000', 2, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (11, '150000', '虚拟房地产', 1, '100000', 2, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (12, '160000', '数字证书', 1, '100000', 2, 6, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (13, '170000', '金融资产', 1, '100000', 2, 7, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (14, '111000', '潮流艺术画作NFT', 7, '110000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (15, '112000', '先锋音乐作品NFT', 7, '110000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (16, '113000', '视频艺术NFT', 7, '110000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (17, '114000', '文本类型NFT', 7, '110000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (21, '121000', '独特头像NFT', 8, '120000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (22, '122000', '定制虚拟形象NFT', 8, '120000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (23, '123000', '专属社交身份NFT', 8, '120000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (24, '131000', '游戏道具NFT', 9, '130000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (25, '132000', '游戏装备NFT', 9, '130000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (26, '133000', '游戏角色NFT', 9, '130000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (27, '134000', '游戏皮肤NFT', 9, '130000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (28, '135000', '游戏宠物NFT', 9, '130000', 3, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (29, '136000', '游戏建筑NFT', 9, '130000', 3, 6, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (30, '137000', '游戏载具NFT', 9, '130000', 3, 6, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (31, '138000', '游戏土地NFT', 9, '130000', 3, 6, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (39, '141000', '体育赛事纪念NFT', 10, '140000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (40, '142000', '历史文化收藏NFT', 10, '140000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (41, '143000', '名人周边NFT', 10, '140000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (42, '144000', '限量版徽章NFT', 10, '140000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (46, '151000', '元宇宙地块NFT', 11, '150000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (47, '152000', '虚拟建筑NFT', 11, '150000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (49, '161000', '教育认证NFT', 12, '160000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (50, '162000', '会员资格NFT', 12, '160000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (51, '163000', '活动门票NFT', 12, '160000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (52, '164000', '数字版权NFT', 12, '160000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (56, '171000', '数字债券NFT', 13, '170000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (57, '172000', '资产凭证NFT', 13, '170000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (58, '173000', '股权通证NFT', 13, '170000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (59, '210000', '文档模板', 2, '200000', 2, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (60, '220000', '图片素材', 2, '200000', 2, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (61, '230000', '音乐素材', 2, '200000', 2, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (62, '240000', '视频素材', 2, '200000', 2, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (66, '211000', 'Word模板', 59, '210000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (67, '212000', 'Excel模板', 59, '210000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (68, '213000', 'PPT模板', 59, '210000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (69, '214000', 'PDF模板', 59, '210000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (70, '215000', '其它模板', 59, '210000', 3, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (73, '221000', '壁纸', 60, '220000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (74, '222000', '头像', 60, '220000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (75, '223000', '海报', 60, '220000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (76, '224000', '插画', 60, '220000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (80, '231000', '背景音乐', 61, '230000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (81, '232000', '配乐相关', 61, '230000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (82, '233000', '音乐节拍', 61, '230000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (83, '234000', '自然声音', 61, '230000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (84, '235000', '其它音乐', 61, '230000', 3, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (87, '241000', '广告视频', 62, '240000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (88, '242000', '宣传片', 62, '240000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (89, '243000', '教学视频', 62, '240000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (90, '244000', '动画视频', 62, '240000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (91, '245000', '其它视频', 62, '240000', 3, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (94, '310000', '学术资料', 3, '300000', 2, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (95, '320000', '职业技能', 3, '300000', 2, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (96, '330000', '语言学习', 3, '300000', 2, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (97, '340000', '其它学习资源', 3, '300000', 2, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (101, '311000', '论文', 94, '310000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (102, '312000', '书籍', 94, '310000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (103, '313000', '报告', 94, '310000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (104, '314000', '真题', 94, '310000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (105, '315000', '课件', 94, '310000', 3, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (106, '316000', '其它学术资料', 94, '310000', 3, 6, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (108, '321000', '编程', 95, '320000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (109, '322000', '设计', 95, '320000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (110, '323000', '营销', 95, '320000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (111, '324000', '其它技能', 95, '320000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (115, '331000', '英语', 96, '330000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (116, '332000', '日语', 96, '330000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (117, '333000', '韩语', 96, '330000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (118, '334000', '其它语言', 96, '330000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (122, '341000', '考试资料', 97, '340000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (123, '342000', '学习工具', 97, '340000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (124, '343000', '学习方法', 97, '340000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (125, '410000', '影音娱乐', 4, '400000', 2, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (126, '420000', '游戏周边', 4, '400000', 2, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (127, '430000', '兴趣爱好', 4, '400000', 2, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (128, '411000', '电影', 125, '410000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (129, '412000', '电视剧', 125, '410000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (130, '413000', '综艺', 125, '410000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (131, '414000', '动漫', 125, '410000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (132, '415000', '游戏', 125, '410000', 3, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (133, '416000', '其它影音', 125, '410000', 3, 6, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (135, '421000', '虚拟物品', 126, '420000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (136, '422000', '账号服务', 126, '420000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (137, '423000', '辅助工具', 126, '420000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (138, '424000', '游戏服务', 126, '420000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (142, '431000', '运动健身', 127, '430000', 3, 1, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (143, '432000', '摄影摄像', 127, '430000', 3, 2, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (144, '433000', '绘画设计', 127, '430000', 3, 3, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (145, '434000', '音乐舞蹈', 127, '430000', 3, 4, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (146, '435000', '阅读写作', 127, '430000', 3, 5, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (147, '436000', '其它爱好', 127, '430000', 3, 6, 0, '', '2025-03-11 22:26:35', '2025-03-11 22:26:35', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (149, '510000', '视频会员', 5, '500000', 2, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (150, '520000', '音乐会员', 5, '500000', 2, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (151, '530000', '阅读会员', 5, '500000', 2, 3, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (152, '511000', '爱奇艺会员', 149, '510000', 3, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (153, '512000', '腾讯视频会员', 149, '510000', 3, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (154, '513000', '优酷会员', 149, '510000', 3, 3, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (155, '514000', '哔哩哔哩会员', 149, '510000', 3, 4, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (156, '515000', '其它视频会员', 149, '510000', 3, 5, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (159, '521000', '网易云音乐会员', 150, '520000', 3, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (160, '522000', 'QQ音乐会员', 150, '520000', 3, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (161, '523000', '酷狗音乐会员', 150, '520000', 3, 3, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (162, '524000', '酷我音乐会员', 150, '520000', 3, 4, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (163, '525000', '其它音乐会员', 150, '520000', 3, 5, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (166, '531000', '得到会员', 151, '530000', 3, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (167, '532000', '喜马拉雅会员', 151, '530000', 3, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (168, '533000', '其它阅读会员', 151, '530000', 3, 3, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (169, '610000', '安装程序', 6, '600000', 2, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (170, '620000', '激活码', 6, '600000', 2, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (171, '630000', '破解工具', 6, '600000', 2, 3, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (172, '640000', '其它服务', 6, '600000', 2, 4, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (176, '611000', '办公软件', 169, '610000', 3, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (177, '612000', '设计软件', 169, '610000', 3, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (178, '613000', '编程软件', 169, '610000', 3, 3, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (179, '614000', '影音软件', 169, '610000', 3, 4, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (180, '615000', '其它软件', 169, '610000', 3, 5, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (183, '621000', 'Office激活码', 170, '620000', 3, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (184, '622000', '金山办公激活码', 170, '620000', 3, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (185, '623000', '腾讯文档激活码', 170, '620000', 3, 3, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (186, '624000', 'WPS激活码', 170, '620000', 3, 4, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (187, '625000', '其它激活码', 170, '620000', 3, 5, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (190, '631000', 'Office破解工具', 171, '630000', 3, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (191, '632000', '金山办公破解工具', 171, '630000', 3, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (192, '633000', '其它破解工具', 171, '630000', 3, 3, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (193, '641000', '游戏服务', 172, '640000', 3, 1, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (194, '642000', '其它服务项目', 172, '640000', 3, 2, 0, '', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category` VALUES (195, 'CET_001', '测试一级目录', 0, '', 1, 5, 0, '', '2025-04-04 17:52:46', '2025-04-04 17:52:46', 0, '', '');
INSERT INTO `sys_category` VALUES (199, 'T_001', '测试目录2', 0, '', 1, 11, 0, '', '2025-04-04 21:03:11', '2025-04-04 21:03:11', 0, 'admin', 'admin');

-- ----------------------------
-- Table structure for sys_category_attr_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_category_attr_group`;
CREATE TABLE `sys_category_attr_group`  (
                                            `id` bigint NOT NULL AUTO_INCREMENT,
                                            `category_id` bigint NOT NULL DEFAULT 0 COMMENT '商品目录分类id',
                                            `category_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品目录分类编码',
                                            `attr_group_id` bigint NOT NULL DEFAULT 0 COMMENT '属性组id',
                                            `attr_group_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '属性组编码',
                                            `status` int NULL DEFAULT 0 COMMENT '状态',
                                            `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                            `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                            `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                            `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                            `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                            PRIMARY KEY (`id`) USING BTREE,
                                            INDEX `idx_category_id`(`category_id`) USING BTREE,
                                            INDEX `idx_attr_group_id`(`attr_group_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 57 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_category_attr_group
-- ----------------------------
INSERT INTO `sys_category_attr_group` VALUES (1, 1, '100000', 1, 'NFT_APPLICATION_FIELD', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (2, 7, '110000', 2, 'NFT_TECH_FORM', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (3, 14, '111000', 3, 'NFT_ART_STYLE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (4, 14, '111000', 4, 'NFT_ART_THEME', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (5, 15, '112000', 5, 'NFT_CREATION_METHOD', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (6, 15, '112000', 6, 'NFT_MUSIC_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (7, 16, '113000', 7, 'NFT_VIDEO_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (8, 16, '113000', 8, 'NFT_VIDEO_DURATION', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (9, 17, '114000', 9, 'NFT_TEXT_GENRE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (10, 17, '114000', 10, 'NFT_TEXT_LANGUAGE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (11, 8, '120000', 11, 'NFT_APP_PLATFORM', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (12, 21, '121000', 10, 'NFT_TEXT_LANGUAGE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (13, 21, '121000', 13, 'NFT_RARITY', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (14, 22, '122000', 14, 'NFT_CUSTOM_ELEMENT', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (15, 22, '122000', 15, 'NFT_APPLICATION_SCENE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (16, 23, '123000', 16, 'NFT_IDENTITY_SYMBOL', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (17, 23, '123000', 17, 'NFT_PRIVILEGE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (18, 9, '130000', 18, 'NFT_GAME_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (19, 24, '131000', 19, 'NFT_PROP_FUNCTION', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (20, 24, '131000', 20, 'NFT_ACQUISITION_METHOD', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (21, 25, '132000', 21, 'NFT_EQUIPMENT_POSITION', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (22, 25, '132000', 22, 'NFT_QUALITY', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (23, 26, '133000', 23, 'NFT_PROFESSION', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (24, 26, '133000', 24, 'NFT_LEVEL_CAP', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (25, 10, '140000', 25, 'NFT_COLLECTION_THEME', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (26, 39, '141000', 26, 'NFT_SPORTS', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (27, 39, '141000', 27, 'NFT_COMPETITION_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (28, 40, '142000', 28, 'NFT_HISTORICAL_PERIOD', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (29, 40, '142000', 29, 'NFT_CULTURE_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (30, 41, '143000', 30, 'NFT_CELEBRITY_FIELD', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (31, 41, '143000', 31, 'NFT_PERIPHERAL_FORM', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (32, 42, '144000', 32, 'NFT_BADGE_THEME', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (33, 42, '144000', 33, 'NFT_LIMITED_QUANTITY', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (34, 11, '150000', 34, 'NFT_APPLICATION_HOUSE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (35, 46, '151000', 35, 'NFT_PLATFORM_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (36, 46, '151000', 36, 'NFT_LOCATION', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (37, 47, '152000', 38, 'NFT_SPACE_STYLE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (38, 47, '152000', 39, 'NFT_SPACE_USE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (39, 12, '160000', 40, 'NFT_CERT_TYPE_ATTR', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (40, 49, '161000', 41, 'NFT_CERT_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (41, 49, '161000', 42, 'NFT_ISSUING_ORG', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (42, 50, '162000', 43, 'NFT_MEMBER_LEVEL', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (43, 50, '162000', 44, 'NFT_MEMBER_RIGHTS', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (44, 51, '163000', 45, 'NFT_EVENT_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (45, 51, '163000', 46, 'NFT_SEAT_LEVEL', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (46, 52, '164000', 47, 'NFT_COPYRIGHT_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (47, 52, '164000', 48, 'NFT_LICENSE_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (48, 13, '170000', 49, 'NFT_ASSET_TYPE_ATTR', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (49, 56, '171000', 50, 'NFT_BOND_PERIOD', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (50, 56, '171000', 51, 'NFT_INTEREST_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (51, 57, '172000', 52, 'NFT_ASSET_TYPE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (52, 57, '172000', 53, 'NFT_VOUCHER_USE', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (53, 58, '173000', 54, 'NFT_ENTERPRISE_FIELD', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (54, 58, '173000', 55, 'NFT_EQUITY_RATIO', 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_category_attr_group` VALUES (55, 199, 'T_001', 56, 'T_Gp_001', 0, '2025-04-05 15:27:49', '2025-04-05 15:27:49', 0, '', '');
INSERT INTO `sys_category_attr_group` VALUES (56, 199, 'T_001', 57, 'T_GROUP_002', 0, '2025-04-06 19:24:37', '2025-04-06 19:24:37', 0, '', '');
INSERT INTO `sys_category_attr_group` VALUES (57, 199, 'T_001', 58, 'T_GROUP_03', 0, '2025-04-06 19:30:45', '2025-04-06 19:30:45', 0, '', '');

-- ----------------------------
-- Table structure for sys_image
-- ----------------------------
DROP TABLE IF EXISTS `sys_image`;
CREATE TABLE `sys_image`  (
                              `id` bigint NOT NULL AUTO_INCREMENT,
                              `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片编码',
                              `original_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片原始名称',
                              `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '存储文件名称',
                              `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片url',
                              `size` int NOT NULL DEFAULT 0 COMMENT '图片大小',
                              `content_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片类型',
                              `status` int NOT NULL DEFAULT 0 COMMENT '图片状态码',
                              `hash` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片hash',
                              `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                              `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                              `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                              `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                              `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                              PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_image
-- ----------------------------
INSERT INTO `sys_image` VALUES (5, 'products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg', '1742129190143.jpg', 'b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg', 'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg', 99721, 'image/jpeg', 1, 'd5e42efdfd4e76179e8ff5838e772e72', '2025-05-06 23:45:14', '2025-05-06 23:45:14', 0, 'system', 'system');
INSERT INTO `sys_image` VALUES (6, 'products_v1/20250506/8ce560e6-ae45-489e-bc99-38fe7fa105d1.jpg', '1742129377391.jpg', '8ce560e6-ae45-489e-bc99-38fe7fa105d1.jpg', 'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/8ce560e6-ae45-489e-bc99-38fe7fa105d1.jpg', 80082, 'image/jpeg', 1, 'e68e985c8c1ed2de21564c3f75b572c9', '2025-05-06 23:51:15', '2025-05-06 23:51:15', 0, 'system', 'system');
INSERT INTO `sys_image` VALUES (7, 'products_v1/20250509/94250484-efeb-4fea-8a17-40678e4d345c.jpg', '1742129228847.jpg', '94250484-efeb-4fea-8a17-40678e4d345c.jpg', 'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250509/94250484-efeb-4fea-8a17-40678e4d345c.jpg', 64122, 'image/jpeg', 1, 'd3b79e33a0d85a2c1f4405cfa8fab734', '2025-05-09 21:11:51', '2025-05-09 21:11:51', 0, 'system', 'system');

-- ----------------------------
-- Table structure for sys_order
-- ----------------------------
DROP TABLE IF EXISTS `sys_order`;
CREATE TABLE `sys_order`  (
                              `id` bigint NOT NULL AUTO_INCREMENT,
                              `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单编码',
                              `user_id` bigint NOT NULL DEFAULT 0 COMMENT '用户id',
                              `user_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户编码',
                              `order_status` int NOT NULL DEFAULT 0 COMMENT '订单状态',
                              `order_status_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单状态描述',
                              `payment_status` int NOT NULL DEFAULT 0 COMMENT '支付状态',
                              `payment_status_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '支付状态描述',
                              `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '订单日期',
                              `order_amount` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '订单金额',
                              `order_discount` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '订单折扣',
                              `order_total` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '订单总价',
                              `order_remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单备注',
                              `order_pay_type` int NOT NULL DEFAULT 0 COMMENT '支付方式',
                              `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                              `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                              `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                              `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                              `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                              PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_order
-- ----------------------------

-- ----------------------------
-- Table structure for sys_order_after_sale
-- ----------------------------
DROP TABLE IF EXISTS `sys_order_after_sale`;
CREATE TABLE `sys_order_after_sale`  (
                                         `id` bigint NOT NULL AUTO_INCREMENT,
                                         `order_id` bigint NOT NULL DEFAULT 0 COMMENT '订单id',
                                         `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单编码',
                                         `after_sale_type` int NOT NULL DEFAULT 0 COMMENT '售后类型',
                                         `after_sale_type_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '售后类型描述',
                                         `after_sale_status` int NOT NULL DEFAULT 0 COMMENT '售后状态',
                                         `after_sale_status_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '售后状态描述',
                                         `apply_time` datetime NULL DEFAULT NULL COMMENT '申请时间',
                                         `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '售后原因',
                                         `images` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '图片',
                                         `after_sale_remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '售后备注',
                                         `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                         `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                         `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                         `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                         `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                         PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_order_after_sale
-- ----------------------------

-- ----------------------------
-- Table structure for sys_order_delivery_address
-- ----------------------------
DROP TABLE IF EXISTS `sys_order_delivery_address`;
CREATE TABLE `sys_order_delivery_address`  (
                                               `id` bigint NOT NULL AUTO_INCREMENT,
                                               `order_id` bigint NOT NULL DEFAULT 0 COMMENT '订单id',
                                               `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单编码',
                                               `user_id` bigint NOT NULL DEFAULT 0 COMMENT '用户id',
                                               `user_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户编码',
                                               `receiver_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '收货人姓名',
                                               `receiver_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '收货人手机号',
                                               `province_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '省编码',
                                               `province_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '省名称',
                                               `city_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '市编码',
                                               `city_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '市名称',
                                               `area_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '区编码',
                                               `area_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '区名称',
                                               `detail_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '详细地址',
                                               `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                               `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                               `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                               `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                               `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                               PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_order_delivery_address
-- ----------------------------

-- ----------------------------
-- Table structure for sys_order_logistics
-- ----------------------------
DROP TABLE IF EXISTS `sys_order_logistics`;
CREATE TABLE `sys_order_logistics`  (
                                        `id` bigint NOT NULL AUTO_INCREMENT,
                                        `order_id` bigint NOT NULL DEFAULT 0 COMMENT '订单id',
                                        `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单编码',
                                        `logistics_company_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '物流公司编码',
                                        `logistics_company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '物流公司名称',
                                        `logistics_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '物流单号',
                                        `logistics_status` int NOT NULL DEFAULT 0 COMMENT '物流状态',
                                        `logistics_status_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '物流状态描述',
                                        `ship_time` datetime NULL DEFAULT NULL COMMENT '发货时间',
                                        `expect_delivery_time` datetime NULL DEFAULT NULL COMMENT '预计送达时间',
                                        `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                        `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                        `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                        `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                        `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                        PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_order_logistics
-- ----------------------------

-- ----------------------------
-- Table structure for sys_order_payment
-- ----------------------------
DROP TABLE IF EXISTS `sys_order_payment`;
CREATE TABLE `sys_order_payment`  (
                                      `id` bigint NOT NULL AUTO_INCREMENT,
                                      `order_id` bigint NOT NULL DEFAULT 0 COMMENT '订单id',
                                      `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单编码',
                                      `payment_type` int NOT NULL DEFAULT 0 COMMENT '支付方式',
                                      `payment_type_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '支付方式描述',
                                      `payment_amount` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '支付金额',
                                      `payment_time` datetime NULL DEFAULT NULL COMMENT '支付时间',
                                      `payment_status` int NOT NULL DEFAULT 0 COMMENT '支付状态',
                                      `payment_status_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '支付状态描述',
                                      `channel_payment_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '渠道支付单号',
                                      `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                      `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                      `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                      `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                      `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                      PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_order_payment
-- ----------------------------

-- ----------------------------
-- Table structure for sys_order_product
-- ----------------------------
DROP TABLE IF EXISTS `sys_order_product`;
CREATE TABLE `sys_order_product`  (
                                      `id` bigint NOT NULL AUTO_INCREMENT,
                                      `order_id` bigint NOT NULL DEFAULT 0 COMMENT '订单id',
                                      `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单编码',
                                      `spu_id` bigint NOT NULL DEFAULT 0 COMMENT 'spu id',
                                      `spu_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'spu编码',
                                      `sku_id` bigint NOT NULL DEFAULT 0 COMMENT 'sku id',
                                      `sku_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'sku编码',
                                      `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品名称',
                                      `product_price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '商品价格',
                                      `product_quantity` int NOT NULL DEFAULT 0 COMMENT '商品数量',
                                      `product_total` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '商品总价',
                                      `product_remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品备注',
                                      `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                      `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                      `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                      `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                      `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                      PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_order_product
-- ----------------------------

-- ----------------------------
-- Table structure for sys_order_reviews
-- ----------------------------
DROP TABLE IF EXISTS `sys_order_reviews`;
CREATE TABLE `sys_order_reviews`  (
                                      `id` bigint NOT NULL AUTO_INCREMENT,
                                      `order_id` bigint NOT NULL DEFAULT 0 COMMENT '订单id',
                                      `order_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单编码',
                                      `user_id` bigint NOT NULL DEFAULT 0 COMMENT '用户id',
                                      `user_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户编码',
                                      `product_id` bigint NOT NULL DEFAULT 0 COMMENT '商品id',
                                      `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '评价内容',
                                      `rating` int NOT NULL DEFAULT 0 COMMENT '评分',
                                      `review_time` datetime NULL DEFAULT NULL COMMENT '评价时间',
                                      `images` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '图片',
                                      `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                      `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                      `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                      `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                      `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                      PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_order_reviews
-- ----------------------------

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission`  (
                                   `id` bigint NOT NULL AUTO_INCREMENT,
                                   `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '权限名称',
                                   `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '权限编码',
                                   `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '权限描述',
                                   `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                   `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                   `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                   `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                   `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                   PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------
INSERT INTO `sys_permission` VALUES (1, 'FORBIDDEN', '-10000', '禁止操作', '2025-03-16 20:56:57', '2025-03-16 20:56:57', 0, '', '');
INSERT INTO `sys_permission` VALUES (2, 'ADD', 'P0001', '增加', '2025-03-16 20:56:57', '2025-03-16 20:56:57', 0, '', '');
INSERT INTO `sys_permission` VALUES (3, 'DELETE', 'P0002', '删除', '2025-03-16 20:56:57', '2025-03-16 20:56:57', 0, '', '');
INSERT INTO `sys_permission` VALUES (4, 'EDIT', 'P0003', '编辑', '2025-03-16 20:56:57', '2025-03-16 20:56:57', 0, '', '');
INSERT INTO `sys_permission` VALUES (5, 'SELECT', 'P004', '查询', '2025-03-16 20:56:57', '2025-03-16 20:56:57', 0, '', '');

-- ----------------------------
-- Table structure for sys_product_sku
-- ----------------------------
DROP TABLE IF EXISTS `sys_product_sku`;
CREATE TABLE `sys_product_sku`  (
                                    `id` bigint NOT NULL AUTO_INCREMENT,
                                    `product_spu_id` bigint NOT NULL DEFAULT 0 COMMENT '商品spu id',
                                    `product_spu_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品spu编码',
                                    `sku_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'sku编码',
                                    `price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '价格',
                                    `stock` int NOT NULL DEFAULT 0 COMMENT '库存',
                                    `sale_count` int NOT NULL COMMENT '销量',
                                    `status` int NOT NULL COMMENT '状态',
                                    `indexs` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '规格索引',
                                    `attr_params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '属性参数json',
                                    `owner_params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '属性参数json',
                                    `images` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '图片',
                                    `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
                                    `sub_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '副标题',
                                    `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '描述',
                                    `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                    `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                    `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                    `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                    `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                    PRIMARY KEY (`id`) USING BTREE,
                                    UNIQUE INDEX `uk_sku_code`(`sku_code`) USING BTREE,
                                    INDEX `idx_product_spu_id`(`product_spu_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_product_sku
-- ----------------------------

-- ----------------------------
-- Table structure for sys_product_spu
-- ----------------------------
DROP TABLE IF EXISTS `sys_product_spu`;
CREATE TABLE `sys_product_spu`  (
                                    `id` bigint NOT NULL AUTO_INCREMENT,
                                    `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '编码',
                                    `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
                                    `category1_id` bigint NOT NULL DEFAULT 0 COMMENT '商品目录1分类id',
                                    `category1_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品目录分类编码',
                                    `category2_id` bigint NOT NULL DEFAULT 0 COMMENT '商品目录2分类id',
                                    `category2_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品目录2分类编码',
                                    `category3_id` bigint NOT NULL DEFAULT 0 COMMENT '商品目录3分类id',
                                    `category3_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品目录3分类编码',
                                    `total_sales` int NOT NULL DEFAULT 0 COMMENT '总销量',
                                    `total_stock` int NOT NULL DEFAULT 0 COMMENT '总库存',
                                    `brand` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '品牌',
                                    `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '描述',
                                    `price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '价格',
                                    `real_price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '原价',
                                    `status` int NOT NULL DEFAULT 0 COMMENT '状态',
                                    `images` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片',
                                    `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                    `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                    `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                    `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                    `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                    PRIMARY KEY (`id`) USING BTREE,
                                    UNIQUE INDEX `uk_code`(`code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 123 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_product_spu
-- ----------------------------
INSERT INTO `sys_product_spu` VALUES (1, 'SPU_ART_PAINT_001', '未来城市艺术画作NFT', 1, '100000', 7, '110000', 14, '111000', 45, 100, 'FutureArt', '限量版未来城市艺术画作NFT，由知名数字艺术家创作', 1999.00, 2499.00, 1, 'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg,https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/8ce560e6-ae45-489e-bc99-38fe7fa105d1.jpg', '2025-03-11 22:26:36', '2025-05-06 23:51:46', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (2, 'SPU_ART_PAINT_002', '抽象几何艺术画作NFT', 1, '100000', 7, '110000', 14, '111000', 38, 80, 'GeoArt', '限量版抽象几何艺术画作NFT，现代艺术杰作', 1599.00, 1999.00, 1, 'http://example.com/images/abstract_geo_art.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (3, 'SPU_ART_PAINT_003', '赛博朋克艺术画作NFT', 1, '100000', 7, '110000', 14, '111000', 52, 90, 'CyberArt', '限量版赛博朋克风格艺术画作NFT，科技与反乌托邦的完美融合', 2299.00, 2799.00, 1, 'http://example.com/images/cyberpunk_art.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (4, 'SPU_ART_PAINT_004', '波普艺术画作NFT', 1, '100000', 7, '110000', 14, '111000', 35, 70, 'PopArt', '限量版波普艺术风格画作NFT，现代流行文化的艺术表达', 1799.00, 2199.00, 1, 'http://example.com/images/pop_art.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (5, 'SPU_ART_PAINT_005', '东方水墨艺术画作NFT', 1, '100000', 7, '110000', 14, '111000', 42, 85, 'InkArt', '限量版东方水墨风格艺术画作NFT，传统与现代的完美结合', 2499.00, 2999.00, 1, 'http://example.com/images/ink_art.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (6, 'SPU_MUSIC_001', '电子音乐专辑NFT', 1, '100000', 7, '110000', 15, '112000', 65, 100, 'ElectroBeats', '限量版电子音乐专辑NFT，包含独家音轨', 899.00, 1199.00, 1, 'http://example.com/images/electronic_music.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (7, 'SPU_MUSIC_002', '实验爵士乐NFT', 1, '100000', 7, '110000', 15, '112000', 48, 80, 'JazzFusion', '限量版实验爵士乐NFT，融合多种音乐元素', 1099.00, 1399.00, 1, 'http://example.com/images/jazz_fusion.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (8, 'SPU_MUSIC_003', '环境音乐作品NFT', 1, '100000', 7, '110000', 15, '112000', 55, 90, 'AmbientSounds', '限量版环境音乐作品NFT，沉浸式声音体验', 799.00, 999.00, 1, 'http://example.com/images/ambient_music.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (9, 'SPU_MUSIC_004', '先锋古典音乐NFT', 1, '100000', 7, '110000', 15, '112000', 42, 75, 'NeoClassical', '限量版先锋古典音乐NFT，传统与现代的碰撞', 1299.00, 1599.00, 1, 'http://example.com/images/neo_classical.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (10, 'SPU_MUSIC_005', '世界音乐融合NFT', 1, '100000', 7, '110000', 15, '112000', 58, 85, 'WorldFusion', '限量版世界音乐融合NFT，多元文化的音乐对话', 999.00, 1299.00, 1, 'http://example.com/images/world_fusion.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (11, 'SPU_VIDEO_ART_001', '抽象动态艺术NFT', 1, '100000', 7, '110000', 16, '113000', 62, 100, 'MotionArt', '限量版抽象动态艺术NFT，视觉与情感的流动表达', 1899.00, 2299.00, 1, 'http://example.com/images/abstract_motion.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (12, 'SPU_VIDEO_ART_002', '数字生命模拟NFT', 1, '100000', 7, '110000', 16, '113000', 55, 80, 'DigitalLife', '限量版数字生命模拟NFT，算法生成的生命演化', 2199.00, 2599.00, 1, 'http://example.com/images/digital_life.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (13, 'SPU_VIDEO_ART_003', '沉浸式风景NFT', 1, '100000', 7, '110000', 16, '113000', 68, 90, 'ImmersiveLandscape', '限量版沉浸式风景NFT，超现实自然景观', 1699.00, 1999.00, 1, 'http://example.com/images/immersive_landscape.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (14, 'SPU_VIDEO_ART_004', '数字舞蹈表演NFT', 1, '100000', 7, '110000', 16, '113000', 50, 75, 'DigitalDance', '限量版数字舞蹈表演NFT，身体与数字的对话', 1599.00, 1899.00, 1, 'http://example.com/images/digital_dance.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (15, 'SPU_VIDEO_ART_005', '城市脉动NFT', 1, '100000', 7, '110000', 16, '113000', 60, 85, 'UrbanPulse', '限量版城市脉动NFT，城市生活的视觉韵律', 1799.00, 2099.00, 1, 'http://example.com/images/urban_pulse.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (16, 'SPU_TEXT_ART_001', '数字诗歌集NFT', 1, '100000', 7, '110000', 17, '114000', 45, 100, 'DigitalPoetry', '限量版数字诗歌集NFT，文字与视觉的艺术融合', 899.00, 1199.00, 1, 'http://example.com/images/digital_poetry.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (17, 'SPU_TEXT_ART_002', '实验小说NFT', 1, '100000', 7, '110000', 17, '114000', 38, 80, 'NovelArt', '限量版实验小说NFT，打破传统叙事结构', 1099.00, 1399.00, 1, 'http://example.com/images/experimental_novel.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (18, 'SPU_TEXT_ART_003', '数字剧本NFT', 1, '100000', 7, '110000', 17, '114000', 42, 90, 'ScriptArt', '限量版数字剧本NFT，创新戏剧文本', 999.00, 1299.00, 1, 'http://example.com/images/digital_script.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (19, 'SPU_TEXT_ART_004', '概念文本艺术NFT', 1, '100000', 7, '110000', 17, '114000', 35, 75, 'ConceptText', '限量版概念文本艺术NFT，文字的视觉实验', 799.00, 999.00, 1, 'http://example.com/images/concept_text.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (20, 'SPU_TEXT_ART_005', '数字散文集NFT', 1, '100000', 7, '110000', 17, '114000', 40, 85, 'EssayArt', '限量版数字散文集NFT，思想与文字的艺术', 899.00, 1199.00, 1, 'http://example.com/images/digital_essays.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (21, 'SPU_AVATAR_001', '未来科技头像NFT', 1, '100000', 8, '120000', 21, '121000', 75, 100, 'FutureAvatar', '限量版未来科技风格头像NFT，彰显数字身份', 599.00, 799.00, 1, 'http://example.com/images/future_avatar.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (22, 'SPU_AVATAR_002', '幻想生物头像NFT', 1, '100000', 8, '120000', 21, '121000', 68, 80, 'FantasyAvatar', '限量版幻想生物头像NFT，奇幻世界的化身', 699.00, 899.00, 1, 'http://example.com/images/fantasy_avatar.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (23, 'SPU_AVATAR_003', '抽象艺术头像NFT', 1, '100000', 8, '120000', 21, '121000', 62, 90, 'AbstractAvatar', '限量版抽象艺术头像NFT，艺术表达的数字身份', 499.00, 699.00, 1, 'http://example.com/images/abstract_avatar.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (24, 'SPU_AVATAR_004', '复古像素头像NFT', 1, '100000', 8, '120000', 21, '121000', 70, 85, 'PixelAvatar', '限量版复古像素风格头像NFT，怀旧游戏风格', 399.00, 599.00, 1, 'http://example.com/images/pixel_avatar.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (25, 'SPU_AVATAR_005', '动物拟人头像NFT', 1, '100000', 8, '120000', 21, '121000', 65, 95, 'AnimalAvatar', '限量版动物拟人头像NFT，个性化动物形象', 599.00, 799.00, 1, 'http://example.com/images/animal_avatar.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (26, 'SPU_VIRTUAL_CHAR_001', '3D全身虚拟形象NFT', 1, '100000', 8, '120000', 22, '122000', 55, 100, 'VirtualSelf', '限量版3D全身虚拟形象NFT，元宇宙中的数字分身', 1999.00, 2499.00, 1, 'http://example.com/images/3d_avatar.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (27, 'SPU_VIRTUAL_CHAR_002', '动漫风格虚拟形象NFT', 1, '100000', 8, '120000', 22, '122000', 65, 90, 'AnimeAvatar', '限量版动漫风格虚拟形象NFT，二次元数字身份', 1499.00, 1899.00, 1, 'http://example.com/images/anime_avatar.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (28, 'SPU_VIRTUAL_CHAR_003', '赛博朋克虚拟形象NFT', 1, '100000', 8, '120000', 22, '122000', 58, 85, 'CyberAvatar', '限量版赛博朋克虚拟形象NFT，未来科技风格', 1799.00, 2199.00, 1, 'http://example.com/images/cyberpunk_avatar.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (29, 'SPU_VIRTUAL_CHAR_004', '奇幻种族虚拟形象NFT', 1, '100000', 8, '120000', 22, '122000', 52, 80, 'FantasyAvatar', '限量版奇幻种族虚拟形象NFT，魔幻世界的化身', 1699.00, 2099.00, 1, 'http://example.com/images/fantasy_character.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (30, 'SPU_VIRTUAL_CHAR_005', '未来运动员虚拟形象NFT', 1, '100000', 8, '120000', 22, '122000', 60, 90, 'SportAvatar', '限量版未来运动员虚拟形象NFT，电竞与体育的融合', 1599.00, 1999.00, 1, 'http://example.com/images/future_athlete.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (31, 'SPU_SOCIAL_ID_001', '社交媒体身份包NFT', 1, '100000', 8, '120000', 23, '123000', 70, 100, 'SocialID', '限量版社交媒体身份包NFT，全平台统一形象', 999.00, 1299.00, 1, 'http://example.com/images/social_identity.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (32, 'SPU_SOCIAL_ID_002', '专业创作者身份NFT', 1, '100000', 8, '120000', 23, '123000', 60, 80, 'CreatorID', '限量版专业创作者身份NFT，展示专业形象', 1299.00, 1599.00, 1, 'http://example.com/images/creator_identity.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (33, 'SPU_SOCIAL_ID_003', '游戏玩家身份NFT', 1, '100000', 8, '120000', 23, '123000', 75, 90, 'GamerID', '限量版游戏玩家身份NFT，游戏平台统一形象', 899.00, 1199.00, 1, 'http://example.com/images/gamer_identity.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (34, 'SPU_SOCIAL_ID_004', '商业品牌身份NFT', 1, '100000', 8, '120000', 23, '123000', 55, 75, 'BrandID', '限量版商业品牌身份NFT，专业商业形象', 1499.00, 1899.00, 1, 'http://example.com/images/business_identity.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (35, 'SPU_SOCIAL_ID_005', '虚拟影响者身份NFT', 1, '100000', 8, '120000', 23, '123000', 65, 85, 'InfluencerID', '限量版虚拟影响者身份NFT，打造数字KOL形象', 1299.00, 1699.00, 1, 'http://example.com/images/influencer_identity.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (36, 'SPU_GAME_ITEM_001', '传奇武器NFT', 1, '100000', 9, '130000', 24, '131000', 85, 100, 'LegendaryGear', '限量版传奇武器NFT，跨游戏平台使用', 1299.00, 1599.00, 1, 'http://example.com/images/legendary_weapon.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (37, 'SPU_GAME_ITEM_002', '稀有防具NFT', 1, '100000', 9, '130000', 24, '131000', 75, 90, 'EpicArmor', '限量版稀有防具NFT，跨游戏平台使用', 1199.00, 1499.00, 1, 'http://example.com/images/epic_armor.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (38, 'SPU_GAME_ITEM_003', '魔法宠物NFT', 1, '100000', 9, '130000', 24, '131000', 80, 95, 'MagicPet', '限量版魔法宠物NFT，跨游戏平台使用', 1399.00, 1699.00, 1, 'http://example.com/images/magic_pet.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (39, 'SPU_GAME_ITEM_004', '神秘法术卷轴NFT', 1, '100000', 9, '130000', 24, '131000', 70, 85, 'MysticScroll', '限量版神秘法术卷轴NFT，跨游戏平台使用', 999.00, 1299.00, 1, 'http://example.com/images/mystic_scroll.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (40, 'SPU_GAME_ITEM_005', '稀有游戏载具NFT', 1, '100000', 9, '130000', 24, '131000', 65, 80, 'RareVehicle', '限量版稀有游戏载具NFT，跨游戏平台使用', 1599.00, 1899.00, 1, 'http://example.com/images/rare_vehicle.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (41, 'CQYX_001', '传奇英雄角色NFT', 1, '100000', 9, '130000', 26, '133000', 60, 100, 'LegendaryHero', '限量版传奇英雄角色NFT，跨游戏平台使用', 2499.00, 2999.00, 1, 'http://example.com/images/legendary_hero.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (42, 'XYGWJS_001', '稀有怪物角色NFT', 1, '100000', 9, '130000', 26, '133000', 55, 85, 'RareMonster', '限量版稀有怪物角色NFT，跨游戏平台使用', 1999.00, 2499.00, 1, 'http://example.com/images/rare_monster.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (43, 'JJZS_003', '机甲战士角色NFT', 1, '100000', 9, '130000', 26, '133000', 65, 90, 'MechWarrior', '限量版机甲战士角色NFT，跨游戏平台使用', 2299.00, 2799.00, 1, 'http://example.com/images/mech_warrior.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (44, 'SHSW_004', '神话生物角色NFT', 1, '100000', 9, '130000', 26, '133000', 50, 80, 'MythicalBeing', '限量版神话生物角色NFT，跨游戏平台使用', 2199.00, 2699.00, 1, 'http://example.com/images/mythical_being.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (45, 'SPU_GAME_CHAR_005', '未来战士角色NFT', 1, '100000', 9, '130000', 26, '133000', 70, 95, 'FutureWarrior', '限量版未来战士角色NFT，跨游戏平台使用', 2399.00, 2899.00, 1, 'http://example.com/images/future_warrior.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (46, 'SPU_GAME_LAND_001', '元宇宙黄金地段NFT', 1, '100000', 9, '130000', 31, '138000', 40, 100, 'PrimeLand', '限量版元宇宙黄金地段NFT，核心商业区位置', 9999.00, 12999.00, 1, 'http://example.com/images/prime_land.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (47, 'SPU_GAME_LAND_002', '奇幻世界地块NFT', 1, '100000', 9, '130000', 31, '138000', 35, 80, 'FantasyLand', '限量版奇幻世界地块NFT，魔法森林区域', 7999.00, 9999.00, 1, 'http://example.com/images/fantasy_land.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (48, 'SPU_GAME_LAND_003', '科幻城市地块NFT', 1, '100000', 9, '130000', 31, '138000', 45, 90, 'CyberLand', '限量版科幻城市地块NFT，高科技区域', 8999.00, 10999.00, 1, 'http://example.com/images/cyber_land.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (49, 'SPU_GAME_LAND_004', '海洋世界地块NFT', 1, '100000', 9, '130000', 31, '138000', 30, 75, 'OceanLand', '限量版海洋世界地块NFT，水下王国区域', 7499.00, 9499.00, 1, 'http://example.com/images/ocean_land.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (50, 'SPU_GAME_LAND_005', '太空基地地块NFT', 1, '100000', 9, '130000', 31, '138000', 25, 60, 'SpaceLand', '限量版太空基地地块NFT，星际前哨区域', 8499.00, 10499.00, 1, 'http://example.com/images/space_land.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (51, 'CQWQPF_001', '传奇武器皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 85, 100, 'LegendarySkin', '限量版传奇武器皮肤NFT，跨游戏平台使用', 899.00, 1199.00, 1, 'http://example.com/images/legendary_weapon_skin.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (52, 'SPU_GAME_SKIN_002', '稀有角色皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 80, 95, 'RareSkin', '限量版稀有角色皮肤NFT，跨游戏平台使用', 999.00, 1299.00, 1, 'http://example.com/images/rare_character_skin.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (53, 'XDZJPF_003', '限定载具皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 70, 85, 'LimitedVehicleSkin', '限量版载具皮肤NFT，跨游戏平台使用', 799.00, 1099.00, 1, 'http://example.com/images/limited_vehicle_skin.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (54, 'CSJZBPF_004', '传说级装备皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 65, 80, 'MythicGearSkin', '限量版传说级装备皮肤NFT，跨游戏平台使用', 1099.00, 1399.00, 1, 'http://example.com/images/mythic_gear_skin.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (55, 'KHCWPF_005', '科幻宠物皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 75, 90, 'SciFiPetSkin', '限量版科幻宠物皮肤NFT，跨游戏平台使用', 699.00, 999.00, 1, 'http://example.com/images/scifi_pet_skin.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (56, 'SPU_GAME_EQUIP_001', '传奇套装NFT', 1, '100000', 9, '130000', 25, '132000', 60, 100, 'LegendarySet', '限量版传奇套装NFT，跨游戏平台使用', 2999.00, 3999.00, 1, 'http://example.com/images/legendary_set.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (57, 'SPU_GAME_EQUIP_002', '稀有武器NFT', 1, '100000', 9, '130000', 25, '132000', 75, 90, 'RareWeapon', '限量版稀有武器NFT，跨游戏平台使用', 1999.00, 2499.00, 1, 'http://example.com/images/rare_weapon.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (58, 'SPU_GAME_EQUIP_003', '神话防具NFT', 1, '100000', 9, '130000', 25, '132000', 65, 85, 'MythicArmor', '限量版神话防具NFT，跨游戏平台使用', 2499.00, 2999.00, 1, 'http://example.com/images/mythic_armor.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (59, 'SPU_GAME_EQUIP_004', '科幻装备NFT', 1, '100000', 9, '130000', 25, '132000', 70, 90, 'SciFiGear', '限量版科幻装备NFT，跨游戏平台使用', 2299.00, 2799.00, 1, 'http://example.com/images/scifi_gear.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (60, 'SPU_GAME_EQUIP_005', '元素法器NFT', 1, '100000', 9, '130000', 25, '132000', 55, 80, 'ElementalArtifact', '限量版元素法器NFT，跨游戏平台使用', 2199.00, 2699.00, 1, 'http://example.com/images/elemental_artifact.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (61, 'SPU_GAME_PET_001', '传奇龙宠NFT', 1, '100000', 9, '130000', 28, '135000', 60, 100, 'LegendaryDragon', '限量版传奇龙宠NFT，跨游戏平台使用', 2499.00, 2999.00, 1, 'http://example.com/images/legendary_dragon.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (62, 'SPU_GAME_PET_002', '稀有神兽NFT', 1, '100000', 9, '130000', 28, '135000', 55, 85, 'MythicalBeast', '限量版稀有神兽NFT，跨游戏平台使用', 2299.00, 2799.00, 1, 'http://example.com/images/mythical_beast.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (63, 'SPU_GAME_PET_003', '机械宠物NFT', 1, '100000', 9, '130000', 28, '135000', 65, 90, 'MechPet', '限量版机械宠物NFT，跨游戏平台使用', 1999.00, 2499.00, 1, 'http://example.com/images/mech_pet.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (64, 'SPU_GAME_PET_004', '元素精灵NFT', 1, '100000', 9, '130000', 28, '135000', 70, 95, 'ElementalSpirit', '限量版元素精灵NFT，跨游戏平台使用', 1899.00, 2399.00, 1, 'http://example.com/images/elemental_spirit.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (65, 'SPU_GAME_PET_005', '外星生物NFT', 1, '100000', 9, '130000', 28, '135000', 50, 80, 'AlienCreature', '限量版外星生物NFT，跨游戏平台使用', 2099.00, 2599.00, 1, 'http://example.com/images/alien_creature.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (66, 'SPU_GAME_ITEM_001_N1', '传奇魔法卷轴NFT', 1, '100000', 9, '130000', 24, '131000', 60, 100, 'LegendaryScroll', '限量版传奇魔法卷轴NFT，跨游戏平台使用', 1499.00, 1999.00, 1, 'http://example.com/images/legendary_scroll.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (67, 'SMBX_002', '神秘宝箱NFT', 1, '100000', 9, '130000', 24, '131000', 75, 90, 'MysteryChest', '限量版神秘宝箱NFT，跨游戏平台使用', 1299.00, 1799.00, 1, 'http://example.com/images/mystery_chest.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (68, 'MFYS_003', '魔法药水NFT', 1, '100000', 9, '130000', 24, '131000', 85, 95, 'MagicPotion', '限量版魔法药水NFT，跨游戏平台使用', 999.00, 1499.00, 1, 'http://example.com/images/magic_potion.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (69, 'SMSP_004', '神器碎片NFT', 1, '100000', 9, '130000', 24, '131000', 65, 85, 'ArtifactShard', '限量版神器碎片NFT，跨游戏平台使用', 1799.00, 2299.00, 1, 'http://example.com/images/artifact_shard.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (70, 'KJZZ_005', '科技装置NFT', 1, '100000', 9, '130000', 24, '131000', 70, 90, 'TechGadget', '限量版科技装置NFT，跨游戏平台使用', 1599.00, 2099.00, 1, 'http://example.com/images/tech_gadget.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (71, 'QHCB_001', '奇幻城堡NFT', 1, '100000', 9, '130000', 29, '136000', 40, 100, 'FantasyCastle', '限量版奇幻城堡NFT，跨游戏平台使用', 4999.00, 5999.00, 1, 'http://example.com/images/fantasy_castle.png', '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (72, 'WLCSJZ_002', '未来城市建筑NFT', 1, '100000', 9, '130000', 29, '136000', 35, 90, 'FutureCity', '限量版未来城市建筑NFT，跨游戏平台使用', 4599.00, 5599.00, 1, 'http://example.com/images/future_city.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (73, 'SMSD_003', '神秘神殿NFT', 1, '100000', 9, '130000', 29, '136000', 45, 85, 'MysticalTemple', '限量版神秘神殿NFT，跨游戏平台使用', 4799.00, 5799.00, 1, 'http://example.com/images/mystical_temple.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (74, 'FKDY_004', '浮空岛屿NFT', 1, '100000', 9, '130000', 29, '136000', 30, 80, 'FloatingIsland', '限量版浮空岛屿NFT，跨游戏平台使用', 5299.00, 6299.00, 1, 'http://example.com/images/floating_island.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (75, 'GDYJ_005', '古代遗迹NFT', 1, '100000', 9, '130000', 29, '136000', 25, 75, 'AncientRuins', '限量版古代遗迹NFT，跨游戏平台使用', 4399.00, 5399.00, 1, 'http://example.com/images/ancient_ruins.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (76, 'SPU_GAME_VEHICLE_001', '传奇飞船NFT', 1, '100000', 9, '130000', 30, '137000', 50, 100, 'LegendarySpaceship', '限量版传奇飞船NFT，跨游戏平台使用', 3999.00, 4999.00, 1, 'http://example.com/images/legendary_spaceship.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (77, 'SPU_GAME_VEHICLE_002', '战斗机甲NFT', 1, '100000', 9, '130000', 30, '137000', 45, 90, 'BattleMech', '限量版战斗机甲NFT，跨游戏平台使用', 3799.00, 4799.00, 1, 'http://example.com/images/battle_mech.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (78, 'SPU_GAME_VEHICLE_003', '奇幻坐骑NFT', 1, '100000', 9, '130000', 30, '137000', 55, 85, 'FantasyMount', '限量版奇幻坐骑NFT，跨游戏平台使用', 2999.00, 3999.00, 1, 'http://example.com/images/fantasy_mount.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (79, 'SPU_GAME_VEHICLE_004', '赛车NFT', 1, '100000', 9, '130000', 30, '137000', 60, 95, 'RacingCar', '限量版赛车NFT，跨游戏平台使用', 2799.00, 3799.00, 1, 'http://example.com/images/racing_car.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (80, 'SPU_GAME_VEHICLE_005', '潜水艇NFT', 1, '100000', 9, '130000', 30, '137000', 40, 80, 'Submarine', '限量版潜水艇NFT，跨游戏平台使用', 3599.00, 4599.00, 1, 'http://example.com/images/submarine.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (81, 'SPU_GAME_CHAR_001', '传奇英雄角色NFT', 1, '100000', 9, '130000', 26, '133000', 60, 100, 'LegendaryHero', '限量版传奇英雄角色NFT，跨游戏平台使用', 5999.00, 7999.00, 1, 'http://example.com/images/legendary_hero.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (82, 'SPU_GAME_CHAR_002', '神话生物角色NFT', 1, '100000', 9, '130000', 26, '133000', 55, 90, 'MythicalCreature', '限量版神话生物角色NFT，跨游戏平台使用', 5599.00, 7599.00, 1, 'http://example.com/images/mythical_creature.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (83, 'SPU_GAME_CHAR_003', '未来战士角色NFT', 1, '100000', 9, '130000', 26, '133000', 65, 85, 'FutureWarrior', '限量版未来战士角色NFT，跨游戏平台使用', 5799.00, 7799.00, 1, 'http://example.com/images/future_warrior.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (84, 'SPU_GAME_CHAR_004', '魔法师角色NFT', 1, '100000', 9, '130000', 26, '133000', 70, 95, 'MagicWizard', '限量版魔法师角色NFT，跨游戏平台使用', 5499.00, 7499.00, 1, 'http://example.com/images/magic_wizard.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (85, 'YXSWJS_005', '异形生物角色NFT', 1, '100000', 9, '130000', 26, '133000', 50, 80, 'AlienCreature', '限量版异形生物角色NFT，跨游戏平台使用', 5899.00, 7899.00, 1, 'http://example.com/images/alien_creature.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (86, 'CQLQW_001', '传奇龙宠NFT', 1, '100000', 9, '130000', 28, '135000', 60, 100, 'LegendaryDragon', '限量版传奇龙宠NFT，跨游戏平台使用', 2999.00, 3999.00, 1, 'http://example.com/images/legendary_dragon.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (87, 'SMJLCW_002', '神秘精灵宠物NFT', 1, '100000', 9, '130000', 28, '135000', 55, 90, 'MysticalFairy', '限量版神秘精灵宠物NFT，跨游戏平台使用', 2799.00, 3799.00, 1, 'http://example.com/images/mystical_fairy.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (88, 'JXCW_003', '机械宠物NFT', 1, '100000', 9, '130000', 28, '135000', 65, 85, 'MechanicalPet', '限量版机械宠物NFT，跨游戏平台使用', 2899.00, 3899.00, 1, 'http://example.com/images/mechanical_pet.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (89, 'HSCW_004', '幻兽宠物NFT', 1, '100000', 9, '130000', 28, '135000', 70, 95, 'MythicalBeast', '限量版幻兽宠物NFT，跨游戏平台使用', 2699.00, 3699.00, 1, 'http://example.com/images/mythical_beast.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (90, 'YSJLCW_005', '元素精灵宠物NFT', 1, '100000', 9, '130000', 28, '135000', 50, 80, 'ElementalSpirit', '限量版元素精灵宠物NFT，跨游戏平台使用', 2599.00, 3599.00, 1, 'http://example.com/images/elemental_spirit.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (91, 'CQWQ_001', '传奇武器NFT', 1, '100000', 9, '130000', 25, '132000', 60, 100, 'LegendaryWeapon', '限量版传奇武器NFT，跨游戏平台使用', 1999.00, 2999.00, 1, 'http://example.com/images/legendary_weapon.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (92, 'SHFJ_002', '神话防具NFT', 1, '100000', 9, '130000', 25, '132000', 55, 90, 'MythicalArmor', '限量版神话防具NFT，跨游戏平台使用', 1899.00, 2899.00, 1, 'http://example.com/images/mythical_armor.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (93, 'WLKJZB_003', '未来科技装备NFT', 1, '100000', 9, '130000', 25, '132000', 65, 85, 'FutureTech', '限量版未来科技装备NFT，跨游戏平台使用', 2099.00, 3099.00, 1, 'http://example.com/images/future_tech.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (94, 'MFSP_004', '魔法饰品NFT', 1, '100000', 9, '130000', 25, '132000', 70, 95, 'MagicalAccessory', '限量版魔法饰品NFT，跨游戏平台使用', 1799.00, 2799.00, 1, 'http://example.com/images/magical_accessory.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (95, 'YGSQ_005', '远古神器NFT', 1, '100000', 9, '130000', 25, '132000', 50, 80, 'AncientRelic', '限量版远古神器NFT，跨游戏平台使用', 2199.00, 3199.00, 1, 'http://example.com/images/ancient_relic.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (96, 'SPU_GAME_SKIN_001', '传奇英雄皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 60, 100, 'LegendarySkin', '限量版传奇英雄皮肤NFT，跨游戏平台使用', 1499.00, 2499.00, 1, 'http://example.com/images/legendary_skin.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (97, 'KHZJPF_002', '科幻载具皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 55, 90, 'SciFiVehicleSkin', '限量版科幻载具皮肤NFT，跨游戏平台使用', 1399.00, 2399.00, 1, 'http://example.com/images/scifi_vehicle_skin.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (98, 'MFWQPF_003', '魔法武器皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 65, 85, 'MagicalWeaponSkin', '限量版魔法武器皮肤NFT，跨游戏平台使用', 1599.00, 2599.00, 1, 'http://example.com/images/magical_weapon_skin.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (99, 'SHSWPF_004', '神话生物皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 70, 95, 'MythicalCreatureSkin', '限量版神话生物皮肤NFT，跨游戏平台使用', 1699.00, 2699.00, 1, 'http://example.com/images/mythical_creature_skin.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (100, 'JXZJPF_005', '机械装甲皮肤NFT', 1, '100000', 9, '130000', 27, '134000', 50, 80, 'MechanicalArmorSkin', '限量版机械装甲皮肤NFT，跨游戏平台使用', 1599.00, 2599.00, 1, 'http://example.com/images/mechanical_armor_skin.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (101, 'CQMFJC_001', '传奇魔法卷轴NFT', 1, '100000', 9, '130000', 24, '131000', 60, 100, 'LegendaryScroll', '限量版传奇魔法卷轴NFT，跨游戏平台使用', 999.00, 1999.00, 1, 'http://example.com/images/legendary_scroll.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (102, 'GJYS_003', '高级药水NFT', 1, '100000', 9, '130000', 24, '131000', 65, 85, 'PremiumPotion', '限量版高级药水NFT，跨游戏平台使用', 799.00, 1799.00, 1, 'http://example.com/images/premium_potion.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (103, 'MFFW_004', '魔法符文NFT', 1, '100000', 9, '130000', 24, '131000', 70, 95, 'MagicalRune', '限量版魔法符文NFT，跨游戏平台使用', 899.00, 1899.00, 1, 'http://example.com/images/magical_rune.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (104, 'CSMDJ_005', '传送门道具NFT', 1, '100000', 9, '130000', 24, '131000', 50, 80, 'PortalItem', '限量版传送门道具NFT，跨游戏平台使用', 999.00, 1999.00, 1, 'http://example.com/images/portal_item.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (105, 'SPU_DOC_WORD_001', '高级商务报告Word模板', 2, '200000', 59, '210000', 66, '211000', 156, 1000, 'BusinessPro', '专业商务报告Word模板，包含完整排版和数据图表样式', 29.90, 59.90, 1, 'http://example.com/images/word_template.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (106, 'SPU_DOC_EXCEL_001', '财务分析Excel模板套装', 2, '200000', 59, '210000', 67, '212000', 234, 1000, 'FinancePro', '专业财务分析Excel模板，包含多种财务报表和分析工具', 39.90, 79.90, 1, 'http://example.com/images/excel_template.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (107, 'SPU_DOC_PPT_001', '创意商务PPT模板合集', 2, '200000', 59, '210000', 68, '213000', 312, 1000, 'CreativePro', '高端创意商务PPT模板，包含50套精美主题', 49.90, 99.90, 1, 'http://example.com/images/ppt_template.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (108, 'SPU_DOC_PDF_001', '智能PDF表单模板', 2, '200000', 59, '210000', 69, '214000', 178, 1000, 'FormPro', '专业PDF表单模板，支持自动填充和数据收集', 34.90, 69.90, 1, 'http://example.com/images/pdf_template.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (109, 'SPU_DOC_OTHER_001', '多格式文档模板套装', 2, '200000', 59, '210000', 70, '215000', 145, 1000, 'DocPro', '综合性文档模板套装，支持多种文档格式', 59.90, 119.90, 1, 'http://example.com/images/other_template.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (110, 'SPU_IMG_WALL_001', '4K科幻风格壁纸合集', 2, '200000', 60, '220000', 73, '221000', 423, 1000, 'WallpaperPro', '精选4K科幻风格壁纸，适用于桌面和移动设备', 19.90, 39.90, 1, 'http://example.com/images/wallpaper_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (111, 'SPU_IMG_AVATAR_001', '二次元风格头像设计集', 2, '200000', 60, '220000', 74, '222000', 567, 1000, 'AvatarArt', '精美二次元风格头像，适用于社交媒体', 15.90, 29.90, 1, 'http://example.com/images/avatar_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (112, 'SPU_IMG_POSTER_001', '现代简约商业海报模板', 2, '200000', 60, '220000', 75, '223000', 345, 1000, 'PosterPro', '现代简约风格商业海报模板，适用于各类营销活动', 29.90, 59.90, 1, 'http://example.com/images/poster_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (113, 'SPU_IMG_ILLUST_001', '手绘风格商业插画集', 2, '200000', 60, '220000', 76, '224000', 289, 1000, 'IllustArt', '精美手绘风格商业插画，适用于品牌营销', 39.90, 79.90, 1, 'http://example.com/images/illustration_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (114, 'SPU_MUSIC_BGM_001', '轻音乐背景音乐合集', 2, '200000', 61, '230000', 80, '231000', 678, 1000, 'MusicPro', '优质轻音乐背景音乐，适用于视频制作和商业场景', 49.90, 99.90, 1, 'http://example.com/images/bgm_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (115, 'SPU_MUSIC_SCORE_001', '电影配乐精选集', 2, '200000', 61, '230000', 81, '232000', 456, 1000, 'ScorePro', '专业电影配乐素材，适用于影视制作', 79.90, 159.90, 1, 'http://example.com/images/score_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (116, 'SPU_MUSIC_BEAT_001', '现代音乐节拍素材包', 2, '200000', 61, '230000', 82, '233000', 345, 1000, 'BeatPro', '专业音乐节拍素材，适用于音乐制作', 39.90, 79.90, 1, 'http://example.com/images/beat_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (117, 'SPU_MUSIC_NATURE_001', '自然环境音效合集', 2, '200000', 61, '230000', 83, '234000', 234, 1000, 'NaturePro', '高品质自然环境音效，适用于影视制作和冥想放松', 29.90, 59.90, 1, 'http://example.com/images/nature_sound_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (118, 'SPU_MUSIC_OTHER_001', '综合音效素材库', 2, '200000', 61, '230000', 84, '235000', 189, 1000, 'SoundPro', '多样化音效素材库，满足各类创作需求', 69.90, 139.90, 1, 'http://example.com/images/sound_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (119, 'SPU_VIDEO_AD_001', '商业广告视频素材包', 2, '200000', 62, '240000', 87, '241000', 567, 1000, 'AdPro', '高质量商业广告视频素材，适用于各类营销场景', 89.90, 179.90, 1, 'http://example.com/images/ad_video_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (120, 'SPU_VIDEO_PROMO_001', '企业宣传片模板', 2, '200000', 62, '240000', 88, '242000', 345, 1000, 'PromoPro', '专业企业宣传片模板，展现品牌形象', 99.90, 199.90, 1, 'http://example.com/images/promo_video_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (121, 'SPU_VIDEO_EDU_001', '在线教育课程模板', 2, '200000', 62, '240000', 89, '243000', 456, 1000, 'EduPro', '专业在线教育视频模板，适用于各类课程制作', 69.90, 139.90, 1, 'http://example.com/images/edu_video_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (122, 'SPU_VIDEO_ANIM_001', 'MG动画模板套装', 2, '200000', 62, '240000', 90, '244000', 234, 1000, 'AnimPro', '专业MG动画模板，适用于创意视频制作', 79.90, 159.90, 1, 'http://example.com/images/animation_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');
INSERT INTO `sys_product_spu` VALUES (123, 'SPU_VIDEO_OTHER_001', '综合视频素材库', 2, '200000', 62, '240000', 91, '245000', 189, 1000, 'VideoPro', '多样化视频素材库，满足各类创作需求', 129.90, 259.90, 1, 'http://example.com/images/video_collection.png', '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, 'admin', 'admin');

-- ----------------------------
-- Table structure for sys_product_spu_attr_params
-- ----------------------------
DROP TABLE IF EXISTS `sys_product_spu_attr_params`;
CREATE TABLE `sys_product_spu_attr_params`  (
                                                `id` bigint NOT NULL AUTO_INCREMENT,
                                                `product_spu_id` bigint NOT NULL DEFAULT 0 COMMENT '商品spu id',
                                                `product_spu_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品spu编码',
                                                `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '编码',
                                                `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
                                                `attr_type` int NOT NULL DEFAULT 0 COMMENT '类型：1-基本属性，2-销售属性，3-规格属性',
                                                `value_type` int NOT NULL DEFAULT 0 COMMENT '值类型：1-文本，2-图片，3-视频，4-音频，5-链接，6-其它',
                                                `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '值',
                                                `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
                                                `status` int NOT NULL DEFAULT 0 COMMENT '状态',
                                                `is_required` int NOT NULL DEFAULT 0 COMMENT '是否必填',
                                                `is_generic` int NOT NULL DEFAULT 0 COMMENT '是否通用',
                                                `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                                `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                                `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                                `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                                `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                                PRIMARY KEY (`id`) USING BTREE,
                                                INDEX `idx_product_spu_id`(`product_spu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 369 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_product_spu_attr_params
-- ----------------------------
INSERT INTO `sys_product_spu_attr_params` VALUES (1, 1, 'SPU_ART_PAINT_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字绘画\",\"创作工具\":\"Procreate\",\"艺术风格\":\"未来主义\",\"尺寸\":\"4000x3000像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (2, 1, 'SPU_ART_PAINT_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Alex Future\",\"创作时间\":\"2023-03-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"FUTURE2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (3, 1, 'SPU_ART_PAINT_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"分辨率\":[\"4K\",\"8K\"],\"版本\":[\"标准版\",\"收藏版\",\"艺术家签名版\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (4, 2, 'SPU_ART_PAINT_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"抽象几何\",\"创作工具\":\"Adobe Illustrator\",\"艺术风格\":\"极简主义\",\"尺寸\":\"3600x3600像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (5, 2, 'SPU_ART_PAINT_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Geo Master\",\"创作时间\":\"2023-04-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GEO2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (6, 2, 'SPU_ART_PAINT_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"色彩主题\":[\"冷色调\",\"暖色调\",\"对比色\"],\"形状主题\":[\"圆形\",\"方形\",\"三角形\",\"混合几何\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (7, 3, 'SPU_ART_PAINT_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字绘画\",\"创作工具\":\"Blender+Photoshop\",\"艺术风格\":\"赛博朋克\",\"尺寸\":\"5000x3000像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (8, 3, 'SPU_ART_PAINT_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Cyber Vision\",\"创作时间\":\"2023-05-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"CYBER2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (9, 3, 'SPU_ART_PAINT_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"场景\":[\"城市夜景\",\"地下世界\",\"高科技实验室\",\"废弃工厂\"],\"主题\":[\"人机交互\",\"反乌托邦\",\"科技革命\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (10, 4, 'SPU_ART_PAINT_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字绘画\",\"创作工具\":\"Adobe Photoshop\",\"艺术风格\":\"波普艺术\",\"尺寸\":\"4200x3600像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (11, 4, 'SPU_ART_PAINT_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Pop Master\",\"创作时间\":\"2023-06-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"70\",\"作品编号\":\"POP2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (12, 4, 'SPU_ART_PAINT_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"主题\":[\"名人肖像\",\"流行文化\",\"商业符号\",\"日常物品\"],\"色彩\":[\"高饱和度\",\"对比色\",\"单色系列\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (13, 5, 'SPU_ART_PAINT_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字水墨\",\"创作工具\":\"Corel Painter\",\"艺术风格\":\"新水墨\",\"尺寸\":\"4500x2800像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (14, 5, 'SPU_ART_PAINT_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"墨韵轩\",\"创作时间\":\"2023-07-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"INK2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (15, 5, 'SPU_ART_PAINT_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"题材\":[\"山水\",\"花鸟\",\"人物\",\"抽象\"],\"风格\":[\"写意\",\"工笔\",\"现代水墨\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (16, 6, 'SPU_MUSIC_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音乐类型\":\"电子音乐\",\"创作工具\":\"Ableton Live\",\"音乐风格\":\"House/Techno\",\"专辑长度\":\"45分钟\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (17, 6, 'SPU_MUSIC_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"音乐人\":\"DJ Electro\",\"创作时间\":\"2023-04-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"专辑编号\":\"MUSIC2023001\",\"音轨数量\":\"10\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (18, 6, 'SPU_MUSIC_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"音质\":[\"标准音质\",\"高清音质\",\"无损音质\"],\"版本\":[\"标准版\",\"收藏版\",\"艺术家签名版\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (19, 7, 'SPU_MUSIC_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音乐类型\":\"实验爵士乐\",\"创作工具\":\"现场录音+数字后期\",\"音乐风格\":\"爵士融合\",\"专辑长度\":\"52分钟\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (20, 7, 'SPU_MUSIC_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"音乐人\":\"Jazz Explorers\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"专辑编号\":\"MUSIC2023002\",\"音轨数量\":\"8\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (21, 7, 'SPU_MUSIC_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"录制方式\":[\"现场录音\",\"工作室录音\",\"混合录制\"],\"附加内容\":[\"创作花絮\",\"乐谱\",\"乐手访谈\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (22, 8, 'SPU_MUSIC_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音乐类型\":\"环境音乐\",\"创作工具\":\"现场录音+合成器\",\"音乐风格\":\"氛围/冥想\",\"专辑长度\":\"60分钟\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (23, 8, 'SPU_MUSIC_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"音乐人\":\"Ambient Master\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"专辑编号\":\"MUSIC2023003\",\"音轨数量\":\"6\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (24, 8, 'SPU_MUSIC_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"主题\":[\"森林\",\"海洋\",\"宇宙\",\"城市\"],\"时长\":[\"标准版60分钟\",\"延长版90分钟\",\"冥想专用120分钟\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (25, 9, 'SPU_MUSIC_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音乐类型\":\"先锋古典\",\"创作工具\":\"管弦乐团+电子合成\",\"音乐风格\":\"新古典主义\",\"专辑长度\":\"48分钟\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (26, 9, 'SPU_MUSIC_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"音乐人\":\"Neo Orchestra\",\"创作时间\":\"2023-07-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"75\",\"专辑编号\":\"MUSIC2023004\",\"音轨数量\":\"7\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (27, 9, 'SPU_MUSIC_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"演奏阵容\":[\"室内乐团\",\"交响乐团\",\"电子+管弦乐\"],\"附加内容\":[\"创作花絮\",\"乐谱\",\"指挥访谈\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (28, 10, 'SPU_MUSIC_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音乐类型\":\"世界音乐\",\"创作工具\":\"传统乐器+现代制作\",\"音乐风格\":\"多元文化融合\",\"专辑长度\":\"55分钟\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (29, 10, 'SPU_MUSIC_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"音乐人\":\"Global Ensemble\",\"创作时间\":\"2023-08-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"专辑编号\":\"MUSIC2023005\",\"音轨数量\":\"9\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (30, 10, 'SPU_MUSIC_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"文化元素\":[\"亚洲\",\"非洲\",\"拉丁美洲\",\"中东\"],\"乐器特色\":[\"传统乐器\",\"现代电子\",\"混合编曲\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (31, 11, 'SPU_VIDEO_ART_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"动态视频艺术\",\"创作工具\":\"After Effects\",\"艺术风格\":\"抽象表现主义\",\"视频长度\":\"2分钟\",\"分辨率\":\"4K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (32, 11, 'SPU_VIDEO_ART_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Motion Master\",\"创作时间\":\"2023-04-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"VIDEO2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (33, 11, 'SPU_VIDEO_ART_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"视频格式\":[\"MP4\",\"MOV\"],\"循环方式\":[\"单次播放\",\"无缝循环\",\"变化循环\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (34, 12, 'SPU_VIDEO_ART_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"算法生成艺术\",\"创作工具\":\"Processing\",\"艺术风格\":\"生命模拟\",\"视频长度\":\"3分钟\",\"分辨率\":\"4K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (35, 12, 'SPU_VIDEO_ART_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Algorithm Life\",\"创作时间\":\"2023-05-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"VIDEO2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (36, 12, 'SPU_VIDEO_ART_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"生命形态\":[\"细胞\",\"微生物\",\"植物\",\"抽象生命\"],\"互动性\":[\"静态观看\",\"有限互动\",\"完全互动\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (37, 13, 'SPU_VIDEO_ART_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"3D景观艺术\",\"创作工具\":\"Blender\",\"艺术风格\":\"超现实主义\",\"视频长度\":\"2.5分钟\",\"分辨率\":\"4K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (38, 13, 'SPU_VIDEO_ART_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Landscape Dreamer\",\"创作时间\":\"2023-06-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"VIDEO2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (39, 13, 'SPU_VIDEO_ART_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"景观类型\":[\"山脉\",\"海洋\",\"森林\",\"天空\",\"抽象地形\"],\"时间周期\":[\"日出\",\"日落\",\"星空\",\"四季变换\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (40, 14, 'SPU_VIDEO_ART_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字舞蹈艺术\",\"创作工具\":\"动作捕捉+After Effects\",\"艺术风格\":\"当代舞蹈+数字视效\",\"视频长度\":\"4分钟\",\"分辨率\":\"4K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (41, 14, 'SPU_VIDEO_ART_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Digital Dancers\",\"创作时间\":\"2023-07-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"75\",\"作品编号\":\"VIDEO2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (42, 14, 'SPU_VIDEO_ART_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"舞蹈风格\":[\"现代舞\",\"当代舞\",\"芭蕾\",\"街舞\"],\"视觉效果\":[\"粒子效果\",\"几何变形\",\"光影追踪\",\"抽象映射\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (43, 15, 'SPU_VIDEO_ART_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"城市影像艺术\",\"创作工具\":\"延时摄影+数字处理\",\"艺术风格\":\"城市纪实+视觉艺术\",\"视频长度\":\"3.5分钟\",\"分辨率\":\"4K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (44, 15, 'SPU_VIDEO_ART_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Urban Eye\",\"创作时间\":\"2023-08-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"VIDEO2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (45, 15, 'SPU_VIDEO_ART_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"城市场景\":[\"交通流\",\"人群\",\"建筑\",\"夜景\"],\"拍摄城市\":[\"纽约\",\"东京\",\"上海\",\"伦敦\",\"巴黎\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (46, 16, 'SPU_TEXT_ART_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"文本艺术\",\"创作工具\":\"数字排版+视觉设计\",\"艺术风格\":\"实验诗歌\",\"作品数量\":\"15首\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (47, 16, 'SPU_TEXT_ART_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Word Visionary\",\"创作时间\":\"2023-04-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"TEXT2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (48, 16, 'SPU_TEXT_ART_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"主题\":[\"爱情\",\"自然\",\"城市\",\"科技\"],\"呈现形式\":[\"静态文本\",\"动态文本\",\"互动文本\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (49, 17, 'SPU_TEXT_ART_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"文本艺术\",\"创作工具\":\"数字写作+互动设计\",\"艺术风格\":\"实验小说\",\"字数\":\"约5万字\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (50, 17, 'SPU_TEXT_ART_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Novel Explorer\",\"创作时间\":\"2023-05-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"TEXT2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (51, 17, 'SPU_TEXT_ART_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"叙事结构\":[\"非线性\",\"多视角\",\"分支选择\"],\"互动程度\":[\"低互动\",\"中互动\",\"高互动\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (52, 18, 'SPU_TEXT_ART_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"文本艺术\",\"创作工具\":\"数字写作+多媒体设计\",\"艺术风格\":\"实验戏剧\",\"幕数\":\"3幕\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (53, 18, 'SPU_TEXT_ART_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Script Innovator\",\"创作时间\":\"2023-06-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"TEXT2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (54, 18, 'SPU_TEXT_ART_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"主题\":[\"科技与人性\",\"身份认同\",\"虚拟与现实\"],\"附加内容\":[\"角色设计\",\"场景设计\",\"导演笔记\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (55, 19, 'SPU_TEXT_ART_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"文本艺术\",\"创作工具\":\"数字排版+视觉设计\",\"艺术风格\":\"概念艺术\",\"作品数量\":\"8件\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (56, 19, 'SPU_TEXT_ART_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Text Conceptualist\",\"创作时间\":\"2023-07-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"75\",\"作品编号\":\"TEXT2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (57, 19, 'SPU_TEXT_ART_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"表现形式\":[\"文字拼贴\",\"字形变形\",\"符号组合\",\"空间排列\"],\"互动性\":[\"静态\",\"动态\",\"互动\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (58, 20, 'SPU_TEXT_ART_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"文本艺术\",\"创作工具\":\"数字写作+视觉设计\",\"艺术风格\":\"哲思散文\",\"作品数量\":\"12篇\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (59, 20, 'SPU_TEXT_ART_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Digital Thinker\",\"创作时间\":\"2023-08-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"TEXT2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (60, 20, 'SPU_TEXT_ART_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"主题\":[\"数字哲学\",\"艺术理论\",\"社会批评\",\"科技伦理\"],\"附加内容\":[\"作者访谈\",\"创作笔记\",\"读者讨论\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (61, 21, 'SPU_AVATAR_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字头像\",\"创作工具\":\"Procreate+Blender\",\"艺术风格\":\"赛博朋克/未来主义\",\"分辨率\":\"4000x4000像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (62, 21, 'SPU_AVATAR_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Future Face\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"AVATAR2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (63, 21, 'SPU_AVATAR_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"性别\":[\"男性\",\"女性\",\"中性\",\"非二元\"],\"风格元素\":[\"机械增强\",\"全息投影\",\"神经接口\",\"量子特效\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (64, 22, 'SPU_AVATAR_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字头像\",\"创作工具\":\"ZBrush+Photoshop\",\"艺术风格\":\"奇幻/神话\",\"分辨率\":\"4000x4000像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (65, 22, 'SPU_AVATAR_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Creature Creator\",\"创作时间\":\"2023-05-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"AVATAR2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (66, 22, 'SPU_AVATAR_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"生物类型\":[\"龙族\",\"精灵\",\"兽人\",\"神话生物\",\"异次元生物\"],\"元素属性\":[\"火\",\"水\",\"土\",\"风\",\"光\",\"暗\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (67, 23, 'SPU_AVATAR_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字头像\",\"创作工具\":\"Adobe Illustrator\",\"艺术风格\":\"抽象/几何\",\"分辨率\":\"4000x4000像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (68, 23, 'SPU_AVATAR_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Abstract Identity\",\"创作时间\":\"2023-06-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"AVATAR2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (69, 23, 'SPU_AVATAR_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"形状元素\":[\"几何形状\",\"流体形态\",\"分形图案\",\"抽象线条\"],\"色彩方案\":[\"单色\",\"对比色\",\"渐变色\",\"彩虹色\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (70, 24, 'SPU_AVATAR_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字头像\",\"创作工具\":\"Aseprite\",\"艺术风格\":\"像素艺术/复古游戏\",\"分辨率\":\"64x64像素(可放大)\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (71, 24, 'SPU_AVATAR_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Pixel Master\",\"创作时间\":\"2023-07-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"AVATAR2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (72, 24, 'SPU_AVATAR_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"游戏风格\":[\"8位风格\",\"16位风格\",\"32位风格\"],\"角色类型\":[\"冒险者\",\"魔法师\",\"战士\",\"太空人\",\"赛博朋克\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (73, 25, 'SPU_AVATAR_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"数字头像\",\"创作工具\":\"Clip Studio Paint\",\"艺术风格\":\"卡通/拟人化\",\"分辨率\":\"4000x4000像素\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (74, 25, 'SPU_AVATAR_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Animal Artist\",\"创作时间\":\"2023-08-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"AVATAR2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (75, 25, 'SPU_AVATAR_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"动物类型\":[\"猫科\",\"犬科\",\"鸟类\",\"爬行类\",\"海洋生物\"],\"风格\":[\"写实\",\"卡通\",\"赛博朋克\",\"奇幻\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (76, 26, 'SPU_VIRTUAL_CHAR_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"3D虚拟形象\",\"创作工具\":\"Blender+ZBrush\",\"艺术风格\":\"写实/科幻\",\"多边形数\":\"50K-100K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (77, 26, 'SPU_VIRTUAL_CHAR_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"3D Master\",\"创作时间\":\"2023-04-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"VCHAR2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (78, 26, 'SPU_VIRTUAL_CHAR_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"风格\":[\"写实\",\"科幻\",\"卡通\",\"奇幻\"],\"适配平台\":[\"Decentraland\",\"The Sandbox\",\"VRChat\",\"Roblox\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (79, 27, 'SPU_VIRTUAL_CHAR_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"动漫虚拟形象\",\"创作工具\":\"Clip Studio Paint+Blender\",\"艺术风格\":\"日系动漫\",\"多边形数\":\"30K-50K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (80, 27, 'SPU_VIRTUAL_CHAR_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Anime Creator\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"VCHAR2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (81, 27, 'SPU_VIRTUAL_CHAR_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"动漫风格\":[\"少年漫画\",\"少女漫画\",\"赛博朋克\",\"奇幻\"],\"服装套装\":[\"校园\",\"战斗\",\"日常\",\"特殊节日\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (82, 28, 'SPU_VIRTUAL_CHAR_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"赛博朋克虚拟形象\",\"创作工具\":\"ZBrush+Substance Painter\",\"艺术风格\":\"赛博朋克/科幻\",\"多边形数\":\"60K-80K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (83, 28, 'SPU_VIRTUAL_CHAR_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Cyber Designer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"VCHAR2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (84, 28, 'SPU_VIRTUAL_CHAR_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"增强类型\":[\"机械义肢\",\"神经接口\",\"全息投影\",\"生物改造\"],\"职业背景\":[\"黑客\",\"赏金猎人\",\"公司特工\",\"街头医生\",\"反抗军\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (85, 29, 'SPU_VIRTUAL_CHAR_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"奇幻虚拟形象\",\"创作工具\":\"Maya+Substance Painter\",\"艺术风格\":\"奇幻/魔幻\",\"多边形数\":\"50K-70K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (86, 29, 'SPU_VIRTUAL_CHAR_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Fantasy Sculptor\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"VCHAR2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (87, 29, 'SPU_VIRTUAL_CHAR_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"种族\":[\"精灵\",\"矮人\",\"兽人\",\"龙人\",\"元素生物\"],\"职业\":[\"战士\",\"法师\",\"游侠\",\"牧师\",\"盗贼\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (88, 30, 'SPU_VIRTUAL_CHAR_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"运动虚拟形象\",\"创作工具\":\"3ds Max+Marvelous Designer\",\"艺术风格\":\"未来运动/科技\",\"多边形数\":\"40K-60K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (89, 30, 'SPU_VIRTUAL_CHAR_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"艺术家\":\"Future Athlete\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"VCHAR2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (90, 30, 'SPU_VIRTUAL_CHAR_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"运动类型\":[\"电竞\",\"未来足球\",\"增强篮球\",\"极限运动\",\"机甲格斗\"],\"装备特性\":[\"动力外骨骼\",\"生物反馈\",\"全息显示\",\"智能材料\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (91, 31, 'SPU_SOCIAL_ID_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"社交媒体设计\",\"创作工具\":\"Photoshop+Illustrator\",\"艺术风格\":\"现代/简约\",\"包含元素\":\"头像、横幅、背景、主题\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (92, 31, 'SPU_SOCIAL_ID_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Social Branding\",\"创作时间\":\"2023-04-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"SOCIAL2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (93, 31, 'SPU_SOCIAL_ID_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"适配平台\":[\"Twitter\",\"Instagram\",\"Facebook\",\"LinkedIn\",\"Discord\"],\"风格\":[\"简约\",\"科技\",\"艺术\",\"商务\",\"创意\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (94, 32, 'SPU_SOCIAL_ID_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"品牌形象设计\",\"创作工具\":\"Adobe Creative Suite\",\"艺术风格\":\"专业/创意\",\"包含元素\":\"头像、标志、名片、作品集模板\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (95, 32, 'SPU_SOCIAL_ID_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Brand Expert\",\"创作时间\":\"2023-05-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"SOCIAL2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (96, 32, 'SPU_SOCIAL_ID_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"创作者类型\":[\"视觉艺术家\",\"音乐人\",\"作家\",\"设计师\",\"摄影师\"],\"风格\":[\"极简\",\"艺术\",\"前卫\",\"经典\",\"实验\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (97, 33, 'SPU_SOCIAL_ID_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"游戏形象设计\",\"创作工具\":\"Photoshop+3D建模\",\"艺术风格\":\"游戏风/科幻\",\"包含元素\":\"头像、横幅、徽章、表情包\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (98, 33, 'SPU_SOCIAL_ID_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Game Artist\",\"创作时间\":\"2023-06-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"SOCIAL2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (99, 33, 'SPU_SOCIAL_ID_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"游戏类型\":[\"FPS\",\"MOBA\",\"RPG\",\"模拟\",\"策略\"],\"风格\":[\"科幻\",\"奇幻\",\"赛博朋克\",\"复古像素\",\"卡通\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (100, 34, 'SPU_SOCIAL_ID_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"商业形象设计\",\"创作工具\":\"Adobe Creative Suite\",\"艺术风格\":\"专业/商务\",\"包含元素\":\"头像、标志、名片、社交媒体模板\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (101, 34, 'SPU_SOCIAL_ID_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Business Designer\",\"创作时间\":\"2023-07-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"75\",\"作品编号\":\"SOCIAL2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (102, 34, 'SPU_SOCIAL_ID_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"行业\":[\"科技\",\"金融\",\"创意\",\"教育\",\"零售\"],\"风格\":[\"现代简约\",\"专业稳重\",\"创新前卫\",\"传统经典\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (103, 35, 'SPU_SOCIAL_ID_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"艺术类型\":\"影响者形象设计\",\"创作工具\":\"Photoshop+After Effects\",\"艺术风格\":\"时尚/前卫\",\"包含元素\":\"头像、封面、介绍模板、内容框架\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (104, 35, 'SPU_SOCIAL_ID_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Digital Influencer\",\"创作时间\":\"2023-08-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"SOCIAL2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (105, 35, 'SPU_SOCIAL_ID_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"内容领域\":[\"时尚\",\"科技\",\"生活方式\",\"游戏\",\"美妆\"],\"风格\":[\"前卫\",\"时尚\",\"专业\",\"休闲\",\"艺术\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (106, 36, 'SPU_GAME_ITEM_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"武器\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/史诗\",\"多边形数\":\"20K-30K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (107, 36, 'SPU_GAME_ITEM_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Weapon Master\",\"创作时间\":\"2023-04-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GITEM2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (108, 36, 'SPU_GAME_ITEM_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"武器类型\":[\"剑\",\"斧\",\"弓\",\"法杖\",\"枪\"],\"元素属性\":[\"火\",\"冰\",\"雷\",\"暗\",\"光\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (109, 37, 'SPU_GAME_ITEM_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"防具\",\"创作工具\":\"ZBrush+Substance Painter\",\"艺术风格\":\"奇幻/史诗\",\"多边形数\":\"25K-35K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (110, 37, 'SPU_GAME_ITEM_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Armor Smith\",\"创作时间\":\"2023-05-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GITEM2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (111, 37, 'SPU_GAME_ITEM_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"防具类型\":[\"头盔\",\"胸甲\",\"护腕\",\"护腿\",\"盾牌\"],\"材质风格\":[\"龙鳞\",\"符文钢\",\"暗影织物\",\"光明水晶\",\"远古金属\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (112, 38, 'SPU_GAME_ITEM_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"宠物/伙伴\",\"创作工具\":\"Maya+Substance Painter\",\"艺术风格\":\"奇幻/可爱\",\"多边形数\":\"15K-25K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (113, 38, 'SPU_GAME_ITEM_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Creature Creator\",\"创作时间\":\"2023-06-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GITEM2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (114, 38, 'SPU_GAME_ITEM_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"生物类型\":[\"龙\",\"凤凰\",\"狮鹫\",\"精灵\",\"幽灵\"],\"特殊能力\":[\"飞行\",\"治疗\",\"元素掌控\",\"隐形\",\"传送\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (115, 39, 'SPU_GAME_ITEM_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"法术/技能\",\"创作工具\":\"After Effects+Unity\",\"艺术风格\":\"神秘/魔法\",\"特效复杂度\":\"高\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (116, 39, 'SPU_GAME_ITEM_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Spell Weaver\",\"创作时间\":\"2023-07-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GITEM2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (117, 39, 'SPU_GAME_ITEM_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"法术类型\":[\"攻击\",\"防御\",\"治疗\",\"控制\",\"召唤\"],\"元素属性\":[\"火\",\"水\",\"风\",\"土\",\"光\",\"暗\",\"时间\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (118, 40, 'SPU_GAME_ITEM_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"载具\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/奇幻\",\"多边形数\":\"30K-50K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (119, 40, 'SPU_GAME_ITEM_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Vehicle Engineer\",\"创作时间\":\"2023-08-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GITEM2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (120, 40, 'SPU_GAME_ITEM_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"载具类型\":[\"飞行器\",\"陆地车辆\",\"水下载具\",\"太空船\",\"机甲\"],\"特殊功能\":[\"隐形\",\"武装\",\"加速\",\"变形\",\"传送\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (121, 41, 'CQYX_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"英雄\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"史诗/奇幻\",\"多边形数\":\"50K-80K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (122, 41, 'CQYX_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Hero Creator\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GCHAR2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (123, 41, 'CQYX_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"职业\":[\"战士\",\"法师\",\"刺客\",\"射手\",\"坦克\"],\"种族\":[\"人类\",\"精灵\",\"矮人\",\"兽人\",\"龙裔\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (124, 42, 'XYGWJS_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"怪物\",\"创作工具\":\"ZBrush+3ds Max+Substance Painter\",\"艺术风格\":\"恐怖/奇幻\",\"多边形数\":\"40K-70K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (125, 42, 'XYGWJS_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Monster Designer\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GCHAR2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (126, 42, 'XYGWJS_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"怪物类型\":[\"亡灵\",\"元素\",\"野兽\",\"异形\",\"构造体\"],\"特殊能力\":[\"腐蚀\",\"隐形\",\"再生\",\"心灵控制\",\"元素操控\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (127, 43, 'JJZS_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"机甲\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/机械\",\"多边形数\":\"60K-90K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (128, 43, 'JJZS_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Mech Engineer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GCHAR2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (129, 43, 'JJZS_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"机甲类型\":[\"轻型\",\"中型\",\"重型\",\"超重型\"],\"武器系统\":[\"能量武器\",\"实弹武器\",\"导弹系统\",\"近战武器\",\"特殊武器\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (130, 44, 'SHSW_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"神话生物\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"神话/奇幻\",\"多边形数\":\"45K-75K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (131, 44, 'SHSW_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Myth Creator\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GCHAR2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (132, 44, 'SHSW_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"神话体系\":[\"希腊\",\"北欧\",\"东方\",\"埃及\",\"玛雅\"],\"神力属性\":[\"创造\",\"毁灭\",\"自然\",\"命运\",\"时间\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (133, 45, 'SPU_GAME_CHAR_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"未来战士\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"科幻/赛博朋克\",\"多边形数\":\"55K-85K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (134, 45, 'SPU_GAME_CHAR_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Future Designer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GCHAR2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (135, 45, 'SPU_GAME_CHAR_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"战士类型\":[\"基因强化\",\"机械改造\",\"量子战士\",\"纳米技术\",\"心灵能力\"],\"科技特性\":[\"隐形技术\",\"能量护盾\",\"时间操控\",\"重力控制\",\"生物武器\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (136, 46, 'SPU_GAME_LAND_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"资产类型\":\"虚拟土地\",\"所属平台\":\"Decentraland\",\"地块位置\":\"核心商业区\",\"地块面积\":\"16x16\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (137, 46, 'SPU_GAME_LAND_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"开发商\":\"Meta Estates\",\"发布时间\":\"2023-04-01\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"地块编号\":\"LAND2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (138, 46, 'SPU_GAME_LAND_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"建筑高度限制\":[\"无限制\"],\"周边设施\":[\"中央广场\",\"商业中心\",\"活动场所\",\"交通枢纽\"],\"开发权限\":[\"完全开发权\",\"商业使用权\",\"转售权\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (139, 47, 'SPU_GAME_LAND_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"资产类型\":\"虚拟土地\",\"所属平台\":\"The Sandbox\",\"地块位置\":\"魔法森林区\",\"地块面积\":\"12x12\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (140, 47, 'SPU_GAME_LAND_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"开发商\":\"Fantasy Realms\",\"发布时间\":\"2023-05-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"地块编号\":\"LAND2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (141, 47, 'SPU_GAME_LAND_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"地形特点\":[\"森林\",\"湖泊\",\"山丘\",\"魔法泉水\"],\"特殊资源\":[\"魔法水晶\",\"奇幻生物\",\"古代遗迹\"],\"开发权限\":[\"完全开发权\",\"游戏开发权\",\"转售权\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (142, 48, 'SPU_GAME_LAND_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"资产类型\":\"虚拟土地\",\"所属平台\":\"Somnium Space\",\"地块位置\":\"高科技区\",\"地块面积\":\"14x14\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (143, 48, 'SPU_GAME_LAND_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"开发商\":\"Cyber Estates\",\"发布时间\":\"2023-06-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"地块编号\":\"LAND2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (144, 48, 'SPU_GAME_LAND_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"地形特点\":[\"高楼\",\"全息投影区\",\"能源中心\",\"交通网络\"],\"特殊资源\":[\"数据节点\",\"能源核心\",\"AI中心\"],\"开发权限\":[\"完全开发权\",\"科技展示权\",\"转售权\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (145, 49, 'SPU_GAME_LAND_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"资产类型\":\"虚拟土地\",\"所属平台\":\"Cryptovoxels\",\"地块位置\":\"水下王国区\",\"地块面积\":\"10x10\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (146, 49, 'SPU_GAME_LAND_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"开发商\":\"Ocean Realms\",\"发布时间\":\"2023-07-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"75\",\"地块编号\":\"LAND2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (147, 49, 'SPU_GAME_LAND_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"地形特点\":[\"珊瑚礁\",\"深海峡谷\",\"海底洞穴\",\"热液喷口\"],\"特殊资源\":[\"珍珠\",\"海底宝藏\",\"稀有海洋生物\"],\"开发权限\":[\"完全开发权\",\"海洋主题开发权\",\"转售权\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (148, 50, 'SPU_GAME_LAND_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"资产类型\":\"虚拟土地\",\"所属平台\":\"Star Atlas\",\"地块位置\":\"星际前哨区\",\"地块面积\":\"15x15\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (149, 50, 'SPU_GAME_LAND_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"开发商\":\"Space Pioneers\",\"发布时间\":\"2023-08-25\",\"区块链平台\":\"Solana\",\"发行数量\":\"60\",\"地块编号\":\"LAND2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (150, 50, 'SPU_GAME_LAND_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"地形特点\":[\"太空站\",\"陨石带\",\"星际港口\",\"观测站\"],\"特殊资源\":[\"稀有矿物\",\"外星技术\",\"星际能源\"],\"开发权限\":[\"完全开发权\",\"太空主题开发权\",\"转售权\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (151, 51, 'CQWQPF_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"武器皮肤\",\"创作工具\":\"Substance Painter\",\"艺术风格\":\"奇幻/史诗\",\"适用武器\":\"多种\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (152, 51, 'CQWQPF_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Skin Master\",\"创作时间\":\"2023-04-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GSKIN2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (153, 51, 'CQWQPF_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"皮肤风格\":[\"龙焰\",\"寒冰\",\"暗影\",\"神圣\",\"远古\"],\"特效\":[\"粒子效果\",\"光晕\",\"轨迹\",\"声音\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (154, 52, 'SPU_GAME_SKIN_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"角色皮肤\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/科幻\",\"适用角色\":\"多种\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (155, 52, 'SPU_GAME_SKIN_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Character Artist\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GSKIN2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (156, 52, 'SPU_GAME_SKIN_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"皮肤主题\":[\"英雄\",\"恶魔\",\"机械\",\"元素\",\"神话\"],\"特殊效果\":[\"自定义动画\",\"声音效果\",\"粒子特效\",\"光效\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (157, 53, 'XDZJPF_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"载具皮肤\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/赛博朋克\",\"适用载具\":\"多种\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (158, 53, 'XDZJPF_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Vehicle Designer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GSKIN2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (159, 53, 'XDZJPF_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"载具类型\":[\"飞行器\",\"陆地车辆\",\"水下载具\",\"太空船\"],\"特效\":[\"尾迹\",\"引擎光效\",\"声音\",\"环境交互\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (160, 54, 'CSJZBPF_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"装备皮肤\",\"创作工具\":\"ZBrush+Substance Painter\",\"艺术风格\":\"神话/史诗\",\"适用装备\":\"多种\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (161, 54, 'CSJZBPF_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Mythic Artist\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GSKIN2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (162, 54, 'CSJZBPF_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"装备类型\":[\"头盔\",\"胸甲\",\"护腕\",\"护腿\",\"武器\"],\"神话主题\":[\"北欧\",\"希腊\",\"东方\",\"埃及\",\"亚特兰蒂斯\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (163, 55, 'KHCWPF_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"宠物皮肤\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"科幻/生物科技\",\"适用宠物\":\"多种\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (164, 55, 'KHCWPF_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Creature Designer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GSKIN2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (165, 55, 'KHCWPF_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"宠物类型\":[\"陆地生物\",\"飞行生物\",\"水生生物\",\"机械生物\",\"能量生物\"],\"科技特性\":[\"生物发光\",\"机械部件\",\"能量场\",\"全息投影\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (166, 56, 'SPU_GAME_EQUIP_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"全套装备\",\"创作工具\":\"ZBrush+Substance Painter\",\"艺术风格\":\"史诗/奇幻\",\"多边形数\":\"100K-150K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (167, 56, 'SPU_GAME_EQUIP_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Legendary Smith\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GEQUIP2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (168, 56, 'SPU_GAME_EQUIP_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"套装部件\":[\"头盔\",\"胸甲\",\"护腕\",\"护腿\",\"武器\",\"盾牌\"],\"套装主题\":[\"龙骑士\",\"暗夜猎手\",\"圣光守卫\",\"元素使者\",\"远古战神\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (169, 57, 'SPU_GAME_EQUIP_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"武器\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"史诗/奇幻\",\"多边形数\":\"30K-50K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (170, 57, 'SPU_GAME_EQUIP_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Weapon Artisan\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GEQUIP2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (171, 57, 'SPU_GAME_EQUIP_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"武器类型\":[\"剑\",\"斧\",\"弓\",\"法杖\",\"枪\"],\"元素属性\":[\"火\",\"冰\",\"雷\",\"暗\",\"光\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (172, 58, 'SPU_GAME_EQUIP_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"防具\",\"创作工具\":\"ZBrush+Substance Painter\",\"艺术风格\":\"神话/史诗\",\"多边形数\":\"40K-60K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (173, 58, 'SPU_GAME_EQUIP_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Myth Armorer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GEQUIP2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (174, 58, 'SPU_GAME_EQUIP_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"防具部位\":[\"头盔\",\"胸甲\",\"护腕\",\"护腿\",\"披风\"],\"神话体系\":[\"希腊\",\"北欧\",\"东方\",\"埃及\",\"亚特兰蒂斯\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (175, 59, 'SPU_GAME_EQUIP_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"科技装备\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/赛博朋克\",\"多边形数\":\"45K-65K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (176, 59, 'SPU_GAME_EQUIP_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Future Engineer\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GEQUIP2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (177, 59, 'SPU_GAME_EQUIP_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"装备功能\":[\"隐形\",\"飞行\",\"能量护盾\",\"增强视觉\",\"武器系统\"],\"科技特性\":[\"纳米技术\",\"全息投影\",\"能量转换\",\"人工智能\",\"量子技术\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (178, 60, 'SPU_GAME_EQUIP_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"法器\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/元素\",\"多边形数\":\"35K-55K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (179, 60, 'SPU_GAME_EQUIP_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Elemental Crafter\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GEQUIP2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (180, 60, 'SPU_GAME_EQUIP_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"法器类型\":[\"法杖\",\"宝珠\",\"符文石\",\"魔法书\",\"神器\"],\"元素属性\":[\"火\",\"水\",\"风\",\"地\",\"雷\",\"光\",\"暗\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (181, 61, 'SPU_GAME_PET_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"龙\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/史诗\",\"多边形数\":\"50K-80K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (182, 61, 'SPU_GAME_PET_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Dragon Master\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GPET2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (183, 61, 'SPU_GAME_PET_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"龙种类\":[\"火龙\",\"冰龙\",\"雷龙\",\"暗影龙\",\"神圣龙\"],\"特殊能力\":[\"飞行\",\"元素吐息\",\"护盾\",\"治疗\",\"召唤\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (184, 62, 'SPU_GAME_PET_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"神兽\",\"创作工具\":\"ZBrush+Blender+Substance Painter\",\"艺术风格\":\"神话/史诗\",\"多边形数\":\"45K-75K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (185, 62, 'SPU_GAME_PET_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Myth Beast Creator\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GPET2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (186, 62, 'SPU_GAME_PET_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"神兽类型\":[\"凤凰\",\"麒麟\",\"九尾狐\",\"独角兽\",\"海马\"],\"神话体系\":[\"东方\",\"西方\",\"北欧\",\"埃及\",\"玛雅\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (187, 63, 'SPU_GAME_PET_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"机械生物\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/机械\",\"多边形数\":\"40K-70K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (188, 63, 'SPU_GAME_PET_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Mech Engineer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GPET2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (189, 63, 'SPU_GAME_PET_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"机械类型\":[\"四足机械兽\",\"飞行无人机\",\"水下机械鱼\",\"战斗机器人\",\"工程机械\"],\"特殊功能\":[\"侦察\",\"战斗\",\"采集\",\"辅助\",\"变形\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (190, 64, 'SPU_GAME_PET_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"元素精灵\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/元素\",\"多边形数\":\"35K-65K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (191, 64, 'SPU_GAME_PET_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Elemental Artist\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GPET2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (192, 64, 'SPU_GAME_PET_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"元素类型\":[\"火\",\"水\",\"风\",\"地\",\"雷\",\"光\",\"暗\"],\"精灵形态\":[\"人形\",\"兽形\",\"鸟形\",\"鱼形\",\"植物形\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (193, 65, 'SPU_GAME_PET_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"外星生物\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"科幻/异形\",\"多边形数\":\"45K-75K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (194, 65, 'SPU_GAME_PET_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Alien Designer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GPET2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (195, 65, 'SPU_GAME_PET_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"生物类型\":[\"昆虫型\",\"爬行型\",\"哺乳型\",\"植物型\",\"晶体型\"],\"特殊能力\":[\"心灵感应\",\"变形\",\"隐形\",\"再生\",\"能量操控\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (196, 66, 'SPU_GAME_ITEM_001_N1', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"魔法卷轴\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/古代\",\"多边形数\":\"15K-25K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (197, 66, 'SPU_GAME_ITEM_001_N1', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Scroll Master\",\"创作时间\":\"2023-04-10\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GITEM2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (198, 66, 'SPU_GAME_ITEM_001_N1', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"卷轴类型\":[\"召唤卷轴\",\"传送卷轴\",\"变形卷轴\",\"元素卷轴\",\"神圣卷轴\"],\"魔法效果\":[\"召唤生物\",\"空间传送\",\"形态变化\",\"元素爆发\",\"神圣净化\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (199, 67, 'SMBX_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"宝箱\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/宝藏\",\"多边形数\":\"20K-30K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (200, 67, 'SMBX_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Treasure Maker\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GITEM2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (201, 67, 'SMBX_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"宝箱类型\":[\"古代宝箱\",\"海盗宝箱\",\"龙族宝箱\",\"精灵宝箱\",\"机械宝箱\"],\"稀有度\":[\"普通\",\"稀有\",\"史诗\",\"传说\",\"神话\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (202, 68, 'MFYS_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"药水\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/炼金\",\"多边形数\":\"10K-20K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (203, 68, 'MFYS_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Potion Master\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GITEM2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (204, 68, 'MFYS_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"药水类型\":[\"治疗药水\",\"魔力药水\",\"力量药水\",\"敏捷药水\",\"抗性药水\"],\"效果持续时间\":[\"短效\",\"中效\",\"长效\",\"永久\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (205, 69, 'SMSP_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"神器碎片\",\"创作工具\":\"ZBrush+Substance Painter\",\"艺术风格\":\"史诗/神话\",\"多边形数\":\"15K-25K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (206, 69, 'SMSP_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Artifact Creator\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GITEM2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (207, 69, 'SMSP_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"神器类型\":[\"武器神器\",\"防具神器\",\"饰品神器\",\"法器神器\",\"混合神器\"],\"碎片稀有度\":[\"普通碎片\",\"稀有碎片\",\"史诗碎片\",\"传说碎片\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (208, 70, 'KJZZ_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"科技装置\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/赛博朋克\",\"多边形数\":\"25K-40K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (209, 70, 'KJZZ_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Tech Engineer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GITEM2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (210, 70, 'KJZZ_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"装置类型\":[\"扫描仪\",\"能量发生器\",\"传送装置\",\"黑客工具\",\"防御系统\"],\"科技特性\":[\"隐形\",\"扫描\",\"能量操控\",\"时空干扰\",\"信息处理\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (211, 71, 'QHCB_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"建筑类型\":\"城堡\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/中世纪\",\"多边形数\":\"200K-300K\"}', 1, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (212, 71, 'QHCB_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Castle Architect\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GBUILD2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (213, 71, 'QHCB_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"建筑风格\":[\"哥特式\",\"罗马式\",\"拜占庭式\",\"东方式\",\"精灵式\"],\"建筑规模\":[\"小型\",\"中型\",\"大型\",\"超大型\"],\"功能区域\":[\"主堡\",\"庭院\",\"塔楼\",\"城墙\",\"地下室\"]}', 3, 1, 1, 0, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (214, 72, 'WLCSJZ_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"建筑类型\":\"未来建筑\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/赛博朋克\",\"多边形数\":\"250K-350K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (215, 72, 'WLCSJZ_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Future Architect\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GBUILD2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (216, 72, 'WLCSJZ_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"建筑风格\":[\"高科技\",\"生态融合\",\"极简主义\",\"浮空\",\"地下\"],\"建筑规模\":[\"小型\",\"中型\",\"大型\",\"超大型\"],\"功能区域\":[\"居住区\",\"商业区\",\"研究区\",\"娱乐区\",\"能源中心\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (217, 73, 'SMSD_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"建筑类型\":\"神殿\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"古代/神秘\",\"多边形数\":\"180K-280K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (218, 73, 'SMSD_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Temple Builder\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GBUILD2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (219, 73, 'SMSD_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"神殿风格\":[\"埃及\",\"玛雅\",\"希腊\",\"东方\",\"亚特兰蒂斯\"],\"建筑规模\":[\"小型\",\"中型\",\"大型\",\"超大型\"],\"功能区域\":[\"主殿\",\"祭坛\",\"密室\",\"地下墓穴\",\"藏宝室\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (220, 74, 'FKDY_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"建筑类型\":\"浮空岛屿\",\"创作工具\":\"World Machine+Blender+Substance Painter\",\"艺术风格\":\"奇幻/自然\",\"多边形数\":\"300K-400K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (221, 74, 'FKDY_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Island Creator\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GBUILD2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (222, 74, 'FKDY_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"岛屿风格\":[\"热带\",\"极地\",\"沙漠\",\"森林\",\"火山\"],\"岛屿规模\":[\"小型\",\"中型\",\"大型\",\"超大型\"],\"地形特征\":[\"瀑布\",\"悬崖\",\"洞穴\",\"湖泊\",\"奇观\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (223, 75, 'GDYJ_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"建筑类型\":\"遗迹\",\"创作工具\":\"ZBrush+Blender+Substance Painter\",\"艺术风格\":\"古代/神秘\",\"多边形数\":\"220K-320K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (224, 75, 'GDYJ_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Ruins Architect\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"75\",\"作品编号\":\"GBUILD2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (225, 75, 'GDYJ_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"遗迹风格\":[\"罗马\",\"玛雅\",\"亚特兰蒂斯\",\"东方\",\"未知文明\"],\"遗迹规模\":[\"小型\",\"中型\",\"大型\",\"超大型\"],\"特殊区域\":[\"祭坛\",\"图书馆\",\"宝库\",\"机关室\",\"传送门\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (226, 76, 'SPU_GAME_VEHICLE_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"载具类型\":\"飞船\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/未来\",\"多边形数\":\"80K-120K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (227, 76, 'SPU_GAME_VEHICLE_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Spaceship Engineer\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GVEHICLE2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (228, 76, 'SPU_GAME_VEHICLE_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"飞船类型\":[\"战斗舰\",\"探索舰\",\"运输舰\",\"旗舰\",\"侦察舰\"],\"飞船规模\":[\"小型\",\"中型\",\"大型\",\"超大型\"],\"特殊功能\":[\"隐形\",\"跃迁\",\"能量护盾\",\"武器系统\",\"采矿系统\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (229, 77, 'SPU_GAME_VEHICLE_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"载具类型\":\"机甲\",\"创作工具\":\"ZBrush+3ds Max+Substance Painter\",\"艺术风格\":\"科幻/机械\",\"多边形数\":\"100K-150K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (230, 77, 'SPU_GAME_VEHICLE_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Mech Engineer\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GVEHICLE2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (231, 77, 'SPU_GAME_VEHICLE_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"机甲类型\":[\"轻型机甲\",\"中型机甲\",\"重型机甲\",\"超重型机甲\",\"特种机甲\"],\"武器系统\":[\"能量武器\",\"实弹武器\",\"导弹系统\",\"近战武器\",\"特殊武器\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (232, 78, 'SPU_GAME_VEHICLE_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"载具类型\":\"坐骑\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/神话\",\"多边形数\":\"60K-90K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (233, 78, 'SPU_GAME_VEHICLE_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Mount Creator\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GVEHICLE2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (234, 78, 'SPU_GAME_VEHICLE_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"坐骑类型\":[\"飞行坐骑\",\"陆地坐骑\",\"水中坐骑\",\"元素坐骑\",\"神话坐骑\"],\"特殊能力\":[\"飞行\",\"高速移动\",\"水下呼吸\",\"元素抗性\",\"隐形\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (235, 79, 'SPU_GAME_VEHICLE_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"载具类型\":\"赛车\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"现代/未来\",\"多边形数\":\"70K-100K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (236, 79, 'SPU_GAME_VEHICLE_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Car Designer\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GVEHICLE2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (237, 79, 'SPU_GAME_VEHICLE_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"赛车类型\":[\"F1赛车\",\"拉力赛车\",\"街头赛车\",\"未来赛车\",\"越野赛车\"],\"性能特点\":[\"高速\",\"加速\",\"操控\",\"越野\",\"耐久\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (238, 80, 'SPU_GAME_VEHICLE_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"载具类型\":\"潜水艇\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/海洋\",\"多边形数\":\"75K-110K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (239, 80, 'SPU_GAME_VEHICLE_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Submarine Engineer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GVEHICLE2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (240, 80, 'SPU_GAME_VEHICLE_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"潜水艇类型\":[\"探索型\",\"战斗型\",\"科研型\",\"运输型\",\"混合型\"],\"特殊功能\":[\"深海潜行\",\"声呐系统\",\"武器系统\",\"采集系统\",\"隐形系统\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (241, 81, 'SPU_GAME_CHAR_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"英雄\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/史诗\",\"多边形数\":\"100K-150K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (242, 81, 'SPU_GAME_CHAR_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Hero Creator\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GCHAR2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (243, 81, 'SPU_GAME_CHAR_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"职业类型\":[\"战士\",\"法师\",\"刺客\",\"射手\",\"辅助\"],\"稀有度\":[\"普通\",\"稀有\",\"史诗\",\"传说\",\"神话\"],\"特殊能力\":[\"群体控制\",\"高爆发\",\"生存能力\",\"辅助增益\",\"特殊机制\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (244, 82, 'SPU_GAME_CHAR_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"神话生物\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"神话/古典\",\"多边形数\":\"120K-170K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (245, 82, 'SPU_GAME_CHAR_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Myth Creator\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GCHAR2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (246, 82, 'SPU_GAME_CHAR_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"神话体系\":[\"希腊\",\"北欧\",\"东方\",\"埃及\",\"美洲\"],\"生物类型\":[\"人形\",\"兽形\",\"混合体\",\"元素体\",\"神灵\"],\"特殊能力\":[\"元素掌控\",\"形态变化\",\"预言\",\"治愈\",\"毁灭\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (247, 83, 'SPU_GAME_CHAR_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"未来战士\",\"创作工具\":\"ZBrush+3ds Max+Substance Painter\",\"艺术风格\":\"科幻/赛博朋克\",\"多边形数\":\"110K-160K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (248, 83, 'SPU_GAME_CHAR_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Future Creator\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GCHAR2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (249, 83, 'SPU_GAME_CHAR_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"战士类型\":[\"机械增强\",\"基因改造\",\"AI融合\",\"纳米技术\",\"量子战士\"],\"装备等级\":[\"标准\",\"高级\",\"精英\",\"原型\",\"实验性\"],\"特殊能力\":[\"隐形\",\"时间操控\",\"能量武器\",\"黑客技术\",\"增强感官\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (250, 84, 'SPU_GAME_CHAR_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"魔法师\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/神秘\",\"多边形数\":\"90K-140K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (251, 84, 'SPU_GAME_CHAR_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Wizard Creator\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GCHAR2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (252, 84, 'SPU_GAME_CHAR_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"魔法流派\":[\"元素魔法\",\"召唤魔法\",\"幻术魔法\",\"时空魔法\",\"禁忌魔法\"],\"法师等级\":[\"学徒\",\"正式法师\",\"大法师\",\"奥术师\",\"传奇法师\"],\"特殊能力\":[\"元素掌控\",\"召唤生物\",\"幻术\",\"时空扭曲\",\"魔法研究\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (253, 85, 'YXSWJS_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"角色类型\":\"异形生物\",\"创作工具\":\"ZBrush+Blender+Substance Painter\",\"艺术风格\":\"科幻/异形\",\"多边形数\":\"130K-180K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (254, 85, 'YXSWJS_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Alien Creator\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GCHAR2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (255, 85, 'YXSWJS_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"生物类型\":[\"昆虫型\",\"爬行型\",\"哺乳型\",\"晶体型\",\"能量型\"],\"生物等级\":[\"幼体\",\"成熟体\",\"完全体\",\"变异体\",\"终极体\"],\"特殊能力\":[\"适应性\",\"再生\",\"心灵感应\",\"分泌物\",\"能量操控\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (256, 86, 'CQLQW_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"龙\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/史诗\",\"多边形数\":\"80K-120K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (257, 86, 'CQLQW_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Dragon Designer\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GPET2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (258, 86, 'CQLQW_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"龙种类型\":[\"火龙\",\"冰龙\",\"雷龙\",\"风龙\",\"暗影龙\"],\"成长阶段\":[\"幼龙\",\"成年龙\",\"古龙\",\"神龙\"],\"特殊能力\":[\"元素吐息\",\"飞行\",\"护盾\",\"治愈\",\"召唤\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (259, 87, 'SMJLCW_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"精灵\",\"创作工具\":\"ZBrush+Blender+Substance Painter\",\"艺术风格\":\"奇幻/梦幻\",\"多边形数\":\"60K-90K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (260, 87, 'SMJLCW_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Fairy Designer\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GPET2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (261, 87, 'SMJLCW_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"精灵类型\":[\"光明精灵\",\"自然精灵\",\"水系精灵\",\"风系精灵\",\"暗影精灵\"],\"成长阶段\":[\"幼精灵\",\"成熟精灵\",\"高等精灵\",\"精灵长老\"],\"特殊能力\":[\"治愈\",\"自然操控\",\"隐形\",\"预言\",\"元素掌控\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (262, 88, 'JXCW_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"机械宠物\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/机械\",\"多边形数\":\"70K-100K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (263, 88, 'JXCW_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Mech Pet Designer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GPET2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (264, 88, 'JXCW_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"机械类型\":[\"四足机械\",\"飞行机械\",\"水陆两用\",\"多功能\",\"微型机械\"],\"科技等级\":[\"基础型\",\"高级型\",\"实验型\",\"原型机\",\"未来型\"],\"特殊功能\":[\"扫描\",\"修复\",\"战斗\",\"侦察\",\"资源收集\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (265, 89, 'HSCW_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"幻兽\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/混合\",\"多边形数\":\"75K-110K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (266, 89, 'HSCW_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Beast Designer\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GPET2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (267, 89, 'HSCW_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"幻兽类型\":[\"奇美拉\",\"麒麟\",\"九尾狐\",\"独角兽\",\"海妖\"],\"稀有度\":[\"普通\",\"稀有\",\"史诗\",\"传说\",\"神话\"],\"特殊能力\":[\"变形\",\"元素操控\",\"幻术\",\"治愈\",\"预言\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (268, 90, 'YSJLCW_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"宠物类型\":\"元素精灵\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"元素/抽象\",\"多边形数\":\"50K-80K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (269, 90, 'YSJLCW_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Elemental Designer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GPET2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (270, 90, 'YSJLCW_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"元素类型\":[\"火元素\",\"水元素\",\"土元素\",\"风元素\",\"雷元素\"],\"纯净度\":[\"基础\",\"纯净\",\"高纯\",\"完美\",\"原初\"],\"特殊能力\":[\"元素操控\",\"环境适应\",\"元素转化\",\"元素吸收\",\"元素爆发\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (271, 91, 'CQWQ_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"武器\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/史诗\",\"多边形数\":\"50K-80K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (272, 91, 'CQWQ_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Weapon Designer\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GEQUIP2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (273, 91, 'CQWQ_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"武器类型\":[\"剑\",\"斧\",\"弓\",\"法杖\",\"匕首\"],\"稀有度\":[\"普通\",\"稀有\",\"史诗\",\"传说\",\"神话\"],\"特殊效果\":[\"元素伤害\",\"吸血\",\"暴击强化\",\"穿透\",\"范围攻击\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (274, 92, 'SHFJ_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"防具\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"神话/古典\",\"多边形数\":\"60K-90K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (275, 92, 'SHFJ_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Armor Designer\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GEQUIP2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (276, 92, 'SHFJ_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"防具类型\":[\"头盔\",\"胸甲\",\"护腿\",\"护臂\",\"全套\"],\"神话体系\":[\"希腊\",\"北欧\",\"东方\",\"埃及\",\"美洲\"],\"特殊效果\":[\"元素抗性\",\"生命恢复\",\"伤害反弹\",\"移动速度\",\"技能强化\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (277, 93, 'WLKJZB_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"科技装备\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/未来\",\"多边形数\":\"70K-100K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (278, 93, 'WLKJZB_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Tech Designer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GEQUIP2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (279, 93, 'WLKJZB_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"装备类型\":[\"外骨骼\",\"能量武器\",\"隐形装置\",\"增强义肢\",\"纳米装甲\"],\"科技等级\":[\"现代\",\"近未来\",\"远未来\",\"黑科技\",\"外星科技\"],\"特殊功能\":[\"增强力量\",\"隐形\",\"飞行\",\"能量护盾\",\"生命维持\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (280, 94, 'MFSP_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"饰品\",\"创作工具\":\"ZBrush+Blender+Substance Painter\",\"艺术风格\":\"奇幻/神秘\",\"多边形数\":\"40K-70K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (281, 94, 'MFSP_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Accessory Designer\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GEQUIP2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (282, 94, 'MFSP_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"饰品类型\":[\"戒指\",\"项链\",\"耳环\",\"手镯\",\"护符\"],\"魔法属性\":[\"火\",\"水\",\"土\",\"风\",\"光暗\"],\"特殊效果\":[\"属性增强\",\"技能冷却\",\"资源获取\",\"经验加成\",\"稀有掉落\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (283, 95, 'YGSQ_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"装备类型\":\"神器\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"远古/神秘\",\"多边形数\":\"80K-120K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (284, 95, 'YGSQ_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Relic Designer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GEQUIP2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (285, 95, 'YGSQ_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"神器类型\":[\"权杖\",\"神剑\",\"圣盾\",\"王冠\",\"神秘宝珠\"],\"文明来源\":[\"亚特兰蒂斯\",\"利莫里亚\",\"埃及\",\"玛雅\",\"巴比伦\"],\"特殊能力\":[\"时间操控\",\"空间扭曲\",\"生死掌控\",\"元素主宰\",\"心灵支配\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (286, 96, 'SPU_GAME_SKIN_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"英雄皮肤\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/史诗\",\"多边形数\":\"80K-120K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (287, 96, 'SPU_GAME_SKIN_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Skin Designer\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GSKIN2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (288, 96, 'SPU_GAME_SKIN_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"适用角色类型\":[\"战士\",\"法师\",\"刺客\",\"射手\",\"辅助\"],\"稀有度\":[\"普通\",\"稀有\",\"史诗\",\"传说\",\"神话\"],\"特殊效果\":[\"技能特效\",\"移动特效\",\"语音特效\",\"击杀特效\",\"复活特效\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (289, 97, 'KHZJPF_002', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"载具皮肤\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"科幻/未来\",\"多边形数\":\"70K-110K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (290, 97, 'KHZJPF_002', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Vehicle Skin Designer\",\"创作时间\":\"2023-05-15\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"90\",\"作品编号\":\"GSKIN2023002\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (291, 97, 'KHZJPF_002', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"适用载具类型\":[\"飞行器\",\"陆地车辆\",\"水上载具\",\"太空飞船\",\"机甲\"],\"科技风格\":[\"赛博朋克\",\"太空歌剧\",\"后启示录\",\"军事科技\",\"生物科技\"],\"特殊效果\":[\"引擎特效\",\"武器特效\",\"能量场\",\"光影效果\",\"声音效果\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (292, 98, 'MFWQPF_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"武器皮肤\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"奇幻/魔法\",\"多边形数\":\"50K-80K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (293, 98, 'MFWQPF_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Magical Weapon Designer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GSKIN2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (294, 98, 'MFWQPF_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"适用武器类型\":[\"法杖\",\"魔剑\",\"符文弓\",\"元素匕首\",\"神秘卷轴\"],\"魔法元素\":[\"火\",\"水\",\"土\",\"风\",\"光暗\"],\"特殊效果\":[\"元素轨迹\",\"施法特效\",\"充能特效\",\"命中特效\",\"持有姿态\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (295, 99, 'SHSWPF_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"生物皮肤\",\"创作工具\":\"ZBrush+Maya+Substance Painter\",\"艺术风格\":\"神话/古典\",\"多边形数\":\"90K-130K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (296, 99, 'SHSWPF_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Mythical Creature Designer\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GSKIN2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (297, 99, 'SHSWPF_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"适用生物类型\":[\"龙\",\"凤凰\",\"独角兽\",\"海妖\",\"奇美拉\"],\"神话体系\":[\"希腊\",\"北欧\",\"东方\",\"埃及\",\"美洲\"],\"特殊效果\":[\"形态变化\",\"环境互动\",\"光影效果\",\"音效\",\"粒子效果\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (298, 100, 'JXZJPF_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"皮肤类型\":\"装甲皮肤\",\"创作工具\":\"3ds Max+Substance Painter\",\"艺术风格\":\"机械/工业\",\"多边形数\":\"85K-125K\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (299, 100, 'JXZJPF_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Mechanical Armor Designer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GSKIN2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (300, 100, 'JXZJPF_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"适用装甲类型\":[\"轻型装甲\",\"中型装甲\",\"重型装甲\",\"动力装甲\",\"飞行装甲\"],\"机械风格\":[\"工业风\",\"军事风\",\"未来风\",\"蒸汽朋克\",\"生物机械\"],\"特殊效果\":[\"机械运动\",\"能量流动\",\"散热系统\",\"武器展示\",\"驾驶舱视角\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (301, 101, 'CQMFJC_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"魔法卷轴\",\"创作工具\":\"Photoshop+Substance Painter\",\"艺术风格\":\"奇幻/古典\",\"使用次数\":\"无限\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (302, 101, 'CQMFJC_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Scroll Designer\",\"创作时间\":\"2023-04-05\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"100\",\"作品编号\":\"GITEM2023001\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (303, 101, 'CQMFJC_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"魔法类型\":[\"召唤魔法\",\"元素魔法\",\"变形魔法\",\"治愈魔法\",\"禁忌魔法\"],\"稀有度\":[\"普通\",\"稀有\",\"史诗\",\"传说\",\"神话\"],\"使用效果\":[\"召唤生物\",\"元素攻击\",\"变形\",\"治愈\",\"时空扭曲\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (304, 102, 'GJYS_003', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"药水\",\"创作工具\":\"Blender+Substance Painter\",\"艺术风格\":\"奇幻/炼金\",\"使用次数\":\"无限\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (305, 102, 'GJYS_003', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Potion Designer\",\"创作时间\":\"2023-06-20\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"85\",\"作品编号\":\"GITEM2023003\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (306, 102, 'GJYS_003', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"药水类型\":[\"治疗药水\",\"增益药水\",\"变形药水\",\"抗性药水\",\"特殊效果药水\"],\"药水品质\":[\"普通\",\"高级\",\"精良\",\"完美\",\"神话\"],\"使用效果\":[\"生命恢复\",\"属性提升\",\"形态变化\",\"伤害减免\",\"特殊能力\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (307, 103, 'MFFW_004', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"符文\",\"创作工具\":\"Photoshop+Substance Designer\",\"艺术风格\":\"神秘/古代\",\"使用次数\":\"无限\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (308, 103, 'MFFW_004', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Rune Designer\",\"创作时间\":\"2023-07-25\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"95\",\"作品编号\":\"GITEM2023004\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (309, 103, 'MFFW_004', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"符文类型\":[\"攻击符文\",\"防御符文\",\"增益符文\",\"控制符文\",\"特殊符文\"],\"符文体系\":[\"北欧\",\"精灵\",\"矮人\",\"龙族\",\"远古\"],\"使用效果\":[\"武器强化\",\"防具强化\",\"技能强化\",\"特殊能力\",\"被动效果\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (310, 104, 'CSMDJ_005', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"道具类型\":\"传送门\",\"创作工具\":\"Maya+Substance Painter\",\"艺术风格\":\"魔法/科幻\",\"使用次数\":\"无限\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (311, 104, 'CSMDJ_005', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Portal Designer\",\"创作时间\":\"2023-08-30\",\"区块链平台\":\"Ethereum\",\"发行数量\":\"80\",\"作品编号\":\"GITEM2023005\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (312, 104, 'CSMDJ_005', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"传送类型\":[\"地点传送\",\"维度传送\",\"时间传送\",\"随机传送\",\"指定传送\"],\"传送范围\":[\"短距离\",\"中距离\",\"长距离\",\"跨地图\",\"跨服务器\"],\"特殊效果\":[\"群体传送\",\"物品传送\",\"记忆传送\",\"隐形传送\",\"紧急逃脱\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (313, 105, 'SPU_DOC_WORD_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"文件格式\":\"docx\",\"页数\":\"50+\",\"兼容版本\":\"Word 2016+\",\"模板类型\":\"商务报告\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (314, 105, 'SPU_DOC_WORD_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Template Master\",\"更新日期\":\"2024-01-15\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (315, 105, 'SPU_DOC_WORD_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"风格\":[\"简约\",\"商务\",\"专业\",\"现代\"],\"颜色主题\":[\"蓝色\",\"灰色\",\"红色\"],\"适用场景\":[\"年度报告\",\"项目报告\",\"商业计划书\",\"调研报告\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (316, 106, 'SPU_DOC_EXCEL_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"文件格式\":\"xlsx\",\"工作表数\":\"20+\",\"兼容版本\":\"Excel 2016+\",\"模板类型\":\"财务分析\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (317, 106, 'SPU_DOC_EXCEL_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Finance Expert\",\"更新日期\":\"2024-01-20\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (318, 106, 'SPU_DOC_EXCEL_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"报表类型\":[\"资产负债表\",\"利润表\",\"现金流量表\",\"财务分析\"],\"功能特点\":[\"自动计算\",\"图表生成\",\"数据分析\",\"报表打印\"],\"适用对象\":[\"财务人员\",\"管理层\",\"创业者\",\"学生\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (319, 107, 'SPU_DOC_PPT_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"文件格式\":\"pptx\",\"页数\":\"1000+\",\"兼容版本\":\"PowerPoint 2016+\",\"模板数量\":\"50套\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (320, 107, 'SPU_DOC_PPT_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"PPT Master\",\"更新日期\":\"2024-01-25\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (321, 107, 'SPU_DOC_PPT_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"风格类型\":[\"商务\",\"创意\",\"简约\",\"科技\"],\"内容类型\":[\"商务演示\",\"项目汇报\",\"营销策划\",\"教育培训\"],\"特色功能\":[\"动画效果\",\"母版设计\",\"图表模板\",\"图标素材\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (322, 108, 'SPU_DOC_PDF_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"文件格式\":\"pdf\",\"表单数量\":\"30+\",\"兼容版本\":\"Adobe Acrobat DC+\",\"类型\":\"智能表单\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (323, 108, 'SPU_DOC_PDF_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Form Expert\",\"更新日期\":\"2024-01-30\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (324, 108, 'SPU_DOC_PDF_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"表单类型\":[\"调查问卷\",\"报名表\",\"评估表\",\"申请表\"],\"功能特点\":[\"自动填充\",\"数据收集\",\"表单验证\",\"数据导出\"],\"适用场景\":[\"企业管理\",\"教育培训\",\"市场调研\",\"活动策划\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (325, 109, 'SPU_DOC_OTHER_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"支持格式\":\"Markdown/LaTeX/HTML\",\"模板数量\":\"100+\",\"主题风格\":\"20+\",\"类型\":\"综合模板\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (326, 109, 'SPU_DOC_OTHER_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Template Team\",\"更新日期\":\"2024-02-01\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (327, 109, 'SPU_DOC_OTHER_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"文档类型\":[\"学术论文\",\"技术文档\",\"网页模板\",\"电子书\"],\"编辑器支持\":[\"VS Code\",\"Typora\",\"TeXstudio\",\"Sublime Text\"],\"应用场景\":[\"学术写作\",\"技术文档\",\"网站建设\",\"电子出版\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (328, 110, 'SPU_IMG_WALL_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"图片格式\":\"JPG/PNG\",\"数量\":\"100张\",\"分辨率\":\"3840x2160\",\"类型\":\"科幻壁纸\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (329, 110, 'SPU_IMG_WALL_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Wallpaper Master\",\"更新日期\":\"2024-02-05\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (330, 110, 'SPU_IMG_WALL_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"主题风格\":[\"未来城市\",\"太空探索\",\"机械科技\",\"赛博朋克\"],\"适用设备\":[\"电脑桌面\",\"手机壁纸\",\"平板设备\",\"智能电视\"],\"色彩风格\":[\"炫彩\",\"暗黑\",\"霓虹\",\"简约\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (331, 111, 'SPU_IMG_AVATAR_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"图片格式\":\"PNG/PSD\",\"数量\":\"50个\",\"尺寸\":\"1024x1024\",\"类型\":\"二次元头像\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (332, 111, 'SPU_IMG_AVATAR_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Avatar Artist\",\"更新日期\":\"2024-02-10\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (333, 111, 'SPU_IMG_AVATAR_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"人物风格\":[\"可爱\",\"清新\",\"治愈\",\"酷炫\"],\"表情类型\":[\"开心\",\"伤心\",\"生气\",\"惊讶\"],\"适用平台\":[\"微信\",\"QQ\",\"微博\",\"抖音\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (334, 112, 'SPU_IMG_POSTER_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"文件格式\":\"PSD/AI\",\"数量\":\"30个\",\"尺寸\":\"多种规格\",\"类型\":\"商业海报\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (335, 112, 'SPU_IMG_POSTER_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Poster Designer\",\"更新日期\":\"2024-02-15\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (336, 112, 'SPU_IMG_POSTER_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"设计风格\":[\"简约\",\"时尚\",\"商务\",\"创意\"],\"应用场景\":[\"社交媒体\",\"展览展示\",\"促销活动\",\"企业宣传\"],\"尺寸规格\":[\"A4\",\"A3\",\"方形\",\"横版\",\"竖版\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (337, 113, 'SPU_IMG_ILLUST_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"文件格式\":\"AI/EPS/PNG\",\"数量\":\"20幅\",\"分辨率\":\"300DPI\",\"类型\":\"商业插画\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (338, 113, 'SPU_IMG_ILLUST_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"设计师\":\"Illustration Master\",\"更新日期\":\"2024-02-20\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (339, 113, 'SPU_IMG_ILLUST_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"插画风格\":[\"手绘\",\"水彩\",\"线描\",\"扁平\"],\"应用场景\":[\"品牌营销\",\"产品包装\",\"社交媒体\",\"企业宣传\"],\"主题类型\":[\"人物\",\"场景\",\"产品\",\"概念\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (340, 114, 'SPU_MUSIC_BGM_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音频格式\":\"WAV/MP3\",\"数量\":\"50首\",\"采样率\":\"48kHz\",\"时长\":\"2-5分钟\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (341, 114, 'SPU_MUSIC_BGM_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"作曲家\":\"Music Master\",\"发行日期\":\"2024-02-25\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (342, 114, 'SPU_MUSIC_BGM_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"音乐风格\":[\"轻音乐\",\"钢琴\",\"吉他\",\"弦乐\"],\"情感氛围\":[\"温馨\",\"欢快\",\"舒缓\",\"优雅\"],\"适用场景\":[\"视频配乐\",\"商业空间\",\"广告制作\",\"企业宣传\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (343, 115, 'SPU_MUSIC_SCORE_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音频格式\":\"WAV/AIFF\",\"数量\":\"30首\",\"采样率\":\"96kHz\",\"位深度\":\"24bit\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (344, 115, 'SPU_MUSIC_SCORE_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"作曲家\":\"Score Master\",\"发行日期\":\"2024-03-01\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (345, 115, 'SPU_MUSIC_SCORE_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"配乐风格\":[\"史诗\",\"悬疑\",\"动作\",\"情感\"],\"乐器构成\":[\"管弦乐\",\"打击乐\",\"合成器\",\"人声\"],\"适用场景\":[\"电影配乐\",\"预告片\",\"游戏配乐\",\"广告片\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (346, 116, 'SPU_MUSIC_BEAT_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音频格式\":\"WAV/MIDI\",\"数量\":\"100个\",\"采样率\":\"44.1kHz\",\"BPM范围\":\"80-160\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (347, 116, 'SPU_MUSIC_BEAT_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"制作人\":\"Beat Master\",\"发行日期\":\"2024-03-05\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (348, 116, 'SPU_MUSIC_BEAT_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"节拍风格\":[\"Hip Hop\",\"Trap\",\"Pop\",\"EDM\"],\"声音类型\":[\"鼓组\",\"打击乐\",\"效果器\",\"合成器\"],\"适用场景\":[\"音乐制作\",\"混音\",\"现场表演\",\"广告配乐\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (349, 117, 'SPU_MUSIC_NATURE_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音频格式\":\"WAV/MP3\",\"数量\":\"200个\",\"采样率\":\"96kHz\",\"录音设备\":\"专业级\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (350, 117, 'SPU_MUSIC_NATURE_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"录音师\":\"Nature Master\",\"发行日期\":\"2024-03-10\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (351, 117, 'SPU_MUSIC_NATURE_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"环境类型\":[\"雨声\",\"海浪\",\"鸟鸣\",\"森林\"],\"时长范围\":[\"短片段\",\"循环音效\",\"长环境音\",\"氛围音效\"],\"适用场景\":[\"影视制作\",\"冥想放松\",\"游戏音效\",\"环境布置\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (352, 118, 'SPU_MUSIC_OTHER_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"音频格式\":\"WAV/MP3/OGG\",\"数量\":\"500个\",\"采样率\":\"48kHz\",\"分类\":\"综合音效\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (353, 118, 'SPU_MUSIC_OTHER_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"制作团队\":\"Sound Team\",\"发行日期\":\"2024-03-15\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (354, 118, 'SPU_MUSIC_OTHER_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"音效类型\":[\"生活场景\",\"电子音效\",\"转场音效\",\"UI音效\"],\"时长类型\":[\"短音效\",\"中等音效\",\"长音效\",\"循环音效\"],\"应用领域\":[\"视频制作\",\"游戏开发\",\"APP开发\",\"多媒体创作\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (355, 119, 'SPU_VIDEO_AD_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"视频格式\":\"MP4/MOV\",\"数量\":\"30个\",\"分辨率\":\"4K\",\"时长\":\"15-60秒\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (356, 119, 'SPU_VIDEO_AD_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"制作团队\":\"Ad Team\",\"发行日期\":\"2024-03-20\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (357, 119, 'SPU_VIDEO_AD_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"广告类型\":[\"产品展示\",\"品牌宣传\",\"活动推广\",\"社交媒体\"],\"风格类型\":[\"时尚\",\"科技\",\"简约\",\"奢华\"],\"适用平台\":[\"电视\",\"网站\",\"社交媒体\",\"户外大屏\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (358, 120, 'SPU_VIDEO_PROMO_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"视频格式\":\"MP4/AE Project\",\"数量\":\"20个\",\"分辨率\":\"4K\",\"时长\":\"3-5分钟\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (359, 120, 'SPU_VIDEO_PROMO_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"制作团队\":\"Promo Team\",\"发行日期\":\"2024-03-25\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (360, 120, 'SPU_VIDEO_PROMO_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"内容类型\":[\"企业介绍\",\"产品展示\",\"发展历程\",\"团队风采\"],\"风格类型\":[\"商务\",\"科技\",\"创意\",\"人文\"],\"适用行业\":[\"科技\",\"金融\",\"制造\",\"服务\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (361, 121, 'SPU_VIDEO_EDU_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"视频格式\":\"MP4/AE Project\",\"数量\":\"25个\",\"分辨率\":\"2K\",\"时长\":\"10-30分钟\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (362, 121, 'SPU_VIDEO_EDU_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"制作团队\":\"Edu Team\",\"发行日期\":\"2024-03-30\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (363, 121, 'SPU_VIDEO_EDU_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"课程类型\":[\"知识讲解\",\"技能培训\",\"语言教学\",\"考试辅导\"],\"教学元素\":[\"图表动画\",\"字幕特效\",\"转场效果\",\"互动元素\"],\"适用对象\":[\"中小学\",\"高等教育\",\"职业培训\",\"企业培训\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (364, 122, 'SPU_VIDEO_ANIM_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"项目格式\":\"AE Project\",\"场景数量\":\"40个\",\"分辨率\":\"4K\",\"帧率\":\"60fps\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (365, 122, 'SPU_VIDEO_ANIM_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"制作团队\":\"Animation Team\",\"发行日期\":\"2024-04-01\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (366, 122, 'SPU_VIDEO_ANIM_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"动画类型\":[\"MG动画\",\"图标动画\",\"文字动画\",\"场景动画\"],\"风格类型\":[\"扁平化\",\"等距\",\"手绘\",\"科技\"],\"应用场景\":[\"产品介绍\",\"流程演示\",\"数据展示\",\"品牌宣传\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (367, 123, 'SPU_VIDEO_OTHER_001', 'BASIC_ATTRS', '基础属性', 1, 3, '{\"视频格式\":\"MP4/MOV/ProRes\",\"数量\":\"100个\",\"分辨率\":\"4K\",\"帧率\":\"24-60fps\"}', 1, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (368, 123, 'SPU_VIDEO_OTHER_001', 'SALE_ATTRS', '销售属性', 2, 3, '{\"制作团队\":\"Video Team\",\"发行日期\":\"2024-04-05\",\"授权类型\":\"商业授权\",\"使用期限\":\"永久\"}', 2, 1, 1, 1, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_attr_params` VALUES (369, 123, 'SPU_VIDEO_OTHER_001', 'SPEC_ATTRS', '规格属性', 3, 3, '{\"素材类型\":[\"实拍素材\",\"特效素材\",\"转场素材\",\"背景素材\"],\"使用场景\":[\"影视制作\",\"直播制作\",\"短视频\",\"演示视频\"],\"风格类型\":[\"商务\",\"生活\",\"自然\",\"创意\"]}', 3, 1, 1, 0, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');

-- ----------------------------
-- Table structure for sys_product_spu_detail
-- ----------------------------
DROP TABLE IF EXISTS `sys_product_spu_detail`;
CREATE TABLE `sys_product_spu_detail`  (
                                           `id` bigint NOT NULL AUTO_INCREMENT,
                                           `product_spu_id` bigint NOT NULL DEFAULT 0 COMMENT '商品spu id',
                                           `product_spu_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品spu编码',
                                           `detail` longblob NULL COMMENT '详情',
                                           `packing_list` longblob NULL COMMENT '包装清单',
                                           `after_sale` longblob NULL COMMENT '售后服务',
                                           `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                           `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                           `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                           `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                           `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                           PRIMARY KEY (`id`) USING BTREE,
                                           INDEX `idx_product_spu_id`(`product_spu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 123 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_product_spu_detail
-- ----------------------------
INSERT INTO `sys_product_spu_detail` VALUES (1, 1, 'SPU_ART_PAINT_001', 0xE8BF99E698AFE4B880E5B985E794B1E79FA5E5908DE695B0E5AD97E889BAE69CAFE5AEB6E5889BE4BD9CE79A84E69CAAE69DA5E59F8EE5B882E889BAE69CAFE794BBE4BD9C4E4654EFBC8CE5B195E78EB0E4BA8632313530E5B9B4E69CAAE69DA5E59F8EE5B882E79A84E7A791E68A80E4B88EE4BABAE69687E89E8DE59088E699AFE8B1A1EFBC8CE98787E794A8E58588E8BF9BE79A84E695B0E5AD97E7BB98E794BBE68A80E69CAFEFBC8CE889B2E5BDA9E9B29CE6988EEFBC8CE7BB86E88A82E4B8B0E5AF8CE38082, 0xE695B0E5AD97E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E889BAE69CAFE59381E989B4E8B58FE68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (2, 2, 'SPU_ART_PAINT_002', 0xE8BF99E698AFE4B880E5B985E78EB0E4BBA3E68ABDE8B1A1E587A0E4BD95E889BAE69CAFE794BBE4BD9C4E4654EFBC8CE889BAE69CAFE5AEB6E9809AE8BF87E587A0E4BD95E5BDA2E78AB6E5928CE9B29CE6988EE79A84E889B2E5BDA9E5AFB9E6AF94EFBC8CE8A1A8E8BEBEE4BA86E5AFB9E78EB0E4BBA3E7A4BEE4BC9AE7A7A9E5BA8FE4B88EE6B7B7E6B28CE79A84E6809DE88083EFBC8CE698AFE78EB0E4BBA3E889BAE69CAFE694B6E8978FE79A84E4BC98E8B4A8E98089E68BA9E38082, 0xE695B0E5AD97E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E889BAE69CAFE59381E989B4E8B58FE68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (3, 3, 'SPU_ART_PAINT_003', 0xE8BF99E698AFE4B880E5B985E8B59BE58D9AE69C8BE5858BE9A38EE6A0BCE79A84E889BAE69CAFE794BBE4BD9C4E4654EFBC8CE68F8FE7BB98E4BA86E4B880E4B8AAE9AB98E7A791E68A80E4BD86E4BD8EE7949FE6B4BBE6B0B4E5B9B3E79A84E58F8DE4B98CE68998E982A6E4B896E7958CEFBC8CE99C93E899B9E781AFE38081E794B5E5AD90E8AEBEE5A487E4B88EE4BABAE7B1BBE79A84E4BAA4E4BA92EFBC8CE8A1A8E8BEBEE4BA86E5AFB9E68A80E69CAFE58F91E5B195E4B88EE4BABAE680A7E79A84E6809DE88083E38082, 0xE695B0E5AD97E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E889BAE69CAFE59381E989B4E8B58FE68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (4, 4, 'SPU_ART_PAINT_004', 0xE8BF99E698AFE4B880E5B985E6B3A2E699AEE889BAE69CAFE9A38EE6A0BCE79A84E794BBE4BD9C4E4654EFBC8CE889BAE69CAFE5AEB6E5809FE989B4E4BA86E5AE89E8BFAAC2B7E6B283E99C8DE5B094E79A84E5889BE4BD9CE6898BE6B395EFBC8CE5B086E78EB0E4BBA3E6B581E8A18CE69687E58C96E58583E7B4A0E4B88EE889BAE69CAFE5889BE4BD9CE79BB8E7BB93E59088EFBC8CE889B2E5BDA9E9B29CE6988EEFBC8CE9A38EE6A0BCE78BACE789B9E38082, 0xE695B0E5AD97E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E889BAE69CAFE59381E989B4E8B58FE68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (5, 5, 'SPU_ART_PAINT_005', 0xE8BF99E698AFE4B880E5B985E4B89CE696B9E6B0B4E5A2A8E9A38EE6A0BCE79A84E889BAE69CAFE794BBE4BD9C4E4654EFBC8CE889BAE69CAFE5AEB6E5B086E4BCA0E7BB9FE4B89CE696B9E6B0B4E5A2A8E68A80E6B395E4B88EE78EB0E4BBA3E695B0E5AD97E889BAE69CAFE79BB8E7BB93E59088EFBC8CE8A1A8E78EB0E4BA86E5B1B1E6B0B4E38081E88AB1E9B89FE7AD89E4BCA0E7BB9FE9A298E69D90EFBC8CE6848FE5A283E6B7B1E8BF9CEFBC8CE99FB5E591B3E682A0E995BFE38082, 0xE695B0E5AD97E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E889BAE69CAFE59381E989B4E8B58FE68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (6, 6, 'SPU_MUSIC_001', 0xE8BF99E698AFE4B880E5BCA0E99990E9878FE78988E794B5E5AD90E99FB3E4B990E4B893E8BE914E4654EFBC8CE794B1E79FA5E5908DE794B5E5AD90E99FB3E4B990E588B6E4BD9CE4BABAE5889BE4BD9CEFBC8CE58C85E590AB3130E9A696E78BACE5AEB6E99FB3E8BDA8EFBC8CE89E8DE59088E4BA86E5A49AE7A78DE794B5E5AD90E99FB3E4B990E58583E7B4A0EFBC8CE88A82E5A58FE6849FE5BCBAEFBC8CE99FB3E69588E4B8B0E5AF8CE38082, 0xE99FB3E4B990E4B893E8BE914E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E59381E8B4A8E99FB3E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE99FB3E4B990E4BD9CE59381E69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (7, 7, 'SPU_MUSIC_002', 0xE8BF99E698AFE4B880E5BCA0E99990E9878FE78988E5AE9EE9AA8CE788B5E5A3ABE4B9904E4654EFBC8CE794B1E79FA5E5908DE788B5E5A3ABE4B990E59BA2E5889BE4BD9CEFBC8CE89E8DE59088E4BA86E788B5E5A3ABE38081E794B5E5AD90E38081E58FA4E585B8E7AD89E5A49AE7A78DE99FB3E4B990E58583E7B4A0EFBC8CE68993E7A0B4E4BCA0E7BB9FE788B5E5A3ABE4B990E7958CE99990EFBC8CE5889BE696B0E680A7E5BCBAE38082, 0xE99FB3E4B990E4BD9CE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E59381E8B4A8E99FB3E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE99FB3E4B990E4BD9CE59381E69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (8, 8, 'SPU_MUSIC_003', 0xE8BF99E698AFE4B880E5BCA0E99990E9878FE78988E78EAFE5A283E99FB3E4B990E4BD9CE593814E4654EFBC8CE794B1E78EAFE5A283E99FB3E4B990E5A4A7E5B888E5889BE4BD9CEFBC8CE89E8DE59088E4BA86E887AAE784B6E5A3B0E99FB3E4B88EE794B5E5AD90E59088E68890E99FB3E889B2EFBC8CE890A5E980A0E587BAE6B289E6B5B8E5BC8FE79A84E5A3B0E99FB3E699AFE8A782EFBC8CE98082E59088E586A5E683B3E38081E694BEE69DBEE5928CE4B893E6B3A8E38082, 0xE99FB3E4B990E4BD9CE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E59381E8B4A8E99FB3E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE99FB3E4B990E4BD9CE59381E69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (9, 9, 'SPU_MUSIC_004', 0xE8BF99E698AFE4B880E5BCA0E99990E9878FE78988E58588E9948BE58FA4E585B8E99FB3E4B9904E4654EFBC8CE794B1E696B0E7949FE4BBA3E58FA4E585B8E99FB3E4B990E4BD9CE69BB2E5AEB6E5889BE4BD9CEFBC8CE5B086E4BCA0E7BB9FE58FA4E585B8E99FB3E4B990E58583E7B4A0E4B88EE78EB0E4BBA3E794B5E5AD90E99FB3E4B990E38081E5AE9EE9AA8CE99FB3E4B990E79BB8E7BB93E59088EFBC8CE68993E7A0B4E4BCA0E7BB9FE58FA4E585B8E99FB3E4B990E79A84E7958CE99990E38082, 0xE99FB3E4B990E4BD9CE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E59381E8B4A8E99FB3E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990E38081E4B990E8B0B1504446, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE99FB3E4B990E4BD9CE59381E69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (10, 10, 'SPU_MUSIC_005', 0xE8BF99E698AFE4B880E5BCA0E99990E9878FE78988E4B896E7958CE99FB3E4B990E89E8DE590884E4654EFBC8CE794B1E69DA5E887AAE4B88DE5908CE69687E58C96E8838CE699AFE79A84E99FB3E4B990E4BABAE59088E4BD9CE5889BE4BD9CEFBC8CE89E8DE59088E4BA86E4BA9AE6B4B2E38081E99D9EE6B4B2E38081E68B89E4B881E7BE8EE6B4B2E7AD89E59CB0E58CBAE79A84E4BCA0E7BB9FE99FB3E4B990E58583E7B4A0EFBC8CE5B195E78EB0E4BA86E5A49AE58583E69687E58C96E79A84E99FB3E4B990E5AFB9E8AF9DE38082, 0xE99FB3E4B990E4BD9CE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E59381E8B4A8E99FB3E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990E38081E5889BE4BD9CE7BAAAE5BD95E78987E8AEBFE997AEE69D83, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE99FB3E4B990E4BD9CE59381E69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (11, 11, 'SPU_VIDEO_ART_001', 0xE8BF99E698AFE4B880E4BBB6E99990E9878FE78988E68ABDE8B1A1E58AA8E68081E889BAE69CAF4E4654EFBC8CE794B1E8A786E8A789E889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE9809AE8BF87E6B581E58AA8E79A84E889B2E5BDA9E38081E5BDA2E78AB6E5928CE7BAB9E79086EFBC8CE8A1A8E8BEBEE68385E6849FE5928CE6809DE683B3E79A84E6B581E58AA8E680A7EFBC8CE698AFE4B880E7A78DE8A786E8A789E4B88EE68385E6849FE79A84E6B289E6B5B8E5BC8FE4BD93E9AA8CE38082, 0xE8A786E9A291E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E8A786E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (12, 12, 'SPU_VIDEO_ART_002', 0xE8BF99E698AFE4B880E4BBB6E99990E9878FE78988E695B0E5AD97E7949FE591BDE6A8A1E68B9F4E4654EFBC8CE794B1E7AE97E6B395E889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE9809AE8BF87E5A48DE69D82E7AE97E6B395E6A8A1E68B9FE7949FE591BDE4BD93E79A84E7949FE68890E38081E6BC94E58C96E5928CE4BA92E58AA8E8BF87E7A88BEFBC8CE6AF8FE4B8AA4E4654E983BDE698AFE78BACE789B9E79A84E7949FE591BDE6BC94E58C96E8BDA8E8BFB9EFBC8CE6B0B8E4B88DE9878DE5A48DE38082, 0xE8A786E9A291E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E8A786E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990E38081E7AE97E6B395E6BA90E4BBA3E7A081E8AEBFE997AEE69D83, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (13, 13, 'SPU_VIDEO_ART_003', 0xE8BF99E698AFE4B880E4BBB6E99990E9878FE78988E6B289E6B5B8E5BC8FE9A38EE699AF4E4654EFBC8CE794B1E695B0E5AD97E699AFE8A782E889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE9809AE8BF873344E5BBBAE6A8A1E5928CE58AA8E794BBE68A80E69CAFEFBC8CE5889BE980A0E587BAE8B685E78EB0E5AE9EE79A84E887AAE784B6E699AFE8A782EFBC8CE5A682E6B581E58AA8E79A84E5B1B1E88489E38081E6BC82E6B5AEE79A84E5B29BE5B1BFE38081E58F98E5B9BBE79A84E5A4A9E7A9BAE7AD89EFBC8CE5B8A6E69DA5E8A786E8A789E4B88AE79A84E6B289E6B5B8E6849FE38082, 0xE8A786E9A291E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E8A786E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (14, 14, 'SPU_VIDEO_ART_004', 0xE8BF99E698AFE4B880E4BBB6E99990E9878FE78988E695B0E5AD97E8889EE8B988E8A1A8E6BC944E4654EFBC8CE794B1E8889EE8B988E889BAE69CAFE5AEB6E4B88EE695B0E5AD97E889BAE69CAFE5AEB6E59088E4BD9CE5889BE4BD9CEFBC8CE9809AE8BF87E58AA8E4BD9CE68D95E68D89E68A80E69CAFEFBC8CE5B086E79C9FE5AE9EE8889EE88085E79A84E8A1A8E6BC94E8BDACE58C96E4B8BAE695B0E5AD97E8A786E8A789E889BAE69CAFEFBC8CE5B195E78EB0E8BAABE4BD93E4B88EE695B0E5AD97E79A84E5AFB9E8AF9DE38082, 0xE8A786E9A291E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E8A786E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990E38081E5889BE4BD9CE88AB1E7B5AEE8AEBFE997AEE69D83, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (15, 15, 'SPU_VIDEO_ART_005', 0xE8BF99E698AFE4B880E4BBB6E99990E9878FE78988E59F8EE5B882E88489E58AA84E4654EFBC8CE794B1E59F8EE5B882E5BDB1E5838FE889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE9809AE8BF87E5BBB6E697B6E69184E5BDB1E5928CE695B0E5AD97E5A484E79086E68A80E69CAFEFBC8CE68D95E68D89E59F8EE5B882E79A84E6B581E58AA8E38081E88A82E5A58FE5928CE88489E58AA8EFBC8CE5B195E78EB0E78EB0E4BBA3E983BDE5B882E7949FE6B4BBE79A84E8A786E8A789E99FB5E5BE8BE38082, 0xE8A786E9A291E889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E8A786E9A291E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (16, 16, 'SPU_TEXT_ART_001', 0xE8BF99E698AFE4B880E983A8E99990E9878FE78988E695B0E5AD97E8AF97E6AD8CE99B864E4654EFBC8CE794B1E5BD93E4BBA3E8AF97E4BABAE4B88EE8A786E8A789E889BAE69CAFE5AEB6E59088E4BD9CE5889BE4BD9CEFBC8CE5B086E69687E5AD97E4B88EE8A786E8A789E58583E7B4A0E89E8DE59088EFBC8CE9809AE8BF87E58AA8E68081E68E92E78988E38081E4BA92E58AA8E69687E69CACE5928CE8A786E8A789E69588E69E9CEFBC8CE4B8BAE8AF97E6AD8CE8B58BE4BA88E696B0E79A84E8A1A8E8BEBEE5BDA2E5BC8FE38082, 0xE69687E69CACE889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E695B0E5AD97E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (17, 17, 'SPU_TEXT_ART_002', 0xE8BF99E698AFE4B880E983A8E99990E9878FE78988E5AE9EE9AA8CE5B08FE8AFB44E4654EFBC8CE794B1E5898DE58DABE4BD9CE5AEB6E5889BE4BD9CEFBC8CE68993E7A0B4E4BCA0E7BB9FE58F99E4BA8BE7BB93E69E84EFBC8CE98787E794A8E99D9EE7BABFE680A7E58F99E4BA8BE38081E5A49AE8A786E8A792E38081E4BA92E58AA8E98089E68BA9E7AD89E5889BE696B0E6898BE6B395EFBC8CE8AFBBE88085E58FAFE4BBA5E58F82E4B88EE69585E4BA8BE79A84E58F91E5B195E696B9E59091E38082, 0xE69687E69CACE889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E695B0E5AD97E69687E4BBB6E4B88BE8BDBDE69D83E99990E38081E4BD9CE88085E7ADBEE5908DE78988504446, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (18, 18, 'SPU_TEXT_ART_003', 0xE8BF99E698AFE4B880E983A8E99990E9878FE78988E695B0E5AD97E589A7E69CAC4E4654EFBC8CE794B1E696B0E99490E589A7E4BD9CE5AEB6E5889BE4BD9CEFBC8CE68EA2E7B4A2E695B0E5AD97E697B6E4BBA3E79A84E4BABAE680A7E4B88EE7A791E68A80E585B3E7B3BBEFBC8CE98787E794A8E5889BE696B0E79A84E6888FE589A7E69687E69CACE5BDA2E5BC8FEFBC8CE58C85E590ABE5A49AE5AA92E4BD93E58583E7B4A0E5928CE4BA92E58AA8E59CBAE699AFE38082, 0xE69687E69CACE889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E695B0E5AD97E69687E4BBB6E4B88BE8BDBDE69D83E99990E38081E4BD9CE88085E7ADBEE5908DE78988504446, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (19, 19, 'SPU_TEXT_ART_004', 0xE8BF99E698AFE4B880E4BBB6E99990E9878FE78988E6A682E5BFB5E69687E69CACE889BAE69CAF4E4654EFBC8CE794B1E6A682E5BFB5E889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE5B086E69687E5AD97E4BD9CE4B8BAE8A786E8A789E58583E7B4A0E8BF9BE8A18CE68E92E58897E7BB84E59088EFBC8CE68EA2E7B4A2E8AFADE8A880E38081E7ACA6E58FB7E4B88EE6848FE4B989E4B98BE997B4E79A84E585B3E7B3BBEFBC8CE698AFE69687E5AD97E79A84E8A786E8A789E5AE9EE9AA8CE38082, 0xE69687E69CACE889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E695B0E5AD97E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (20, 20, 'SPU_TEXT_ART_005', 0xE8BF99E698AFE4B880E983A8E99990E9878FE78988E695B0E5AD97E695A3E69687E99B864E4654EFBC8CE794B1E5BD93E4BBA3E6809DE683B3E5AEB6E5889BE4BD9CEFBC8CE68EA2E8AEA8E695B0E5AD97E697B6E4BBA3E79A84E593B2E5ADA6E38081E889BAE69CAFE4B88EE7A4BEE4BC9AE8AEAEE9A298EFBC8CE69687E5AD97E4BC98E7BE8EEFBC8CE6809DE683B3E6B7B1E588BBEFBC8CE9858DE69C89E7B2BEE7BE8EE79A84E8A786E8A789E8AEBEE8AEA1E38082, 0xE69687E69CACE889BAE69CAFE593814E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E9AB98E6B885E695B0E5AD97E69687E4BBB6E4B88BE8BDBDE69D83E99990E38081E4BD9CE88085E7ADBEE5908DE78988504446, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE889BAE69CAFE59381E58D87E7BAA7E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (21, 21, 'SPU_AVATAR_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CAAE69DA5E7A791E68A80E9A38EE6A0BCE5A4B4E5838F4E4654EFBC8CE794B1E695B0E5AD97E889BAE69CAFE5AEB6E7B2BEE5BF83E8AEBEE8AEA1EFBC8CE89E8DE59088E8B59BE58D9AE69C8BE5858BE5928CE69CAAE69DA5E4B8BBE4B989E58583E7B4A0EFBC8CE98082E794A8E4BA8EE59084E5A4A7E7A4BEE4BAA4E5B9B3E58FB0E5928CE58583E5AE87E5AE99E7A9BAE997B4EFBC8CE5BDB0E698BEE78BACE789B9E79A84E695B0E5AD97E8BAABE4BBBDE38082, 0xE5A4B4E5838F4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE5B0BAE5AFB8E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5A4B4E5838FE69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (22, 22, 'SPU_AVATAR_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E5B9BBE683B3E7949FE789A9E5A4B4E5838F4E4654EFBC8CE794B1E5A587E5B9BBE889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE89E8DE59088E7A59EE8AF9DE38081E9AD94E5B9BBE5928CE5A587E5B9BBE58583E7B4A0EFBC8CE5889BE980A0E587BAE78BACE789B9E79A84E99D9EE4BABAE7B1BBE7949FE789A9E5BDA2E8B1A1EFBC8CE98082E794A8E4BA8EE6B8B8E6888FE38081E7A4BEE4BAA4E5B9B3E58FB0E5928CE58583E5AE87E5AE99E7A9BAE997B4E38082, 0xE5A4B4E5838F4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE5B0BAE5AFB8E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5A4B4E5838FE69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (23, 23, 'SPU_AVATAR_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E68ABDE8B1A1E889BAE69CAFE5A4B4E5838F4E4654EFBC8CE794B1E68ABDE8B1A1E889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE8BF90E794A8E587A0E4BD95E5BDA2E78AB6E38081E889B2E5BDA9E5928CE7BAB9E79086EFBC8CE5889BE980A0E587BAE99D9EE585B7E8B1A1E79A84E8A786E8A789E8A1A8E8BEBEEFBC8CE98082E59088E8BFBDE6B182E889BAE69CAFE8A1A8E8BEBEE79A84E695B0E5AD97E8BAABE4BBBDE38082, 0xE5A4B4E5838F4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE5B0BAE5AFB8E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5A4B4E5838FE69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (24, 24, 'SPU_AVATAR_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E5A48DE58FA4E5838FE7B4A0E9A38EE6A0BCE5A4B4E5838F4E4654EFBC8CE794B1E5838FE7B4A0E889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE98787E794A8E7BB8FE585B838E4BD8DE688963136E4BD8DE6B8B8E6888FE9A38EE6A0BCEFBC8CE58585E6BBA1E68080E697A7E6849FE5928CE5A48DE58FA4E6B8B8E6888FE9AD85E58A9BEFBC8CE98082E59088E6B8B8E6888FE788B1E5A5BDE88085E5928CE5A48DE58FA4E69687E58C96E788B1E5A5BDE88085E38082, 0xE5A4B4E5838F4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE5B0BAE5AFB8E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5A4B4E5838FE69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (25, 25, 'SPU_AVATAR_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E58AA8E789A9E68B9FE4BABAE5A4B4E5838F4E4654EFBC8CE794B1E68F92E794BBE889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE5B086E59084E7A78DE58AA8E789A9E5BDA2E8B1A1E68B9FE4BABAE58C96EFBC8CE8B58BE4BA88E4BABAE7B1BBE789B9E5BE81E5928CE8A1A8E68385EFBC8CE4B8AAE680A7E9B29CE6988EEFBC8CE98082E59088E5969CE788B1E58AA8E789A9E5928CE58DA1E9809AE9A38EE6A0BCE79A84E794A8E688B7E38082, 0xE5A4B4E5838F4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE5B0BAE5AFB8E69687E4BBB6E4B88BE8BDBDE69D83E99990, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5A4B4E5838FE69BB4E696B0E69C8DE58AA1, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (26, 26, 'SPU_VIRTUAL_CHAR_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE789883344E585A8E8BAABE8999AE68B9FE5BDA2E8B1A14E4654EFBC8CE794B13344E5BBBAE6A8A1E889BAE69CAFE5AEB6E7B2BEE5BF83E68993E980A0EFBC8CE9AB98E7B2BEE5BAA6E585A8E8BAABE6A8A1E59E8BEFBC8CE58C85E590ABE4B8B0E5AF8CE79A84E8A1A8E68385E5928CE58AA8E4BD9CEFBC8CE58FAFE794A8E4BA8EE58583E5AE87E5AE99E5B9B3E58FB0E380815652E7A4BEE4BAA4E5928CE6B8B8E6888FE4B8ADEFBC8CE698AFE682A8E59CA8E695B0E5AD97E4B896E7958CE79A84E5AE8CE7BE8EE58886E8BAABE38082, 0x3344E8999AE68B9FE5BDA2E8B1A14E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE6A0BCE5BC8F3344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E8AFB4E6988E, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE58583E5AE87E5AE99E5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (27, 27, 'SPU_VIRTUAL_CHAR_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E58AA8E6BCABE9A38EE6A0BCE8999AE68B9FE5BDA2E8B1A14E4654EFBC8CE794B1E697A5E7B3BBE68F92E794BBE889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE98787E794A8E7BB8FE585B8E58AA8E6BCABE9A38EE6A0BCE8AEBEE8AEA1EFBC8CE58C85E590ABE5A49AE5A597E69C8DE8A385E5928CE4B8B0E5AF8CE8A1A8E68385EFBC8CE98082E59088E4BA8CE6ACA1E58583E788B1E5A5BDE88085E59CA8E59084E7B1BBE5B9B3E58FB0E5B195E7A4BAE4B8AAE680A7E38082, 0xE8999AE68B9FE5BDA2E8B1A14E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE6A0BCE5BC8FE6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E8AFB4E6988E, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (28, 28, 'SPU_VIRTUAL_CHAR_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E8B59BE58D9AE69C8BE5858BE8999AE68B9FE5BDA2E8B1A14E4654EFBC8CE794B1E7A791E5B9BBE6A682E5BFB5E889BAE69CAFE5AEB6E8AEBEE8AEA1EFBC8CE89E8DE59088E9AB98E7A791E68A80E4B88EE69C8BE5858BE58583E7B4A0EFBC8CE58C85E590ABE69CBAE6A2B0E4B989E882A2E38081E585A8E681AFE68A95E5BDB1E5928CE7A59EE7BB8FE68EA5E58FA3E7AD89E69CAAE69DA5E7A791E68A80E789B9E5BE81EFBC8CE98082E59088E7A791E5B9BBE788B1E5A5BDE88085E38082, 0xE8999AE68B9FE5BDA2E8B1A14E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE6A0BCE5BC8FE6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E8AFB4E6988E, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (29, 29, 'SPU_VIRTUAL_CHAR_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E5A587E5B9BBE7A78DE6978FE8999AE68B9FE5BDA2E8B1A14E4654EFBC8CE794B1E5A587E5B9BBE6A682E5BFB5E889BAE69CAFE5AEB6E5889BE4BD9CEFBC8CE58C85E68BACE7B2BEE781B5E38081E79FAEE4BABAE38081E585BDE4BABAE7AD89E5A49AE7A78DE5A587E5B9BBE7A78DE6978FEFBC8CE9858DE69C89E7B2BEE7BE8EE79A84E5A587E5B9BBE8A385E5A487E5928CE9AD94E6B395E69588E69E9CEFBC8CE98082E59088E5A587E5B9BBE6B8B8E6888FE5928CE7A4BEE4BAA4E5B9B3E58FB0E38082, 0xE8999AE68B9FE5BDA2E8B1A14E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE6A0BCE5BC8FE6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E8AFB4E6988E, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (30, 30, 'SPU_VIRTUAL_CHAR_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CAAE69DA5E8BF90E58AA8E59198E8999AE68B9FE5BDA2E8B1A14E4654EFBC8CE794B1E4BD93E882B2E6A682E5BFB5E889BAE69CAFE5AEB6E8AEBEE8AEA1EFBC8CE89E8DE59088E4BCA0E7BB9FE4BD93E882B2E4B88EE69CAAE69DA5E7A791E68A80E58583E7B4A0EFBC8CE98082E59088E794B5E7AB9EE98089E6898BE38081E4BD93E882B2E788B1E5A5BDE88085E59CA8E58583E5AE87E5AE99E4B8ADE5B195E7A4BAE8BF90E58AA8E7B2BEE7A59EE38082, 0xE8999AE68B9FE5BDA2E8B1A14E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE6A0BCE5BC8FE6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E8AFB4E6988E, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (31, 31, 'SPU_SOCIAL_ID_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A4BEE4BAA4E5AA92E4BD93E8BAABE4BBBDE58C854E4654EFBC8CE58C85E590ABE98082E794A8E4BA8EE59084E5A4A7E7A4BEE4BAA4E5B9B3E58FB0E79A84E7BB9FE4B880E5BDA2E8B1A1E8AEBEE8AEA1EFBC8CE58C85E68BACE5A4B4E5838FE38081E6A8AAE5B985E38081E8838CE699AFE5928CE4B8BBE9A298E58583E7B4A0EFBC8CE8AEA9E682A8E59CA8E68980E69C89E5B9B3E58FB0E4BF9DE68C81E4B880E887B4E79A84E4B8AAE4BABAE59381E7898CE5BDA2E8B1A1E38082, 0xE7A4BEE4BAA4E8BAABE4BBBD4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE6A0BCE5BC8FE5928CE5B0BAE5AFB8E69687E4BBB6E58C85E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE696B0E5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (32, 32, 'SPU_SOCIAL_ID_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4B893E4B89AE5889BE4BD9CE88085E8BAABE4BBBD4E4654EFBC8CE4B893E4B8BAE889BAE69CAFE5AEB6E38081E8AEBEE8AEA1E5B888E38081E4BD9CE5AEB6E7AD89E5889BE6848FE5B7A5E4BD9CE88085E8AEBEE8AEA1EFBC8CE58C85E590ABE4B893E4B89AE5BDA2E8B1A1E8AEBEE8AEA1E5928CE59381E7898CE58583E7B4A0EFBC8CE5B8AEE58AA9E5889BE4BD9CE88085E59CA8E695B0E5AD97E4B896E7958CE5BBBAE7AB8BE4B893E4B89AE5BDA2E8B1A1E38082, 0xE5889BE4BD9CE88085E8BAABE4BBBD4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E59381E7898CE8AEBEE8AEA1E69687E4BBB6E58C85E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (33, 33, 'SPU_SOCIAL_ID_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E6B8B8E6888FE78EA9E5AEB6E8BAABE4BBBD4E4654EFBC8CE4B893E4B8BAE6B8B8E6888FE788B1E5A5BDE88085E8AEBEE8AEA1EFBC8CE58C85E590ABE6B8B8E6888FE5A4B4E5838FE38081E6A8AAE5B985E38081E5BEBDE7ABA0E5928CE4B8AAE680A7E58C96E58583E7B4A0EFBC8CE98082E794A8E4BA8EE59084E5A4A7E6B8B8E6888FE5B9B3E58FB0E5928CE6B8B8E6888FE7A4BEE58CBAEFBC8CE5B195E7A4BAE682A8E79A84E6B8B8E6888FE8BAABE4BBBDE38082, 0xE6B8B8E6888FE8BAABE4BBBD4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5A49AE7A78DE6A0BCE5BC8FE69687E4BBB6E58C85E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (34, 34, 'SPU_SOCIAL_ID_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E59586E4B89AE59381E7898CE8BAABE4BBBD4E4654EFBC8CE4B893E4B8BAE4BC81E4B89AE5AEB6E5928CE59586E4B89AE4B893E4B89AE4BABAE5A3ABE8AEBEE8AEA1EFBC8CE58C85E590ABE4B893E4B89AE79A84E59381E7898CE5BDA2E8B1A1E8AEBEE8AEA1EFBC8CE5B8AEE58AA9E682A8E59CA8E695B0E5AD97E4B896E7958CE5BBBAE7AB8BE4B893E4B89AE58FAFE4BFA1E79A84E59586E4B89AE5BDA2E8B1A1E38082, 0xE59586E4B89AE8BAABE4BBBD4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E59381E7898CE8AEBEE8AEA1E69687E4BBB6E58C85E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (35, 35, 'SPU_SOCIAL_ID_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E8999AE68B9FE5BDB1E5938DE88085E8BAABE4BBBD4E4654EFBC8CE4B893E4B8BAE58685E5AEB9E5889BE4BD9CE88085E5928CE7A4BEE4BAA4E5AA92E4BD93E5BDB1E5938DE88085E8AEBEE8AEA1EFBC8CE58C85E590ABE590B8E5BC95E79CBCE79083E79A84E5BDA2E8B1A1E8AEBEE8AEA1E5928CE58685E5AEB9E6A8A1E69DBFEFBC8CE5B8AEE58AA9E682A8E68993E980A0E78BACE789B9E79A84E695B0E5AD974B4F4CE5BDA2E8B1A1E38082, 0xE5BDB1E5938DE88085E8BAABE4BBBD4E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E5BDA2E8B1A1E8AEBEE8AEA1E69687E4BBB6E58C85E38081E58685E5AEB9E6A8A1E69DBFE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE5BDA2E8B1A1E69BB4E696B0E69C8DE58AA1EFBC8CE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (36, 36, 'SPU_GAME_ITEM_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E6ADA6E599A84E4654EFBC8CE794B1E6B8B8E6888FE889BAE69CAFE5AEB6E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6B8B8E6888FE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (37, 37, 'SPU_GAME_ITEM_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A880E69C89E998B2E585B74E4654EFBC8CE794B1E6B8B8E6888FE8A385E5A487E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE998B2E68AA4E69588E69E9CEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6B8B8E6888FE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (38, 38, 'SPU_GAME_ITEM_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E9AD94E6B395E5AEA0E789A94E4654EFBC8CE794B1E7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E6AE8AE883BDE58A9BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BD9CE4B8BAE4BC99E4BCB4E68896E59D90E9AA91E4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6B8B8E6888FE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (39, 39, 'SPU_GAME_ITEM_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE7A798E6B395E69CAFE58DB7E8BDB44E4654EFBC8CE794B1E9AD94E6B395E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE58C85E590ABE78BACE789B9E79A84E8A786E8A789E69588E69E9CE5928CE6B395E69CAFE58AA8E794BBEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6B8B8E6888FE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E789B9E69588E69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (40, 40, 'SPU_GAME_ITEM_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A880E69C89E6B8B8E6888FE8BDBDE585B74E4654EFBC8CE794B1E8BDBDE585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E6AE8AE58A9FE883BDEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6B8B8E6888FE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (41, 41, 'CQYX_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E88BB1E99B84E8A792E889B24E4654EFBC8CE794B1E6B8B8E6888FE8A792E889B2E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E68A80E883BDE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6B8B8E6888FE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (42, 42, 'XYGWJS_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A880E69C89E680AAE789A9E8A792E889B24E4654EFBC8CE794B1E7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E883BDE58A9BE5928CE7949FE68081E8838CE699AFEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6B8B8E6888FE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (43, 43, 'JJZS_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CBAE794B2E68898E5A3ABE8A792E889B24E4654EFBC8CE794B1E69CBAE6A2B0E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E6ADA6E599A8E7B3BBE7BB9FE5928CE68A80E69CAFE8838CE699AFEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6B8B8E6888FE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (44, 44, 'SHSW_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE8AF9DE7949FE789A9E8A792E889B24E4654EFBC8CE794B1E7A59EE8AF9DE6A682E5BFB5E889BAE69CAFE5AEB6E7B2BEE5BF83E68993E980A0EFBC8CE59FBAE4BA8EE4B896E7958CE59084E59CB0E7A59EE8AF9DE4BCA0E8AFB4EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E7A59EE58A9BE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8E38082, 0xE6B8B8E6888FE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (45, 45, 'SPU_GAME_CHAR_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CAAE69DA5E68898E5A3ABE8A792E889B24E4654EFBC8CE794B1E7A791E5B9BBE6A682E5BFB5E889BAE69CAFE5AEB6E7B2BEE5BF83E68993E980A0EFBC8CE8AEBEE5AE9AE59CA8E69CAAE69DA5E4B896E7958CEFBC8CE68BA5E69C89E9AB98E7A791E68A80E8A385E5A487E5928CE883BDE58A9BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8E38082, 0xE6B8B8E6888FE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (46, 46, 'SPU_GAME_LAND_001', 0xE8BF99E698AFE4B880E59D97E99990E9878FE78988E58583E5AE87E5AE99E9BB84E98791E59CB0E6AEB54E4654EFBC8CE4BD8DE4BA8EE79FA5E5908DE58583E5AE87E5AE99E5B9B3E58FB0E79A84E6A0B8E5BF83E59586E4B89AE58CBAEFBC8CE4BAA4E9809AE4BEBFE588A9EFBC8CE4BABAE6B581E9878FE5A4A7EFBC8CE98082E59088E5BBBAE8AEBEE59586E4B89AE8AEBEE696BDE38081E5B195E7A4BAE7A9BAE997B4E68896E4B8BEE58A9EE6B4BBE58AA8EFBC8CE698AFE695B0E5AD97E59CB0E4BAA7E68A95E8B584E79A84E4BC98E8B4A8E98089E68BA9E38082, 0xE8999AE68B9FE59C9FE59CB04E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E59CB0E59D97E59D90E6A087E69687E4BBB6E38081E5BC80E58F91E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE59CB0E59D97E68A80E69CAFE694AFE68C81EFBC8CE5B9B3E58FB0E69BB4E696B0E98082E9858D, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (47, 47, 'SPU_GAME_LAND_002', 0xE8BF99E698AFE4B880E59D97E99990E9878FE78988E5A587E5B9BBE4B896E7958CE59CB0E59D974E4654EFBC8CE4BD8DE4BA8EE79FA5E5908DE58583E5AE87E5AE99E5B9B3E58FB0E79A84E9AD94E6B395E6A3AEE69E97E58CBAE59F9FEFBC8CE78EAFE5A283E4BC98E7BE8EEFBC8CE8B584E6BA90E4B8B0E5AF8CEFBC8CE98082E59088E5BBBAE8AEBEE5A587E5B9BBE4B8BBE9A298E59CBAE68980E38081E6B8B8E6888FE589AFE69CACE68896E694B6E8978FE5B195E7A4BAEFBC8CE698AFE695B0E5AD97E59CB0E4BAA7E68A95E8B584E79A84E4BC98E8B4A8E98089E68BA9E38082, 0xE8999AE68B9FE59C9FE59CB04E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E59CB0E59D97E59D90E6A087E69687E4BBB6E38081E5BC80E58F91E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE59CB0E59D97E68A80E69CAFE694AFE68C81EFBC8CE5B9B3E58FB0E69BB4E696B0E98082E9858D, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (48, 48, 'SPU_GAME_LAND_003', 0xE8BF99E698AFE4B880E59D97E99990E9878FE78988E7A791E5B9BBE59F8EE5B882E59CB0E59D974E4654EFBC8CE4BD8DE4BA8EE79FA5E5908DE58583E5AE87E5AE99E5B9B3E58FB0E79A84E9AB98E7A791E68A80E58CBAE59F9FEFBC8CE69CAAE69DA5E6849FE58D81E8B6B3EFBC8CE98082E59088E5BBBAE8AEBEE7A791E68A80E5B195E7A4BAE4B8ADE5BF83E38081E8999AE68B9FE5AE9EE9AA8CE5AEA4E68896E8B59BE58D9AE69C8BE5858BE9A38EE6A0BCE59CBAE68980EFBC8CE698AFE695B0E5AD97E59CB0E4BAA7E68A95E8B584E79A84E4BC98E8B4A8E98089E68BA9E38082, 0xE8999AE68B9FE59C9FE59CB04E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E59CB0E59D97E59D90E6A087E69687E4BBB6E38081E5BC80E58F91E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE59CB0E59D97E68A80E69CAFE694AFE68C81EFBC8CE5B9B3E58FB0E69BB4E696B0E98082E9858D, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (49, 49, 'SPU_GAME_LAND_004', 0xE8BF99E698AFE4B880E59D97E99990E9878FE78988E6B5B7E6B48BE4B896E7958CE59CB0E59D974E4654EFBC8CE4BD8DE4BA8EE79FA5E5908DE58583E5AE87E5AE99E5B9B3E58FB0E79A84E6B0B4E4B88BE78E8BE59BBDE58CBAE59F9FEFBC8CE699AFE889B2E5A3AEE8A782EFBC8CE8B584E6BA90E78BACE789B9EFBC8CE98082E59088E5BBBAE8AEBEE6B5B7E6B48BE4B8BBE9A298E59CBAE68980E38081E6B0B4E4B88BE68EA2E999A9E6B8B8E6888FE68896E5B195E7A4BAE4B8ADE5BF83EFBC8CE698AFE695B0E5AD97E59CB0E4BAA7E68A95E8B584E79A84E4BC98E8B4A8E98089E68BA9E38082, 0xE8999AE68B9FE59C9FE59CB04E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E59CB0E59D97E59D90E6A087E69687E4BBB6E38081E5BC80E58F91E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE59CB0E59D97E68A80E69CAFE694AFE68C81EFBC8CE5B9B3E58FB0E69BB4E696B0E98082E9858D, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (50, 50, 'SPU_GAME_LAND_005', 0xE8BF99E698AFE4B880E59D97E99990E9878FE78988E5A4AAE7A9BAE59FBAE59CB0E59CB0E59D974E4654EFBC8CE4BD8DE4BA8EE79FA5E5908DE58583E5AE87E5AE99E5B9B3E58FB0E79A84E6989FE99985E5898DE593A8E58CBAE59F9FEFBC8CE8A786E9878EE5BC80E99894EFBC8CE8B584E6BA90E4B8B0E5AF8CEFBC8CE98082E59088E5BBBAE8AEBEE5A4AAE7A9BAE4B8BBE9A298E59CBAE68980E38081E6989FE99985E68EA2E999A9E6B8B8E6888FE68896E7A791E5B9BBE5B195E7A4BAE4B8ADE5BF83EFBC8CE698AFE695B0E5AD97E59CB0E4BAA7E68A95E8B584E79A84E4BC98E8B4A8E98089E68BA9E38082, 0xE8999AE68B9FE59C9FE59CB04E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E59CB0E59D97E59D90E6A087E69687E4BBB6E38081E5BC80E58F91E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE59CB0E59D97E68A80E69CAFE694AFE68C81EFBC8CE5B9B3E58FB0E69BB4E696B0E98082E9858D, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (51, 51, 'CQWQPF_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E6ADA6E599A8E79AAEE882A44E4654EFBC8CE794B1E6B8B8E6888FE889BAE69CAFE5AEB6E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE4B8BAE682A8E79A84E6B8B8E6888FE6ADA6E599A8E5A29EE6B7BBE78BACE789B9E9AD85E58A9BE38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E69D90E8B4A8E69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (52, 52, 'SPU_GAME_SKIN_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A880E69C89E8A792E889B2E79AAEE882A44E4654EFBC8CE794B1E6B8B8E6888FE8A792E889B2E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE58AA8E794BBE69588E69E9CEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE4B8BAE682A8E79A84E6B8B8E6888FE8A792E889B2E5A29EE6B7BBE78BACE789B9E9AD85E58A9BE38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E69D90E8B4A8E69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (53, 53, 'XDZJPF_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E8BDBDE585B7E79AAEE882A44E4654EFBC8CE794B1E6B8B8E6888FE8BDBDE585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE4B8BAE682A8E79A84E6B8B8E6888FE8BDBDE585B7E5A29EE6B7BBE78BACE789B9E9AD85E58A9BE38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E69D90E8B4A8E69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (54, 54, 'CSJZBPF_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E8AFB4E7BAA7E8A385E5A487E79AAEE882A44E4654EFBC8CE794B1E6B8B8E6888FE8A385E5A487E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE4B8BAE682A8E79A84E6B8B8E6888FE8A385E5A487E5A29EE6B7BBE78BACE789B9E9AD85E58A9BE38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E69D90E8B4A8E69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (55, 55, 'KHCWPF_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A791E5B9BBE5AEA0E789A9E79AAEE882A44E4654EFBC8CE794B1E6B8B8E6888FE7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE4B8BAE682A8E79A84E6B8B8E6888FE5AEA0E789A9E5A29EE6B7BBE78BACE789B9E9AD85E58A9BE38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E38081E69D90E8B4A8E69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (56, 56, 'SPU_GAME_EQUIP_001', 0xE8BF99E698AFE4B880E5A597E99990E9878FE78988E4BCA0E5A587E5A597E8A3854E4654EFBC8CE794B1E6B8B8E6888FE8A385E5A487E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE58C85E590ABE5AE8CE695B4E79A84E6ADA6E599A8E998B2E585B7E5A597E8A385EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8E38082, 0xE5A597E8A3854E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (57, 57, 'SPU_GAME_EQUIP_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A880E69C89E6ADA6E599A84E4654EFBC8CE794B1E6ADA6E599A8E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE6ADA6E599A84E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (58, 58, 'SPU_GAME_EQUIP_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE8AF9DE998B2E585B74E4654EFBC8CE794B1E8A385E5A487E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE59FBAE4BA8EE58FA4E4BBA3E7A59EE8AF9DE4BCA0E8AFB4EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8E38082, 0xE998B2E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (59, 59, 'SPU_GAME_EQUIP_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A791E5B9BBE8A385E5A4874E4654EFBC8CE794B1E69CAAE69DA5E7A791E68A80E6A682E5BFB5E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E69CAAE69DA5E6849FE58D81E8B6B3E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8E38082, 0xE8A385E5A4874E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (60, 60, 'SPU_GAME_EQUIP_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E58583E7B4A0E6B395E599A84E4654EFBC8CE794B1E5A587E5B9BBE8A385E5A487E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE895B4E590ABE5BCBAE5A4A7E79A84E58583E7B4A0E58A9BE9878FEFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8E38082, 0xE6B395E599A84E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (61, 61, 'SPU_GAME_PET_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E9BE99E5AEA04E4654EFBC8CE794B1E6B8B8E6888FE7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E883BDE58A9BE5928CE68890E995BFE7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (62, 62, 'SPU_GAME_PET_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A880E69C89E7A59EE585BD4E4654EFBC8CE794B1E7A59EE8AF9DE7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE59FBAE4BA8EE4B896E7958CE59084E59CB0E7A59EE8AF9DE4BCA0E8AFB4EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E883BDE58A9BE5928CE68890E995BFE7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (63, 63, 'SPU_GAME_PET_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CBAE6A2B0E5AEA0E789A94E4654EFBC8CE794B1E7A791E5B9BBE69CBAE6A2B0E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E58A9FE883BDE5928CE58D87E7BAA7E7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (64, 64, 'SPU_GAME_PET_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E58583E7B4A0E7B2BEE781B54E4654EFBC8CE794B1E5A587E5B9BBE7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E58583E7B4A0E5B19EE680A7E38081E5A496E8A782E5928CE883BDE58A9BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (65, 65, 'SPU_GAME_PET_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E5A496E6989FE7949FE789A94E4654EFBC8CE794B1E7A791E5B9BBE7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E883BDE58A9BE5928CE8BF9BE58C96E7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (66, 66, 'SPU_GAME_ITEM_001_N1', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E9AD94E6B395E58DB7E8BDB44E4654EFBC8CE794B1E6B8B8E6888FE98193E585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (67, 67, 'SMBX_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE7A798E5AE9DE7AEB14E4654EFBC8CE794B1E6B8B8E6888FE98193E585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE5BC80E590AFE58AA8E794BBEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE5BC80E590AFE5908EE69C89E69CBAE4BC9AE88EB7E5BE97E7A880E69C89E6B8B8E6888FE789A9E59381E38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (68, 68, 'MFYS_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E9AD94E6B395E88DAFE6B0B44E4654EFBC8CE794B1E6B8B8E6888FE98193E585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE7B292E5AD90E69588E69E9CEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE4B8BAE8A792E889B2E68F90E4BE9BE59084E7A78DE5A29EE79B8AE69588E69E9CE38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (69, 69, 'SMSP_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE599A8E7A28EE789874E4654EFBC8CE794B1E6B8B8E6888FE98193E585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE883BDE9878FE69588E69E9CEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE694B6E99B86E5AE8CE695B4E5A597E7A28EE78987E58FAFE4BBA5E59088E68890E5BCBAE5A4A7E7A59EE599A8E38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (70, 70, 'KJZZ_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A791E68A80E8A385E7BDAE4E4654EFBC8CE794B1E7A791E5B9BBE98193E585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E69CAAE69DA5E6849FE58D81E8B6B3E79A84E5A496E8A782E5928CE789B9E69588EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE4B8BAE8A792E889B2E68F90E4BE9BE59084E7A78DE7A791E68A80E5A29EE5BCBAE883BDE58A9BE38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (71, 71, 'QHCB_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E5A587E5B9BBE59F8EE5A0A14E4654EFBC8CE794B1E6B8B8E6888FE5BBBAE7AD91E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE58685E983A8E7BB93E69E84EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5BBBAE7AD914E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:36', '2025-03-11 22:26:36', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (72, 72, 'WLCSJZ_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CAAE69DA5E59F8EE5B882E5BBBAE7AD914E4654EFBC8CE794B1E7A791E5B9BBE5BBBAE7AD91E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E69CAAE69DA5E6849FE58D81E8B6B3E79A84E5A496E8A782E5928CE58685E983A8E7BB93E69E84EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5BBBAE7AD914E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (73, 73, 'SMSD_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE7A798E7A59EE6AEBF4E4654EFBC8CE794B1E58FA4E4BBA3E5BBBAE7AD91E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE89E8DE59088E5A49AE7A78DE58FA4E4BBA3E69687E6988EE9A38EE6A0BCEFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE58685E983A8E7BB93E69E84EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8E38082, 0xE5BBBAE7AD914E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (74, 74, 'FKDY_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E6B5AEE7A9BAE5B29BE5B1BF4E4654EFBC8CE794B1E5A587E5B9BBE78EAFE5A283E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E59CB0E5BDA2E5928CE7949FE68081E7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5BBBAE7AD914E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (75, 75, 'GDYJ_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E58FA4E4BBA3E98197E8BFB94E4654EFBC8CE794B1E58E86E58FB2E5BBBAE7AD91E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E9A38EE58C96E5A496E8A782E5928CE7A59EE7A798E6B09BE59BB4EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5BBBAE7AD914E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (76, 76, 'SPU_GAME_VEHICLE_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E9A39EE888B94E4654EFBC8CE794B1E7A791E5B9BBE8BDBDE585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE680A7E883BDEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8BDBDE585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (77, 77, 'SPU_GAME_VEHICLE_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E68898E69697E69CBAE794B24E4654EFBC8CE794B1E69CBAE6A2B0E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE6ADA6E599A8E7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8BDBDE585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (78, 78, 'SPU_GAME_VEHICLE_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E5A587E5B9BBE59D90E9AA914E4654EFBC8CE794B1E7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE789B9E6AE8AE883BDE58A9BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8BDBDE585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (79, 79, 'SPU_GAME_VEHICLE_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E8B59BE8BDA64E4654EFBC8CE794B1E6B1BDE8BDA6E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE680A7E883BDE58F82E695B0EFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8BDBDE585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (80, 80, 'SPU_GAME_VEHICLE_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E6BD9CE6B0B4E889874E4654EFBC8CE794B1E6B5B7E6B48BE8BDBDE585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E5928CE6B7B1E6B5B7E68EA2E7B4A2E883BDE58A9BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8BDBDE585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (81, 81, 'SPU_GAME_CHAR_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E88BB1E99B84E8A792E889B24E4654EFBC8CE794B1E79FA5E5908DE8A792E889B2E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E68A80E883BDE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (82, 82, 'SPU_GAME_CHAR_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE8AF9DE7949FE789A9E8A792E889B24E4654EFBC8CE794B1E7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE59FBAE4BA8EE59084E59BBDE7A59EE8AF9DE4BCA0E8AFB4E5889BE4BD9CEFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E883BDE58A9BE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (83, 83, 'SPU_GAME_CHAR_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CAAE69DA5E68898E5A3ABE8A792E889B24E4654EFBC8CE794B1E7A791E5B9BBE8A792E889B2E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E69CAAE69DA5E6849FE58D81E8B6B3E79A84E5A496E8A782E38081E9AB98E7A791E68A80E8A385E5A487E5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (84, 84, 'SPU_GAME_CHAR_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E9AD94E6B395E5B888E8A792E889B24E4654EFBC8CE794B1E5A587E5B9BBE8A792E889B2E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E6B395E69CAFE7B3BBE7BB9FE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (85, 85, 'YXSWJS_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E5BC82E5BDA2E7949FE789A9E8A792E889B24E4654EFBC8CE794B1E5A496E6989FE7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E789B9E6AE8AE883BDE58A9BE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A792E889B24E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A792E889B2E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (86, 86, 'CQLQW_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E9BE99E5AEA04E4654EFBC8CE794B1E5AEA0E789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E68A80E883BDE5928CE68890E995BFE7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (87, 87, 'SMJLCW_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE7A798E7B2BEE781B5E5AEA0E789A94E4654EFBC8CE794B1E7B2BEE781B5E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E9AD94E6B395E883BDE58A9BE5928CE68890E995BFE7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (88, 88, 'JXCW_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CBAE6A2B0E5AEA0E789A94E4654EFBC8CE794B1E69CBAE6A2B0E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E58A9FE883BDE6A8A1E59D97E5928CE58D87E7BAA7E7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (89, 89, 'HSCW_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E5B9BBE585BDE5AEA0E789A94E4654EFBC8CE794B1E7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE89E8DE59088E5A49AE7A78DE7A59EE8AF9DE7949FE789A9E789B9E5BE81EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E883BDE58A9BE5928CE68890E995BFE7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (90, 90, 'YSJLCW_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E58583E7B4A0E7B2BEE781B5E5AEA0E789A94E4654EFBC8CE794B1E58583E7B4A0E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE4BBA3E8A1A8E887AAE784B6E7958CE79A84E59FBAE69CACE58583E7B4A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E58583E7B4A0E883BDE58A9BE5928CE68890E995BFE7B3BBE7BB9FEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE5AEA0E789A94E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E5AEA0E789A9E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (91, 91, 'CQWQ_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E6ADA6E599A84E4654EFBC8CE794B1E6ADA6E599A8E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E789B9E6AE8AE69588E69E9CE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A385E5A4874E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A385E5A487E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (92, 92, 'SHFJ_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE8AF9DE998B2E585B74E4654EFBC8CE794B1E998B2E585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE59FBAE4BA8EE59084E59BBDE7A59EE8AF9DE4BCA0E8AFB4E5889BE4BD9CEFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E998B2E68AA4E883BDE58A9BE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A385E5A4874E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A385E5A487E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (93, 93, 'WLKJZB_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CAAE69DA5E7A791E68A80E8A385E5A4874E4654EFBC8CE794B1E7A791E5B9BBE8A385E5A487E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E69CAAE69DA5E6849FE58D81E8B6B3E79A84E5A496E8A782E38081E9AB98E7A791E68A80E58A9FE883BDE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A385E5A4874E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A385E5A487E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (94, 94, 'MFSP_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E9AD94E6B395E9A5B0E593814E4654EFBC8CE794B1E5A587E5B9BBE9A5B0E59381E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E9AD94E6B395E69588E69E9CE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A385E5A4874E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A385E5A487E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (95, 95, 'YGSQ_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E8BF9CE58FA4E7A59EE599A84E4654EFBC8CE794B1E7A59EE599A8E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE59FBAE4BA8EE8BF9CE58FA4E69687E6988EE4BCA0E8AFB4E5889BE4BD9CEFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E7A59EE7A798E58A9BE9878FE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE8A385E5A4874E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E8A385E5A487E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (96, 96, 'SPU_GAME_SKIN_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E88BB1E99B84E79AAEE882A44E4654EFBC8CE794B1E79AAEE882A4E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E789B9E69588E5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E79AAEE882A4E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (97, 97, 'KHZJPF_002', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A791E5B9BBE8BDBDE585B7E79AAEE882A44E4654EFBC8CE794B1E8BDBDE585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E69CAAE69DA5E6849FE58D81E8B6B3E79A84E5A496E8A782E38081E789B9E69588E5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E79AAEE882A4E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (98, 98, 'MFWQPF_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E9AD94E6B395E6ADA6E599A8E79AAEE882A44E4654EFBC8CE794B1E6ADA6E599A8E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E5A587E5B9BBE9A38EE6A0BCE79A84E5A496E8A782E38081E9AD94E6B395E789B9E69588E5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E79AAEE882A4E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (99, 99, 'SHSWPF_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E7A59EE8AF9DE7949FE789A9E79AAEE882A44E4654EFBC8CE794B1E7949FE789A9E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE59FBAE4BA8EE59084E59BBDE7A59EE8AF9DE4BCA0E8AFB4E5889BE4BD9CEFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E58AA8E794BBE69588E69E9CE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E79AAEE882A4E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (100, 100, 'JXZJPF_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E69CBAE6A2B0E8A385E794B2E79AAEE882A44E4654EFBC8CE794B1E8A385E794B2E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E7B2BEE5AF86E69CBAE6A2B0E6849FE79A84E5A496E8A782E38081E58AA8E68081E983A8E4BBB6E5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE79AAEE882A44E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E79AAEE882A4E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (101, 101, 'CQMFJC_001', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E5A587E9AD94E6B395E58DB7E8BDB44E4654EFBC8CE794B1E98193E585B7E8AEBEE8AEA1E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E9AD94E6B395E69588E69E9CE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E98193E585B7E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (102, 102, 'GJYS_003', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E9AB98E7BAA7E88DAFE6B0B44E4654EFBC8CE794B1E782BCE98791E69CAFE5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E69588E69E9CE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E98193E585B7E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (103, 103, 'MFFW_004', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E9AD94E6B395E7ACA6E696874E4654EFBC8CE794B1E7ACA6E69687E5A4A7E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E9AD94E6B395E69588E69E9CE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E98193E585B7E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (104, 104, 'CSMDJ_005', 0xE8BF99E698AFE4B880E6ACBEE99990E9878FE78988E4BCA0E98081E997A8E98193E585B74E4654EFBC8CE794B1E7A9BAE997B4E6B395E5B888E7B2BEE5BF83E68993E980A0EFBC8CE68BA5E69C89E78BACE789B9E79A84E5A496E8A782E38081E4BCA0E98081E69588E69E9CE5928CE8838CE699AFE69585E4BA8BEFBC8CE58FAFE59CA8E694AFE68C814E4654E8B584E4BAA7E79A84E5A49AE4B8AAE6B8B8E6888FE5B9B3E58FB0E4B8ADE4BDBFE794A8EFBC8CE698AFE694B6E8978FE5AEB6E5928CE6B8B8E6888FE78EA9E5AEB6E79A84E78F8DE8B4B5E8B584E4BAA7E38082, 0xE98193E585B74E4654E38081E58CBAE59D97E993BEE68980E69C89E69D83E8AF81E4B9A6E380813344E6A8A1E59E8BE69687E4BBB6E38081E98193E585B7E8838CE699AFE69585E4BA8BE38081E4BDBFE794A8E68C87E58D97, 0xE58CBAE59D97E993BEE6B0B8E4B985E8AEA4E8AF81EFBC8CE8B584E4BAA7E79C9FE5AE9EE680A7E7BB88E8BAABE4BF9DE99A9CEFBC8CE696B0E6B8B8E6888FE5B9B3E58FB0E98082E9858DE694AFE68C81, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (105, 105, 'SPU_DOC_WORD_001', 0xE8BF99E698AFE4B880E5A597E4B893E4B89AE79A84E59586E58AA1E68AA5E5918A576F7264E6A8A1E69DBFEFBC8CE58C85E590ABE5AE8CE695B4E79A84E7ABA0E88A82E6A0B7E5BC8FE38081E6AEB5E890BDE6A0B7E5BC8FE38081E59BBEE8A1A8E6A0B7E5BC8FE7AD89E38082E98082E794A8E4BA8EE5B9B4E5BAA6E68AA5E5918AE38081E9A1B9E79BAEE68AA5E5918AE38081E59586E4B89AE8AEA1E58892E4B9A6E7AD89E59586E58AA1E69687E6A1A3E38082E694AFE68C81576F72642032303136E58F8AE4BBA5E4B88AE78988E69CACE38082, 0x576F7264E6A8A1E69DBFE69687E4BBB6E38081E6A0B7E5BC8FE4BDBFE794A8E8AFB4E6988EE38081E59BBEE8A1A8E4BDBFE794A8E69599E7A88BE38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7BB88E8BAABE69BB4E696B0E69C8DE58AA1E38081E4B880E5AFB9E4B880E68E92E78988E68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (106, 106, 'SPU_DOC_EXCEL_001', 0xE8BF99E698AFE4B880E5A597E4B893E4B89AE79A84E8B4A2E58AA1E58886E69E90457863656CE6A8A1E69DBFE5A597E8A385EFBC8CE58C85E590ABE8B584E4BAA7E8B49FE580BAE8A1A8E38081E588A9E6B6A6E8A1A8E38081E78EB0E98791E6B581E9878FE8A1A8E7AD89E5A49AE4B8AAE8B4A2E58AA1E68AA5E8A1A8E6A8A1E69DBFEFBC8CE4BBA5E58F8AE59084E7B1BBE8B4A2E58AA1E58886E69E90E5B7A5E585B7E38082E68980E69C89E585ACE5BC8FE5928CE587BDE695B0E983BDE5B7B2E8AEBEE7BDAEE5AE8CE59684EFBC8CE694AFE68C81E695B0E68DAEE887AAE58AA8E8AEA1E7AE97E5928CE59BBEE8A1A8E7949FE68890E38082, 0x457863656CE6A8A1E69DBFE69687E4BBB6E58C85E38081E4BDBFE794A8E8AFB4E6988EE4B9A6E38081E8A786E9A291E69599E7A88BE38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7BB88E8BAABE69BB4E696B0E69C8DE58AA1E38081E8B4A2E58AA1E58886E69E90E68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (107, 107, 'SPU_DOC_PPT_001', 0xE8BF99E698AFE4B880E5A597E9AB98E7ABAFE5889BE6848FE59586E58AA1505054E6A8A1E69DBFE59088E99B86EFBC8CE58C85E590AB3530E5A597E4B88DE5908CE9A38EE6A0BCE79A84E4B8BBE9A298E6A8A1E69DBFE38082E6AF8FE5A597E6A8A1E69DBFE983BDE58C85E590ABE5AE8CE695B4E79A84E6AF8DE78988E38081E9858DE889B2E696B9E6A188E38081E59BBEE8A1A8E6A0B7E5BC8FE7AD89E38082E98082E794A8E4BA8EE59586E58AA1E6BC94E7A4BAE38081E9A1B9E79BAEE6B187E68AA5E38081E890A5E99480E7AD96E58892E7AD89E59CBAE699AFE38082, 0x505054E6A8A1E69DBFE69687E4BBB6E58C85E38081E5AD97E4BD93E58C85E38081E59BBEE6A087E7B4A0E69D90E38081E4BDBFE794A8E69599E7A88BE38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7BB88E8BAABE69BB4E696B0E69C8DE58AA1E38081E4B880E5AFB9E4B880E8AEBEE8AEA1E68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (108, 108, 'SPU_DOC_PDF_001', 0xE8BF99E698AFE4B880E5A597E4B893E4B89AE79A84504446E699BAE883BDE8A1A8E58D95E6A8A1E69DBFEFBC8CE58C85E590ABE5A49AE7A78DE5B8B8E794A8E8A1A8E58D95E7B1BBE59E8BEFBC8CE694AFE68C81E8A1A8E58D95E887AAE58AA8E5A1ABE58585E38081E695B0E68DAEE694B6E99B86E5928CE5AFBCE587BAE58A9FE883BDE38082E98082E794A8E4BA8EE997AEE58DB7E8B083E69FA5E38081E68AA5E5908DE799BBE8AEB0E38081E8AF84E4BCB0E8A1A8E7AD89E59CBAE699AFE38082, 0x504446E6A8A1E69DBFE69687E4BBB6E38081E4BDBFE794A8E8AFB4E6988EE38081E5BC80E58F91E69687E6A1A3E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7BB88E8BAABE68A80E69CAFE694AFE68C81E38081E8A1A8E58D95E5AE9AE588B6E69C8DE58AA1E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (109, 109, 'SPU_DOC_OTHER_001', 0xE8BF99E698AFE4B880E5A597E7BBBCE59088E680A7E69687E6A1A3E6A8A1E69DBFE5A597E8A385EFBC8CE694AFE68C81E58C85E68BAC4D61726B646F776EE380814C61546558E3808148544D4CE7AD89E5A49AE7A78DE69687E6A1A3E6A0BCE5BC8FE38082E58C85E590ABE5ADA6E69CAFE8AEBAE69687E38081E68A80E69CAFE69687E6A1A3E38081E7BD91E9A1B5E6A8A1E69DBFE7AD89E5A49AE7A78DE7B1BBE59E8BEFBC8CE6BBA1E8B6B3E4B88DE5908CE59CBAE699AFE79A84E69687E6A1A3E99C80E6B182E38082, 0xE5A49AE6A0BCE5BC8FE6A8A1E69DBFE69687E4BBB6E58C85E38081E9858DE7BDAEE69687E4BBB6E38081E4BDBFE794A8E69599E7A88BE38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7BB88E8BAABE69BB4E696B0E69C8DE58AA1E38081E68A80E69CAFE694AFE68C81E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (110, 110, 'SPU_IMG_WALL_001', 0xE8BF99E698AFE4B880E5A597E7B2BEE5BF83E588B6E4BD9CE79A84344BE7A791E5B9BBE9A38EE6A0BCE5A381E7BAB8E59088E99B86EFBC8CE58C85E590AB313030E5BCA0E9AB98E8B4A8E9878FE5A381E7BAB8E38082E6B6B5E79B96E69CAAE69DA5E59F8EE5B882E38081E5A4AAE7A9BAE68EA2E7B4A2E38081E69CBAE6A2B0E7A791E68A80E7AD89E5A49AE4B8AAE4B8BBE9A298EFBC8CE694AFE68C81E59084E7A78DE5B18FE5B995E5B0BAE5AFB8EFBC8CE68F90E4BE9BE6A18CE99DA2E7ABAFE5928CE7A7BBE58AA8E7ABAFE98082E9858DE78988E69CACE38082, 0xE5A381E7BAB8E58E8BE7BCA9E58C85E38081E58886E7B1BBE79BAEE5BD95E38081E9A284E8A788E59BBEE38081E4BDBFE794A8E8AFB4E6988EE38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE5858DE8B4B9E69BB4E696B0E69C8DE58AA1E38081E58886E8BEA8E78E87E5AE9AE588B6E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (111, 111, 'SPU_IMG_AVATAR_001', 0xE8BF99E698AFE4B880E5A597E7B2BEE5BF83E8AEBEE8AEA1E79A84E4BA8CE6ACA1E58583E9A38EE6A0BCE5A4B4E5838FE59088E99B86EFBC8CE58C85E590AB3530E4B8AAE78BACE789B9E8AEBEE8AEA1E79A84E5A4B4E5838FE38082E6AF8FE4B8AAE5A4B4E5838FE983BDE7BB8FE8BF87E7B2BEE5BF83E7BB98E588B6EFBC8CE9A38EE6A0BCE6B885E696B0E58FAFE788B1EFBC8CE98082E59088E794A8E4BA8EE59084E7B1BBE7A4BEE4BAA4E5AA92E4BD93E5B9B3E58FB0E38082E68F90E4BE9BE5A49AE7A78DE5B0BAE5AFB8E78988E69CACE38082, 0xE5A4B4E5838FE58E9FE69687E4BBB6E38081E4B88DE5908CE5B0BAE5AFB8E78988E69CACE38081E8AEBEE8AEA1E6BA90E69687E4BBB6E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE5AE9AE588B6E69C8DE58AA1E38081E5B0BAE5AFB8E8B083E695B4E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (112, 112, 'SPU_IMG_POSTER_001', 0xE8BF99E698AFE4B880E5A597E78EB0E4BBA3E7AE80E7BAA6E9A38EE6A0BCE79A84E59586E4B89AE6B5B7E68AA5E6A8A1E69DBFEFBC8CE58C85E590AB3330E4B8AAE4B88DE5908CE4B8BBE9A298E79A84E8AEBEE8AEA1E38082E6AF8FE4B8AAE6A8A1E69DBFE983BDE68F90E4BE9BE5A49AE7A78DE5B0BAE5AFB8EFBC8CE694AFE68C81E59CA8E7BABFE7BC96E8BE91EFBC8CE98082E59088E59084E7B1BBE59586E4B89AE890A5E99480E6B4BBE58AA8E4BDBFE794A8E38082E58C85E590ABE7A4BEE4BAA4E5AA92E4BD93E38081E5B195E8A788E5B195E7A4BAE38081E4BF83E99480E6B4BBE58AA8E7AD89E5A49AE7A78DE8A784E6A0BCE38082, 0xE6B5B7E68AA5E6A8A1E69DBFE69687E4BBB6E38081505344E6BA90E69687E4BBB6E38081E5AD97E4BD93E58C85E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7BB88E8BAABE69BB4E696B0E69C8DE58AA1E38081E8AEBEE8AEA1E68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (113, 113, 'SPU_IMG_ILLUST_001', 0xE8BF99E698AFE4B880E5A597E7B2BEE5BF83E5889BE4BD9CE79A84E6898BE7BB98E9A38EE6A0BCE59586E4B89AE68F92E794BBE99B86EFBC8CE58C85E590AB3230E5B985E58E9FE5889BE68F92E794BBE4BD9CE59381E38082E6AF8FE5B985E4BD9CE59381E983BDE4BBA5E78BACE789B9E79A84E6898BE7BB98E9A38EE6A0BCE59188E78EB0EFBC8CE98082E59088E794A8E4BA8EE59381E7898CE890A5E99480E38081E4BAA7E59381E58C85E8A385E38081E7A4BEE4BAA4E5AA92E4BD93E7AD89E5A49AE7A78DE59586E4B89AE59CBAE699AFE38082E68F90E4BE9BE6BA90E69687E4BBB6E694AFE68C81E4B8AAE680A7E58C96E5AE9AE588B6E38082, 0xE68F92E794BBE58E9FE69687E4BBB6E38081E79FA2E9878FE6BA90E69687E4BBB6E38081E8AEBEE8AEA1E8AFB4E6988EE38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE4BFAEE694B9E69C8DE58AA1E38081E5AE9AE588B6E69C8DE58AA1E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (114, 114, 'SPU_MUSIC_BGM_001', 0xE8BF99E698AFE4B880E5A597E7B2BEE98089E79A84E8BDBBE99FB3E4B990E8838CE699AFE99FB3E4B990E59088E99B86EFBC8CE58C85E590AB3530E9A696E9AB98E59381E8B4A8E99FB3E4B990E4BD9CE59381E38082E6B6B5E79B96E992A2E790B4E38081E59089E4BB96E38081E5BCA6E4B990E7AD89E5A49AE7A78DE9A38EE6A0BCEFBC8CE98082E59088E794A8E4BA8EE8A786E9A291E9858DE4B990E38081E59586E4B89AE7A9BAE997B4E38081E5B9BFE5918AE588B6E4BD9CE7AD89E59CBAE699AFE38082E68980E69C89E4BD9CE59381E59D87E68F90E4BE9BE5A49AE7A78DE697B6E995BFE78988E69CACE38082, 0xE99FB3E4B990E69687E4BBB6E58C85E38081E4BDBFE794A8E8AFB4E6988EE38081E78988E69D83E8AF81E4B9A6E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE78988E69D83E4BF9DE99A9CE38081E5AE9AE588B6E589AAE8BE91E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (115, 115, 'SPU_MUSIC_SCORE_001', 0xE8BF99E698AFE4B880E5A597E4B893E4B89AE79A84E794B5E5BDB1E9858DE4B990E7B4A0E69D90E99B86EFBC8CE58C85E590AB3330E9A696E58FB2E8AF97E7BAA7E9858DE4B990E4BD9CE59381E38082E6AF8FE9A696E4BD9CE59381E983BDE7BB8FE8BF87E4B893E4B89AE588B6E4BD9CE5928CE6B7B7E99FB3EFBC8CE9858DE69C89E5AE8CE695B4E79A84E4B990E599A8E8BDA8E98193EFBC8CE98082E59088E794A8E4BA8EE794B5E5BDB1E38081E9A284E5918AE78987E38081E6B8B8E6888FE7AD89E5BDB1E8A786E588B6E4BD9CE38082, 0xE9858DE4B990E69687E4BBB6E58C85E38081E58886E8BDA8E69687E4BBB6E38081E5B7A5E7A88BE69687E4BBB6E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE78988E69D83E4BF9DE99A9CE38081E6B7B7E99FB3E68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (116, 116, 'SPU_MUSIC_BEAT_001', 0xE8BF99E698AFE4B880E5A597E78EB0E4BBA3E99FB3E4B990E88A82E68B8DE7B4A0E69D90E58C85EFBC8CE58C85E590AB313030E4B8AAE78BACE789B9E79A84E88A82E68B8DE6A0B7E69CACE38082E6B6B5E79B96E5A49AE7A78DE6B581E8A18CE99FB3E4B990E9A38EE6A0BCEFBC8CE6AF8FE4B8AAE88A82E68B8DE983BDE68F90E4BE9BE5AE8CE695B4E79A84E99FB3E8BDA8E58886E7A6BBEFBC8CE98082E59088E794A8E4BA8EE99FB3E4B990E588B6E4BD9CE38081E6B7B7E99FB3E7AD89E59CBAE699AFE38082, 0xE88A82E68B8DE6A0B7E69CACE58C85E380814D494449E69687E4BBB6E38081E5B7A5E7A88BE69687E4BBB6E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7BB88E8BAABE69BB4E696B0E69C8DE58AA1E38081E588B6E4BD9CE68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (117, 117, 'SPU_MUSIC_NATURE_001', 0xE8BF99E698AFE4B880E5A597E9AB98E59381E8B4A8E887AAE784B6E78EAFE5A283E99FB3E69588E59088E99B86EFBC8CE58C85E590AB323030E4B8AAE887AAE784B6E5A3B0E99FB3E6A0B7E69CACE38082E6B6B5E79B96E99BA8E5A3B0E38081E6B5B7E6B5AAE38081E9B89FE9B8A3E38081E6A3AEE69E97E7AD89E5A49AE7A78DE887AAE784B6E78EAFE5A283E99FB3E69588EFBC8CE98787E794A8E4B893E4B89AE5BD95E99FB3E8AEBEE5A487E98787E99B86EFBC8CE98082E59088E794A8E4BA8EE5BDB1E8A786E588B6E4BD9CE38081E586A5E683B3E694BEE69DBEE7AD89E59CBAE699AFE38082, 0xE99FB3E69588E69687E4BBB6E58C85E38081E59CBAE699AFE8AFB4E6988EE38081E4BDBFE794A8E68C87E58D97E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE99FB3E69588E5AE9AE588B6E38081E59CBAE699AFE6B7B7E99FB3E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (118, 118, 'SPU_MUSIC_OTHER_001', 0xE8BF99E698AFE4B880E5A597E7BBBCE59088E99FB3E69588E7B4A0E69D90E5BA93EFBC8CE58C85E590AB353030E4B8AAE5A49AE6A0B7E58C96E99FB3E69588E38082E6B6B5E79B96E7949FE6B4BBE59CBAE699AFE38081E794B5E5AD90E99FB3E69588E38081E8BDACE59CBAE99FB3E69588E7AD89E5A49AE4B8AAE7B1BBE588ABEFBC8CE6BBA1E8B6B3E59084E7B1BBE5889BE4BD9CE99C80E6B182E38082E68980E69C89E99FB3E69588E59D87E58FAFE59586E794A8EFBC8CE68F90E4BE9BE5A49AE7A78DE6A0BCE5BC8FE78988E69CACE38082, 0xE99FB3E69588E7B4A0E69D90E58C85E38081E58886E7B1BBE79BAEE5BD95E38081E4BDBFE794A8E69599E7A88BE38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7B4A0E69D90E5AE9AE588B6E38081E68A80E69CAFE694AFE68C81E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (119, 119, 'SPU_VIDEO_AD_001', 0xE8BF99E698AFE4B880E5A597E4B893E4B89AE79A84E59586E4B89AE5B9BFE5918AE8A786E9A291E7B4A0E69D90E58C85EFBC8CE58C85E590AB3330E4B8AAE7B2BEE98089E5B9BFE5918AE8A786E9A291E6A8A1E69DBFE38082E6B6B5E79B96E4BAA7E59381E5B195E7A4BAE38081E59381E7898CE5AEA3E4BCA0E38081E6B4BBE58AA8E68EA8E5B9BFE7AD89E5A49AE7A78DE59CBAE699AFEFBC8CE694AFE68C81E887AAE5AE9AE4B989E7BC96E8BE91EFBC8CE98082E59088E59084E7B1BBE59586E4B89AE890A5E99480E4BDBFE794A8E38082E68980E69C89E7B4A0E69D90E59D87E4B8BA344BE58886E8BEA8E78E87E38082, 0xE8A786E9A291E7B4A0E69D90E58C85E38081E9A1B9E79BAEE6BA90E69687E4BBB6E38081E99FB3E69588E58C85E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE5AE9AE588B6E69C8DE58AA1E38081E68A80E69CAFE68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (120, 120, 'SPU_VIDEO_PROMO_001', 0xE8BF99E698AFE4B880E5A597E4B893E4B89AE79A84E4BC81E4B89AE5AEA3E4BCA0E78987E6A8A1E69DBFEFBC8CE58C85E590AB3230E4B8AAE7B2BEE5BF83E8AEBEE8AEA1E79A84E59CBAE699AFE6A8A1E69DBFE38082E98082E59088E4BC81E4B89AE5BDA2E8B1A1E5B195E7A4BAE38081E4BAA7E59381E4BB8BE7BB8DE38081E58F91E5B195E58E86E7A88BE7AD89E58685E5AEB9E588B6E4BD9CEFBC8CE68F90E4BE9BE5AE8CE695B4E79A84E9A1B9E79BAEE69687E4BBB6EFBC8CE694AFE68C81E6B7B1E5BAA6E5AE9AE588B6E38082, 0xE8A786E9A291E6A8A1E69DBFE69687E4BBB6E38081E9A1B9E79BAEE6BA90E69687E4BBB6E38081E9858DE4B990E7B4A0E69D90E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE59CBAE699AFE5AE9AE588B6E38081E589AAE8BE91E68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (121, 121, 'SPU_VIDEO_EDU_001', 0xE8BF99E698AFE4B880E5A597E4B893E4B89AE79A84E59CA8E7BABFE69599E882B2E8A786E9A291E6A8A1E69DBFEFBC8CE58C85E590AB3235E4B8AAE69599E5ADA6E59CBAE699AFE6A8A1E69DBFE38082E6B6B5E79B96E8AFBEE7A88BE5BC80E59CBAE38081E79FA5E8AF86E8AEB2E8A7A3E38081E7BB83E4B9A0E6B58BE8AF95E7AD89E5A49AE4B8AAE78EAFE88A82EFBC8CE68F90E4BE9BE4B8B0E5AF8CE79A84E69599E5ADA6E58583E7B4A0E5928CE58AA8E794BBE69588E69E9CEFBC8CE98082E59088E59084E7B1BBE59CA8E7BABFE8AFBEE7A88BE588B6E4BD9CE38082, 0xE8A786E9A291E6A8A1E69DBFE69687E4BBB6E38081E69599E5ADA6E58583E7B4A0E58C85E38081E58AA8E794BBE7B4A0E69D90E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE6A8A1E69DBFE5AE9AE588B6E38081E68A80E69CAFE694AFE68C81E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (122, 122, 'SPU_VIDEO_ANIM_001', 0xE8BF99E698AFE4B880E5A597E4B893E4B89AE79A844D47E58AA8E794BBE6A8A1E69DBFE5A597E8A385EFBC8CE58C85E590AB3430E4B8AAE5889BE6848FE58AA8E794BBE59CBAE699AFE38082E68F90E4BE9BE4B8B0E5AF8CE79A84E58AA8E794BBE58583E7B4A0E5928CE8BDACE59CBAE69588E69E9CEFBC8CE98082E59088E588B6E4BD9CE4BAA7E59381E4BB8BE7BB8DE38081E6B581E7A88BE6BC94E7A4BAE38081E695B0E68DAEE58FAFE8A786E58C96E7AD89E5889BE6848FE8A786E9A291E58685E5AEB9E38082, 0x4145E9A1B9E79BAEE69687E4BBB6E38081E58AA8E794BBE58583E7B4A0E58C85E38081E99FB3E69588E7B4A0E69D90E38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE58AA8E794BBE5AE9AE588B6E38081E68A80E69CAFE68C87E5AFBCE3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');
INSERT INTO `sys_product_spu_detail` VALUES (123, 123, 'SPU_VIDEO_OTHER_001', 0xE8BF99E698AFE4B880E5A597E7BBBCE59088E8A786E9A291E7B4A0E69D90E5BA93EFBC8CE58C85E590AB313030E4B8AAE5A49AE6A0B7E58C96E8A786E9A291E7B4A0E69D90E38082E6B6B5E79B96E5AE9EE68B8DE7B4A0E69D90E38081E789B9E69588E7B4A0E69D90E38081E8BDACE59CBAE7B4A0E69D90E7AD89E5A49AE4B8AAE7B1BBE588ABEFBC8CE6BBA1E8B6B3E59084E7B1BBE8A786E9A291E5889BE4BD9CE99C80E6B182E38082E68980E69C89E7B4A0E69D90E59D87E4B8BA344BE58886E8BEA8E78E87EFBC8CE68F90E4BE9BE5A49AE7A78DE6A0BCE5BC8FE78988E69CACE38082, 0xE8A786E9A291E7B4A0E69D90E58C85E38081E789B9E69588E58583E7B4A0E58C85E38081E4BDBFE794A8E69599E7A88BE38081E59586E4B89AE68E88E69D83E8AF81E4B9A6, 0xE7B4A0E69D90E5AE9AE588B6E38081E68A80E69CAFE694AFE68C81E3808137E5A4A9E98080E68DA2E4BF9DE99A9C, '2025-03-11 22:26:37', '2025-03-11 22:26:37', 0, '', '');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
                             `id` bigint NOT NULL AUTO_INCREMENT,
                             `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '角色名称',
                             `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '角色编码',
                             `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '角色描述',
                             `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                             `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                             `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                             `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                             PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '超级管理员', 'R0001', '超级管理员，能够管理合约，升级合约，添加管理员等', '2025-03-16 20:56:52', '2025-03-16 20:56:52', 0, '', '');
INSERT INTO `sys_role` VALUES (2, '系统管理员', 'R0002', '质押池管理，商场管理,包括添加、暂停、删除、配置参数', '2025-03-16 20:56:53', '2025-03-16 20:56:53', 0, '', '');
INSERT INTO `sys_role` VALUES (3, '普通用户', 'R0003', '质押、解质押、兑换、购买东西', '2025-03-16 20:56:53', '2025-03-16 20:56:53', 0, '', '');

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission`  (
                                        `id` bigint NOT NULL AUTO_INCREMENT,
                                        `role_id` bigint NOT NULL DEFAULT 0 COMMENT '角色id',
                                        `role_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '角色编码',
                                        `permission_id` bigint NOT NULL DEFAULT 0 COMMENT '权限id',
                                        `permission_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '权限编码',
                                        `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                        `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                        `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                        `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                        `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                        PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_permission
-- ----------------------------
INSERT INTO `sys_role_permission` VALUES (1, 1, 'R0001', 2, 'P0001', '2025-03-16 20:57:03', '2025-03-16 20:57:03', 0, '', '');
INSERT INTO `sys_role_permission` VALUES (2, 1, 'R0001', 3, 'P0002', '2025-03-16 20:57:03', '2025-03-16 20:57:03', 0, '', '');
INSERT INTO `sys_role_permission` VALUES (4, 2, 'R0002', 2, 'P0001', '2025-03-16 20:57:12', '2025-03-16 20:57:12', 0, '', '');
INSERT INTO `sys_role_permission` VALUES (5, 2, 'R0002', 3, 'P0002', '2025-03-16 20:57:12', '2025-03-16 20:57:12', 0, '', '');
INSERT INTO `sys_role_permission` VALUES (6, 2, 'R0002', 4, 'P0003', '2025-03-16 20:57:12', '2025-03-16 20:57:12', 0, '', '');
INSERT INTO `sys_role_permission` VALUES (7, 3, 'R0003', 4, 'P0003', '2025-03-16 20:57:17', '2025-03-16 20:57:17', 0, '', '');
INSERT INTO `sys_role_permission` VALUES (8, 3, 'R0003', 4, 'P0003', '2025-03-16 20:59:23', '2025-03-16 20:59:23', 0, '', '');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
                             `id` bigint NOT NULL AUTO_INCREMENT,
                             `unique_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '平台编号',
                             `user_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户编码',
                             `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '昵称',
                             `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '头像',
                             `gender` int NOT NULL DEFAULT 0 COMMENT '性别',
                             `birthday` datetime NULL DEFAULT NULL COMMENT '生日',
                             `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '邮箱',
                             `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手机号',
                             `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
                             `status` int NOT NULL DEFAULT 0 COMMENT '状态',
                             `status_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '状态描述',
                             `type` int NOT NULL DEFAULT 0 COMMENT '类型',
                             `type_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '类型描述',
                             `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                             `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                             `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                             `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                             PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'U10000', '0x67003e9d9B26Ed30B8AfeA6da762279D7c83abC2', 'Ming', 'https://himg.bdimg.com/sys/portrait/item/pp.1.a952ce36.GksfRd0oi8_Sw_wcx4WXIQ?_t=1741845261437', 0, NULL, '46683025@qq.com', '18710181267', 'qqq****11', 0, '正常', 0, '系统用户', '2025-03-16 20:58:20', '2025-03-16 20:58:20', 0, '', '');

-- ----------------------------
-- Table structure for sys_user_address
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_address`;
CREATE TABLE `sys_user_address`  (
                                     `id` bigint NOT NULL AUTO_INCREMENT,
                                     `user_id` bigint NOT NULL DEFAULT 0 COMMENT '用户id',
                                     `user_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户编码',
                                     `phone` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手机号',
                                     `province_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '省编码',
                                     `province_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '省名称',
                                     `city_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '市编码',
                                     `city_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '市名称',
                                     `district_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '区编码',
                                     `district_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '区名称',
                                     `street_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '街道编码',
                                     `street_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '街道名称',
                                     `house_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '门牌号',
                                     `full_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '完整地址',
                                     `is_default` int NOT NULL DEFAULT 0 COMMENT '是否默认',
                                     `longitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '经度',
                                     `latitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '纬度',
                                     `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                     `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                     `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                     `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                     `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                     PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_address
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
                                  `id` bigint NOT NULL AUTO_INCREMENT,
                                  `user_id` bigint NOT NULL DEFAULT 0 COMMENT '用户id',
                                  `user_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户编码',
                                  `role_id` bigint NOT NULL DEFAULT 0 COMMENT '角色id',
                                  `role_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '角色编码',
                                  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                  `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除',
                                  `creator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '创建人',
                                  `updator` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
                                  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 1, '0x67003e9d9B26Ed30B8AfeA6da762279D7c83abC2', 1, 'R0001', '2025-03-16 20:59:37', '2025-03-16 20:59:37', 0, '', '');
INSERT INTO `sys_user_role` VALUES (2, 1, '0x67003e9d9B26Ed30B8AfeA6da762279D7c83abC2', 2, 'R0002', '2025-03-16 20:59:37', '2025-03-16 20:59:37', 0, '', '');
INSERT INTO `sys_user_role` VALUES (3, 1, '0x67003e9d9B26Ed30B8AfeA6da762279D7c83abC2', 3, 'R0003', '2025-03-16 20:59:37', '2025-03-16 20:59:37', 0, '', '');

SET FOREIGN_KEY_CHECKS = 1;
