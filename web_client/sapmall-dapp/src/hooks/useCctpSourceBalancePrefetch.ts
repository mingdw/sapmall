import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useChainConfigStore } from '../store/chainConfigStore';
import { prefetchCctpSourceBalances } from '../services/cctpSourceBalances';

/**
 * App 级预取：链配置就绪 + 钱包已连接后，并行读取各源链 USDC balanceOf。
 * 结果写入共享缓存，兑换页打开时可直接使用。
 */
export function useCctpSourceBalancePrefetch() {
  const { address, isConnected } = useAccount();
  const chainConfigLoaded = useChainConfigStore((s) => s.loaded);
  const chainListSignature = useChainConfigStore((s) =>
    s.chains.map((c) => `${c.chainId}:${c.status}`).join(','),
  );

  useEffect(() => {
    if (!isConnected || !address || !chainConfigLoaded) return;

    const ac = new AbortController();
    void prefetchCctpSourceBalances(address, {
      signal: ac.signal,
      skipIfFresh: true,
    }).catch((err) => {
      if (ac.signal.aborted) return;
      console.warn('[CCTP] 源链余额预取失败', err);
    });

    return () => {
      ac.abort();
    };
  }, [address, isConnected, chainConfigLoaded, chainListSignature]);
}
