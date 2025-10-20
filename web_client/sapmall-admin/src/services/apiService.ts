// API服务文件 - 统一管理API调用

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7102';

// 通用API响应接口
interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 目录相关API
export const categoryApi = {
  // 获取目录树
  getCategoryTree: async (categoryType: number = 1): Promise<ApiResponse> => {
    try {
      const url = `${API_BASE_URL}/api/common/${categoryType}/categories`;
      console.log('API调用URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // 明确设置CORS模式
      });
      
      console.log('API响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API响应错误:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API响应数据:', result);
      return result;
    } catch (error) {
      console.error('获取目录树失败:', error);
      throw error;
    }
  },

  // 获取目录详情
  getCategory: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/category/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('获取目录详情失败:', error);
      throw error;
    }
  },

  // 创建目录
  createCategory: async (categoryData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('创建目录失败:', error);
      throw error;
    }
  },

  // 更新目录
  updateCategory: async (id: number, categoryData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('更新目录失败:', error);
      throw error;
    }
  },

  // 删除目录
  deleteCategory: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/category/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('删除目录失败:', error);
      throw error;
    }
  }
};

// 属性组相关API
export const attributeGroupApi = {
  // 获取属性组列表
  getAttributeGroups: async (): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attr-group`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('获取属性组列表失败:', error);
      throw error;
    }
  },

  // 创建属性组
  createAttributeGroup: async (groupData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attr-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('创建属性组失败:', error);
      throw error;
    }
  },

  // 更新属性组
  updateAttributeGroup: async (id: number, groupData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attr-group/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('更新属性组失败:', error);
      throw error;
    }
  },

  // 删除属性组
  deleteAttributeGroup: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attr-group/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('删除属性组失败:', error);
      throw error;
    }
  }
};

// 属性相关API
export const attributeApi = {
  // 获取属性列表
  getAttributes: async (): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attr`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('获取属性列表失败:', error);
      throw error;
    }
  },

  // 创建属性
  createAttribute: async (attrData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attrData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('创建属性失败:', error);
      throw error;
    }
  },

  // 更新属性
  updateAttribute: async (id: number, attrData: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attr/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attrData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('更新属性失败:', error);
      throw error;
    }
  },

  // 删除属性
  deleteAttribute: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attr/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('删除属性失败:', error);
      throw error;
    }
  }
};

export default {
  categoryApi,
  attributeGroupApi,
  attributeApi
};
