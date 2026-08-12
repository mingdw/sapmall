# SapMall 新服务器环境安装与 CI/CD 部署指南

面向 **全新 Linux 服务器**（已安装 MySQL，其余环境从零搭建），从创建专有用户、安装依赖、初始化数据与配置，到通过 GitHub Actions 手动部署生产服务。

> 生产机制：**GitHub Actions 构建产物 → SCP/SSH → `/opt/sapmall` → systemd（`sapmall-backend`）+ Nginx**。  
> 本地 `env/dev` 的 Docker/Podman 仅用于开发，**不是**生产部署方式。  
> 智能合约（`contract/`）在链上部署，**不通过**本应用服务器的 CI/CD 下发。  
> **本文默认目标系统为 CentOS 7（`yum`）**；若为 CentOS/RHEL 8+ 将 `yum` 换成 `dnf`；Ubuntu/Debian 见各节附录。

相关文件：

| 文件 | 说明 |
|------|------|
| `.github/workflows/deploy-prod.yml` | 全量部署（前后端） |
| `.github/workflows/deploy-prod-frontend.yml` | 仅前端 |
| `.github/workflows/deploy-prod-backend.yml` | 仅后端 |
| `.github/workflows/ci.yml` | PR/Push 到 `main` 的构建检查 |
| `env/dev/nginx/nginx.conf.production` | 生产 Nginx 配置模板 |
| `backend_service/app/etc/sapmall.yaml` | 后端配置字段模板 |
| `docs/CI-Cd-Guid.md` | 旧版 CI/CD 说明（部分 Secrets/健康检查路径已过时，以本文与 workflow 为准） |

---

## 0. 架构与端口一览

```
Internet / Cloudflare
    │ :80
    ▼
Nginx（公网域名反代）
    ├── sapmall.xyz / www  → 127.0.0.1:7103  官网静态
    ├── dapp.sapmall.xyz   → 127.0.0.1:7102  DApp 静态
    └── admin.sapmall.xyz  → 127.0.0.1:7101  管理后台静态
         │
         └── /api、/swagger-ui → 127.0.0.1:8888  Go 后端
                                      │
                                      ├── MySQL :3306
                                      └── Redis :6379
```

| 组件 | 技术 | 生产路径 / 端口 |
|------|------|-----------------|
| 后端 API | Go 1.23 + go-zero | `/opt/sapmall/backend_service/main`，监听 **8888** |
| 管理后台 | React（CRA） | `/opt/sapmall/web_client/sapmall-admin/build/`，Nginx **7101** |
| DApp | React + Wagmi | `/opt/sapmall/web_client/sapmall-dapp/build/`，Nginx **7102** |
| 官网 | React（CRA） | `/opt/sapmall/web_client/sapmall-website/build/`，Nginx **7103** |
| MySQL | 已安装 | **3306**（库名以生产 yaml 的 `DB.Dbname` 为准） |
| Redis | 需安装 | **6379** |

CI 构建环境（由 GitHub Actions 完成，**服务器无需安装 Node/Go**）：

- Node.js **20** + npm（`npm ci --legacy-peer-deps`）
- Go **1.23**（`CGO_ENABLED=0 GOOS=linux GOARCH=amd64` 静态二进制）

### 0.1 先确认发行版与包管理器

```bash
cat /etc/os-release
uname -a
```

| 系统 | 包管理器 | 说明 |
|------|----------|------|
| **CentOS 7**（本文默认） | **`yum`** | **没有 `dnf`**；执行 `dnf` 会报 `command not found` |
| CentOS / RHEL / Rocky 8+ | `dnf` | 可将下文 `yum` 换成 `dnf` |
| Ubuntu / Debian | `apt` | 见第 2 节附录 |

