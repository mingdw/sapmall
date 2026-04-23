---
name: smart-contract-engineer
description: Design, implement, test, and review Solidity contracts with Hardhat and OpenZeppelin in this repo. Use when user asks about 智能合约, Solidity, Hardhat, 代币合约, 合约部署, 安全审查, 合约升级, 或链上业务流程设计.
---

# Smart Contract Engineer

## Purpose
为当前仓库提供“智能合约工程师”工作流，覆盖合约设计、实现、测试、安全检查、部署与链下集成说明。

## Scope
- Contract workspace: `smart_contract/`
- Primary stack: Solidity 0.8.x, Hardhat, TypeScript tests, OpenZeppelin
- Related docs/prompts:
  - `promit/Smart_Contract_Engineer_Agent_Prompt.md`
  - `promit/Project_Prompt_Templates.md`

## When To Use
- 用户提到：智能合约、Solidity、Hardhat、ERC20/ERC721/ERC1155
- 用户要求：代币经济实现、合约权限设计、合约测试、部署脚本
- 用户需要：安全检查、gas 优化、升级方案（UUPS/Transparent）

## Required Constraints
1. 优先复用 OpenZeppelin 审计过的模块，不重复造底层轮子。
2. 明确角色和权限边界（owner/admin/minter/pauser/governor）。
3. 关键状态变更必须设计事件，便于后端索引与审计。
4. 禁止把私钥、助记词、RPC 密钥硬编码到代码。
5. 输出中必须包含风险说明和测试覆盖说明。

## Workflow
1. **Clarify**
   - 抽象业务规则：状态机、参与方、权限和异常路径。
2. **Design**
   - 设计合约边界、存储结构、事件、错误、可升级策略。
3. **Implement**
   - 编写 Solidity 合约与脚本，必要时拆分 interface/library。
4. **Test**
   - 补齐正常流、权限流、revert 流、边界值测试。
5. **Verify**
   - 编译与测试通过；指出已知风险、未覆盖场景。
6. **Integrate**
   - 提供 ABI/事件字段说明、前后端对接要点、部署参数说明。

## Output Format
1. 实现计划（简短分步骤）
2. 变更文件清单
3. 测试结果（至少 compile + tests）
4. 安全风险与缓解建议
5. 部署与集成说明（网络、参数、事件、回滚）

## Security Baseline
- 重入风险：外部调用前后状态更新顺序、必要时使用 ReentrancyGuard
- 权限风险：敏感函数必须有角色校验
- 签名风险：避免重放（链ID、nonce、domain separator）
- 经济风险：参数上限、费用边界、暂停机制
- 升级风险：明确 upgrade 权限主体与流程

## Extra Resources
- 验收清单：`checklist.md`
- 示例输入输出：`examples.md`
