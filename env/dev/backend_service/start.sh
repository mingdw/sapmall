#!/bin/bash

# Sapphire Mall 后端服务启动脚本
# 作者: Sapphire Mall Team
# 版本: 1.0.0
# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 设置项目根目录
# 脚本应该从项目根目录运行，所以直接使用当前目录
PROJECT_ROOT="$(pwd)"

# 检查当前目录，确定正确的后端目录路径
if [[ "$PROJECT_ROOT" == *"/env/dev/backend_service" ]]; then
    # 如果从 env/dev/backend_service 目录运行
    BACKEND_DIR="$PROJECT_ROOT/../../../backend_service"
elif [[ "$PROJECT_ROOT" == *"/env/dev" ]]; then
    # 如果从 env/dev 目录运行
    BACKEND_DIR="$PROJECT_ROOT/../../backend_service"
else
    # 如果从项目根目录运行
    BACKEND_DIR="$PROJECT_ROOT/backend_service"
fi

# 检查必要的环境变量
check_env() {
    log_info "检查环境变量..."
    
    if [ -z "$GO_VERSION" ]; then
        export GO_VERSION="1.24.3"
        log_warning "GO_VERSION 未设置，使用默认版本: $GO_VERSION"
    fi
    
    if [ -z "$APP_PORT" ]; then
        export APP_PORT="8888"
        log_warning "APP_PORT 未设置，使用默认端口: $APP_PORT"
    fi
    
    if [ -z "$CONFIG_FILE" ]; then
        export CONFIG_FILE="etc/sapmall_dev.yaml"
        log_warning "CONFIG_FILE 未设置，使用默认配置: $CONFIG_FILE"
    fi
    
    log_success "环境变量检查完成"
}

# 检查 Go 环境
check_go() {
    log_info "检查 Go 环境..."
    
    if ! command -v go &> /dev/null; then
        log_error "Go 未安装，请先安装 Go $GO_VERSION 或更高版本"
        exit 1
    fi
    
    GO_CURRENT_VERSION=$(go version | cut -d' ' -f3 | sed 's/go//')
    log_info "当前 Go 版本: $GO_CURRENT_VERSION"
    
    log_success "Go 环境检查完成"
}

# 检查依赖
check_dependencies() {
    log_info "检查项目依赖..."
    
    # 使用全局变量
    
    log_info "项目根目录: $PROJECT_ROOT"
    log_info "后端目录: $BACKEND_DIR"
    
    if [ ! -f "$BACKEND_DIR/go.mod" ]; then
        log_error "go.mod 文件不存在: $BACKEND_DIR/go.mod"
        exit 1
    fi
    
    if [ ! -f "$BACKEND_DIR/app/sapmall_start.go" ]; then
        log_error "app/sapmall_start.go 文件不存在: $BACKEND_DIR/app/sapmall_start.go"
        exit 1
    fi
    
    if [ ! -f "$BACKEND_DIR/app/$CONFIG_FILE" ]; then
        log_error "配置文件不存在: $BACKEND_DIR/app/$CONFIG_FILE"
        exit 1
    fi
    
    log_success "依赖检查完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装 Go 模块依赖..."
    
    # 使用全局变量
    
    cd "$BACKEND_DIR" || {
        log_error "无法切换到项目目录: $BACKEND_DIR"
        exit 1
    }
    
    go mod tidy
    go mod download
    
    log_success "依赖安装完成"
}

# 构建应用
build_app() {
    log_info "构建应用..."
    
    # 使用全局变量
    
    cd "$BACKEND_DIR" || {
        log_error "无法切换到项目目录: $BACKEND_DIR"
        exit 1
    }
    
    # 检查是否在容器环境中
    if [ -f "/.dockerenv" ] || [ -n "$CONTAINER" ]; then
        # 在容器环境中，构建 Linux 二进制文件
        export CGO_ENABLED=0
        export GOOS=linux
        export GOARCH=amd64
        
        go build -ldflags="-w -s" -o sapmall-server ./app/sapmall_start.go
        
        if [ $? -eq 0 ]; then
            log_success "应用构建成功"
        else
            log_error "应用构建失败"
            exit 1
        fi
    else
        # 在本地环境中，跳过构建，直接使用 go run
        log_info "本地环境，跳过构建，将使用 go run 启动"
    fi
}

# 检查端口是否被占用
check_port() {
    log_info "检查端口 $APP_PORT 是否可用..."
    
    if lsof -Pi :$APP_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "端口 $APP_PORT 已被占用"
        log_info "尝试终止占用该端口的进程..."
        
        PID=$(lsof -Pi :$APP_PORT -sTCP:LISTEN -t)
        if [ ! -z "$PID" ]; then
            kill -9 $PID
            sleep 2
            log_success "已终止占用端口的进程"
        fi
    else
        log_success "端口 $APP_PORT 可用"
    fi
}

# 启动应用
start_app() {
    log_info "启动 Sapphire Mall 后端服务..."
    
    # 使用全局变量
    
    cd "$BACKEND_DIR" || {
        log_error "无法切换到项目目录: $BACKEND_DIR"
        exit 1
    }
    
    # 设置环境变量
    export TZ=Asia/Shanghai
    export GIN_MODE=release
    
    # 启动应用
    log_info "使用配置文件: app/$CONFIG_FILE"
    log_info "服务将在端口 $APP_PORT 启动"
    log_info "Swagger UI: http://localhost:$APP_PORT/swagger-ui/"
    log_info "Swagger JSON: http://localhost:$APP_PORT/swagger.json"
    
    # 检查是否在容器环境中
    if [ -f "/.dockerenv" ] || [ -n "$CONTAINER" ]; then
        # 在容器环境中，使用构建的二进制文件
        ./sapmall-server -f app/$CONFIG_FILE -p $APP_PORT &
        APP_PID=$!
    else
        # 在本地环境中，使用 go run
        go run app/sapmall_start.go -f app/$CONFIG_FILE &
        APP_PID=$!
    fi
    
    # 等待服务启动
    sleep 3
    
    # 检查服务是否成功启动
    if kill -0 $APP_PID 2>/dev/null; then
        log_success "后端服务已启动 (PID: $APP_PID)"
        echo $APP_PID > /tmp/sapmall-backend.pid
    else
        log_error "后端服务启动失败"
        exit 1
    fi
}

# 清理函数
cleanup() {
    log_info "正在清理..."
    if [ ! -z "$APP_PID" ]; then
        kill $APP_PID 2>/dev/null || true
    fi
    log_success "清理完成"
}

# 主函数
main() {
    log_info "=========================================="
    log_info "Sapphire Mall 后端服务启动脚本"
    log_info "=========================================="
    
    # 设置信号处理
    trap cleanup EXIT INT TERM
    
    # 执行检查步骤
    check_env
    check_go
    check_dependencies
    install_dependencies
    build_app
    check_port
    
    # 启动应用
    start_app
}

# 如果直接运行此脚本
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi