import type {
  GetOrderResp,
  OrderPreviewItem,
  OrderStatusResp,
} from '../../../../services/api/orderApi';
import { isSapPayment } from '../../../../config/paymentCurrencies';
import type { PaymentMethod } from '../types/paymentTypes';
import { estimateGasFeeUsdc } from './estimateGasFee';
import { calcPlatformFeeInToken, calcPlatformFeeUsdc } from './paymentFee';
import { calcPayAmountInToken, getTokenToUsdcRate } from './paymentTokenRates';
import { parseOrderSkuImgs } from './parseOrderSkuImgs';

/** 支付成功页展示数据（优先来自 GetOrder） */
export interface OrderResultView {
  orderCode: string;
  goodsTotal: number;
  discountTotal: number;
  payableAmount: number;
  /** 平台费（USDC 计价，与创单/库表一致） */
  platformFeeUsdc: number;
  /** 平台费展示数量（非 USDC 支付时为代币数量，与结算页一致） */
  platformFeeDisplay: number;
  platformFeeDisplaySymbol: string;
  gasFee: number;
  paidAmount: number;
  paidTokenSymbol: string;
  paidAt?: string;
  txHash?: string;
  chainId?: number;
  items: OrderPreviewItem[];
}

export interface OrderResultFallback {
  txHash?: string;
  chainId?: number;
  platformFeeAmount?: number;
  payableAmount?: number;
  tokenSymbol?: string;
}

function buildItemsFromOrder(
  resp: GetOrderResp,
  fallbackItems?: OrderPreviewItem[],
): OrderPreviewItem[] {
  const { order } = resp;
  if (!order.productName?.trim()) {
    return fallbackItems ?? [];
  }
  const imgs = parseOrderSkuImgs(order.skuImgs);
  const qty = order.productQuantity ?? 1;
  const unitPrice = order.productPrice ?? (order.totalAmount != null && qty > 0 ? order.totalAmount / qty : 0);
  return [
    {
      skuId: order.skuId ?? 0,
      skuCode: order.skuCode ?? '',
      productCode: order.spuCode ?? '',
      productName: order.productName,
      imageUrl: imgs[0] ?? '',
      skuImgs: imgs.length > 0 ? imgs : undefined,
      specText: '',
      quantity: qty,
      unitPrice,
      subtotal: order.totalAmount ?? order.payableAmount ?? unitPrice * qty,
    },
  ];
}

function resolveGasFee(order: GetOrderResp['order'], payment: GetOrderResp['payment']): number {
  if (payment.actGasFee != null && payment.actGasFee > 0) return payment.actGasFee;
  if (order.actGasFee != null && order.actGasFee > 0) return order.actGasFee;
  if (payment.estGasFee != null && payment.estGasFee > 0) return payment.estGasFee;
  if (order.estGasFee != null && order.estGasFee > 0) return order.estGasFee;
  return estimateGasFeeUsdc(payment.chainId);
}

function resolvePaidAt(payment: GetOrderResp['payment']): string | undefined {
  const paid = payment.paidAt?.trim();
  if (paid) return paid;
  return payment.confirmedAt?.trim() || undefined;
}

function resolvePaymentMethod(
  payment: GetOrderResp['payment'],
  status?: OrderStatusResp | null,
  fallback?: OrderResultFallback,
): PaymentMethod {
  const sym = payment.tokenSymbol || status?.tokenSymbol || fallback?.tokenSymbol || 'USDC';
  return sym as PaymentMethod;
}

function resolvePayableAmount(
  order: GetOrderResp['order'],
  goodsTotal: number,
  status?: OrderStatusResp | null,
  fallback?: OrderResultFallback,
): number {
  if (order.payableAmount != null && order.payableAmount > 0) return order.payableAmount;
  if (status?.payableAmount != null && status.payableAmount > 0) return status.payableAmount;
  if (fallback?.payableAmount != null && fallback.payableAmount > 0) return fallback.payableAmount;
  const discount = order.discountAmount ?? status?.discountAmount ?? 0;
  if (goodsTotal > 0) return Math.max(0, goodsTotal - discount);
  return 0;
}

/** 非 USDC 链上实付反推平台费（实付仅含商品+平台费，不含 Gas） */
function derivePlatformFeeInToken(
  payableAmount: number,
  paidAmount: number,
  method: PaymentMethod,
): number {
  if (method === 'USDC' || isSapPayment(method) || payableAmount <= 0 || paidAmount <= 0) {
    return 0;
  }
  const goodsInToken = calcPayAmountInToken(payableAmount, method);
  const fee = Math.round((paidAmount - goodsInToken) * 1e8) / 1e8;
  return fee > 1e-6 ? fee : 0;
}

