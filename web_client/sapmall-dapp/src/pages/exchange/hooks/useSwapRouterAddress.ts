import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useChainConfigStore } from '../../../store/chainConfigStore';
import { ARC_TESTNET_CHAIN_ID } from '../../../config/chains/arcTestnet';

// Arc Testnet 上 SAPSwapRouter 代理合约地址（硬编码降级）
const ARC_TESTNET_SWAP_ROUTER = '0x754a5a7e0534a94fdbfacc5f5434db3585643ddf' as `0x${string}`;

/**
 * 从链配置 Store 获取指定链（或当前钱包链）的 SwapRouter 合约地址。
 * 优先级：后端 chain_config.swapRouterAddress > 环境变量 > 硬编码降级 > undefined
 */
export function useSwapRouterAddress(chainIdOverride?: number): `0x${string}` | undefined {
  const { chainId: walletChainId } = useAccount();
  const store = useChainConfigStore();
  const chainId = chainIdOverride ?? walletChainId;

  return useMemo(() => {
    if (!chainId) return undefined;

    // 从后端配置获取（swapRouterAddress 字段）
    const chain = store.getChainByChainId(chainId);
    if (chain?.swapRouterAddress) {
      const addr = chain.swapRouterAddress;
      if (addr.startsWith('0x')) return addr as `0x${string}`;
    }

    // 降级到环境变量（兼容多种命名）
    const envAddr = (
      process.env.REACT_APP_SWAP_ROUTER_ADDRESS ??
      process.env.SAP_SWAP_ROUTER_ADDRESS
    )?.trim();
    if (envAddr?.startsWith('0x')) return envAddr as `0x${string}`;

    // 降级到硬编码（Arc Testnet）
    if (chainId === ARC_TESTNET_CHAIN_ID) {
      return ARC_TESTNET_SWAP_ROUTER;
    }

    return undefined;
  }, [chainId, store]);
}
