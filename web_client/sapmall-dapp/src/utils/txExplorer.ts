import { config } from '../config/wagmi';
import { getTxExplorerUrl } from '../config/paymentChains';

/** 解析交易浏览器链接：优先后端链配置，其次 wagmi chain explorers */
export function resolveTxExplorerUrl(chainId: number, txHash?: string | null): string | undefined {
  if (!txHash) return undefined;
  const hash = txHash.startsWith('0x') ? txHash : `0x${txHash}`;
  const fromStore = getTxExplorerUrl(chainId, hash);
  if (fromStore) return fromStore;
  const chain = config.chains.find((c) => c.id === chainId);
  const base = chain?.blockExplorers?.default?.url;
  if (!base) return undefined;
  return `${base.replace(/\/$/, '')}/tx/${hash}`;
}

export function shortenTxHash(hash: string, head = 10, tail = 8): string {
  if (hash.length <= head + tail + 3) return hash;
  return `${hash.slice(0, head)}...${hash.slice(-tail)}`;
}
