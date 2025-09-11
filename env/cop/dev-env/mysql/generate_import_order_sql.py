#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
订单数据导入SQL生成脚本
读取orderdata.csv文件，生成对应的数据库导入SQL语句
"""

import csv
import os
from datetime import datetime

# OverallStatus 枚举映射（基于项目中的定义）
OVERALL_STATUS_MAPPING = {
    'CREATED': 10,                   # 运单创建
    'CANCELLED': 20,                 # 已取消
    'ARRIVED_ORIGIN_HUB': 25,        # 已入库_始发地HUB
    'PENDING_SHIPMENT': 28,          # 待发运
    'IN_TRANSIT': 30,                # 运输中
    'ARRIVED_DESTINATION_HUB': 35,   # 已入库_目的地HUB
    'ARRIVED_WHS': 38,               # 已入库_WHS
    'WAITING_FOR_DELIVERY': 40,      # 待派件
    'DELIVERY_IN_PROGRESS': 50,      # 派件中
    'DELIVERED': 60,                 # 派件成功
    'DELIVERY_FAILED': 70,           # 派送失败
    'PENDING_INTERCEPTION': 75,      # 待拦截
    'INTERCEPTED': 78,               # 已拦截
    'RETURNED': 80                   # 已退件
}

# 移除ZIPCODE_SORTING_CODE_MAPPING映射，直接从CSV读取三段码


def escape_sql_string(value):
    """转义SQL字符串中的特殊字符"""
    if value is None:
        return 'NULL'
    # 先处理反斜杠，再处理单引号，使用MySQL标准的单引号转义方式
    escaped = str(value).replace("\\", "\\\\").replace("'", "''")
    return "'" + escaped + "'"


def parse_datetime(date_str):
    """解析日期时间字符串，支持多种格式"""
    if not date_str or date_str.strip() == '':
        return 'NULL'
    
    date_str = date_str.strip()
    
    # 处理ISO格式 (2025-06-19T23:18:44.000Z)
    if 'T' in date_str and date_str.endswith('Z'):
        try:
            # 移除毫秒和Z后缀
            clean_date = date_str.replace('T', ' ').replace('Z', '')
            if '.000' in clean_date:
                clean_date = clean_date.replace('.000', '')
            return f"'{clean_date}'"
        except:
            pass
    
    # 尝试其他日期格式
    formats = [
        '%Y/%m/%d',
        '%Y/%m/%d %H:%M',
        '%Y-%m-%d',
        '%Y-%m-%d %H:%M:%S'
    ]
    
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}'"
        except ValueError:
            continue
    
    print(f"警告: 无法解析日期格式: {date_str}")
    return 'NULL'


def generate_tracking_number(order_id, security_rnd):
    """生成跟踪号 - 格式：SWX + 5位securityRnd + 13位orderId"""
    return f"SWX{security_rnd:05d}{order_id:013d}"


def generate_security_rnd(order_id):
    """生成安全随机数"""
    import random
    return random.randint(10000, 99999)  # 5位数


# 已移除get_sorting_code和generate_channel_id函数，直接从CSV读取


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file = os.path.join(script_dir, 'orderdata.csv')
    output_file = os.path.join(script_dir, 'import_orders_generated.sql')
    
    if not os.path.exists(csv_file):
        print(f"错误: 找不到文件 {csv_file}")
        return
    
    # 读取CSV数据
    orders = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, 1):
            orders.append({
                'id': i,
                'sender_name': row['寄件人'],
                'sender_phone': row['寄件人电话'],
                'sender_address': row['寄件人地址'],
                'sender_state': row['寄件人州'],
                'sender_city': row['寄件人城市'],
                'sender_zipcode': row['寄件人ZIPCODE'],
                'recipient_name': row['收件人'],
                'recipient_phone': row['收件人电话'],
                'recipient_address': row['收件人地址'],
                'recipient_state': row['收件人州'],
                'recipient_city': row['收件人城市'],
                'recipient_zipcode': row['收件人ZIPCODE'],
                'channel_id': row['channel_id'],
                'channel_order_id': row['channel_order_id'],
                'expected_delivery_time': row['expected_delivery_time'],
                'volumetric_weight_kg': row['volumetric_weight_kg'],
                'length_cm': row['length_cm'],
                'width_cm': row['width_cm'],
                'height_cm': row['height_cm'],
                'package_value_usd': row['package_value_usd'],
                'sorting_code': row['三段码'],
                'status': row['运单状态'] if '运单状态' in row else 'CREATED'
            })
    
    print(f"读取到 {len(orders)} 条订单数据")
    
    # 生成SQL
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- 订单数据导入SQL (自动生成)\n")
        f.write(f"-- 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"-- 数据来源: {csv_file}\n\n")
        
        # 清除原有数据
        f.write("-- 清除原有数据，重置自增ID\n")
        f.write("TRUNCATE TABLE `order`;\n")
        f.write("TRUNCATE TABLE `order_address`;\n\n")
        
        f.write("-- 重置自增ID从1开始\n")
        f.write("ALTER TABLE `order` AUTO_INCREMENT = 1;\n")
        f.write("ALTER TABLE `order_address` AUTO_INCREMENT = 1;\n\n")
        
        # 插入寄件人地址
        f.write("-- 插入寄件人地址数据\n")
        f.write("INSERT INTO `order_address` (`full_name`, `phone_number`, `address_line_1`, `city`, `state`, `zipcode`, `country_code`) VALUES\n")
        
        sender_values = []
        for order in orders:
            values = (
                escape_sql_string(order['sender_name']),
                escape_sql_string(order['sender_phone'].replace('-', '')),
                escape_sql_string(order['sender_address']),
                escape_sql_string(order['sender_city']),
                escape_sql_string(order['sender_state']),
                escape_sql_string(order['sender_zipcode']),
                1  # country_code 默认为1
            )
            sender_values.append(f"({', '.join(map(str, values))})")
        
        f.write(',\n'.join(sender_values))
        f.write(';\n\n')
        
        # 插入收件人地址
        f.write("-- 插入收件人地址数据\n")
        f.write("INSERT INTO `order_address` (`full_name`, `phone_number`, `address_line_1`, `city`, `state`, `zipcode`, `country_code`) VALUES\n")
        
        recipient_values = []
        for order in orders:
            values = (
                escape_sql_string(order['recipient_name']),
                escape_sql_string(order['recipient_phone'].replace('-', '')),
                escape_sql_string(order['recipient_address']),
                escape_sql_string(order['recipient_city']),
                escape_sql_string(order['recipient_state']),
                escape_sql_string(order['recipient_zipcode']),
                1  # country_code 默认为1
            )
            recipient_values.append(f"({', '.join(map(str, values))})")
        
        f.write(',\n'.join(recipient_values))
        f.write(';\n\n')
        
        # 插入订单数据
        f.write("-- 插入订单数据\n")
        f.write("INSERT INTO `order` (\n")
        f.write("    `security_rnd`, `tracking_number`, `channel_id`, `channel_order_id`, `overall_status`,\n")
        f.write("    `expected_delivery_time`, `sender_address_id`, `recipient_address_id`, `receiver_zipcode`,\n")
        f.write("    `sorting_code`, `weight_kg`, `length_cm`, `width_cm`, `height_cm`, `package_value_usd`\n")
        f.write(") VALUES\n")
        
        order_values = []
        for i, order in enumerate(orders, 1):
            # 地址ID计算：寄件人地址ID = i, 收件人地址ID = i + len(orders)
            sender_address_id = i
            recipient_address_id = i + len(orders)
            
            # 获取状态值
            status_value = OVERALL_STATUS_MAPPING.get(order['status'], 10)  # 默认为CREATED
            
            # 生成安全随机数和跟踪号
            security_rnd = 0
            tracking_number = generate_tracking_number(i, security_rnd)
            
            # 从CSV读取分拣码和渠道ID
            sorting_code = order['sorting_code']
            channel_id = int(order['channel_id'])
            
            # 处理数值字段
            def safe_float(value):
                try:
                    return float(value) if value and value.strip() else 'NULL'
                except:
                    return 'NULL'
            
            values = (
                security_rnd,
                escape_sql_string(tracking_number),
                channel_id,
                escape_sql_string(order['channel_order_id']),
                status_value,
                parse_datetime(order['expected_delivery_time']),
                sender_address_id,
                recipient_address_id,
                escape_sql_string(order['recipient_zipcode']),
                escape_sql_string(sorting_code),
                safe_float(order['volumetric_weight_kg']),
                safe_float(order['length_cm']),
                safe_float(order['width_cm']),
                safe_float(order['height_cm']),
                safe_float(order['package_value_usd'])
            )
            order_values.append(f"({', '.join(map(str, values))})")
        
        f.write(',\n'.join(order_values))
        f.write(';\n\n')
        
        # 添加统计信息
        f.write("-- 数据统计\n")
        f.write(f"-- 总订单数: {len(orders)}\n")
        f.write(f"-- 寄件人地址数: {len(orders)}\n")
        f.write(f"-- 收件人地址数: {len(orders)}\n")
        
        # 状态分布统计
        status_count = {}
        for order in orders:
            status = order['status']
            status_count[status] = status_count.get(status, 0) + 1
        
        f.write("-- 订单状态分布:\n")
        for status, count in status_count.items():
            status_value = OVERALL_STATUS_MAPPING.get(status, 10)
            f.write(f"--   {status} ({status_value}): {count}条\n")
    
    print(f"SQL文件已生成: {output_file}")
    print("\n状态映射:")
    for status, value in OVERALL_STATUS_MAPPING.items():
        print(f"  {status}: {value}")
    
    print(f"\n数据统计:")
    print(f"  总订单数: {len(orders)}")
    
    # 显示状态分布
    status_count = {}
    for order in orders:
        status = order['status']
        status_count[status] = status_count.get(status, 0) + 1
    
    print("  订单状态分布:")
    for status, count in status_count.items():
        status_value = OVERALL_STATUS_MAPPING.get(status, 10)
        print(f"    {status} ({status_value}): {count}条")


if __name__ == '__main__':
    main() 