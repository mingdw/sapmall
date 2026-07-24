import { getPublicClient } from 'wagmi/actions';
import { erc20Abi, formatUnits, type Address } from 'viem';
import { CCTP_CHAINS, CCTP_SOURCE_KEYS, type CctpChainKey } from '../config/cctp';
import { config } from '../config/wagmi';
import { useChainConfigStore, type ChainNetwork } from '../store/chainConfigStore';

export type CctpSourceBalance = {
  raw: bigint;
  formatted: string;
  /** 可用于选择（余额 > 0） */
  selectable: boolean;
  loading: boolean;
  error?: string;
};

export type CctpBalanceMap = Partial<Record<CctpChainKey, CctpSourceBalance>>;

/** 单链 RPC 超时：避免 Amoy 等慢节点拖死整批 */
const PER_CHAIN_TIMEOUT_MS = 4_000;
/** 同地址缓存：启动预取后进兑换页可直接用 */
export const CCTP_BALANCE_CACHE_TTL_MS = 90_000;

type CacheEntry = {
  at: number;
  balances: CctpBalanceMap;
};

const balanceCache = new Map<string, CacheEntry>();
const listeners = new Set<() => void>();

const EMPTY_LOADING: CctpSourceBalance = {
  raw: 0n,
  formatted: '0.00',
  selectable: false,
  loading: true,
};

function notifyListeners() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch {
      // 忽略订阅方异常，避免拖垮预取
    }
  });
}

export function subscribeCctpBalanceCache(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCctpBalanceCacheEntry(address: string): CacheEntry | undefined {
  return balanceCache.get(address.toLowerCase());
}

export function isCctpBalanceCacheFresh(address: string, ttlMs = CCTP_BALANCE_CACHE_TTL_MS): boolean {
  const entry = getCctpBalanceCacheEntry(address);
  return !!entry && Date.now() - entry.at < ttlMs;
}

export function clearCctpBalanceCache(address?: string) {
  if (address) {
    balanceCache.delete(address.toLowerCase());
  } else {
    balanceCache.clear();
  }
  notifyListeners();
}

function formatUsdc(raw: bigint, decimals: number): string {
  const n = Number(formatUnits(raw, decimals));
  if (!Number.isFinite(n)) return '0.00';
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string, signal?: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('已取消', 'AbortError'));
      return;
    }

    const timer = window.setTimeout(() => {
      reject(new Error(`${label} 超时`));
    }, ms);

    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException('已取消', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });

    promise
      .then((value) => {
        window.clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        resolve(value);
      })
      .catch((err) => {
        window.clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        reject(err);
      });
  });
}

function isAbortError(err: unknown): boolean {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.name === 'AbortError')
  );
}

/**
 * USDC 合约：优先用链配置 paymentTokens，缺失时回退 CCTP 内置地址
 */
export function resolveCctpUsdcAddress(key: CctpChainKey): Address {
  const cctp = CCTP_CHAINS[key];
  const fromConfig = useChainConfigStore.getState().getTokenConfig(cctp.chainId, 'USDC');
  const addr = fromConfig?.contractAddress?.trim();
  if (addr && /^0x[a-fA-F0-9]{40}$/.test(addr)) {
    return addr as Address;
  }
  return cctp.usdc;
}

/**
 * 预取目标源链：
 * - 链配置已加载且能匹配到 CCTP 源链 → 只预取这些（减少坏 RPC）
 * - 匹配不到 → 回退全部 CCTP_SOURCE_KEYS，保证兑换页可用
 */
export function resolveCctpPrefetchKeys(chains: ChainNetwork[]): CctpChainKey[] {
  if (!chains.length) return [...CCTP_SOURCE_KEYS];
  const configuredIds = new Set(chains.map((c) => Number(c.chainId)));
  const matched = CCTP_SOURCE_KEYS.filter((key) => configuredIds.has(CCTP_CHAINS[key].chainId));
  return matched.length > 0 ? matched : [...CCTP_SOURCE_KEYS];
}

