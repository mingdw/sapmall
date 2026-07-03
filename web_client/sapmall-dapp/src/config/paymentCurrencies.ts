import { useChainConfigStore, type PaymentToken } from '../store/chainConfigStore';
import type { PaymentMethod } from '../pages/marketplace/payment/types/paymentTypes';
import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from './chains/lineaSepolia';
import { BASE_SEPOLIA_CHAIN_ID, isPaymentChain } from './paymentChains';

/** 链配置未加载时的降级币种列表 */
const FALLBACK_PAYMENT_CURRENCIES: Partial<Record<number, PaymentMethod[]>> = {
  [LINEA_SEPOLIA_CHAIN_ID]: ['USDC', 'SAP'],
  [ARC_TESTNET_CHAIN_ID]: ['USDC', 'EURC', 'cirBTC', 'SAP'],
  [BASE_SEPOLIA_CHAIN_ID]: ['USDC', 'SAP'],
};

function getFallbackPaymentCurrencies(chainId: number): PaymentMethod[] {
  return FALLBACK_PAYMENT_CURRENCIES[chainId] ?? ['SAP'];
}

function normalizePaymentSymbols(tokens: PaymentToken[]): PaymentMethod[] {
  const seen = new Set<string>();
  const result: PaymentMethod[] = [];
  for (const token of tokens) {
    const symbol = token.symbol.trim().toUpperCase() as PaymentMethod;
    if (!symbol || seen.has(symbol)) continue;
    seen.add(symbol);
    result.push(symbol);
  }
  return result;
}

/** 支付链上保证 SAP 出现在可选列表（平台代币；后端未配置时亦展示） */
function ensureSapOnPaymentChain(chainId: number, symbols: PaymentMethod[]): PaymentMethod[] {
  if (!isPaymentChain(chainId)) return symbols;
  if (symbols.includes('SAP')) return symbols;
  return [...symbols, 'SAP'];
}

/**
 * 获取指定链可用的支付币种列表
 * 优先从后端链配置获取，降级到硬编码；支付链始终包含 SAP
 */
export function getAvailablePaymentCurrencies(chainId?: number): PaymentMethod[] {
  if (chainId == null) return ['SAP'];

  const store = useChainConfigStore.getState();
  const tokens = store.getPaymentTokens(chainId);

  let symbols: PaymentMethod[];
  if (store.loaded && tokens.length > 0) {
    symbols = normalizePaymentSymbols(tokens);
  } else if (!store.loaded) {
    symbols = getFallbackPaymentCurrencies(chainId);
  } else {
    symbols = getFallbackPaymentCurrencies(chainId);
  }

  return ensureSapOnPaymentChain(chainId, symbols);
}

/** 默认支付币种：优先 USDC，否则取列表首项 */
export function getDefaultPaymentCurrency(chainId?: number): PaymentMethod {
  const available = getAvailablePaymentCurrencies(chainId);
  if (available.includes('USDC')) return 'USDC';
  return available[0] ?? 'SAP';
}

export function isPaymentCurrencyAvailable(chainId: number, method: PaymentMethod): boolean {
  return getAvailablePaymentCurrencies(chainId).includes(method);
}

export function isSapPayment(method: PaymentMethod): boolean {
  return method === 'SAP';
}

/**
 * 判断某链上某币种是否支持链上支付（需有合约地址）
 */
export function isOnChainPaySupported(method: PaymentMethod, chainId?: number): boolean {
  const store = useChainConfigStore.getState();

  if (chainId != null) {
    const token = store.getTokenConfig(chainId, method);
    if (token?.contractAddress) return true;
    if (isSapPayment(method) && isPaymentChain(chainId)) return true;
    if (!store.loaded) {
      return getFallbackPaymentCurrencies(chainId).includes(method);
    }
    return false;
  }

  return store.chains.some((chain) =>
    chain.paymentTokens.some((t) => t.symbol === method && t.contractAddress !== ''),
  );
}

/**
 * 获取指定链上某个币种的配置
 */
export function getTokenConfigFromChain(chainId: number, symbol: string): PaymentToken | undefined {
  const store = useChainConfigStore.getState();
  return store.getTokenConfig(chainId, symbol);
}
