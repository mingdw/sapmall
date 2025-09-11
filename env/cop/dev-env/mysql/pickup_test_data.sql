-- 揽收路线和预约单测试数据
-- 基于warehouse_id=1的仓库，参考seed_data.sql中的数据

-- 1. 创建pickup_route表数据
-- 将warehouse_id=1的zipcode分散到10个pickup_route中
INSERT INTO `pickup_route` (`id`, `route_name`, `warehouse_id`, `zipcodes_list_json`, `driver_id`, `vehicle_id`, `created_at`,
                            `updated_at`, `is_deleted`)
VALUES (1, 'Seattle Downtown Route 1', 1, '["98101","98104"]', 69, 1, NOW(), NOW(), 0),
       (2, 'Seattle Capitol Hill Route 2', 1, '["98102","98112"]', 69, 2, NOW(), NOW(), 0),
       (3, 'Seattle Queen Anne Route 3', 1, '["98109","98119"]', 69, 1, NOW(), NOW(), 0),
       (4, 'Seattle Ballard Route 4', 1, '["98107","98117"]', 69, 2, NOW(), NOW(), 0),
       (5, 'Seattle Fremont Route 5', 1, '["98103","98115"]', 69, 1, NOW(), NOW(), 0),
       (6, 'Portland Downtown Route 6', 1, '["97201","97204"]', 69, 2, NOW(), NOW(), 0),
       (7, 'Portland Pearl District Route 7', 1, '["97209","97210"]', 69, 1, NOW(), NOW(), 0),
       (8, 'Portland Eastside Route 8', 1, '["97202","97214"]', 69, 2, NOW(), NOW(), 0),
       (9, 'Portland Southwest Route 9', 1, '["97205","97219"]', 69, 1, NOW(), NOW(), 0),
       (10, 'Portland Northwest Route 10', 1, '["97206","97212"]', 69, 2, NOW(), NOW(), 0);

-- 2. 创建pickup_appointment表数据
-- 每个zipcode对应一条appointment记录，地址参考order_address中的数据
-- pickup_date设置为今天

-- Seattle Downtown (98101, 98104)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (1, 1, 1, 'PA-001-001', 'John Smith', '2065550101', 1, 'john.smith@email.com', '123 Pine Street', 'Suite 100',
        'US', 'WA', 'Seattle', '98101', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(),
        '09:00:00', '17:00:00', 3, 1, 'CREATED', NOW(), NOW()),
       (2, 1, 1, 'PA-001-002', 'Sarah Johnson', '2065550102', 1, 'sarah.j@email.com', '456 4th Avenue', 'Apt 2B', 'US',
        'WA', 'Seattle', '98101', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(), '09:00:00',
        '17:00:00', 2, 1, 'CREATED', NOW(), NOW()),
       (3, 1, 1, 'PA-001-003', 'Mike Davis', '2065550103', 1, 'mike.davis@email.com', '789 1st Street', NULL, 'US',
        'WA', 'Seattle', '98104', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(), '09:00:00',
        '17:00:00', 1, 1, 'CREATED', NOW(), NOW()),
       (4, 1, 1, 'PA-001-004', 'Lisa Wilson', '2065550104', 1, 'lisa.w@email.com', '321 Cherry Street', 'Unit 5', 'US',
        'WA', 'Seattle', '98104', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(), '09:00:00',
        '17:00:00', 4, 1, 'CREATED', NOW(), NOW());

-- Seattle Capitol Hill (98102, 98112)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (5, 1, 1, 'PA-002-001', 'David Brown', '2065550201', 1, 'david.brown@email.com', '567 Broadway Avenue', 'Apt 3C',
        'US', 'WA', 'Seattle', '98102', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(),
        '09:00:00', '17:00:00', 2, 1, 'CREATED', NOW(), NOW()),
       (6, 1, 1, 'PA-002-002', 'Emily Taylor', '2065550202', 1, 'emily.t@email.com', '890 15th Avenue', 'Suite 200',
        'US', 'WA', 'Seattle', '98112', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(),
        '09:00:00', '17:00:00', 3, 1, 'CREATED', NOW(), NOW());

-- Seattle Queen Anne (98109, 98119)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (7, 1, 1, 'PA-003-001', 'Robert Anderson', '2065550301', 1, 'robert.a@email.com', '234 Queen Anne Avenue',
        'Apt 4D', 'US', 'WA', 'Seattle', '98109', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 1, 1, 'CREATED', NOW(), NOW()),
       (8, 1, 1, 'PA-003-002', 'Jennifer Lee', '2065550302', 1, 'jennifer.lee@email.com', '567 8th Avenue West',
        'Unit 6', 'US', 'WA', 'Seattle', '98119', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 2, 1, 'CREATED', NOW(), NOW());

-- Seattle Ballard (98107, 98117)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (9, 1, 1, 'PA-004-001', 'Michael Garcia', '2065550401', 1, 'michael.g@email.com', '789 Market Street', 'Apt 7E',
        'US', 'WA', 'Seattle', '98107', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(),
        '09:00:00', '17:00:00', 3, 1, 'CREATED', NOW(), NOW()),
       (10, 1, 1, 'PA-004-002', 'Amanda Martinez', '2065550402', 1, 'amanda.m@email.com', '456 24th Avenue NW',
        'Suite 300', 'US', 'WA', 'Seattle', '98117', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 1, 1, 'CREATED', NOW(), NOW());

-- Seattle Fremont (98103, 98115)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (11, 1, 1, 'PA-005-001', 'Christopher Rodriguez', '2065550501', 1, 'chris.r@email.com', '123 Fremont Avenue',
        'Apt 8F', 'US', 'WA', 'Seattle', '98103', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 2, 1, 'CREATED', NOW(), NOW()),
       (12, 1, 1, 'PA-005-002', 'Jessica Thompson', '2065550502', 1, 'jessica.t@email.com', '567 45th Street NE',
        'Unit 9', 'US', 'WA', 'Seattle', '98115', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 4, 1, 'CREATED', NOW(), NOW());

