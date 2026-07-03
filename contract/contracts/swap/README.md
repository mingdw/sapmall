# SAPSwapRouter 合约说明

## 概述

SAPSwapRouter 是一个用于将稳定币兑换为 SAP 代币的路由器合约。它支持多种稳定币、固定汇率和手续费机制。

## 合约架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   用户钱包       │     │  SAPSwapRouter  │     │    SAPToken     │
│                 │     │                 │     │                 │
│  USDC/USDT/EURC │────▶│  1. 验证参数    │     │                 │
│                 │     │  2. 计算汇率    │────▶│  mintForExchange│
│                 │     │  3. 收取手续费  │     │  铸造SAP给用户  │
└─────────────────┘     │  4. 转移稳定币  │     └─────────────────┘
                        └─────────────────┘
```

## 核心功能

### 1. 兑换功能
- **swap()**: 将稳定币兑换为 SAP
- **quoteSwap()**: 查询兑换报价

### 2. 配置管理
- **addStablecoin()**: 添加支持的稳定币
- **removeStablecoin()**: 移除支持的稳定币
- **updateRate()**: 更新汇率
- **updateFee()**: 更新手续费

### 3. 查询功能
- **isStablecoinSupported()**: 检查代币是否支持
- **getStablecoinConfig()**: 获取代币配置
- **getSwapStats()**: 获取兑换统计

## 使用流程

### 1. 部署合约

```bash
# 设置环境变量
export SAP_TOKEN_ADDRESS=0x...
export FEE_RECIPIENT=0x...

# 部署
npx hardhat run scripts/deploy-swap.ts --network arcTestnet
```

### 2. 添加支持的稳定币

```typescript
// 添加USDC
await swapRouter.addStablecoin(
  "0x3600000000000000000000000000000000000000", // USDC地址
  6,                                           // 精度
  "USDC",                                      // 符号
  100000000                                    // 汇率：1 USDC = 100 SAP (考虑精度)
);

// 添加EURC
await swapRouter.addStablecoin(
  "0xEURC_ADDRESS",
  6,
  "EURC",
  110000000 // 1 EURC = 110 SAP
);
```

### 3. 用户兑换

```typescript
// 1. 用户授权
await usdc.approve(swapRouter.address, amount);

// 2. 查询报价
const [amountOut, fee] = await swapRouter.quoteSwap(
  usdc.address,
  amount,
  0 // STABLE_TO_SAP
);

// 3. 执行兑换
await swapRouter.swap(
  usdc.address,
  amount,
  amountOut * 0.99, // 1%滑点保护
  0 // STABLE_TO_SAP
);
```

## 汇率计算

### 公式
```
amountOut = (amountIn - fee) * rateToSAP / 10^decimals
```

### 示例
- 输入：100 USDC
- 汇率：1 USDC = 100 SAP
- 手续费：1%
- 输出：100 * 0.99 * 100 = 9900 SAP

## 手续费机制

- 默认手续费：1%（100基点）
- 最大手续费：5%（500基点）
- 手续费从输入金额中扣除
- 手续费发送到指定地址

## 安全机制

1. **UUPS可升级**: 支持合约升级
2. **访问控制**: 基于角色的权限管理
3. **暂停功能**: 紧急情况可暂停合约
4. **重入保护**: 防止重入攻击
5. **滑点保护**: 用户可设置最小输出金额

## 角色说明

| 角色 | 权限 |
|------|------|
| DEFAULT_ADMIN | 管理其他角色 |
| UPGRADER | 升级合约 |
| PAUSER | 暂停/恢复合约 |
| CONFIG_ROLE | 更新配置参数 |

## 测试

```bash
# 运行测试
npx hardhat test test/swap/SAPSwapRouter.ts

# 运行测试并生成覆盖率报告
npx hardhat coverage
```

## 前端集成

### React Hook 示例

```typescript
import { useContractWrite, useContractRead } from 'wagmi';
import { parseUnits, formatEther } from 'viem';

export function useSAPSwap() {
  const { write: swap } = useContractWrite({
    address: SWAP_ROUTER_ADDRESS,
    abi: SAP_SWAP_ROUTER_ABI,
    functionName: 'swap',
  });

  const executeSwap = async (
    tokenAddress: string,
    amount: string,
    minAmountOut: string
  ) => {
    const amountIn = parseUnits(amount, 6);
    const minOut = parseUnits(minAmountOut, 18);

    swap({
      args: [tokenAddress, amountIn, minOut, 0],
    });
  };

  return { executeSwap };
}
```

## 注意事项

1. **SAPToken权限**: 需要给SwapRouter授予EXCHANGE_ROLE
2. **兑换上限**: 受SAPToken的兑换额度限制（2.5亿SAP）
3. **汇率管理**: 需要定期更新汇率以反映市场价格
4. **流动性**: 确保SAPToken有足够的可铸造额度

## 合约地址

- **Arc Testnet**: 待部署
- **Arc Mainnet**: 待部署

## 相关链接

- [SAPToken合约](../token/SAPToken.sol)
- [PaymentRouter合约](../payment/PaymentRouter.sol)
- [SettlementVault合约](../payment/SettlementVault.sol)
