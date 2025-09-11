#!/bin/bash

# Sapphire Mall 本地开发环境启动脚本
# 参考 cop 目录的启动流程，统一启动所有服务

# 获取当前目录
cd $(dirname $0)
cwd=$(pwd)

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查容器运行时是否安装
if command -v podman &> /dev/null; then
    CONTAINER_RUNTIME="podman"
elif command -v docker &> /dev/null; then
    CONTAINER_RUNTIME="docker"
else
    echo -e "${RED}错误: 未找到容器运行时. 请先安装 Docker 或 Podman.${NC}"
    exit 1
fi

echo -e "${GREEN}使用容器运行时: $CONTAINER_RUNTIME${NC}"

# 函数：检查容器是否运行
check_container() {
    local container_name=$1
    
    # 首先检查容器是否存在
    local exists=$($CONTAINER_RUNTIME ps -a --filter status=running --format "{{.Names}}" | grep "^${container_name}$")
    if [ -z "$exists" ]; then
        echo -e "${YELLOW}容器 $container_name 不存在${NC}"
        return 1
    fi
    
    # 然后检查容器状态是否为"running"
    local status=$($CONTAINER_RUNTIME inspect --format "{{.State.Status}}" "${container_name}" 2>/dev/null)
    if [ "$status" = "running" ]; then
        echo -e "${GREEN}容器 $container_name 正在运行${NC}"
        return 0
    else
        echo -e "${YELLOW}容器 $container_name 存在但未运行，状态为: $status${NC}"
        return 1
    fi
}

# 函数：启动服务
start_service() {
    local service_name=$1
    local container_name=$2
    local script_path=$3

    echo -e "${YELLOW}正在启动 $service_name...${NC}"
    
    if check_container $container_name; then
        echo -e "${YELLOW}$service_name 已经在运行.${NC}"
        return 0
    else
        echo -e "${BLUE}执行启动脚本: $script_path${NC}"
        if [ -f "$script_path" ]; then
            bash "$script_path"
            local exit_code=$?
            if [ $exit_code -eq 0 ]; then
                echo -e "${GREEN}$service_name 启动成功!${NC}"
                return 0
            else
                echo -e "${RED}$service_name 启动失败 (退出码: $exit_code).${NC}"
                echo -e "${YELLOW}继续启动其他服务...${NC}"
                return 1
            fi
        else
            echo -e "${RED}启动脚本不存在: $script_path${NC}"
            echo -e "${YELLOW}跳过 $service_name...${NC}"
            return 1
        fi
    fi
}

# 启动服务
services=("mysql" "redis" "etcd" "backend_service" "sapmall-admin" "sapmall-dapp" "sapmall-website" "nginx")
failed_services=()

for service in "${services[@]}"; do
    echo -e "${YELLOW}正在启动 $service...${NC}"
    # 特殊处理 sapmall-dapp 的容器名称
    if [ "$service" = "sapmall-dapp" ]; then
        container_name="sapmall-dapp"
    else
        container_name="sapmall-$service"
    fi
    
    
    if ! start_service "$service" "$container_name" "$cwd/$service/start.sh"; then
        failed_services+=("$service")
    fi
    echo -e "${BLUE}----------------------------------------${NC}"
done

# 显示启动结果
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}服务启动完成!${NC}"
echo -e "${GREEN}========================================${NC}"

if [ ${#failed_services[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ 所有服务启动成功!${NC}"
else
    echo -e "${YELLOW}⚠️  以下服务启动失败:${NC}"
    for service in "${failed_services[@]}"; do
        echo -e "${RED}   - $service${NC}"
    done
    echo -e "${YELLOW}请检查日志并手动重启失败的服务${NC}"
fi

# 检查服务状态
echo -e "${YELLOW}检查服务状态...${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# 检查基础服务
echo -e "${YELLOW}基础服务状态:${NC}"
if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-mysql)" ]; then
    echo -e "${GREEN}✅ MySQL: 运行中${NC}"
else
    echo -e "${RED}❌ MySQL: 未运行${NC}"
fi

if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-redis)" ]; then
    echo -e "${GREEN}✅ Redis: 运行中${NC}"
else
    echo -e "${RED}❌ Redis: 未运行${NC}"
fi

if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-etcd)" ]; then
    echo -e "${GREEN}✅ etcd: 运行中${NC}"
else
    echo -e "${RED}❌ etcd: 未运行${NC}"
