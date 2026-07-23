/**
 * CCTP V2 配置（源链 USDC → Arc Testnet → SAP）
 * 文档：https://developers.circle.com/cctp/concepts/supported-chains-and-domains
 * 合约：https://developers.circle.com/cctp/references/contract-addresses
 * USDC：https://developers.circle.com/stablecoins/usdc-contract-addresses
 * 水龙头：https://faucet.circle.com/
 *
 * 说明：Celo Sepolia / ZKsync Sepolia 可在水龙头领 USDC，但目前不在 CCTP V2 domain 列表中，
 * 无法作为跨入 Arc 的 CCTP 源链，故不纳入下拉。
 */
export const CCTP_IRIS_SANDBOX = 'https://iris-api-sandbox.circle.com';

export const CCTP_MESSAGE_SENT_TOPIC =
  '0x2fa9ca894982930190727e75500a97d8dc500233a5065e0f3126c48fbe0343c0' as const;

/** 测试网 TokenMessengerV2 / MessageTransmitterV2（各域地址一致） */
export const CCTP_TOKEN_MESSENGER_V2 = '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA' as const;
export const CCTP_MESSAGE_TRANSMITTER_V2 = '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275' as const;

export type CctpChainKey =
  | 'ethereumSepolia'
  | 'arbitrumSepolia'
  | 'avalancheFuji'
  | 'baseSepolia'
  | 'opSepolia'
  | 'polygonAmoy'
  | 'lineaSepolia'
  | 'unichainSepolia'
  | 'worldchainSepolia'
  | 'arcTestnet';

export interface CctpChainConfig {
  chainId: number;
  domain: number;
  name: string;
  usdc: `0x${string}`;
  usdcDecimals: number;
  tokenMessengerV2: `0x${string}`;
  messageTransmitterV2: `0x${string}`;
  /** depositForBurn 的 minFinalityThreshold（1000=Fast / 2000=Standard） */
  minFinalityThreshold: number;
  /** 是否可作为跨入 Arc 的源链 */
  canSourceToArc: boolean;
}

const sharedMessenger = {
  tokenMessengerV2: CCTP_TOKEN_MESSENGER_V2,
  messageTransmitterV2: CCTP_MESSAGE_TRANSMITTER_V2,
  usdcDecimals: 6 as const,
};

export const CCTP_CHAINS: Record<CctpChainKey, CctpChainConfig> = {
  ethereumSepolia: {
    chainId: 11155111,
    domain: 0,
    name: 'Ethereum Sepolia',
    usdc: '0x1c7D4B196Cb0C7B01d157F041a657A09DDBf8aF4',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  arbitrumSepolia: {
    chainId: 421614,
    domain: 3,
    name: 'Arbitrum Sepolia',
    usdc: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  avalancheFuji: {
    chainId: 43113,
    domain: 1,
    name: 'Avalanche Fuji',
    usdc: '0x5425890298aed601595a70AB815c96711a31Bc65',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  baseSepolia: {
    chainId: 84532,
    domain: 6,
    name: 'Base Sepolia',
    usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  opSepolia: {
    chainId: 11155420,
    domain: 2,
    name: 'OP Sepolia',
    usdc: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  polygonAmoy: {
    chainId: 80002,
    domain: 7,
    name: 'Polygon PoS Amoy',
    usdc: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  lineaSepolia: {
    chainId: 59141,
    domain: 11,
    name: 'Linea Sepolia',
    usdc: '0xFEce4462D57bD51A6A552365A011b95f0E16d9B7',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  unichainSepolia: {
    chainId: 1301,
    domain: 10,
    name: 'Unichain Sepolia',
    usdc: '0x31d0220469e10c4E71834a79b1f276d740d3768F',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  worldchainSepolia: {
    chainId: 4801,
    domain: 14,
    name: 'World Chain Sepolia',
    usdc: '0x66145f38cBAC35Ca6F1Dfb4914dF98F1614aeA88',
    minFinalityThreshold: 1000,
    canSourceToArc: true,
    ...sharedMessenger,
  },
  arcTestnet: {
    chainId: 5042002,
    domain: 26,
    name: 'Arc Testnet',
    usdc: '0x3600000000000000000000000000000000000000',
    minFinalityThreshold: 2000,
    canSourceToArc: false,
    ...sharedMessenger,
  },
};

/** 源链下拉顺序（对齐 Circle Faucet 常用 EVM 列表） */
export const CCTP_SOURCE_KEYS: CctpChainKey[] = [
  'ethereumSepolia',
  'arbitrumSepolia',
  'avalancheFuji',
  'baseSepolia',
  'opSepolia',
  'polygonAmoy',
  'lineaSepolia',
  'unichainSepolia',
  'worldchainSepolia',
];

/** 默认跨链路由 */
export const CCTP_MVP_ROUTE = {
  source: 'baseSepolia' as const,
  destination: 'arcTestnet' as const,
};

export function getCctpChainById(chainId: number): CctpChainConfig | undefined {
  return Object.values(CCTP_CHAINS).find((c) => c.chainId === chainId);
}

export function getCctpChainKeyById(chainId: number): CctpChainKey | undefined {
  const entry = Object.entries(CCTP_CHAINS).find(([, c]) => c.chainId === chainId);
  return entry?.[0] as CctpChainKey | undefined;
}
