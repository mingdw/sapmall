import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  
  // 连接状态
  isConnected: boolean;
  isLoggedIn: boolean;
  isConnecting: boolean;
  
  // 钱包信息
  walletAddress: string | null;
  currentChain: string | null;
  
  // 用户操作
  setUser: (user: User | null) => void;
  setTokenBalances: (balances: TokenBalance[]) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setWalletAddress: (address: string | null) => void;
  setCurrentChain: (chain: string | null) => void;
  
  // 登录/登出
  login: (user: User, token: string) => void;
  logout: () => void;
  
  // 更新用户信息
  updateUser: (updates: Partial<User>) => void;
  
  // 添加/更新Token余额
  updateTokenBalance: (token: TokenBalance) => void;
  
  // 清除所有状态
  clearState: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      tokenBalances: [],
      isConnected: false,
      isLoggedIn: false,
      isConnecting: false,
      walletAddress: null,
      currentChain: null,

      // 设置用户信息
      setUser: (user) => set({ user }),

      // 设置Token余额
      setTokenBalances: (tokenBalances) => set({ tokenBalances }),

      // 设置登录状态
      setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

      // 设置连接状态
      setConnected: (isConnected) => set({ isConnected }),

      // 设置连接中状态
      setConnecting: (isConnecting) => set({ isConnecting }),

      // 设置钱包地址
      setWalletAddress: (walletAddress) => set({ walletAddress }),

      // 设置当前链
      setCurrentChain: (currentChain) => set({ currentChain }),

      // 登录
      login: (user, token) => set({
        user,
        isLoggedIn: true,
        isConnected: true,
        walletAddress: user.address,
      }),

      // 登出
      logout: () => set({
        user: null,
        tokenBalances: [],
        isLoggedIn: false,
        isConnected: false,
        walletAddress: null,
        currentChain: null,
      }),

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
      clearState: () => set({
        user: null,
        tokenBalances: [],
        isConnected: false,
        isLoggedIn: false,
        isConnecting: false,
        walletAddress: null,
        currentChain: null,
      }),
    }),
    {
      name: 'sapmall-user-storage',
      // 只持久化必要的状态
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        walletAddress: state.walletAddress,
      }),
    }
  )
);
