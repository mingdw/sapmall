import type { TFunction } from 'i18next';

/** 订单主状态 */
export const ORDER_STATUS = {
  PENDING_PAY: 10,
  ON_CHAIN_CONFIRMING: 20,
  PAID: 30,
  TO_SHIP: 40,
  SHIPPED: 50,
  COMPLETED: 60,
  CANCELLED: 70,
  EXPIRED: 80,
  PAY_FAILED: 90,
} as const;

/** 支付状态 */
export const PAYMENT_STATUS = {
  UNPAID: 1,
  CONFIRMING: 2,
  PAID: 3,
  CLOSED: 4,
} as const;

const ORDER_STATUS_OPTION_DEFS = [
  { labelKey: 'trading.order.statusAll', value: 0 },
  { labelKey: 'trading.order.statusPendingPay', value: ORDER_STATUS.PENDING_PAY },
  { labelKey: 'trading.order.statusOnChain', value: ORDER_STATUS.ON_CHAIN_CONFIRMING },
  { labelKey: 'trading.order.statusPaid', value: ORDER_STATUS.PAID },
  { labelKey: 'trading.order.statusToShip', value: ORDER_STATUS.TO_SHIP },
  { labelKey: 'trading.order.statusShipped', value: ORDER_STATUS.SHIPPED },
  { labelKey: 'trading.order.statusCompleted', value: ORDER_STATUS.COMPLETED },
  { labelKey: 'trading.order.statusCancelled', value: ORDER_STATUS.CANCELLED },
  { labelKey: 'trading.order.statusExpired', value: ORDER_STATUS.EXPIRED },
  { labelKey: 'trading.order.statusPayFailed', value: ORDER_STATUS.PAY_FAILED },
] as const;

/** @deprecated 请使用 getOrderStatusOptions(t)；保留兼容旧代码 */
export const ORDER_STATUS_OPTIONS = ORDER_STATUS_OPTION_DEFS.map((opt) => ({
  label: opt.labelKey,
  value: opt.value,
}));

export function getOrderStatusOptions(t: TFunction) {
  return ORDER_STATUS_OPTION_DEFS.map((opt) => ({
    label: t(opt.labelKey),
    value: opt.value,
  }));
}

export function getOrderStatusLabel(t: TFunction, status: number): string {
  const found = ORDER_STATUS_OPTION_DEFS.find((o) => o.value === status);
  return found ? t(found.labelKey) : String(status);
}

/** 订单状态标签颜色映射 */
export const ORDER_STATUS_TAG_COLORS: Record<number, { color: string; bg: string }> = {
  [ORDER_STATUS.PENDING_PAY]: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  [ORDER_STATUS.ON_CHAIN_CONFIRMING]: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  [ORDER_STATUS.PAID]: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)' },
  [ORDER_STATUS.TO_SHIP]: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  [ORDER_STATUS.SHIPPED]: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  [ORDER_STATUS.COMPLETED]: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  [ORDER_STATUS.CANCELLED]: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' },
  [ORDER_STATUS.EXPIRED]: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  [ORDER_STATUS.PAY_FAILED]: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

const PAYMENT_STATUS_TAB_DEFS = [
  { key: 'all', labelKey: 'trading.order.payTabAll', value: 0 },
  { key: String(PAYMENT_STATUS.UNPAID), labelKey: 'trading.order.payTabUnpaid', value: PAYMENT_STATUS.UNPAID },
  { key: String(PAYMENT_STATUS.CONFIRMING), labelKey: 'trading.order.payTabConfirming', value: PAYMENT_STATUS.CONFIRMING },
  { key: String(PAYMENT_STATUS.PAID), labelKey: 'trading.order.payTabPaid', value: PAYMENT_STATUS.PAID },
  { key: String(PAYMENT_STATUS.CLOSED), labelKey: 'trading.order.payTabClosed', value: PAYMENT_STATUS.CLOSED },
] as const;

