/**
 * 用户认证Hook
 * 提供安全的JWT令牌管理和用户状态管理
 */

import { useState, useEffect, useCallback } from 'react';
import { verifyJWT, getStoredToken, storeToken, removeToken, isTokenExpiringSoon } from '../lib/jwt';

interface User {
  id: string;
  // 可以根据需要添加其他用户属性
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  checkTokenValidity: () => boolean;
}

export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  // 检查令牌有效性
  const checkTokenValidity = useCallback((token: string): boolean => {
    // 注意：这里只做基本验证，真正的签名验证需要在服务端进行
    const result = verifyJWT(token, ''); // 前端不存储密钥
    return result.valid;
  }, []);

  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getStoredToken();
        
        if (!storedToken) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
          return;
        }

        // 检查令牌基本有效性
        if (!checkTokenValidity(storedToken)) {
          removeToken();
          setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: 'Invalid token',
          });
          return;
        }

        // 检查令牌是否即将过期
        if (isTokenExpiringSoon(storedToken)) {
          // 可以在这里触发令牌刷新逻辑
          console.warn('Token is expiring soon, consider refreshing');
        }

        // 解析用户信息
        const parts = storedToken.split('.');
        const payload = JSON.parse(atob(parts[1]));
        
        setAuthState({
          isAuthenticated: true,
          user: { id: payload.comer_uin },
          token: storedToken,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        removeToken();
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
          error: 'Authentication failed',
        });
      }
    };

    initializeAuth();
  }, [checkTokenValidity]);

  // 登录
  const login = useCallback((token: string) => {
    try {
      if (!checkTokenValidity(token)) {
        setAuthState(prev => ({
          ...prev,
          error: 'Invalid token provided',
        }));
        return;
      }

      storeToken(token);
      
      // 解析用户信息
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      
      setAuthState({
        isAuthenticated: true,
        user: { id: payload.comer_uin },
        token,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Login failed',
      }));
    }
  }, [checkTokenValidity]);

  // 登出
  const logout = useCallback(() => {
    removeToken();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // 刷新令牌
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // 这里应该调用后端API来刷新令牌
      // 由于我们不知道具体的API端点，这里只是示例
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authState.token }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.token) {
        login(data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  }, [authState.token, login, logout]);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    checkTokenValidity: () => authState.token ? checkTokenValidity(authState.token) : false,
  };
}