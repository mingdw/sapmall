#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

cd $(dirname $0)
cwd=$(pwd)

# 设置变量
CONTAINER_NAME="swiftx-mysql"
SLOW_LOG_FILE="/var/log/mysql/slow.log"
LOCAL_LOG_DIR="$cwd/logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOCAL_LOG_FILE="$LOCAL_LOG_DIR/slow_query_${TIMESTAMP}.log"

echo -e "${YELLOW}MySQL慢查询日志拷贝工具${NC}"

# 检查Podman是否安装
if ! command -v podman &> /dev/null; then
    echo -e "${RED}错误: Podman未安装. 请先安装Podman.${NC}"
    exit 1
fi

# 检查MySQL容器是否正在运行
if ! podman ps --format "table {{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    echo -e "${RED}错误: MySQL容器 '$CONTAINER_NAME' 未运行.${NC}"
    echo -e "${YELLOW}提示: 请先运行 ./start.sh 启动MySQL容器.${NC}"
    exit 1
fi

# 创建本地日志目录
mkdir -p "$LOCAL_LOG_DIR"

# 检查容器中是否存在慢查询日志文件
echo -e "${YELLOW}检查容器中的慢查询日志...${NC}"
if ! podman exec "$CONTAINER_NAME" test -f "$SLOW_LOG_FILE"; then
    echo -e "${RED}错误: 容器中未找到慢查询日志文件: $SLOW_LOG_FILE${NC}"
    echo -e "${YELLOW}提示: 慢查询日志可能尚未生成，或者配置未正确启用.${NC}"
    
    # 显示慢查询日志相关的配置信息
    echo -e "${YELLOW}当前慢查询日志配置:${NC}"
    podman exec "$CONTAINER_NAME" mysql --no-defaults -uroot -pmy-secret-pw -e "SHOW VARIABLES LIKE 'slow_query%'; SHOW VARIABLES LIKE 'long_query_time';"
    exit 1
fi

# 检查日志文件大小
LOG_SIZE=$(podman exec "$CONTAINER_NAME" stat -c%s "$SLOW_LOG_FILE" 2>/dev/null || echo "0")
if [ "$LOG_SIZE" -eq "0" ]; then
    echo -e "${YELLOW}警告: 慢查询日志文件为空，可能暂时没有慢查询记录.${NC}"
    echo -e "${YELLOW}当前慢查询日志配置:${NC}"
    podman exec "$CONTAINER_NAME" mysql --no-defaults -uroot -pmy-secret-pw -e "SHOW VARIABLES LIKE 'slow_query%'; SHOW VARIABLES LIKE 'long_query_time';"
    
    # 仍然继续拷贝空文件
    echo -e "${YELLOW}仍然拷贝空的日志文件...${NC}"
fi

# 拷贝慢查询日志文件
echo -e "${YELLOW}拷贝慢查询日志文件...${NC}"
if podman cp "$CONTAINER_NAME:$SLOW_LOG_FILE" "$LOCAL_LOG_FILE"; then
    echo -e "${GREEN}成功拷贝慢查询日志!${NC}"
    echo -e "${YELLOW}本地文件位置: $LOCAL_LOG_FILE${NC}"
    
    # 显示日志文件大小
    LOCAL_SIZE=$(stat -c%s "$LOCAL_LOG_FILE" 2>/dev/null || echo "0")
    echo -e "${YELLOW}日志文件大小: $LOCAL_SIZE 字节${NC}"
    
    # 如果文件不为空，显示最后几行
    if [ "$LOCAL_SIZE" -gt "0" ]; then
        echo -e "${YELLOW}日志文件最后10行:${NC}"
        echo -e "${GREEN}----------------------------------------${NC}"
        tail -10 "$LOCAL_LOG_FILE"
        echo -e "${GREEN}----------------------------------------${NC}"
    fi
    
    echo -e "${GREEN}拷贝完成!${NC}"
else
    echo -e "${RED}拷贝慢查询日志失败!${NC}"
    exit 1
fi

# 显示一些有用的信息
echo -e "${YELLOW}慢查询日志相关信息:${NC}"
echo -e "容器名称: $CONTAINER_NAME"
echo -e "容器内日志文件: $SLOW_LOG_FILE"
echo -e "本地日志文件: $LOCAL_LOG_FILE"
echo -e "本地日志目录: $LOCAL_LOG_DIR"

# 显示慢查询相关的统计信息
echo -e "${YELLOW}慢查询统计信息:${NC}"
podman exec "$CONTAINER_NAME" mysql --no-defaults -uroot -pmy-secret-pw -e "SHOW GLOBAL STATUS LIKE 'Slow_queries';"

echo -e "${GREEN}提示: 您可以使用 'mysqldumpslow' 工具来分析慢查询日志.${NC}"
echo -e "${GREEN}例如: mysqldumpslow -s c -t 10 '$LOCAL_LOG_FILE'${NC}" 