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
  productName?: string;
  productPrice?: number;
  productQuantity?: number;
  productTotal?: number;
  productRemark?: string;
  orderStatus: number;
  orderStatusDesc?: string;
  paymentStatus: number;
  paymentStatusDesc?: string;
  orderDate?: string;
  currency?: string;
  saleSubtotal?: number;
  promotionDiscountAmount?: number;
  payableAmount?: number;
  platformFeeAmount?: number;
  estimatedGasFee?: number;
  payAmount?: number;
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
  payAmount?: number;
  currency?: string;
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
};

export default orderApi;
