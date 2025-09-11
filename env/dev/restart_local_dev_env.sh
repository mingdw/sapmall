#!/bin/bash

# Sapphire Mall 本地开发环境重启脚本

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}正在重启 Sapphire Mall 开发环境...${NC}"

# 先停止所有服务
echo -e "${YELLOW}停止现有服务...${NC}"
./stop_local_dev_env.sh

# 等待一下确保容器完全停止
sleep 2

# 重新启动服务
echo -e "${YELLOW}重新启动服务...${NC}"
./start_local_dev_env.sh

echo -e "${GREEN}开发环境重启完成!${NC}"
