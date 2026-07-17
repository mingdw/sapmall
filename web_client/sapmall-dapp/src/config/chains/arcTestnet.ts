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
 * 官方公布的 Testnet HTTP 节点（主节点失败 / 429 时按序回退）
 * Primary (Circle) → Blockdaemon → dRPC → QuickNode
 */
export const ARC_TESTNET_RPC_URLS = [
  ARC_TESTNET_RPC_URL,
  'https://rpc.blockdaemon.testnet.arc.io',
  'https://rpc.drpc.testnet.arc.io',
  'https://rpc.quicknode.testnet.arc.io',
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
