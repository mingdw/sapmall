# CCTP 减签名跨链兑换 — 验收与运维 Runbook

## 成功标准

- 测试网完成一笔：**Base Sepolia USDC → Arc USDC（CCTP V2）→ SAP（SAPSwapRouter）**
- 常规路径（源链已授权）用户钱包确认约 **2 次**：`depositForBurn` + Arc `swap`
- 首次可能 **3 次**（额外 `approve`）
- Intent 状态可查询、可对账：`created → burned → attested → minted → swapped`

## 前置

1. 执行迁移：`docs/migrations/20260722_sys_cctp_swap_intent.sql
2. 若表已存在需补字段：`docs/migrations/20260723_alter_sys_cctp_swap_intent_meta.sql``
2. Arc 上 `SAPSwapRouter` 已配置 USDC，且用户钱包可切换 Base Sepolia / Arc Testnet
3. Relayer（推荐）：在 `etc/sapmall*.yaml` 配置：

```yaml
Cctp:
  Enabled: true
  IrisBaseURL: "https://iris-api-sandbox.circle.com"
  RelayerPrivateKey: "<hex>"
  ArcRPC: "https://rpc.testnet.arc.network"
  ArcMessageTransmitter: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275"
  PollIntervalSec: 12
```

未配置 `RelayerPrivateKey` 时：意图停在 `attested`，需人工/脚本调 `receiveMessage` 后再 swap。

## E2E 步骤

1. DApp → Exchange → **跨链兑换 (CCTP)**
2. 输入 USDC 金额 → 开始跨链
3. 钱包切 Base Sepolia：approve（如需）+ `depositForBurn`
4. 等待 Attestation / Mint（轮询 intent）
5. 钱包切 Arc：approve（如需）+ `swap` USDC→SAP
6. 成功页展示完成；DB 中 `status=4 (swapped)`

## 失败与重试

| 场景 | 处理 |
|------|------|
| 用户拒签 burn | 可重新 create intent |
| Attestation 超时 | Relayer 持续轮询 burned；检查 Iris sandbox / burn tx |
| Mint 成功 Swap 失败 | 意图已 `minted`，前端仅重试 Arc swap |
| 重复 mint | MessageTransmitter `usedNonces` 防双花；Relayer 幂等按 message_hash |

## 配置参考

- 合约配置：[`contract/deployments/cctp-v2.json`](../../contract/deployments/cctp-v2.json)
- 前端：[`web_client/sapmall-dapp/src/config/cctp.ts`](../../web_client/sapmall-dapp/src/config/cctp.ts)
- 后端说明：[`CCTP.md`](./CCTP.md)

## 签名次数口径（对外）

| 场景 | 次数 |
|------|------|
| 常规（已授权） | 2：burn + Arc swap |
| 首次 | 3：approve + burn + swap |
| 未来 Composer | 1：仅源链 burn |

## 已知限制（MVP）

- 仅 MVP 路由 Base Sepolia → Arc Testnet
- Arc 官方 USDC 未必支持 EIP-2612；`swapWithPermit` 已上合约，前端默认仍走 approve+swap
- Relayer 无私钥时不会自动 mint
- 未做 AA / Permit2 / Composer（压到 1 签留给后续）