/** @deprecated 请使用 getPaymentStatusTabs(t) */
export const PAYMENT_STATUS_TABS = PAYMENT_STATUS_TAB_DEFS.map((tab) => ({
  key: tab.key,
  label: tab.labelKey,
  value: tab.value,
}));

export function getPaymentStatusTabs(t: TFunction) {
  return PAYMENT_STATUS_TAB_DEFS.map((tab) => ({
    key: tab.key,
    label: t(tab.labelKey),
    value: tab.value,
  }));
}

const PAYMENT_STATUS_OPTION_DEFS = [
  { labelKey: 'trading.order.payAll', value: 0 },
  { labelKey: 'trading.order.payTabUnpaid', value: PAYMENT_STATUS.UNPAID },
  { labelKey: 'trading.order.payTabConfirming', value: PAYMENT_STATUS.CONFIRMING },
  { labelKey: 'trading.order.payTabPaid', value: PAYMENT_STATUS.PAID },
  { labelKey: 'trading.order.payTabClosed', value: PAYMENT_STATUS.CLOSED },
] as const;

/** @deprecated 请使用 getPaymentStatusOptions(t) */
export const PAYMENT_STATUS_OPTIONS = PAYMENT_STATUS_OPTION_DEFS.map((opt) => ({
  label: opt.labelKey,
  value: opt.value,
}));

export function getPaymentStatusOptions(t: TFunction) {
  return PAYMENT_STATUS_OPTION_DEFS.map((opt) => ({
    label: t(opt.labelKey),
    value: opt.value,
  }));
}

export function orderStatusTagColor(status: number): string {
  switch (status) {
    case ORDER_STATUS.PENDING_PAY:
      return 'warning';
    case ORDER_STATUS.ON_CHAIN_CONFIRMING:
      return 'processing';
    case ORDER_STATUS.PAID:
      return 'success';
    case ORDER_STATUS.TO_SHIP:
      return 'processing';
    case ORDER_STATUS.SHIPPED:
      return 'blue';
    case ORDER_STATUS.COMPLETED:
      return 'green';
    case ORDER_STATUS.CANCELLED:
      return 'default';
    case ORDER_STATUS.EXPIRED:
      return 'error';
    case ORDER_STATUS.PAY_FAILED:
      return 'error';
    default:
      return 'default';
  }
}

export function paymentStatusTagColor(status: number): string {
  switch (status) {
    case PAYMENT_STATUS.UNPAID:
      return 'warning';
    case PAYMENT_STATUS.CONFIRMING:
      return 'processing';
    case PAYMENT_STATUS.PAID:
      return 'success';
    case PAYMENT_STATUS.CLOSED:
      return 'error';
    default:
      return 'default';
  }
}

export function canCancelOrder(orderStatus: number, paymentStatus: number): boolean {
  return (
    orderStatus === ORDER_STATUS.PENDING_PAY &&
    paymentStatus !== PAYMENT_STATUS.PAID &&
    paymentStatus !== PAYMENT_STATUS.CONFIRMING
  );
}

export function canResumePay(orderStatus: number, paymentStatus: number, orderDate?: string): boolean {
  if (
    orderStatus !== ORDER_STATUS.PENDING_PAY ||
    paymentStatus === PAYMENT_STATUS.PAID ||
    paymentStatus === PAYMENT_STATUS.CONFIRMING
  ) {
    return false;
  }
  if (!orderDate) return false;
  const created = new Date(orderDate).getTime();
  if (Number.isNaN(created)) return false;
  const elapsed = Date.now() - created;
  return elapsed < 30 * 60 * 1000;
}

export function canDeleteOrder(orderStatus: number, paymentStatus: number): boolean {
  return (
    orderStatus === ORDER_STATUS.CANCELLED ||
    orderStatus === ORDER_STATUS.EXPIRED ||
    paymentStatus === PAYMENT_STATUS.CLOSED
  );
}

export const DAPP_PAYMENT_BASE =
  process.env.REACT_APP_DAPP_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export function buildDappPayUrl(orderCode: string): string {
  return `${DAPP_PAYMENT_BASE}/marketplace/payment/result/${encodeURIComponent(orderCode)}`;
}
