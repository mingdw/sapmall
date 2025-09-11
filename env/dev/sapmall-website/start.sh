#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd $(dirname $0)
cwd=$(pwd)

echo -e "${YELLOW}正在设置 Sapphire Mall Website 服务...${NC}"

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
CONTAINER_NAME="sapmall-website"
WEBSITE_PORT=3006

# 检查 Website 容器是否已经运行
if [ "$($CONTAINER_RUNTIME ps -aq -f name=$CONTAINER_NAME)" ]; then
    # 容器存在但未运行，删除它
    echo -e "${YELLOW}删除已存在但未运行的 Website 容器...${NC}"
    $CONTAINER_RUNTIME stop $CONTAINER_NAME
    $CONTAINER_RUNTIME rm $CONTAINER_NAME
fi

# 切换到项目根目录
echo -e "${YELLOW}切换到项目根目录...${NC}"
cd ../../..

# 检查 sapmall-website 目录是否存在
if [ ! -d "web_client/sapmall-website" ]; then
    echo -e "${RED}错误: web_client/sapmall-website 目录不存在!${NC}"
    exit 1
fi

# 构建 Website 镜像
echo -e "${YELLOW}构建 Sapphire Mall Website 镜像...${NC}"
$CONTAINER_RUNTIME build -t sapmall-website -f env/dev/sapmall-website/Dockerfile .

if [ $? -ne 0 ]; then
    echo -e "${RED}Sapphire Mall Website 镜像构建失败!${NC}"
    exit 1
fi

# 切回原目录
cd $cwd

# 创建并启动新容器
echo -e "${YELLOW}创建并启动新的 Sapphire Mall Website 容器...${NC}"
$CONTAINER_RUNTIME run --name $CONTAINER_NAME \
    -e PORT=$WEBSITE_PORT \
    -e HOST=0.0.0.0 \
    -e NODE_ENV=development \
    -p $WEBSITE_PORT:$WEBSITE_PORT \
    -d sapmall-website

if [ $? -ne 0 ]; then
    echo -e "${RED}Sapphire Mall Website 容器启动失败!${NC}"
    exit 1
fi

# 等待 Website 启动
echo -e "${YELLOW}等待 Sapphire Mall Website 启动...${NC}"
MAX_TRIES=5
COUNTER=0
while true; do
    # 检查 Website 是否响应
    if curl -s http://localhost:$WEBSITE_PORT > /dev/null 2>&1; then
        break
    fi
    
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -ge $MAX_TRIES ]; then
        echo -e "${RED}Sapphire Mall Website 启动超时，正在检查容器日志...${NC}"
        $CONTAINER_RUNTIME logs $CONTAINER_NAME
        exit 1
    fi
    echo -e "${YELLOW}等待 Sapphire Mall Website 启动... (${COUNTER}/${MAX_TRIES})${NC}"
    sleep 2
done

echo -e "${GREEN}Sapphire Mall Website 服务已成功设置并运行!${NC}"

# 测试 Website 连接
echo -e "${YELLOW}测试 Sapphire Mall Website 连接...${NC}"
if curl -s http://localhost:$WEBSITE_PORT > /dev/null 2>&1; then
    echo -e "${GREEN}Sapphire Mall Website 连接测试成功!${NC}"
else
    echo -e "${YELLOW}Sapphire Mall Website 连接测试失败，但服务可能仍在启动中...${NC}"
fi

echo -e "${GREEN}Sapphire Mall Website 服务设置完成!${NC}"
echo -e "${YELLOW}连接信息:${NC}"
echo -e "访问地址: http://localhost:$WEBSITE_PORT"
echo -e "管理命令: $CONTAINER_RUNTIME logs -f $CONTAINER_NAME"
echo -e "进入容器: $CONTAINER_RUNTIME exec -it $CONTAINER_NAME sh"
