import baseClient from './baseClient';
import { ApiResponse } from '../types/baseTypes';
import type {
  ProductListParams,
  ProductListResponse,
  SaveProductReq,
  ProductSPU,
  ProductSKU,
  ProductStats,
} from '../../pages/business/products/types';

export const productApi = {
  /**
   * 获取商品列表（分页）
   */
  getProductList: async (params: ProductListParams = {}): Promise<ApiResponse<ProductListResponse>> => {
    try {
      // 如果没有状态筛选，传递 -1 表示查询所有状态
      // status 可能的值：0(草稿)、1(待审核)、2(上架中)、3(已下架)、''(未选择)、-1(查询所有)
      const statusValue: number = params.status !== undefined && params.status !== '' 
        ? (typeof params.status === 'number' ? params.status : Number(params.status))
        : -1;
      
      const response = await baseClient.post<ProductListResponse>(
        '/api/admin/product/list',
        {
          categoryCodes: params.categoryCodes || '',
          productName: params.productName || '',
          productCode: params.productCode || '',
          status: statusValue,
          chainStatus: params.chainStatus || '',
          timeRange: params.timeRange || '',
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
    try {
      // 确保 price 和 realPrice 转换为字符串（后端API要求）
      const requestData: any = {
        ...data,
        price: data.price !== undefined && data.price !== null
          ? (typeof data.price === 'number' ? data.price.toString() : String(data.price))
          : undefined,
        realPrice: data.realPrice !== undefined && data.realPrice !== null
          ? (typeof data.realPrice === 'number' ? data.realPrice.toString() : String(data.realPrice))
          : undefined,
      };

      console.log('保存商品请求数据:', requestData);
      const response = await baseClient.post<ProductSPU>(
        '/api/admin/product',
        requestData
      );
      console.log('保存商品响应:', response);
      return response;
    } catch (error) {
      console.error('保存商品失败:', error);
      throw error;
    }
  },

  /**
   * 删除商品（单条删除也使用批量删除接口，传入单个ID的数组）
   * @param id 商品SPU ID
   */
  deleteProduct: async (id: number): Promise<ApiResponse<null>> => {
    try {
      console.log('删除商品ID:', id);
      // 单条删除也调用批量删除接口
      const response = await productApi.batchDeleteProducts([id]);
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
    try {
      const response = await baseClient.post<null>(
        '/api/admin/product/spu/deletes',
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

  /**
   * 获取商品完整详情（包含SKU、属性参数、详情等）
   * @param id 商品SPU ID
   */
  getProductFullDetail: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await baseClient.get<any>(
        `/api/admin/product/${id}/full`
      );
      return response;
    } catch (error) {
      console.error('获取商品完整详情失败:', error);
      throw error;
    }
  },

  /**
   * 批量上架商品
   * @param ids 商品ID数组
   */
  batchActivateProducts: async (ids: number[]): Promise<ApiResponse<null>> => {
    try {
      const response = await baseClient.post<null>(
        '/api/admin/product/batch-activate',
        { ids }
      );
      return response;
    } catch (error) {
      console.error('批量上架商品失败:', error);
      throw error;
    }
  },

  /**
   * 更新商品链上状态
   */
  updateChainStatus: async (
    id: number,
    chainStatus: string,
    chainId?: number,
    chainTxHash?: string
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await baseClient.post<null>(
        '/api/admin/product/update-chain-status',
        {
          id,
          chainStatus,
          chainId,
          chainTxHash,
        }
      );
      return response;
    } catch (error) {
      console.error('更新链上状态失败:', error);
      throw error;
    }
  },

  // ========== SKU相关接口 ==========

  /**
   * 获取SKU列表
   */
  getSKUList: async (params: {
    productSpuId?: number;
    productSpuCode?: string;
    skuCode?: string;
    status?: number;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<{ list: ProductSKU[]; total: number }>> => {
    try {
      const response = await baseClient.post<{ list: ProductSKU[]; total: number }>(
        '/api/admin/product/sku/list',
        {
          productSpuId: params.productSpuId,
          productSpuCode: params.productSpuCode,
          skuCode: params.skuCode,
          status: params.status,
          page: params.page || 1,
          pageSize: params.pageSize || 10,
        }
      );
      return response;
    } catch (error) {
      console.error('获取SKU列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取SKU详情
   */
  getSKUDetail: async (id: number): Promise<ApiResponse<ProductSKU>> => {
    try {
      const response = await baseClient.get<ProductSKU>(
        `/api/admin/product/sku/${id}`
      );
      return response;
    } catch (error) {
      console.error('获取SKU详情失败:', error);
      throw error;
    }
  },

  /**
   * 保存SKU（新增/编辑）
   */
  saveSKU: async (data: {
    id?: number;
    productSpuId: number;
    productSpuCode: string;
    skuCode?: string;
    price: number | string;
    stock: number;
    status: number;
    indexs: string;
    attrParams?: string;
    ownerParams?: string;
    images?: string;
    title?: string;
    subTitle?: string;
    description?: string;
  }): Promise<ApiResponse<ProductSKU>> => {
    try {
      const response = await baseClient.post<ProductSKU>(
        '/api/admin/product/sku',
        {
          ...data,
          price: typeof data.price === 'number' ? data.price.toString() : data.price,
        }
      );
      return response;
    } catch (error) {
      console.error('保存SKU失败:', error);
      throw error;
    }
  },

  /**
   * 批量保存SKU
   */
  batchSaveSKUs: async (
    productSpuId: number,
    productSpuCode: string,
    skus: Array<{
      id?: number;
      skuCode?: string;
      price: number;
      stock: number;
      status: number;
      indexs: string;
      attrParams?: string;
      ownerParams?: string;
      images?: string;
      title?: string;
      subTitle?: string;
      description?: string;
    }>
  ): Promise<ApiResponse<any>> => {
    try {
      // 批量保存通过循环调用单个保存接口
      const promises = skus.map(sku => 
        productApi.saveSKU({
          ...sku,
          productSpuId,
          productSpuCode,
        })
      );
      const results = await Promise.all(promises);
      
      // 检查是否有失败的
      const hasError = results.some(r => r.code !== 0);
      if (hasError) {
        return { code: -1, message: '部分SKU保存失败', data: results };
      }
      
      return { code: 0, message: '保存成功', data: results };
    } catch (error) {
      console.error('批量保存SKU失败:', error);
      throw error;
    }
  },

  /**
   * 删除SKU
   */
  deleteSKU: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await baseClient.delete<null>(
        `/api/admin/product/sku/${id}`
      );
      return response;
    } catch (error) {
      console.error('删除SKU失败:', error);
      throw error;
    }
  },

  /**
   * 批量删除SKU
   */
  batchDeleteSKUs: async (ids: number[]): Promise<ApiResponse<null>> => {
    try {
      const response = await baseClient.post<null>(
        '/api/admin/product/sku/batch-delete',
        { ids }
      );
      return response;
    } catch (error) {
      console.error('批量删除SKU失败:', error);
      throw error;
    }
  },

  // ========== 属性参数相关接口 ==========

  /**
   * 获取属性参数列表
   */
  getAttrParamList: async (params: {
    productSpuId?: number;
    productSpuCode?: string;
    attrType?: number;
    status?: number;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<{ list: any[]; total: number }>> => {
    try {
      const response = await baseClient.post<{ list: any[]; total: number }>(
        '/api/admin/product/attr-param/list',
        {
          productSpuId: params.productSpuId,
          productSpuCode: params.productSpuCode,
          attrType: params.attrType,
          status: params.status,
          page: params.page || 1,
          pageSize: params.pageSize || 10,
        }
      );
      return response;
    } catch (error) {
      console.error('获取属性参数列表失败:', error);
      throw error;
    }
  },

  /**
   * 保存属性参数（新增/编辑）
   */
  saveAttrParam: async (data: {
    id?: number;
    productSpuId: number;
    productSpuCode: string;
    code: string;
    name: string;
    attrType: number;
    valueType: number;
    value: string;
    sort?: number;
    status?: number;
    isRequired?: number;
    isGeneric?: number;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await baseClient.post<any>(
        '/api/admin/product/attr-param',
        data
      );
      return response;
    } catch (error) {
      console.error('保存属性参数失败:', error);
      throw error;
    }
  },

  /**
   * 删除属性参数
   */
  deleteAttrParam: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await baseClient.delete<null>(
        `/api/admin/product/attr-param/${id}`
      );
      return response;
    } catch (error) {
      console.error('删除属性参数失败:', error);
      throw error;
    }
  },

  /**
   * 批量删除属性参数
   */
  batchDeleteAttrParams: async (ids: number[]): Promise<ApiResponse<null>> => {
    try {
      const response = await baseClient.post<null>(
        '/api/admin/product/attr-param/batch-delete',
        { ids }
      );
      return response;
    } catch (error) {
      console.error('批量删除属性参数失败:', error);
      throw error;
    }
  },

  // ========== 商品详情相关接口 ==========

  /**
   * 保存商品详情（包含详情、包装清单、售后服务）
   */
  saveProductDetail: async (data: {
    productSpuId: number;
    productSpuCode: string;
    detail?: string;
    packingList?: string;
    afterSale?: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await baseClient.post<any>(
        '/api/admin/product/detail',
        data
      );
      return response;
    } catch (error) {
      console.error('保存商品详情失败:', error);
      throw error;
    }
  },

  /**
   * 保存商品属性参数
   * @param productSpuId 商品SPU ID
   * @param productSpuCode 商品SPU编码
   * @param attrType 属性类型：1-基本属性，2-销售属性，3-规格属性
   * @param value JSON格式的属性值（基础/销售属性是Record<string, string>，规格属性是Record<string, string[]>）
   */
  saveProductAttrParams: async (
    productSpuId: number,
    productSpuCode: string,
    attrType: number,
    value: Record<string, string> | Record<string, string[]>
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await baseClient.post<any>(
        '/api/admin/product/attr-param',
        {
          productSpuId,
          productSpuCode,
          code: attrType === 1 ? 'BASIC_ATTRS' : attrType === 2 ? 'SALE_ATTRS' : 'SPEC_ATTRS',
          name: attrType === 1 ? '基础属性' : attrType === 2 ? '销售属性' : '规格属性',
          attrType,
          valueType: 6, // JSON类型，根据后端定义：6-其它（JSON）
          value: JSON.stringify(value),
          sort: attrType,
          status: 1,
          isRequired: 1,
          isGeneric: attrType === 3 ? 0 : 1, // 规格属性不是通用属性
        }
      );
      return response;
    } catch (error) {
      console.error('保存商品属性失败:', error);
      throw error;
    }
  },

  /**
   * 获取商品属性参数
   * @param productSpuId 商品SPU ID
   */
  getProductAttrParams: async (productSpuId: number): Promise<ApiResponse<any[]>> => {
    try {
      // 使用新的属性参数列表接口
      const response = await productApi.getAttrParamList({
        productSpuId,
        page: 1,
        pageSize: 100, // 获取所有属性
      });
      
      if (response.code === 0 && response.data?.list) {
        return {
          code: 0,
          message: response.message || 'success',
          data: response.data.list,
        };
      }
      
      // 如果请求失败或没有数据，返回空数组
      return {
        code: response.code || -1,
        message: response.message || '获取商品属性失败',
        data: [],
      };
    } catch (error) {
      console.error('获取商品属性失败:', error);
      throw error;
    }
  },
};

export default productApi;
