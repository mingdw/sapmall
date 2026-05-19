import { NavigateFunction } from 'react-router-dom';
import { ProductDetailLocationState } from './types/productDetailTypes';

/** 商品详情页路由（实现位于 pages/marketplace/product） */
export const PRODUCT_DETAIL_ROUTE = '/marketplace/product/:productCode';

export function buildProductDetailPath(productCode: string): string {
  return `/marketplace/product/${encodeURIComponent(productCode)}`;
}

export function navigateToProductDetail(
  navigate: NavigateFunction,
  productCode: string,
  state?: ProductDetailLocationState
): void {
  navigate(buildProductDetailPath(productCode), { state });
}
