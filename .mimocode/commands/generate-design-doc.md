---
name: generate-design-doc
description: Generate a feature design document following the standard template structure.
---

# Generate Design Document

## Template Structure

Generate a feature design document with the following sections:

```markdown
# [Feature Name] 设计文档

## 1. 简介
- **功能名称**: [Name]
- **功能描述**: [Brief description]
- **目标用户**: [Target users]
- **核心价值**: [Key value proposition]

## 2. 功能设计

### 2.1 功能流程
[Flow diagram or step-by-step description]

### 2.2 核心功能点
- [Feature 1]
- [Feature 2]
- [Feature 3]

### 2.3 业务规则
- [Rule 1]
- [Rule 2]

## 3. 数据库设计

### 3.1 新增表
```sql
CREATE TABLE table_name (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  -- fields
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3.2 字段说明
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键 |

## 4. 接口设计

### 4.1 接口列表
| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 创建 | POST | /api/xxx | 创建记录 |

### 4.2 接口详情
#### POST /api/xxx
**请求参数**:
```json
{
  "field": "value"
}
```

**响应**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

## 5. 开发计划与分支管理

### 5.1 分支策略
- 功能分支: `feature/xxx`
- 合并到: `develop`

### 5.2 开发任务
| 任务 | 负责人 | 预估工时 | 状态 |
|------|--------|----------|------|
| 后端开发 | - | X天 | 待开始 |

## 7. 发版计划与清单管理

### 7.1 发版时间
- [ ] 后端部署
- [ ] 前端部署
- [ ] 合约部署

### 7.2 验收清单
- [ ] 功能测试通过
- [ ] 性能测试通过
- [ ] 安全审查完成
```

## Usage

When user says "生成设计文档" or "功能设计文档", generate a document following this template.

Fill in the sections based on the feature being designed.

## Notes

- Section numbering jumps from 5 to 7 (no section 6) - this is the user's convention
- Reference: `docs/无船水运平台10万运费限制设计文档.md`
