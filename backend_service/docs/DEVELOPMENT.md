# Sapphire Mall 开发指南

## 开发环境准备

### 1. 必需工具

```bash
# Go 版本 >= 1.19
go version

# 安装 goctl 工具
go install github.com/zeromicro/go-zero/tools/goctl@latest

# 验证安装
goctl --version
```

### 2. 开发工具推荐

- **IDE**: GoLand, VS Code (安装 Go 扩展)
- **数据库工具**: MySQL Workbench, Navicat
- **API 测试**: Postman, Insomnia
- **版本控制**: Git

### 3. 项目克隆

```bash
git clone <repository-url>
cd backend_service
go mod tidy
```

## 快速开始

### 1. 数据库设置

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE sapphire_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 初始化数据 (可选)
mysql -u root -p sapphire_mall < docs/init_data.sql
```

### 2. 配置文件

创建开发环境配置文件 `app/etc/sapmall_dev.yaml`:

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

# 日志配置
Log:
  ServiceName: "sapphire-mall"
  Mode: "console"
  Level: "info"
```

### 3. 生成代码

```bash
cd app

# 生成所有模块代码
goctl api go -api api/main.api -dir . -style go_zero

# 或者分别生成各个模块
goctl api go -api api/common/common.api -dir . -style go_zero
goctl api go -api api/user/user.api -dir . -style go_zero
goctl api go -api api/product/product.api -dir . -style go_zero
goctl api go -api api/staking/staking.api -dir . -style go_zero
goctl api go -api api/dao/dao.api -dir . -style go_zero
```

### 4. 启动服务

```bash
# 开发模式启动
go run sapmall_start.go -f etc/sapmall_dev.yaml

# 或者编译后运行
go build -o sapphire-mall sapmall_start.go
./sapphire-mall -f etc/sapmall_dev.yaml
```

## API 开发流程

### 1. 定义 API 接口

在 `app/api/` 目录下创建或修改 `.api` 文件：

```go
// app/api/user/user.api
syntax = "v1"

type (
    UserInfo {
        Id string `json:"id"`
        Username string `json:"username"`
        Email string `json:"email"`
        WalletAddress string `json:"wallet_address"`
        PreferredLanguage string `json:"preferred_language"`
        CreatedAt string `json:"created_at"`
        UpdatedAt string `json:"updated_at"`
    }
    
    CreateUserReq {
        Username string `json:"username"`
        Email string `json:"email"`
        WalletAddress string `json:"wallet_address"`
        PreferredLanguage string `json:"preferred_language"`
    }
    
    CreateUserResp {
        Code int `json:"code"`
        Msg string `json:"msg"`
        UserInfo UserInfo `json:"user_info"`
    }
    
    GetUserReq {
        Id string `path:"id"`
    }
    
    GetUserResp {
        Code int `json:"code"`
        Msg string `json:"msg"`
        UserInfo UserInfo `json:"user_info"`
    }
)

service UserService {
    @handler CreateUser
    post /api/user/create (CreateUserReq) returns (CreateUserResp)
    
    @handler GetUser
    get /api/user/{id} (GetUserReq) returns (GetUserResp)
}
```

### 2. 生成代码

```bash
cd app
goctl api go -api api/main.api -dir . -style go_zero
```

### 3. 实现业务逻辑

在 `app/internal/logic/` 目录下实现具体的业务逻辑：

```go
// app/internal/logic/user/createuserlogic.go
package logic

import (
    "context"
    "time"
    "github.com/zeromicro/go-zero/core/logx"
    "sapphire-mall/app/internal/svc"
    "sapphire-mall/app/internal/types"
)

type CreateUserLogic struct {
    logx.Logger
    ctx    context.Context
    svcCtx *svc.ServiceContext
}

func NewCreateUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *CreateUserLogic {
    return &CreateUserLogic{
        Logger: logx.WithContext(ctx),
        ctx:    ctx,
        svcCtx: svcCtx,
    }
}

func (l *CreateUserLogic) CreateUser(req *types.CreateUserReq) (resp *types.CreateUserResp, err error) {
    // 实现用户创建逻辑
    userInfo := &types.UserInfo{
        Id: "user_" + time.Now().Unix(),
        Username: req.Username,
        Email: req.Email,
        WalletAddress: req.WalletAddress,
        PreferredLanguage: req.PreferredLanguage,
        CreatedAt: time.Now().Format("2006-01-02 15:04:05"),
        UpdatedAt: time.Now().Format("2006-01-02 15:04:05"),
    }
    
    return &types.CreateUserResp{
        Code: 200,
        Msg: "success",
        UserInfo: *userInfo,
    }, nil
}
```

