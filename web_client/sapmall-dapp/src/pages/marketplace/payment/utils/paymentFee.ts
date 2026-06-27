import type { PaymentMethod } from '../types/paymentTypes';
import { isSapPayment } from '../../../../config/paymentCurrencies';
import { calcPayAmountInToken } from './paymentTokenRates';

/** 非 SAP 代币支付手续费率（基于 USDC 计价应付） */
export const NON_SAP_PAYMENT_FEE_RATE = 0.003;

/** 平台手续费（USDC）：应付总金额 × 0.3%，SAP 为 0 */
export function calcPlatformFeeUsdc(orderPayableUsdc: number, method: PaymentMethod): number {
  if (isSapPayment(method) || orderPayableUsdc <= 0) return 0;
  return Math.round(orderPayableUsdc * NON_SAP_PAYMENT_FEE_RATE * 100) / 100;
}

/** 若按非 SAP 支付时的参考手续费（USDC），用于 SAP 减免展示 */
export function calcReferencePlatformFeeUsdc(orderPayableUsdc: number): number {
  if (orderPayableUsdc <= 0) return 0;
  return Math.round(orderPayableUsdc * NON_SAP_PAYMENT_FEE_RATE * 100) / 100;
}

/** 平台手续费换算为当前支付币种数量 */
export function calcPlatformFeeInToken(
  orderPayableUsdc: number,
  method: PaymentMethod,
): number {
  const feeUsdc = calcPlatformFeeUsdc(orderPayableUsdc, method);
  return calcPayAmountInToken(feeUsdc, method);
}

/** 链上划转应付（不含 Gas）：订单 + 平台费（USDC 计价） */
export function calcPayAmountDueUsdc(orderPayableUsdc: number, method: PaymentMethod): number {
  return orderPayableUsdc + calcPlatformFeeUsdc(orderPayableUsdc, method);
}

/** 链上划转应付换算为支付币种（不含 Gas） */
export function calcPayAmountDueInToken(orderPayableUsdc: number, method: PaymentMethod): number {
  return calcPayAmountInToken(calcPayAmountDueUsdc(orderPayableUsdc, method), method);
}

/** 应付 + 平台费 + Gas 合计（USDC 计价） */
export function calcTotalDueUsdc(
  orderPayableUsdc: number,
  method: PaymentMethod,
  gasFeeUsdc: number,
): number {
  return calcPayAmountDueUsdc(orderPayableUsdc, method) + Math.max(0, gasFeeUsdc);
}

/** 约合支付：合计 USDC 按汇率换算为当前币种（含 Gas，与链上划转语义不一致，慎用） */
export function calcTotalDueInToken(
  orderPayableUsdc: number,
  method: PaymentMethod,
  gasFeeUsdc: number,
): number {
  return calcPayAmountInToken(calcTotalDueUsdc(orderPayableUsdc, method, gasFeeUsdc), method);
}

/** @deprecated 使用 calcPlatformFeeUsdc */
export function calcPaymentFee(amount: number, method: PaymentMethod): number {
  return calcPlatformFeeUsdc(amount, method);
}

/** @deprecated 使用 calcTotalDueUsdc / calcTotalDueInToken */
export function calcPaymentTotal(amount: number, method: PaymentMethod): number {
  return calcTotalDueUsdc(amount, method, 0);
}
