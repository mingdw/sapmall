-- 创建账户表
CREATE TABLE `account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE,
  `country_code` INT NOT NULL DEFAULT 1,
  `phone` BIGINT,
  `salt` VARCHAR(255),
  `password_hash` VARCHAR(255),
  `name` VARCHAR(255) NOT NULL,
  `avatar_storage_token` TEXT,
  `role` VARCHAR(255) NOT NULL,
  `status` INT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用、1-启用',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account_country_code_phone` (`country_code`, `phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- account_dsp_manager表
CREATE TABLE `account_dsp_manager` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `account_id` BIGINT NOT NULL COMMENT '账户ID',
  `dsp_id` BIGINT NOT NULL COMMENT 'DSP ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account_dsp_manager_unique` (`account_id`, `dsp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账户DSP管理员关联表';

-- account_delivery_driver表
CREATE TABLE `account_delivery_driver` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `account_id` BIGINT NOT NULL COMMENT '账户ID',
  `dsp_id` BIGINT NOT NULL COMMENT 'DSP ID',
  `driver_license_number` VARCHAR(64) COMMENT '驾驶证号码',
  `vehicle_type_id` BIGINT NOT NULL COMMENT '车辆类型ID',
  `vehicle_plate` VARCHAR(20) COMMENT '车牌号',
  `vehicle_image_s3_keys_json` TEXT NULL COMMENT '车辆图片S3 key列表["s3_key1","s3_key2",...]',
  `is_on_duty` TINYINT NOT NULL DEFAULT 0 COMMENT '是否在岗：0-否，1-是',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_account_delivery_driver_account_id` (`account_id`),
  KEY `idx_account_delivery_driver_is_on_duty` (`is_on_duty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='送货司机账户表';

-- account_warehouse_operator表
CREATE TABLE `account_warehouse_operator` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `account_id` BIGINT NOT NULL COMMENT '账户ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '所属仓库ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account_warehouse_operator_account_id` (`account_id`),
  KEY `idx_account_warehouse_operator_warehouse_id` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='仓库操作员账户表';

-- account_warehouse_manager表
CREATE TABLE `account_warehouse_manager` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `account_id` BIGINT NOT NULL COMMENT '账户ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '所属仓库ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account_warehouse_manager_account_id` (`account_id`),
  KEY `idx_account_warehouse_manager_warehouse_id` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='仓库经理账户表';

-- account_pickup_dispatcher表
CREATE TABLE `account_pickup_dispatcher` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `account_id` BIGINT NOT NULL COMMENT '账户ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '所属Hub ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account_pickup_dispatcher_account_id` (`account_id`),
  KEY `idx_account_pickup_dispatcher_warehouse_id` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收调度员账户表';

-- pickup揽收司机账户表
CREATE TABLE `account_pickup_driver` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `account_id` BIGINT NOT NULL COMMENT '关联账户ID（account表）',
  `warehouse_id` BIGINT NOT NULL COMMENT '所属Hub ID（关联warehouse表，site_type=1）',
  `vehicle_id` BIGINT NULL COMMENT '分配车辆ID（关联vehicle表）',
  `work_weekdays_json` VARCHAR(20) NOT NULL DEFAULT '[1,2,3,4,5]' COMMENT '工作日（JSON数组：[1,2,3,4,5,6,7]）',
  `work_start_time` TIME NOT NULL DEFAULT '09:00:00' COMMENT '工作开始时间',
  `work_end_time` TIME NOT NULL DEFAULT '18:00:00' COMMENT '工作结束时间',
  `responsible_zipcode_list_json` TEXT NULL COMMENT '负责的邮编范围JSON数组 ["12345","67890"]',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_account_pickup_driver_account_id` (`account_id`),
  KEY `idx_account_pickup_driver_warehouse_id` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收司机账户表';

-- 订单表
CREATE TABLE `order` (
  -- ========== 基本字段 ==========
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `security_rnd` INT NOT NULL COMMENT '安全随机数',
  `tracking_number` VARCHAR(32) NOT NULL COMMENT '跟踪编号',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- ========== 订单信息 ==========
  `channel_id` BIGINT NULL COMMENT '渠道ID',
  `sender_address_id` BIGINT NULL COMMENT '发件人地址ID',
  `recipient_address_id` BIGINT NULL COMMENT '收件人地址ID',
  `receiver_zipcode` VARCHAR(5) NULL COMMENT '收件人邮编',
  `zone` INT NULL COMMENT '运价分区zone',
  `order_time` TIMESTAMP NULL COMMENT '下单时间',
  `is_receiver_address_modified` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否收货地址变更',
  
  -- ========== 订单类型和服务配置 ==========
  `order_scope` TINYINT NULL COMMENT '订单类型（枚举值）',
  `service_type` TINYINT NULL COMMENT '服务类型（枚举值）',
  `delivery_method` TINYINT NULL COMMENT '送货方式（枚举值）',
  `client_code` VARCHAR(50) NULL COMMENT '客户代码',
  `reference_no` VARCHAR(50) NULL COMMENT '引用单号，默认留空，使用场景需联系商务支持',
  `self_pickup_code` VARCHAR(50) NULL COMMENT '自提码',
  
  -- ========== 保险服务字段 ==========
  `is_insured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否投保',
  `insured_value_amount` DECIMAL(10,2) NULL COMMENT '投保金额',
  `insured_value_currency` TINYINT NULL COMMENT '投保币种（枚举值）',
  
  -- ========== 揽收服务字段 ==========
  `is_pickup_required` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否需要揽收',
  `pickup_start_time` TIMESTAMP NULL COMMENT '揽收开始时间',
  `pickup_end_time` TIMESTAMP NULL COMMENT '揽收截止时间',
  `pickup_hub_id` BIGINT NULL COMMENT '揽收hub ID',


  -- ========== 运单印刷字段 ==========
  `channel_order_number` VARCHAR(128) NULL COMMENT '渠道订单号',
  `customer_note` VARCHAR(255) NULL COMMENT '客户备注',
  
  -- ========== 包裹额外信息字段 ==========
  `customer_name` VARCHAR(100) NULL COMMENT '客户名',
  `store_name` VARCHAR(100) NULL COMMENT '店铺名',
  `sku_list_json` TEXT NULL COMMENT 'SKU列表JSON格式',
  `extra_info_json` TEXT NULL COMMENT '额外信息JSON格式',
  
  -- ========== 原始用户输入字段 ==========
  `use_imperial_unit` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否使用英制单位',
  `original_weight` DECIMAL(10,3) NULL COMMENT '原始重量（用户输入）',
  `original_length` DECIMAL(10,2) NULL COMMENT '原始长度（用户输入）',
  `original_width` DECIMAL(10,2) NULL COMMENT '原始宽度（用户输入）',
  `original_height` DECIMAL(10,2) NULL COMMENT '原始高度（用户输入）',
  `original_value_amount` DECIMAL(10,2) NULL COMMENT '原始包裹价值金额（用户输入）',
  `original_value_currency` TINYINT NULL COMMENT '原始包裹价值币种（枚举值，用户输入）',
  
  -- ========== 系统标准化字段（统一公制单位）==========
  `weight_kg` DOUBLE NULL COMMENT '重量(公斤)',
  `volumetric_weight_kg` DOUBLE NULL COMMENT '体积重量(公斤)',
  `length_cm` DOUBLE NULL COMMENT '长度(厘米)',
  `width_cm` DOUBLE NULL COMMENT '宽度(厘米)',
  `height_cm` DOUBLE NULL COMMENT '高度(厘米)',
  
  -- ========== 订单状态 ==========
  `overall_status` INT NOT NULL COMMENT '整体状态',
  `is_finished` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否完成',
  `sorting_code` VARCHAR(32) NULL COMMENT '分拣代码(3段码格式: xx-yy-zz)',
  
  -- ========== 异常状态 ==========
  `is_intercepted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否被拦截',
  `is_abnormal` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否异常',
  `is_has_set_exception` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已设置异常',
  `exception_reason_code` VARCHAR(50) NULL COMMENT '异常原因代码',
  `exception_priority` TINYINT NOT NULL DEFAULT 100 COMMENT '异常优先级(0, 1, 2, 3), 值越小优先级越高',
  `exception_image_s3_keys_json` TEXT NULL COMMENT '异常图片S3 key列表["s3_key1","s3_key2",...]',
  `mark_exception_at` TIMESTAMP NULL COMMENT '标记异常时间',
  `is_complaint` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否有投诉',
  `next_action` TINYINT DEFAULT 0 COMMENT '下一步操作(0-无, 1-挂起, 2-重新派送, 3-退回, 4-补偿, 5-重新分拣)',
  `exception_hub_id` BIGINT NULL COMMENT '异常发生的hub',
  `exception_warehouse_id` BIGINT NULL COMMENT '异常发生的warehouse',
  
  -- ========== 仓库状态 ==========
  `received_at_hub` TIMESTAMP NULL COMMENT '取件时间',
  `is_dest_hub_arrived` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否到达目的hub',
  `is_dest_hub_departed` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否从目的hub出发',
  `is_dest_warehouse_arrived` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否到达目的仓库',
  `dest_warehouse_id` BIGINT NULL COMMENT '目的仓库ID',
  `is_dest_warehouse_processed` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已在目标仓库被处理',
  `arrived_dest_hub_at` TIMESTAMP NULL COMMENT '到达目的hub时间',
  `arrived_dest_warehouse_at` TIMESTAMP NULL COMMENT '到达目的仓库时间',
  `current_warehouse_id` BIGINT NOT NULL DEFAULT 0 COMMENT '包裹当前所处的仓库ID（入库时记录id，出库重置0）',
  `arrived_current_warehouse_at` TIMESTAMP NULL COMMENT '到达当前仓库时间',

  -- ========== 包状态 ==========
  `is_in_bag` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '当前是否在一个 bag 中（bagging和 generateBaggingTask 置为 1，各种 arrival 时判断是否与当前 hub 或 whs 段码一致，否则置0）',
  `last_bag_sorting_code` VARCHAR(32) NULL COMMENT '当前所属的 bag 段码，由 bagging 和 generateBaggingTask设置，由unbagging和dissolveBaggingTask清除',
  `last_bag_task_id` BIGINT NULL COMMENT '最后关联的组包任务ID',

  -- ========== 末段扫描时间 ==========
  `last_delivery_scan_time` TIMESTAMP NULL COMMENT '末段扫描时间',

  -- ========== 末段配送状态 ==========
  `is_delivered` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已送达',
  `is_delivery_picked_up` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否配送员已取件：0-未取件，1-已取件',
  `delivered_at` TIMESTAMP NULL COMMENT '送达时间',
  `delivery_attempts` INT NOT NULL DEFAULT 0 COMMENT '送达尝试次数',
  `expected_delivery_time` TIMESTAMP NULL COMMENT '预计交付时间',
  `deliver_at` TIMESTAMP NULL COMMENT '派件发车时间',
  `pod_review_status` INT NOT NULL DEFAULT 0 COMMENT 'POD审核状态：0-未审核、1-审核通过、2-审核不通过',
  `pod_image_s3_keys_json` TEXT NULL COMMENT 'POD图片S3 key列表["s3_key1","s3_key2",...]',
  `delivered_dsp_id` BIGINT NULL COMMENT '末段配送DSP ID',
  `delivered_driver_account_id` BIGINT NULL COMMENT '末段配送司机账户ID',
  `is_return_to_whs_scanned` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已仓库扫描',
  `direction` TINYINT NOT NULL DEFAULT 0 COMMENT '订单方向: 0-forward、1-return',
  -- ========== 其他 ==========
  `has_manded` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否有系统补偿扫描',
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_order_tracking_number` (`tracking_number`),
  KEY `idx_order_reference_no` (`reference_no`),
  KEY `idx_order_sorting_code` (`sorting_code`),
  KEY `idx_order_current_warehouse_id` (`current_warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 订单地址表
CREATE TABLE `order_address` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `street_address` VARCHAR(255) NOT NULL COMMENT '地址行1',
  `building` VARCHAR(255) NULL COMMENT '地址行2',
  `district` VARCHAR(100) NULL COMMENT '区域/县，对应美国地址的county',
  `city` VARCHAR(100) NOT NULL COMMENT '城市',
  `state_province` VARCHAR(2) NOT NULL COMMENT '州(两字母缩写)',
  `postal_code` VARCHAR(10) NOT NULL COMMENT '邮编',
  `full_name` VARCHAR(100) NOT NULL COMMENT '全名',
  `phone_country_code` INT NOT NULL DEFAULT 1 COMMENT '国家代码',
  `phone_number` VARCHAR(20) NOT NULL COMMENT '电话号码',
  `phone_extension` VARCHAR(10) NULL COMMENT '电话分机号',
  `email` VARCHAR(100) NULL COMMENT '电子邮件',
  `company` VARCHAR(100) NULL COMMENT '公司名称',
  `instructions` TEXT NULL COMMENT '配送说明',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单地址表';

-- 订单事件表
CREATE TABLE `order_event` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '事件ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `type` VARCHAR(50) NOT NULL COMMENT '事件类型',
  `data_json` TEXT NOT NULL COMMENT '事件数据JSON',
  `processed_at` TIMESTAMP NULL COMMENT '处理时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_event_order_id` (`order_id`),
  KEY `idx_order_event_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单事件表';

-- 订单轨迹信息表
CREATE TABLE `order_tracking_info` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tracking_number` VARCHAR(32) NOT NULL COMMENT '跟踪编号',
  `channel_id` BIGINT NULL COMMENT 'channel ID',
  `event_list_json` TEXT COMMENT '事件列表JSON格式',
  `last_checked_event_id` BIGINT NULL COMMENT '最后检查的事件ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_order_tracking_info_tracking_number` (`tracking_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单轨迹信息表';


-- 报表文件管理表
CREATE TABLE `report_file` (
`id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '报表ID',
`type` INT NOT NULL COMMENT '报表类型 1：日报 2：周报：3:月报',
`name` VARCHAR(100) NOT NULL COMMENT '报表名称',
`report_date` DATE NOT NULL COMMENT '报表日期',
`report_s3_keys_json` TEXT NOT NULL COMMENT '存贮路径',
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报表管理表';


-- zipcode表
CREATE TABLE `zipcode` (
  `zipcode` VARCHAR(5) NOT NULL COMMENT '基础邮编(5位)',
  `city` VARCHAR(64) NOT NULL COMMENT '城市名',
  `state` VARCHAR(2) NOT NULL COMMENT '州缩写',
  `county` VARCHAR(64) COMMENT '所属郡',
  `timezone` VARCHAR(32) COMMENT '所在时区',
  `latitude` DECIMAL(10,7) COMMENT '纬度',
  `longitude` DECIMAL(10,7) COMMENT '经度',
  `area_id` BIGINT NULL COMMENT '所属区域ID',
  `sorting_code` VARCHAR(32) COMMENT '分拣码(来自area表的sorting_code)',
  `is_delivery` TINYINT NOT NULL DEFAULT 0 COMMENT '是否支持配送：0-不支持，1-支持',
  `is_pickup` TINYINT NOT NULL DEFAULT 0 COMMENT '是否支持取件：0-不支持，1-支持',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`zipcode`),
  KEY `idx_zipcode_state` (`state`),
  KEY `idx_zipcode_sorting_code` (`sorting_code`),
  KEY `idx_zipcode_delivery_pickup` (`is_delivery`, `is_pickup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='邮编信息表';

-- dsp表
CREATE TABLE `dsp` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(128) NOT NULL COMMENT 'DSP名称',
  `dsp_code` VARCHAR(32) COMMENT 'DSP代码',
  `contact_name` VARCHAR(64) COMMENT '联系人',
  `contact_phone` VARCHAR(20) COMMENT '联系电话',
  `country_code` INT NOT NULL DEFAULT 1 COMMENT '国家代码',
  `contact_email` VARCHAR(128) COMMENT '联系邮箱',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用、1-启用',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_dsp_code` (`dsp_code`),
  UNIQUE KEY `idx_dsp_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='配送服务提供商表';

-- warehouse表
CREATE TABLE `warehouse` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `parent_site_id` BIGINT NOT NULL DEFAULT 0 COMMENT '父站点ID(只有warehouse有父站点)',
  `name` VARCHAR(128) NOT NULL COMMENT '仓库名称',
  `site_type` TINYINT NOT NULL COMMENT '站点类型：1-hub、2-warehouse',
  `contact_name` VARCHAR(64) COMMENT '联系人名称',
  `country_code` INT NOT NULL DEFAULT 1 COMMENT '国家代码',
  `phone_number` VARCHAR(32) COMMENT '电话号码',
  `extension` VARCHAR(16) COMMENT '分机号',
  `address_line_1` VARCHAR(255) NOT NULL COMMENT '地址1',
  `address_line_2` VARCHAR(255) COMMENT '地址2',
  `country` VARCHAR(64) COMMENT '国家',
  `state` VARCHAR(32) COMMENT '州',
  `city` VARCHAR(64) COMMENT '城市',
  `zipcode` VARCHAR(32) COMMENT '邮编',
  `latitude` DECIMAL(10,7) COMMENT '纬度',
  `longitude` DECIMAL(10,7) COMMENT '经度',
  `pickup_zone_zipcode_list_json` TEXT COMMENT '支持取件的邮政编码列表["123456","789012"]',
  `delivery_zone_zipcode_list_json` TEXT COMMENT '支持派送的邮政编码列表["123456","789012"]',
  `pickup_deadline_time` TIME COMMENT '揽收交件截止时间(HH:mm)',
  `appointment_deadline_time` TIME COMMENT '预约截止时间(HH:mm)',
  `time_zone` VARCHAR(64) COMMENT '所处时区',
  `sorting_code` VARCHAR(32) COMMENT '段码(xx | xx-yy)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_warehouse_name` (`name`),
  UNIQUE KEY `idx_warehouse_sorting_code` (`sorting_code`),
  KEY `idx_warehouse_site_type` (`site_type`),
  KEY `idx_warehouse_parent_site_id` (`parent_site_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='仓库表';

-- area表
CREATE TABLE `area` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(128) NOT NULL COMMENT '区域名称',
  `warehouse_id` BIGINT NOT NULL COMMENT '关联仓库ID',
  `dsp_id` BIGINT NOT NULL COMMENT '关联DSP ID',
  `zipcode_list_json` TEXT NOT NULL COMMENT '邮政编码列表["123456","789012"]',
  `sorting_code` VARCHAR(32) COMMENT '3段码(xx-yy-zz)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_area_sorting_code` (`sorting_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='区域表';

-- warehouse_dsp表
CREATE TABLE `warehouse_dsp` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID',
  `dsp_id` BIGINT NOT NULL COMMENT 'DSP ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_warehouse_dsp_unique` (`warehouse_id`, `dsp_id`),
  KEY `idx_warehouse_dsp_warehouse_id` (`warehouse_id`),
  KEY `idx_warehouse_dsp_dsp_id` (`dsp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='仓库DSP关联表';

-- warehouse_order表
CREATE TABLE `warehouse_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `entry_time` TIMESTAMP NULL COMMENT '入库时间',
  `exit_time` TIMESTAMP NULL COMMENT '出库时间',
  `status` VARCHAR(32) NOT NULL COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_warehouse_order_unique` (`warehouse_id`, `order_id`),
  KEY `idx_warehouse_order_warehouse_id` (`warehouse_id`),
  KEY `idx_warehouse_order_order_id` (`order_id`),
  KEY `idx_warehouse_order_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='仓库订单关联表';

-- route表
CREATE TABLE `route` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '关联仓库ID',
  `dsp_id` BIGINT NOT NULL COMMENT '所属DSP ID',
  `task_date` DATE NOT NULL COMMENT '任务日期',
  `content_json` TEXT NOT NULL COMMENT '路线内容: [{"parcelCount":100,"routeIndex":0,"driverAccountId":6,"routeName":"西雅图市中心-1路线","areaId":1}]',
  `version` INT NOT NULL DEFAULT 1 COMMENT '版本号',
  `area_id` BIGINT NULL COMMENT '主要关联的区域ID（如果route只涉及单个area）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `idx_warehouse_id_dsp_id` (`warehouse_id`, `dsp_id`),
  KEY `idx_route_area_id` (`area_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='路线表';

-- route_history表
CREATE TABLE `route_history` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `dsp_id` BIGINT NOT NULL COMMENT '所属DSP ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '关联仓库ID',
  `task_date` DATE NOT NULL COMMENT '任务日期',
  `content_json` TEXT NOT NULL COMMENT '路线内容: [{"parcelCount":100,"routeIndex":0,"driverAccountId":6,"routeName":"西雅图市中心-1路线","areaId":1}]',
  `version` INT NOT NULL COMMENT '版本号',
  `area_id` BIGINT NULL COMMENT '主要关联的区域ID（如果route只涉及单个area）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_warehouse_id_dsp_id` (`warehouse_id`, `dsp_id`),
  KEY `idx_route_history_area_id` (`area_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='路线历史表';

-- area_path_planning表 - 存储Area粒度预规划任务
CREATE TABLE `area_path_planning` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `area_id` BIGINT NOT NULL COMMENT '区域ID',
  `path_planning_task_id` BIGINT NOT NULL COMMENT '关联的路径规划任务ID',
  `task_date` DATE NOT NULL COMMENT '任务日期',
  `warehouse_id` BIGINT NOT NULL COMMENT '关联仓库ID',
  `dsp_id` BIGINT NOT NULL COMMENT '关联DSP ID',
  `total_parcels` INT NOT NULL DEFAULT 0 COMMENT '包裹总数',
  `is_latest` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否最新有效规划',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_area_path_planning_warehouse_dsp` (`warehouse_id`, `dsp_id`),
  KEY `idx_area_path_planning_task_id` (`path_planning_task_id`),
  KEY `idx_area_path_planning_latest` (`area_id`, `is_latest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Area粒度预规划任务表';

-- delivery_task表
CREATE TABLE `delivery_task` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  /* 路线 & 司机信息 */
  `route_history_id`  BIGINT      NOT NULL COMMENT '路线历史 ID',
  `route_name`        VARCHAR(128) NOT NULL COMMENT '路线名称',
  `driver_account_id` BIGINT      NOT NULL COMMENT '司机账户 ID',
  /* 关联到规划任务（新增字段，已内联） */
  `path_planning_task_id` BIGINT NULL COMMENT '关联的路径规划任务 ID',
  /* 新增Area相关字段 */
  `area_id` BIGINT NULL COMMENT '关联的区域ID',
  `area_name` VARCHAR(128) NULL COMMENT '区域名称',
  /* 元信息 */
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  PRIMARY KEY (`id`),
  KEY `idx_delivery_task_driver_account_id`  (`driver_account_id`),
  KEY `idx_delivery_task_path_planning_task_id` (`path_planning_task_id`),
  KEY `idx_delivery_task_area_id` (`area_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='已发布路线表';

-- delivery_task_order表
CREATE TABLE `delivery_task_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `delivery_task_id` BIGINT NOT NULL COMMENT '已发布路线ID',
  `dsp_id` BIGINT NOT NULL COMMENT 'DSP ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `tracking_number` VARCHAR(32) NOT NULL COMMENT '跟踪编号',
  `stop_number` INT NOT NULL DEFAULT 0 COMMENT '停靠点编号',
  `route_name` VARCHAR(32) NULL COMMENT '路线名称',
  /* 新增Area相关字段 */
  `area_name` VARCHAR(128) NULL COMMENT '区域名称',
  `is_new_assignment` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否新分配',
  `is_transfer_in` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否转入',
  `transfer_from_driver_name` VARCHAR(64) NULL COMMENT '转出司机名称',
  `is_transfer_out` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否转出(是否在管理后台点publish被抢单)',
  `transfer_to_driver_name` VARCHAR(64) NULL COMMENT '转入司机名称',
  `is_delivered` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已送达',
  `is_picked_up` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已取件（司机取件扫描）',
  `is_dsp_arrival_scan_completed` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'DSP到达扫描完成(DSP经理到件扫描)',
  `is_abnormal` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否异常',
  `is_delivery` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已派件发车',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_delivery_task_order_tracking_number` (`tracking_number`),
  KEY `idx_delivery_task_order_dsp_id` (`dsp_id`),
  KEY `idx_delivery_task_order_order_id` (`order_id`),
  UNIQUE KEY `idx_delivery_task_order_unique` (`delivery_task_id`, `order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='已发布路线订单关联表';

-- 车型表
CREATE TABLE `vehicle_type` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID/车型编号',
  `name_zh` VARCHAR(64) NOT NULL COMMENT '中文选项',
  `name_en` VARCHAR(64) NOT NULL COMMENT '英文选项',
  `name_es` VARCHAR(64) NOT NULL COMMENT '西语选项',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='车型表';

-- 包牌表
CREATE TABLE `bag` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '包牌ID',
  `bag_number` VARCHAR(32) NOT NULL COMMENT '包牌号',
  `bag_type` TINYINT NOT NULL COMMENT '包牌类型：1-一段、2-二段、3-三段',
  `warehouse_id` BIGINT NULL COMMENT '创建站点ID',
  `bag_task_id` BIGINT NULL COMMENT '关联的组包任务ID',
  `sorting_code` VARCHAR(32) NOT NULL COMMENT '段码(xx-yy-zz)',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-未使用(未装包扫描)、1-已使用(装包扫描)、2-已废弃(系统作废+拆包扫描作废)',
  `created_by` BIGINT NULL COMMENT '创建者用户ID',
  `created_site` BIGINT NULL COMMENT '创建站点ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_bag_status` (`status`),
  KEY `idx_bag_sorting_code` (`sorting_code`),
  KEY `idx_bag_task_id` (`bag_task_id`),
  KEY `idx_bag_created_by` (`created_by`),
  KEY `idx_bag_created_site` (`created_site`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='包牌表';

-- 包牌订单关联表
CREATE TABLE `bag_order` (  
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '包牌订单ID',
  `bag_id` BIGINT NOT NULL COMMENT '包牌ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `tracking_number` VARCHAR(32) NOT NULL COMMENT '订单跟踪号',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_bag_order_unique` (`bag_id`, `order_id`),
  KEY `idx_bag_order_bag_id` (`bag_id`),
  KEY `idx_bag_order_tracking_number` (`tracking_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='包牌订单表';

-- 车牌表
CREATE TABLE `plate` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `license_plate` VARCHAR(32) NOT NULL COMMENT '车牌号',
  `seal_no` VARCHAR(32) COMMENT '车签号',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：1-装车中(未封发车扫描)、2-已封发车(封发车扫描)、3-已解封车(解封车扫描)、4-已废弃(系统作废+拆包扫描作废)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_plate_status_license_plate_seal_no` (`status`, `license_plate`, `seal_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='车牌表';

-- 车牌订单关联表
CREATE TABLE `plate_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `plate_id` BIGINT NOT NULL COMMENT '车牌ID',
  `tracking_number` VARCHAR(32) NOT NULL COMMENT '跟踪编号(异形件/大件的运单号及包牌号)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_plate_order_unique` (`plate_id`, `tracking_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='车牌订单关联表';

-- 渠道表
CREATE TABLE `channel` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '渠道ID',
  `channel_name` VARCHAR(128) NOT NULL COMMENT '渠道名称',
  `is_auto_generate` TINYINT NOT NULL DEFAULT 0 COMMENT '是否自动生成预约单：0-否，1-是',
  `company_name` VARCHAR(128) NOT NULL COMMENT '公司名称',
  `company_address` VARCHAR(255) COMMENT '公司联系地址',
  `contact_name` VARCHAR(64) COMMENT '联系人名称',
  `country_code` INT NOT NULL DEFAULT 1 COMMENT '国家代码',
  `contact_phone` VARCHAR(32) COMMENT '联系电话',
  `email` VARCHAR(128) COMMENT 'email',
  `tax_rate` DECIMAL(5,2) COMMENT '税率(%)',
  `tax_id` VARCHAR(64) COMMENT '纳税人识别号',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '客户状态：0-停用，1-激活',
  `remark` TEXT COMMENT '备注',
  `price_config_json` TEXT COMMENT '价格配置JSON（包含zipcode白名单、附加费、超重限制等）',
  `api_version` TINYINT NULL COMMENT 'OpenAPI 版本 (1, 2, etc.)',
  `app_key` VARCHAR(32) NULL COMMENT 'OpenAPI App Key',
  `app_secret` VARCHAR(128) NULL COMMENT 'OpenAPI App Secret',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_channel_name` (`channel_name`),
  KEY `idx_channel_status` (`status`),
  KEY `idx_channel_openapi_credentials` (`api_version`, `app_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='渠道表';

-- path_planning_task表
CREATE TABLE `path_planning_task` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',

  /* 任务过程与结果 */
  `request_json` LONGTEXT        NOT NULL COMMENT 'PathPlanningRequest 的 JSON 序列化',
  `results_json` LONGTEXT        NULL COMMENT 'PathPlanningResult 列表的 JSON 序列化',
  `status`       VARCHAR(32) NOT NULL DEFAULT 'PENDING' COMMENT '任务状态：PENDING, RUNNING, COMPLETED, FAILED',
  `error_message`           TEXT  NULL COMMENT '错误信息',

  /* 运行统计 */
  `start_time`            TIMESTAMP NULL COMMENT '任务开始时间',
  `end_time`              TIMESTAMP NULL COMMENT '任务结束时间',
  `processing_time_ms`    BIGINT    NULL COMMENT '处理时间 (毫秒)',
  `total_distance_km`     DOUBLE    NULL COMMENT '总距离 (公里)',
  `total_duration_minutes` INT      NULL COMMENT '总时间 (分钟)',
  `address_count`          INT      NOT NULL DEFAULT 0 COMMENT '地址数量',

  /* 执行详情 */
  `execution_details_json` LONGTEXT NULL COMMENT '执行详情JSON（包含分层的详细信息）',

  /* 元信息 */
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  PRIMARY KEY (`id`),
  KEY `idx_path_planning_task_status`     (`status`),
  KEY `idx_path_planning_task_created_at` (`created_at`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='路径规划任务表';

-- zipcode_path_planning表
CREATE TABLE `zipcode_path_planning` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',

  /* 业务主键 */
  `zipcode` VARCHAR(5) NOT NULL COMMENT '邮编',

  /* 关联到具体任务 */
  `path_planning_task_id` BIGINT NOT NULL COMMENT '路径规划任务 ID',
  `is_latest` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否最新有效规划',

  /* 元信息 */
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  PRIMARY KEY (`id`),

  /* 常用查询索引 */
  KEY `idx_zipcode_path_planning_zipcode` (`zipcode`),
  KEY `idx_zipcode_path_planning_latest`  (`zipcode`, `is_latest`),
  KEY `idx_zipcode_path_planning_task_id` (`path_planning_task_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='zipcode 路径规划映射表（无 warehouse/dsp 维度）';

-- warehouse_operations_record表
CREATE TABLE `warehouse_operations_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID',
  `tracking_number` VARCHAR(32) NOT NULL COMMENT '跟踪编号',
  `pickup_arrival_scan_at` TIMESTAMP NULL COMMENT '揽件到件扫描时间',
  `transfer_arrival_scan_at` TIMESTAMP NULL COMMENT '中转到件扫描时间',
  `whs_arrival_scan_at` TIMESTAMP NULL COMMENT 'WHS到件扫描时间',
  `bagging_scan_at` TIMESTAMP NULL COMMENT '装包扫描时间',
  `bag_number` VARCHAR(32) NULL COMMENT '装包扫描时的包牌号',
  `departure_scan_at` TIMESTAMP NULL COMMENT '发件扫描时间',
  `sorting_scan_at` TIMESTAMP NULL COMMENT '分拣扫描时间',
  `loading_scan_at` TIMESTAMP NULL COMMENT '装车扫描时间',
  `return_scan_at` TIMESTAMP NULL COMMENT '退件时间',
  `return_to_whs_scan_at` TIMESTAMP NULL COMMENT '返件时间',
  `return_arrival_scan_at` TIMESTAMP NULL COMMENT '退件入库时间',
  `holding_scan_at` TIMESTAMP NULL COMMENT '留仓时间',
  `license_plate` VARCHAR(32) NULL COMMENT '装车扫描时的车牌号',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_warehouse_operations_record_unique` (`warehouse_id`, `tracking_number`),
  KEY `idx_warehouse_operations_record_tracking_number` (`tracking_number`),
  KEY `idx_warehouse_operations_record_warehouse_id` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='仓库操作日志表';

-- zone_mapping表
CREATE TABLE zone_mapping (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `origin_zipcode_prefix` VARCHAR(3) NOT NULL COMMENT '起始邮编前缀(3位)',
    `target_zipcode_start` VARCHAR(5) NOT NULL COMMENT '目标邮编范围开始',
    `target_zipcode_end` VARCHAR(5) NOT NULL COMMENT '目标邮编范围结束',
    `zone` INT NOT NULL COMMENT 'zone编号(1-9)',
    `rule_type` TINYINT NOT NULL COMMENT '规则类型: 1-EXACT, 2-RANGE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    INDEX `idx_zone_mapping_origin_prefix` (origin_zipcode_prefix),
    INDEX `idx_zone_mapping_target_start` (target_zipcode_start),
    INDEX `idx_zone_mapping_target_end` (target_zipcode_end),
    UNIQUE INDEX `idx_zone_mapping_unique` (origin_zipcode_prefix, target_zipcode_start, target_zipcode_end),
    INDEX `idx_zone_mapping_query` (origin_zipcode_prefix, rule_type, target_zipcode_start, target_zipcode_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Zone映射规则表';

-- zone_pricing表 - 存储Zone报价数据，支持客户粒度配置
CREATE TABLE zone_pricing (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `channel_id` BIGINT NULL COMMENT '渠道ID，NULL表示全局配置',
    `weight_lbs` DECIMAL(8,4) NOT NULL COMMENT '重量（磅，支持小数如0.0625磅=1盎司）',
    `zone` INT NOT NULL COMMENT 'Zone编号(1-9)',
    `price_usd` DECIMAL(10,2) NOT NULL COMMENT '价格（美元）',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY `idx_zone_pricing_channel_weight_zone` (channel_id, weight_lbs, zone),
    INDEX `idx_zone_pricing_channel_id` (channel_id),
    INDEX `idx_zone_pricing_zone` (zone),
    INDEX `idx_zone_pricing_weight_lbs` (weight_lbs),
    INDEX `idx_zone_pricing_query` (channel_id, weight_lbs, zone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Zone报价表，支持客户粒度配置';

-- delivery_task_review - 发车审核表(少件)
CREATE TABLE `delivery_task_review` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dsp_id` BIGINT NOT NULL comment '关联DSP ID',
    `account_id` BIGINT NOT NULL comment '账户ID',
    `warehouse_id` BIGINT NOT NULL comment '所属仓库ID',
    `task_date`  TIMESTAMP NOT NULL comment '任务分配时间',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='发车审核表(少件)';

-- zone_sla_time表
CREATE TABLE `zone_sla_time` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channel_id` BIGINT NULL COMMENT '渠道ID，NULL表示全局配置',
  `zone` Int NOT NULL COMMENT '区域编号',
  `sla_hours` INT NOT NULL COMMENT 'SLA时效(小时)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_zone_sla_time_zone` (`zone`),
  UNIQUE KEY `idx_zone_sla_time_channel_zone` (`channel_id`, `zone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SLA时效表';

-- =============================================================================
-- 揽收系统相关表
-- =============================================================================

-- 车型表
CREATE TABLE `vehicle_model` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(128) NOT NULL COMMENT '车型名称',
  `vehicle_type_id` BIGINT NOT NULL COMMENT '车辆类型ID（关联vehicle_type表）',
  `default_max_weight_lbs` DECIMAL(10,2) NOT NULL COMMENT '默认最大载重(磅)',
  `default_max_volume_ft3` DECIMAL(10,3) NOT NULL COMMENT '默认最大容积(立方英尺)',
  `default_length_ft` DECIMAL(8,2) NOT NULL COMMENT '默认长度(英尺)',
  `default_width_ft` DECIMAL(8,2) NOT NULL COMMENT '默认宽度(英尺)',
  `default_height_ft` DECIMAL(8,2) NOT NULL COMMENT '默认高度(英尺)',
  `description` TEXT NULL COMMENT '车型描述',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-停用，1-启用',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_vehicle_model_name` (`name`),
  KEY `idx_vehicle_model_vehicle_type_id` (`vehicle_type_id`),
  KEY `idx_vehicle_model_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='车型表';

-- 揽收车辆表
CREATE TABLE `vehicle` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `vehicle_model_id` BIGINT NOT NULL COMMENT '车型ID（关联vehicle_model表）',
  `warehouse_id` BIGINT NOT NULL COMMENT '所属Hub ID（关联warehouse表，site_type=1）',
  `vehicle_number` VARCHAR(32) NOT NULL COMMENT '车辆编号(T001, T002, T003, ...)，用于标识车辆',
  `license_plate` VARCHAR(32) NOT NULL COMMENT '车牌号',
  `max_weight_lbs` DECIMAL(10,2) NULL COMMENT '实际最大载重(磅)，可覆盖车型默认值',
  `max_volume_ft3` DECIMAL(10,3) NULL COMMENT '实际最大容积(立方英尺)，可覆盖车型默认值',
  `length_ft` DECIMAL(8,2) NULL COMMENT '实际长度(英尺)，可覆盖车型默认值',
  `width_ft` DECIMAL(8,2) NULL COMMENT '实际宽度(英尺)，可覆盖车型默认值',
  `height_ft` DECIMAL(8,2) NULL COMMENT '实际高度(英尺)，可覆盖车型默认值',
  `fuel_type` INT NOT NULL DEFAULT 0 COMMENT '燃油类型：0-未知，1-Diesel，2-Gasoline，3-Electric',
  `vehicle_photo_s3_keys_json` TEXT NULL COMMENT '车辆照片(JSON数组)',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '车辆状态：0-停用，1-可用',
  `notes` TEXT NULL COMMENT '备注信息',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_vehicle_license_plate` (`license_plate`),
  KEY `idx_vehicle_vehicle_model_id` (`vehicle_model_id`),
  KEY `idx_vehicle_warehouse_id` (`warehouse_id`),
  KEY `idx_vehicle_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收车辆表' AUTO_INCREMENT=100;

-- 揽收中继点表
CREATE TABLE `pickup_rally_point` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '所属Hub ID（关联warehouse表，site_type=1）',
  `name` VARCHAR(128) NOT NULL COMMENT '中继点名称',
  `address_line_1` VARCHAR(255) NOT NULL COMMENT '地址1',
  `address_line_2` VARCHAR(255) COMMENT '地址2',
  `country` VARCHAR(64) COMMENT '国家',
  `state` VARCHAR(32) COMMENT '州',
  `city` VARCHAR(64) COMMENT '城市',
  `contact_name` VARCHAR(64) NULL COMMENT '联系人',
  `country_code` VARCHAR(3) NULL COMMENT '国家代码',
  `contact_phone` VARCHAR(32) NULL COMMENT '联系电话',
  `latitude` DECIMAL(10,7) NULL COMMENT '纬度',
  `longitude` DECIMAL(10,7) NULL COMMENT '经度',
  `zipcode` VARCHAR(32) COMMENT '邮编',
  `pickup_zone_zipcode_list_json` TEXT COMMENT '支持取件的邮政编码列表["123456","789012"]（关联的warehouse数据同名字段子集）',
  `is_active` TINYINT NOT NULL DEFAULT 1 COMMENT '是否激活：0-停用，1-激活',
  `delivery_deadline` TIMESTAMP NOT NULL COMMENT '交件截单时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_pickup_rally_point_warehouse_id` (`warehouse_id`),
  KEY `idx_pickup_rally_point_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收中继点表';

-- 揽收预约单表
CREATE TABLE `pickup_appointment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '负责Hub ID（关联warehouse表，site_type=1）',
  `channel_id` BIGINT NOT NULL COMMENT '渠道ID',
  `appointment_number` VARCHAR(32) NOT NULL COMMENT '预约单号',
  `cooperation_warehouse_id` BIGINT NULL COMMENT '合作仓ID（后期关联pickup_warehouse_id表）',
  `contact_name` VARCHAR(64) COMMENT '联系人',
  `contact_phone` VARCHAR(20) COMMENT '联系电话',
  `country_code` INT NOT NULL DEFAULT 1 COMMENT '国家代码',
  `contact_email` VARCHAR(128) COMMENT '联系邮箱',
  `ext` VARCHAR(64) COMMENT '转机号',
  `address_line_1` VARCHAR(255) NOT NULL COMMENT '地址1',
  `address_line_2` VARCHAR(255) COMMENT '地址2',
  `country` VARCHAR(64) COMMENT '国家',
  `state` VARCHAR(32) COMMENT '州',
  `city` VARCHAR(64) COMMENT '城市',
  `zipcode` VARCHAR(10) NOT NULL COMMENT '揽收邮编',
  `timezone` VARCHAR(32) NOT NULL COMMENT '时区',

  `work_weekdays_json` VARCHAR(20) NOT NULL DEFAULT '[1,2,3,4,5]' COMMENT '工作日（JSON数组：[1,2,3,4,5,6,7]）',
  `work_start_time` TIME NOT NULL DEFAULT '09:00:00' COMMENT '工作开始时间',
  `work_end_time` TIME NOT NULL DEFAULT '18:00:00' COMMENT '工作结束时间',

  `expected_pickup_date` DATE NOT NULL COMMENT '期望揽收日期',
  `expected_pickup_time_start` TIME NOT NULL COMMENT '期望揽收时间开始',
  `expected_pickup_time_end` TIME NOT NULL COMMENT '期望揽收时间结束',
  `actual_pickup_date` DATE NULL COMMENT '实际揽收日期',
  `actual_pickup_time_start` TIME NULL COMMENT '实际揽收时间开始',
  `actual_pickup_time_end` TIME NULL COMMENT '实际揽收时间结束',

  `expected_parcel_count` INT NOT NULL DEFAULT 1 COMMENT '期望包裹数量',
  `actual_parcel_count` INT NOT NULL DEFAULT 0 COMMENT '实际收取包裹数量',
  `expected_parcel_unit` TINYINT NULL DEFAULT 1 COMMENT '包裹单位: 1.件，2.袋，3.箱，4.板',
  `actual_parcel_unit` TINYINT NULL COMMENT '实收包裹单位: 1.件，2.袋，3.箱，4.板',
  `notes` TEXT NULL COMMENT '备注',
  `tracking_numbers_json` TEXT NULL COMMENT '包裹明细JSON格式["tracking_number1","tracking_number2"]',

  `status` VARCHAR(32) NOT NULL DEFAULT 'CREATED' COMMENT '状态：CREATED-已创建，SCHEDULING-调度中，SCHEDULED-已调度，IN_PROGRESS-进行中，COMPLETED-已完成，CANCELLED-已取消，FAILED-失败',
  `is_finished` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已完成',
  `is_abnormal` TINYINT NOT NULL DEFAULT 0 COMMENT '是否异常',
  `exception_reason_code` VARCHAR(50) NULL COMMENT '异常原因代码',
  `photos_s3_keys_json` TEXT NULL COMMENT '现场照片S3密钥JSON数组',
  `exception_photos_s3_keys_json` TEXT NULL COMMENT '异常照片S3密钥JSON数组',
  `is_system` TINYINT NOT NULL DEFAULT 0 COMMENT '是否系统生成',
  `create_type` TINYINT NOT NULL DEFAULT 0 COMMENT '创建类型，0：手动生成，1：有预约日期定时任务生成，2：没有预约日期定时任务生成',
  `system_remark_json` TEXT NULL COMMENT '系统备注',
  `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已删除',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_pickup_appointment_warehouse_id` (`warehouse_id`),
  KEY `idx_pickup_appointment_date` (`expected_pickup_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收预约单表';

-- 揽收任务单表
CREATE TABLE `pickup_task` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `task_number` VARCHAR(32) NOT NULL COMMENT '任务编号（业务编号，用于页面展示）',
  `task_date` DATE NOT NULL COMMENT '任务日期',
  `warehouse_id` BIGINT NOT NULL COMMENT '所属Hub ID（关联warehouse表，site_type=1）',
  `route_id` BIGINT NULL COMMENT '关联的路线ID（关联pickup_route表）',
  `route_name` VARCHAR(128) NULL COMMENT '路线名称',
  `account_id` BIGINT NOT NULL COMMENT '司机ID（关联account表）',
  `driver_name` VARCHAR(128) NULL COMMENT '司机姓名',
  `vehicle_id` BIGINT NOT NULL COMMENT '车辆ID（关联vehicle表）',
  `vehicle_number` VARCHAR(64) NULL COMMENT '车辆编号',
  `license_plate` VARCHAR(32) NULL COMMENT '车牌号',
  `vehicle_model_id` INT NOT NULL COMMENT '车辆型号ID',
  `vehicle_model_name` VARCHAR(128) NULL COMMENT '车型名称',
  `start_point_type` INT NOT NULL COMMENT '起始点类型：1-Hub，2-中继点, 3-第一个预约单地址, 4-仓库',
  `start_point_value` BIGINT NOT NULL COMMENT '起始点ID（关联warehouse表或pickup_rally_point表）',
  `end_point_type` INT NOT NULL COMMENT '终点类型：1-Hub，2-中继点',
  `end_point_value` BIGINT NOT NULL COMMENT '终点ID（关联warehouse表或pickup_rally_point表）',
  `estimated_distance_km` DECIMAL(8,2) NULL COMMENT '预估距离（公里）',
  `estimated_duration_minutes` INT NULL COMMENT '预估时长（分钟）',
  `actual_distance_km` DECIMAL(8,2) NULL COMMENT '实际距离（公里）',
  `actual_duration_minutes` INT NULL COMMENT '实际时长（分钟）',
  `status` VARCHAR(32) NOT NULL DEFAULT 'DRAFT' COMMENT '状态：DRAFT-草稿，PUBLISHED-已发布，IN_PROGRESS-进行中，COMPLETED-已完成，CANCELLED-已取消',
  `exp_departure_time` TIMESTAMP NULL COMMENT '预计出发时间',
  `act_departure_time` TIMESTAMP NULL COMMENT '实际出发时间',
  `exp_complete_time` TIMESTAMP NULL COMMENT '预计到达终点时间',
  `act_complete_time` TIMESTAMP NULL COMMENT '实际到达终点时间',
  `route_optimization_json` TEXT NULL COMMENT '路线优化详情JSON',
  `notes` TEXT NULL COMMENT '任务备注',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_pickup_task_task_number` (`task_number`),
  KEY `idx_pickup_task_warehouse_id` (`warehouse_id`),
  KEY `idx_pickup_task_route_id` (`route_id`),
  KEY `idx_pickup_task_account_id` (`account_id`),
  KEY `idx_pickup_task_vehicle_id` (`vehicle_id`),
  KEY `idx_pickup_task_date` (`task_date`),
  KEY `idx_pickup_task_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收任务单表';

-- 任务预约关联表
CREATE TABLE `pickup_task_appointment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `pickup_task_id` BIGINT NOT NULL COMMENT '揽收任务ID（关联pickup_task表）',
  `pickup_appointment_id` BIGINT NOT NULL COMMENT '预约单ID（关联pickup_appointment表）',
  `stop_number` INT NOT NULL COMMENT '站点顺序（在任务中的停靠顺序）',
  `status` VARCHAR(32) NOT NULL DEFAULT 'CREATED' COMMENT '关联状态：CREATED-已创建，DISPATCHING-调度中，DISPATCHED-已调度，PICKING_UP-揽收中，PICKED_UP-已揽收，PICKUP_FAILED-揽收失败，CANCELLED-已取消，TRANSFER_OUT-已移出',
  `is_finished` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已完成',
  `is_abnormal` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否异常',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_pickup_task_appointment_unique` (`pickup_task_id`, `pickup_appointment_id`),
  KEY `idx_pickup_task_appointment_pickup_task_id` (`pickup_task_id`),
  KEY `idx_pickup_task_appointment_pickup_appointment_id` (`pickup_appointment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收任务预约关联表';

-- 揽收卸货记录表
CREATE TABLE `pickup_task_unloading` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `pickup_task_id` BIGINT NOT NULL COMMENT '所属揽收任务ID（关联pickup_task表）',
  `warehouse_id` BIGINT NOT NULL COMMENT '卸货地点Hub ID（关联warehouse表）',
  `unloading_count` INT NOT NULL DEFAULT 0 COMMENT '卸货次数',
  `photos_s3_keys_json` TEXT NOT NULL COMMENT '卸货照片S3密钥JSON数组 ["s3_key1","s3_key2"]',
  `status` TINYINT NOT NULL DEFAULT '1' COMMENT '1-卸货,2-终点',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_pickup_task_unloading_pickup_task_id` (`pickup_task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收卸货记录表';

-- 揽收路线历史表
CREATE TABLE `pickup_route_history` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID（关联warehouse表）',
  `pickup_date` DATE NOT NULL COMMENT '揽收日期',
  `route_id` BIGINT NOT NULL COMMENT '路线ID（关联route表）',
  `alg_task_id` VARCHAR(64) NULL COMMENT '算法任务ID',
  `version` INT NOT NULL DEFAULT 0 COMMENT '版本号',
  `status` VARCHAR(32) NOT NULL DEFAULT 'CREATED' COMMENT '状态：CREATED-已创建，RUNNING-算法运行中，SUCCESS-算法运行成功，FAILED-算法运行失败，APPLIED-已应用',
  `input_content` TEXT NULL COMMENT '输入内容（JSON格式）',
  `result_content` TEXT NULL COMMENT '结果内容（JSON格式）',
  `max_polling_count` INT NOT NULL DEFAULT 20 COMMENT '最大轮训次数，默认20次',
  `current_polling_count` INT NOT NULL DEFAULT 0 COMMENT '当前已轮训次数',
  `polling_failure_reason` TEXT NULL COMMENT '轮训失败原因',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_pickup_route_history_warehouse_id` (`warehouse_id`),
  KEY `idx_pickup_route_history_pickup_date` (`pickup_date`),
  KEY `idx_pickup_route_history_route_id` (`route_id`),
  KEY `idx_pickup_route_history_alg_task_id` (`alg_task_id`),
  KEY `idx_pickup_route_history_status` (`status`),
  KEY `idx_pickup_route_history_polling_count` (`current_polling_count`, `max_polling_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收路线历史表';

-- 揽收路线表
CREATE TABLE `pickup_route` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `route_name` VARCHAR(128) NOT NULL COMMENT '路线名称',
  `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID（关联warehouse表）',
  `zipcodes_list_json` TEXT NOT NULL COMMENT '邮编列表（JSON格式：["12345","67890"]）',
  `driver_id` BIGINT NOT NULL COMMENT '司机ID（关联account_pickup_driver表）',
  `vehicle_id` BIGINT NOT NULL COMMENT '车辆ID（关联vehicle表）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_pickup_route_route_name` (`route_name`),
  KEY `idx_pickup_route_warehouse_id` (`warehouse_id`),
  KEY `idx_pickup_route_driver_id` (`driver_id`),
  KEY `idx_pickup_route_vehicle_id` (`vehicle_id`),
  KEY `idx_pickup_route_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='揽收路线表';

-- address_geocoding表
CREATE TABLE address_geocoding (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `address` VARCHAR(600) NOT NULL COMMENT '地址字符串',
    
    -- 地理编码结果（成功时有值，失败时为NULL）
    `latitude` DECIMAL(10,7) NULL COMMENT '纬度',
    `longitude` DECIMAL(10,7) NULL COMMENT '经度',
    `provider` VARCHAR(32) NULL COMMENT '提供商名称：here、google',
    `confidence` DECIMAL(3,2) NULL COMMENT '置信度 0.00-1.00',

    -- 统计信息
    `success_count` BIGINT NOT NULL DEFAULT 0 COMMENT '成功次数',
    `failure_count` BIGINT NOT NULL DEFAULT 0 COMMENT '失败次数',

    -- 时间信息
    `last_used_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后使用时间',
    `last_success_at` TIMESTAMP NULL COMMENT '最后成功时间',
    `last_failure_at` TIMESTAMP NULL COMMENT '最后失败时间',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    PRIMARY KEY (id),
    UNIQUE KEY `idx_address_geocoding_address_uniq` (address),
    KEY `idx_address_geocoding_coordinates` (latitude, longitude),
    KEY `idx_address_geocoding_last_success_at` (last_success_at),
    KEY `idx_address_geocoding_last_used_at` (last_used_at),
    KEY `idx_address_geocoding_success_count` (success_count DESC),
    KEY `idx_address_geocoding_failure_count` (failure_count DESC),
    KEY `idx_address_geocoding_updated_at` (updated_at),
    KEY `idx_address_geocoding_provider` (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='地址地理编码表（缓存+统计+历史）';

-- 任务执行记录表
CREATE TABLE task_execution (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `task_name` VARCHAR(128) NOT NULL COMMENT '任务名称',
    `task_spec` TEXT COMMENT '任务规格配置(JSON格式)',
    `status` INT NOT NULL DEFAULT 1 COMMENT '执行状态：1-初始化，2-运行中，3-成功，4-失败',
    `started_at` TIMESTAMP NULL COMMENT '任务开始时间',
    `ended_at` TIMESTAMP NULL COMMENT '任务结束时间',
    `duration_seconds` BIGINT NULL COMMENT '执行耗时(秒)',
    `message` TEXT COMMENT '执行结果消息(JSON格式，包含详细统计和错误信息)',
    `server_ip` VARCHAR(64) COMMENT '执行服务器IP地址',
    `hostname` VARCHAR(128) COMMENT '执行服务器主机名',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',

    PRIMARY KEY (id),
    KEY `idx_task_name_status` (task_name, status, is_deleted),
    KEY `idx_started_at` (started_at),
    KEY `idx_created_at` (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务执行记录表';

-- 组包任务表
CREATE TABLE `bag_task` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '组包任务ID',
  `bag_task_name` VARCHAR(128) NOT NULL COMMENT '组包任务号',
  `destination_hub_id` BIGINT NULL COMMENT '目标枢纽站点ID',
  `destination_hub_name` VARCHAR(128) NULL COMMENT '目标枢纽站点名称',
  `destination_whs_id` BIGINT NULL COMMENT '目标仓库ID',
  `destination_whs_name` VARCHAR(128) NULL COMMENT '目标仓库名称',
  `start_time` TIMESTAMP NULL COMMENT '任务开始时间',
  `end_time` TIMESTAMP NULL COMMENT '任务结束时间',
  `is_discarded` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已解散：0-未解散，1-已解散',
  `creation_hub` BIGINT NULL COMMENT '创建Hub ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE (`bag_task_name`),
  KEY `idx_bag_task_is_discarded` (`is_discarded`),
  KEY `idx_bag_task_destination_hub` (`destination_hub_id`),
  KEY `idx_bag_task_destination_whs` (`destination_whs_id`),
  KEY `idx_bag_task_time_range` (`start_time`, `end_time`),
  KEY `idx_bag_task_creation_hub` (`creation_hub`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组包任务表';

-- 派件量小时粒度派件量汇总表
CREATE TABLE `ads_waybill_delivery_warehouse_sum_hf` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
   `task_date` VARCHAR(64) COMMENT '任务派发日期',
   `task_hour_time` VARCHAR(64) COMMENT '任务派发时刻',
   `time_zone` VARCHAR(64) COMMENT '所处时区',
   `warehouse_id` bigint  not null comment '仓库ID',
   `warehouse_name` VARCHAR(128)  comment '仓库名称',
   `dsp_id`       bigint   null comment 'DSP ID',
   `dsp_name` VARCHAR(128) COMMENT 'DSP名称',
   `area_id` BIGINT NULL COMMENT '区域ID',
   `area_name` VARCHAR(128)  COMMENT '区域名称',
    `driver_set` TEXT comment '司机明细',
    `plan_parcels` INT NOT NULL DEFAULT 0 COMMENT '计划投递包裹数',
    `pickup_parcels` INT NOT NULL DEFAULT 0 COMMENT '扫描包裹数',
    `suspected_missing_parcels` INT NOT NULL DEFAULT 0 COMMENT '疑似丢失包裹数',
    `devlivering_parcels` INT NOT NULL DEFAULT 0 COMMENT '派送中包裹数',
    `devlivered_parcels` INT NOT NULL DEFAULT 0 COMMENT '派送完成包裹数',
    `failed_parcels` INT NOT NULL DEFAULT 0 COMMENT '派送失败包裹数',
    `waiting_parcels` INT NOT NULL DEFAULT 0 COMMENT '等待派送包裹数',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `returned_parcels` INT NOT NULL DEFAULT 0 COMMENT '已返仓包裹数',
    `need_return_parcels` INT NOT NULL DEFAULT 0 COMMENT '需返仓包裹数',
    `overdue_parcels` INT NOT NULL DEFAULT 0 COMMENT '超时包裹数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='派送小时粒度派件量统计表';

-- OpenAPI预约取件计划表
CREATE TABLE `openapi_pickup_schedule` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `channel_id` BIGINT NOT NULL COMMENT '渠道ID',
  `tracking_number_list_json` TEXT NOT NULL COMMENT '跟踪号列表JSON格式["tracking1","tracking2"]',
  `request_data_json` TEXT NOT NULL COMMENT '用户请求数据归档JSON格式（包含预约时间、联系信息等）',
  `status` INT NOT NULL DEFAULT 1 COMMENT '状态：1-有效，0-已取消',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_openapi_pickup_schedule_channel_id` (`channel_id`),
  KEY `idx_openapi_pickup_schedule_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='OpenAPI预约取件计划表';

-- 订单事件详情统计表
CREATE TABLE `dwd_waybill_order_event_detail_df` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `tracking_number` VARCHAR(128) COMMENT '运单号',
    `event_type` VARCHAR(128) COMMENT '扫描类型',
    `trans_utc_time` VARCHAR(128) COMMENT '转化为当地时区时间',
    `time_zone` VARCHAR(128) COMMENT '所处时区',
    `warehouse_name` VARCHAR(128) COMMENT '扫描网点',
    `accountid` VARCHAR(128) COMMENT '扫描员id',
    `channel_name` VARCHAR(128) COMMENT '渠道名称（客户名称）',
    `sender_zipcode` VARCHAR(128) COMMENT '发件人邮编（始发地邮编）',
    `receiver_zipcode` VARCHAR(128) COMMENT '收件人邮编（目的地邮编）',
    `zone` VARCHAR(128) COMMENT 'zone区',
    `receiver_state` VARCHAR(128) COMMENT '目的地邮编所在州',
    `receiver_city` VARCHAR(128) COMMENT '目的地邮编所属城市',
    `driver_group` VARCHAR(128) COMMENT '所属dsp',
    `driver_id` VARCHAR(128) COMMENT '司机ID',
    `sorting_code` VARCHAR(128) COMMENT '三段码',
    `except_reason` VARCHAR(128) COMMENT '异常原因',
    `blong_date` VARCHAR(128) COMMENT '行为所属日期',
    `action_date` VARCHAR(128) DEFAULT null COMMENT '任务执行日期',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单事件详情统计表';

-- cooperation_warehouse表
CREATE TABLE `cooperation_warehouse` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name` VARCHAR(128) NOT NULL COMMENT '名称',
    `type` TINYINT NOT NULL COMMENT '类型：1-揽收',
    `warehouse_id` BIGINT NOT NULL COMMENT '所属Hub ID',
    `status` INT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用、1-启用、2-待审核',
    `address_line_1` VARCHAR(512) COMMENT '地址1',
    `address_line_2` VARCHAR(512) COMMENT '地址2',
    `country` VARCHAR(64) DEFAULT 'US' COMMENT '国家',
    `state` VARCHAR(32) COMMENT '州',
    `city` VARCHAR(64) COMMENT '城市',
    `zipcode` VARCHAR(32) COMMENT '邮编',
    `latitude` DECIMAL(10,7) COMMENT '纬度',
    `longitude` DECIMAL(10,7) COMMENT '经度',
    `address_hash` VARCHAR(255) COMMENT '地址哈希值，用于快速地址匹配',
    `contact_person_json` TEXT COMMENT '联系人[{"contact_name":"name","country_code":1,"contact_phone":"phone","extension":"123"}]',
    `email` VARCHAR(100) COMMENT '电子邮件',
    `work_weekdays_json` VARCHAR(20) COMMENT '工作日（JSON数组：[1,2,3,4,5,6,7]）',
    `work_start_time` TIME COMMENT '工作开始时间',
    `work_end_time` TIME COMMENT '工作结束时间',
    `alias_json` TEXT COMMENT '别名["alias1","alias2"]',
    `related_address_json` TEXT COMMENT '关联地址[{"address1":"123456","address2":"789012"}]',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_cooperation_warehouse_name` (`name`),
    KEY `idx_cooperation_warehouse_warehouse_id` (`warehouse_id`),
    KEY `idx_cooperation_warehouse_address_hash` (`address_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合作仓表';

-- order_pickup_info表
CREATE TABLE `order_pickup_info` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `pickup_appointment_id` BIGINT NULL COMMENT '揽收预约单ID',
  `expected_pickup_date` DATE NULL COMMENT '期望揽收日期',
  `expected_pickup_time_start` TIME NULL COMMENT '期望揽收时间开始',
  `expected_pickup_time_end` TIME NULL COMMENT '期望揽收时间结束',
  `pickup_overtime_utc` TIMESTAMP NULL COMMENT '订单提货预期的UTC超时时间',
  `contact_name` VARCHAR(64) COMMENT '合作仓联系人',
  `country_code` INT NULL DEFAULT 1 COMMENT '合作仓国家代码',
  `contact_phone` VARCHAR(20) COMMENT '合作仓联系电话',
  `contact_email` VARCHAR(128) COMMENT '合作仓联系邮箱',
  `ext` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '合作仓分机号',
  `country` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '国家',
  `state` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '州',
  `city` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '城市',
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '区域/县，对应美国地址的county',
  `street_address` varchar(255) COLLATE utf8mb4_unicode_ci NULL COMMENT '地址行1',
  `building` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '地址行2',
  `postal_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮编',
  `is_cancel` TINYINT NOT NULL DEFAULT 0 COMMENT '是否取消：0-未取消，1-已取消',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_pick_info_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单揽收信息表';


-- 算法地址库表
CREATE TABLE `dwd_algo_address_detail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `full_address` VARCHAR(1024) NOT NULL COMMENT '完整地址',
    `standard_address` VARCHAR(1024) NOT NULL COMMENT '标准地址',
    `building` VARCHAR(255) NULL COMMENT '建筑物名称，对应美国地址的address line 2',
    `street_address` VARCHAR(255) NULL COMMENT '街道地址，对应美国地址的address line 1',
    `district` VARCHAR(255) NULL COMMENT '区域/县，对应美国地址的county',
    `country` VARCHAR(64) NULL COMMENT '国家',
    `state` VARCHAR(64) NULL COMMENT '州',
    `city` VARCHAR(128) NULL COMMENT '城市',
    `zipcode` VARCHAR(64) NULL COMMENT '邮政编码',
    `standard_zipcode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标准地址-邮编',
    `standard_address1` VARCHAR(255) NULL COMMENT '标准地址-地址一',
    `standard_address2` VARCHAR(255) NULL COMMENT '标准地址-地址二',
    `standard_state` VARCHAR(64) NULL COMMENT '标准地址-州',
    `standard_city` VARCHAR(128) NULL COMMENT '标准地址-城市',
    `address_type` VARCHAR(128) NULL COMMENT '地址类型',
    `longitude` DOUBLE NULL COMMENT '经度',
    `latitude` DOUBLE NULL COMMENT '纬度',
    `is_manually_verified` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否人工确认：0-未确认，1-已确认',
    `map_result_json` TEXT NULL COMMENT '地图接口返回结果',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    PRIMARY KEY (`id`),
    KEY `idx_dwd_algo_address_detail_full_address` (`full_address`(512)),
    KEY `idx_dwd_algo_address_detail_standard_address` (`standard_address`(512)),
    KEY `idx_dwd_algo_address_detail_location` (`country`, `state`, `city`),
    KEY `idx_dwd_algo_address_detail_coordinates` (`longitude`, `latitude`),
    KEY `idx_dwd_algo_address_detail_zipcode` (`zipcode`),
    KEY `idx_dwd_algo_address_detail_verified` (`is_manually_verified`),
    KEY `idx_dwd_algo_address_detail_created_at` (`created_at`),
    KEY `idx_dwd_algo_address_detail_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='算法地址库表';

-- 算法地址相似表
CREATE TABLE `dwd_algo_address_relate_detail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `main_address2` VARCHAR(255) NULL COMMENT '主地址-地址二',
    `main_address1` VARCHAR(255) NULL COMMENT '主地址-地址一',
    `district` VARCHAR(255) NULL COMMENT '区域/县',
    `country` VARCHAR(64) NULL COMMENT '国家',
    `state` VARCHAR(64) NULL COMMENT '州',
    `city` VARCHAR(128) NULL COMMENT '城市',
    `zipcode` VARCHAR(64) NULL COMMENT '邮政编码',
    `similar_address1` VARCHAR(255) NULL COMMENT '相似地址-地址一',
    `similar_address2` VARCHAR(255) NULL COMMENT '相似地址-地址二',
    `status` TINYINT DEFAULT 1 COMMENT '状态(1=正常,0=禁用,2=关联,3=修改)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    PRIMARY KEY (`id`),
    KEY `idx_dwd_algo_address_relate_detail_location` (`country`, `state`, `city`),
    KEY `idx_dwd_algo_address_relate_detail_zipcode` (`zipcode`),
    KEY `idx_dwd_algo_address_relate_detail_status` (`status`),
    KEY `idx_dwd_algo_address_relate_detail_created_at` (`created_at`),
    KEY `idx_dwd_algo_address_relate_detail_updated_at` (`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='算法地址相似地址表';
