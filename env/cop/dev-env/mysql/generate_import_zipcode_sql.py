#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import sys
import os
from typing import Dict, List, Tuple, Optional

def read_csv_data(file_path: str) -> List[Dict[str, str]]:
    """读取CSV文件数据"""
    data = []
    skipped_count = 0
    
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for line_num, row in enumerate(reader, start=2):  # 从第2行开始计数（跳过表头）
            # 跳过完全空行或只有分隔符的行
            if not any(value.strip() for value in row.values()):
                skipped_count += 1
                print(f"⚠️  跳过第{line_num}行：完全空白的记录")
                continue
                
            # 跳过zip字段为空的记录
            if not row.get('zip', '').strip():
                skipped_count += 1
                print(f"⚠️  跳过第{line_num}行：zip字段为空")
                continue
                
            data.append(row)
    
    print(f"从CSV文件读取了 {len(data)} 条有效记录，跳过了 {skipped_count} 条无效记录")
    return data

def generate_area_lookup_query() -> str:
    """生成查询area表的SQL，用于获取sorting_code到area_id的映射"""
    return """
-- 查询area表获取sorting_code到area_id的映射
SELECT sorting_code, id as area_id FROM area WHERE sorting_code IS NOT NULL;
"""

def escape_sql_string(value: str) -> str:
    """转义SQL字符串"""
    if value is None:
        return "NULL"
    # 转义单引号
    escaped = value.replace("'", "''")
    return f"'{escaped}'"

def safe_float(value: str) -> Optional[float]:
    """安全地转换字符串为浮点数"""
    try:
        if not value or value.strip() == '':
            return None
        return float(value.strip())
    except (ValueError, TypeError):
        return None

def generate_zipcode_insert_statements(csv_data: List[Dict[str, str]]) -> List[str]:
    """生成zipcode表的INSERT语句"""
    insert_statements = []
    skipped_count = 0
    
    # 统计sorting_code分布
    sorting_code_stats = {}
    
    # 添加注释说明
    insert_statements.append("-- 清空现有数据并导入新的zipcode数据")
    insert_statements.append("-- 使用子查询自动匹配area_id")
    insert_statements.append("")
    insert_statements.append("-- 清空zipcode表现有数据")
    insert_statements.append("DELETE FROM zipcode;")
    insert_statements.append("")
    insert_statements.append("-- 开始导入新数据")
    insert_statements.append("")
    
    for i, row in enumerate(csv_data):
        # 提取并清理数据
        zipcode = row.get('zip', '').strip()
        city = row.get('primary_city', '').strip()
        state = row.get('state', '').strip()
        county = row.get('county', '').strip()
        timezone = row.get('timezone', '').strip()
        sorting_code = row.get('sorting code', '').strip()
        
        # 统计sorting_code
        if sorting_code:
            sorting_code_stats[sorting_code] = sorting_code_stats.get(sorting_code, 0) + 1
        
        # 处理经纬度
        latitude = safe_float(row.get('latitude', ''))
        longitude = safe_float(row.get('longitude', ''))
        
        # 跳过无效数据 - 检查所有必填字段
        if not zipcode or not city or not state:
            skipped_count += 1
            print(f"⚠️  第{i+2}行跳过无效记录: zipcode='{zipcode}', city='{city}', state='{state}'")
            continue
            
        # 进一步验证数据格式
        if len(zipcode) != 5 or not zipcode.isdigit():
            skipped_count += 1
            print(f"⚠️  第{i+2}行跳过无效zipcode格式: '{zipcode}'")
            continue
            
        if len(state) != 2:
            skipped_count += 1
            print(f"⚠️  第{i+2}行跳过无效state格式: '{state}' (应为2位字母)")
            continue
            
        # 额外验证确保字段长度符合数据库要求
        if len(city) > 64:
            skipped_count += 1
            print(f"⚠️  第{i+2}行跳过city字段过长: '{city[:50]}...' (超过64字符)")
            continue
            
        if county and len(county) > 64:
            skipped_count += 1
            print(f"⚠️  第{i+2}行跳过county字段过长: '{county[:50]}...' (超过64字符)")
            continue
        
        # 构建INSERT语句 - 正确处理NULL值
        lat_str = str(latitude) if latitude is not None else "NULL"
        lng_str = str(longitude) if longitude is not None else "NULL"
        county_str = escape_sql_string(county) if county else "NULL"
        timezone_str = escape_sql_string(timezone) if timezone else "NULL"
        sorting_code_str = escape_sql_string(sorting_code) if sorting_code else "NULL"
        
        # 自动匹配area_id的子查询
        area_id_subquery = f"(SELECT id FROM area WHERE sorting_code = {sorting_code_str} LIMIT 1)" if sorting_code else "NULL"
        
        sql = f"INSERT INTO zipcode (zipcode, city, state, county, timezone, latitude, longitude, area_id, sorting_code, is_delivery, is_pickup) VALUES ({escape_sql_string(zipcode)}, {escape_sql_string(city)}, {escape_sql_string(state)}, {county_str}, {timezone_str}, {lat_str}, {lng_str}, {area_id_subquery}, {sorting_code_str}, 0, 0);"
        
        insert_statements.append(sql)
        
        # 每1000条记录添加一个分隔注释
        if (i + 1) % 1000 == 0:
            insert_statements.append(f"-- 已处理 {i + 1} 条记录")
            insert_statements.append("")
    
    # 在文件开头添加sorting_code统计信息
    stats_info = [
        "-- Sorting Code 分布统计：",
        f"-- 总共发现 {len(sorting_code_stats)} 种不同的sorting_code",
        "-- 前10个最常见的sorting_code：",
    ]
    
    # 按出现次数排序，显示前10个
    sorted_stats = sorted(sorting_code_stats.items(), key=lambda x: x[1], reverse=True)[:10]
    for code, count in sorted_stats:
        stats_info.append(f"--   {code}: {count} 次")
    
    stats_info.extend(["", ""])
    
    # 将统计信息插入到开头
    insert_statements = stats_info + insert_statements
    
    # 打印统计信息
    print(f"📊 数据验证统计：跳过了 {skipped_count} 条无效记录")
    
    return insert_statements

