#!/bin/bash
cd $(dirname $0)

# 项目根目录（从当前脚本的位置上一级目录）
PROJECT_ROOT=$(cd .. && cd .. && pwd)
SCRIPT_DIR=$(pwd)
LOG_FILE="$SCRIPT_DIR/auto-deploy.log"

echo "自动部署服务启动，项目根目录: $PROJECT_ROOT" | tee -a "$LOG_FILE"
echo "脚本将每5分钟检查一次更新" | tee -a "$LOG_FILE"

# 确保我们在项目根目录下操作git
cd $PROJECT_ROOT

# 获取当前分支名称
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "当前分支: $CURRENT_BRANCH" | tee -a "$LOG_FILE"

# 记录上一次的commit hash
LAST_COMMIT=$(git rev-parse HEAD)

while true; do
    echo "$(date): 检查git更新..." | tee -a "$LOG_FILE"
    
    # 先获取远程更新信息（当前分支）
    git fetch origin $CURRENT_BRANCH
    
    # 获取最新的commit hash
    LATEST_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH)
    
    # 比较两个commit hash是否相同
    if [ "$LAST_COMMIT" != "$LATEST_COMMIT" ]; then
        echo "$(date): 发现新更新，从 $LAST_COMMIT 到 $LATEST_COMMIT" | tee -a "$LOG_FILE"
        
        # 拉取最新代码（当前分支）
        echo "$(date): 拉取最新代码..." | tee -a "$LOG_FILE"
        git pull origin $CURRENT_BRANCH
        
        # 更新LAST_COMMIT
        LAST_COMMIT=$LATEST_COMMIT
        
        # 切换回脚本目录执行重启脚本
        cd $SCRIPT_DIR
        echo "$(date): 重启服务..." | tee -a "$LOG_FILE"
        bash ./restart-local-dev-env.sh
        
        # 切换回项目根目录继续监控
        cd $PROJECT_ROOT
        
        echo "$(date): 部署完成" | tee -a "$LOG_FILE"
    else
        echo "$(date): 没有发现新更新" | tee -a "$LOG_FILE"
    fi
    
    # 休眠5分钟
    echo "$(date): 等待5分钟后再次检查..." | tee -a "$LOG_FILE"
    sleep 300
done

