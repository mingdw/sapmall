import baseClient from "./baseClient";
import { Product, ProductQueryParams, ProductListResp, FilterOptions } from "../types/productTypes";

// 后端API响应格式
interface BackendProductListResp {
  code: number;
  message: string; // 后端实际返回的是message字段
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
    if (response.code !== 0) {
      throw new Error(response.message || '获取商品列表失败');
    }
    
    // 检查data是否存在
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('后端返回的data字段为空或不是数组:', backendData);
      return {
        code: response.code,
        msg: response.message,
        products: [],
        total: 0
      };
    }
    
    // 处理分类数据
    const allProducts: Product[] = [];
    let totalCount = 0;
    
    response.data.forEach(categoryData => {
      if (categoryData.products && Array.isArray(categoryData.products)) {
        // 为每个商品添加分类信息
        const productsWithCategory = categoryData.products.map((product: any) => ({
          ...product,
          categoryId: categoryData.categoryId,
          categoryCode: categoryData.categoryCode,
          categoryName: categoryData.categoryName,
          categoryProductCount: categoryData.productCount // 添加分类商品总数
        }));
        
        allProducts.push(...productsWithCategory);
        
        // 如果是"全部商品"分类（categoryId为0或categoryCode为空），直接使用其productCount
        if (categoryData.categoryId === 0 || categoryData.categoryCode === '') {
          totalCount = categoryData.productCount || 0;
        } else {
          // 否则累加所有分类的productCount
          totalCount += categoryData.productCount || 0;
        }
      }
    });
    
    console.log('API响应数据处理:', {
      categoriesCount: response.data.length,
      allProductsCount: allProducts.length,
      totalCount,
      hasSearchQuery: !!requestBody.productName,
      categories: response.data.map(cat => ({
        categoryId: cat.categoryId,
        categoryCode: cat.categoryCode,
        categoryName: cat.categoryName,
        productCount: cat.productCount,
        productsLength: cat.products?.length || 0
      }))
    });
    
    return {
      code: response.code,
      msg: response.message,
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
