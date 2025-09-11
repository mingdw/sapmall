#!/bin/bash

# Sapphire Mall 本地开发环境停止脚本

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 检查容器运行时
if command -v podman &> /dev/null; then
    CONTAINER_RUNTIME="podman"
elif command -v docker &> /dev/null; then
    CONTAINER_RUNTIME="docker"
else
    echo -e "${RED}错误: 未找到容器运行时.${NC}"
    exit 1
fi

echo -e "${YELLOW}正在停止 Sapphire Mall 开发环境...${NC}"

# 停止后端服务进程
echo -e "${YELLOW}检查并停止后端服务进程...${NC}"

# 方法1: 通过PID文件停止
if [ -f "/tmp/sapmall-backend.pid" ]; then
    BACKEND_PID=$(cat /tmp/sapmall-backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${YELLOW}停止后端服务进程 (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID
        sleep 2
        if kill -0 $BACKEND_PID 2>/dev/null; then
            echo -e "${YELLOW}强制终止后端服务进程...${NC}"
            kill -9 $BACKEND_PID
        fi
        echo -e "${GREEN}后端服务进程已停止${NC}"
    else
        echo -e "${YELLOW}后端服务进程未运行${NC}"
    fi
    rm -f /tmp/sapmall-backend.pid
else
    echo -e "${YELLOW}后端服务PID文件不存在，检查端口8888...${NC}"
fi

# 方法2: 通过端口8888查找并停止进程
PORT_PIDS=$(lsof -ti:8888 2>/dev/null)
if [ -n "$PORT_PIDS" ]; then
    echo -e "${YELLOW}发现端口8888上的进程: $PORT_PIDS${NC}"
    for pid in $PORT_PIDS; do
        # 检查进程是否是后端服务（包括编译后的二进制文件）
        PROCESS_CMD=$(ps -p $pid -o command= 2>/dev/null)
        if echo "$PROCESS_CMD" | grep -q "sapmall_start.go\|sapmall-server\|sapmall_start\|sapmall.*-f.*sapmall_dev.yaml"; then
            echo -e "${YELLOW}停止后端服务进程 (PID: $pid): $PROCESS_CMD${NC}"
            kill $pid
            sleep 2
            if kill -0 $pid 2>/dev/null; then
                echo -e "${YELLOW}强制终止后端服务进程 (PID: $pid)...${NC}"
                kill -9 $pid
            fi
            echo -e "${GREEN}后端服务进程 (PID: $pid) 已停止${NC}"
        else
            echo -e "${YELLOW}跳过非后端服务进程 (PID: $pid): $PROCESS_CMD${NC}"
        fi
    done
else
    echo -e "${YELLOW}端口8888上没有后端服务进程${NC}"
fi

# 方法3: 通过进程名查找并停止所有相关进程
GO_PROCESSES=$(ps aux | grep "go run.*sapmall_start.go" | grep -v grep | awk '{print $2}')
if [ -n "$GO_PROCESSES" ]; then
    echo -e "${YELLOW}发现go run sapmall_start.go进程: $GO_PROCESSES${NC}"
    for pid in $GO_PROCESSES; do
        echo -e "${YELLOW}停止go run进程 (PID: $pid)...${NC}"
        kill $pid
        sleep 2
        if kill -0 $pid 2>/dev/null; then
            echo -e "${YELLOW}强制终止go run进程 (PID: $pid)...${NC}"
            kill -9 $pid
        fi
        echo -e "${GREEN}go run进程 (PID: $pid) 已停止${NC}"
    done
else
    echo -e "${YELLOW}没有发现go run sapmall_start.go进程${NC}"
fi

# 停止后端服务容器
if [ "$($CONTAINER_RUNTIME ps -aq -f name=sapmall-backend_service)" ]; then
    echo -e "${YELLOW}停止后端服务容器...${NC}"
    $CONTAINER_RUNTIME stop sapmall-backend_service
    $CONTAINER_RUNTIME rm sapmall-backend_service
    echo -e "${GREEN}后端服务容器已停止${NC}"
else
    echo -e "${YELLOW}后端服务容器不存在${NC}"
fi

# 停止MySQL容器
if [ "$($CONTAINER_RUNTIME ps -aq -f name=sapmall-mysql)" ]; then
    echo -e "${YELLOW}停止MySQL容器...${NC}"
    $CONTAINER_RUNTIME stop sapmall-mysql
    $CONTAINER_RUNTIME rm sapmall-mysql
    echo -e "${GREEN}MySQL容器已停止${NC}"
else
    echo -e "${YELLOW}MySQL容器不存在${NC}"
fi

# 停止Redis容器
if [ "$($CONTAINER_RUNTIME ps -aq -f name=sapmall-redis)" ]; then
    echo -e "${YELLOW}停止Redis容器...${NC}"
    $CONTAINER_RUNTIME stop sapmall-redis
    $CONTAINER_RUNTIME rm sapmall-redis
    echo -e "${GREEN}Redis容器已停止${NC}"
else
    echo -e "${YELLOW}Redis容器不存在${NC}"
fi

# 停止etcd容器
if [ "$($CONTAINER_RUNTIME ps -aq -f name=sapmall-etcd)" ]; then
    echo -e "${YELLOW}停止etcd容器...${NC}"
    $CONTAINER_RUNTIME stop sapmall-etcd
    $CONTAINER_RUNTIME rm sapmall-etcd
    echo -e "${GREEN}etcd容器已停止${NC}"
else
    echo -e "${YELLOW}etcd容器不存在${NC}"
fi

# 停止管理后台容器
if [ "$($CONTAINER_RUNTIME ps -aq -f name=sapmall-admin)" ]; then
    echo -e "${YELLOW}停止管理后台容器...${NC}"
    $CONTAINER_RUNTIME stop sapmall-admin
    $CONTAINER_RUNTIME rm sapmall-admin
    echo -e "${GREEN}管理后台容器已停止${NC}"
else
    echo -e "${YELLOW}管理后台容器不存在${NC}"
fi

# 停止DApp应用容器
if [ "$($CONTAINER_RUNTIME ps -aq -f name=sapmall-dapp)" ]; then
    echo -e "${YELLOW}停止DApp应用容器...${NC}"
    $CONTAINER_RUNTIME stop sapmall-dapp
    $CONTAINER_RUNTIME rm sapmall-dapp
    echo -e "${GREEN}DApp应用容器已停止${NC}"
else
    echo -e "${YELLOW}DApp应用容器不存在${NC}"
fi

# 停止官网首页容器
if [ "$($CONTAINER_RUNTIME ps -aq -f name=sapmall-website)" ]; then
    echo -e "${YELLOW}停止官网首页容器...${NC}"
    $CONTAINER_RUNTIME stop sapmall-website
    $CONTAINER_RUNTIME rm sapmall-website
    echo -e "${GREEN}官网首页容器已停止${NC}"
else
    echo -e "${YELLOW}官网首页容器不存在${NC}"
fi

# op    

if [ "$($CONTAINER_RUNTIME ps -aq -f name=sapmall-nginx)" ]; then
    echo -e "${YELLOW}停止Nginx代理容器...${NC}"
    $CONTAINER_RUNTIME stop sapmall-nginx
    $CONTAINER_RUNTIME rm sapmall-nginx
    echo -e "${GREEN}Nginx代理容器已停止${NC}"
else
    echo -e "${YELLOW}Nginx代理容器不存在${NC}"
fi

echo -e "${GREEN}开发环境已停止!${NC}"
