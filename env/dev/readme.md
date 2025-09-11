# SapMall 本地开发环境

## 🚀 快速启动

### 方式一：完整容器环境（推荐用于生产测试）
```bash
cd /Users/ming-mac/Desktop/workspace/sapmall/env/dev
./start_local_dev_env.sh
```

### 方式二：本地开发环境（推荐用于开发调试）
```bash
cd /Users/ming-mac/Desktop/workspace/sapmall/env/dev
./start_local_dev.sh
```

## 📋 服务说明

### 基础服务
- **MySQL**: 数据库服务 (端口 3306)
- **Redis**: 缓存服务 (端口 6379)
- **etcd**: 配置中心 (端口 2379)
- **后端服务**: API服务 (端口 8888)
- **Nginx**: 反向代理 (端口 8080)

### 前端服务
- **管理后台**: React应用 (端口 3004)
- **DApp应用**: Next.js应用 (端口 3005)
- **官网首页**: React应用 (端口 3006)

## 🌐 访问地址

### 统一入口（通过Nginx代理）
- **主入口**: http://localhost:8080
- **管理后台**: http://localhost:8080/admin/
- **DApp应用**: http://localhost:8080/dapp/
- **官网首页**: http://localhost:8080/
- **后端API**: http://localhost:8080/api/
- **Swagger UI**: http://localhost:8080/swagger-ui/

### 直接访问（绕过Nginx）
- **管理后台**: http://localhost:3004
- **DApp应用**: http://localhost:3005
- **官网首页**: http://localhost:3006
- **后端API**: http://localhost:8888/api/

## 🔧 管理命令

### 启动服务
```bash
# 启动完整环境（容器+前端）
./start_local_dev.sh

# 启动容器环境
./start_local_dev_env.sh
```

### 停止服务
```bash
# 停止本地开发环境
./stop_local_dev.sh

# 停止容器环境
./stop_local_dev_env.sh
```

### 重启服务
```bash
# 重启本地开发环境
./restart_local_dev.sh

# 重启容器环境
./restart_local_dev_env.sh
```

### 查看日志
```bash
# 查看Nginx日志
podman logs -f sapmall-nginx

# 查看后端服务日志
podman logs -f sapmall-backend_service

# 查看MySQL日志
podman logs -f sapmall-mysql
```

## 🔄 智能路由

Nginx 配置了智能路由规则：

1. **容器优先**: 优先访问容器实例
2. **本地备份**: 当容器不可用时，自动切换到本地开发实例
3. **无缝切换**: 无需修改代码，自动检测服务可用性

### 路由规则
- `http://localhost:8080/admin/` → 管理后台
- `http://localhost:8080/dapp/` → DApp应用
- `http://localhost:8080/` → 官网首页
- `http://localhost:8080/api/` → 后端API

## 🛠️ 开发模式

### 本地开发
1. 启动基础服务：`./start_local_dev.sh`
2. 前端服务会自动启动
3. 修改代码后自动热重载
4. 通过 nginx 代理访问所有服务

### 容器开发
1. 启动容器环境：`./start_local_dev_env.sh`
2. 所有服务在容器中运行
3. 适合测试生产环境配置

## 📁 项目结构

```
env/dev/
├── start_local_dev.sh          # 本地开发环境启动脚本
├── stop_local_dev.sh           # 本地开发环境停止脚本
├── restart_local_dev.sh        # 本地开发环境重启脚本
├── start_local_dev_env.sh      # 容器环境启动脚本
├── stop_local_dev_env.sh       # 容器环境停止脚本
├── restart_local_dev_env.sh    # 容器环境重启脚本
├── mysql/                      # MySQL服务
├── redis/                      # Redis服务
├── etcd/                       # etcd服务
├── backend_service/            # 后端服务
├── nginx/                      # Nginx代理
├── sapmall-admin/              # 管理后台容器
├── sapmall-dapp/               # DApp应用容器
└── sapmall-website/            # 官网首页容器
```

## ⚠️ 注意事项

1. **端口冲突**: 确保端口 3004-3006, 8080, 8888, 3306, 6379, 2379 未被占用
2. **Node.js版本**: 建议使用 Node.js 18+
3. **容器运行时**: 支持 Docker 或 Podman
4. **权限问题**: 某些端口可能需要管理员权限

## 🐛 故障排除

### 端口被占用
```bash
# 查看端口占用
lsof -i :3004
lsof -i :8080

# 停止占用进程
kill -9 <PID>
```

### 容器启动失败
```bash
# 查看容器日志
podman logs sapmall-nginx

# 重新构建镜像
podman build -t sapmall-nginx ./nginx/
```

### 前端服务启动失败
```bash
# 检查Node.js版本
node --version

# 清理依赖重新安装
rm -rf node_modules package-lock.json
npm install
```