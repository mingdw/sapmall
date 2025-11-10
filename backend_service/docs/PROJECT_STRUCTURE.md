# Sapphire Mall 项目结构详解

## 项目整体架构

```
backend_service/
├── app/                   # 🏠 应用程序主目录
├── cmd/                   # 🛠️ 命令行工具
├── deploy/                # 🚀 部署相关文件
├── docs/                  # 📚 文档目录
├── etc/                   # ⚙️ 配置文件
├── pkg/                   # 📦 公共包
├── scripts/               # 📜 脚本文件
├── test/                  # 🧪 测试文件
├── go.mod                 # 📋 Go模块文件
├── go.sum                 # 🔒 依赖校验文件
└── main.go                # 🎯 主程序入口
```

## 详细目录结构

### 1. app/ - 应用程序主目录

```
app/
├── api/                   # 📡 API定义文件
│   ├── main.api          # 🎯 主API文件 (支持import)
│   ├── common/           # 🔧 通用API模块
│   │   └── common.api    # 健康检查、版本信息
│   ├── user/             # 👤 用户API模块
│   │   └── user.api      # 用户注册、登录、信息管理
│   ├── product/          # 🛍️ 商品API模块
│   │   └── product.api   # 商品CRUD、审核
│   └── dao/              # 🏛️ DAO治理API模块
│       └── dao.api       # 提案、投票
├── internal/             # 🔒 内部包
│   ├── handler/          # 🎮 HTTP处理器
│   ├── logic/            # 🧠 业务逻辑
│   ├── svc/              # 🔧 服务上下文
│   ├── types/            # 📝 类型定义
│   ├── config/           # ⚙️ 配置结构
│   ├── middleware/       # 🔗 中间件
│   ├── enums/            # 📊 枚举定义
│   └── utils/            # 🛠️ 工具函数
├── etc/                  # ⚙️ 配置文件
│   ├── sapmall.yaml      # 📄 默认配置
│   ├── sapmall_dev.yaml  # 🛠️ 开发环境配置
│   └── sapmall_test.yaml # 🧪 测试环境配置
├── task/                 # ⏰ 定时任务
└── sapmall_start.go      # 🚀 应用程序入口
```

### 2. cmd/ - 命令行工具 (待开发)

```
cmd/
├── cli/                  # 🖥️ 命令行工具
├── migrate/              # 🗄️ 数据库迁移工具
└── admin/                # 👨‍💼 管理工具
```

### 3. deploy/ - 部署相关文件 (待开发)

```
deploy/
├── docker/               # 🐳 Docker相关文件
│   ├── Dockerfile        # 📦 Docker镜像文件
│   └── docker-compose.yml # 🐙 Docker编排文件
├── k8s/                  # ☸️ Kubernetes配置
│   ├── deployment.yaml   # 🚀 部署配置
│   ├── service.yaml      # 🌐 服务配置
│   └── ingress.yaml      # 🛣️ 入口配置
└── scripts/              # 📜 部署脚本
    ├── deploy.sh         # 🚀 部署脚本
    └── rollback.sh       # ↩️ 回滚脚本
```

### 4. docs/ - 文档目录

```
docs/
├── API.md                # 📖 API接口文档
├── QUICK_START.md        # 🚀 快速开始指南
├── PROJECT_STRUCTURE.md  # 📁 项目结构说明
├── DEPLOYMENT.md         # 🚀 部署指南
├── DEVELOPMENT.md        # 👨‍💻 开发指南
└── init_data.sql         # 🗄️ 数据库初始化脚本
```

### 5. etc/ - 配置文件 (根目录)

```
etc/
└── config.yaml           # ⚙️ 主配置文件
```

### 6. pkg/ - 公共包 (待开发)

```
pkg/
├── auth/                 # 🔐 认证相关
├── blockchain/           # ⛓️ 区块链集成
├── database/             # 🗄️ 数据库操作
├── cache/                # 💾 缓存相关
├── logger/               # 📝 日志工具
└── utils/                # 🛠️ 通用工具
```

### 7. scripts/ - 脚本文件 (待开发)

```
scripts/
├── build.sh              # 🔨 构建脚本
├── test.sh               # 🧪 测试脚本
├── lint.sh               # 🔍 代码检查脚本
└── release.sh            # 🚀 发布脚本
```

### 8. test/ - 测试文件 (待开发)

```
test/
├── unit/                 # 🧪 单元测试
├── integration/          # 🔗 集成测试
├── e2e/                  # 🎯 端到端测试
└── performance/          # ⚡ 性能测试
```

## 模块说明

