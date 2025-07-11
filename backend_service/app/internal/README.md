# Go-Zero 统一响应格式和中间件

本项目为 go-zero 框架提供了统一的响应格式、请求日志、错误处理等功能。

## 📁 目录结构

```
internal/
├── const/           # 常量定义
│   └── base_error_code.go
├── response/        # 统一响应处理
│   └── response.go
├── middleware/      # 中间件
│   ├── logger.go
│   ├── recovery.go
│   ├── middleware.go
│   └── gozero_adapter.go
├── validator/       # 请求验证
│   └── validator.go
└── handler/         # 示例处理器
    └── example_handler.go
```

## 🚀 快速开始

### 1. 在 main.go 中注册中间件

```go
package main

import (
    "sapphire-mall/app/internal/middleware"
    "github.com/zeromicro/go-zero/rest"
)

func main() {
    server := rest.MustNewServer(c.RestConf)
    
    // 注册中间件
    server.Use(middleware.LogMiddlewareForGoZero())
    server.Use(middleware.RecoveryMiddlewareForGoZero())
    
    // ... 其他代码
}
```

### 2. 在 handler 中使用统一响应

```go
package handler

import (
    "sapphire-mall/app/internal/response"
    "sapphire-mall/app/internal/validator"
    "github.com/gin-gonic/gin"
)

func ExampleHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        var req YourRequest
        
        // 验证请求参数
        if err := validator.ValidateAndBind(c, &req); err != nil {
            errors := validator.GetValidationErrors(err)
            response.ParamError(c, strings.Join(errors, "; "))
            return
        }
        
        // 业务逻辑
        data := YourBusinessLogic(req)
        
        // 返回成功响应
        response.Success(c, data)
    }
}
```

## 📋 功能特性

### 1. 统一响应格式

所有 API 响应都遵循以下格式：

```json
{
    "code": 0,
    "message": "成功",
    "data": {},
    "trace_id": "req-20231201123456"
}
```

### 2. 错误码定义

- **0**: 成功
- **10000-10099**: 系统错误
- **20000-29999**: 业务错误

### 3. 响应函数

```go
// 成功响应
response.Success(c, data)

// 错误响应
response.Error(c, code, message)
response.ParamError(c, message)
response.SystemError(c, message)
response.AuthError(c, message)
response.PermissionError(c, message)
response.NotFoundError(c, message)
response.DatabaseError(c, message)
response.CacheError(c, message)
response.BusinessError(c, message)
```

### 4. 请求验证

支持多种验证规则：

```go
type UserRequest struct {
    Name     string `json:"name" binding:"required" validate:"required,min=2,max=50"`
    Email    string `json:"email" binding:"required" validate:"required,email"`
    Phone    string `json:"phone" binding:"required" validate:"required,phone"`
    Password string `json:"password" binding:"required" validate:"required,password"`
}
```

### 5. 自定义验证器

```go
// 注册自定义验证器
validator.RegisterCustomValidators()

// 手机号验证: phone
// 身份证验证: idcard  
// 密码强度验证: password
```

### 6. 日志记录

自动记录以下信息：
- 请求ID
- 请求方法、路径、参数
- 客户端IP、User-Agent
- 响应状态、耗时
- 错误信息和堆栈

## 🔧 配置说明

### 1. 错误码配置

在 `const/base_error_code.go` 中定义错误码：

```go
const (
    SUCCESS = 0
    SYSTEM_ERROR = 10000
    PARAM_ERROR = 10001
    // ...
)
```

### 2. 中间件配置

在 `middleware/middleware.go` 中配置中间件：

```go
func RegisterMiddlewares(engine *gin.Engine) {
    engine.Use(RecoveryMiddleware())
    engine.Use(RequestLogMiddleware())
    engine.Use(ErrorHandlerMiddleware())
}
```

## 📝 使用示例

### 1. 基本使用

```go
func GetUserInfo(c *gin.Context) {
    var req GetUserInfoReq
    
    // 验证参数
    if err := validator.ValidateAndBind(c, &req); err != nil {
        response.ParamError(c, "参数验证失败")
        return
    }
    
    // 业务逻辑
    user, err := getUserByID(req.UserID)
    if err != nil {
        response.DatabaseError(c, "查询用户失败")
        return
    }
    
    // 返回成功
    response.Success(c, user)
}
```

### 2. 错误处理

```go
func CreateUser(c *gin.Context) {
    var req CreateUserReq
    
    // 参数验证
    if err := validator.ValidateAndBind(c, &req); err != nil {
        errors := validator.GetValidationErrors(err)
        response.ParamError(c, strings.Join(errors, "; "))
        return
    }
    
    // 业务验证
    if exists, _ := checkUserExists(req.Email); exists {
        response.BusinessError(c, "用户已存在")
        return
    }
    
    // 创建用户
    user, err := createUser(req)
    if err != nil {
        response.SystemError(c, "创建用户失败")
        return
    }
    
    response.Success(c, user)
}
```

## 🛠️ 扩展功能

### 1. 添加新的错误码

在 `const/base_error_code.go` 中添加：

```go
const (
    // 用户相关错误 (20000-20099)
    USER_NOT_FOUND = 20001
    USER_ALREADY_EXISTS = 20002
    USER_PASSWORD_ERROR = 20003
)
```

### 2. 添加新的验证器

在 `validator/validator.go` 中添加：

```go
func validateCustom(fl validator.FieldLevel) bool {
    // 自定义验证逻辑
    return true
}

func RegisterCustomValidators() {
    validate.RegisterValidation("custom", validateCustom)
}
```

### 3. 添加新的中间件

在 `middleware/` 目录下创建新的中间件文件。

## 📊 监控和调试

### 1. 日志格式

所有日志都采用 JSON 格式，便于日志分析：

```json
{
    "type": "request_start",
    "request_id": "req-20231201123456",
    "method": "POST",
    "path": "/api/user/create",
    "client_ip": "127.0.0.1",
    "timestamp": "2023-12-01T12:34:56Z"
}
```

### 2. 错误追踪

每个请求都有唯一的请求ID，便于追踪和调试。

### 3. 性能监控

自动记录请求耗时，便于性能分析。

## 🔒 安全考虑

1. **参数验证**: 所有输入都经过严格验证
2. **错误信息**: 生产环境不暴露详细错误信息
3. **日志脱敏**: 敏感信息在日志中脱敏处理
4. **请求限流**: 可集成限流中间件

## 📚 相关文档

- [Go-Zero 官方文档](https://go-zero.dev/)
- [Gin 框架文档](https://gin-gonic.com/)
- [Validator 文档](https://pkg.go.dev/github.com/go-playground/validator/v10) 