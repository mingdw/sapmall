/** 链ID → 链名称映射 */
const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  5: 'Goerli',
  11155111: 'Sepolia',
  56: 'BNB Chain',
  97: 'BSC Testnet',
  137: 'Polygon',
  80001: 'Mumbai',
  42161: 'Arbitrum One',
  421614: 'Arbitrum Sepolia',
  10: 'Optimism',
  11155420: 'Optimism Sepolia',
  43114: 'Avalanche',
  43113: 'Fuji',
  8453: 'Base',
  84532: 'Base Sepolia',
  250: 'Fantom',
  4002: 'Fantom Testnet',
  42220: 'Celo',
  44787: 'Alfajores',
  100: 'Gnosis',
};

/** 根据 chainId 返回链名称 */
export function getPaymentChainLabel(chainId?: number): string {
  if (!chainId) return '—';
  return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
}

/** 区块浏览器 Tx URL 映射 */
const EXPLORER_TX_URLS: Record<number, string> = {
  1: 'https://etherscan.io/tx/',
  5: 'https://goerli.etherscan.io/tx/',
  11155111: 'https://sepolia.etherscan.io/tx/',
  56: 'https://bscscan.com/tx/',
  97: 'https://testnet.bscscan.com/tx/',
  137: 'https://polygonscan.com/tx/',
  80001: 'https://mumbai.polygonscan.com/tx/',
  42161: 'https://arbiscan.io/tx/',
  421614: 'https://sepolia.arbiscan.io/tx/',
  10: 'https://optimistic.etherscan.io/tx/',
  11155420: 'https://sepolia-optimism.etherscan.io/tx/',
  43114: 'https://snowtrace.io/tx/',
  43113: 'https://testnet.snowtrace.io/tx/',
  8453: 'https://basescan.org/tx/',
  84532: 'https://sepolia.basescan.org/tx/',
  250: 'https://ftmscan.com/tx/',
  4002: 'https://testnet.ftmscan.com/tx/',
  42220: 'https://celoscan.io/tx/',
  44787: 'https://alfajores.celoscan.io/tx/',
  100: 'https://gnosisscan.io/tx/',
};

/** 根据 chainId + txHash 返回区块浏览器链接 */
export function getTxExplorerUrl(chainId: number, txHash: string): string | undefined {
  const base = EXPLORER_TX_URLS[chainId];
  if (!base) return undefined;
  return `${base}${txHash}`;
}
