/** 订单主状态 */
export const ORDER_STATUS = {
  PENDING_PAY: 10,
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
  { label: '已支付', value: ORDER_STATUS.PAID },
  { label: '待发货', value: ORDER_STATUS.TO_SHIP },
  { label: '已发货', value: ORDER_STATUS.SHIPPED },
  { label: '已完成', value: ORDER_STATUS.COMPLETED },
  { label: '已取消', value: ORDER_STATUS.CANCELLED },
  { label: '已过期', value: ORDER_STATUS.EXPIRED },
  { label: '支付失败', value: ORDER_STATUS.PAY_FAILED },
];

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
      return 'gold';
    case ORDER_STATUS.PAID:
    case ORDER_STATUS.COMPLETED:
      return 'green';
    case ORDER_STATUS.CANCELLED:
    case ORDER_STATUS.EXPIRED:
      return 'default';
    case ORDER_STATUS.PAY_FAILED:
      return 'red';
    default:
      return 'blue';
  }
}

export function paymentStatusTagColor(status: number): string {
  switch (status) {
    case PAYMENT_STATUS.UNPAID:
      return 'orange';
    case PAYMENT_STATUS.CONFIRMING:
      return 'processing';
    case PAYMENT_STATUS.PAID:
      return 'success';
    case PAYMENT_STATUS.CLOSED:
      return 'default';
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

export function canResumePay(orderStatus: number, paymentStatus: number): boolean {
  return (
    paymentStatus !== PAYMENT_STATUS.PAID &&
    (orderStatus === ORDER_STATUS.PENDING_PAY ||
      orderStatus === ORDER_STATUS.CANCELLED ||
      orderStatus === ORDER_STATUS.EXPIRED ||
      orderStatus === ORDER_STATUS.PAY_FAILED)
  );
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