fi

# 检查应用服务
echo -e "${YELLOW}应用服务状态:${NC}"
if [ -f "/tmp/sapmall-backend.pid" ] && kill -0 $(cat /tmp/sapmall-backend.pid) 2>/dev/null; then
    echo -e "${GREEN}✅ 后端服务: 运行中 (PID: $(cat /tmp/sapmall-backend.pid))${NC}"
elif lsof -ti:8888 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务: 运行中 (端口 8888)${NC}"
else
    echo -e "${RED}❌ 后端服务: 未运行${NC}"
fi

if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-admin)" ]; then
    echo -e "${GREEN}✅ 管理后台: 运行中${NC}"
else
    echo -e "${RED}❌ 管理后台: 未运行${NC}"
fi

if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-dapp)" ]; then
    echo -e "${GREEN}✅ DApp应用: 运行中${NC}"
else
    echo -e "${RED}❌ DApp应用: 未运行${NC}"
fi

if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-website)" ]; then
    echo -e "${GREEN}✅ 官网首页: 运行中${NC}"
else
    echo -e "${RED}❌ 官网首页: 未运行${NC}"
fi

if [ "$($CONTAINER_RUNTIME ps -q -f name=sapmall-nginx)" ]; then
    echo -e "${GREEN}✅ Nginx代理: 运行中${NC}"
else
    echo -e "${RED}❌ Nginx代理: 未运行${NC}"
fi

echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${GREEN}开发环境已启动!${NC}"
echo -e "${YELLOW}你可以通过以下方式访问服务:${NC}"
echo -e "🌐 统一入口: http://localhost:8080"
echo -e "📊 管理后台: http://localhost:7101 (IDE优先) 或 http://localhost:3001 (IDE直连) 或 http://localhost:3004 (容器直连)"
echo -e "🚀 DApp应用: http://localhost:7102 (IDE优先) 或 http://localhost:3002 (IDE直连) 或 http://localhost:3005 (容器直连)"
echo -e "🏠 官网首页: http://localhost:7103 (IDE优先) 或 http://localhost:3003 (IDE直连) 或 http://localhost:3006 (容器直连)"
echo -e "🔧 后端API: http://localhost:8080/api/"
echo -e "📚 Swagger UI: http://localhost:8080/swagger-ui/"
echo -e "💾 MySQL: localhost:3306"
echo -e "🔴 Redis: localhost:6379"
echo -e "⚡ etcd: localhost:2379"
echo -e "${YELLOW}管理命令:${NC}"
echo -e "1. 查看日志:"
echo -e "   - 后端服务: $CONTAINER_RUNTIME logs -f sapmall-backend_service"
echo -e "   - MySQL: $CONTAINER_RUNTIME logs -f sapmall-mysql"
echo -e "   - Redis: $CONTAINER_RUNTIME logs -f sapmall-redis"
echo -e "   - etcd: $CONTAINER_RUNTIME logs -f sapmall-etcd"
echo -e "   - 管理后台: $CONTAINER_RUNTIME logs -f sapmall-admin"
echo -e "   - DApp应用: $CONTAINER_RUNTIME logs -f sapmall-dapp"
echo -e "   - 官网首页: $CONTAINER_RUNTIME logs -f sapmall-website"
echo -e "   - Nginx代理: $CONTAINER_RUNTIME logs -f sapmall-nginx"
echo -e "2. 停止服务: ./stop_local_dev_env.sh"
echo -e "3. 重启服务: ./restart_local_dev_env.sh"
echo -e "4. 进入容器:"
echo -e "   - 后端服务: $CONTAINER_RUNTIME exec -it sapmall-backend_service bash"
echo -e "   - MySQL: $CONTAINER_RUNTIME exec -it sapmall-mysql bash"
echo -e "   - Redis: $CONTAINER_RUNTIME exec -it sapmall-redis sh"
echo -e "   - etcd: $CONTAINER_RUNTIME exec -it sapmall-etcd sh"
echo -e "   - 管理后台: $CONTAINER_RUNTIME exec -it sapmall-admin sh"
echo -e "   - DApp应用: $CONTAINER_RUNTIME exec -it sapmall-dapp sh"
echo -e "   - 官网首页: $CONTAINER_RUNTIME exec -it sapmall-website sh"
echo -e "   - Nginx代理: $CONTAINER_RUNTIME exec -it sapmall-nginx sh"
