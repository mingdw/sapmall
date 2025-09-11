#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}正在停止开发环境...${NC}"

# 停止服务
services=("nginx" "mobile-web" "desktop-web" "api-server" "mysql")
for service in "${services[@]}"; do
    echo -e "${YELLOW}停止 $service...${NC}"
    podman stop swiftx-$service 2>/dev/null || true
    podman rm swiftx-$service 2>/dev/null || true
done

echo -e "${GREEN}开发环境已停止!${NC}" 