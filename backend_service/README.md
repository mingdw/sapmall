# Sapphire Mall 后端服务

## 项目概述

Sapphire Mall 是一个基于 Web3 技术的虚拟商品交易平台，提供多语言支持、去中心化治理和流动性挖矿功能。项目采用 go-zero 微服务框架构建，支持高并发、高可用的分布式系统架构。

## 技术栈

- **框架**: go-zero (微服务框架)
- **数据库**: MySQL + Redis
- **区块链**: Ethereum/BSC 集成
- **存储**: IPFS (分布式文件存储)
- **认证**: JWT + Web3 钱包签名
- **API文档**: Swagger/OpenAPI 3.0
- **ORM**: GORM
- **日志**: zap + logx
- **配置管理**: viper
- **任务调度**: cron

## 项目结构

```
backend_service/
├── app/                   # 应用程序主目录
│   ├── api/               # API 定义文件
│   │   ├── main.api       # 主API文件 (支持import)
│   │   ├── common/        # 通用API模块
│   │   │   └── common.api # 健康检查、版本信息
│   │   ├── user/          # 用户API模块
│   │   │   └── user.api   # 用户注册、登录、信息管理
│   │   ├── product/       # 商品API模块
│   │   │   └── product.api # 商品CRUD、审核
│   │   ├── staking/       # 质押API模块
│   │   │   └── staking.api # 流动性池、质押收益
│   │   └── dao/           # DAO治理API模块
│   │       └── dao.api    # 提案、投票
│   ├── internal/          # 内部包
│   │   ├── handler/       # HTTP 处理器
│   │   ├── logic/         # 业务逻辑
│   │   ├── svc/           # 服务上下文
│   │   ├── types/         # 类型定义
│   │   ├── config/        # 配置结构
│   │   ├── middleware/    # 中间件
│   │   ├── enums/         # 枚举定义
│   │   └── utils/         # 工具函数
│   ├── etc/               # 配置文件
│   │   ├── sapmall.yaml   # 默认配置
│   │   ├── sapmall_dev.yaml # 开发环境配置
│   │   └── sapmall_test.yaml # 测试环境配置
│   ├── task/              # 定时任务
│   └── sapmall_start.go   # 应用程序入口
├── cmd/                   # 命令行工具 (待开发)
├── deploy/                # 部署相关文件 (待开发)
├── docs/                  # 文档目录
│   ├── API.md             # API 接口文档
│   ├── QUICK_START.md     # 快速开始指南
│   └── init_data.sql      # 数据库初始化脚本
├── pkg/                   # 公共包 (待开发)
├── scripts/               # 脚本文件 (待开发)
├── test/                  # 测试文件 (待开发)
├── go.mod                 # Go 模块文件
├── go.sum                 # 依赖校验文件
└── main.go                # 主程序入口 (占位符)
```

## 核心功能模块

### 1. 用户管理 (User Service)
- **功能**: 用户注册、登录、信息管理
- **特点**: 支持 Web3 钱包登录、多语言偏好设置
- **API**: `/api/user/*`
- **文件**: `app/api/user/user.api`

### 2. 商品管理 (Product Service)
- **功能**: 商品创建、审核、查询、管理
- **特点**: 支持中英文、IPFS 存储、多状态管理
- **API**: `/api/product/*`
- **文件**: `app/api/product/product.api`

### 3. 质押挖矿 (Staking Service)
- **功能**: 流动性池管理、质押收益计算
- **特点**: 多网络支持、实时 APY 计算
- **API**: `/api/staking/*`
- **文件**: `app/api/staking/staking.api`

### 4. DAO 治理 (DAO Service)
- **功能**: 提案创建、投票、结果统计
- **特点**: 去中心化治理、投票权重计算
- **API**: `/api/dao/*`
- **文件**: `app/api/dao/dao.api`

