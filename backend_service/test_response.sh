#!/bin/bash

echo "测试统一响应格式..."
echo "========================"

# 测试版本接口
echo "1. 测试版本接口:"
curl -s "http://localhost:8888/api/common/version" | jq .
echo ""

# 测试健康检查接口
echo "2. 测试健康检查接口:"
curl -s "http://localhost:8888/api/common/health?service=sapphire-mall" | jq .
echo ""

# 测试错误情况
echo "3. 测试错误情况 (缺少参数):"
curl -s "http://localhost:8888/api/common/health" | jq .
echo ""

echo "测试完成！" 