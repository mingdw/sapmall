import { NavigateFunction } from 'react-router-dom';

export const MARKETPLACE_ROUTE = '/marketplace';

/** 商城页 location.state：用于面包屑等场景预选分类 */
export interface MarketplaceLocationState {
  /** null 或 0 表示默认「全部商品」视图 */
  selectedCategoryId?: number | null;
}

export function navigateToMarketplace(
  navigate: NavigateFunction,
  state: MarketplaceLocationState = { selectedCategoryId: null }
): void {
  navigate(MARKETPLACE_ROUTE, { state });
}