### 5. 通用服务 (Common Service)
- **功能**: 健康检查、版本信息、系统状态
- **API**: `/api/health`, `/api/version`
- **文件**: `app/api/common/common.api`

## 快速开始

### 1. 环境准备

```bash
# Go 版本 >= 1.19
go version

# 安装 goctl 工具
go install github.com/zeromicro/go-zero/tools/goctl@latest

# 验证安装
goctl --version
```

### 2. 项目初始化

```bash
# 克隆项目
git clone <repository-url>
cd backend_service

# 安装依赖
go mod tidy
```

### 3. 数据库配置

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE sapphire_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 初始化数据库 (可选)
mysql -u root -p sapphire_mall < docs/init_data.sql

# 配置数据库连接
# 编辑 app/etc/sapmall_dev.yaml 文件
```

### 4. 生成代码

```bash
# 进入应用目录
cd app

# 生成API代码 (使用支持import的main.api)
goctl api go -api api/main.api -dir . -style go_zero

# 或者分别生成各个模块
goctl api go -api api/common/common.api -dir . -style go_zero
goctl api go -api api/user/user.api -dir . -style go_zero
goctl api go -api api/product/product.api -dir . -style go_zero
goctl api go -api api/staking/staking.api -dir . -style go_zero
goctl api go -api api/dao/dao.api -dir . -style go_zero
```

### 5. 启动服务

```bash
# 开发模式启动
go run sapmall_start.go -f etc/sapmall_dev.yaml

# 或者编译后运行
go build -o sapphire-mall sapmall_start.go
./sapphire-mall -f etc/sapmall_dev.yaml
```

## 配置说明

### 多环境配置

项目支持多环境配置：

- **开发环境**: `app/etc/sapmall_dev.yaml`
- **测试环境**: `app/etc/sapmall_test.yaml`
- **生产环境**: `app/etc/sapmall_prod.yaml`

### 主要配置项

```yaml
Name: CommonService
Host: 0.0.0.0
Port: 8888

# 数据库配置
DataSource: "root:password@tcp(localhost:3306)/sapphire_mall?charset=utf8mb4&parseTime=True&loc=Local"

# Redis 配置
Redis:
  Host: localhost
  Port: 6379
  Password: ""
  DB: 0

# JWT 配置
Auth:
  AccessSecret: "your-jwt-secret-key"
  AccessExpire: 86400
```

## API 开发流程

### 1. 定义API

在 `app/api/` 目录下创建或修改 `.api` 文件：

```go
// app/api/user/user.api
syntax = "v1"

type (
    UserInfo {
        Id string `json:"id"`
        Username string `json:"username"`
        Email string `json:"email"`
    }
    
    CreateUserReq {
        Username string `json:"username"`
        Email string `json:"email"`
    }
    
    CreateUserResp {
        Code int `json:"code"`
        Msg string `json:"msg"`
        UserInfo UserInfo `json:"user_info"`
    }
)

service UserService {
    @handler CreateUser
    post /api/user/create (CreateUserReq) returns (CreateUserResp)
}
```

### 2. 生成代码

```bash
cd app
goctl api go -api api/main.api -dir . -style go_zero
```

### 3. 实现业务逻辑

在 `app/internal/logic/` 目录下实现具体的业务逻辑。

### 4. 添加中间件

在 `app/internal/middleware/` 目录下添加认证、日志等中间件。

## 数据库设计

### 主要数据表

1. **users** - 用户信息表
2. **products** - 商品信息表
3. **pools** - 流动性池表
4. **staking_records** - 质押记录表
5. **proposals** - 提案表
6. **votes** - 投票记录表

### 数据库初始化

项目提供了数据库初始化脚本：

```bash
# 执行初始化脚本
mysql -u root -p sapphire_mall < docs/init_data.sql
```

## 部署方案

### 开发环境

```bash
# 本地开发
cd app
go run sapmall_start.go -f etc/sapmall_dev.yaml
```

### 生产环境

```bash
# 编译
cd app
go build -o sapphire-mall sapmall_start.go