### 4. 添加中间件

在 `app/internal/middleware/` 目录下添加中间件：

```go
// app/internal/middleware/authmiddleware.go
package middleware

import (
    "net/http"
    "github.com/zeromicro/go-zero/rest/handler"
)

type AuthMiddleware struct {
}

func NewAuthMiddleware() *AuthMiddleware {
    return &AuthMiddleware{}
}

func (m *AuthMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // 实现认证逻辑
        // 例如：验证 JWT token
        
        next(w, r)
    }
}
```

## 数据库操作

### 1. 模型定义

在 `app/internal/types/` 目录下定义数据模型：

```go
// app/internal/types/user.go
package types

type User struct {
    Id                string `json:"id" db:"id"`
    Username          string `json:"username" db:"username"`
    Email             string `json:"email" db:"email"`
    WalletAddress     string `json:"wallet_address" db:"wallet_address"`
    PreferredLanguage string `json:"preferred_language" db:"preferred_language"`
    CreatedAt         string `json:"created_at" db:"created_at"`
    UpdatedAt         string `json:"updated_at" db:"updated_at"`
}
```

### 2. 数据库操作

使用 GORM 进行数据库操作：

```go
// app/internal/logic/user/createuserlogic.go
func (l *CreateUserLogic) CreateUser(req *types.CreateUserReq) (resp *types.CreateUserResp, err error) {
    user := &types.User{
        Id: "user_" + time.Now().Unix(),
        Username: req.Username,
        Email: req.Email,
        WalletAddress: req.WalletAddress,
        PreferredLanguage: req.PreferredLanguage,
        CreatedAt: time.Now().Format("2006-01-02 15:04:05"),
        UpdatedAt: time.Now().Format("2006-01-02 15:04:05"),
    }
    
    // 保存到数据库
    if err := l.svcCtx.DB.Create(user).Error; err != nil {
        return nil, err
    }
    
    return &types.CreateUserResp{
        Code: 200,
        Msg: "success",
        UserInfo: types.UserInfo{
            Id: user.Id,
            Username: user.Username,
            Email: user.Email,
            WalletAddress: user.WalletAddress,
            PreferredLanguage: user.PreferredLanguage,
            CreatedAt: user.CreatedAt,
            UpdatedAt: user.UpdatedAt,
        },
    }, nil
}
```

## 测试

### 1. 单元测试

```go
// app/internal/logic/user/createuserlogic_test.go
package logic

import (
    "testing"
    "context"
    "sapphire-mall/app/internal/types"
    "sapphire-mall/app/internal/svc"
)

func TestCreateUserLogic_CreateUser(t *testing.T) {
    ctx := context.Background()
    svcCtx := &svc.ServiceContext{}
    l := NewCreateUserLogic(ctx, svcCtx)
    
    req := &types.CreateUserReq{
        Username: "testuser",
        Email: "test@example.com",
        WalletAddress: "0x1234567890abcdef",
        PreferredLanguage: "zh",
    }
    
    resp, err := l.CreateUser(req)
    if err != nil {
        t.Errorf("CreateUser() error = %v", err)
        return
    }
    
    if resp.Code != 200 {
        t.Errorf("CreateUser() code = %v, want %v", resp.Code, 200)
    }
}
```

### 2. API 测试

使用 curl 或 Postman 测试 API：

```bash
# 创建用户
curl -X POST http://localhost:8888/api/user/create \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "wallet_address": "0x1234567890abcdef",
    "preferred_language": "zh"
  }'

# 获取用户信息
curl -X GET http://localhost:8888/api/user/user_1234567890
```

## 错误处理

### 1. 错误码定义

在 `app/internal/enums/` 目录下定义错误码：

```go
// app/internal/enums/error.go
package enums

const (
    SUCCESS = 200
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    INTERNAL_ERROR = 500
)

const (
    MSG_SUCCESS = "success"
    MSG_BAD_REQUEST = "bad request"
    MSG_UNAUTHORIZED = "unauthorized"
    MSG_FORBIDDEN = "forbidden"
    MSG_NOT_FOUND = "not found"
    MSG_INTERNAL_ERROR = "internal error"
)
```

### 2. 统一错误处理

