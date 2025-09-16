// 商品类型定义
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  badges: string[];
  categoryId: number;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

// 筛选条件类型
export interface FilterOptions {
  price: string[];
  rating: string[];
  sales: string[];
  time: string[];
  type: string[];
  seller: string[];
  feature: string[];
}

// 商品查询参数
export interface ProductQueryParams {
  categoryIds?: number[];
  filters?: FilterOptions;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 商品列表响应
export interface ProductListResp {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 商品徽章类型
export type ProductBadgeType = 
  | 'hot' 
  | 'new' 
  | 'featured' 
  | 'art' 
  | 'tool' 
  | 'legendary' 
  | 'epic' 
  | 'mythical' 
  | 'analysis'
  | '安全'
  | '投资'
  | '以太坊'
  | 'Solana'
  | '游戏'
  | '摄影'
  | 'VR'
  | 'AI'
  | '概念'
  | '生成器'
  | '史诗'
  | '精品'
  | '神话'
  | '传奇'
  | '热门'
  | '新品';

// 筛选选项常量
export const FILTER_OPTIONS = {
  PRICE: ['0-50 SAP', '50-200 SAP', '200-500 SAP', '500+ SAP'],
  RATING: ['4.5+', '4.0+', '3.5+'],
  SALES: ['100+ 销量', '500+ 销量', '1000+ 销量'],
  TIME: ['最近一周', '最近一月', '最近三月'],
  TYPE: ['数字商品', '服务类', '订阅制', '一次性购买'],
  SELLER: ['官方认证', '高信誉商家', '新商家'],
  FEATURE: ['限时折扣', '免费试用', '开源项目', '独家发布']
} as const;

// 商品排序选项
export const SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  RATING_ASC: 'rating_asc',
  RATING_DESC: 'rating_desc',
  CREATED_ASC: 'created_asc',
  CREATED_DESC: 'created_desc',
  SALES_ASC: 'sales_asc',
  SALES_DESC: 'sales_desc'
} as const;

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];
