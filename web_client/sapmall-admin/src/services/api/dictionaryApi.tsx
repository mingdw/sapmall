import baseClient from './baseClient';
import type { ApiResponse } from '../types/baseTypes';

export const DICT_CATEGORY_TYPE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: '系统字典', value: '0' },
  { label: '用户自定义', value: '1' },
  { label: '其它', value: '2' },
];

export const getDictCategoryTypeLabel = (value: string): string => {
  const found = DICT_CATEGORY_TYPE_OPTIONS.find((item) => item.value === value);
  return found?.label || value;
};

export interface DictCategoryInfo {
  id: number;
  dictType: string;
  code: string;
  desc?: string;
  level: number;
  sort: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DictItemInfo {
  id: number;
  dictCategoryCode: string;
  code: string;
  value: string;
  desc?: string;
  level: number;
  sort: number;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListDictCategoryReq {
  dictType?: string;
  code?: string;
  status?: number;
  page: number;
  pageSize: number;
}

export interface ListDictCategoryResp {
  list: DictCategoryInfo[];
  total: number;
}

export interface SaveDictCategoryReq {
  id?: number;
  dictType: string;
  code: string;
  desc?: string;
  level?: number;
  sort?: number;
  status?: number;
}

export interface ListDictItemByTypeReq {
  dictCategoryCode: string;
  status?: number;
  page?: number;
  pageSize?: number;
}

export interface ListDictItemByTypeResp {
  list: DictItemInfo[];
  total: number;
}

export interface SaveDictItemReq {
  id?: number;
  dictCategoryCode: string;
  code: string;
  value: string;
  desc?: string;
  level?: number;
  sort?: number;
  status?: number;
}

export const dictionaryApi = {
  listDictCategory: async (payload: ListDictCategoryReq): Promise<ApiResponse<ListDictCategoryResp>> => {
    return baseClient.post<ListDictCategoryResp>('/api/admin/dict/category/list', payload);
  },

  saveDictCategory: async (payload: SaveDictCategoryReq): Promise<ApiResponse<null>> => {
    return baseClient.post<null>('/api/admin/dict/category', payload);
  },

  listDictItemByType: async (payload: ListDictItemByTypeReq): Promise<ApiResponse<ListDictItemByTypeResp>> => {
    const query = new URLSearchParams();
    if (typeof payload.status === 'number') query.set('status', String(payload.status));
    if (payload.page) query.set('page', String(payload.page));
    if (payload.pageSize) query.set('pageSize', String(payload.pageSize));
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return baseClient.get<ListDictItemByTypeResp>(
      `/api/admin/dict/item/${encodeURIComponent(payload.dictCategoryCode)}${suffix}`,
    );
  },

  saveDictItem: async (payload: SaveDictItemReq): Promise<ApiResponse<null>> => {
    return baseClient.post<null>('/api/admin/dict/item', payload);
  },

  deleteDictItem: async (id: number): Promise<ApiResponse<null>> => {
    return baseClient.delete<null>(`/api/admin/dict/item/${id}`);
  },
};

export default dictionaryApi;
