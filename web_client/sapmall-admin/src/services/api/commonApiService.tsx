import baseClient from './baseClient';

// 定义类型
export interface CategoryTreeResp {
  id: number;
  name: string;
  code: string;
  level: number;
  sort: number;
  parentId: number;
  icon: string;
  attrGroups?: AttrGroupResp[];
  children?: CategoryTreeResp[];
}

export interface AttrGroupResp {
  id: number;
  name: string;
  code: string;
  sort: number;
  type: number;
  description: string;
  status: number;
  attrs?: AttrResp[];
}

export interface AttrResp {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  description: string;
  groupId?: number;
}

export const commonApiService = {
  // 获取目录树结构
  getCategoryTree: async (categoryType: number): Promise<CategoryTreeResp[]> => {
    const response = await baseClient.get<CategoryTreeResp[]>(
      `/api/common/${categoryType}/categories`,
      {
        skipAuth: true, // 获取目录树结构不需要认证
      }
    );
    
    // baseClient返回的是ApiResponse<T>，我们需要返回data字段
    return response.data;
  },
};

export default commonApiService;

