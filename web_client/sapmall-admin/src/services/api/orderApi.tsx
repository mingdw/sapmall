import baseClient from './baseClient';
import type { ApiResponse } from '../types/baseTypes';

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
  spuId?: number;
  spuCode?: string;
  skuId?: number;
  skuCode?: string;
  skuImgs?: string;
  productName?: string;
  productPrice?: number;
  productQuantity?: number;
  totalAmount?: number;
  productRemark?: string;
  orderStatus: number;
  orderStatusDesc?: string;
  paymentStatus: number;
  paymentStatusDesc?: string;
  orderDate?: string;
  currency?: string;
  settleCurrency?: string;
  discountAmount?: number;
  payableAmount?: number;
  platformFeeAmount?: number;
  estGasFee?: number;
  actGasFee?: number;
  payAmount?: number;
  realAmount?: number;
  orderRemark?: string;
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
  blockNumber?: number;
  confirmations?: number;
  requiredConfirmations?: number;
  expireAt?: string;
  paidAt?: string;
  confirmedAt?: string;
  failReason?: string;
}

export interface OrderSummary {
  id: number;
  orderCode: string;
  userId: number;
  userCode?: string;
  productName?: string;
  productQuantity?: number;
  skuImgs?: string;
  totalAmount?: number;
  payAmount?: number;
  realAmount?: number;
  currency?: string;
  settleCurrency?: string;
  platformFeeAmount?: number;
  actGasFee?: number;
  chainId?: number;
  chainName?: string;
  tokenSymbol?: string;
  confirmedAt?: string;
  orderStatus: number;
  orderStatusDesc?: string;
  paymentStatus: number;
  paymentStatusDesc?: string;
  payerAddress?: string;
  orderDate?: string;
  expireAt?: string;
  createdAt?: string;
}

export interface ListOrderReq {
  page?: number;
  pageSize?: number;
  orderCode?: string;
  orderStatus?: number;
  paymentStatus?: number;
  orderDateStart?: string;
  orderDateEnd?: string;
}

export interface ListOrderResp {
  list: OrderSummary[];
  total: number;
}

export interface GetOrderResp {
  order: OrderInfo;
  payment: OrderPaymentInfo;
  promotions?: OrderPromotionItem[];
  delivery?: OrderDeliveryInput;
}

export type ModifyOrderAction = 'cancel' | 'delete' | 'resumePay';

export interface ModifyOrderReq {
  id: number;
  action: ModifyOrderAction;
  extendExpireMinutes?: number;
  orderRemark?: string;
}

export interface OrderStatusReq {
  orderCode: string;
  txHash?: string;
  chainId?: number;
}

export interface OrderStatusResp {
  orderStatus: number;
  paymentStatus: number;
  txHash?: string;
}

const orderApi = {
  list: async (payload: ListOrderReq): Promise<ApiResponse<ListOrderResp>> => {
    return baseClient.post<ListOrderResp>('/api/order/list', payload);
  },

  getByCode: async (orderCode: string): Promise<ApiResponse<GetOrderResp>> => {
    return baseClient.get<GetOrderResp>(`/api/order/${encodeURIComponent(orderCode)}`);
  },

  modify: async (payload: ModifyOrderReq): Promise<ApiResponse<null>> => {
    return baseClient.post<null>('/api/order/modify', payload);
  },

  queryStatus: async (payload: OrderStatusReq): Promise<ApiResponse<OrderStatusResp>> => {
    return baseClient.post<OrderStatusResp>('/api/order/status', payload);
  },
};

export default orderApi;
