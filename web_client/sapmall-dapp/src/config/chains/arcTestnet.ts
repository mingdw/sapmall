import { defineChain } from 'viem';

/**
 * Arc Testnet — 官方 RPC 文档：
 * https://docs.arc.io/arc/references/rpc-endpoints
 */
export const ARC_TESTNET_CHAIN_ID = 5042002;

/** Circle Primary HTTP */
export const ARC_TESTNET_RPC_URL = 'https://rpc.testnet.arc.io';

/** Circle Primary WebSocket */
export const ARC_TESTNET_WS_URL = 'wss://rpc.testnet.arc.io';

/**
 * 浏览器端优先用不容易 CORS 失败的节点；官方 Primary 放后（localhost 常见被拦）。
 * @see https://docs.arc.io/arc/references/rpc-endpoints
 */
export const ARC_TESTNET_RPC_URLS = [
  'https://rpc.blockdaemon.testnet.arc.io',
  'https://rpc.drpc.testnet.arc.io',
  'https://rpc.quicknode.testnet.arc.io',
  ARC_TESTNET_RPC_URL,
] as const;

export const ARC_TESTNET_WS_URLS = [
  ARC_TESTNET_WS_URL,
  'wss://rpc.drpc.testnet.arc.io',
  'wss://rpc.quicknode.testnet.arc.io',
] as const;

export const arcTestnet = defineChain({
  id: ARC_TESTNET_CHAIN_ID,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [...ARC_TESTNET_RPC_URLS],
      webSocket: [...ARC_TESTNET_WS_URLS],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arcscan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
});
