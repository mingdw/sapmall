import baseClient from "./baseClient";
import { Product, ProductQueryParams, ProductListResp, FilterOptions } from "../types/productTypes";

export const productApiService = {
  // 获取商品列表
  getProducts: async (params: ProductQueryParams = {}): Promise<ProductListResp> => {
    // 构建查询参数
    const queryParams: Record<string, any> = {
      categoryIds: params.categoryIds?.length ? params.categoryIds.join(',') : undefined,
      search: params.search,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    };

    // 添加筛选条件
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value && value.length > 0) {
          queryParams[key] = value.join(',');
        }
      });
    }

    // 构建URL查询字符串
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `/api/product/list?${queryString}` : '/api/product/list';

    const response = await baseClient.get<ProductListResp>(url, {
      skipAuth: true, // 商品列表不需要认证
    });
    return response.data;
  },

  // 获取商品详情
  getProductById: async (id: number): Promise<Product> => {
    const response = await baseClient.get<Product>(`/api/product/${id}`, {
      skipAuth: true, // 商品详情不需要认证
    });
    return response.data;
  },

  // 获取商品分类
  getProductCategories: async (): Promise<any[]> => {
    const response = await baseClient.get<any[]>('/api/product/categories', {
      skipAuth: true, // 商品分类不需要认证
    });
    return response.data;
  },

  // 搜索商品
  searchProducts: async (query: string, filters?: FilterOptions): Promise<ProductListResp> => {
    // 构建查询参数
    const queryParams: Record<string, any> = {
      q: query,
    };

    // 添加筛选条件
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.length > 0) {
          queryParams[key] = value.join(',');
        }
      });
    }

    // 构建URL查询字符串
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `/api/product/search?${queryString}` : '/api/product/search';

    const response = await baseClient.get<ProductListResp>(url, {
      skipAuth: true, // 搜索不需要认证
    });
    return response.data;
  }
};