function resolvePlatformFeeUsdc(
  order: GetOrderResp['order'],
  payment: GetOrderResp['payment'],
  payableAmount: number,
  method: PaymentMethod,
  status?: OrderStatusResp | null,
  fallback?: OrderResultFallback,
): number {
  const candidates = [
    order.platformFeeAmount,
    status?.platformFeeAmount,
    fallback?.platformFeeAmount,
  ];
  for (const value of candidates) {
    if (value != null && value > 0) return value;
  }
  if (payableAmount > 0 && !isSapPayment(method)) {
    const computed = calcPlatformFeeUsdc(payableAmount, method);
    if (computed > 0) return computed;
  }
  const paidAmount = payment.payAmount ?? order.payAmount ?? status?.payAmount ?? 0;
  const feeInToken = derivePlatformFeeInToken(payableAmount, paidAmount, method);
  if (feeInToken > 0) {
    const fromUsdc = calcPlatformFeeUsdc(payableAmount, method);
    if (fromUsdc > 0) return fromUsdc;
    const rate = getTokenToUsdcRate(method);
    if (rate > 0) return Math.round(feeInToken * rate * 100) / 100;
    return feeInToken;
  }
  return 0;
}

function resolvePlatformFeeDisplay(
  platformFeeUsdc: number,
  payableAmount: number,
  method: PaymentMethod,
  paidAmount: number,
): { amount: number; symbol: string } {
  if (isSapPayment(method) || platformFeeUsdc <= 0) {
    return { amount: 0, symbol: 'USDC' };
  }
  if (method === 'USDC') {
    return { amount: platformFeeUsdc, symbol: 'USDC' };
  }
  const fromRate = calcPlatformFeeInToken(payableAmount, method);
  if (fromRate > 0) {
    return { amount: fromRate, symbol: method };
  }
  const derived = derivePlatformFeeInToken(payableAmount, paidAmount, method);
  if (derived > 0) {
    return { amount: derived, symbol: method };
  }
  return { amount: platformFeeUsdc, symbol: 'USDC' };
}

/** 将 GetOrder 响应映射为成功页展示结构 */
export function buildOrderResultView(
  resp: GetOrderResp,
  fallbackItems?: OrderPreviewItem[],
  fallback?: OrderResultFallback,
  status?: OrderStatusResp | null,
): OrderResultView {
  const { order, payment } = resp;
  const goodsTotal =
    order.totalAmount != null && order.totalAmount > 0
      ? order.totalAmount
      : (order.payableAmount ?? 0) + (order.discountAmount ?? 0);

  const payableAmount = resolvePayableAmount(order, goodsTotal, status, fallback);
  const paymentMethod = resolvePaymentMethod(payment, status, fallback);
  const paidAmount = payment.payAmount ?? order.payAmount ?? status?.payAmount ?? 0;
  const platformFeeUsdc = resolvePlatformFeeUsdc(
    order,
    payment,
    payableAmount,
    paymentMethod,
    status,
    fallback,
  );
  const platformFeeDisplay = resolvePlatformFeeDisplay(
    platformFeeUsdc,
    payableAmount,
    paymentMethod,
    paidAmount,
  );

  const txHash =
    payment.txHash?.trim() ||
    fallback?.txHash?.trim() ||
    status?.txHash?.trim() ||
    undefined;

  return {
    orderCode: order.orderCode || payment.orderCode || status?.orderCode || '',
    goodsTotal,
    discountTotal: order.discountAmount ?? status?.discountAmount ?? 0,
    payableAmount,
    platformFeeUsdc,
    platformFeeDisplay: platformFeeDisplay.amount,
    platformFeeDisplaySymbol: platformFeeDisplay.symbol,
    gasFee: resolveGasFee(order, payment),
    paidAmount,
    paidTokenSymbol: payment.tokenSymbol || status?.tokenSymbol || fallback?.tokenSymbol || 'USDC',
    paidAt: resolvePaidAt(payment) || status?.paidAt,
    txHash,
    chainId: payment.chainId || fallback?.chainId || status?.chainId,
    items: buildItemsFromOrder(resp, fallbackItems),
  };
}

/** /status 已返回、GetOrder 尚未完成时用于成功页展示 */
export function buildOrderResultViewFromStatus(
  status: OrderStatusResp,
  fallback?: OrderResultFallback,
  fallbackItems?: OrderPreviewItem[],
): OrderResultView {
  const skeleton: GetOrderResp = {
    order: {
      orderCode: status.orderCode ?? '',
      orderStatus: status.orderStatus ?? 30,
      paymentStatus: status.paymentStatus ?? 3,
      totalAmount: status.totalAmount,
      discountAmount: status.discountAmount,
      payableAmount: status.payableAmount,
      platformFeeAmount: status.platformFeeAmount,
    },
    payment: {
      intentId: '',
      payerAddress: '',
      chainId: status.chainId ?? fallback?.chainId ?? 0,
      tokenSymbol: status.tokenSymbol ?? fallback?.tokenSymbol ?? 'USDC',
      tokenAddress: '',
      contractAddress: '',
      amountRaw: '0',
      tokenDecimals: 6,
      payAmount: status.payAmount,
      estGasFee: status.gasFeeUsdc,
      txHash: status.txHash,
      paidAt: status.paidAt,
    },
  };
  return buildOrderResultView(skeleton, fallbackItems, fallback, status);
}
