#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo $(dirname $0)
cd $(dirname $0)
cwd=$(pwd)

# 切换到项目根目录
cd ../../../

# 先在本地构建React应用
echo -e "${BLUE}在本地构建SapMall DApp应用...${NC}"
cd web_client/sapmall-dapp
npm install --legacy-peer-deps
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}SapMall DApp应用构建失败!${NC}"
    exit 1
fi
cd ../../

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
CONTAINER_NAME="sapmall-dapp"
DAPP_PORT=3002

# 删除已有容器和镜像
echo -e "${YELLOW}正在删除已有的SapMall DApp容器和镜像...${NC}"
$CONTAINER_RUNTIME rm -f $CONTAINER_NAME 2>/dev/null || true
$CONTAINER_RUNTIME rmi $CONTAINER_NAME 2>/dev/null || true

# 构建SapMall DApp镜像
echo -e "${YELLOW}构建SapMall DApp镜像...${NC}"
echo -e "${BLUE}使用本地预构建的build目录...${NC}"

# 构建镜像
$CONTAINER_RUNTIME build -t $CONTAINER_NAME -f env/dev/sapmall-dapp/Dockerfile .

# 检查镜像是否构建成功
if [ $? -ne 0 ]; then
    echo -e "${RED}SapMall DApp镜像构建失败!${NC}"
    exit 1
fi

# 切回原目录
cd $cwd

# 启动SapMall DApp容器
echo -e "${YELLOW}启动SapMall DApp容器...${NC}"
$CONTAINER_RUNTIME run -d \
    --name $CONTAINER_NAME \
    -p $DAPP_PORT:$DAPP_PORT \
    $CONTAINER_NAME

if [ $? -ne 0 ]; then
    echo -e "${RED}SapMall DApp容器启动失败!${NC}"
    exit 1
fi

# 等待服务启动
echo -e "${YELLOW}等待SapMall DApp启动...${NC}"
MAX_TRIES=5
COUNTER=0
while true; do
    # 检查服务是否响应
    if curl -s http://localhost:$DAPP_PORT > /dev/null 2>&1; then
        break
    fi
    
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -ge $MAX_TRIES ]; then
        echo -e "${RED}SapMall DApp启动超时，正在检查容器日志...${NC}"
        $CONTAINER_RUNTIME logs $CONTAINER_NAME
        exit 1
    fi
    echo -e "${YELLOW}等待SapMall DApp启动... (${COUNTER}/${MAX_TRIES})${NC}"
    sleep 2
done

echo -e "${GREEN}SapMall DApp启动成功!${NC}"

# 测试连接
echo -e "${YELLOW}测试SapMall DApp连接...${NC}"
if curl -s http://localhost:$DAPP_PORT > /dev/null 2>&1; then
    echo -e "${GREEN}SapMall DApp连接测试成功!${NC}"
else
    echo -e "${YELLOW}SapMall DApp连接测试失败，但服务可能仍在启动中...${NC}"
fi

echo -e "${YELLOW}SapMall DApp服务信息:${NC}"
echo -e "访问地址: http://localhost:$DAPP_PORT"
echo -e "${BLUE}注意: 这是生产构建版本，使用serve提供静态文件服务${NC}"
echo -e "管理命令: $CONTAINER_RUNTIME logs -f $CONTAINER_NAME"
echo -e "进入容器: $CONTAINER_RUNTIME exec -it $CONTAINER_NAME sh"
