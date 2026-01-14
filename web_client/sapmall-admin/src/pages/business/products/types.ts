// 商品管理相关类型定义

// 商品状态类型（使用常量文件中的枚举）
export type ProductStatus = 0 | 1 | 2 | 3;

// 商品SPU
export interface ProductSPU {
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
  description: string;
  price: number;
  realPrice: number;
  status: ProductStatus;
  chainStatus?: ChainStatus;  // 链上状态
  chainId?: number;  // 链ID
  chainTxHash?: string;  // 链上交易哈希
  images: string;  // JSON字符串或逗号分隔的图片URL
  totalSales: number;
  totalStock: number;
  createdAt: string;
  updatedAt: string;
  creator: string;
  updator: string;
}

// 商品SKU
export interface ProductSKU {
  id: number;
  productSpuId: number;
  productSpuCode: string;
  skuCode: string;
  price: number;
  stock: number;
  saleCount: number;
  status: number;
  indexs: string;  // 规格索引
  attrParams: string;  // 属性参数JSON
  ownerParams: string;  // 所有者参数JSON
  images: string;  // 图片JSON字符串
  title: string;
  subTitle: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// 链上状态类型
export type ChainStatus = '未上链' | '同步中' | '已上链' | '同步失败' | '';

// 时间范围类型
export type TimeRange = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | '';

// 商品列表查询参数
export interface ProductListParams {
  categoryCodes?: string;
  productName?: string;
  productCode?: string;
  status?: ProductStatus | '';
  chainStatus?: ChainStatus;
  timeRange?: TimeRange;
  page?: number;
  pageSize?: number;
}

// 商品列表响应
export interface ProductListResponse {
  list: ProductSPU[];
  total: number;
}

// 保存商品请求（新增/编辑）
export interface SaveProductReq {
  id?: number;  // 有值表示编辑，无值或0表示新增
  code?: string;
  name: string;
  category1Id: number;
  category1Code: string;
  category2Id?: number;
  category2Code?: string;
  category3Id?: number;
  category3Code?: string;
  brand?: string;
  description?: string;
  price?: number;
  realPrice?: number;
  status: ProductStatus;
  images?: string;
}

// 商品统计信息
export interface ProductStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: string;  // SAP代币数量
  newUsers: number;
  totalProductsTrend?: string;
  totalOrdersTrend?: string;
  totalRevenueTrend?: string;
  newUsersTrend?: string;
}
