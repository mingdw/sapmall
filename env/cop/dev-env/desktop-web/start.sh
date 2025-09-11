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
echo -e "${BLUE}在本地构建React应用...${NC}"
cd project/desktop-web
npm install
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}React应用构建失败!${NC}"
    exit 1
fi
cd ../../

# 删除已有容器和镜像
echo -e "${YELLOW}正在删除已有的Desktop Web容器和镜像...${NC}"
podman rm -f swiftx-desktop-web 2>/dev/null || true
podman rmi swiftx-desktop-web 2>/dev/null || true

# 构建Desktop Web镜像
echo -e "${YELLOW}构建Desktop Web镜像...${NC}"
echo -e "${BLUE}使用本地预构建的build目录...${NC}"

# 构建镜像
podman build -t swiftx-desktop-web -f env/dev-env/desktop-web/Dockerfile .

# 检查镜像是否构建成功
if [ $? -ne 0 ]; then
    echo -e "${RED}Desktop Web镜像构建失败!${NC}"
    exit 1
fi

# 切回原目录
cd $cwd

# 启动Desktop Web容器
echo -e "${YELLOW}启动Desktop Web容器...${NC}"
podman run -d \
    --name swiftx-desktop-web \
    -p 5502:5502 \
    swiftx-desktop-web

if [ $? -ne 0 ]; then
    echo -e "${RED}Desktop Web容器启动失败!${NC}"
    exit 1
fi
    
echo -e "${GREEN}Desktop Web启动成功!${NC}"

echo -e "${YELLOW}Desktop Web服务信息:${NC}"
echo -e "访问地址: http://localhost:5502" 
echo -e "${BLUE}注意: 这是生产构建版本，使用serve提供静态文件服务${NC}" 
