import type { CSSProperties } from 'react';

export type CategoryIconTheme = {
  icon: string;
  gradientFrom: string;
  gradientTo: string;
};

export const ALL_PRODUCTS_CATEGORY_CODE = 'ALL';

const DEFAULT_THEME: CategoryIconTheme = {
  icon: 'fas fa-folder',
  gradientFrom: '#64748b',
  gradientTo: '#475569',
};

/** 下拉二级/子目录徽章默认配色（黄色系，不继承一级目录渐变色） */
export const SUBMENU_DEFAULT_THEME: Pick<CategoryIconTheme, 'gradientFrom' | 'gradientTo'> = {
  gradientFrom: '#fbbf24',
  gradientTo: '#f59e0b',
};

export type CategoryIconThemeTier = 'primary' | 'submenu';

/** 前端兜底：code → icon + 渐变色（后端 icon 为空时使用） */
const CATEGORY_ICON_BY_CODE: Record<string, CategoryIconTheme> = {
  [ALL_PRODUCTS_CATEGORY_CODE]: {
    icon: 'fas fa-th-large',
    gradientFrom: '#6366f1',
    gradientTo: '#4f46e5',
  },
  '100000': {
    icon: 'fas fa-gem',
    gradientFrom: '#a855f7',
    gradientTo: '#7c3aed',
  },
  '200000': {
    icon: 'fas fa-photo-film',
    gradientFrom: '#0ea5e9',
    gradientTo: '#0284c7',
  },
  '300000': {
    icon: 'fas fa-graduation-cap',
    gradientFrom: '#10b981',
    gradientTo: '#059669',
  },
  '400000': {
    icon: 'fas fa-gamepad',
    gradientFrom: '#f97316',
    gradientTo: '#ea580c',
  },
  '500000': {
    icon: 'fas fa-crown',
    gradientFrom: '#f59e0b',
    gradientTo: '#d97706',
  },
  '600000': {
    icon: 'fas fa-laptop-code',
    gradientFrom: '#3b82f6',
    gradientTo: '#2563eb',
  },
  CET_001: {
    icon: 'fas fa-flask',
    gradientFrom: '#14b8a6',
    gradientTo: '#0d9488',
  },
  T_001: {
    icon: 'fas fa-vial',
    gradientFrom: '#8b5cf6',
    gradientTo: '#6d28d9',
  },
  // NFT 二级（仅 icon，下拉菜单统一用黄色渐变）
  '110000': { icon: 'fas fa-palette', gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '120000': { icon: 'fas fa-user-astronaut', gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '130000': { icon: 'fas fa-dice-d20', gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '140000': { icon: 'fas fa-star', gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  // 数字素材二级
  '210000': { icon: 'fas fa-file-lines', gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '220000': { icon: 'fas fa-image', gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '230000': { icon: 'fas fa-music', gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '240000': { icon: 'fas fa-video', gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
};

export function resolveCategoryIconTheme(
  code?: string,
  apiIcon?: string,
  parentCode?: string,
  options?: { tier?: CategoryIconThemeTier },
): CategoryIconTheme {
  const own = code ? CATEGORY_ICON_BY_CODE[code] : undefined;
  const parent = parentCode ? CATEGORY_ICON_BY_CODE[parentCode] : undefined;
  const trimmedIcon = apiIcon?.trim();
  const icon = trimmedIcon || own?.icon || parent?.icon || DEFAULT_THEME.icon;

  if (options?.tier === 'submenu') {
    return {
      icon,
      ...SUBMENU_DEFAULT_THEME,
    };
  }

  const base = own ?? parent ?? DEFAULT_THEME;
  return {
    ...base,
    icon,
  };
}

export function categoryPlainIconColor(
  theme: CategoryIconTheme,
  options?: { tier?: CategoryIconThemeTier; active?: boolean },
): string | undefined {
  if (options?.active) return undefined;
  if (options?.tier === 'submenu') return SUBMENU_DEFAULT_THEME.gradientFrom;
  return theme.gradientFrom;
}

export function categoryPlainIconStyle(
  theme: CategoryIconTheme,
  options?: { tier?: CategoryIconThemeTier; active?: boolean },
): CSSProperties | undefined {
  const color = categoryPlainIconColor(theme, options);
  return color ? { color } : undefined;
}

/** @deprecated 徽章渐变背景，已改为纯 icon 样式 */
export function categoryIconBadgeStyle(theme: CategoryIconTheme): CSSProperties {
  return {
    background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
  };
}
