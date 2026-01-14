import baseClient from './baseClient';
import { ApiResponse } from '../types/baseTypes';
import type {
  ProductListParams,
  ProductListResponse,
  SaveProductReq,
  ProductSPU,
  ProductStats,
} from '../../pages/business/products/types';
import { mockProductApi } from './mockData/productMockData';

// 是否使用 Mock 数据（可以通过环境变量控制）
// 默认使用 mock 数据，设置 REACT_APP_USE_MOCK_DATA=false 可切换到真实 API
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA !== 'false';

export const productApi = {
  /**
   * 获取商品列表（分页）
   */
  getProductList: async (params: ProductListParams = {}): Promise<ApiResponse<ProductListResponse>> => {
    if (USE_MOCK_DATA) {
      console.log('[Mock] 获取商品列表', params);
      return mockProductApi.getProductList(params) as Promise<ApiResponse<ProductListResponse>>;
    }
    
    try {
      const response = await baseClient.post<ProductListResponse>(
        '/api/admin/product/list',
        {
          categoryCodes: params.categoryCodes || '',
          productName: params.productName || '',
          status: params.status !== undefined && params.status !== '' ? params.status : undefined,
          page: params.page || 1,
          pageSize: params.pageSize || 10,
        }
      );
      return response;
    } catch (error) {
      console.error('获取商品列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取商品详情
   * @param id 商品SPU ID
   */
  getProductDetail: async (id: number): Promise<ApiResponse<ProductSPU>> => {
    try {
      const response = await baseClient.get<ProductSPU>(
        `/api/admin/product/${id}`
      );
      return response;
    } catch (error) {
      console.error('获取商品详情失败:', error);
      throw error;
    }
  },

  /**
   * 保存商品（新增/编辑）
   * 通过id字段自动判断：id为0或空表示新增，有值表示编辑
   */
  saveProduct: async (data: SaveProductReq): Promise<ApiResponse<ProductSPU>> => {
    if (USE_MOCK_DATA) {
      console.log('[Mock] 保存商品', data);
      return mockProductApi.saveProduct(data) as Promise<ApiResponse<ProductSPU>>;
    }
    
    try {
      console.log('保存商品请求数据:', data);
      const response = await baseClient.post<ProductSPU>(
        '/api/admin/product',
        data
      );
      console.log('保存商品响应:', response);
      return response;
    } catch (error) {
      console.error('保存商品失败:', error);
      throw error;
    }
  },

  /**
   * 删除商品
   * @param id 商品SPU ID
   */
  deleteProduct: async (id: number): Promise<ApiResponse<null>> => {
    if (USE_MOCK_DATA) {
      console.log('[Mock] 删除商品', id);
      return mockProductApi.deleteProduct(id) as Promise<ApiResponse<null>>;
    }
    
    try {
      console.log('删除商品ID:', id);
      const response = await baseClient.delete<null>(
        `/api/admin/product/${id}`
      );
      console.log('删除商品响应:', response);
      return response;
    } catch (error) {
      console.error('删除商品失败:', error);
      throw error;
    }
  },

  /**
   * 批量删除商品
   * @param ids 商品ID数组
   */
  batchDeleteProducts: async (ids: number[]): Promise<ApiResponse<null>> => {
    if (USE_MOCK_DATA) {
      console.log('[Mock] 批量删除商品', ids);
      return mockProductApi.batchDeleteProducts(ids) as Promise<ApiResponse<null>>;
    }
    
    try {
      const response = await baseClient.post<null>(
        '/api/admin/product/batch-delete',
        { ids }
      );
      return response;
    } catch (error) {
      console.error('批量删除商品失败:', error);
      throw error;
    }
  },

  /**
   * 批量下架商品
   * @param ids 商品ID数组
   */
  batchDeactivateProducts: async (ids: number[]): Promise<ApiResponse<null>> => {
    if (USE_MOCK_DATA) {
      console.log('[Mock] 批量下架商品', ids);
      return mockProductApi.batchDeactivateProducts(ids) as Promise<ApiResponse<null>>;
    }
    
    try {
      const response = await baseClient.post<null>(
        '/api/admin/product/batch-deactivate',
        { ids }
      );
      return response;
    } catch (error) {
      console.error('批量下架商品失败:', error);
      throw error;
    }
  },

  /**
   * 获取商品统计信息
   */
  getProductStats: async (period?: 'day' | 'week' | 'month'): Promise<ApiResponse<ProductStats>> => {
    if (USE_MOCK_DATA) {
      console.log('[Mock] 获取商品统计', period || 'day');
      return mockProductApi.getProductStats(period || 'day') as Promise<ApiResponse<ProductStats>>;
    }
    
    try {
      const response = await baseClient.get<ProductStats>(
        `/api/admin/product/stats${period ? `?period=${period}` : ''}`
      );
      return response;
    } catch (error) {
      console.error('获取商品统计失败:', error);
      throw error;
    }
  },

  /**
   * 导出商品数据
   */
  exportProducts: async (params: ProductListParams): Promise<Blob> => {
    if (USE_MOCK_DATA) {
      console.log('[Mock] 导出商品数据', params);
      return mockProductApi.exportProducts(params);
    }
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:7101'}/api/admin/product/export`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
          },
          body: JSON.stringify(params),
        }
      );
      
      if (!response.ok) {
        throw new Error('导出失败');
      }
      
      return await response.blob();
    } catch (error) {
      console.error('导出商品失败:', error);
      throw error;
    }
  },
};

export default productApi;
