import baseClient from './baseClient';
import { ApiResponse } from '../types/baseTypes';

// 保存目录请求（新增/编辑共用）
export interface SaveCategoryReq {
  id?: number;          // 目录ID，为0或空表示新增，有值表示编辑
  name: string;         // 目录名称
  code: string;         // 目录编码
  parentId?: number;    // 父目录ID
  parentCode?: string;  // 父目录编码
  level?: number;       // 层级
  sort: number;         // 排序
  icon?: string;        // 图标
  menuType: number;     // 目录类型：0=商品目录 1=菜单目录
}

// 目录响应数据
export interface CategoryResp {
  id: number;
  name: string;
  code: string;
  parentId: number;
  parentCode: string;
  level: number;
  sort: number;
  icon: string;
  status: number;
}

export const categoryApi = {
  /**
   * 保存目录（新增/编辑）
   * 通过id字段自动判断：id为0或空表示新增，有值表示编辑
   */
  saveCategory: async (data: SaveCategoryReq): Promise<ApiResponse<CategoryResp>> => {
    try {
      console.log('保存目录请求数据:', data);
      const response = await baseClient.post<CategoryResp>(
        '/api/admin/category',
        data
      );
      console.log('保存目录响应:', response);
      return response;
    } catch (error) {
      console.error('保存目录失败:', error);
      throw error;
    }
  },

  /**
   * 删除目录
   * @param id 目录ID
   */
  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    try {
      console.log('删除目录ID:', id);
      const response = await baseClient.delete<null>(
        `/api/admin/category/${id}`
      );
      console.log('删除目录响应:', response);
      return response;
    } catch (error) {
      console.error('删除目录失败:', error);
      throw error;
    }
  },
};

export default categoryApi;