async function readOneBalance(
  key: CctpChainKey,
  address: Address,
  signal?: AbortSignal,
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

  const usdc = resolveCctpUsdcAddress(key);
  const raw = await withTimeout(
    client.readContract({
      address: usdc,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    }),
    PER_CHAIN_TIMEOUT_MS,
    chain.name,
    signal,
  );

  return {
    raw,
    formatted: formatUsdc(raw, chain.usdcDecimals),
    selectable: raw > 0n,
    loading: false,
  };
}

export type PrefetchCctpBalancesOptions = {
  /** 指定源链；默认按链配置解析 */
  keys?: CctpChainKey[];
  signal?: AbortSignal;
  /** 缓存仍新鲜时跳过 RPC */
  skipIfFresh?: boolean;
  onChainResult?: (key: CctpChainKey, value: CctpSourceBalance) => void;
};

/**
 * 并行读取各源链 USDC balanceOf，写入共享缓存。
 * 供 App 启动预取与兑换面板共用。
 */
export async function prefetchCctpSourceBalances(
  address: Address,
  opts: PrefetchCctpBalancesOptions = {},
): Promise<CctpBalanceMap> {
  const cacheKey = address.toLowerCase();
  if (opts.skipIfFresh && isCctpBalanceCacheFresh(address)) {
    return { ...(getCctpBalanceCacheEntry(address)?.balances ?? {}) };
  }

  const chains = useChainConfigStore.getState().chains;
  const keys = opts.keys?.length ? opts.keys : resolveCctpPrefetchKeys(chains);
  const signal = opts.signal;
  const snapshot: CctpBalanceMap = {
    ...(getCctpBalanceCacheEntry(address)?.balances ?? {}),
  };

  // 先标记目标链 loading，便于 UI 立刻感知
  for (const key of keys) {
    snapshot[key] = { ...EMPTY_LOADING };
  }
  balanceCache.set(cacheKey, { at: Date.now(), balances: { ...snapshot } });
  notifyListeners();

  await Promise.all(
    keys.map(async (key) => {
      if (signal?.aborted) return;
      let value: CctpSourceBalance;
      try {
        value = await readOneBalance(key, address, signal);
      } catch (err) {
        if (isAbortError(err) || signal?.aborted) return;
        value = {
          raw: 0n,
          formatted: '0.00',
          selectable: false,
          loading: false,
          error: err instanceof Error ? err.message : '读取失败',
        };
      }
      if (signal?.aborted) return;
      snapshot[key] = value;
      balanceCache.set(cacheKey, { at: Date.now(), balances: { ...snapshot } });
      notifyListeners();
      opts.onChainResult?.(key, value);
    }),
  );

  if (signal?.aborted) {
    return { ...snapshot };
  }

  balanceCache.set(cacheKey, { at: Date.now(), balances: { ...snapshot } });
  notifyListeners();
  return { ...snapshot };
}

/** 兑换面板需要展示全部源链：缓存缺的再补拉 */
export async function ensureAllCctpSourceBalances(
  address: Address,
  opts: { signal?: AbortSignal; force?: boolean } = {},
): Promise<CctpBalanceMap> {
  if (!opts.force && isCctpBalanceCacheFresh(address)) {
    const cached = getCctpBalanceCacheEntry(address)?.balances ?? {};
    const missing = CCTP_SOURCE_KEYS.filter((key) => !cached[key] || cached[key]?.loading);
    if (missing.length === 0) {
      return { ...cached };
    }
    return prefetchCctpSourceBalances(address, {
      keys: missing,
      signal: opts.signal,
      skipIfFresh: false,
    });
  }
  return prefetchCctpSourceBalances(address, {
    keys: [...CCTP_SOURCE_KEYS],
    signal: opts.signal,
    skipIfFresh: false,
  });
}
