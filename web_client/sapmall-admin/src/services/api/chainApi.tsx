import baseClient from './baseClient';
import type { ApiResponse } from '../types/baseTypes';

export interface ChainNetworkInfo {
  id: number;
  chainId: number;
  code: string;
  name: string;
  rpcUrl?: string;
  wsUrl?: string;
  explorerUrl?: string;
  nativeSymbol?: string;
  platformConfigAddress?: string;
  paymentRouterAddress?: string;
  settlementVaultAddress?: string;
  signerKeyRef?: string;
  listenerEnabled: number;
  listenerStartBlock: number;
  listenerLastBlock: number;
  sort: number;
  status: number;
  remark?: string;
  paymentTokens?: ChainPaymentTokenInfo[];
  createdAt?: string;
  updatedAt?: string;
  creator?: string;
  updator?: string;
}

export interface ChainPaymentTokenInfo {
  id: number;
  chainId: number;
  symbol: string;
  displayName?: string;
  contractAddress: string;
  decimals: number;
  configKey: string;
  syncStatus: number;
  lastSyncTxHash?: string;
  lastSyncAt?: string;
  syncError?: string;
  sort: number;
  status: number;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
  creator?: string;
  updator?: string;
}

export interface ListChainNetworkReq {
  code?: string;
  name?: string;
  status?: number;
  page: number;
  pageSize: number;
}

export interface ListChainNetworkResp {
  list: ChainNetworkInfo[];
  total: number;
}

export interface SaveChainNetworkReq {
  id?: number;
  chainId: number;
  code: string;
  name: string;
  rpcUrl?: string;
  wsUrl?: string;
  explorerUrl?: string;
  nativeSymbol?: string;
  platformConfigAddress?: string;
  paymentRouterAddress?: string;
  settlementVaultAddress?: string;
  signerKeyRef?: string;
  listenerEnabled?: number;
  listenerStartBlock?: number;
  listenerLastBlock?: number;
  sort?: number;
  status?: number;
  remark?: string;
}

export interface ListChainPaymentTokenReq {
  chainId?: number;
  symbol?: string;
  status?: number;
  syncStatus?: number;
  page: number;
  pageSize: number;
}

export interface ListChainPaymentTokenResp {
  list: ChainPaymentTokenInfo[];
  total: number;
}

export interface SaveChainPaymentTokenReq {
  id?: number;
  chainId: number;
  symbol: string;
  displayName?: string;
  contractAddress: string;
  decimals?: number;
  configKey?: string;
  sort?: number;
  status?: number;
  remark?: string;
}

const chainApi = {
  listChainNetwork: async (payload: ListChainNetworkReq): Promise<ApiResponse<ListChainNetworkResp>> => {
    return baseClient.post<ListChainNetworkResp>('/api/admin/chain/network/list', payload);
  },

  saveChainNetwork: async (payload: SaveChainNetworkReq): Promise<ApiResponse<null>> => {
    return baseClient.post<null>('/api/admin/chain/network', payload);
  },

  deleteChainNetwork: async (id: number): Promise<ApiResponse<null>> => {
    return baseClient.delete<null>(`/api/admin/chain/network/${id}`);
  },

  listChainPaymentToken: async (
    payload: ListChainPaymentTokenReq,
  ): Promise<ApiResponse<ListChainPaymentTokenResp>> => {
    return baseClient.post<ListChainPaymentTokenResp>('/api/admin/chain/payment-token/list', payload);
  },

  saveChainPaymentToken: async (payload: SaveChainPaymentTokenReq): Promise<ApiResponse<null>> => {
    return baseClient.post<null>('/api/admin/chain/payment-token', payload);
  },

  deleteChainPaymentToken: async (id: number): Promise<ApiResponse<null>> => {
    return baseClient.delete<null>(`/api/admin/chain/payment-token/${id}`);
  },
};

export default chainApi;
