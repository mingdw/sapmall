#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd $(dirname $0)
cwd=$(pwd)

echo -e "${YELLOW}正在设置 Nginx 反向代理服务...${NC}"

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

# 获取宿主机IP地址
HOST_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
if [ -z "$HOST_IP" ]; then
    HOST_IP="host.docker.internal" # 如果获取失败，使用Docker特殊DNS名称
    echo -e "${YELLOW}无法获取宿主机IP，将使用特殊DNS名称: $HOST_IP${NC}"
else
    echo -e "${GREEN}宿主机IP地址: $HOST_IP${NC}"
fi

# 设置变量
CONTAINER_NAME="sapmall-nginx"

# 检查 Nginx 容器是否已经运行
if [ "$($CONTAINER_RUNTIME ps -aq -f name=$CONTAINER_NAME)" ]; then
    # 容器存在但未运行，删除它
    echo -e "${YELLOW}删除已存在但未运行的 Nginx 容器...${NC}"
    $CONTAINER_RUNTIME stop $CONTAINER_NAME
    $CONTAINER_RUNTIME rm $CONTAINER_NAME
fi

# 生成临时nginx配置文件，替换IP地址
echo -e "${YELLOW}正在生成nginx配置文件...${NC}"
cat nginx.conf.template > nginx.conf.tmp

# 检测操作系统类型并使用对应的sed命令
if [[ "$(uname)" == "Darwin" ]]; then
    # macOS使用
    sed -i '' "s/\${HOST_IP}/$HOST_IP/g" nginx.conf.tmp
else
    # Linux使用
    sed -i "s/\${HOST_IP}/$HOST_IP/g" nginx.conf.tmp
fi

# 构建 Nginx 镜像
echo -e "${YELLOW}构建 Nginx 镜像...${NC}"
$CONTAINER_RUNTIME build -t sapmall-nginx .

if [ $? -ne 0 ]; then
    echo -e "${RED}Nginx 镜像构建失败!${NC}"
    exit 1
fi

# 创建随机临时文件
echo -e "${YELLOW}创建临时配置文件...${NC}"
# 确保~/tmp目录存在
mkdir -p ~/tmp
TEMP_CONF=$(mktemp ~/tmp/nginx-conf-XXXXXX)
echo -e "${GREEN}临时配置文件路径: $TEMP_CONF${NC}"

# 复制nginx配置到临时文件
cp nginx.conf.tmp "$TEMP_CONF"

# 创建并启动新容器
echo -e "${YELLOW}创建并启动新的 Nginx 容器...${NC}"
$CONTAINER_RUNTIME run --name $CONTAINER_NAME \
    -p 8080:8080 \
    -p 7101:7101 \
    -p 7102:7102 \
    -p 7103:7103 \
    -v "$TEMP_CONF:/etc/nginx/nginx.conf" \
    -d sapmall-nginx

if [ $? -ne 0 ]; then
    echo -e "${RED}Nginx 容器启动失败!${NC}"
    # 如果启动失败，清理临时文件
    rm -f "$TEMP_CONF"
    exit 1
fi

# 等待 Nginx 启动
echo -e "${YELLOW}等待 Nginx 启动...${NC}"
sleep 5

echo -e "${GREEN}Nginx 反向代理服务已成功设置并运行!${NC}"

# 测试 Nginx 连接
echo -e "${YELLOW}测试 Nginx 连接...${NC}"
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}Nginx 连接测试成功!${NC}"
else
    echo -e "${YELLOW}Nginx 连接测试失败，但服务可能仍在启动中...${NC}"
fi

echo -e "${GREEN}Nginx 反向代理服务设置完成!${NC}"
echo -e "${YELLOW}连接信息:${NC}"
echo -e "主入口: http://localhost:8080"
echo -e "管理后台: http://localhost:3001 (智能路由) 或 http://localhost/admin/"
echo -e "DApp应用: http://localhost:3002 (智能路由) 或 http://localhost/dapp/"
echo -e "官网首页: http://localhost:3003 (智能路由) 或 http://localhost/"
echo -e "后端API: http://localhost/api/"
echo -e "Swagger UI: http://localhost/swagger-ui/"
echo -e "使用的宿主机IP: $HOST_IP"
echo -e "临时配置文件: $TEMP_CONF"
echo -e "管理命令: $CONTAINER_RUNTIME logs -f $CONTAINER_NAME"
echo -e "进入容器: $CONTAINER_RUNTIME exec -it $CONTAINER_NAME sh"