def generate_update_area_id_template() -> List[str]:
    """生成更新area_id的SQL模板"""
    return [
        "",
        "-- =================================================",
        "-- 批量更新area_id字段（二选一）",
        "-- =================================================",
        "",
        "-- 方法1：批量更新所有有sorting_code的记录（强制覆盖）",
        "UPDATE zipcode z SET area_id = (SELECT a.id FROM area a WHERE a.sorting_code = z.sorting_code LIMIT 1) WHERE z.sorting_code IS NOT NULL AND EXISTS (SELECT 1 FROM area a WHERE a.sorting_code = z.sorting_code);",
        "",
        "-- 方法2：仅更新area_id为NULL的记录（保留已有值）",
        "UPDATE zipcode z SET area_id = (SELECT a.id FROM area a WHERE a.sorting_code = z.sorting_code LIMIT 1) WHERE z.area_id IS NULL AND z.sorting_code IS NOT NULL AND EXISTS (SELECT 1 FROM area a WHERE a.sorting_code = z.sorting_code);",
        ""
    ]

def main():
    """主函数"""
    print("生成zipcode表导入SQL脚本")
    print("=" * 50)
    
    # 检查CSV文件是否存在
    csv_file = "zipcodedata.csv"
    if not os.path.exists(csv_file):
        print(f"错误：找不到文件 {csv_file}")
        sys.exit(1)
    
    try:
        # 读取CSV数据
        csv_data = read_csv_data(csv_file)
        
        if not csv_data:
            print("错误：CSV文件中没有有效数据")
            sys.exit(1)
        
        # 生成SQL语句
        output_file = "import_zipcode_generated.sql"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            # 写入文件头
            f.write("-- 自动生成的zipcode表导入SQL\n")
            f.write(f"-- 数据源：{csv_file}\n")
            f.write(f"-- 生成时间：{os.popen('date').read().strip()}\n")
            f.write("-- 注意：执行前请先确认area表中的数据\n")
            f.write("\n")
            
            # 写入area查询语句
            f.write(generate_area_lookup_query())
            f.write("\n")
            
            # 写入INSERT语句
            insert_statements = generate_zipcode_insert_statements(csv_data)
            for statement in insert_statements:
                f.write(statement + "\n")
            
            # 写入更新area_id的模板
            update_templates = generate_update_area_id_template()
            for template in update_templates:
                f.write(template + "\n")
        
        print(f"✅ 成功生成SQL文件：{output_file}")
        print(f"📊 处理了 {len(csv_data)} 条zipcode记录")
        print("\n⚠️  重要提示：")
        print("1. 执行SQL前，请先运行文件中的area查询语句")
        print("2. 根据查询结果，手动调整UPDATE语句来设置正确的area_id")
        print("3. 确认is_delivery和is_pickup字段的默认值是否符合业务需求")
        
    except Exception as e:
        print(f"❌ 生成SQL文件时发生错误：{str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 