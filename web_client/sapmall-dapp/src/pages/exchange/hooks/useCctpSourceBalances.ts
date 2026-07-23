import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import { erc20Abi, formatUnits, type Address } from 'viem';
import { CCTP_CHAINS, CCTP_SOURCE_KEYS, type CctpChainKey } from '../../../config/cctp';
import { config } from '../../../config/wagmi';

export type CctpSourceBalance = {
  raw: bigint;
  formatted: string;
  /** 可用于选择（余额 > 0） */
  selectable: boolean;
  loading: boolean;
  error?: string;
};

type BalanceMap = Partial<Record<CctpChainKey, CctpSourceBalance>>;

const EMPTY: CctpSourceBalance = {
  raw: 0n,
  formatted: '0.00',
  selectable: false,
  loading: true,
};

/** 单链 RPC 超时：避免 Amoy 等慢节点拖死整批 */
const PER_CHAIN_TIMEOUT_MS = 4_000;
/** 同地址短缓存：再打开下拉可秒开 */
const CACHE_TTL_MS = 30_000;

type CacheEntry = {
  at: number;
  balances: BalanceMap;
};

const balanceCache = new Map<string, CacheEntry>();

function formatUsdc(raw: bigint, decimals: number): string {
  const n = Number(formatUnits(raw, decimals));
  if (!Number.isFinite(n)) return '0.00';
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(`${label} 超时`));
    }, ms);
    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        window.clearTimeout(timer);
        reject(err);
      });
  });
}

async function readOneBalance(
  key: CctpChainKey,
  address: Address,
): Promise<CctpSourceBalance> {
  const chain = CCTP_CHAINS[key];
  const client = getPublicClient(config, {
    chainId: chain.chainId as (typeof config.chains)[number]['id'],
  });
  if (!client) {
    return {
      raw: 0n,
      formatted: '0.00',
      selectable: false,
      loading: false,
      error: 'RPC 不可用',
    };
  }

  const raw = await withTimeout(
    client.readContract({
      address: chain.usdc as Address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    }),
    PER_CHAIN_TIMEOUT_MS,
    chain.name,
  );

  return {
    raw,
    formatted: formatUsdc(raw, chain.usdcDecimals),
    selectable: raw > 0n,
    loading: false,
  };
}

/**
 * 并行读取各 CCTP 源链 USDC 余额。
 * - 逐链回填：先返回的先展示，不再等最慢的那条
 * - 单链超时：慢/挂掉的 RPC 不阻塞其它链
 * - 短缓存：30s 内同地址秒开，后台静默刷新
 */
export function useCctpSourceBalances(enabled = true): {
  balances: BalanceMap;
  isLoading: boolean;
  /** 至少有一条链已出结果（可用于提前自动优选） */
  hasAnyResult: boolean;
  refetch: () => void;
} {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState<BalanceMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const requestIdRef = useRef(0);

  const refetch = useCallback(() => {
    if (address) balanceCache.delete(address.toLowerCase());
    setTick((n) => n + 1);
  }, [address]);

  useEffect(() => {
    if (!enabled || !isConnected || !address) {
      setBalances({});
      setIsLoading(false);
      return;
    }

    const cacheKey = address.toLowerCase();
    const cached = balanceCache.get(cacheKey);
    const cacheFresh = cached && Date.now() - cached.at < CACHE_TTL_MS;

    // 有缓存先展示，避免下拉空白等待
    if (cacheFresh) {
      setBalances(cached.balances);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setBalances((prev) => {
        const next: BalanceMap = { ...prev };
        for (const key of CCTP_SOURCE_KEYS) {
          const old = next[key];
          next[key] = old && !old.loading
            ? { ...old, loading: true }
            : { ...EMPTY };
        }
        return next;
      });
    }

    const requestId = ++requestIdRef.current;
    let settled = 0;
    const snapshot: BalanceMap = cacheFresh ? { ...cached.balances } : {};

    const finishIfDone = () => {
      if (settled < CCTP_SOURCE_KEYS.length) return;
      if (requestId !== requestIdRef.current) return;
      balanceCache.set(cacheKey, { at: Date.now(), balances: { ...snapshot } });
      setIsLoading(false);
    };

    for (const key of CCTP_SOURCE_KEYS) {
      void (async () => {
        let value: CctpSourceBalance;
        try {
          value = await readOneBalance(key, address);
        } catch (err) {
          value = {
            raw: 0n,
            formatted: '0.00',
            selectable: false,
            loading: false,
            error: err instanceof Error ? err.message : '读取失败',
          };
        }

        if (requestId !== requestIdRef.current) return;
        snapshot[key] = value;
        settled += 1;
        // 逐链回填：先出结果的先显示
        setBalances((prev) => ({ ...prev, [key]: value }));
        finishIfDone();
      })();
    }

    return () => {
      // 递增 requestId 使在途请求结果失效
      requestIdRef.current += 1;
    };
  }, [address, isConnected, enabled, tick]);

  const hasAnyResult = CCTP_SOURCE_KEYS.some((key) => {
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
