import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useChainConfigStore } from '../../../store/chainConfigStore';
import { getArcPaymentTokenConfig, type WalletErc20Config } from '../../../config/walletTokens';

/**
 * 获取兑换页代币配置（地址 + 精度 + 符号）。
 * 优先从后端 chain_config 获取，降级到硬编码。
 * @param chainIdOverride 指定链（跨链报价时传 Arc）
 */
export function useExchangeTokenConfig(
  symbol: string,
  chainIdOverride?: number,
): WalletErc20Config | undefined {
  const { chainId: walletChainId } = useAccount();
  const store = useChainConfigStore();
  const chainId = chainIdOverride ?? walletChainId;

  return useMemo(() => {
    if (!chainId || !symbol) return undefined;

    // 优先从 Store 获取
    const fromStore = store.getTokenConfig(chainId, symbol);
    if (fromStore) {
      return {
        address: fromStore.contractAddress as `0x${string}`,
        decimals: fromStore.decimals,
        symbol: fromStore.symbol,
      };
    }

    // 降级到硬编码
    return getArcPaymentTokenConfig(symbol, chainId);
  }, [chainId, symbol, store]);
}
