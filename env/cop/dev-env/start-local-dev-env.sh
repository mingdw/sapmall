#!/bin/bash

# 获取当前目录
cd $(dirname $0)
cwd=$(pwd)

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 检查Podman是否安装
if ! command -v podman &> /dev/null; then
    echo -e "${RED}错误: Podman未安装. 请先安装Podman.${NC}"
    exit 1
fi

# 函数：检查容器是否运行
check_container() {
    local container_name=$1
    
    # 首先检查容器是否存在
    local exists=$(podman ps -a --filter status=running --format "{{.Names}}" | grep "^${container_name}$")
    if [ -z "$exists" ]; then
        echo -e "${YELLOW}容器 $container_name 不存在${NC}"
        return 1
    fi
    
    # 然后检查容器状态是否为"running"
    local status=$(podman inspect --format "{{.State.Status}}" "${container_name}" 2>/dev/null)
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
    else
        $script_path
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}$service_name 启动成功!${NC}"
        else
            echo -e "${RED}$service_name 启动失败.${NC}"
            exit 1
        fi
    fi
}

# 启动服务
services=("mysql" "api-server" "mobile-web" "desktop-web" "nginx")
for service in "${services[@]}"; do
    echo -e "${YELLOW}正在启动 $service...${NC}"
    start_service "$service" "swiftx-$service" "$cwd/$service/start.sh"
done

echo -e "${GREEN}开发环境已启动!${NC}"
echo -e "${YELLOW}你可以通过以下方式访问服务:${NC}"
echo -e "mobile-web: http://localhost:5100/"
echo -e "desktop-web: http://localhost:5101/"
echo -e "${YELLOW}管理命令:${NC}"
echo -e "1. 查看日志:"
echo -e "   - API Server: podman logs -f swiftx-api-server"
echo -e "   - Mobile Web: podman logs -f swiftx-mobile-web"
echo -e "   - Desktop Web: podman logs -f swiftx-desktop-web"
echo -e "   - MySQL: podman logs -f swiftx-mysql"
echo -e "   - Nginx: podman logs -f swiftx-nginx"
echo -e "2. 停止服务: ./stop-local-dev-env.sh"
echo -e "3. 重启服务: ./restart-local-dev-env.sh"
echo -e "4. 进入容器:"
echo -e "   - API Server: podman exec -it swiftx-api-server bash"
echo -e "   - Mobile Web: podman exec -it swiftx-mobile-web bash"
echo -e "   - Desktop Web: podman exec -it swiftx-desktop-web bash"
echo -e "   - MySQL: podman exec -it swiftx-mysql bash" 