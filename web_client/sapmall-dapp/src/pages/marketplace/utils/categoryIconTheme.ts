import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Folder,
  LayoutGrid,
  Gem,
  Film,
  GraduationCap,
  Gamepad2,
  Crown,
  Laptop,
  FlaskConical,
  TestTube,
  Palette,
  UserRound,
  Dice6,
  Star,
  FileText,
  Image,
  Music,
  Video,
} from 'lucide-react';

export type CategoryIconTheme = {
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
};

export const ALL_PRODUCTS_CATEGORY_CODE = 'ALL';

const DEFAULT_THEME: CategoryIconTheme = {
  icon: Folder,
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
    icon: LayoutGrid,
    gradientFrom: '#6366f1',
    gradientTo: '#4f46e5',
  },
  '100000': {
    icon: Gem,
    gradientFrom: '#a855f7',
    gradientTo: '#7c3aed',
  },
  '200000': {
    icon: Film,
    gradientFrom: '#0ea5e9',
    gradientTo: '#0284c7',
  },
  '300000': {
    icon: GraduationCap,
    gradientFrom: '#10b981',
    gradientTo: '#059669',
  },
  '400000': {
    icon: Gamepad2,
    gradientFrom: '#f97316',
    gradientTo: '#ea580c',
  },
  '500000': {
    icon: Crown,
    gradientFrom: '#f59e0b',
    gradientTo: '#d97706',
  },
  '600000': {
    icon: Laptop,
    gradientFrom: '#3b82f6',
    gradientTo: '#2563eb',
  },
  CET_001: {
    icon: FlaskConical,
    gradientFrom: '#14b8a6',
    gradientTo: '#0d9488',
  },
  T_001: {
    icon: TestTube,
    gradientFrom: '#8b5cf6',
    gradientTo: '#6d28d9',
  },
  // NFT 二级（仅 icon，下拉菜单统一用黄色渐变）
  '110000': { icon: Palette, gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '120000': { icon: UserRound, gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '130000': { icon: Dice6, gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '140000': { icon: Star, gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  // 数字素材二级
  '210000': { icon: FileText, gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '220000': { icon: Image, gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '230000': { icon: Music, gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
  '240000': { icon: Video, gradientFrom: '#fbbf24', gradientTo: '#f59e0b' },
};

/** 后端可能返回 FA 字符串，映射为 Lucide 组件 */
const FA_TO_LUCIDE: Record<string, LucideIcon> = {
  'fa-folder': Folder,
  'fa-th-large': LayoutGrid,
  'fa-gem': Gem,
  'fa-photo-film': Film,
  'fa-graduation-cap': GraduationCap,
  'fa-gamepad': Gamepad2,
  'fa-crown': Crown,
  'fa-laptop-code': Laptop,
  'fa-flask': FlaskConical,
  'fa-vial': TestTube,
  'fa-palette': Palette,
  'fa-user-astronaut': UserRound,
  'fa-dice-d20': Dice6,
  'fa-star': Star,
  'fa-file-lines': FileText,
  'fa-image': Image,
  'fa-music': Music,
  'fa-video': Video,
};

function resolveApiIcon(apiIcon?: string): LucideIcon | undefined {
  if (!apiIcon) return undefined;
  const trimmed = apiIcon.trim();
  // 后端返回 "fas fa-xxx" 格式，提取 "fa-xxx" 部分
  const faKey = trimmed.replace(/^fas?\s+/, '');
  return FA_TO_LUCIDE[faKey];
}

export function resolveCategoryIconTheme(
  code?: string,
  apiIcon?: string,
  parentCode?: string,
  options?: { tier?: CategoryIconThemeTier },
): CategoryIconTheme {
  const own = code ? CATEGORY_ICON_BY_CODE[code] : undefined;
  const parent = parentCode ? CATEGORY_ICON_BY_CODE[parentCode] : undefined;
  const icon = resolveApiIcon(apiIcon) || own?.icon || parent?.icon || DEFAULT_THEME.icon;

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
