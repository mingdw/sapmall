import baseClient from './baseClient';
import { ApiResponse } from '../types/baseTypes';

// 保存属性请求（新增/编辑共用）
export interface SaveAttributeReq {
  id?: number;          // 属性ID，为空表示新增，有值表示编辑
  name: string;         // 属性名称
  code: string;         // 属性编码
  groupId: number;      // 属性组ID
  groupCode: string;    // 属性组编码
  type?: number;        // 属性类型：1=文本 2=数字
  sort: number;         // 排序
  status?: number;      // 状态：0=启用 1=禁用
  description?: string; // 描述
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

export const attributeApi = {
  /**
   * 保存属性（新增/编辑）
   * 通过id字段自动判断：id为空表示新增，有值表示编辑
   */
  saveAttribute: async (data: SaveAttributeReq): Promise<ApiResponse<AttributeResp>> => {
    try {
      console.log('保存属性请求数据:', data);
      
      // 将前端字段名映射到后端字段名
      const requestData: any = {
        attrGroupId: data.groupId,
        attrGroupCode: data.groupCode,
        attrName: data.name,
        attrCode: data.code,
        sort: data.sort,
        attrType: data.type ?? 1, // 默认文本类型
        // 注意：0=启用，1=禁用
        status: data.status !== undefined ? data.status : 0,
        description: data.description || '',
      };
      
      // 如果是编辑，添加ID
      if (data.id) {
        requestData.id = data.id;
      }
      
      const response = await baseClient.post<AttributeResp>(
        '/api/admin/attr',
        requestData
      );
      console.log('保存属性响应:', response);
      return response;
    } catch (error) {
      console.error('保存属性失败:', error);
      throw error;
    }
  },

  /**
   * 删除属性
   * @param id 属性ID
   */
  deleteAttribute: async (id: number): Promise<ApiResponse<null>> => {
    try {
      console.log('删除属性ID:', id);
      const response = await baseClient.delete<null>(
        `/api/admin/attr/${id}`
      );
      console.log('删除属性响应:', response);
      return response;
    } catch (error) {
      console.error('删除属性失败:', error);
      throw error;
    }
  },
};

export default attributeApi;

