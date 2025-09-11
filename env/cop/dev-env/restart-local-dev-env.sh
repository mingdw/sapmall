#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

cd $(dirname $0)

echo -e "${YELLOW}正在重启开发环境...${NC}"

# 停止服务
./stop-local-dev-env.sh

# 等待所有容器停止
sleep 4

# 启动服务
./start-local-dev-env.sh

echo -e "${GREEN}开发环境已重启!${NC}" 