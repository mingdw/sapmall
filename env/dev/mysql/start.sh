ocker#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

cd $(dirname $0)
cwd=$(pwd)

echo -e "${YELLOW}正在设置MySQL数据库...${NC}"

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
CONTAINER_NAME="sapmall-mysql"
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD="root123456"
MYSQL_DATABASE="sapphire_mall"

# 检查MySQL容器是否已经运行
if [ "$($CONTAINER_RUNTIME ps -aq -f name=$CONTAINER_NAME)" ]; then
    # 容器存在但未运行，删除它
    echo -e "${YELLOW}删除已存在但未运行的MySQL容器...${NC}"
    $CONTAINER_RUNTIME stop $CONTAINER_NAME
    $CONTAINER_RUNTIME rm $CONTAINER_NAME
fi

# 使用项目中的 init_data.sql 文件
PROJECT_ROOT="$(cd "$cwd/../../.." && pwd)"
INIT_DATA_FILE="$PROJECT_ROOT/backend_service/docs/init_data.sql"

if [ ! -f "$INIT_DATA_FILE" ]; then
    echo -e "${RED}错误: init_data.sql 文件不存在: $INIT_DATA_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}找到数据库初始化文件: $INIT_DATA_FILE${NC}"

# 构建MySQL镜像
echo -e "${YELLOW}构建MySQL镜像...${NC}"
$CONTAINER_RUNTIME build -t sapmall-mysql .

if [ $? -ne 0 ]; then
    echo -e "${RED}MySQL镜像构建失败!${NC}"
    exit 1
fi

# 创建并启动新容器
echo -e "${YELLOW}创建并启动新的MySQL容器...${NC}"
$CONTAINER_RUNTIME run --name $CONTAINER_NAME \
    -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
    -e MYSQL_DATABASE=$MYSQL_DATABASE \
    -e LANG=C.UTF-8 \
    -p $MYSQL_PORT:3306 \
    -d sapmall-mysql \
    --default-authentication-plugin=mysql_native_password

if [ $? -ne 0 ]; then
    echo -e "${RED}MySQL容器启动失败!${NC}"
    exit 1
fi

# 等待MySQL启动和配置初始化
echo -e "${YELLOW}等待MySQL启动和初始化完成...${NC}"
MAX_TRIES=30
COUNTER=0
while true; do
    if $CONTAINER_RUNTIME exec $CONTAINER_NAME mysqladmin -uroot "-p${MYSQL_ROOT_PASSWORD}" ping &> /dev/null; then
        if $CONTAINER_RUNTIME exec $CONTAINER_NAME mysql -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "SELECT 1;" &> /dev/null; then
            break
        fi
    fi
    
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -ge $MAX_TRIES ]; then
        echo -e "${RED}MySQL启动超时，正在检查容器日志...${NC}"
        $CONTAINER_RUNTIME logs $CONTAINER_NAME
        exit 1
    fi
    echo -e "${YELLOW}等待MySQL启动... (${COUNTER}/${MAX_TRIES})${NC}"
    sleep 3
done

echo -e "${GREEN}MySQL数据库已成功设置并运行在端口 $MYSQL_PORT${NC}"

# 配置root权限
echo -e "${YELLOW}配置MySQL权限...${NC}"
$CONTAINER_RUNTIME exec $CONTAINER_NAME mysql -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';" || true
$CONTAINER_RUNTIME exec $CONTAINER_NAME mysql -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';" || true
$CONTAINER_RUNTIME exec $CONTAINER_NAME mysql -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;" || true
$CONTAINER_RUNTIME exec $CONTAINER_NAME mysql -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;" || true

# 检查数据库是否已经初始化
echo -e "${YELLOW}检查数据库是否已初始化...${NC}"
TABLES_COUNT=$($CONTAINER_RUNTIME exec $CONTAINER_NAME mysql -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$MYSQL_DATABASE';" 2>/dev/null | grep -v "COUNT" | tr -d " " || echo "0")

if [ -z "$TABLES_COUNT" ] || ! [[ "$TABLES_COUNT" =~ ^[0-9]+$ ]]; then
    echo -e "${YELLOW}获取表数量失败，假设为0${NC}"
    TABLES_COUNT=0
fi

echo -e "${YELLOW}数据库表数量: $TABLES_COUNT${NC}"

if [ "$TABLES_COUNT" -eq "0" ]; then
    # 创建数据库架构
    echo -e "${YELLOW}创建数据库架构...${NC}"
    
    # 将 init_data.sql 文件复制到容器中
    echo -e "${YELLOW}将 init_data.sql 文件复制到容器...${NC}"
    $CONTAINER_RUNTIME cp "$INIT_DATA_FILE" $CONTAINER_NAME:/tmp/init_data.sql

    # 应用数据库初始化脚本
    echo -e "${YELLOW}应用数据库初始化脚本...${NC}"
    if $CONTAINER_RUNTIME exec $CONTAINER_NAME mysql -uroot "-p${MYSQL_ROOT_PASSWORD}" $MYSQL_DATABASE -e "source /tmp/init_data.sql"; then
        echo -e "${GREEN}数据库初始化脚本已成功应用!${NC}"
    else
        echo -e "${RED}应用数据库初始化脚本时出错.${NC}"
        exit 1
    fi

    # 清理临时文件
    $CONTAINER_RUNTIME exec $CONTAINER_NAME rm /tmp/init_data.sql

    echo -e "${GREEN}数据库初始化完成!${NC}"
else
    echo -e "${GREEN}数据库已经初始化，跳过初始化步骤.${NC}"
fi

echo -e "${GREEN}MySQL数据库设置完成!${NC}"
echo -e "${YELLOW}连接信息:${NC}"
echo -e "主机: localhost"
echo -e "端口: $MYSQL_PORT"
echo -e "用户名: root"
echo -e "密码: $MYSQL_ROOT_PASSWORD"
echo -e "数据库: $MYSQL_DATABASE"
