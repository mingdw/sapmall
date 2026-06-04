import baseClient from './baseClient';
import { DEFAULT_PAYMENT_CHAIN_ID } from '../../config/paymentChains';
import { getUsdcTokenConfig } from '../../config/walletTokens';

export interface OrderPreviewItem {
  skuId: number;
  skuCode: string;
  productCode: string;
  productName: string;
  /** 商品简介缩写（首行截断） */
  productBrief?: string;
  imageUrl: string;
  specText: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderPreviewResult {
  items: OrderPreviewItem[];
  /** 应付合计（含结算层促销后） */
  totalAmount: number;
  /** 商品售价小计（促销前） */
  saleSubtotal?: number;
  /** 标价/划线价合计（仅展示用） */
  listAmount?: number;
  /** @deprecated 同 listAmount */
  originalAmount?: number;
  /** 结算层促销减免合计（不含标价→售价差额） */
  discountAmount?: number;
  /** @deprecated 使用 promotions */
  promotionLabel?: string;
  /** 促销明细（多项合计等于 discountAmount） */
  promotions?: Array<{ id: string; labelKey: string; amount: number }>;
  currency: 'USDC';
}

export interface OrderCreateResult {
  orderCode: string;
  status: number;
  expireAt: string;
}

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
}

export interface PaymentIntentStatus {
  intentId: string;
  orderCode: string;
  paymentStatus: number;
  txHash?: string;
  confirmations?: number;
  requiredConfirmations?: number;
}

const isOrderApiMock = () => process.env.REACT_APP_ORDER_API_MOCK !== 'false';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockIntentStore = new Map<
  string,
  { createdAt: number; paymentStatus: number; txHash?: string; orderCode: string }
>();

function mockIntentBundle(orderCode: string, totalAmount: number, payerAddress?: string): PaymentIntentBundle {
  const chainId = Number(process.env.REACT_APP_PAYMENT_CHAIN_ID) || DEFAULT_PAYMENT_CHAIN_ID;
  const usdc = getUsdcTokenConfig(chainId);
  const decimals = usdc?.decimals ?? 6;
  const amountRaw = BigInt(Math.round(totalAmount * 10 ** decimals));
  const intentId = `opi_${crypto.randomUUID?.() ?? `${Date.now()}`}`;
  const expireAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  mockIntentStore.set(intentId, { createdAt: Date.now(), paymentStatus: 1, orderCode });

  return {
    intentId,
    orderCode,
    chainId,
    contractAddress: process.env.REACT_APP_PAYMENT_ROUTER_ADDRESS || '0x0000000000000000000000000000000000000001',
    tokenAddress: usdc?.address ?? '0xFEce4462D57bD51A6A552365A011b95f0E16d9B7',
    tokenSymbol: 'USDC',
    amount: amountRaw.toString(),
    decimals,
    expireAt,
    payerAddress: payerAddress || '0x0000000000000000000000000000000000000000',
  };
}

export const orderApi = {
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
    const response = await baseClient.post<{ preview: OrderPreviewResult }>('/api/order/preview', {
      skuId: payload.skuId,
      quantity: payload.quantity,
    });
    return response.data?.preview ?? (response as unknown as OrderPreviewResult);
  },

  create: async (payload: { skuId: number; quantity: number }): Promise<OrderCreateResult> => {
    if (isOrderApiMock()) {
      await delay(900);
      const orderCode = `ORD${Date.now().toString(36).toUpperCase()}`;
      return {
        orderCode,
        status: 10,
        expireAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };
    }
    const response = await baseClient.post<{ order: OrderCreateResult }>('/api/order/create', payload);
    return response.data?.order ?? (response as unknown as OrderCreateResult);
  },

  createPaymentIntent: async (
    orderCode: string,
    payerAddress?: string,
    totalAmount?: number,
  ): Promise<PaymentIntentBundle> => {
    if (isOrderApiMock()) {
      await delay(500);
      return mockIntentBundle(orderCode, totalAmount ?? 9.9, payerAddress);
    }
    const response = await baseClient.post<{ intent: PaymentIntentBundle }>('/api/payment/intent', {
      orderCode,
    });
    return response.data?.intent ?? (response as unknown as PaymentIntentBundle);
  },

  getPaymentIntent: async (intentId: string): Promise<PaymentIntentStatus> => {
    if (isOrderApiMock()) {
      await delay(300);
      const entry = mockIntentStore.get(intentId);
      if (!entry) {
        return {
          intentId,
          orderCode: '',
          paymentStatus: 6,
        };
      }
      const elapsed = Date.now() - entry.createdAt;
      let paymentStatus = entry.paymentStatus;
      let txHash = entry.txHash;
      if (paymentStatus === 2 && elapsed > 6000) {
        paymentStatus = 3;
        entry.paymentStatus = 3;
      }
      if (paymentStatus === 1 && elapsed > 2000) {
        paymentStatus = 2;
        entry.paymentStatus = 2;
        txHash = txHash ?? `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2, 18)}`;
        entry.txHash = txHash;
      }
      return {
        intentId,
        orderCode: entry.orderCode,
        paymentStatus,
        txHash,
        confirmations: paymentStatus === 3 ? 6 : 2,
        requiredConfirmations: 6,
      };
    }
    const response = await baseClient.get<PaymentIntentStatus>(`/api/payment/intent/${intentId}`);
    return response.data ?? (response as unknown as PaymentIntentStatus);
  },
};

/** mock：支付成功后写入 intent 为确认中，供轮询推进 */
export function mockAdvancePaymentIntent(intentId: string, txHash: string) {
  const entry = mockIntentStore.get(intentId);
  if (entry) {
    entry.paymentStatus = 2;
    entry.txHash = txHash;
  } else {
    mockIntentStore.set(intentId, {
      createdAt: Date.now(),
      paymentStatus: 2,
      txHash,
      orderCode: '',
    });
  }
}
