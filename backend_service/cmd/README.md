# sapctl 代码生成工具

`sapctl` 是 Sapphire Mall 项目的代码生成工具，用于快速生成 Model 和 Repository 层代码，提高开发效率。

## 📦 编译生成 sapctl.exe

### 前置要求

- Go 1.19 或更高版本
- 已安装项目依赖（运行 `go mod tidy`）

### 编译步骤

#### Windows 系统

```bash
# 进入项目根目录
cd backend_service

# 编译生成 sapctl.exe
go build -o sapctl.exe cmd/sapctl/main.go

# 或者指定输出路径
go build -o bin/sapctl.exe cmd/sapctl/main.go
```

#### Linux/Mac 系统

```bash
# 进入项目根目录
cd backend_service

# 编译生成 sapctl 可执行文件
go build -o sapctl cmd/sapctl/main.go

# 或者指定输出路径
go build -o bin/sapctl cmd/sapctl/main.go
```

### 验证安装

编译完成后，可以通过以下命令验证：

```bash
# Windows
.\sapctl.exe --help

# Linux/Mac
./sapctl --help
```

如果看到帮助信息，说明编译成功。

## 🚀 使用指南

### 基本命令结构

```bash
sapctl create [command] [entity-name] [flags]
```

### 可用命令

- `create model` - 仅生成数据模型（Model）
- `create repository` - 生成完整的数据访问层（Model + Repository）

---

## 📝 生成 Model

### 命令格式

```bash
sapctl create model [model-name] --table [table-name] [flags]
```

### 参数说明

| 参数 | 简写 | 必需 | 说明 | 默认值 |
|------|------|------|------|--------|
| `--table` | `-t` | ✅ | 数据库表名 | - |
| `--fields` | `-f` | ❌ | 自定义字段定义 | 空 |
| `--output` | `-o` | ❌ | 输出目录 | `app/internal/model` |

### 字段定义格式

字段定义格式：`字段名:类型:标签`

- **字段名**: 数据库字段名（下划线命名，如 `user_name`）
- **类型**: Go 类型（如 `string`, `int64`, `float64`, `bool`, `time.Time`）
- **标签**: 字段标签（可选值：`primary`, `required`, `unique`）

### 默认字段

所有生成的 Model 都会自动包含以下默认字段：

- `ID` (int64) - 主键ID
- `CreateAt` (time.Time) - 创建时间
- `UpdateAt` (time.Time) - 更新时间
- `IsDeleted` (bool) - 软删除标记
- `Creator` (string) - 创建人
- `Updator` (string) - 更新人

### 使用示例

#### 示例 1: 生成基础 Model（仅默认字段）

```bash
sapctl create model user --table users
```

生成文件：`app/internal/model/user.go`

#### 示例 2: 生成带自定义字段的 Model

```bash
sapctl create model product --table products --fields "name:string:required,price:float64,stock:int64,status:int"
```

#### 示例 3: 指定输出目录

```bash
sapctl create model category --table categories --fields "name:string:required,parent_id:int64" --output app/internal/model
```

#### 示例 4: 复杂字段定义

```bash
sapctl create model order --table orders --fields "order_no:string:unique,user_id:int64:required,total_amount:float64,status:int,created_time:time.Time"
```

---

## 🗄️ 生成 Repository

### 命令格式

```bash
sapctl create repository [entity-name] --table [table-name] [flags]
```

### 参数说明

| 参数 | 简写 | 必需 | 说明 | 默认值 |
|------|------|------|------|--------|
| `--table` | `-t` | ✅ | 数据库表名 | - |
| `--fields` | `-f` | ❌ | 自定义字段定义 | 空 |
| `--output` | `-o` | ❌ | 输出目录 | `app/internal` |

### 生成内容

`create repository` 命令会生成：

1. **Model 文件** (`app/internal/model/[entity].go`)
   - 结构体定义
   - 表名映射
   - 字段标签

2. **Repository 文件** (`app/internal/repository/[entity].go`)
   - Repository 接口定义
   - Repository 实现
   - 基础 CRUD 操作：
     - `Create` - 创建记录
     - `GetByID` - 根据ID查询
     - `GetBy[UniqueField]` - 根据唯一字段查询（自动生成）
     - `Update` - 更新记录
     - `Delete` - 删除记录（软删除）
     - `List` - 分页列表查询

### 使用示例

#### 示例 1: 生成基础 Repository（仅默认字段）

```bash
sapctl create repository user --table users
```

生成文件：
- `app/internal/model/user.go`
- `app/internal/repository/user.go`

