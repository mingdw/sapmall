import { defineChain } from 'viem';

/** Linea Sepolia — Phase 1 订单支付主测网 */
export const LINEA_SEPOLIA_CHAIN_ID = 59141;

export const LINEA_SEPOLIA_RPC_URL = 'https://rpc.sepolia.linea.build';

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
      http: [LINEA_SEPOLIA_RPC_URL],
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
