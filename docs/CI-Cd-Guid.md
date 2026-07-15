# SAP Mall CI/CD 实践指南

## 概述

本文档描述 SAP Mall 项目基于 GitHub Actions 的 CI/CD 自动部署实践方案，适用于 CentOS 服务器环境。

## 架构概览

```
GitHub 仓库
    │
    ├── 手动触发 ──→ GitHub Actions CI/CD
    │                    │
    │                    ├── 1. 构建前端 (React x3)
    │                    ├── 2. 构建后端 (Go)
    │                    ├── 3. 上传构建产物
    │                    └── 4. SSH 部署到服务器
    │
    └── CentOS 目标服务器
         ├── /opt/sapmall/
         │   ├── backend_service/
         │   │   └── main            (Go 二进制)
         │   ├── web_client/
         │   │   ├── sapmall-admin/build/   (管理后台)
         │   │   ├── sapmall-dapp/build/    (DApp)
         │   │   └── sapmall-website/build/ (官网)
         │   ├── backup/             (版本备份)
         │   └── logs/               (日志)
         └── systemd services
             ├── sapmall-backend
             └── nginx
```

## 工作流文件

### CI 工作流：`.github/workflows/ci.yml`

| 配置项 | 说明 |
|--------|------|
| 工作流名称 | CI |
| 触发方式 | PR 到 main / Push 到 main |
| 运行环境 | `ubuntu-latest` (GitHub 托管) |

**功能**：
- 并行检查 3 个前端应用构建
- 后端 Go 代码检查和构建验证
- 自动触发，无需手动操作

### 部署工作流：`.github/workflows/deploy-prod.yml`

| 配置项 | 说明 |
|--------|------|
| 工作流名称 | Deploy Production |
| 触发方式 | `workflow_dispatch` (手动触发) |
| 运行环境 | `ubuntu-latest` (GitHub 托管) |
| Node.js 版本 | 20 |
| Go 版本 | 1.23 |
| 构建产物保留 | 7 天 |

## 项目结构与构建

### 前端应用

| 应用 | 源码路径 | 服务器路径 | 构建命令 | 端口 |
|------|----------|------------|----------|------|
| 管理后台 | `web_client/sapmall-admin/` | `/opt/sapmall/web_client/sapmall-admin/build/` | `npm ci && npm run build` | 7101 |
| DApp | `web_client/sapmall-dapp/` | `/opt/sapmall/web_client/sapmall-dapp/build/` | `npm ci && npm run build` | 7102 |
| 官网 | `web_client/sapmall-website/` | `/opt/sapmall/web_client/sapmall-website/build/` | `npm ci && npm run build` | 7103 |

### 后端服务

| 配置项 | 值 |
|--------|-----|
| 语言 | Go 1.23 |
| 模块名 | `sapphire-mall` |
| 框架 | go-zero |
| 构建命令 | `CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o main ./app/sapmall_start.go` |
| 入口文件 | `backend_service/app/sapmall_start.go` |
| 服务器路径 | `/opt/sapmall/backend_service/main` |
| 默认端口 | 8888 |

## GitHub Secrets 配置

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 中添加：

| Secret 名称 | 说明 | 示例 |
|-------------|------|------|
| `SERVER_HOST` | 服务器 IP 地址 | `103.210.238.209` |
| `SERVER_USER` | SSH 用户名 | `sapmall` |
| `SERVER_PORT` | SSH 端口 | `22` |
| `SERVER_PASSWORD` | SSH 密码 | `your-password` |

### 配置步骤

1. 登录 GitHub，进入仓库页面
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 依次添加上述 4 个 Secrets

## 服务器端配置

### 1. 目录结构

服务器上的实际目录结构：

```
/opt/sapmall/
├── backend_service/
│   ├── app/                    # 后端源码（可选）
│   └── main                    # 后端二进制文件
├── web_client/
│   ├── sapmall-admin/
│   │   └── build/              # 管理后台静态文件
│   ├── sapmall-dapp/
│   │   └── build/              # DApp 静态文件
│   └── sapmall-website/
│       └── build/              # 官网静态文件
├── backup/                     # 版本备份目录
├── logs/                       # 日志目录
└── nginx.conf.production       # Nginx 配置文件
```

### 2. Systemd 服务

创建 `/etc/systemd/system/sapmall-backend.service`：

```ini
[Unit]
Description=SAP Mall Backend Service
After=network.target mysql.service redis.service

[Service]
Type=simple
User=sapmall
Group=sapmall
WorkingDirectory=/opt/sapmall/backend_service
ExecStart=/opt/sapmall/backend_service/main -f /opt/sapmall/config/sapmall_prod.yaml
Restart=always
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

启用服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable sapmall-backend
sudo systemctl start sapmall-backend
```

### 3. Nginx 配置

Nginx 配置文件位于 `/opt/sapmall/nginx.conf.production`，主要配置：

```nginx
# 管理后台 (端口 7101)
server {
    listen 7101;
    location / {
        alias /opt/sapmall/web_client/sapmall-admin/build/;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8888;
    }
}

# DApp (端口 7102)
server {
    listen 7102;
    location / {
        alias /opt/sapmall/web_client/sapmall-dapp/build/;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8888;
    }
}

# 官网 (端口 7103)
server {
    listen 7103;
    location / {
        alias /opt/sapmall/web_client/sapmall-website/build/;
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8888;
    }
}
```

## 部署流程

### 触发部署

