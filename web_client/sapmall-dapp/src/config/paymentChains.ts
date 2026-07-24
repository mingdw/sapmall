import { useChainConfigStore } from '../store/chainConfigStore';

/** 可切换/支付链（后端 status=0） */
function getSwitchableChains() {
  const store = useChainConfigStore.getState();
  if (!store.loaded) return null;
  return store.chains
    .filter((c) => Number(c.status) === 0)
    .sort((a, b) => Number(a.sort) - Number(b.sort) || Number(a.chainId) - Number(b.chainId));
}

/** 支付链 ID 列表（从后端配置获取，仅 status=0） */
export function getPaymentChainIds(): number[] {
  const switchable = getSwitchableChains();
  if (switchable) return switchable.map((c) => c.chainId);
  return [...PAYMENT_CHAIN_IDS];
}

// 兼容旧代码的常量导出（在 store 加载前使用）
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// 保留旧的常量用于兼容，但优先使用 store
const FALLBACK_CHAIN_IDS = [59141, 84532, 5042002];

export const PAYMENT_CHAIN_IDS: readonly number[] = FALLBACK_CHAIN_IDS;
export const DEFAULT_PAYMENT_CHAIN_ID = 59141;

export function isPaymentChain(chainId?: number): boolean {
  if (chainId == null) return false;
  const switchable = getSwitchableChains();
  if (switchable) {
    return switchable.some((c) => c.chainId === chainId);
  }
  return (PAYMENT_CHAIN_IDS as readonly number[]).includes(chainId);
}

export function getPaymentChainLabel(chainId: number): string {
  const store = useChainConfigStore.getState();
  const chain = store.getChainByChainId(chainId);
  if (chain) return chain.name;

  // 降级
  if (chainId === 59141) return 'Linea Sepolia';
  if (chainId === 84532) return 'Base Sepolia';
  if (chainId === 5042002) return 'Arc Testnet';
  return `Chain ${chainId}`;
}

export function getTxExplorerUrl(chainId: number, txHash: string): string | undefined {
  const store = useChainConfigStore.getState();
  return store.getExplorerUrl(chainId, txHash);
}
