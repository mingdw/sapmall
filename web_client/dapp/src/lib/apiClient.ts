/**
 * 安全的API客户端
 * 提供带有JWT验证的API调用功能
 */

import { createAuthHeaders, verifyJWT } from './jwt';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ApiClientConfig {
  baseURL: string;
  defaultHeaders?: HeadersInit;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = config.defaultHeaders || {};
  }

  /**
   * 创建带有认证头的请求配置
   * @param token JWT令牌
   * @param additionalHeaders 额外的请求头
   * @returns 请求配置
   */
  private createRequestConfig(token: string, additionalHeaders: HeadersInit = {}): RequestInit {
    return {
      headers: {
        ...this.defaultHeaders,
        ...createAuthHeaders(token),
        ...additionalHeaders,
      },
    };
  }

  /**
   * 验证JWT令牌
   * @param token JWT令牌
   * @returns 验证结果
   */
  private validateToken(token: string): { valid: boolean; error?: string } {
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    const result = verifyJWT(token, ''); // 前端不存储密钥
    if (!result.valid) {
      return { valid: false, error: result.error || 'Invalid token' };
    }

    return { valid: true };
  }

  /**
   * 执行API请求
   * @param endpoint API端点
   * @param options 请求选项
   * @param token JWT令牌
   * @returns API响应
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      // 如果提供了令牌，验证其有效性
      if (token) {
        const validation = this.validateToken(token);
        if (!validation.valid) {
          return {
            success: false,
            error: validation.error || 'Token validation failed',
          };
        }
      }

      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        ...(token ? this.createRequestConfig(token, options.headers) : {
          headers: {
            ...this.defaultHeaders,
            ...options.headers,
          },
        }),
      };

      const response = await fetch(url, config);

      // 检查响应状态
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // 如果无法解析错误响应，使用默认错误消息
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      // 解析响应数据
      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * GET请求
   */
  async get<T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, token);
  }

  /**
   * POST请求
   */
  async post<T = any>(endpoint: string, data?: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, token);
  }

  /**
   * PUT请求
   */
  async put<T = any>(endpoint: string, data?: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, token);
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, token);
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
});

export default ApiClient;