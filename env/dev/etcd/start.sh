#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

cd $(dirname $0)
cwd=$(pwd)

echo -e "${YELLOW}正在设置 etcd 服务...${NC}"

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
CONTAINER_NAME="sapmall-etcd"
ETCD_PORT_2379=2379
ETCD_PORT_2380=2380

# 检查 etcd 容器是否已经运行
if [ "$($CONTAINER_RUNTIME ps -aq -f name=$CONTAINER_NAME)" ]; then
    # 容器存在但未运行，删除它
    echo -e "${YELLOW}删除已存在但未运行的 etcd 容器...${NC}"
    $CONTAINER_RUNTIME stop $CONTAINER_NAME
    $CONTAINER_RUNTIME rm $CONTAINER_NAME
fi

# 构建 etcd 镜像
echo -e "${YELLOW}构建 etcd 镜像...${NC}"
$CONTAINER_RUNTIME build -t sapmall-etcd .

if [ $? -ne 0 ]; then
    echo -e "${RED}etcd 镜像构建失败!${NC}"
    exit 1
fi

# 创建并启动新容器
echo -e "${YELLOW}创建并启动新的 etcd 容器...${NC}"
$CONTAINER_RUNTIME run --name $CONTAINER_NAME \
    -e ETCD_NAME=etcd-node \
    -e ETCD_DATA_DIR=/etcd-data \
    -e ETCD_ADVERTISE_CLIENT_URLS=http://0.0.0.0:2379 \
    -e ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379 \
    -e ETCD_LISTEN_PEER_URLS=http://0.0.0.0:2380 \
    -e ETCD_INITIAL_ADVERTISE_PEER_URLS=http://0.0.0.0:2380 \
    -e ETCD_INITIAL_CLUSTER=etcd-node=http://0.0.0.0:2380 \
    -e ETCD_INITIAL_CLUSTER_STATE=new \
    -e ETCD_INITIAL_CLUSTER_TOKEN=etcd-cluster-1 \
    -p $ETCD_PORT_2379:2379 \
    -p $ETCD_PORT_2380:2380 \
    -d sapmall-etcd

if [ $? -ne 0 ]; then
    echo -e "${RED}etcd 容器启动失败!${NC}"
    exit 1
fi

# 等待 etcd 启动
echo -e "${YELLOW}等待 etcd 启动...${NC}"
MAX_TRIES=30
COUNTER=0
while true; do
    # 检查 etcd 是否响应
    if $CONTAINER_RUNTIME exec $CONTAINER_NAME etcdctl endpoint health --endpoints=http://localhost:2379 &> /dev/null; then
        break
    fi
    
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -ge $MAX_TRIES ]; then
        echo -e "${RED}etcd 启动超时，正在检查容器日志...${NC}"
        $CONTAINER_RUNTIME logs $CONTAINER_NAME
        exit 1
    fi
    echo -e "${YELLOW}等待 etcd 启动... (${COUNTER}/${MAX_TRIES})${NC}"
    sleep 2
done

echo -e "${GREEN}etcd 服务已成功设置并运行!${NC}"

# 测试 etcd 连接
echo -e "${YELLOW}测试 etcd 连接...${NC}"
if $CONTAINER_RUNTIME exec $CONTAINER_NAME etcdctl endpoint health --endpoints=http://localhost:2379; then
    echo -e "${GREEN}etcd 连接测试成功!${NC}"
else
    echo -e "${YELLOW}etcd 连接测试失败，但服务可能仍在启动中...${NC}"
fi

echo -e "${GREEN}etcd 服务设置完成!${NC}"
echo -e "${YELLOW}连接信息:${NC}"
echo -e "客户端端口: localhost:$ETCD_PORT_2379"
echo -e "对等端口: localhost:$ETCD_PORT_2380"
echo -e "健康检查: $CONTAINER_RUNTIME exec $CONTAINER_NAME etcdctl endpoint health --endpoints=http://localhost:2379"
