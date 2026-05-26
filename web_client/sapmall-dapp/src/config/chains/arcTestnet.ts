import { defineChain } from 'viem';

/** Arc Testnet — https://docs.arc.io/arc/references/rpc-endpoints */
export const ARC_TESTNET_CHAIN_ID = 5042002;

export const ARC_TESTNET_RPC_URL = 'https://rpc.testnet.arc.network';

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
      http: [ARC_TESTNET_RPC_URL],
      webSocket: ['wss://rpc.testnet.arc.network'],
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
