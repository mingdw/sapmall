// 商品管理常量定义

// 商品状态枚举（作为值使用）
export enum ProductStatus {
  DRAFT = 0,      // 草稿
  PENDING = 1,    // 待审核
  ACTIVE = 2,     // 上架中
  INACTIVE = 3,   // 已下架
}

// 商品状态配置
export const PRODUCT_STATUS_CONFIG = {
  [ProductStatus.DRAFT]: { 
    color: 'default' as const, 
    text: '草稿',
    label: '草稿',
  },
  [ProductStatus.PENDING]: { 
    color: 'warning' as const, 
    text: '待审核',
    label: '待审核',
  },
  [ProductStatus.ACTIVE]: { 
    color: 'success' as const, 
    text: '上架中',
    label: '上架中',
  },
  [ProductStatus.INACTIVE]: { 
    color: 'error' as const, 
    text: '已下架',
    label: '已下架',
  },
} as const;

// 统计周期类型
export type StatsPeriod = 'day' | 'week' | 'month';

// 视图模式类型
export type ViewMode = 'table' | 'grid';

// 分页默认值
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// 链上状态选项
export const CHAIN_STATUS_OPTIONS = [
  { value: '', label: '全部' },
  { value: '未上链', label: '未上链' },
  { value: '同步中', label: '同步中' },
  { value: '已上链', label: '已上链' },
  { value: '同步失败', label: '同步失败' },
] as const;

// 链上状态配置
export const CHAIN_STATUS_CONFIG = {
  '未上链': { 
    color: 'default' as const, 
    text: '未上链',
  },
  '同步中': { 
    color: 'processing' as const, 
    text: '同步中',
  },
  '已上链': { 
    color: 'success' as const, 
    text: '已上链',
  },
  '同步失败': { 
    color: 'error' as const, 
    text: '同步失败',
  },
} as const;

// 时间范围选项
export const TIME_RANGE_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'week', label: '最近一周' },
  { value: 'month', label: '最近一月' },
] as const;

// 商品状态选项（用于下拉框）
export const PRODUCT_STATUS_OPTIONS = [
  { value: '', label: '全部' },
  { value: ProductStatus.DRAFT, label: '草稿' },
  { value: ProductStatus.PENDING, label: '待审核' },
  { value: ProductStatus.ACTIVE, label: '销售中' },
  { value: ProductStatus.INACTIVE, label: '已下架' },
] as const;