-- Portland Downtown (97201, 97204)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (13, 1, 1, 'PA-006-001', 'Daniel White', '5035550101', 1, 'daniel.white@email.com', '234 SW Main Street',
        'Suite 100', 'US', 'OR', 'Portland', '97201', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 1, 1, 'CREATED', NOW(), NOW()),
       (14, 1, 1, 'PA-006-002', 'Ashley Clark', '5035550102', 1, 'ashley.c@email.com', '567 NW 5th Avenue', 'Apt 2B',
        'US', 'OR', 'Portland', '97204', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(),
        '09:00:00', '17:00:00', 3, 1, 'CREATED', NOW(), NOW());

-- Portland Pearl District (97209, 97210)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (15, 1, 1, 'PA-007-001', 'Matthew Lewis', '5035550201', 1, 'matthew.l@email.com', '789 NW 11th Avenue',
        'Unit 3C', 'US', 'OR', 'Portland', '97209', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 2, 1, 'CREATED', NOW(), NOW()),
       (16, 1, 1, 'PA-007-002', 'Nicole Hall', '5035550202', 1, 'nicole.h@email.com', '123 NW 13th Avenue', 'Apt 4D',
        'US', 'OR', 'Portland', '97210', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(),
        '09:00:00', '17:00:00', 1, 1, 'CREATED', NOW(), NOW());

-- Portland Eastside (97202, 97214)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (17, 1, 1, 'PA-008-001', 'Kevin Young', '5035550301', 1, 'kevin.y@email.com', '456 SE Division Street',
        'Suite 200', 'US', 'OR', 'Portland', '97202', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 3, 1, 'CREATED', NOW(), NOW()),
       (18, 1, 1, 'PA-008-002', 'Stephanie King', '5035550302', 1, 'stephanie.k@email.com',
        '789 SE Hawthorne Boulevard', 'Apt 5E', 'US', 'OR', 'Portland', '97214', 'America/Los_Angeles', '[1,2,3,4,5]',
        '09:00:00', '18:00:00', CURDATE(), '09:00:00', '17:00:00', 2, 1, 'CREATED', NOW(), NOW());

-- Portland Southwest (97205, 97219)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (19, 1, 1, 'PA-009-001', 'Andrew Wright', '5035550401', 1, 'andrew.w@email.com', '234 SW Terwilliger Boulevard',
        'Unit 6F', 'US', 'OR', 'Portland', '97205', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 1, 1, 'CREATED', NOW(), NOW()),
       (20, 1, 1, 'PA-009-002', 'Rachel Green', '5035550402', 1, 'rachel.g@email.com', '567 SW Barbur Boulevard',
        'Apt 7G', 'US', 'OR', 'Portland', '97219', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 4, 1, 'CREATED', NOW(), NOW());

-- Portland Northwest (97206, 97212)
INSERT INTO `pickup_appointment` (`id`, `warehouse_id`, `channel_id`, `appointment_number`, `contact_name`,
                                  `contact_phone`, `country_code`, `contact_email`, `address_line_1`, `address_line_2`,
                                  `country`, `state`, `city`, `zipcode`, `timezone`, `work_weekdays_json`,
                                  `work_start_time`, `work_end_time`, `expected_pickup_date`,
                                  `expected_pickup_time_start`, `expected_pickup_time_end`, `expected_parcel_count`,
                                  `expected_parcel_unit`, `status`, `created_at`, `updated_at`)
VALUES (21, 1, 1, 'PA-010-001', 'James Baker', '5035550501', 1, 'james.b@email.com', '789 NW 23rd Avenue', 'Suite 300',
        'US', 'OR', 'Portland', '97206', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00', CURDATE(),
        '09:00:00', '17:00:00', 2, 1, 'CREATED', NOW(), NOW()),
       (22, 1, 1, 'PA-010-002', 'Michelle Adams', '5035550502', 1, 'michelle.a@email.com', '123 NW 21st Avenue',
        'Apt 8H', 'US', 'OR', 'Portland', '97212', 'America/Los_Angeles', '[1,2,3,4,5]', '09:00:00', '18:00:00',
        CURDATE(), '09:00:00', '17:00:00', 3, 1, 'CREATED', NOW(), NOW());

-- 3. 创建pickup_route_history表数据（可选，用于测试调度器）
INSERT INTO `pickup_route_history` (`id`, `warehouse_id`, `pickup_date`, `route_id`, `version`, `status`,
                                    `max_polling_count`, `current_polling_count`,
                                    `polling_failure_reason`, `created_at`, `updated_at`)
VALUES (1, 1, CURDATE(), 1, 1, 'CREATED',
        5,
        0, NULL, NOW(), NOW()),
       (2, 1, CURDATE(), 2, 1, 'CREATED',
        5,
        0, NULL, NOW(), NOW()),
       (3, 1, CURDATE(), 3, 1, 'CREATED',
        5,
        0, NULL, NOW(), NOW());

-- 数据说明：
-- 1. pickup_route: 创建了10条路线，覆盖Seattle和Portland的主要区域
-- 2. pickup_appointment: 创建了22条预约单记录，每个zipcode对应1-2条记录
-- 3. 地址信息参考了seed_data.sql中order_address的格式
-- 4. 所有记录的pickup_date都设置为今天（CURDATE()）
-- 5. driver_id统一使用69（来自account_pickup_driver表）
-- 6. 状态都设置为'CREATED'，便于测试调度器处理
-- 7. 添加了pickup_route_history数据，用于测试调度器的CREATED状态处理