#### 示例 2: 生成带自定义字段的 Repository

```bash
sapctl create repository product --table products --fields "name:string:required,price:float64,stock:int64,status:int"
```

#### 示例 3: 带唯一字段的 Repository（自动生成 GetBy 方法）

```bash
sapctl create repository user --table users --fields "username:string:unique,email:string:unique,phone:string:unique"
```

对于标记为 `unique` 的字段，会自动生成对应的查询方法：
- `GetByUsername(ctx, username)`
- `GetByEmail(ctx, email)`
- `GetByPhone(ctx, phone)`

#### 示例 4: 指定输出目录

```bash
sapctl create repository category --table categories --fields "name:string:required,parent_id:int64" --output app/internal
```

---

## 📋 字段标签说明

| 标签 | 说明 | 示例 |
|------|------|------|
| `primary` | 主键字段 | `id:int64:primary` |
| `required` | 必填字段 | `name:string:required` |
| `unique` | 唯一字段 | `email:string:unique` |

**注意**：
- 标记为 `unique` 的字段会自动生成对应的 `GetBy[FieldName]` 查询方法
- 所有 Model 默认包含 `ID` 主键字段，无需重复定义

---

## 🎯 完整示例

### 场景：创建商品（Product）模块

#### 1. 生成 Repository（推荐）

```bash
sapctl create repository product --table products --fields "name:string:required,code:string:unique,price:float64,stock:int64,status:int,description:string"
```

生成的文件：
- `app/internal/model/product.go` - 商品模型
- `app/internal/repository/product.go` - 商品数据访问层

#### 2. 使用生成的代码

```go
// 在 logic 中使用
import (
    "sapphire-mall/app/internal/repository"
    "sapphire-mall/app/internal/model"
)

// 创建 repository 实例
productRepo := repository.NewProductRepository(svcCtx.GormDB)

// 创建商品
product := &model.Product{
    Name: "测试商品",
    Code: "PROD001",
    Price: 99.99,
    Stock: 100,
    Status: 1,
}
err := productRepo.Create(ctx, product)

// 根据编码查询（自动生成的方法）
product, err := productRepo.GetByCode(ctx, "PROD001")

// 根据ID查询
product, err := productRepo.GetByID(ctx, 1)

// 分页列表
products, total, err := productRepo.List(ctx, 0, 10)
```

---

## ⚙️ 高级选项

### 详细输出模式

使用 `-v` 或 `--verbose` 标志启用详细输出：

```bash
sapctl -v create repository user --table users
```

### 查看帮助信息

```bash
# 查看主命令帮助
sapctl --help

# 查看 create 命令帮助
sapctl create --help

# 查看 model 命令帮助
sapctl create model --help

# 查看 repository 命令帮助
sapctl create repository --help
```

---

## 📌 注意事项

1. **表名必需**：`--table` 参数是必需的，必须指定数据库表名
2. **字段格式**：字段定义使用冒号分隔，多个字段用逗号分隔
3. **命名规范**：
   - 字段名使用下划线命名（如 `user_name`）
   - 工具会自动转换为驼峰命名（如 `UserName`）
4. **默认字段**：所有 Model 都会自动包含默认字段，无需手动定义
5. **唯一字段**：标记为 `unique` 的字段会自动生成对应的查询方法
6. **文件覆盖**：如果目标文件已存在，会被覆盖，请注意备份

---

## 🔧 故障排除

### 问题：编译失败

**解决方案**：
```bash
# 确保在项目根目录
cd backend_service

# 更新依赖
go mod tidy

# 重新编译
go build -o sapctl.exe cmd/sapctl/main.go
```

### 问题：命令未找到

**解决方案**：
- Windows: 使用 `.\sapctl.exe` 或添加当前目录到 PATH
- Linux/Mac: 使用 `./sapctl` 或添加当前目录到 PATH

### 问题：字段解析错误

**解决方案**：
- 检查字段格式是否正确：`name:type:tag`
- 确保类型是有效的 Go 类型
- 多个字段用逗号分隔，不要有空格

---

## 📚 相关文档

- [项目 README](../../README.md)
- [开发文档](../../docs/DEVELOPMENT.md)
- [项目结构说明](../../docs/PROJECT_STRUCTURE.md)

---

## 💡 提示

- 建议先使用 `create repository` 命令生成完整的代码结构
- 如果只需要 Model，可以使用 `create model` 命令
- 生成后记得检查代码，根据实际需求进行调整
- 建议将生成的代码纳入版本控制
