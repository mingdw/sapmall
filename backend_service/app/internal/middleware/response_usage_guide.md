# 统一响应格式使用指南

## 问题解决

如果您遇到接口返回 `null` 而不是统一格式 `{"code":0,"message":"success","data":{}}`，请按照以下步骤修复：

## 🔧 修复步骤

### 1. 修改 Logic 层

确保 Logic 层返回正确的数据：

```go
// 错误示例 - 返回空数据
func (l *GetVersionLogic) GetVersion(req *types.VersionReq) (resp *types.VersionResp, err error) {
    // todo: add your logic here and delete this line
    return  // ❌ 返回空数据
}

// 正确示例 - 返回实际数据
func (l *GetVersionLogic) GetVersion(req *types.VersionReq) (resp *types.VersionResp, err error) {
    resp = &types.VersionResp{
        Version:   "1.0.0",
        BuildTime: "2024-01-01T00:00:00Z",
        GitCommit: "abc123def456",
        GoVersion: runtime.Version(),
    }
    return
}
```

### 2. 修改 Handler 层

使用 ResponseHelper 而不是 go-zero 的 httpx 方法：

```go
// 错误示例 - 使用 httpx.OkJsonCtx
func GetVersionHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // ... 解析请求
        resp, err := l.GetVersion(&req)
        if err != nil {
            httpx.ErrorCtx(r.Context(), w, err)  // ❌ 不使用统一格式
        } else {
            httpx.OkJsonCtx(r.Context(), w, resp)  // ❌ 不使用统一格式
        }
    }
}

// 正确示例 - 使用 ResponseHelper
func GetVersionHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req types.VersionReq
        if err := httpx.Parse(r, &req); err != nil {
            helper := middleware.NewResponseHelper(w)
            helper.ParamError("参数解析失败")
            return
        }

        l := common.NewGetVersionLogic(r.Context(), svcCtx)
        resp, err := l.GetVersion(&req)
        if err != nil {
            helper := middleware.NewResponseHelper(w)
            helper.SystemError("获取版本信息失败")
            return
        }

        // ✅ 使用统一响应格式
        helper := middleware.NewResponseHelper(w)
        helper.Success(resp)
    }
}
```

### 3. 确保中间件配置正确

在 `service_context.go` 中使用 UnifiedResponseMiddleware：

```go
func NewServiceContext(c config.Config) *ServiceContext {
    return &ServiceContext{
        Config:         c,
        Redis:          redis,
        GormDB:         db,
        AuthMiddleware: middleware.NewAuthMiddleware().Handle,
        RespMiddleware: middleware.NewUnifiedResponseMiddleware().Handle,  // ✅ 使用统一响应中间件
    }
}
```

## 📊 响应格式对比

### 修复前 (错误格式)
```json
null
```

### 修复后 (正确格式)
```json
{
    "code": 0,
    "message": "success",
    "data": {
        "version": "1.0.0",
        "build_time": "2024-01-01T00:00:00Z",
        "git_commit": "abc123def456",
        "go_version": "go1.19"
    }
}
```

## 🧪 测试方法

### 1. 使用 curl 测试
```bash
# 测试版本接口
curl -s "http://localhost:8888/api/common/version" | jq .

# 测试健康检查接口
curl -s "http://localhost:8888/api/common/health?service=sapphire-mall" | jq .
```

### 2. 使用测试脚本
```bash
chmod +x test_response.sh
./test_response.sh
```

## 🔍 常见问题

### Q1: 为什么返回 null？
A1: 通常是因为 Logic 层返回了空数据，或者 Handler 使用了 `httpx.OkJsonCtx` 而不是 ResponseHelper。

### Q2: 如何确保所有接口都使用统一格式？
A2: 
1. 所有 Handler 都使用 `middleware.NewResponseHelper(w)`
2. 使用 `helper.Success(data)` 返回成功响应
3. 使用 `helper.Error(code, message, data)` 返回错误响应

### Q3: 中间件没有生效怎么办？
A3: 检查以下几点：
1. 确保在 `service_context.go` 中使用了 `NewUnifiedResponseMiddleware().Handle`
2. 确保在路由配置中正确注册了中间件
3. 检查中间件顺序是否正确

## 📝 最佳实践

### 1. Handler 模板
```go
func YourHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // 1. 解析请求
        var req types.YourReq
        if err := httpx.Parse(r, &req); err != nil {
            helper := middleware.NewResponseHelper(w)
            helper.ParamError("参数解析失败")
            return
        }

        // 2. 调用 Logic
        l := logic.NewYourLogic(r.Context(), svcCtx)
        resp, err := l.YourMethod(&req)
        if err != nil {
            helper := middleware.NewResponseHelper(w)
            helper.SystemError("操作失败")
            return
        }

        // 3. 返回统一格式响应
        helper := middleware.NewResponseHelper(w)
        helper.Success(resp)
    }
}
```

### 2. Logic 模板
```go
func (l *YourLogic) YourMethod(req *types.YourReq) (resp *types.YourResp, err error) {
    // 确保返回实际数据，不要返回空
    resp = &types.YourResp{
        // 填充实际数据
        Field1: "value1",
        Field2: "value2",
    }
    return
}
```

## 🎯 总结

要解决返回 `null` 的问题，关键是：

1. ✅ Logic 层返回实际数据
2. ✅ Handler 层使用 ResponseHelper
3. ✅ 中间件配置使用 UnifiedResponseMiddleware
4. ✅ 测试验证响应格式

按照这个步骤，您的接口就会返回正确的统一格式：`{"code":0,"message":"success","data":{}}` 