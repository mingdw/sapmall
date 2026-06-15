# Phase 1 订单支付合约

## 设计说明

Phase 1 **不依赖 PlatformConfig**。支付 token 与 chainId 在 `PaymentRouter.initialize` 时由 `PAYMENT_ADMIN` 写入；运营配置以 admin 后台 `sys_chain_network` / `sys_chain_payment_token` 为准，后端下发 intent 参数包时做完整校验。

链上仍保留最小校验：`payOrder` 仅接受 `paymentToken`，且 `block.chainid == expectedChainId`。

## 网络

| 网络 | Hardhat network | chainId | USDC（Arc 官方 ERC-20） |
|------|-----------------|---------|-------------------------|
| Linea Sepolia | `lineaSepolia` | `59141` | `0xFEce4462D57bD51A6A552365A011b95f0E16d9B7` |
| Arc Testnet | `arcTestnet` | `5042002` | `0x3600000000000000000000000000000000000000` |

## 合约

| 合约 | 升级 | admin |
|------|------|-------|
| `SettlementVault` | 否 | `PAYMENT_ADMIN` |
| `PaymentRouter` | UUPS | `PAYMENT_ADMIN`（含 UPGRADER / PAUSER） |

## `initialize`

```solidity
function initialize(
    address admin,
    address settlementVault_,
    address paymentToken_,
    uint256 expectedChainId_
) external;
```

## `payOrder`

```solidity
function payOrder(
    string calldata intentId,
    string calldata orderRef,
    address token,
    uint256 amount
) external;
```

- `token` 必须等于 `paymentToken`
- `block.chainid` 必须等于 `expectedChainId`
- `intentId` 链上幂等；`orderRef` 最长 64 字节

## 事件 `PaymentPaid`（Phase 2 监听）

```solidity
event PaymentPaid(
    string indexed intentId,
    string indexed orderRef,
    address indexed payer,
    address token,
    uint256 amount,
    uint256 timestamp
);
```

## 部署

1. 配置 `contract/.env`（见 `.env.example`）
2. 执行：

```bash
cd contract
npm run deploy:payment:arc
# 或
npm run deploy:payment:arc:full
```

3. 产物：`deployments/5042002.json`，将 `paymentRouter`、`settlementVault` 写入 admin 链配置

## 测试

```bash
cd contract
npm run test:payment
```

## 安全提醒

- 私钥仅放本地 `.env`，勿提交仓库
- Phase 1 无分账 `release`、无退款；`release` 调用 revert
- 更换 USDC 地址：admin 调用 `setPaymentToken`（一般与后台配置同步更新）
