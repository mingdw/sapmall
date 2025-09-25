import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserStatus } from '../services/types/userTypes';

// 用户信息接口
interface User {
  id: string;
  address: string;
  nickname?: string;
  avatar?: string;
  created_at: string;
  updated_at?: string;
  status: number; // 1: 正常, 0: 禁用
  roles: string[];
  token: string;
}

// Token余额接口
interface TokenBalance {
  symbol: string;
  balance: string;
  contract_address: string;
  decimals: number;
  name?: string;
  logo?: string;
}

// 用户状态接口
interface UserState {
  // 用户信息
  user: User | null;
  tokenBalances: TokenBalance[];
  
  // 认证信息
  authToken: string | null;
  
  // 核心状态 - 只保留三个关键状态
  isConnected: boolean;    // 钱包连接状态（与钱包的connected同步）
  isLoggedIn: boolean;     // 登录状态（后端登录成功后自动设置）
  status: number;          // 用户状态（后端登录完成后同步后端返回的结果）
  
  // 用户操作
  setUser: (user: User | null) => void;
  setTokenBalances: (balances: TokenBalance[]) => void;
  setConnected: (connected: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setStatus: (status: number) => void;
  
  // Token管理
  setAuthToken: (token: string | null) => void;
  getAuthToken: () => string | null;
  clearAuthToken: () => void;
  validateToken: () => boolean;
  
  // 登录/登出
  login: (user: User, token: string) => void;
  logout: () => void;
  
  // 更新用户信息
  updateUser: (updates: Partial<User>) => void;
  
  // 添加/更新Token余额
  updateTokenBalance: (token: TokenBalance) => void;
  
  // 清除所有状态
  clearState: () => void;
  
  // 校验相关方法
  validateUserAccess: () => Promise<{ isValid: boolean; error?: string }>;
  hasValidRole: (allowedRoles?: string[]) => boolean;
  isUserActive: () => boolean;
  refreshUserStatus: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      tokenBalances: [],
      authToken: null,
      isConnected: false,
      isLoggedIn: false,
      status: 0, // 0: 未激活, 1: 正常
      
      // 设置用户信息
      setUser: (user) => set({ user }),

      // 设置Token余额
      setTokenBalances: (tokenBalances) => set({ tokenBalances }),

      // 设置连接状态
      setConnected: (isConnected) => set({ isConnected }),

      // 设置登录状态
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

      // 设置用户状态
      setStatus: (status) => set({ status }),

      // Token管理
      setAuthToken: (authToken) => {
        set({ authToken });
        // 同时更新localStorage
        if (authToken) {
          localStorage.setItem('auth_token', authToken);
        } else {
          localStorage.removeItem('auth_token');
        }
      },

      getAuthToken: () => {
        const state = get();
        // 优先从store获取，如果为空则从localStorage获取
        if (state.authToken) {
          return state.authToken;
        }
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          // 同步到store
          set({ authToken: storedToken });
          return storedToken;
        }
        return null;
      },

      clearAuthToken: () => {
        set({ authToken: null });
        localStorage.removeItem('auth_token');
      },

      // Token验证
      validateToken: () => {
        const token = get().getAuthToken();
        if (!token) return false;
        
        try {
          // 简单的JWT token验证（检查是否过期）
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          return payload.exp > currentTime;
        } catch (error) {
          console.error('Token验证失败:', error);
          return false;
        }
      },

      // 登录
      login: (user, token) => {
        console.log('用户登录，设置状态:', { user, token, address: user.address });
        set({
          user,
          authToken: token,
          isLoggedIn: true,
          status: user.status, // 同步后端返回的用户状态
        });
      },

      // 登出
      logout: () => {
        // 清除token
        get().clearAuthToken();
        set({
          user: null,
          tokenBalances: [],
          authToken: null,
          isLoggedIn: false,
          status: 0,
        });
      },

      // 更新用户信息
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates }
          });
        }
      },

      // 更新Token余额
      updateTokenBalance: (token) => {
        const currentBalances = get().tokenBalances;
        const existingIndex = currentBalances.findIndex(
          t => t.contract_address === token.contract_address
        );
        
        if (existingIndex >= 0) {
          // 更新现有Token
          const newBalances = [...currentBalances];
          newBalances[existingIndex] = token;
          set({ tokenBalances: newBalances });
        } else {
          // 添加新Token
          set({ tokenBalances: [...currentBalances, token] });
        }
      },

      // 清除所有状态
      clearState: () => {
        // 清除token
        get().clearAuthToken();
        set({
          user: null,
          tokenBalances: [],
          authToken: null,
          isLoggedIn: false,
          status: 0,
        });
      },

      // 校验相关方法
      validateUserAccess: async () => {
        const state = get();
        const { user, isConnected, isLoggedIn, status } = state;
        
        try {
          console.log('开始校验用户权限:', { user, isConnected, isLoggedIn, status });
          
          // 1. 校验登录状态
          if (!isLoggedIn || !user) {
            console.log('校验失败: 用户未登录');
            return { isValid: false, error: '用户未登录' };
          }

          // 2. 校验钱包连接状态
          if (!isConnected) {
            console.log('校验失败: 钱包未连接');
            return { isValid: false, error: '钱包未连接，请先连接钱包' };
          }

          // 3. 校验用户状态
          if (status !== UserStatus.ACTIVE) {
            console.log('校验失败: 用户状态异常', { status });
            return { isValid: false, error: '用户账户已被禁用，请联系管理员' };
          }

          // 4. 校验用户角色权限
          const allowedRoles = ['R0001', 'R0002', 'R0003'];
          const hasValidRole = user.roles && user.roles.some(role => allowedRoles.includes(role));
          console.log('角色校验:', { userRoles: user.roles, allowedRoles, hasValidRole });
          if (!hasValidRole) {
            return { isValid: false, error: '用户角色权限不足，需要R0001、R0002或R0003角色才能访问管理界面' };
          }

          // 5. 校验token
          if (!user.token) {
            console.log('校验失败: token不存在');
            return { isValid: false, error: '认证token不存在，请重新登录' };
          }

          console.log('所有校验通过');
          return { isValid: true };
        } catch (error) {
          console.error('用户权限校验失败:', error);
          return { isValid: false, error: '权限校验失败，请重新登录' };
        }
      },

      hasValidRole: (allowedRoles = ['R0001', 'R0002', 'R0003']) => {
        const { user } = get();
        return user?.roles ? user.roles.some(role => allowedRoles.includes(role)) : false;
      },

      isUserActive: () => {
        const { status } = get();
        return status === 1;
      },

      // 刷新用户状态
      refreshUserStatus: async () => {
        try {
          console.log('开始刷新用户状态...');
          
          // 重新获取当前用户信息
          const { user } = get();
          if (!user) {
            console.log('用户不存在，无需刷新');
            return;
          }
          
          // 这里可以调用API重新获取用户信息
          // 暂时只是重新验证本地状态
          console.log('用户状态刷新完成');
        } catch (error) {
          console.error('刷新用户状态失败:', error);
        }
      }
    }),
    {
      name: 'sapmall-user-storage',
      // 只持久化必要的状态
      partialize: (state) => ({
        user: state.user,
        authToken: state.authToken,
        isLoggedIn: state.isLoggedIn,
        status: state.status,
      }),
    }
  )
);
