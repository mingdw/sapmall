# GitHub Actions Workflows

本目录包含 SAP Mall 项目的 CI/CD 工作流配置文件。

## 工作流文件

### ci.yml - 持续集成检查

| 配置项 | 说明 |
|--------|------|
| 工作流名称 | CI |
| 触发方式 | PR 到 main 分支 / Push 到 main 分支 |
| 运行环境 | `ubuntu-latest` |

#### 功能说明

1. **前端构建检查** (frontend-build job)
   - 并行检查 3 个前端应用 (Admin, DApp, Website)
   - 安装依赖 (`npm ci`)
   - 构建验证 (`npm run build`)

2. **后端构建检查** (backend-build job)
   - 安装 Go 1.23
   - 整理依赖 (`go mod tidy`)
   - 代码检查 (`go vet ./...`)
   - 构建验证 (`go build`)

#### 使用方法

- **PR 触发**：创建 PR 到 main 分支时自动运行
- **Push 触发**：推送到 main 分支时自动运行
- **手动触发**：不支持（自动触发）

---

### deploy-prod.yml - 生产环境全量部署（前后端一起）

| 配置项 | 说明 |
|--------|------|
| 工作流名称 | Deploy Production |
| 触发方式 | 手动触发 (`workflow_dispatch`) |
| 运行环境 | `ubuntu-latest` (GitHub 托管) |
| 部署目标 | CentOS 服务器 |

#### 功能说明

1. **构建阶段** (build job)
   - 检出代码
   - 安装 Node.js 20 + Go 1.23
   - 构建 3 个前端应用 (Admin, DApp, Website)
   - 构建后端 Go 二进制文件
   - 上传构建产物 (保留 7 天)

2. **部署阶段** (deploy job)
   - 下载构建产物
   - SSH 上传到服务器
   - 备份当前版本
   - 部署新版本
   - 重启服务
   - 健康检查 (失败自动回滚)

---

### deploy-prod-frontend.yml - 仅部署前端

| 配置项 | 说明 |
|--------|------|
| 工作流名称 | Deploy Production Frontend |
| 触发方式 | 手动触发 (`workflow_dispatch`) |
| 部署范围 | Admin / DApp / Website |

#### 功能说明

1. **构建阶段**：仅构建 3 个前端应用并上传产物  
2. **部署阶段**：备份并覆盖前端静态资源，重载 Nginx（不重启后端）

---

### deploy-prod-backend.yml - 仅部署后端

| 配置项 | 说明 |
|--------|------|
| 工作流名称 | Deploy Production Backend |
| 触发方式 | 手动触发 (`workflow_dispatch`) |
| 部署范围 | `backend_service/main` |

#### 功能说明

1. **构建阶段**：仅编译 Go 二进制并上传产物  
2. **部署阶段**：停止服务 → 备份 → 替换二进制 → 重启 → 健康检查（失败回滚后端）

#### 所需 Secrets

| Secret 名称 | 说明 |
|-------------|------|
| `SERVER_HOST` | 服务器 IP 地址 |
| `SERVER_USER` | SSH 用户名 |
| `SERVER_PORT` | SSH 端口 (默认 22) |
| `SERVER_SSH_KEY` | SSH 私钥 |
| 其它构建用 Secret | 与全量部署相同（前端 env / API 地址等） |

#### 使用方法

1. 登录 GitHub，进入仓库 **Actions** 页面
2. 按需选择：
   - **Deploy Production**（前后端一起）
   - **Deploy Production Frontend**（只前端）
   - **Deploy Production Backend**（只后端）
3. 点击 **Run workflow**
4. 选择分支后确认运行

## 服务器目录结构

```
/opt/sapmall/
├── backend_service/
│   └── main                    # 后端二进制文件
├── web_client/
│   ├── sapmall-admin/build/    # 管理后台
│   ├── sapmall-dapp/build/     # DApp
│   └── sapmall-website/build/  # 官网
├── backup/                     # 版本备份
└── logs/                       # 日志
```

## 部署流程图

```
手动触发
    │
    ▼
┌─────────────┐
│  Build Job  │
│  - 前端 x3  │
│  - 后端 x1  │
│  - 上传产物 │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Deploy Job  │
│  - 下载产物 │
│  - SSH传输  │
│  - 备份旧版 │
│  - 部署新版 │
│  - 重启服务 │
│  - 健康检查 │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   结果      │
│  - 成功     │
│  - 或回滚   │
└─────────────┘
```

## 常见问题

### Q: 如何查看部署日志？

A: 进入 GitHub Actions 页面，点击具体的运行记录查看详细日志。

### Q: 如何回滚到上一版本？

A: 工作流会自动回滚，也可手动执行：
```bash
# 查看备份
ls -la /opt/sapmall/backup/

# 回滚前端
cp -rf /opt/sapmall/backup/web_client_时间戳/* /opt/sapmall/web_client/

# 回滚后端
cp -f /opt/sapmall/backup/main_时间戳 /opt/sapmall/backend_service/main

# 重启服务
sudo systemctl restart sapmall-backend
sudo systemctl reload nginx
```

### Q: 如何添加新的前端应用？

A: 在 `deploy-prod.yml` 与 `deploy-prod-frontend.yml` 中同步添加对应的构建和部署步骤。

### Q: 如何配置环境变量？

A: 在 GitHub Secrets 中添加，然后在工作流中通过 `${{ secrets.XXX }}` 引用。
