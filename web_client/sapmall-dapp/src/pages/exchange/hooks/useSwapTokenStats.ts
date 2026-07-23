import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { swapRouterAbi } from '../../../config/abis/swapRouterAbi';
import { useSwapRouterAddress } from './useSwapRouterAddress';
import { useChainConfigStore } from '../../../store/chainConfigStore';
import { ARC_TESTNET_CHAIN_ID } from '../../../config/chains/arcTestnet';

export interface TokenSwapStat {
  symbol: string;
  /** 已兑换总量（合约余额 + 已提取），按代币精度格式化 */
  amount: string;
  rawAmount: bigint;
  decimals: number;
}

interface UseSwapTokenStatsResult {
  tokenStats: TokenSwapStat[];
  isLoading: boolean;
}

/**
 * 读取合约中每个支持代币的已兑换数量。
 *
 * 已兑换 = getStablecoinBalance(token) + totalWithdrawn(token)
 * 固定读 Arc Testnet（SAP 兑换发生在 Arc），与钱包当前链无关。
 */
export function useSwapTokenStats(): UseSwapTokenStatsResult {
  const routerAddress = useSwapRouterAddress(ARC_TESTNET_CHAIN_ID);
  const store = useChainConfigStore();

  // 从 Arc 链配置获取支付代币（排除 SAP，SAP 是输出代币）
  const paymentTokens = useMemo(() => {
    return store
      .getPaymentTokens(ARC_TESTNET_CHAIN_ID)
      .filter((t) => t.symbol.toUpperCase() !== 'SAP');
  }, [store]);

  // 构建批量读取调用：每个代币读 getStablecoinBalance + totalWithdrawn
  const contracts = useMemo(() => {
    if (!routerAddress || paymentTokens.length === 0) return [];
    const calls: {
      address: `0x${string}`;
      abi: typeof swapRouterAbi;
      functionName: string;
      args: readonly unknown[];
      chainId: number;
    }[] = [];
    for (const token of paymentTokens) {
      const tokenAddr = token.contractAddress as `0x${string}`;
      calls.push({
        address: routerAddress,
        abi: swapRouterAbi,
        functionName: 'getStablecoinBalance',
        args: [tokenAddr],
        chainId: ARC_TESTNET_CHAIN_ID,
      });
      calls.push({
        address: routerAddress,
        abi: swapRouterAbi,
        functionName: 'totalWithdrawn',
        args: [tokenAddr],
        chainId: ARC_TESTNET_CHAIN_ID,
      });
    }
    return calls;
  }, [routerAddress, paymentTokens]);

  const { data: rawResults, isLoading } = useReadContracts({
    contracts: contracts.length > 0 ? contracts : undefined,
    query: {
      enabled: contracts.length > 0,
      refetchInterval: 60_000,
    },
  });

  const tokenStats = useMemo<TokenSwapStat[]>(() => {
    if (!rawResults || paymentTokens.length === 0) return [];
    const stats: TokenSwapStat[] = [];
    for (let i = 0; i < paymentTokens.length; i++) {
      const balanceRes = rawResults[i * 2];
      const withdrawnRes = rawResults[i * 2 + 1];
      const token = paymentTokens[i];

      const balance = (balanceRes?.result as bigint) ?? 0n;
      const withdrawn = (withdrawnRes?.result as bigint) ?? 0n;
      const rawAmount = balance + withdrawn;

      stats.push({
        symbol: token.symbol,
        amount: formatUnits(rawAmount, token.decimals),
        rawAmount,
        decimals: token.decimals,
      });
    }
    return stats;
  }, [rawResults, paymentTokens]);

  return {
    tokenStats,
    isLoading,
  };
}
