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

export const ORDER_STATUS_OPTIONS = [
  { label: '全部状态', value: 0 },
  { label: '待支付', value: ORDER_STATUS.PENDING_PAY },
  { label: '链上确认中', value: ORDER_STATUS.ON_CHAIN_CONFIRMING },
  { label: '已支付', value: ORDER_STATUS.PAID },
  { label: '待发货', value: ORDER_STATUS.TO_SHIP },
  { label: '已发货', value: ORDER_STATUS.SHIPPED },
  { label: '已完成', value: ORDER_STATUS.COMPLETED },
  { label: '已取消', value: ORDER_STATUS.CANCELLED },
  { label: '已过期', value: ORDER_STATUS.EXPIRED },
  { label: '支付失败', value: ORDER_STATUS.PAY_FAILED },
];

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

/** 列表 Tab：按支付状态分组 */
export const PAYMENT_STATUS_TABS = [
  { key: 'all', label: '全部', value: 0 },
  { key: String(PAYMENT_STATUS.UNPAID), label: '未支付', value: PAYMENT_STATUS.UNPAID },
  { key: String(PAYMENT_STATUS.CONFIRMING), label: '确认中', value: PAYMENT_STATUS.CONFIRMING },
  { key: String(PAYMENT_STATUS.PAID), label: '已支付', value: PAYMENT_STATUS.PAID },
  { key: String(PAYMENT_STATUS.CLOSED), label: '已关闭', value: PAYMENT_STATUS.CLOSED },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { label: '全部支付', value: 0 },
  { label: '未支付', value: PAYMENT_STATUS.UNPAID },
  { label: '确认中', value: PAYMENT_STATUS.CONFIRMING },
  { label: '已支付', value: PAYMENT_STATUS.PAID },
  { label: '已关闭', value: PAYMENT_STATUS.CLOSED },
];

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
