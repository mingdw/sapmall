import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from './chains/lineaSepolia';
import { BASE_SEPOLIA_CHAIN_ID } from './paymentChains';
import { EXCHANGE_SWAP_TOKENS } from './exchangeTokens';
import type { PaymentMethod } from '../pages/marketplace/payment/types/paymentTypes';

/** Arc Testnet 结算可用稳定币 / 资产 */
export const ARC_PAYMENT_TOKENS = ['USDC', 'EURC', 'cirBTC'] as const;

export function getAvailablePaymentCurrencies(chainId?: number): PaymentMethod[] {
  if (chainId == null) return ['SAP'];

  if (chainId === ARC_TESTNET_CHAIN_ID) {
    return [...ARC_PAYMENT_TOKENS, 'SAP'];
  }

  if (chainId === LINEA_SEPOLIA_CHAIN_ID || chainId === BASE_SEPOLIA_CHAIN_ID) {
    return [...EXCHANGE_SWAP_TOKENS, 'SAP'];
  }

  return ['SAP'];
}

export function isPaymentCurrencyAvailable(chainId: number, method: PaymentMethod): boolean {
  return getAvailablePaymentCurrencies(chainId).includes(method);
}

export function isSapPayment(method: PaymentMethod): boolean {
  return method === 'SAP';
}

/** USDC / SAP / EURC / cirBTC 链上支付已接通 */
export function isOnChainPaySupported(method: PaymentMethod): boolean {
  return method === 'USDC' || method === 'SAP' || method === 'EURC' || method === 'cirBTC';
}
