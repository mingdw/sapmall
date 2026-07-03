import { useChainConfigStore } from '../store/chainConfigStore';

/** 兑换页 SwapCard 支持的上游代币（从链配置动态获取） */
export function getExchangeSwapTokens(): string[] {
  const store = useChainConfigStore.getState();
  if (store.loaded) {
    // 收集所有链的支付代币，去重
    const symbolSet = new Set<string>();
    for (const chain of store.chains) {
      if (chain.status !== 0) continue;
      for (const token of chain.paymentTokens) {
        symbolSet.add(token.symbol);
      }
    }
    return Array.from(symbolSet);
  }

  // 降级：硬编码
  return ['USDT', 'USDC', 'BUSD', 'DAI', 'BNB', 'SOL'];
}

// 兼容旧代码的常量导出
export const EXCHANGE_SWAP_TOKENS = ['USDT', 'USDC', 'BUSD', 'DAI', 'BNB', 'SOL'] as const;

export type ExchangeSwapToken = (typeof EXCHANGE_SWAP_TOKENS)[number];
