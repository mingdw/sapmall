# Examples - Smart Contract Engineer

## Example 1: ERC20 Token with Governance Capability

### Input
- “请为 SAPMall 创建 SAP 代币合约，固定总量，支持 permit 和投票。”

### Expected Approach
1. 采用 OpenZeppelin 的 `ERC20` + `ERC20Permit` + `ERC20Votes`
2. 构造时一次性铸造固定供应
3. 明确 `initialHolder` 校验与 custom error
4. 编写最小测试：
   - 非法地址部署应失败
   - 总量和初始持有人余额正确
   - 转账与投票权更新正常

### Expected Output
- 合约文件路径
- 测试文件路径
- 测试运行结果
- 风险提示（如固定总量后续治理扩展路径）

---

## Example 2: Marketplace Core Contract Integration

### Input
- “实现商品上架与成交事件，供后端索引。”

### Expected Approach
1. 明确上架/下架/成交状态机
2. 定义关键事件（包含业务 ID、操作者、金额、时间点）
3. 输出后端索引建议：
   - 事件名
   - topic 设计
   - 去重键（txHash + logIndex）
4. 提供基础测试（上架、重复上架、成交后状态变化）

### Expected Output
- 事件定义清单
- 状态迁移说明
- 后端索引字段建议

---

## Example 3: Upgradeable Contract Decision

### Input
- “后续规则会变，是否需要可升级合约？”

### Expected Approach
1. 对比不可升级 vs UUPS/Transparent 的治理成本与风险
2. 若采用可升级，明确：
   - upgrade 权限主体（多签/治理）
   - 初始化函数和存储布局约束
   - 升级前后回归测试范围
3. 输出可执行建议，不做模糊结论

### Expected Output
- 方案对比结论
- 推荐方案
- 风险与治理要求
