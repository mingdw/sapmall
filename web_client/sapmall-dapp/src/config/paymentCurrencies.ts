import { useChainConfigStore, type PaymentToken } from '../store/chainConfigStore';
import type { PaymentMethod } from '../pages/marketplace/payment/types/paymentTypes';
import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from './chains/lineaSepolia';
import { BASE_SEPOLIA_CHAIN_ID } from './paymentChains';

/** 链配置未加载时的降级币种列表 */
const FALLBACK_PAYMENT_CURRENCIES: Partial<Record<number, PaymentMethod[]>> = {
  [LINEA_SEPOLIA_CHAIN_ID]: ['USDC', 'SAP'],
  [ARC_TESTNET_CHAIN_ID]: ['USDC', 'EURC', 'cirBTC', 'SAP'],
  [BASE_SEPOLIA_CHAIN_ID]: ['USDC', 'SAP'],
};

function getFallbackPaymentCurrencies(chainId: number): PaymentMethod[] {
  return FALLBACK_PAYMENT_CURRENCIES[chainId] ?? ['USDC'];
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

/**
 * 获取指定链可选支付币种（与 sys_chain_payment_token.status=0 启用项一致，由后端过滤）
 */
export function getAvailablePaymentCurrencies(chainId?: number): PaymentMethod[] {
  if (chainId == null) return ['USDC'];

  const store = useChainConfigStore.getState();
  const tokens = store.getPaymentTokens(chainId);

  if (store.loaded) {
    return normalizePaymentSymbols(tokens);
  }

  return getFallbackPaymentCurrencies(chainId);
}

/** 默认支付币种：优先 USDC，否则取列表首项 */
export function getDefaultPaymentCurrency(chainId?: number): PaymentMethod {
  const available = getAvailablePaymentCurrencies(chainId);
  if (available.includes('USDC')) return 'USDC';
  return available[0] ?? 'USDC';
}

export function isPaymentCurrencyAvailable(chainId: number, method: PaymentMethod): boolean {
  return getAvailablePaymentCurrencies(chainId).includes(method);
}

export function isSapPayment(method: PaymentMethod): boolean {
  return method === 'SAP';
}

function hasPayableContractAddress(token?: PaymentToken): boolean {
  return Boolean(token?.contractAddress?.trim());
}

/**
 * 判断某链上某币种是否支持链上支付：
 * 须在链配置启用代币列表中，且已配置合约地址（与 sys_chain_payment_token 一致）
 */
export function isOnChainPaySupported(method: PaymentMethod, chainId?: number): boolean {
  const store = useChainConfigStore.getState();

  if (chainId != null) {
    const token = store.getTokenConfig(chainId, method);
    if (hasPayableContractAddress(token)) return true;
    if (!store.loaded) {
      return getFallbackPaymentCurrencies(chainId).includes(method);
    }
    return false;
  }

  return store.chains.some((chain) =>
    chain.paymentTokens.some(
      (t) =>
        t.symbol.trim().toUpperCase() === method.trim().toUpperCase() &&
        hasPayableContractAddress(t),
    ),
  );
}

/**
 * 获取指定链上某个币种的配置
 */
export function getTokenConfigFromChain(chainId: number, symbol: string): PaymentToken | undefined {
  const store = useChainConfigStore.getState();
  return store.getTokenConfig(chainId, symbol);
}
