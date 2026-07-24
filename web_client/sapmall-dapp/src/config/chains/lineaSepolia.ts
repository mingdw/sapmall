import { defineChain } from 'viem';

/** Linea Sepolia — Phase 1 订单支付 / CCTP 源链 */
export const LINEA_SEPOLIA_CHAIN_ID = 59141;

/** 官方公共 RPC（有限流，不稳定时需 fallback） */
export const LINEA_SEPOLIA_RPC_URL = 'https://rpc.sepolia.linea.build';

/**
 * Linea Sepolia HTTP 节点（主节点断连 / 限流时按序回退）
 * @see https://docs.linea.build/network/build/tools/node-providers
 */
export const LINEA_SEPOLIA_RPC_URLS = [
  LINEA_SEPOLIA_RPC_URL,
  'https://linea-sepolia-rpc.publicnode.com',
  'https://linea-sepolia.drpc.org',
  'https://linea-sepolia.rpc.thirdweb.com',
] as const;

export const lineaSepolia = defineChain({
  id: LINEA_SEPOLIA_CHAIN_ID,
  name: 'Linea Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [...LINEA_SEPOLIA_RPC_URLS],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lineascan',
      url: 'https://sepolia.lineascan.build',
    },
  },
  testnet: true,
});
