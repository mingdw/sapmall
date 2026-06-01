# Phase 1 订单支付合约

## 网络

| 网络 | Hardhat network | chainId | USDC（预置到 PlatformConfig） |
|------|-----------------|---------|--------------------------------|
| Linea Sepolia | `lineaSepolia` | `59141` | `0xFEce4462D57bD51A6A552365A011b95f0E16d9B7` |
| Arc Testnet | `arcTestnet` | `5042002` | `0x3600000000000000000000000000000000000000` |

## PlatformConfig 键（部署支付合约前必须已配置）

| key | valueType | 示例 value |
|-----|-----------|------------|
| `payment.token.usdc` | `address` | 上表 USDC 地址 |
| `payment.chain.id` | `number` | `59141` 或 `5042002` |

`status` 必须为 `0`（启用）。

## 合约

| 合约 | 升级 | 说明 |
|------|------|------|
| `SettlementVault` | 否 | 托管 USDC；`depositFromRouter` 仅 Router |
| `PaymentRouter` | UUPS | `payOrder` 入口 |

## `payOrder`

```solidity
function payOrder(
    string calldata intentId,
    string calldata orderRef,
    address token,
    uint256 amount
) external;
```

- `intentId`：非空，链上幂等（重复 revert）
- `orderRef`：非空，最大 64 字节
- `token`：必须等于 Config 中 `payment.token.usdc`
- `amount`：> 0（不与后端 intent 金额链上强校验）
- `block.chainid` 必须等于 `payment.chain.id`

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

**indexed 说明**：EVM 每条日志最多 3 个 indexed 参数（除事件签名外）。因此 `token`、`amount`、`timestamp` 在 **data** 中编码；监听方用 ABI 解码即可。  
`string` 类型 indexed 时 topic 为 `keccak256(string)`，按明文过滤需用相同哈希。

## 部署

1. 使用**新的安全 EOA** 作为 `PAYMENT_ADMIN`（勿与旧测试私钥混用、勿提交 `.env`）。
2. 在 PlatformConfig 写入上表两个 key。
3. 配置 `contract/.env`（参考 `.env.example`）。
4. 执行：

```bash
cd contract
npx hardhat run scripts/deploy-payment.ts --network lineaSepolia
npx hardhat run scripts/deploy-payment.ts --network arcTestnet
```

5. 将输出的 `paymentRouter`、`settlementVault` 记入部署清单。

## 测试

```bash
cd contract
npx hardhat test test/payment/PaymentRouter.ts
```

## 安全提醒

- `PAYMENT_ADMIN` / 部署私钥仅放本地 `.env`，轮换后更新 Vault `DEFAULT_ADMIN` 与 Router 角色。
- Phase 1 无 `emergencyWithdraw`；`release` 调用将 `revert SettlementNotEnabled()`。
