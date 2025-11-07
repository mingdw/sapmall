import baseClient from './baseClient';
import { ApiResponse } from '../types/baseTypes';
import { commonApiService } from './commonApiService';

// 保存属性组请求（新增/编辑共用）
export interface SaveAttributeGroupReq {
  id?: number;          // 属性组ID，为空表示新增，有值表示编辑
  name: string;         // 属性组名称
  code: string;         // 属性组编码
  categoryId?: number;  // 目录ID
  type?: number;        // 类型：0=通用 1=目录专用
  sort: number;         // 排序
  status?: number;      // 状态：0=禁用 1=启用
  description?: string; // 描述
}

// 属性组响应数据
export interface AttributeGroupResp {
  id: number;
  name: string;
  code: string;
  type: number;
  status: number;
  sort: number;
  description: string;
}

// 属性响应数据
export interface AttributeResp {
  id: number;
  name: string;
  code: string;
  type: number;
  status: number;
  groupId: number;
  description: string;
  sort: number;
}

// 属性组完整数据（包含属性列表）
export interface AttributeGroupWithAttrs {
  id: number;
  name: string;
  code: string;
  sort: number;
  type: number;
  description: string;
  status: number;
  attrs: AttributeResp[];
}

export const attributeGroupApi = {
  /**
   * 保存属性组（新增/编辑）
   * 通过id字段自动判断：id为空表示新增，有值表示编辑
   */
  saveAttributeGroup: async (data: SaveAttributeGroupReq): Promise<ApiResponse<AttributeGroupResp>> => {
    try {
      console.log('保存属性组请求数据:', data);
      
      // 将前端字段名映射到后端字段名
      const requestData: any = {
        categoryId: data.categoryId,
        attrGroupName: data.name,
        attrGroupCode: data.code,
        sort: data.sort,
        type: data.type ?? 0,
        // 注意：0=启用，1=禁用
        // 确保 status 正确传递：如果 data.status 是 undefined，使用默认值 0（启用）；否则使用实际值（0 或 1）
        status: data.status !== undefined ? data.status : 0,
        description: data.description || '',
      };
      
      // 如果是编辑，添加ID
      if (data.id) {
        requestData.id = data.id;
      }
      
      const response = await baseClient.post<AttributeGroupResp>(
        '/api/admin/attrGroup',
        requestData
      );
      console.log('保存属性组响应:', response);
      return response;
    } catch (error) {
      console.error('保存属性组失败:', error);
      throw error;
    }
  },

  /**
   * 删除属性组
   * @param id 属性组ID
   */
  deleteAttributeGroup: async (id: number): Promise<ApiResponse<null>> => {
    try {
      console.log('删除属性组ID:', id);
      const response = await baseClient.delete<null>(
        `/api/admin/attrGroup/${id}`
      );
      console.log('删除属性组响应:', response);
      return response;
    } catch (error) {
      console.error('删除属性组失败:', error);
      throw error;
    }
  },

  /**
   * 根据目录ID获取属性组列表（包含属性列表）
   * @param categoryId 目录ID
   * @returns 属性组列表
   */
  getAttributeGroupsByCategoryId: async (categoryId: number): Promise<AttributeGroupWithAttrs[]> => {
    try {
      console.log('根据目录ID获取属性组列表:', categoryId);
      
      // 调用目录树接口获取最新数据
      const categoryTree = await commonApiService.getCategoryTree(0);
      
      // 递归查找指定目录
      const findCategoryById = (categories: any[], id: number): any => {
        for (const category of categories) {
          if (category.id === id) {
            return category;
          }
          if (category.children && category.children.length > 0) {
            const found = findCategoryById(category.children, id);
            if (found) return found;
          }
        }
        return null;
      };
      
      const category = findCategoryById(categoryTree, categoryId);
      
      if (!category) {
        console.warn('未找到目录:', categoryId);
        return [];
      }
      
      // 转换属性组数据格式
      const attrGroups: AttributeGroupWithAttrs[] = (category.attrGroups || []).map((ag: any) => ({
        id: ag.id,
        name: ag.name,
        code: ag.code,
        sort: ag.sort,
        type: ag.type,
        description: ag.description || '',
        status: ag.status,
        attrs: (ag.attrs || []).map((attr: any) => ({
          id: attr.id,
          name: attr.name,
          code: attr.code,
          type: attr.type,
          status: attr.status,
          groupId: ag.id,
          description: attr.description || '',
          sort: attr.sort,
        })),
      }));
      
      console.log('获取到的属性组列表:', attrGroups);
      return attrGroups;
    } catch (error) {
      console.error('获取属性组列表失败:', error);
      throw error;
    }
  },
};

export default attributeGroupApi;

