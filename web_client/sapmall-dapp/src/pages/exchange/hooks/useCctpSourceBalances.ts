import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { CCTP_SOURCE_KEYS, type CctpChainKey } from '../../../config/cctp';
import {
  clearCctpBalanceCache,
  ensureAllCctpSourceBalances,
  getCctpBalanceCacheEntry,
  isCctpBalanceCacheFresh,
  subscribeCctpBalanceCache,
  type CctpBalanceMap,
  type CctpSourceBalance,
} from '../../../services/cctpSourceBalances';

export type { CctpSourceBalance };

/**
 * 读取各 CCTP 源链 USDC 余额（优先共享缓存，由 App 预取填充）。
 * - 缓存新鲜：直接展示，缺链再补拉
 * - 缓存过期 / 强制 refetch：并行拉全量源链
 */
export function useCctpSourceBalances(enabled = true): {
  balances: CctpBalanceMap;
  isLoading: boolean;
  /** 至少有一条链已出结果（可用于提前自动优选） */
  hasAnyResult: boolean;
  refetch: () => void;
} {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState<CctpBalanceMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => {
    if (address) clearCctpBalanceCache(address);
    setTick((n) => n + 1);
  }, [address]);

  // 订阅共享缓存，预取结果即时回填到面板
  useEffect(() => {
    if (!enabled || !address) return;
    const syncFromCache = () => {
      const entry = getCctpBalanceCacheEntry(address);
      if (entry) setBalances(entry.balances);
    };
    syncFromCache();
    return subscribeCctpBalanceCache(syncFromCache);
  }, [address, enabled]);

  useEffect(() => {
    if (!enabled || !isConnected || !address) {
      setBalances({});
      setIsLoading(false);
      return;
    }

    const cacheFresh = isCctpBalanceCacheFresh(address);
    const cached = getCctpBalanceCacheEntry(address)?.balances;
    if (cached) {
      setBalances(cached);
    }

    // 缓存完整且新鲜：不再打 RPC
    if (cacheFresh && cached) {
      const missing = CCTP_SOURCE_KEYS.some((key) => !cached[key] || cached[key]?.loading);
      if (!missing) {
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    const ac = new AbortController();

    void (async () => {
      try {
        // 手动 refetch 已清缓存；否则缓存新鲜时只补缺链
        await ensureAllCctpSourceBalances(address, {
          signal: ac.signal,
        });
      } finally {
        if (!ac.signal.aborted) {
          setIsLoading(false);
          const entry = getCctpBalanceCacheEntry(address);
          if (entry) setBalances(entry.balances);
        }
      }
    })();

    return () => {
      ac.abort();
    };
  }, [address, isConnected, enabled, tick]);

  const hasAnyResult = CCTP_SOURCE_KEYS.some((key: CctpChainKey) => {
    const bal = balances[key];
    return bal && !bal.loading;
  });

  return {
    balances,
    isLoading,
    hasAnyResult,
    refetch,
  };
}
