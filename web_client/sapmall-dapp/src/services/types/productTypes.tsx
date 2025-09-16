// 商品类型定义 - 与后端API保持一致
export interface Product {
  // 后端返回的基础字段
  id: number;
  code: string;
  name: string;
  category1Id: number;
  category1Code: string;
  category2Id: number;
  category2Code: string;
  category3Id: number;
  category3Code: string;
  brand: string;
  price: number;
  realPrice: number;
  totalSales: number;
  totalStock: number;
  status: number;
  images: string[];
  description: string;
  attributes: any;
  skuList: any;
  
  // 前端显示用的字段
  title?: string;
  image?: string;
  badges?: string[];
  categoryId?: number;
  categoryName?: string;
  category?: string;
  rating?: number;
  creator_id?: string;
  title_en?: string;
  title_zh?: string;
  description_en?: string;
  description_zh?: string;
  ipfs_hash?: string;
  inventory?: number;
  sales_count?: number;
  created_at?: number;
  updated_at?: number;
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

// 商品查询参数 - 与后端API保持一致
export interface ProductQueryParams {
  categoryCodes?: string; // 分类编码，多个用逗号分隔
  productName?: string;   // 商品名称
  page?: number;          // 页码
  pageSize?: number;      // 每页数量
  // 前端扩展字段
  filters?: FilterOptions;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 商品列表响应 - 与后端API保持一致
export interface ProductListResp {
  code: number;
  msg: string;
  products: Product[];
  total: number;
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