```go
// app/internal/logic/user/createuserlogic.go
func (l *CreateUserLogic) CreateUser(req *types.CreateUserReq) (resp *types.CreateUserResp, err error) {
    // 参数验证
    if req.Username == "" {
        return &types.CreateUserResp{
            Code: enums.BAD_REQUEST,
            Msg: "username is required",
        }, nil
    }
    
    if req.Email == "" {
        return &types.CreateUserResp{
            Code: enums.BAD_REQUEST,
            Msg: "email is required",
        }, nil
    }
    
    // 业务逻辑...
    
    return &types.CreateUserResp{
        Code: enums.SUCCESS,
        Msg: enums.MSG_SUCCESS,
        UserInfo: userInfo,
    }, nil
}
```

## 日志记录

### 1. 日志配置

在配置文件中设置日志级别：

```yaml
Log:
  ServiceName: "sapphire-mall"
  Mode: "console"  # console, file
  Level: "info"    # debug, info, warn, error
  Path: "logs"     # 日志文件路径
```

### 2. 日志使用

```go
// app/internal/logic/user/createuserlogic.go
func (l *CreateUserLogic) CreateUser(req *types.CreateUserReq) (resp *types.CreateUserResp, err error) {
    l.Logger.Info("Creating user", logx.Field("username", req.Username))
    
    // 业务逻辑...
    
    l.Logger.Info("User created successfully", logx.Field("user_id", userInfo.Id))
    
    return resp, nil
}
```

## 性能优化

### 1. 缓存使用

```go
// app/internal/logic/user/getuserlogic.go
func (l *GetUserLogic) GetUser(req *types.GetUserReq) (resp *types.GetUserResp, err error) {
    // 先从缓存获取
    cacheKey := "user:" + req.Id
    userData, err := l.svcCtx.Redis.Get(l.ctx, cacheKey).Result()
    if err == nil {
        // 缓存命中，直接返回
        var user types.UserInfo
        json.Unmarshal([]byte(userData), &user)
        return &types.GetUserResp{
            Code: enums.SUCCESS,
            Msg: enums.MSG_SUCCESS,
            UserInfo: user,
        }, nil
    }
    
    // 缓存未命中，从数据库查询
    user, err := l.svcCtx.UserModel.FindOne(l.ctx, req.Id)
    if err != nil {
        return &types.GetUserResp{
            Code: enums.NOT_FOUND,
            Msg: "user not found",
        }, nil
    }
    
    // 写入缓存
    userData, _ = json.Marshal(user)
    l.svcCtx.Redis.Set(l.ctx, cacheKey, userData, time.Hour)
    
    return &types.GetUserResp{
        Code: enums.SUCCESS,
        Msg: enums.MSG_SUCCESS,
        UserInfo: *user,
    }, nil
}
```

### 2. 数据库优化

```go
// 使用索引
// 在数据库表中创建适当的索引

// 使用连接池
// 在配置文件中设置数据库连接池参数

// 使用事务
func (l *CreateUserLogic) CreateUser(req *types.CreateUserReq) (resp *types.CreateUserResp, err error) {
    tx := l.svcCtx.DB.Begin()
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
        }
    }()
    
    // 业务逻辑...
    
    if err := tx.Commit().Error; err != nil {
        tx.Rollback()
        return nil, err
    }
    
    return resp, nil
}
```

## 部署

### 1. 开发环境

```bash
cd app
go run sapmall_start.go -f etc/sapmall_dev.yaml
```

### 2. 生产环境

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

## 常见问题

### Q: goctl 命令执行失败？
A: 确保 Go 版本 >= 1.19，并且 goctl 工具已正确安装。

### Q: 数据库连接失败？
A: 检查数据库配置，确保数据库服务正在运行，并且连接字符串正确。

### Q: API 接口返回 404？
A: 检查路由配置，确保 API 路径正确，并且 handler 已正确注册。

### Q: 如何添加新的 API 模块？
A: 在 `app/api/` 目录下创建新的模块目录，定义 API 文件，然后在 `main.api` 中导入。

### Q: 如何处理跨域请求？
A: 在中间件中添加 CORS 配置，或者使用 go-zero 的 CORS 中间件。

### Q: 如何实现用户认证？
A: 使用 JWT 中间件，在请求头中携带 token，在中间件中验证 token 的有效性。

## 开发规范

### 1. 代码规范

- 遵循 Go 官方代码规范
- 使用 `gofmt` 格式化代码
- 添加必要的注释和文档
- 使用有意义的变量和函数名

### 2. Git 工作流

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 提交代码
git add .
git commit -m "feat: add new feature"

# 推送到远程
git push origin feature/new-feature

# 创建 Pull Request
```

### 3. 代码审查

- 提交前进行自我审查
- 使用 lint 工具检查代码质量
- 确保测试覆盖率
- 更新相关文档

这个开发指南涵盖了从环境准备到代码部署的完整流程，帮助开发者快速上手项目开发。 