### API 模块 (app/api/)

| 模块 | 功能 | 主要接口 |
|------|------|----------|
| **common** | 通用服务 | 健康检查、版本信息 |
| **user** | 用户管理 | 注册、登录、信息管理 |
| **product** | 商品管理 | CRUD、审核、查询 |
| **dao** | DAO治理 | 提案、投票、统计 |

### 内部包 (app/internal/)

| 包 | 功能 | 主要组件 |
|------|------|----------|
| **handler** | HTTP处理器 | 请求处理、响应格式化 |
| **logic** | 业务逻辑 | 核心业务逻辑实现 |
| **svc** | 服务上下文 | 依赖注入、服务配置 |
| **types** | 类型定义 | 数据结构、接口定义 |
| **config** | 配置结构 | 配置项定义 |
| **middleware** | 中间件 | 认证、日志、限流 |
| **enums** | 枚举定义 | 状态码、类型枚举 |
| **utils** | 工具函数 | 通用工具函数 |

## 开发流程

### 1. API 开发流程

```mermaid
graph LR
    A[定义API] --> B[生成代码]
    B --> C[实现逻辑]
    C --> D[添加中间件]
    D --> E[测试验证]
    E --> F[部署上线]
```

### 2. 模块开发流程

1. **在 `app/api/` 下创建模块目录**
2. **定义 API 接口**
3. **生成代码结构**
4. **实现业务逻辑**
5. **添加单元测试**
6. **集成测试验证**

### 3. 配置管理

```yaml
# 开发环境
app/etc/sapmall_dev.yaml

# 测试环境  
app/etc/sapmall_test.yaml

# 生产环境
app/etc/sapmall_prod.yaml
```

## 最佳实践

### 1. 代码组织

- **模块化**: 每个功能模块独立
- **分层架构**: API -> Logic -> Service -> Repository
- **依赖注入**: 通过 svc 管理依赖
- **配置分离**: 不同环境使用不同配置

### 2. 命名规范

- **目录名**: 小写字母，用下划线分隔
- **文件名**: 小写字母，用下划线分隔
- **结构体**: 驼峰命名，首字母大写
- **接口名**: 驼峰命名，以 er 结尾
- **常量**: 全大写，用下划线分隔

### 3. 错误处理

- **统一错误码**: 在 enums 中定义
- **错误日志**: 记录详细的错误信息
- **用户友好**: 返回用户可理解的错误信息

### 4. 性能优化

- **缓存策略**: 合理使用 Redis 缓存
- **数据库优化**: 索引优化、连接池配置
- **并发控制**: 使用 goroutine 和 channel
- **监控指标**: 收集关键性能指标

## 部署架构

### 开发环境

```bash
# 本地开发
cd app
go run sapmall_start.go -f etc/sapmall_dev.yaml
```

### 生产环境

```bash
# Docker 部署
docker build -t sapphire-mall .
docker run -d -p 8080:8080 sapphire-mall

# Kubernetes 部署
kubectl apply -f deploy/k8s/
```

## 监控和运维

### 日志管理

- **结构化日志**: JSON 格式输出
- **日志级别**: DEBUG, INFO, WARN, ERROR
- **日志轮转**: 按大小和时间轮转

### 监控指标

- **系统指标**: CPU, 内存, 磁盘
- **应用指标**: QPS, 响应时间, 错误率
- **业务指标**: 用户数, 交易量, 活跃度

### 告警机制

- **系统告警**: 资源使用率告警
- **应用告警**: 错误率、响应时间告警
- **业务告警**: 关键业务指标告警

## 扩展指南

### 添加新模块

1. **创建模块目录**: `app/api/newmodule/`
2. **定义 API**: `app/api/newmodule/newmodule.api`
3. **更新主 API**: 在 `app/api/main.api` 中导入
4. **生成代码**: `goctl api go -api api/main.api -dir .`
5. **实现逻辑**: 在 `app/internal/logic/` 中实现

### 添加新功能

1. **定义接口**: 在对应的 `.api` 文件中添加
2. **生成代码**: 使用 goctl 生成
3. **实现逻辑**: 在 logic 包中实现
4. **添加测试**: 编写单元测试和集成测试
5. **更新文档**: 更新 API 文档

### 配置管理

1. **添加配置项**: 在 `app/internal/config/` 中定义
2. **更新配置文件**: 在各个环境的配置文件中添加
3. **使用配置**: 在代码中通过依赖注入使用

这个项目结构设计遵循了 Go 语言的最佳实践，支持高并发、高可用的微服务架构，便于团队协作和功能扩展。 