#!/bin/bash

# Sapphire Mall 服务状态检查脚本

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查容器运行时
if command -v podman &> /dev/null; then
    CONTAINER_RUNTIME="podman"
elif command -v docker &> /dev/null; then
    CONTAINER_RUNTIME="docker"
else
    echo -e "${RED}错误: 未找到容器运行时.${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Sapphire Mall 服务状态检查${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "容器运行时: $CONTAINER_RUNTIME"
echo -e "检查时间: $(date)"
echo -e "${BLUE}========================================${NC}"

# 检查基础服务
echo -e "${YELLOW}基础服务状态:${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# MySQL
if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-mysql)" ]; then
    echo -e "${GREEN}✅ MySQL: 运行中${NC}"
    echo -e "   容器ID: $($CONTAINER_RUNTIME ps -q -f name=sapmall-mysql)"
    echo -e "   端口: localhost:3306"
else
    echo -e "${RED}❌ MySQL: 未运行${NC}"
fi

# Redis
if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-redis)" ]; then
    echo -e "${GREEN}✅ Redis: 运行中${NC}"
    echo -e "   容器ID: $($CONTAINER_RUNTIME ps -q -f name=sapmall-redis)"
    echo -e "   端口: localhost:6379"
else
    echo -e "${RED}❌ Redis: 未运行${NC}"
fi

# etcd
if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-etcd)" ]; then
    echo -e "${GREEN}✅ etcd: 运行中${NC}"
    echo -e "   容器ID: $($CONTAINER_RUNTIME ps -q -f name=sapmall-etcd)"
    echo -e "   端口: localhost:2379"
else
    echo -e "${RED}❌ etcd: 未运行${NC}"
fi

echo -e ""

# 检查应用服务
echo -e "${YELLOW}应用服务状态:${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# 后端服务
if [ -f "/tmp/sapmall-backend.pid" ] && kill -0 $(cat /tmp/sapmall-backend.pid) 2>/dev/null; then
    echo -e "${GREEN}✅ 后端服务: 运行中${NC}"
    echo -e "   PID: $(cat /tmp/sapmall-backend.pid)"
    echo -e "   端口: localhost:8888"
elif lsof -ti:8888 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务: 运行中${NC}"
    echo -e "   PID: $(lsof -ti:8888 | head -1)"
    echo -e "   端口: localhost:8888"
else
    echo -e "${RED}❌ 后端服务: 未运行${NC}"
fi

# 管理后台
if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-admin)" ]; then
    echo -e "${GREEN}✅ 管理后台: 运行中${NC}"
    echo -e "   容器ID: $($CONTAINER_RUNTIME ps -q -f name=sapmall-admin)"
    echo -e "   端口: localhost:3001 (智能路由)"
    echo -e "   本地端口: localhost:3004 (备用)"
else
    echo -e "${RED}❌ 管理后台: 未运行${NC}"
    echo -e "   本地端口: localhost:3004 (如果本地启动)"
fi

# DApp应用
if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-dapp)" ]; then
    echo -e "${GREEN}✅ DApp应用: 运行中${NC}"
    echo -e "   容器ID: $($CONTAINER_RUNTIME ps -q -f name=sapmall-dapp)"
    echo -e "   端口: localhost:3002 (智能路由)"
    echo -e "   本地端口: localhost:3005 (备用)"
else
    echo -e "${RED}❌ DApp应用: 未运行${NC}"
    echo -e "   本地端口: localhost:3005 (如果本地启动)"
fi

# 官网首页
if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-website)" ]; then
    echo -e "${GREEN}✅ 官网首页: 运行中${NC}"
    echo -e "   容器ID: $($CONTAINER_RUNTIME ps -q -f name=sapmall-website)"
    echo -e "   端口: localhost:3003 (智能路由)"
    echo -e "   本地端口: localhost:3006 (备用)"
else
    echo -e "${RED}❌ 官网首页: 未运行${NC}"
    echo -e "   本地端口: localhost:3006 (如果本地启动)"
fi

# Nginx代理
if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-nginx)" ]; then
    echo -e "${GREEN}✅ Nginx代理: 运行中${NC}"
    echo -e "   容器ID: $($CONTAINER_RUNTIME ps -q -f name=sapmall-nginx)"
    echo -e "   端口: localhost:8080"
else
    echo -e "${RED}❌ Nginx代理: 未运行${NC}"
fi

echo -e ""

# 访问地址
echo -e "${YELLOW}访问地址:${NC}"
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "🌐 统一入口: http://localhost:8080"
echo -e "📊 管理后台: http://localhost:3001 (智能路由) 或 http://localhost:8080/admin/"
echo -e "🚀 DApp应用: http://localhost:3002 (智能路由) 或 http://localhost:8080/dapp/"
echo -e "🏠 官网首页: http://localhost:3003 (智能路由) 或 http://localhost:8080/"
echo -e "🔧 后端API: http://localhost:8080/api/"
echo -e "📚 Swagger UI: http://localhost:8080/swagger-ui/"
echo -e ""
echo -e "${YELLOW}本地开发端口 (备用):${NC}"
echo -e "📊 管理后台: http://localhost:3004"
echo -e "🚀 DApp应用: http://localhost:3005"
echo -e "🏠 官网首页: http://localhost:3006"

echo -e ""

# 管理命令
echo -e "${YELLOW}管理命令:${NC}"
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "启动服务: ./start_local_dev_env.sh"
echo -e "停止服务: ./stop_local_dev_env.sh"
echo -e "重启服务: ./restart_local_dev_env.sh"
echo -e "查看日志: $CONTAINER_RUNTIME logs -f <容器名>"
echo -e "进入容器: $CONTAINER_RUNTIME exec -it <容器名> sh"

echo -e "${BLUE}========================================${NC}"
