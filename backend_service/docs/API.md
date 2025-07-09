# Sapphire Mall API 文档

## 概述

Sapphire Mall 后端 API 提供完整的 Web3 虚拟商品交易平台功能，包括用户管理、商品管理、质押挖矿和 DAO 治理。

## 基础信息

- **Base URL**: `http://localhost:8080`
- **API 版本**: v1
- **认证方式**: JWT Token + Web3 钱包签名
- **数据格式**: JSON

## 通用响应格式

所有 API 响应都遵循以下格式：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 认证

### JWT Token

在请求头中添加 Authorization：

```
Authorization: Bearer <your-jwt-token>
```

### Web3 钱包签名

对于需要钱包签名的接口，需要在请求体中包含签名信息：

```json
{
  "wallet_address": "0x1234567890abcdef",
  "signature": "0x...",
  "message": "Login to Sapphire Mall"
}
```

## API 接口

### 1. 通用服务 (Common Service)

#### 健康检查

```http
GET /api/health
```

**请求参数：**
```json
{
  "service": "sapphire-mall"
}
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "service": "sapphire-mall",
  "status": "healthy",
  "time": 1640995200
}
```

#### 获取版本信息

```http
GET /api/version
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "version": "1.0.0",
  "build_time": "2024-01-01T00:00:00Z",
  "git_commit": "abc123def456",
  "go_version": "go1.19"
}
```

### 2. 用户服务 (User Service)

#### 用户注册

```http
POST /api/user/register
```

**请求体：**
```json
{
  "wallet_address": "0x1234567890abcdef",
  "username": "testuser",
  "email": "test@example.com",
  "preferred_language": "zh"
}
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "user_info": {
    "id": "user_123",
    "wallet_address": "0x1234567890abcdef",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "kyc_status": "pending",
    "preferred_language": "zh",
    "created_at": 1640995200,
    "updated_at": 1640995200
  }
}
```

#### 用户登录

```http
POST /api/user/login
```

**请求体：**
```json
{
  "wallet_address": "0x1234567890abcdef",
  "signature": "0x...",
  "message": "Login to Sapphire Mall"
}
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_info": {
    "id": "user_123",
    "wallet_address": "0x1234567890abcdef",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "kyc_status": "verified",
    "preferred_language": "zh",
    "created_at": 1640995200,
    "updated_at": 1640995200
  }
}
```

#### 获取用户信息

```http
GET /api/user/info?user_id=user_123
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "user_info": {
    "id": "user_123",
    "wallet_address": "0x1234567890abcdef",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "kyc_status": "verified",
    "preferred_language": "zh",
    "created_at": 1640995200,
    "updated_at": 1640995200
  }
}
```

### 3. 商品服务 (Product Service)

#### 创建商品

```http
POST /api/product/create
```

**请求体：**
```json
{
  "creator_id": "user_123",
  "title_en": "Digital Art NFT",
  "title_zh": "数字艺术NFT",
  "description_en": "Unique digital artwork",
  "description_zh": "独特的数字艺术作品",
  "price": "0.1",
  "category": "art",
  "ipfs_hash": "QmHash...",
  "inventory": 100
}
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "product_info": {
    "id": "product_456",
    "creator_id": "user_123",
    "title_en": "Digital Art NFT",
    "title_zh": "数字艺术NFT",
    "description_en": "Unique digital artwork",
    "description_zh": "独特的数字艺术作品",
    "price": "0.1",
    "category": "art",
    "status": "pending",
    "ipfs_hash": "QmHash...",
    "inventory": 100,
    "sales_count": 0,
    "created_at": 1640995200,
    "updated_at": 1640995200
  }
}
```

#### 获取商品信息

```http
GET /api/product/info?product_id=product_456
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "product_info": {
    "id": "product_456",
    "creator_id": "user_123",
    "title_en": "Digital Art NFT",
    "title_zh": "数字艺术NFT",
    "description_en": "Unique digital artwork",
    "description_zh": "独特的数字艺术作品",
    "price": "0.1",
    "category": "art",
    "status": "approved",
    "ipfs_hash": "QmHash...",
    "inventory": 100,
    "sales_count": 5,
    "created_at": 1640995200,
    "updated_at": 1640995200
  }
}
```

#### 商品列表

```http
GET /api/product/list?page=1&page_size=10&category=art&status=approved
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "products": [
    {
      "id": "product_456",
      "creator_id": "user_123",
      "title_en": "Digital Art NFT",
      "title_zh": "数字艺术NFT",
      "description_en": "Unique digital artwork",
      "description_zh": "独特的数字艺术作品",
      "price": "0.1",
      "category": "art",
      "status": "approved",
      "ipfs_hash": "QmHash...",
      "inventory": 100,
      "sales_count": 5,
      "created_at": 1640995200,
      "updated_at": 1640995200
    }
  ],
  "total": 1
}
```

#### 审核商品

```http
POST /api/product/review
```

**请求体：**
```json
{
  "product_id": "product_456",
  "status": "approved",
  "review_comment": "商品符合平台规范"
}
```

### 4. 质押服务 (Staking Service)

#### 获取流动性池列表

