import { ApiResponse } from '../types/baseTypes';
import MessageUtils from '../../utils/messageUtils';

// 请求配置
interface RequestConfig {
  baseURL?: string;
  timeout?: number;
}

// 请求选项
interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean; // 跳过认证，不添加token
  locale?: string;
  silent?: boolean; // 是否静默处理错误，不显示消息
}

// 错误类
export class ApiError extends Error {
  public code: number;
  public status: number;
  public data?: any;
  public isNetworkError: boolean; // 是否为网络错误
  public isBusinessError: boolean; // 是否为业务错误

  constructor(message: string, code: number, status: number, data?: any, isNetworkError = false, isBusinessError = false) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;
    this.isBusinessError = isBusinessError;
  }
}

class BaseClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:8888';
    this.timeout = config.timeout || 10000;
  }

  // 获取认证token
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // 获取当前语言
  private getCurrentLocale(): string {
    // 优先使用URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const urlLocale = urlParams.get('lang');
    if (urlLocale) return urlLocale;

    // 使用localStorage
    const storedLocale = localStorage.getItem('app_locale');
    if (storedLocale) return storedLocale;

    // 使用浏览器语言
    const browserLocale = navigator.language;
    return browserLocale.startsWith('zh') ? 'zh-CN' : 'en-US';
  }

  // 构建完整URL
  private buildURL(url: string): string {
    if (url.startsWith('http')) return url;
    return `${this.baseURL}${url.startsWith('/') ? url : `/${url}`}`;
  }

  // 构建请求头
  private buildHeaders(options?: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 添加认证token（除非明确跳过）
    const token = this.getAuthToken();
    if (token && !options?.skipAuth) {
      headers.Authorization = `Bearer ${token}`;
    }

    // 添加国际化头
    const locale = options?.locale || this.getCurrentLocale();
    headers['Accept-Language'] = locale;
    headers['X-Locale'] = locale;

    return headers;
  }

  // 统一错误处理
  private handleError(error: ApiError, silent = false): void {
    if (silent) return;

    // 网络错误处理
    if (error.isNetworkError) {
      this.handleNetworkError(error);
    }
    // 业务错误处理 - 直接显示message
    else if (error.isBusinessError) {
      MessageUtils.error(error.message || '操作失败');
    }
    // 其他错误
    else {
      this.handleGenericError(error);
    }
  }

  // 网络错误处理
  private handleNetworkError(error: ApiError): void {
    const { status } = error;
    
    switch (status) {
      case 400:
        MessageUtils.error('请求参数错误');
        break;
      case 401:
        MessageUtils.error('未授权，请重新登录');
        // 清除token并跳转到登录页
        localStorage.removeItem('auth_token');
        // 可以在这里添加跳转逻辑
        break;
      case 403:
        MessageUtils.error('禁止访问，权限不足');
        break;
      case 404:
        MessageUtils.error('请求的资源不存在');
        break;
      case 405:
        MessageUtils.error('请求方法不允许');
        break;
      case 406:
        MessageUtils.error('请求格式不被接受');
        break;
      case 408:
        MessageUtils.error('请求超时，请稍后重试');
        break;
      case 409:
        MessageUtils.error('请求冲突');
        break;
      case 422:
        MessageUtils.error('请求参数验证失败');
        break;
      case 429:
        MessageUtils.error('请求过于频繁，请稍后重试');
        break;
      case 500:
        MessageUtils.error('服务器内部错误');
        break;
      case 502:
        MessageUtils.error('网关错误');
        break;
      case 503:
        MessageUtils.error('服务暂时不可用');
        break;
      case 504:
        MessageUtils.error('网关超时');
        break;
      default:
        if (status >= 400 && status < 500) {
          MessageUtils.error(`客户端错误 (${status})`);
        } else if (status >= 500) {
          MessageUtils.error(`服务器错误 (${status})`);
        } else {
          MessageUtils.error(`网络错误: ${error.message}`);
        }
    }
  }

  // 通用错误处理
  private handleGenericError(error: ApiError): void {
    MessageUtils.error(error.message || '未知错误');
  }

  // 处理响应
  private async handleResponse<T>(response: Response, silent = false): Promise<ApiResponse<T>> {
    // 检查HTTP状态
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const apiError = new ApiError(
        errorData.message || response.statusText,
        errorData.code || response.status,
        response.status,
        errorData,
        true, // 网络错误
        false
      );

      // 统一处理错误
      this.handleError(apiError, silent);
      throw apiError;
    }

    // 解析响应数据
    const data: ApiResponse<T> = await response.json();
    
    // 检查业务状态码
    if (data.code !== 0 && data.code !== 200) {
      const apiError = new ApiError(
        data.message || '请求失败',
        data.code,
        response.status,
        data.data,
        false,
        true // 业务错误
      );

      // 统一处理错误
      this.handleError(apiError, silent);
      throw apiError;
    }

    return data;
  }

  // 通用请求方法
  async request<T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      // 构建完整URL
      const fullURL = this.buildURL(url);

      // 构建请求头
      const headers = this.buildHeaders(options);

      // 创建请求配置
      const requestConfig: RequestInit = {
        method: options.method || 'GET',
        headers: {
          ...headers,
          ...options.headers,
        },
        ...options,
      };

      // 创建超时Promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new ApiError('请求超时', 408, 408, null, true, false));
        }, options.timeout || this.timeout);
      });

      // 执行请求
      const response = await Promise.race([
        fetch(fullURL, requestConfig),
        timeoutPromise,
      ]);

      // 处理响应
      return this.handleResponse<T>(response, options.silent);
    } catch (error) {
      if (error instanceof ApiError) {
        // 统一处理错误
        this.handleError(error, options.silent);
        throw error;
      }

      // 处理网络错误
      const apiError = new ApiError(
        error instanceof Error ? error.message : '网络请求失败',
        0,
        0,
        error,
        true,
        false
      );

      // 统一处理错误
      this.handleError(apiError, options.silent);
      throw apiError;
    }
  }

  // GET请求
  async get<T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  // POST请求
  async post<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT请求
  async put<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE请求
  async delete<T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  // 文件上传
  async upload<T = any>(url: string, file: File | FormData, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动设置
        ...options.headers,
      },
    });
  }

  // 设置语言
  setLocale(locale: string): void {
    localStorage.setItem('app_locale', locale);
  }
}

// 修改baseURL配置
export const baseClient = new BaseClient({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:7102', // 使用nginx代理端口
  timeout: 10000,
});

export default baseClient;
