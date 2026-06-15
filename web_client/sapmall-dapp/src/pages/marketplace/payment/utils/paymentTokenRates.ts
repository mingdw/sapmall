import type { PaymentMethod } from '../types/paymentTypes';
import {
  getReferenceTokenToUsdcRate,
  PAYMENT_TOKEN_RATES_AS_OF,
} from '../../../../config/paymentTokenUsdRates';
import { isSapPayment } from '../../../../config/paymentCurrencies';

export { PAYMENT_TOKEN_RATES_AS_OF };

export function getTokenToUsdcRate(method: PaymentMethod): number {
  return getReferenceTokenToUsdcRate(method);
}

/** 订单应付（USDC 计价）换算为所选代币数量 */
export function calcPayAmountInToken(orderPayableUsdc: number, method: PaymentMethod): number {
  if (orderPayableUsdc <= 0) return 0;
  const rate = getTokenToUsdcRate(method);
  if (rate <= 0) return orderPayableUsdc;
  const amount = orderPayableUsdc / rate;
  if (method === 'cirBTC') return Math.round(amount * 1e8) / 1e8;
  if (rate >= 1000) return Math.round(amount * 100000) / 100000;
  if (rate >= 1) return Math.round(amount * 100) / 100;
  return Math.round(amount * 10000) / 10000;
}

function formatRateNumber(rate: number): string {
  if (rate >= 1000) {
    return rate.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (rate >= 1) return rate.toFixed(2);
  return rate.toFixed(4);
}

export function formatTokenToUsdcRate(method: PaymentMethod): string {
  const rate = getTokenToUsdcRate(method);
  if (method === 'USDC') return '1 USDC = 1 USDC';
  return `1 ${method} ≈ ${formatRateNumber(rate)} USDC`;
}

/** 反向：1 USDC 可换多少该代币（便于稳定币以外资产理解） */
export function formatUsdcToTokenRate(method: PaymentMethod): string | null {
  if (method === 'USDC') return null;
  const rate = getTokenToUsdcRate(method);
  if (rate <= 0) return null;
  const perUsdc = 1 / rate;
  if (isSapPayment(method)) {
    return `1 USDC ≈ ${perUsdc.toFixed(2)} SAP`;
  }
  if (perUsdc >= 1000) {
    return `1 USDC ≈ ${perUsdc.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${method}`;
  }
  if (perUsdc >= 1) return `1 USDC ≈ ${perUsdc.toFixed(4)} ${method}`;
  return `1 USDC ≈ ${perUsdc.toFixed(2)} ${method}`;
}

/** 按币种精度格式化数量（用于展示） */
export function formatTokenAmount(amount: number, method: PaymentMethod): string {
  if (method === 'cirBTC') {
    if (amount >= 1) return amount.toFixed(4);
    const s = amount.toFixed(8);
    return s.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '') || '0';
  }
  if (getTokenToUsdcRate(method) >= 1000) return amount.toFixed(5);
  if (isSapPayment(method) || getTokenToUsdcRate(method) < 1) return amount.toFixed(4);
  return amount.toFixed(2);
}

export function formatPayEquivInToken(orderPayableUsdc: number, method: PaymentMethod): string {
  return `${formatTokenAmount(calcPayAmountInToken(orderPayableUsdc, method), method)} ${method}`;
}
