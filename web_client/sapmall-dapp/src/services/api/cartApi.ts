import baseClient from './baseClient';

export interface AddToCartPayload {
  productId: number;
  productCode: string;
  skuId?: number;
  skuCode?: string;
  quantity: number;
  price: number;
  specSnapshot?: Record<string, string>;
}

export interface AddToCartResult {
  success: boolean;
  message?: string;
}

/**
 * 加入购物车（预留接口，后端未实现时走 mock）
 * TODO: 对接真实 POST /api/cart/add 等接口后替换实现
 */
export const cartApi = {
  addToCart: async (payload: AddToCartPayload): Promise<AddToCartResult> => {
    const useMock = process.env.REACT_APP_CART_API_MOCK !== 'false';
    if (useMock) {
      await new Promise((r) => setTimeout(r, 300));
      console.info('[cartApi] mock addToCart', payload);
      return { success: true, message: 'mock added' };
    }

    const response = await baseClient.post<AddToCartResult>('/api/cart/add', payload);
    return response.data ?? { success: response.code === 0 };
  },
};
