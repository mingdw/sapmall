#!/bin/bash
cd $(dirname $0)
SCRIPT_DIR=$(pwd)
# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color
ROOT_DIR=$(dirname $SCRIPT_DIR)/../..
PROJECT_DIR=$ROOT_DIR/project

# 删除已有容器和镜像
echo -e "${YELLOW}正在删除已有的API Server容器和镜像...${NC}"
podman rm -f swiftx-api-server 2>/dev/null || true
podman rmi swiftx-api-server 2>/dev/null || true

# 构建api-server
echo -e "${YELLOW}构建api-server...${NC}"
cd $PROJECT_DIR
./gradlew api-server:bootJar

# 构建api-server镜像
echo -e "${YELLOW}构建api-server镜像...${NC}"
# 切换到项目根目录并指定Dockerfile路径
cd $ROOT_DIR
podman build -t swiftx-api-server -f env/dev-env/api-server/Dockerfile .
# 切回原目录
cd $SCRIPT_DIR

# 检查镜像是否构建成功
if [ $? -ne 0 ]; then
    echo -e "${RED}API Server镜像构建失败!${NC}"
    exit 1
fi

# 获取宿主机IP地址（用于MySQL连接）
HOST_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
if [ -z "$HOST_IP" ]; then
    HOST_IP="host.docker.internal" # 如果获取失败，使用Docker特殊DNS名称
    echo -e "${YELLOW}无法获取宿主机IP，将使用特殊DNS名称: $HOST_IP${NC}"
else
    echo -e "${GREEN}宿主机IP地址: $HOST_IP${NC}"
fi

# 启动api-server容器
echo -e "${YELLOW}启动api-server容器...${NC}"
podman run -d \
    --name swiftx-api-server \
    -p 5302:5302 \
    -e SPRING_DATASOURCE_URL="jdbc:mysql://$HOST_IP:5401/swiftx?charset=utf8mb4" \
    -e SPRING_DATASOURCE_USERNAME=root \
    -e SPRING_DATASOURCE_PASSWORD=my-secret-pw \
    swiftx-api-server

if [ $? -ne 0 ]; then
    echo -e "${RED}api-server启动失败.${NC}"
    exit 1
fi

echo -e "${GREEN}api-server启动成功!${NC}"
echo -e "${YELLOW}API Server服务信息:${NC}"
echo -e "API地址: http://localhost:5302"
echo -e "GraphQL端点: http://localhost:5302/api/graphql"
echo -e "GraphQL Playground: http://localhost:5302/api/playground" 