```http
GET /api/staking/pools?page=1&page_size=10&network_id=1
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "pools": [
    {
      "id": "pool_789",
      "token_a": "ETH",
      "token_b": "USDT",
      "reserve_a": "1000.0",
      "reserve_b": "2000000.0",
      "total_supply": "1000000.0",
      "fee_rate": "0.003",
      "contract_address": "0x...",
      "network_id": "1",
      "created_at": 1640995200,
      "updated_at": 1640995200
    }
  ],
  "total": 1
}
```

#### 质押

```http
POST /api/staking/stake
```

**请求体：**
```json
{
  "user_id": "user_123",
  "pool_id": "pool_789",
  "amount": "100.0",
  "token_a_amount": "50.0",
  "token_b_amount": "100000.0"
}
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "staking_info": {
    "id": "staking_101",
    "user_id": "user_123",
    "pool_id": "pool_789",
    "staked_amount": "100.0",
    "earned_rewards": "5.0",
    "apy": "0.12",
    "start_time": 1640995200,
    "last_update_time": 1640995200
  }
}
```

#### 解除质押

```http
POST /api/staking/unstake
```

**请求体：**
```json
{
  "user_id": "user_123",
  "pool_id": "pool_789",
  "amount": "50.0"
}
```

#### 获取用户质押信息

```http
GET /api/staking/user?user_id=user_123&pool_id=pool_789
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "staking_list": [
    {
      "id": "staking_101",
      "user_id": "user_123",
      "pool_id": "pool_789",
      "staked_amount": "100.0",
      "earned_rewards": "5.0",
      "apy": "0.12",
      "start_time": 1640995200,
      "last_update_time": 1640995200
    }
  ],
  "total_staked": "100.0",
  "total_earned": "5.0"
}
```

### 5. DAO 治理服务 (DAO Service)

#### 创建提案

```http
POST /api/dao/proposal/create
```

**请求体：**
```json
{
  "creator_id": "user_123",
  "title": "增加新的流动性池",
  "description": "建议增加 ETH-USDC 流动性池以提高平台流动性",
  "proposal_type": "governance",
  "start_time": 1640995200,
  "end_time": 1641600000
}
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "proposal_info": {
    "id": "proposal_202",
    "creator_id": "user_123",
    "title": "增加新的流动性池",
    "description": "建议增加 ETH-USDC 流动性池以提高平台流动性",
    "proposal_type": "governance",
    "status": "active",
    "voting_power": "1000000.0",
    "yes_votes": "600000.0",
    "no_votes": "200000.0",
    "abstain_votes": "100000.0",
    "start_time": 1640995200,
    "end_time": 1641600000,
    "created_at": 1640995200,
    "updated_at": 1640995200
  }
}
```

#### 提案列表

```http
GET /api/dao/proposal/list?page=1&page_size=10&status=active
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "proposals": [
    {
      "id": "proposal_202",
      "creator_id": "user_123",
      "title": "增加新的流动性池",
      "description": "建议增加 ETH-USDC 流动性池以提高平台流动性",
      "proposal_type": "governance",
      "status": "active",
      "voting_power": "1000000.0",
      "yes_votes": "600000.0",
      "no_votes": "200000.0",
      "abstain_votes": "100000.0",
      "start_time": 1640995200,
      "end_time": 1641600000,
      "created_at": 1640995200,
      "updated_at": 1640995200
    }
  ],
  "total": 1
}
```

#### 投票

```http
POST /api/dao/vote
```

**请求体：**
```json
{
  "user_id": "user_123",
  "proposal_id": "proposal_202",
  "vote": "yes",
  "reason": "支持增加流动性池"
}
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "vote_info": {
    "id": "vote_303",
    "user_id": "user_123",
    "proposal_id": "proposal_202",
    "vote": "yes",
    "voting_power": "10000.0",
    "reason": "支持增加流动性池",
    "created_at": 1640995200
  }
}
```

#### 获取用户投票信息

```http
GET /api/dao/vote/user?user_id=user_123&proposal_id=proposal_202
```

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "vote_info": {
    "id": "vote_303",
    "user_id": "user_123",
    "proposal_id": "proposal_202",
    "vote": "yes",
    "voting_power": "10000.0",
    "reason": "支持增加流动性池",
    "created_at": 1640995200
  }
}
```

## 错误处理

### 错误响应格式

```json
{
  "code": 400,
  "msg": "Invalid request parameters",
  "details": {
    "field": "wallet_address",
    "error": "Invalid wallet address format"
  }
}
```

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 请求参数错误 | 检查请求参数格式和必填字段 |
| 401 | 未授权 | 检查 JWT token 是否有效 |
| 403 | 禁止访问 | 检查用户权限 |
| 404 | 资源不存在 | 检查资源 ID 是否正确 |
| 429 | 请求频率过高 | 降低请求频率 |
| 500 | 服务器内部错误 | 联系技术支持 |

## 限流规则

- **通用接口**: 1000 请求/分钟
- **认证接口**: 100 请求/分钟
- **文件上传**: 10 请求/分钟

## 最佳实践

1. **使用 HTTPS**: 生产环境必须使用 HTTPS
2. **参数验证**: 客户端应验证所有必填参数
3. **错误处理**: 妥善处理 API 错误响应
4. **缓存策略**: 合理使用缓存减少请求
5. **重试机制**: 实现指数退避重试策略

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持用户管理、商品管理、质押挖矿、DAO 治理
- 集成 Web3 钱包认证
- 支持多语言（中英文） 