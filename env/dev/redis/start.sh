#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

cd $(dirname $0)
cwd=$(pwd)

echo -e "${YELLOW}正在设置 Redis 服务...${NC}"

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

# 设置变量
CONTAINER_NAME="sapmall-redis"
REDIS_PORT=6379

# 检查 Redis 容器是否已经运行
if [ "$($CONTAINER_RUNTIME ps -aq -f name=$CONTAINER_NAME)" ]; then
    # 容器存在但未运行，删除它
    echo -e "${YELLOW}删除已存在但未运行的 Redis 容器...${NC}"
    $CONTAINER_RUNTIME stop $CONTAINER_NAME
    $CONTAINER_RUNTIME rm $CONTAINER_NAME
fi

# 构建 Redis 镜像
echo -e "${YELLOW}构建 Redis 镜像...${NC}"
$CONTAINER_RUNTIME build -t sapmall-redis .

if [ $? -ne 0 ]; then
    echo -e "${RED}Redis 镜像构建失败!${NC}"
    exit 1
fi

# 创建并启动新容器
echo -e "${YELLOW}创建并启动新的 Redis 容器...${NC}"
$CONTAINER_RUNTIME run --name $CONTAINER_NAME \
    -e TZ=Asia/Shanghai \
    -p $REDIS_PORT:6379 \
    -v redis-data:/data \
    -d sapmall-redis

if [ $? -ne 0 ]; then
    echo -e "${RED}Redis 容器启动失败!${NC}"
    exit 1
fi

# 等待 Redis 启动
echo -e "${YELLOW}等待 Redis 启动...${NC}"
MAX_TRIES=30
COUNTER=0
while true; do
    # 检查 Redis 是否响应
    if $CONTAINER_RUNTIME exec $CONTAINER_NAME redis-cli ping &> /dev/null; then
        break
    fi
    
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -ge $MAX_TRIES ]; then
        echo -e "${RED}Redis 启动超时，正在检查容器日志...${NC}"
        $CONTAINER_RUNTIME logs $CONTAINER_NAME
        exit 1
    fi
    echo -e "${YELLOW}等待 Redis 启动... (${COUNTER}/${MAX_TRIES})${NC}"
    sleep 2
done

echo -e "${GREEN}Redis 服务已成功设置并运行!${NC}"

# 测试 Redis 连接
echo -e "${YELLOW}测试 Redis 连接...${NC}"
if $CONTAINER_RUNTIME exec $CONTAINER_NAME redis-cli ping | grep -q "PONG"; then
    echo -e "${GREEN}Redis 连接测试成功!${NC}"
else
    echo -e "${YELLOW}Redis 连接测试失败，但服务可能仍在启动中...${NC}"
fi

# 显示 Redis 信息
echo -e "${YELLOW}Redis 服务信息:${NC}"
$CONTAINER_RUNTIME exec $CONTAINER_NAME redis-cli info server | grep -E "(redis_version|uptime_in_seconds|connected_clients)"

echo -e "${GREEN}Redis 服务设置完成!${NC}"
echo -e "${YELLOW}连接信息:${NC}"
echo -e "端口: localhost:$REDIS_PORT"
echo -e "连接命令: $CONTAINER_RUNTIME exec $CONTAINER_NAME redis-cli"
echo -e "健康检查: $CONTAINER_RUNTIME exec $CONTAINER_NAME redis-cli ping"
