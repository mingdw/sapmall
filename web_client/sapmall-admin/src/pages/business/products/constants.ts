// 商品管理常量定义

import type { TFunction } from 'i18next';

// 商品状态枚举（作为值使用）
export enum ProductStatus {
  DRAFT = 0,      // 草稿
  PENDING = 1,    // 待审核
  ACTIVE = 2,     // 上架中
  INACTIVE = 3,   // 已下架
}

/** 商品状态 i18n 键映射 */
const PRODUCT_STATUS_LABEL_KEYS: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: 'business.products.statusDraft',
  [ProductStatus.PENDING]: 'business.products.statusPending',
  [ProductStatus.ACTIVE]: 'business.products.statusActive',
  [ProductStatus.INACTIVE]: 'business.products.statusInactive',
};

// 商品状态配置（label 保留 i18n 键，展示请用 getProductStatusLabel / getProductStatusConfig(t)）
export const PRODUCT_STATUS_CONFIG = {
  [ProductStatus.DRAFT]: {
    color: 'default' as const,
    text: '草稿',
    label: 'business.products.statusDraft',
  },
  [ProductStatus.PENDING]: {
    color: 'warning' as const,
    text: '待审核',
    label: 'business.products.statusPending',
  },
  [ProductStatus.ACTIVE]: {
    color: 'success' as const,
    text: '上架中',
    label: 'business.products.statusActive',
  },
  [ProductStatus.INACTIVE]: {
    color: 'error' as const,
    text: '已下架',
    label: 'business.products.statusInactive',
  },
} as const;

// 统计周期类型
export type StatsPeriod = 'day' | 'week' | 'month';

// 视图模式类型
export type ViewMode = 'table' | 'grid';

// 分页默认值
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/** 链上状态选项定义（value 仍为中文，与后端一致） */
const CHAIN_STATUS_OPTION_DEFS = [
  { value: '', labelKey: 'common.all' },
  { value: '未上链', labelKey: 'business.products.chainNotOn' },
  { value: '同步中', labelKey: 'business.products.chainSyncing' },
  { value: '已上链', labelKey: 'business.products.chainOn' },
  { value: '同步失败', labelKey: 'business.products.chainFailed' },
] as const;

/** @deprecated 请使用 getChainStatusOptions(t) */
export const CHAIN_STATUS_OPTIONS = CHAIN_STATUS_OPTION_DEFS.map((opt) => ({
  value: opt.value,
  label: opt.labelKey,
}));

// 链上状态配置（key 仍为中文状态值；text 为中文 fallback，展示请用 getChainStatusLabel）
export const CHAIN_STATUS_CONFIG = {
  '未上链': {
    color: 'default' as const,
    text: '未上链',
    labelKey: 'business.products.chainNotOn',
  },
  '同步中': {
    color: 'processing' as const,
    text: '同步中',
    labelKey: 'business.products.chainSyncing',
  },
  '已上链': {
    color: 'success' as const,
    text: '已上链',
    labelKey: 'business.products.chainOn',
  },
  '同步失败': {
    color: 'error' as const,
    text: '同步失败',
    labelKey: 'business.products.chainFailed',
  },
} as const;

/** 时间范围选项定义 */
const TIME_RANGE_OPTION_DEFS = [
  { value: '', labelKey: 'common.all' },
  { value: 'today', labelKey: 'business.products.timeToday' },
  { value: 'yesterday', labelKey: 'business.products.timeYesterday' },
  { value: 'week', labelKey: 'business.products.timeWeek' },
  { value: 'month', labelKey: 'business.products.timeMonth' },
] as const;

/** @deprecated 请使用 getTimeRangeOptions(t) */
export const TIME_RANGE_OPTIONS = TIME_RANGE_OPTION_DEFS.map((opt) => ({
  value: opt.value,
  label: opt.labelKey,
}));

/** 商品状态下拉选项定义（ACTIVE 筛选项文案为「销售中」） */
const PRODUCT_STATUS_OPTION_DEFS = [
  { value: '' as const, labelKey: 'common.all' },
  { value: ProductStatus.DRAFT, labelKey: 'business.products.statusDraft' },
  { value: ProductStatus.PENDING, labelKey: 'business.products.statusPending' },
  { value: ProductStatus.ACTIVE, labelKey: 'business.products.statusSelling' },
  { value: ProductStatus.INACTIVE, labelKey: 'business.products.statusInactive' },
] as const;

/** @deprecated 请使用 getProductStatusOptions(t) */
export const PRODUCT_STATUS_OPTIONS = PRODUCT_STATUS_OPTION_DEFS.map((opt) => ({
  value: opt.value,
  label: opt.labelKey,
}));

export function getProductStatusOptions(t: TFunction) {
  return PRODUCT_STATUS_OPTION_DEFS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }));
}

export function getChainStatusOptions(t: TFunction) {
  return CHAIN_STATUS_OPTION_DEFS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }));
}

export function getTimeRangeOptions(t: TFunction) {
  return TIME_RANGE_OPTION_DEFS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }));
}

export function getProductStatusLabel(t: TFunction, status: ProductStatus): string {
  const labelKey = PRODUCT_STATUS_LABEL_KEYS[status];
  return labelKey ? t(labelKey) : String(status);
}

export function getChainStatusLabel(t: TFunction, chainStatus: keyof typeof CHAIN_STATUS_CONFIG): string {
  const config = CHAIN_STATUS_CONFIG[chainStatus];
  return config ? t(config.labelKey) : chainStatus;
}