1. 登录 GitHub，进入仓库 **Actions** 页面
2. 选择 **Deploy Production** 工作流
3. 点击 **Run workflow**
4. 选择 `main` 分支
5. 点击 **Run workflow** 确认

### 部署过程详解

```
┌─────────────────────────────────────────────────────────┐
│  Job 1: Build (构建阶段)                                 │
│  ├── Checkout 代码                                      │
│  ├── 安装 Node.js 20 + Go 1.23 (带缓存)                 │
│  ├── 构建 Admin (npm ci && npm run build)               │
│  ├── 构建 DApp (npm ci && npm run build)                │
│  ├── 构建 Website (npm ci && npm run build)             │
│  ├── 构建 Backend (go build)                            │
│  └── 上传 Artifacts (保留 7 天)                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Job 2: Deploy (部署阶段)                                │
│  ├── 下载 Artifacts                                     │
│  ├── SSH 上传文件到服务器                                 │
│  │   └── /opt/sapmall/deploy/{commit-hash}/             │
│  └── 执行部署脚本                                        │
│      ├── 备份当前版本                                    │
│      │   ├── /opt/sapmall/backup/web_client_时间戳       │
│      │   └── /opt/sapmall/backup/main_时间戳             │
│      ├── 部署新版本                                      │
│      │   ├── 复制前端到 web_client/                      │
│      │   └── 复制后端到 backend_service/                 │
│      ├── 重启服务                                        │
│      │   ├── systemctl restart sapmall-backend          │
│      │   └── systemctl reload nginx                     │
│      └── 健康检查                                        │
│          ├── 成功 → 部署完成                             │
│          └── 失败 → 自动回滚                             │
└─────────────────────────────────────────────────────────┘
```

## 回滚机制

### 自动回滚

部署失败时，工作流会自动执行回滚：

1. 检测健康检查失败 (`curl -f http://localhost:8888/api/health`)
2. 恢复最新前端备份：`/opt/sapmall/backup/web_client_*`
3. 恢复最新后端备份：`/opt/sapmall/backup/main_*`
4. 重启后端服务

### 手动回滚

```bash
# 查看可用备份
ls -la /opt/sapmall/backup/

# 回滚前端
LATEST_FRONTUP=$(ls -td /opt/sapmall/backup/web_client_* | head -1)
rm -rf /opt/sapmall/web_client
cp -rf "$LATEST_FRONTUP" /opt/sapmall/web_client

# 回滚后端
LATEST_BACKEND=$(ls -t /opt/sapmall/backup/main_* | head -1)
cp -f "$LATEST_BACKEND" /opt/sapmall/backend_service/main

# 重启服务
sudo systemctl restart sapmall-backend
sudo systemctl reload nginx
```

## 常见问题

### 1. 部署失败：连接超时

```bash
# 检查服务器是否可达
ping SERVER_HOST

# 检查 SSH 端口是否开放
telnet SERVER_HOST 22
```

### 2. 后端服务启动失败

```bash
# 查看服务状态
sudo systemctl status sapmall-backend

# 查看日志
sudo journalctl -u sapmall-backend -f

# 检查配置文件
cat /opt/sapmall/backend_service/app/etc/sapmall_prod.yaml
```

### 3. Nginx 502 Bad Gateway

```bash
# 检查后端是否运行
sudo systemctl status sapmall-backend

# 检查端口监听
netstat -tlnp | grep 8888

# 检查 Nginx 配置
sudo nginx -t
```

### 4. 前端页面空白

检查 `.env.production` 中的 API 地址是否正确：

```bash
cat web_client/sapmall-admin/.env.production
cat web_client/sapmall-dapp/.env.production
cat web_client/sapmall-website/.env.production
```

### 5. 权限被拒绝

```bash
# 检查目录权限
ls -la /opt/sapmall/

# 修复权限
sudo chown -R sapmall:sapmall /opt/sapmall/
```

## 环境变量管理

### 后端配置

生产环境配置文件位于：
- `/opt/sapmall/backend_service/app/etc/sapmall_prod.yaml` (服务器)
- `backend_service/app/etc/sapmall_dev.yaml` (本地开发)

### 前端环境变量

前端环境变量在构建时注入：

```yaml
# 在 deploy-prod.yml 中配置
- name: Build Admin
  env:
    REACT_APP_API_URL: ${{ secrets.API_URL }}
  run: cd web_client/sapmall-admin && npm ci && npm run build
```

## 安全注意事项

1. **密码安全**：SSH 密码存储在 GitHub Secrets 中，不要提交到代码库
2. **配置文件**：生产环境配置文件包含敏感信息，不要提交到 Git
3. **访问控制**：限制服务器 SSH 访问权限
4. **定期轮换**：建议定期更换 SSH 密码

## 监控与日志

### 查看部署日志

在 GitHub Actions 页面查看每次部署的详细日志。

### 服务器日志

```bash
# 后端日志
sudo journalctl -u sapmall-backend -f

# 应用日志
tail -f /opt/sapmall/logs/*.log

# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 扩展建议

1. **添加 CI 检查**：创建 `ci.yml` 工作流，在 PR 时运行 lint 和测试
2. **多环境支持**：添加 staging 环境，先测试再部署生产
3. **通知机制**：部署结果发送到钉钉/飞书通知
4. **数据库迁移**：集成 SQL 迁移工具
5. **Docker 化**：使用 Docker Compose 管理服务
6. **SSL 证书**：配置 Let's Encrypt 自动 HTTPS
