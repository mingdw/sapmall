/** KPI 时段 */
export type KpiPeriod = 'today' | 'week' | 'month';

/** 趋势指标类型 */
export type TrendMetric = 'sales' | 'orders';

/** 订单状态 */
export type OrderStatus = 'pending_ship' | 'shipped' | 'completed' | 'after_sale';

/** 认证状态 */
export type CertStatus = 'verified' | 'pending' | 'unverified';

export interface MerchantIdentity {
  /** 钱包地址（完整，展示时缩写） */
  walletAddress: string;
  /** 商家等级文案，如 Level 3 */
  level: string;
  /** 店铺评分 */
  rating: number;
  /** 认证状态 */
  certStatus: CertStatus;
}

export interface KpiMetric {
  key: string;
  label: string;
  value: string | number;
  /** 副文案，如「待处理: 23」 */
  sub?: string;
  trend: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  icon: string;
  variant: 'primary' | 'success' | 'purple' | 'orange';
}

export interface TodoItem {
  key: 'pending_ship' | 'after_sale' | 'review_reply';
  label: string;
  count: number;
  icon: string;
  description: string;
}

export interface TrendPoint {
  label: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  salesCount: number;
  revenue: string;
  /** 相对最高销量的占比 0-100，用于进度条 */
  share: number;
}

export interface RecentOrder {
  id: string;
  orderNo: string;
  productName: string;
  buyer: string;
  amount: string;
  status: OrderStatus;
  time: string;
}

/** 消息类型 */
export type CustomerMessageType = 'text' | 'image' | 'order' | 'product';

/** 单条会话消息 */
export interface CustomerMessage {
  id: string;
  from: 'buyer' | 'merchant';
  time: string;
  type?: CustomerMessageType;
  content: string;
  imageUrl?: string;
  order?: {
    orderNo: string;
    productName: string;
    amount: string;
  };
  product?: {
    id: string;
    name: string;
    price: string;
  };
}

/** 与单个买家的会话 */
export interface CustomerConversation {
  id: string;
  buyerAddress: string;
  /** 关联订单号（可选展示） */
  relatedOrderNo?: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: CustomerMessage[];
}

export interface StoreOverviewMock {
  merchant: MerchantIdentity;
  todos: TodoItem[];
  kpiByPeriod: Record<KpiPeriod, KpiMetric[]>;
  trendByPeriod: Record<KpiPeriod, TrendPoint[]>;
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  conversations: CustomerConversation[];
}
