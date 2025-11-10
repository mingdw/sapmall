# Sapphire Mall 后端快速开发指南

## 🚀 快速开始

### 1. 环境准备

确保您的开发环境满足以下要求：

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

# 配置数据库连接
# 编辑 etc/config.yaml 文件
```

### 4. 生成代码

```bash
# 生成所有API代码
goctl api go -api api/common.api -dir . -style go_zero
goctl api go -api api/user.api -dir . -style go_zero
goctl api go -api api/product.api -dir . -style go_zero
goctl api go -api api/dao.api -dir . -style go_zero
```

### 5. 启动服务

```bash
# 开发模式启动
go run main.go -f etc/config.yaml

# 或者编译后运行
go build -o sapphire-mall main.go
./sapphire-mall -f etc/config.yaml
```

## 📁 项目结构说明

```
backend_service/
├── api/                    # API 定义文件
│   ├── common.api         # 通用服务
│   ├── user.api           # 用户服务
│   ├── product.api        # 商品服务
│   └── dao.api            # DAO治理
├── internal/              # 内部包
│   ├── handler/           # HTTP 处理器
│   ├── logic/             # 业务逻辑
│   ├── svc/               # 服务上下文
│   ├── types/             # 类型定义
│   └── middleware/        # 中间件
├── etc/                   # 配置文件
├── pkg/                   # 公共包
└── docs/                  # 文档
```

## 🔧 开发流程

### 1. 添加新的API接口

#### 步骤1：定义API
在对应的 `.api` 文件中添加新的接口定义：

```go
// 在 user.api 中添加
type (
    UpdateUserReq {
        UserId string `json:"user_id"`
        Username string `json:"username"`
        Email string `json:"email"`
    }
    
    UpdateUserResp {
        Code int `json:"code"`
        Msg string `json:"msg"`
        UserInfo UserInfo `json:"user_info"`
    }
)

service UserService {
    @handler UpdateUser
    put /api/user/update (UpdateUserReq) returns (UpdateUserResp)
}
```

#### 步骤2：生成代码
```bash
goctl api go -api api/user.api -dir . -style go_zero
```

#### 步骤3：实现业务逻辑
在 `internal/logic/` 目录下实现具体的业务逻辑。

### 2. 添加中间件

```go
// 在 internal/middleware/ 目录下创建中间件
package middleware

import (
    "github.com/zeromicro/go-zero/rest"
)

func AuthMiddleware() rest.Middleware {
    return func(next http.HandlerFunc) http.HandlerFunc {
        return func(w http.ResponseWriter, r *http.Request) {
            // 实现认证逻辑
            next(w, r)
        }
    }
}
```

### 3. 数据库操作

```go
// 在 internal/logic/ 中实现数据库操作
func (l *CreateUserLogic) CreateUser(req *types.CreateUserReq) (*types.CreateUserResp, error) {
    // 数据库操作
    user := &model.User{
        Username: req.Username,
        Email:    req.Email,
    }
    
    result := l.svcCtx.DB.Create(user)
    if result.Error != nil {
        return nil, result.Error
    }
    
    return &types.CreateUserResp{
        Code: 200,
        Msg:  "success",
        UserInfo: &types.UserInfo{
            Id:       user.ID,
            Username: user.Username,
            Email:    user.Email,
        },
    }, nil
}
```

## 🧪 测试

### 单元测试

```bash
# 运行所有测试
go test ./internal/...

# 运行特定测试
go test ./internal/logic/user/...
```

### API 测试

```bash
# 健康检查
curl -X GET http://localhost:8080/api/health

# 用户注册
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x1234567890abcdef",
    "username": "testuser",
    "email": "test@example.com",
    "preferred_language": "zh"
  }'

# 用户登录
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x1234567890abcdef",
    "signature": "0x...",
    "message": "Login to Sapphire Mall"
  }'
```

## 🔒 安全配置

### JWT 配置

```yaml
# etc/config.yaml
Auth:
  AccessSecret: "your-jwt-secret-key"
  AccessExpire: 86400  # 24小时
```

### CORS 配置

```go
// 在 main.go 中配置 CORS
server := rest.MustNewServer(c.RestConf,
    rest.WithCors(),
)
```

### 限流配置

```yaml
# etc/config.yaml
RestConf:
  Port: 8080
  Timeout: 30000
  MaxConns: 1000
  MaxBytes: 1048576
```

## 📊 监控和日志

### 日志配置

```yaml
# etc/config.yaml
Log:
  ServiceName: sapphire-mall
  Mode: console
  Level: info
  Encoding: json
```

### 监控指标

```go
// 添加自定义指标
import "github.com/zeromicro/go-zero/core/metrics"

func (l *CreateUserLogic) CreateUser(req *types.CreateUserReq) (*types.CreateUserResp, error) {
    // 增加计数器
    metrics.IncCounter("user_register_total", 1)
    
    // 业务逻辑...
}
```

## 🚀 部署

### 开发环境

```bash
# 本地开发
go run main.go -f etc/config.yaml
```

### 生产环境

```bash
# 编译
go build -o sapphire-mall main.go

# 运行
./sapphire-mall -f /etc/sapphire-mall/config.yaml

# 或者使用 Docker
docker build -t sapphire-mall .
docker run -d -p 8080:8080 sapphire-mall
```

## 🔧 常见问题

### Q1: goctl 命令失败
A: 确保安装了正确版本的 goctl，并且 API 文件语法正确。

### Q2: 数据库连接失败
A: 检查数据库配置，确保数据库服务正在运行。

### Q3: API 接口返回 404
A: 检查路由配置，确保 handler 已正确注册。

### Q4: 跨域请求被阻止
A: 在服务配置中启用 CORS 支持。

## 📚 参考资源

- [go-zero 官方文档](https://go-zero.dev/)
- [Go 语言官方文档](https://golang.org/doc/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [Redis 官方文档](https://redis.io/documentation)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📞 联系方式

- 项目维护者: [Your Name]
- 邮箱: [your-email@example.com]
- 项目地址: [GitHub Repository URL] 