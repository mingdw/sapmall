import baseClient from "./baseClient";
import { Product, ProductQueryParams, ProductListResp, FilterOptions } from "../types/productTypes";

// 后端API响应格式
interface BackendProductListResp {
  code: number;
  msg: string;
  data: Array<{
    categoryId: number;
    categoryCode: string;
    categoryName: string;
    productCount: number;
    products: Product[];
  }>;
}

export const productApiService = {
  // 获取商品列表
  getProducts: async (params: ProductQueryParams = {}): Promise<ProductListResp> => {
    // 构建请求体，与后端API保持一致
    const requestBody = {
      categoryCodes: params.categoryCodes || '',
      productName: params.productName || params.search || '',
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };

    const response = await baseClient.post<BackendProductListResp>('/api/product/products', requestBody, {
      skipAuth: true, // 商品列表不需要认证
    });
    
    // 转换后端响应格式为前端期望的格式
    const backendData = response.data;
    if (backendData.code !== 0) {
      throw new Error(backendData.msg || '获取商品列表失败');
    }
    
    // 合并所有分类的商品
    const allProducts: Product[] = [];
    let totalCount = 0;
    
    backendData.data.forEach(categoryData => {
      allProducts.push(...categoryData.products);
      totalCount += categoryData.productCount;
    });
    
    return {
      code: backendData.code,
      msg: backendData.msg,
      products: allProducts,
      total: totalCount
    };
  },

  // 获取商品详情
  getProductById: async (id: string): Promise<Product> => {
    const requestBody = {
      product_id: parseInt(id),
      product_code: id,
    };
    
    const response = await baseClient.post<{code: number, msg: string, product_info: Product}>('/api/product/getProductDetails', requestBody, {
      skipAuth: true, // 商品详情不需要认证
    });
    return response.data.product_info;
  },

  // 获取商品分类
  getProductCategories: async (): Promise<any[]> => {
    const response = await baseClient.get<any[]>('/api/product/categories', {
      skipAuth: true, // 商品分类不需要认证
    });
    return response.data;
  },

};
