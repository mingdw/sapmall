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
cd project/mobile-web
npm install
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}React应用构建失败!${NC}"
    exit 1
fi
cd ../../

# 删除已有容器和镜像
echo -e "${YELLOW}正在删除已有的Mobile Web容器和镜像...${NC}"
podman rm -f swiftx-mobile-web 2>/dev/null || true
podman rmi swiftx-mobile-web 2>/dev/null || true

# 构建Mobile Web镜像
echo -e "${YELLOW}构建Mobile Web镜像...${NC}"
echo -e "${BLUE}使用本地预构建的build目录...${NC}"

# 构建镜像
podman build -t swiftx-mobile-web -f env/dev-env/mobile-web/Dockerfile .

# 检查镜像是否构建成功
if [ $? -ne 0 ]; then
    echo -e "${RED}Mobile Web镜像构建失败!${NC}"
    exit 1
fi

# 切回原目录
cd $cwd

# 启动Mobile Web容器
echo -e "${YELLOW}启动Mobile Web容器...${NC}"
podman run -d \
    --name swiftx-mobile-web \
    -p 5202:5202 \
    swiftx-mobile-web

if [ $? -ne 0 ]; then
    echo -e "${RED}Mobile Web容器启动失败!${NC}"
    exit 1
fi
    
echo -e "${GREEN}Mobile Web启动成功!${NC}"

echo -e "${YELLOW}Mobile Web服务信息:${NC}"
echo -e "访问地址: http://localhost:5202"
echo -e "${BLUE}注意: 这是生产构建版本，使用serve提供静态文件服务${NC}" 
