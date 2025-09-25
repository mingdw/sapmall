export interface CategoryTreeResp {
  id: number;
  name: string;
  title: string; // 添加title字段匹配后端数据
  url: string; // 使用url字段替代code字段
  level: number;
  sort: number;
  parent_id: number; // 使用parent_id匹配后端数据
  icon: string;
  status: number;
  is_external?: boolean; // 是否为外部链接
  external_url?: string; // 外部链接地址
  path?: string; // 路由路径
  component?: string; // 组件名称
  children?: CategoryTreeResp[]; // 层级菜单
}   

export interface AttrGroupResp {
  id: number;
  name: string;
  code: string;
  sort: number;
  type: number;
  description: string;
  status: number;
  attrs: AttrResp[];
}

export interface AttrResp {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  description: string;
}

// API请求类型
export interface GetCategoryListRequest {
  page?: number;
  page_size?: number;
  keyword?: string;
  level?: number;
  parent_id?: number;
  status?: number;
}

export interface CreateCategoryRequest {
  name: string;
  code: string;
  level: number;
  sort: number;
  parent_id: number;
  parent_code: string;
  icon?: string;
  status?: number;
  creator: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name?: string;
  code?: string;
  sort?: number;
  icon?: string;
  status?: number;
  updator: string;
}

export interface DeleteCategoryRequest {
  id: number;
  updator: string;
}

// API响应类型
export interface GetCategoryListResponse {
  code: number;
  message: string;
  data: {
    list: CategoryTreeResp[];
    total: number;
    page: number;
    page_size: number;
  };
}

export interface GetCategoryTreeResponse {
  code: number;
  message: string;
  data: CategoryTreeResp[];
}

export interface CreateCategoryResponse {
  code: number;
  message: string;
  data: CategoryTreeResp;
}

export interface UpdateCategoryResponse {
  code: number;
  message: string;
  data: CategoryTreeResp;
}

export interface DeleteCategoryResponse {
  code: number;
  message: string;
  data: null;
}

// 分类统计信息
export interface CategoryStats {
  total_categories: number;
  level1_categories: number;
  level2_categories: number;
  level3_categories: number;
  active_categories: number;
}

export interface GetCategoryStatsResponse {
  code: number;
  message: string;
  data: CategoryStats;
}
