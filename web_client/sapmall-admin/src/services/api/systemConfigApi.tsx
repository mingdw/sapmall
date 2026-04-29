import baseClient from './baseClient';
import type { ApiResponse } from '../types/baseTypes';

export interface SystemConfigInfo {
  id: number;
  configKey: string;
  configName: string;
  configValue?: string;
  configType: string;
  configGroup?: string;
  description?: string;
  isSystem: number;
  isEncrypted: number;
  isEditable: number;
  sort: number;
  status: number;
  syncToContract?: number; // 0否 1是
  createdAt?: string;
  updatedAt?: string;
  creator?: string;
  updator?: string;
}

export interface ListSystemConfigReq {
  configKey?: string;
  configName?: string;
  configType?: string;
  configGroup?: string;
  status?: number;
  page: number;
  pageSize: number;
}

export interface ListSystemConfigResp {
  list: SystemConfigInfo[];
  total: number;
}

export interface SaveSystemConfigReq {
  id?: number;
  configKey: string;
  configName: string;
  configValue?: string;
  configType: string;
  configGroup?: string;
  description?: string;
  isSystem?: number;
  isEncrypted?: number;
  isEditable?: number;
  sort?: number;
  status?: number;
  syncToContract?: number; // 0否 1是
}

export const SYSTEM_CONFIG_TYPE_OPTIONS = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔值', value: 'boolean' },
  { label: 'JSON', value: 'json' },
  { label: '数组', value: 'array' },
];

const systemConfigApi = {
  list: async (payload: ListSystemConfigReq): Promise<ApiResponse<ListSystemConfigResp>> => {
    return baseClient.post<ListSystemConfigResp>('/api/admin/config/list', payload);
  },

  save: async (payload: SaveSystemConfigReq): Promise<ApiResponse<null>> => {
    return baseClient.post<null>('/api/admin/config', payload);
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    return baseClient.delete<null>(`/api/admin/config/${id}`);
  },
};

export default systemConfigApi;
