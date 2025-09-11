#!/bin/bash
cd $(dirname $0)
# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 获取宿主机IP地址
HOST_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
if [ -z "$HOST_IP" ]; then
    HOST_IP="host.docker.internal" # 如果获取失败，使用Docker特殊DNS名称
    echo -e "${YELLOW}无法获取宿主机IP，将使用特殊DNS名称: $HOST_IP${NC}"
else
    echo -e "${GREEN}宿主机IP地址: $HOST_IP${NC}"
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

# 删除容器
echo -e "${YELLOW}删除容器...${NC}"
podman rm -f swiftx-nginx 2>/dev/null || true
# 删除镜像
echo -e "${YELLOW}删除镜像...${NC}"
podman rmi swiftx-nginx 2>/dev/null || true

# 构建nginx镜像
echo -e "${YELLOW}构建nginx镜像...${NC}"

podman build -t swiftx-nginx .

# 创建随机临时文件
echo -e "${YELLOW}创建临时配置文件...${NC}"
# 确保~/tmp目录存在
mkdir -p ~/tmp
TEMP_CONF=$(mktemp ~/tmp/nginx-conf-XXXXXX)
echo -e "${GREEN}临时配置文件路径: $TEMP_CONF${NC}"

# 复制nginx配置到临时文件
cp nginx.conf.tmp "$TEMP_CONF"

# 启动nginx容器
echo -e "${YELLOW}启动nginx容器...${NC}"
podman run -d \
    --name swiftx-nginx \
    -p 5100:5100 \
    -p 5101:5101 \
    -v "$TEMP_CONF:/etc/nginx/nginx.conf" \
    swiftx-nginx

sleep 30

if [ $? -eq 0 ]; then
    echo -e "${GREEN}nginx启动成功!${NC}"
    echo -e "${GREEN}使用的宿主机IP: $HOST_IP${NC}"
    echo -e "${GREEN}临时配置文件: $TEMP_CONF${NC}"
else
    echo -e "${RED}nginx启动失败.${NC}"
    # 如果启动失败，清理临时文件
    rm -f "$TEMP_CONF"
    exit 1
fi 