# 运行
./sapphire-mall -f etc/sapmall_prod.yaml

# 或者使用 Docker
docker build -t sapphire-mall .
docker run -d -p 8080:8080 sapphire-mall
```

## 测试

### 单元测试

```bash
cd app
go test ./internal/...
```

### API 测试

```bash
# 健康检查
curl -X GET http://localhost:8888/api/health

# 用户注册
curl -X POST http://localhost:8888/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x1234567890abcdef",
    "username": "testuser",
    "email": "test@example.com",
    "preferred_language": "zh"
  }'
```

## 项目目录说明

### 核心目录

- **`app/`**: 应用程序主目录，包含所有业务逻辑
- **`cmd/`**: 命令行工具目录 (待开发)
- **`deploy/`**: 部署相关文件目录 (待开发)
- **`docs/`**: 文档目录，包含API文档和数据库脚本
- **`etc/`**: 配置文件目录
- **`pkg/`**: 公共包目录 (待开发)
- **`scripts/`**: 脚本文件目录 (待开发)
- **`test/`**: 测试文件目录 (待开发)

### 应用结构

- **`app/api/`**: API定义文件，按模块组织
- **`app/internal/`**: 内部包，包含业务逻辑和工具
- **`app/etc/`**: 应用配置文件
- **`app/task/`**: 定时任务目录

## 监控和日志

### 日志配置

- 使用 `go-zero` 内置的日志系统
- 支持结构化日志输出
- 可配置日志级别和输出格式

### 监控指标

- HTTP 请求统计
- 数据库连接池状态
- 业务指标监控

## 安全考虑

1. **认证授权**: JWT + Web3 钱包签名验证
2. **数据验证**: 请求参数验证和 SQL 注入防护
3. **CORS**: 跨域请求配置
4. **限流**: API 访问频率限制
5. **审计日志**: 关键操作日志记录

## 开发规范

### 代码规范

- 遵循 Go 官方代码规范
- 使用 `gofmt` 格式化代码
- 添加必要的注释和文档

### Git 工作流

```bash
# 创建功能分支
git checkout -b feature/user-management

# 提交代码
git add .
git commit -m "feat: add user registration API"

# 合并到主分支
git checkout main
git merge feature/user-management
```

## 项目特点

### 架构优势

1. **模块化设计**: 每个功能模块独立，便于维护
2. **微服务架构**: 基于 go-zero 框架，支持高并发
3. **Web3集成**: 支持钱包认证和区块链交互
4. **多语言支持**: 中英文双语支持
5. **安全性**: JWT认证、参数验证、限流保护
6. **可扩展性**: 支持水平扩展和垂直扩展

### 技术亮点

- **go-zero框架**: 高性能微服务框架
- **GORM**: 强大的ORM支持
- **Redis缓存**: 提升系统性能
- **IPFS存储**: 分布式文件存储
- **区块链集成**: 支持多链操作
- **任务调度**: 支持定时任务

## 常见问题

### Q: 如何处理数据库连接池？
A: 使用 `go-zero` 的数据库中间件，配置连接池参数。

### Q: 如何集成区块链功能？
A: 使用 `go-ethereum` 库，封装区块链交互逻辑。

### Q: 如何处理文件上传？
A: 集成 IPFS 客户端，实现分布式文件存储。

### Q: 如何配置多环境？
A: 在 `app/etc/` 目录下创建不同环境的配置文件。

### Q: 如何添加新的API模块？
A: 在 `app/api/` 目录下创建新的模块目录，并在 `main.api` 中导入。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建 Pull Request

## 许可证

MIT License

## 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your-email@example.com]
- 项目地址: [GitHub Repository URL]

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持用户管理、商品管理、质押挖矿、DAO 治理
- 集成 Web3 钱包认证
- 支持多语言（中英文）
- 基于 go-zero 微服务框架
- 完整的项目结构组织
