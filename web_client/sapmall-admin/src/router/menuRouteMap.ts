/**
 * 菜单 component/url 与前端路由的映射。
 * 与 sys_category.path / component 对齐；仅保留必要的别名转发。
 */
const MENU_ROUTE_ALIASES: Record<string, string> = {
  '/personal/orders': '/trading/orders',
  'personal/orders': '/trading/orders',
};

/** 将菜单配置的 component 解析为 AdminRouter 可识别的路径 */
export function resolveMenuRoute(component?: string): string {
  if (!component) return '';
  const trimmed = component.trim();
  if (!trimmed) return '';

  if (MENU_ROUTE_ALIASES[trimmed]) {
    return MENU_ROUTE_ALIASES[trimmed];
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (MENU_ROUTE_ALIASES[withLeadingSlash]) {
    return MENU_ROUTE_ALIASES[withLeadingSlash];
  }

  return withLeadingSlash;
}

/** iframe ?menu= 参数别名（与 AdminLayout 深链匹配一致） */
export const MENU_IFRAME_ALIASES: Record<string, string[]> = {
  profile:       ['profile', 'personal/profile'],
  security:      ['security', 'personal/security'],
  notifications: ['notifications', 'personal/notifications'],
  dashboard:     ['dashboard', 'platform/dashboard'],
  orders:        ['orders', 'trading/orders', 'personal/orders'],
  cart:          ['cart', 'business/products'],
  settings:      ['settings', 'system/settings'],
  history:       ['history', 'trading/orders'],
  favorites:     ['favorites', 'business/products'],
  users:         ['users', 'platform/users'],
  merchants:     ['merchants', 'platform/merchants'],
  categories:    ['categories', 'platform/categories'],
  dictionaries:  ['dictionaries', 'system/dictionaries'],
  chainnet:      ['chainnet', 'system/chainnet'],
};
