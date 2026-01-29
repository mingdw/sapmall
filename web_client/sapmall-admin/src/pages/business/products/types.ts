// 商品管理相关类型定义

// 商品状态类型（使用常量文件中的枚举）
export type ProductStatus = 0 | 1 | 2 | 3;

// 商品SPU（与后端 ProductSPUInfo 对齐）
export interface ProductSPU {
  id: number;
  code: string;
  name: string;
  category1Id: number;
  category1Code: string;
  category2Id?: number;
  category2Code?: string;
  category3Id?: number;
  category3Code?: string;
  userId?: number;
  userCode?: string;
  totalSales: number;
  totalStock: number;
  brand?: string;
  description?: string;
  price: string; // 后端返回 string
  realPrice?: string; // 后端返回 string
  status: ProductStatus;
  chainStatus?: ChainStatus; // 链上状态
  chainId?: number; // 链ID
  chainTxHash?: string; // 链上交易哈希
  images?: string; // JSON字符串或逗号分隔的图片URL
  createdAt?: string;
  updatedAt?: string;
  creator?: string;
  updator?: string;
}

// 商品SKU（与后端 ProductSKUInfo 对齐）
export interface ProductSKU {
  id: number;
  productSpuId: number;
  productSpuCode: string;
  skuCode: string;
  price: string; // 后端返回 string
  stock: number;
  saleCount: number;
  status: number;
  indexs: string; // 规格索引
  attrParams?: string; // 属性参数JSON
  ownerParams?: string; // 所有者参数JSON
  images?: string; // 图片JSON字符串
  title?: string;
  subTitle?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  creator?: string;
  updator?: string;
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

// SPU属性参数信息（与后端 ProductAttrParamInfo 对齐）
export interface ProductAttrParamInfo {
  id: number;
  productSpuId: number;
  productSpuCode: string;
  code: string;
  name: string;
  attrType: number; // 1-基本属性，2-销售属性，3-规格属性
  valueType: number; // 1-文本...6-其它（JSON）
  value: string;
  sort: number;
  status: number;
  isRequired: number;
  isGeneric: number;
  createdAt?: string;
  updatedAt?: string;
  creator?: string;
  updator?: string;
}

// 商品属性信息（包含基础属性、销售属性和规格属性）
export interface ProductAttrsInfo {
  base_attrs?: ProductAttrParamInfo[];
  sale_attrs?: ProductAttrParamInfo[];
  spec_attrs?: ProductAttrParamInfo[]; // 规格属性
}

// SPU详情信息（与后端 ProductDetailInfo 对齐）
export interface ProductDetailInfo {
  productSpuId: number;
  productSpuCode: string;
  detail?: string;
  packingList?: string;
  afterSale?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 商品详情响应（聚合所有信息）
export interface ProductDetailResp {
  spu: ProductSPU;
  attrs: ProductAttrsInfo;
  skus?: ProductSKU[];
  details?: ProductDetailInfo;
}

// 保存商品请求（新增/编辑，全量提交商品信息）
export interface SaveProductReq {
  spu: ProductSPU;
  attrs?: ProductAttrsInfo;
  skus?: ProductSKU[];
  details?: ProductDetailInfo;
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
