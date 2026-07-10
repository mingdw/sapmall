import baseClient from './baseClient';
import { ARC_TESTNET_CHAIN_ID } from '../../config/chains/arcTestnet';
import { getPaymentRouterAddress } from '../../config/paymentContracts';
import { getUsdcTokenConfig } from '../../config/walletTokens';

export interface OrderPreviewItem {
  skuId: number;
  skuCode: string;
  productCode: string;
  productName: string;
  productBrief?: string;
  imageUrl: string;
  skuImgs?: string[];
  specText: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderPreviewResult {
  items: OrderPreviewItem[];
  totalAmount: number;
  saleSubtotal?: number;
  listAmount?: number;
  originalAmount?: number;
  discountAmount?: number;
  promotionLabel?: string;
  promotions?: Array<{ id: string; labelKey: string; amount: number }>;
  currency: 'USDC';
}

export interface OrderPromotionItem {
  promoId: string;
  labelKey: string;
  label?: string;
  amount: number;
}

export interface OrderDeliveryInput {
  receiverName?: string;
  receiverPhone?: string;
  receiverEmail?: string;
}

export interface OrderInfo {
  orderCode: string;
  orderStatus: number;
  orderStatusDesc?: string;
  paymentStatus: number;
  paymentStatusDesc?: string;
  spuId?: number;
  spuCode?: string;
  skuId?: number;
  skuCode?: string;
  skuImgs?: string;
  productName?: string;
  productPrice?: number;
  productQuantity?: number;
  totalAmount?: number;
  discountAmount?: number;
  payableAmount?: number;
  platformFeeAmount?: number;
  estGasFee?: number;
  actGasFee?: number;
  payAmount?: number;
  realAmount?: number;
  expireAt?: string;
}

export interface OrderPaymentInfo {
  intentId: string;
  orderCode?: string;
  payerAddress: string;
  chainId: number;
  tokenSymbol: string;
  tokenAddress: string;
  contractAddress: string;
  amountRaw: string;
  tokenDecimals: number;
  payAmount?: number;
  estGasFee?: number;
  actGasFee?: number;
  paymentStatus?: number;
  paymentStatusDesc?: string;
  txHash?: string;
  confirmations?: number;
  requiredConfirmations?: number;
  expireAt?: string;
  paidAt?: string;
  confirmedAt?: string;
  failReason?: string;
  /** payOrder 卖家地址 */
  sellerAddress?: string;
}

/** POST /api/order/create 请求体（与后端 CreateOrderReq / sys_order 对齐） */
export interface CreateOrderReq {
  skuId: number;
  skuCode?: string;
  spuId?: number;
  spuCode?: string;
  productName?: string;
  productPrice?: number;
  quantity: number;
  /** 商品行小计 → sys_order.total_amount */
  totalAmount?: number;
  productRemark?: string;
  payerAddress: string;
  chainId?: number;
  tokenSymbol?: string;
  promotions?: OrderPromotionItem[];
  /** 促销金额 → sys_order.discount_amount */
  discountAmount: number;
  payableAmount: number;
  platformFeeAmount: number;
  /** 预估 Gas → sys_order.est_gas_fee */
  estGasFee: number;
  payAmount: number;
  currency?: string;
  orderRemark?: string;
  delivery?: OrderDeliveryInput;
}

export interface CreateOrderResp {
  order: OrderInfo;
  payment: OrderPaymentInfo;
  promotions?: OrderPromotionItem[];
}

/** POST /api/order/status 请求体 */
export interface OrderStatusReq {
  orderCode: string;
  txHash?: string;
  chainId?: number; // 链ID，用于查询 sys_chain_network 获取 RPC 地址
}

/** POST /api/order/status 响应体 */
export interface OrderStatusResp {
  orderStatus: number;
  paymentStatus: number;
  txHash?: string;
  orderCode?: string;
  /** 商品总金额（优惠前，USDC 计价） */
  totalAmount?: number;
  /** 优惠总金额（USDC 计价） */
  discountAmount?: number;
  /** 商品应付（优惠后，USDC 计价） */
  payableAmount?: number;
  /** 平台费（USDC 计价） */
  platformFeeAmount?: number;
  /** 链上实付（支付币种数量） */
  payAmount?: number;
  tokenSymbol?: string;
  chainId?: number;
  /** Gas 费（USDC 计价） */
  gasFeeUsdc?: number;
  /** 支付完成时间（RFC3339） */
  paidAt?: string;
  /** 支付失败原因 */
  failReason?: string;
}

export interface GetOrderResp {
  order: OrderInfo;
  payment: OrderPaymentInfo;
  promotions?: OrderPromotionItem[];
  delivery?: OrderDeliveryInput;
}

/** 链上 payOrder 使用的 intent 参数包（由 OrderPaymentInfo 映射） */
export interface PaymentIntentBundle {
  intentId: string;
  orderCode: string;
  chainId: number;
  contractAddress: string;
  tokenAddress: string;
  tokenSymbol: string;
  amount: string;
  decimals: number;
  expireAt: string;
  payerAddress: string;
  /** payOrder 卖家地址 */
  sellerAddress: string;
}

export interface OrderPaymentStatus {
  intentId: string;
  orderCode: string;
  paymentStatus: number;
  txHash?: string;
  confirmations?: number;
  requiredConfirmations?: number;
  failReason?: string;
}

/** 仅当 REACT_APP_ORDER_API_MOCK=true 时走 Mock */
const isOrderApiMock = () => process.env.REACT_APP_ORDER_API_MOCK === 'true';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockOrderStore = new Map<
  string,
  {
    createdAt: number;
    paymentStatus: number;
    txHash?: string;
    orderCode: string;
    intentId: string;
    bundle: PaymentIntentBundle;
  }
>();

export function paymentToIntentBundle(payment: OrderPaymentInfo, orderCode: string): PaymentIntentBundle {
  // 优先使用前端部署表中的 Router，避免库内旧地址导致授权到错误合约
  const canonicalRouter = getPaymentRouterAddress(payment.chainId);
  const contractAddress =
    canonicalRouter ??
    payment.contractAddress;
  return {
    intentId: payment.intentId,
    orderCode: payment.orderCode || orderCode,
    chainId: payment.chainId,
    contractAddress,
    tokenAddress: payment.tokenAddress,
    tokenSymbol: payment.tokenSymbol,
    amount: payment.amountRaw,
    decimals: payment.tokenDecimals,
    expireAt: payment.expireAt ?? '',
    payerAddress: payment.payerAddress,
    sellerAddress: payment.sellerAddress ?? '',
  };
}

function mockIntentBundle(orderCode: string, payAmount: number, payerAddress: string): PaymentIntentBundle {
  const chainId = Number(process.env.REACT_APP_PAYMENT_CHAIN_ID) || ARC_TESTNET_CHAIN_ID;
  const usdc = getUsdcTokenConfig(chainId);
  const routerAddress = getPaymentRouterAddress(chainId);
  if (!routerAddress) {
    throw new Error(`未配置 chainId=${chainId} 的 PaymentRouter 地址`);
  }
  if (!usdc) {
    throw new Error(`未配置 chainId=${chainId} 的 USDC 代币地址`);
  }
  const decimals = usdc.decimals;
  const amountRaw = BigInt(Math.round(payAmount * 10 ** decimals));
  const intentId = `opi_${crypto.randomUUID?.() ?? `${Date.now()}`}`;
  const expireAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  return {
    intentId,
    orderCode,
    chainId,
    contractAddress: routerAddress,
    tokenAddress: usdc.address,
    tokenSymbol: 'USDC',
    amount: amountRaw.toString(),
    decimals,
    expireAt,
    payerAddress,
    sellerAddress:
      process.env.REACT_APP_PLATFORM_SELLER_ADDRESS?.trim() ||
      '0x276c145EB3C7F1017E00D4Bee7FBAca88531Ab40',
  };
}

function buildLocalPreview(payload: {
  skuId: number;
  quantity: number;
  unitPrice?: number;
  productName?: string;
  productBrief?: string;
  imageUrl?: string;
  specText?: string;
  skuCode?: string;
  productCode?: string;
}): OrderPreviewResult {
  const unitPrice = payload.unitPrice ?? 9.9;
  const subtotal = unitPrice * payload.quantity;
  return {
    items: [
      {
        skuId: payload.skuId,
        skuCode: payload.skuCode ?? `SKU-${payload.skuId}`,
        productCode: payload.productCode ?? '',
        productName: payload.productName ?? 'Sapphire Mall Item',
        productBrief: payload.productBrief,
        imageUrl: payload.imageUrl ?? '',
        specText: payload.specText ?? '',
        quantity: payload.quantity,
        unitPrice,
        subtotal,
      },
    ],
    totalAmount: subtotal,
    currency: 'USDC',
  };
}

export const orderApi = {
  /** 结算预览：Phase 1 由前端本地计算（后端无 preview 接口） */
  preview: async (payload: {
    skuId: number;
    quantity: number;
    productCode?: string;
    specText?: string;
    unitPrice?: number;
    productName?: string;
    productBrief?: string;
    imageUrl?: string;
    skuCode?: string;
  }): Promise<OrderPreviewResult> => {
    if (isOrderApiMock()) {
      await delay(400);
    }
    return buildLocalPreview(payload);
  },

  /** 创建订单并返回 payment intent（一步） */
  create: async (payload: CreateOrderReq): Promise<CreateOrderResp> => {
    if (isOrderApiMock()) {
      await delay(900);
      const orderCode = `ORD${Date.now().toString(36).toUpperCase()}`;
      const bundle = mockIntentBundle(orderCode, payload.payAmount, payload.payerAddress);
      mockOrderStore.set(orderCode, {
        createdAt: Date.now(),
        paymentStatus: 1,
        orderCode,
        intentId: bundle.intentId,
        bundle,
      });
      return {
        order: {
          orderCode,
          orderStatus: 10,
          paymentStatus: 1,
          payAmount: payload.payAmount,
          expireAt: bundle.expireAt,
        },
        payment: {
          intentId: bundle.intentId,
          orderCode,
          payerAddress: payload.payerAddress,
          chainId: bundle.chainId,
          tokenSymbol: bundle.tokenSymbol,
          tokenAddress: bundle.tokenAddress,
          contractAddress: bundle.contractAddress,
          amountRaw: bundle.amount,
          tokenDecimals: bundle.decimals,
          payAmount: payload.payAmount,
          paymentStatus: 1,
          expireAt: bundle.expireAt,
        },
      };
    }

    const response = await baseClient.post<CreateOrderResp>('/api/order/create', payload);
    if (!response.data) {
      throw new Error('创建订单响应为空');
    }
    return response.data;
  },

  /** 修改订单状态（cancel/delete/resumePay/confirming） */
  modify: async (
    params: { orderId?: number; orderCode?: string; action: string; txHash?: string },
    options?: { silent?: boolean },
  ): Promise<void> => {
    if (isOrderApiMock()) {
      await delay(300);
      return;
    }
    await baseClient.post('/api/order/modify', params, { silent: options?.silent });
  },

  /** 查询订单支付状态（前端轮询） */
  getStatus: async (params: OrderStatusReq): Promise<OrderStatusResp> => {
    if (isOrderApiMock()) {
      await delay(300);
      const entry = mockOrderStore.get(params.orderCode);
      if (!entry) {
        return { orderStatus: 10, paymentStatus: 4 };
      }
      const elapsed = Date.now() - entry.createdAt;
      let paymentStatus = entry.paymentStatus;
      if (paymentStatus === 2 && elapsed > 6000) {
        paymentStatus = 3;
        entry.paymentStatus = 3;
      }
      return {
        orderStatus: paymentStatus >= 3 ? 30 : paymentStatus === 2 ? 20 : 10,
        paymentStatus,
        txHash: entry.txHash,
        orderCode: params.orderCode,
        payableAmount: 6.7,
        payAmount: entry.bundle
          ? Number(entry.bundle.amount) / 10 ** entry.bundle.decimals
          : 6.7,
        tokenSymbol: entry.bundle?.tokenSymbol ?? 'USDC',
        chainId: entry.bundle?.chainId,
        gasFeeUsdc: 0.01,
      };
    }
    const response = await baseClient.post<OrderStatusResp>('/api/order/status', params);
    if (!response.data) {
      throw new Error('查询支付状态响应为空');
    }
    return response.data;
  },

  /** 按订单号查询支付状态（结果页轮询） */
  getOrder: async (orderCode: string): Promise<GetOrderResp> => {
    if (isOrderApiMock()) {
      await delay(300);
      const entry = mockOrderStore.get(orderCode);
      if (!entry) {
        return {
          order: { orderCode, orderStatus: 10, paymentStatus: 4 },
          payment: {
            intentId: '',
            payerAddress: '',
            chainId: ARC_TESTNET_CHAIN_ID,
            tokenSymbol: 'USDC',
            tokenAddress: '',
            contractAddress: '',
            amountRaw: '0',
            tokenDecimals: 6,
            paymentStatus: 4,
          },
        };
      }
      const elapsed = Date.now() - entry.createdAt;
      let paymentStatus = entry.paymentStatus;
      const txHash = entry.txHash;
      if (paymentStatus === 2 && elapsed > 6000) {
        paymentStatus = 3;
        entry.paymentStatus = 3;
      }
      return {
        order: {
          orderCode: entry.orderCode,
          orderStatus: paymentStatus >= 3 ? 30 : 10,
          paymentStatus,
        },
        payment: {
          intentId: entry.intentId,
          orderCode: entry.orderCode,
          payerAddress: entry.bundle.payerAddress,
          chainId: entry.bundle.chainId,
          tokenSymbol: entry.bundle.tokenSymbol,
          tokenAddress: entry.bundle.tokenAddress,
          contractAddress: entry.bundle.contractAddress,
          amountRaw: entry.bundle.amount,
          tokenDecimals: entry.bundle.decimals,
          paymentStatus,
          txHash,
          confirmations: paymentStatus === 3 ? 6 : 2,
          requiredConfirmations: 6,
        },
      };
    }

    const response = await baseClient.get<GetOrderResp>(
      `/api/order/${encodeURIComponent(orderCode)}`,
    );
    if (!response.data) {
      throw new Error('查询订单响应为空');
    }
    return response.data;
  },
};

/** Mock：链上提交成功后标记为确认中 */
export function mockAdvancePaymentIntent(orderCode: string, txHash: string) {
  const entry = mockOrderStore.get(orderCode);
  if (entry) {
    entry.paymentStatus = 2;
    entry.txHash = txHash;
  }
}

/** 从 GetOrderResp 提取轮询状态 */
export function toOrderPaymentStatus(resp: GetOrderResp): OrderPaymentStatus {
  return {
    intentId: resp.payment.intentId,
    orderCode: resp.order.orderCode,
    paymentStatus: resp.payment.paymentStatus ?? resp.order.paymentStatus,
    txHash: resp.payment.txHash,
    confirmations: resp.payment.confirmations,
    requiredConfirmations: resp.payment.requiredConfirmations,
  };
}
