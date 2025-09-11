#!/bin/bash  

# 设置颜色输出  
GREEN='\033[0;32m'  
RED='\033[0;31m'  
YELLOW='\033[0;33m'  
NC='\033[0m' # No Color  

cd $(dirname $0)  
cwd=$(pwd)  

# 获取脚本目录  
SCRIPT_DIR=$cwd  

echo -e "${YELLOW}正在设置MySQL数据库...${NC}"  

# 检查Podman是否安装  
if ! command -v podman &> /dev/null; then  
    echo -e "${RED}错误: Podman未安装. 请先安装Podman.${NC}"  
    exit 1  
fi  

# 设置变量  
CONTAINER_NAME="swiftx-mysql"  
MYSQL_PORT=5401  
MYSQL_ROOT_PASSWORD="my-secret-pw"  
MYSQL_DATABASE="swiftx"  

# 检查MySQL容器是否已经运行  
if [ "$(podman ps -aq -f name=$CONTAINER_NAME)" ]; then  
    # 容器存在但未运行，删除它  
    echo -e "${YELLOW}删除已存在但未运行的MySQL容器...${NC}"  
    podman stop $CONTAINER_NAME  
    podman rm $CONTAINER_NAME  
fi  

# 确保schema和seed文件存在  
SCHEMA_FILE="$SCRIPT_DIR/schema.sql"  
SEED_FILE="$SCRIPT_DIR/seed_data.sql"  

if [ ! -f "$SCHEMA_FILE" ]; then  
    echo -e "${RED}错误: Schema文件不存在: $SCHEMA_FILE${NC}"  
    exit 1  
fi  

if [ ! -f "$SEED_FILE" ]; then  
    echo -e "${RED}错误: Seed文件不存在: $SEED_FILE${NC}"  
    exit 1  
fi  

# 构建MySQL镜像  
echo -e "${YELLOW}构建MySQL镜像...${NC}"  
podman build -t swiftx-mysql .  

if [ $? -ne 0 ]; then  
    echo -e "${RED}MySQL镜像构建失败!${NC}"  
    exit 1  
fi  

# 创建并启动新容器  
echo -e "${YELLOW}创建并启动新的MySQL容器...(使用mysql_native_password认证)${NC}"  
podman run --name $CONTAINER_NAME \
    -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
    -e MYSQL_DATABASE=$MYSQL_DATABASE \
    -e MYSQL_TCP_PORT=$MYSQL_PORT \
    -e LANG=C.UTF-8 \
    -p $MYSQL_PORT:$MYSQL_PORT \
    -d swiftx-mysql \
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
    # 使用--no-defaults确保只使用指定的参数  
    if podman exec $CONTAINER_NAME mysqladmin --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" ping &> /dev/null; then  
        # 尝试进行一个简单查询以确认完全可用  
        if podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "SELECT 1;" &> /dev/null; then  
            break  # 完全准备好了  
        fi  
    fi  
    
    COUNTER=$((COUNTER+1))  
    if [ $COUNTER -ge $MAX_TRIES ]; then  
        echo -e "${RED}MySQL启动超时，正在检查容器日志...${NC}"  
        podman logs $CONTAINER_NAME  
        exit 1  
    fi  
    echo -e "${YELLOW}等待MySQL启动... (${COUNTER}/${MAX_TRIES})${NC}"  
    sleep 3  
done  

echo -e "${GREEN}MySQL数据库已成功设置并运行在端口 $MYSQL_PORT${NC}"  

# 配置root权限 - 解决访问问题  
echo -e "${YELLOW}配置MySQL权限...${NC}"  
podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';" || true  
podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';" || true  
podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;" || true  
podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;" || true  

# 检查数据库是否已经初始化，使用更健壮的方法  
echo -e "${YELLOW}检查数据库是否已初始化...${NC}"  
TABLES_COUNT=$(podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$MYSQL_DATABASE';" 2>/dev/null | grep -v "COUNT" | tr -d " " || echo "0")  

# 防止空变量  
if [ -z "$TABLES_COUNT" ] || ! [[ "$TABLES_COUNT" =~ ^[0-9]+$ ]]; then  
    echo -e "${YELLOW}获取表数量失败，假设为0${NC}"  
    TABLES_COUNT=0  
fi  

echo -e "${YELLOW}数据库表数量: $TABLES_COUNT${NC}"  

if [ "$TABLES_COUNT" -eq "0" ]; then  
    # 创建数据库架构  
    echo -e "${YELLOW}创建数据库架构...${NC}"  
    SCHEMA_FILE="$SCRIPT_DIR/schema.sql"  

    # 将schema文件复制到容器中  
    echo -e "${YELLOW}将schema文件复制到容器...${NC}"  
    podman cp "$SCHEMA_FILE" $CONTAINER_NAME:/tmp/schema.sql  

    # 应用schema  
    echo -e "${YELLOW}应用数据库架构...${NC}"  
    if podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" $MYSQL_DATABASE -e "source /tmp/schema.sql"; then  
        echo -e "${GREEN}数据库架构已成功应用!${NC}"  
    else  
        echo -e "${RED}应用数据库架构时出错.${NC}"  
        exit 1  
    fi  

        # 导入初始数据
    echo -e "${YELLOW}导入初始数据...${NC}"
    SEED_FILE="$SCRIPT_DIR/seed_data.sql"

    # 将seed文件复制到容器中
    echo -e "${YELLOW}将seed文件复制到容器...${NC}"
    podman cp "$SEED_FILE" $CONTAINER_NAME:/tmp/seed.sql

    # 应用seed数据
    echo -e "${YELLOW}导入初始数据...${NC}"
    if podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" $MYSQL_DATABASE -e "source /tmp/seed.sql"; then
        echo -e "${GREEN}初始数据已成功导入!${NC}"
    else
        echo -e "${RED}导入初始数据时出错.${NC}"
        exit 1
    fi

    # 导入zipcode数据（如果存在）
    ZIPCODE_FILE="$SCRIPT_DIR/seed_data_zipcode.sql"
    if [ -f "$ZIPCODE_FILE" ]; then
        echo -e "${YELLOW}导入zipcode数据...${NC}"
        podman cp "$ZIPCODE_FILE" $CONTAINER_NAME:/tmp/zipcode.sql
        if podman exec $CONTAINER_NAME mysql --no-defaults -uroot "-p${MYSQL_ROOT_PASSWORD}" $MYSQL_DATABASE -e "source /tmp/zipcode.sql"; then
            echo -e "${GREEN}zipcode数据已成功导入!${NC}"
        else
            echo -e "${RED}导入zipcode数据时出错.${NC}"
            exit 1
        fi
        # 清理临时文件
        podman exec $CONTAINER_NAME rm /tmp/schema.sql /tmp/seed.sql /tmp/zipcode.sql
    else
        # 清理临时文件
        podman exec $CONTAINER_NAME rm /tmp/schema.sql /tmp/seed.sql
    fi

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