> CentOS 7 已结束官方维护，默认镜像源可能失效。若 `yum` 报 404 / 无法解析镜像，需改用 vault 镜像（见 [9.2 常见问题](#92-常见问题)）。

---

## 1. 系统准备与专有用户

以下命令以 **root**，或已加入 `wheel` 组的管理员执行。  
若已用 `sapmall` 登录，可用 `sudo -i` 切到 root 交互 shell，或每条命令前加 `sudo`。

### 1.1 创建 `sapmall` 用户

```bash
# 创建系统用户（后续用 SSH 密钥登录）
sudo useradd -m -s /bin/bash sapmall

# 可选：设置密码（日常登录建议只用密钥；本地 sudo 可能仍需此密码）
sudo passwd sapmall

# CentOS/RHEL：加入 wheel 组以获得 sudo
sudo usermod -aG wheel sapmall

# Ubuntu/Debian 则用：
# sudo usermod -aG sudo sapmall
```

重新 SSH 登录后，`groups` 应能看到 `wheel`。

### 1.2 配置 SSH 密钥（本机生成，公钥放到服务器）

在**你的运维机**上生成专用于部署的密钥对（勿复用个人日常密钥）：

```bash
ssh-keygen -t ed25519 -C "sapmall-github-deploy" -f ./sapmall_deploy_ed25519 -N ""
```

将公钥写入服务器（用 **root** 或其它管理员执行）：

```bash
sudo mkdir -p /home/sapmall/.ssh
sudo chmod 700 /home/sapmall/.ssh
# 把本机 sapmall_deploy_ed25519.pub 的内容追加进去，例如：
#   sudo tee -a /home/sapmall/.ssh/authorized_keys < ./sapmall_deploy_ed25519.pub
sudo chmod 600 /home/sapmall/.ssh/authorized_keys
sudo chown -R sapmall:sapmall /home/sapmall/.ssh
```

在运维机上验证：

```bash
ssh -i ./sapmall_deploy_ed25519 sapmall@<SERVER_IP>
```

登录成功后：

- 继续装环境：`sudo -i` 或对单条命令使用 `sudo ...`
- 私钥全文稍后写入 GitHub Secret `SERVER_SSH_KEY`（含 `-----BEGIN ... PRIVATE KEY-----`）

### 1.3 受限 sudo（供 CI 重启服务）

部署脚本会执行 `sudo systemctl stop/restart sapmall-backend` 与 `sudo systemctl reload nginx`，需无交互密码。

CentOS 7 上 `systemctl` 一般为 `/usr/bin/systemctl`，先确认：

```bash
which systemctl
# 常见输出：/usr/bin/systemctl
```

按实际路径写入（以下为 CentOS 7 常见路径）：

```bash
sudo tee /etc/sudoers.d/sapmall <<'EOF'
sapmall ALL=(ALL) NOPASSWD: /usr/bin/systemctl stop sapmall-backend, /usr/bin/systemctl start sapmall-backend, /usr/bin/systemctl restart sapmall-backend, /usr/bin/systemctl status sapmall-backend, /usr/bin/systemctl reload nginx, /usr/bin/systemctl status nginx, /usr/sbin/nginx
EOF
sudo chmod 440 /etc/sudoers.d/sapmall
sudo visudo -c
```

> 运维人员本地用 `sudo yum` / `sudo -i` 仍可能需要 **sapmall 的登录密码**（与 CI 免白名单无关）。  
> 若 `which systemctl` 为 `/bin/systemctl`，把上面路径改成 `/bin/systemctl`。

### 1.4 创建目录结构

```bash
sudo mkdir -p \
  /opt/sapmall/backend_service \
  /opt/sapmall/web_client/sapmall-admin/build \
  /opt/sapmall/web_client/sapmall-dapp/build \
  /opt/sapmall/web_client/sapmall-website/build \
  /opt/sapmall/deploy \
  /opt/sapmall/backup \
  /opt/sapmall/logs \
  /opt/sapmall/config

sudo chown -R sapmall:sapmall /opt/sapmall
```

目标布局：

```
/opt/sapmall/
├── backend_service/
│   └── main                 # CI 部署的 Go 二进制
├── web_client/
│   ├── sapmall-admin/build/
│   ├── sapmall-dapp/build/
│   └── sapmall-website/build/
├── config/
│   └── sapmall_prod.yaml    # 生产配置（勿提交 Git）
├── deploy/                  # CI 临时目录（按 commit SHA）
├── backup/                  # 部署备份
├── logs/
└── nginx.conf.production    # 可选：配置副本
```

---

## 2. 安装运行时依赖（不含 MySQL）

### 2.1 更新系统并安装基础工具（CentOS 7）

```bash
sudo yum -y update
sudo yum -y install curl wget git vim tar unzip
```

### 2.2 启用 EPEL（CentOS 7 安装 Redis 等需要）

```bash
sudo yum -y install epel-release
sudo yum -y makecache
```

### 2.3 安装 Redis（CentOS 7）

```bash
sudo yum -y install redis
sudo systemctl enable redis
sudo systemctl start redis
redis-cli ping   # 应返回 PONG
```

生产若设置 Redis 密码，须与 `/opt/sapmall/config/sapmall_prod.yaml` 中 `Redis.Password` 一致。默认可本机无密码（仅监听 127.0.0.1）。

建议确认配置中有 `bind 127.0.0.1`，勿对公网开放 6379：

```bash
grep -E '^bind|^protected-mode|^requirepass' /etc/redis.conf
```

### 2.4 安装 Nginx（CentOS 7）

```bash
sudo yum -y install nginx
sudo systemctl enable nginx
# 先不要 start；等第 5 节写入生产配置后再 start/reload
```

### 2.5 防火墙开放端口（firewalld）

至少开放：**22（SSH）、80（公网入口）**。7101–7103、8888、3306、6379 **建议仅本机访问**，不要对公网开放。

```bash
sudo yum -y install firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

云厂商安全组同步放行 **22、80**（以及若不用 Cloudflare 终止 TLS 时的 443）。

### 2.6 确认 MySQL 可用

```bash
mysql --version
# CentOS 7 上常见服务名：mysqld 或 mariadb
sudo systemctl status mysqld
# 若上面没有该 unit，再试：
# sudo systemctl status mariadb
# sudo systemctl status mysql

mysql -uroot -p -e "SELECT 1;"
```

### 2.7 附录：其它发行版

**CentOS / RHEL 8+（`dnf`）**

```bash
sudo dnf -y update
sudo dnf -y install curl wget git vim tar unzip firewalld epel-release
sudo dnf -y install redis nginx
sudo systemctl enable --now redis
sudo systemctl enable nginx
```

**Ubuntu / Debian（`apt`）**

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install curl wget git vim tar unzip ufw redis-server nginx
sudo systemctl enable --now redis-server
sudo systemctl enable nginx
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw enable
```

---

## 3. 初始化 MySQL 库表

### 3.1 库名说明（重要）

仓库内存在两套拼写：

| 来源 | 库名 |
|------|------|
| Schema 文件名 / README | `sapphire_mall` |
| 后端 yaml 模板 `DB.Dbname` | **`saphire_mall`**（少一个 `p`） |

**生产建库名必须与 `sapmall_prod.yaml` 的 `DB.Dbname` 完全一致。** 下文示例按当前 yaml 模板使用 `saphire_mall`。

### 3.2 创建库与用户

CentOS 7 常见 MySQL 5.7 / MariaDB，使用兼容写法（避免依赖较新的 `IF NOT EXISTS` 用户语法）：

```bash
mysql -uroot -p <<'SQL'
CREATE DATABASE IF NOT EXISTS saphire_mall
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 若用户已存在会报错，可忽略后直接 GRANT
CREATE USER 'sapmall'@'localhost' IDENTIFIED BY 'REPLACE_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON saphire_mall.* TO 'sapmall'@'localhost';
FLUSH PRIVILEGES;
SQL
```

若你的环境使用腾讯云 TDSQL 等「租户:用户」形式，则 yaml 中 `Username` 写成 `租户:用户`，与 `sapmall.yaml` 模板一致。

### 3.3 导入 Schema 与初始数据

将仓库中的 SQL 拷到服务器后执行（可从本机 scp，或临时 clone 仓库）：

```bash
# 示例：在有仓库副本的机器上
mysql -usapmall -p saphire_mall < backend_service/docs/sapphire_mall_schema.sql
mysql -usapmall -p saphire_mall < backend_service/docs/saphire_mall_data.sql

# 增量迁移（按文件名时间顺序）
mysql -usapmall -p saphire_mall < backend_service/docs/migrations/20260723_alter_sys_cctp_swap_intent_meta.sql
```

> DB 迁移**未**接入 CI；后续 schema 变更需人工执行 `backend_service/docs/migrations/` 下脚本。

---

## 4. 编写生产后端配置

在服务器创建 `/opt/sapmall/config/sapmall_prod.yaml`（**含密钥，勿提交 Git**）。

可参考仓库 `backend_service/app/etc/sapmall.yaml`，字段须与 `backend_service/app/internal/config/config.go` 对齐。最小可用骨架：

```yaml
Name: sapmall
Host: 0.0.0.0
Port: 8888
Version: "1.0.0"
DebugHTTPRequestLog: false

DB:
  Host: 127.0.0.1
  Port: 3306
  Username: "sapmall"
  Password: "REPLACE_STRONG_PASSWORD"
  Dbname: saphire_mall

Redis:
  Host: 127.0.0.1
  Port: 6379
  Password: ""
  DB: 0

Cos:
  secretId: "REPLACE"
  secretKey: "REPLACE"
  bucketName: "REPLACE"
  region: "REPLACE"

Auth:
  AccessSecret: "REPLACE_LONG_RANDOM_SECRET"
  AccessExpire: 86400
  StartAuth: true

MerchantDeposit:
  Amount: "100"
  TokenSymbol: "USDT"
  TokenAddress: "0x..."
  ContractAddress: "0x..."
  IntentExpireMins: 30

ChainMonitor:
  RPCURL: "https://..."

ChainListener:
  Enable: true
  PollIntervalSec: 12
  MaxBlocksChunk: 3000
  BootstrapLookbackBlocks: 128

PlatformConfig:
  ContractAddress: "0x..."
  SignerPrivateKey: "REPLACE"   # 链上签名私钥，严格保密

OrderDelayQueue:
  Enabled: true
  PollIntervalSec: 5
  QueueKey: "order:delay_queue"
  ExpireMins: 30

Cctp:
  Enabled: false
  IrisBaseURL: "https://iris-api-sandbox.circle.com"
  RelayerPrivateKey: ""
  ArcRPC: "https://rpc.testnet.arc.io"
  ArcMessageTransmitter: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275"
  PollIntervalSec: 5

Swagger:
  Enabled: false
  Title: "Sapphire Mall API"
  Description: "Sapphire Mall 后端服务 API 文档"
  Version: "1.0.0"
```

权限：

```bash
sudo chown sapmall:sapmall /opt/sapmall/config/sapmall_prod.yaml
sudo chmod 640 /opt/sapmall/config/sapmall_prod.yaml
```

---

## 5. 配置 systemd 与 Nginx

### 5.1 systemd：`sapmall-backend`

CentOS 7 上 MySQL 单元名多为 `mysqld.service`，Redis 为 `redis.service`：

```bash
sudo tee /etc/systemd/system/sapmall-backend.service <<'EOF'
[Unit]
Description=SAP Mall Backend Service
After=network.target mysqld.service redis.service
# 若实际为 MariaDB，将 mysqld.service 改为 mariadb.service

[Service]
Type=simple
User=sapmall
Group=sapmall
WorkingDirectory=/opt/sapmall/backend_service
ExecStart=/opt/sapmall/backend_service/main -f /opt/sapmall/config/sapmall_prod.yaml
Restart=always
RestartSec=5
LimitNOFILE=65535
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable sapmall-backend
# 此时尚无二进制，先不要 start；等首次 CI 部署后再启动
```

### 5.2 Nginx 生产配置

1. 从仓库取出 `env/dev/nginx/nginx.conf.production`
2. 按实际域名修改 `server_name`（默认：`sapmall.xyz` / `dapp.sapmall.xyz` / `admin.sapmall.xyz`）
3. 安装到系统：

```bash
# 备份发行版默认配置后替换
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak.$(date +%Y%m%d)
sudo cp /opt/sapmall/nginx.conf.production /etc/nginx/nginx.conf
# 同时保留一份到项目目录便于对照
sudo cp /path/to/nginx.conf.production /opt/sapmall/nginx.conf.production
sudo chown sapmall:sapmall /opt/sapmall/nginx.conf.production

sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

配置要点：

- 公网 **:80** 按域名反代到 7101–7103
- 7101–7103 提供静态资源，并将 `/api/`、`/swagger-ui/`、`/swagger.json` 反代到 `127.0.0.1:8888`
- 静态根目录必须是 `/opt/sapmall/web_client/.../build/`

DNS / Cloudflare：将上述域名 A 记录指向服务器；若用 Cloudflare Flexible SSL，源站可仅监听 80。

---

## 6. 配置 GitHub Actions Secrets

仓库路径：**Settings → Secrets and variables → Actions → New repository secret**

### 6.1 SSH（三个部署 workflow 共用）

| Secret | 说明 |
|--------|------|
| `SERVER_HOST` | 服务器 IP 或域名 |
| `SERVER_USER` | SSH 用户，推荐 `sapmall` |
| `SERVER_SSH_KEY` | 部署私钥全文（对应第 1.2 节） |
| `SERVER_PORT` | 可选，默认 `22` |

> 当前 workflow 使用 **SSH 密钥**（`appleboy/scp-action` / `ssh-action`），**不再使用** `SERVER_PASSWORD`。

### 6.2 前端构建期环境变量（全量 / 仅前端部署需要）

| Secret | 注入到 | 用途 |
|--------|--------|------|
| `ADMIN_API_BASE_URL` | Admin → `REACT_APP_API_BASE_URL` | 管理后台 API 根地址 |
| `DAPP_API_BASE_URL` | DApp → `REACT_APP_API_BASE_URL` | DApp API 根地址 |
| `WALLETCONNECT_PROJECT_ID` | DApp | WalletConnect |
| `SWAP_ROUTER_ADDRESS` | DApp | Swap 路由合约 |
| `ADMIN_URL` | DApp | 管理后台外链 |
| `DAPP_URL` | Website | DApp 入口 |
| `WHITEPAPER_URL` | Website | 白皮书 |
| `DEMO_URL` | Website | Demo |
| `GITHUB_URL` / `TWITTER_URL` / `TELEGRAM_URL` / `DISCORD_URL` | Website | 社区外链 |

官网 `REACT_APP_HELP_PATH` 在 workflow 中硬编码为 `/help`。  
官网 `REACT_APP_SITE_URL` 在 workflow 中硬编码为 `https://sapmall.xyz`（canonical / OG / JSON-LD）。

示例值（按你的域名调整）：

```text
ADMIN_API_BASE_URL=https://admin.sapmall.xyz
DAPP_API_BASE_URL=https://dapp.sapmall.xyz
DAPP_URL=https://dapp.sapmall.xyz
ADMIN_URL=https://admin.sapmall.xyz
```

> 部分 DApp 支付相关变量（如 `REACT_APP_PAYMENT_ROUTER_ADDRESS`）若代码已使用但未写入 workflow，需同步改 `.github/workflows/deploy-prod*.yml` 并补 Secret，否则构建产物中可能为空。

---

## 7. 首次通过 CI/CD 部署

### 7.1 部署前检查清单

- [ ] `sapmall` 用户可 SSH 登录，私钥与 Secret 一致
- [ ] `sudo systemctl ...` 对 `sapmall-backend` / `nginx` 免密可用（路径与 sudoers 一致）
- [ ] `/opt/sapmall/.../build`、`backend_service`、`deploy`、`backup`、`config` 已创建且属主为 `sapmall`
- [ ] MySQL 库表已导入，`sapmall_prod.yaml` 已写好
- [ ] Nginx 配置已 `nginx -t` 通过并在运行
- [ ] systemd unit 已 `enable`（可暂未 start）
- [ ] GitHub Secrets 已配置完整
- [ ] 安全组 / 防火墙放行 22、80

### 7.2 触发全量部署

1. 打开 GitHub 仓库 → **Actions**
2. 选择 **Deploy Production All**（文件：`deploy-prod.yml`）
3. **Run workflow** → 选择目标分支（通常 `main`）→ 确认运行

流程：

```
Build（ubuntu-latest）
  ├── Node 20：构建 Admin / DApp / Website
  ├── Go 1.23：编译 linux/amd64 二进制 main
  └── 上传 artifact（保留 7 天）
        │
        ▼
Deploy
  ├── SCP 到 /opt/sapmall/deploy/<commit-sha>/
  ├── systemctl stop sapmall-backend
  ├── 备份 web_client / main → /opt/sapmall/backup/
  ├── 覆盖正式目录
  ├── systemctl restart sapmall-backend
  ├── systemctl reload nginx
  ├── 健康检查：curl -f http://localhost:8888/api/common/health
  └── 失败则回滚最近备份并 exit 1
```

### 7.3 仅前端 / 仅后端

| 工作流名称 | 文件 | 场景 |
|------------|------|------|
| Deploy Production Frontend | `deploy-prod-frontend.yml` | 只改前端文案/UI |
| Deploy Production Backend | `deploy-prod-backend.yml` | 只改 Go API |

### 7.4 CI 检查（自动）

`ci.yml` 在 **PR / Push 到 `main`** 时自动跑前端构建与后端 `go vet`/`go build`，**不会**部署到服务器。

---

## 8. 部署后验收

在服务器上：

```bash
# 后端进程与健康检查
sudo systemctl status sapmall-backend
curl -f http://localhost:8888/api/common/health

# 本地静态端口
curl -I http://127.0.0.1:7101/
curl -I http://127.0.0.1:7102/
curl -I http://127.0.0.1:7103/

# 公网域名（需 DNS 已生效）
curl -I http://admin.sapmall.xyz/
curl -I http://dapp.sapmall.xyz/
curl -I http://sapmall.xyz/

# 日志
sudo journalctl -u sapmall-backend -f
sudo tail -f /var/log/nginx/error.log
```

浏览器访问三个域名，确认页面可打开、接口可调。

---

## 9. 日常运维

### 9.1 手动回滚

```bash
ls -la /opt/sapmall/backup/

# 前端
LATEST_FRONTUP=$(ls -td /opt/sapmall/backup/web_client_* | head -1)
sudo -u sapmall bash -c "rm -rf /opt/sapmall/web_client && cp -rf \"$LATEST_FRONTUP\" /opt/sapmall/web_client"

# 后端
LATEST_BACKEND=$(ls -t /opt/sapmall/backup/main_* | head -1)
sudo -u sapmall cp -f "$LATEST_BACKEND" /opt/sapmall/backend_service/main
sudo systemctl restart sapmall-backend
sudo systemctl reload nginx
```

### 9.2 常见问题

| 现象 | 排查 |
|------|------|
| `sudo: dnf: command not found` | CentOS 7 请用 **`yum`**，不要用 `dnf` |
| `yum` 镜像 404 / Could not resolve | CentOS 7 EOL，改 vault 源（见下方） |
| Actions 连接超时 | 安全组/防火墙是否放行 `SERVER_PORT`；主机是否可达 |
| SCP 权限失败 | `/opt/sapmall` 属主是否为 `sapmall`；磁盘空间 |
| `Text file busy` | 部署脚本已先 `stop` 再覆盖；确认 unit 名正确 |
| 健康检查失败自动回滚 | `journalctl -u sapmall-backend`；核对 yaml 中 DB/Redis；健康路径为 `/api/common/health` |
| Nginx 502 | 后端未起或未监听 8888：`ss -lntp \| grep 8888` 或 `netstat -lntp \| grep 8888` |
| 前端白屏 / API 错域 | 检查构建用 Secret（`*_API_BASE_URL`）是否在构建时注入正确 |
| sudo 要密码导致部署挂起 | 检查 `/etc/sudoers.d/sapmall` 中 `systemctl` 路径是否与 `which systemctl` 一致 |
| `CREATE USER` 报已存在 | 用户已建好，直接 `GRANT` 即可 |

**CentOS 7 yum 源失效时（示例改 vault）**：

```bash
sudo sed -i 's|^mirrorlist=|#mirrorlist=|g' /etc/yum.repos.d/CentOS-*.repo
sudo sed -i 's|^#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*.repo
sudo yum -y clean all
sudo yum -y makecache
```

### 9.3 备份清理

`/opt/sapmall/backup/` 会随部署增长，建议定期清理旧备份，例如只保留最近 10 次：

```bash
cd /opt/sapmall/backup
# CentOS 7 的 xargs 支持 -r（无输入则不执行）
ls -td web_client_* 2>/dev/null | tail -n +11 | xargs -r rm -rf
ls -t main_* 2>/dev/null | tail -n +11 | xargs -r rm -f
```

---

## 10. 安全建议

1. 生产 yaml、私钥、COS/链上密钥仅存服务器与密码管理器，**禁止**提交仓库。
2. GitHub 只用 **SSH 密钥** Secret，限制该密钥权限与 sudo 命令白名单。
3. MySQL / Redis / 8888 / 7101–7103 不对公网暴露。
4. 生产关闭 `DebugHTTPRequestLog`，按需关闭 Swagger。
5. 定期轮换 `Auth.AccessSecret`、SSH 密钥与 DB 密码。
6. 合约与 Relayer 私钥权限最小化；CCTP Relayer 未就绪时保持 `Cctp.Enabled: false`。
7. CentOS 7 已 EOL，中长期建议迁移到 Rocky/Alma 8+ 或 Ubuntu LTS。

---

## 11. 推荐执行顺序（速查）

1. 确认系统：`cat /etc/os-release`（CentOS 7 → 全程用 `yum`）  
2. 创建用户 `sapmall` + SSH 密钥 + 受限免密 sudo  
3. 创建 `/opt/sapmall` 目录树并 `chown`  
4. `yum` 安装 EPEL、**Redis**、**Nginx**、firewalld（MySQL 已有则跳过安装）  
5. 建库、导入 schema / data / migrations  
6. 写入 `sapmall_prod.yaml`  
7. 安装 `sapmall-backend.service` 并 `enable`  
8. 安装 `nginx.conf.production`，`nginx -t` 后启动  
9. 配置防火墙 / 安全组 / DNS  
10. 配置 GitHub Secrets  
11. Actions 手动跑 **Deploy Production All**  
12. 健康检查与三端域名验收  

至此，新服务器即可完全依赖 GitHub CI/CD 进行后续发版。
