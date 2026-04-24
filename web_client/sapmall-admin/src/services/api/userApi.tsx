import { baseClient } from "./baseClient";
import { ApiResponse } from "../types/baseTypes";
import { CategoryTreeResp } from "../types/categoryTypes";

export interface ModifyUserInfoPayload {
  nickname?: string;
  gender?: number;
  birthday?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export const userApi = {
  /**
   * 获取用户菜单
   * 根据用户角色获取对应的菜单权限
   */
  getUserMenus: async (): Promise<CategoryTreeResp[]> => {
    try {
      console.log('调用 getUserMenus API...');
      const response = await baseClient.get<ApiResponse<CategoryTreeResp[]>>(`/api/user/menus`);
      console.log('getUserMenus API 原始响应:', response);
      
      if (!response) {
        throw new Error('API 返回空响应');
      }
      
      if (!response.data) {
        throw new Error('API 响应中缺少 data 字段');
      }
      
      if (!Array.isArray(response.data)) {
        throw new Error('API 响应中 data 字段不是数组');
      }
      
      console.log('getUserMenus API 处理后的数据:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取用户菜单失败:', error);
      throw error;
    }
  },

  /**
   * 获取用户信息
   */
  getUserInfo: async (userId: string | number): Promise<any> => {
    try {
      const response = await baseClient.get<any>(`/api/user/info/${userId}`);
      return response.data;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },

  /**
   * 修改用户信息
   */
  modifyUserInfo: async (payload: ModifyUserInfoPayload): Promise<any> => {
    try {
      const response = await baseClient.post<any>(`/api/user/modify`, payload);
      return response.data;
    } catch (error) {
      console.error('修改用户信息失败:', error);
      throw error;
    }
  },

  /**
   * 申请商家认证（生成保证金意图单）
   */
  applyMerchantCert: async (payload?: { termsVersion?: string }): Promise<any> => {
    try {
      const response = await baseClient.post<any>(`/api/user/merchant/cert/apply`, payload || {});
      return response.data;
    } catch (error) {
      console.error('申请商家认证失败:', error);
      throw error;
    }
  },

  /**
   * 刷新用户菜单缓存
   */
  refreshUserMenus: async (): Promise<ApiResponse<CategoryTreeResp[]>> => {
    try {
      // 添加时间戳参数避免缓存
      const timestamp = Date.now();
      const response = await baseClient.get<ApiResponse<CategoryTreeResp[]>>(
        `/api/user/menus?t=${timestamp}`
      );
      return response.data;
    } catch (error) {
      console.error('刷新用户菜单失败:', error);
      throw error;
    }
  }
};