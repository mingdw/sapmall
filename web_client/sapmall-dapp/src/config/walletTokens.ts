import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from './chains/lineaSepolia';
import { config } from './wagmi';
import { useChainConfigStore } from '../store/chainConfigStore';

export type WalletErc20Config = {
  address: `0x${string}`;
  decimals: number;
  symbol: string;
};

// ========== 硬编码降级配置 ==========

const ARC_USDC: WalletErc20Config = {
  address: '0x3600000000000000000000000000000000000000',
  decimals: 6,
  symbol: 'USDC',
};

const ARC_EURC: WalletErc20Config = {
  address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',
  decimals: 6,
  symbol: 'EURC',
};

const ARC_CIRBTC: WalletErc20Config = {
  address: '0xf0C4a4CE82A5746AbAAd9425360Ab04fbBA432BF',
  decimals: 8,
  symbol: 'cirBTC',
};

const ARC_PAYMENT_TOKEN_BY_SYMBOL: Record<string, WalletErc20Config> = {
  USDC: ARC_USDC,
  EURC: ARC_EURC,
  cirBTC: ARC_CIRBTC,
};

const LINEA_SEPOLIA_USDC: WalletErc20Config = {
  address: '0xFEce4462D57bD51A6A552365A011b95f0E16d9B7',
  decimals: 6,
  symbol: 'USDC',
};

const USDC_BY_CHAIN: Partial<Record<number, WalletErc20Config>> = {
  [LINEA_SEPOLIA_CHAIN_ID]: LINEA_SEPOLIA_USDC,
  [ARC_TESTNET_CHAIN_ID]: ARC_USDC,
  1: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, symbol: 'USDC' },
  8453: { address: '0x833589fCFedBb94e688989216Ca2568fC1a764f3', decimals: 6, symbol: 'USDC' },
  84532: { address: '0x036CbD53842c542663c028D8e0b8708fF7Dd4B7', decimals: 6, symbol: 'USDC' },
  11155111: { address: '0x1c7D4B196Cb0C7B01d157F041a657A09DDBf8aF4', decimals: 6, symbol: 'USDC' },
  5: { address: '0x07865c6E87B9F70255377e024ace66339179aFBB', decimals: 6, symbol: 'USDC' },
  17000: { address: '0x07865c6E87B9F70255377e024ace66339179aFBB', decimals: 6, symbol: 'USDC' },
  137: { address: '0x3c499c542cEF5E3811eC2De52859baf974bcD2df', decimals: 6, symbol: 'USDC' },
  56: { address: '0x8AC76a51cc950d9822D186bD0e1d95e1e443f0C3', decimals: 18, symbol: 'USDC' },
};

// ========== 从 Store 获取代币配置 ==========

/**
 * 从链配置 Store 获取代币配置
 * 如果 Store 未加载，降级到硬编码
 */
function getTokenConfigFromStore(chainId: number, symbol: string): WalletErc20Config | undefined {
  const store = useChainConfigStore.getState();
  const token = store.getTokenConfig(chainId, symbol);
  if (token) {
    return {
      address: token.contractAddress as `0x${string}`,
      decimals: token.decimals,
      symbol: token.symbol,
    };
  }
  return undefined;
}

// ========== 导出函数 ==========

export function getUsdcTokenConfig(chainId?: number): WalletErc20Config | undefined {
  if (!chainId) return undefined;

  // 优先从 Store 获取
  const fromStore = getTokenConfigFromStore(chainId, 'USDC');
  if (fromStore) return fromStore;

  // 降级到硬编码
  return USDC_BY_CHAIN[chainId];
}

/** 支付代币配置（USDC / EURC / cirBTC 等） */
export function getArcPaymentTokenConfig(
  symbol: string,
  chainId?: number,
): WalletErc20Config | undefined {
  if (!chainId) return undefined;

  // 优先从 Store 获取
  const fromStore = getTokenConfigFromStore(chainId, symbol);
  if (fromStore) return fromStore;

  // 降级到硬编码（仅 Arc Testnet）
  if (chainId === ARC_TESTNET_CHAIN_ID) {
    return ARC_PAYMENT_TOKEN_BY_SYMBOL[symbol];
  }

  return undefined;
}

export function getChainNativeCurrency(chainId?: number) {
  const fallback = { name: 'Ether', symbol: 'ETH', decimals: 18 };
  if (!chainId) return fallback;

  const store = useChainConfigStore.getState();
  const chain = store.getChainByChainId(chainId);
  if (chain?.nativeSymbol) {
    return { name: chain.nativeSymbol, symbol: chain.nativeSymbol, decimals: 18 };
  }

  return config.chains.find((c) => c.id === chainId)?.nativeCurrency ?? fallback;
}

export function getSapTokenConfig(chainId?: number): WalletErc20Config | undefined {
  // 优先从链配置 Store 获取（按 chainId）
  if (chainId != null) {
    const fromStore = getTokenConfigFromStore(chainId, 'SAP');
    if (fromStore) return fromStore;
  }

  const raw = process.env.REACT_APP_SAP_TOKEN_ADDRESS?.trim();
  if (!raw || !raw.startsWith('0x')) return undefined;
  const decimals = Number(process.env.REACT_APP_SAP_TOKEN_DECIMALS ?? 18);
  return {
    address: raw as `0x${string}`,
    decimals: Number.isFinite(decimals) ? decimals : 18,
    symbol: 'SAP',
  };
}
