import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IframeParams } from '../types';

// 用户信息接口（与IframeParams保持一致）
interface UserInfo {
  userId?: string;         // 用户ID
  userToken?: string;      // 用户认证token
  userAddress?: string;    // 用户钱包地址
  userRoles?: string;      // 用户角色列表（逗号分隔）
  nickname?: string;       // 用户昵称
  status?: string;         // 用户状态
  menu?: string;           // 目标菜单项
}

// 用户状态接口
interface UserState {
  // 用户列表数据
  users: UserInfo[];
  userList: UserInfo[];
  userStats: {
    total_users: number;
    active_users: number;
    inactive_users: number;
    new_users_today: number;
    new_users_this_month: number;
  } | null;
  
  // 当前选中的用户
  selectedUser: UserInfo | null;
  
  // 加载状态
  isLoading: boolean;
  isUserListLoading: boolean;
  lastFetchTime: number | null;
  
  // 缓存时间（5分钟）
  cacheExpiry: number;
  
  // 分页信息
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
  
  // 搜索和筛选条件
  filters: {
    keyword: string;
    status: number | null;
    type: number | null;
    gender: number | null;
    start_date: string;
    end_date: string;
  };
  
  // 操作函数
  setUsers: (users: UserInfo[]) => void;
  setUserList: (userList: UserInfo[]) => void;
  setSelectedUser: (user: UserInfo | null) => void;
  setUserStats: (stats: any) => void;
  setLoading: (loading: boolean) => void;
  setUserListLoading: (loading: boolean) => void;
  setLastFetchTime: (time: number) => void;
  setPagination: (pagination: Partial<{ page: number; page_size: number; total: number }>) => void;
  setFilters: (filters: Partial<{ keyword: string; status: number | null; type: number | null; gender: number | null; start_date: string; end_date: string }>) => void;
  
  // 检查缓存是否有效
  isCacheValid: () => boolean;
  
  // 清空缓存
  clearCache: () => void;
  clearUserListCache: () => void;
  
  // 用户管理操作
  addUser: (user: UserInfo) => void;
  updateUser: (id: string, updates: Partial<UserInfo>) => void;
  removeUser: (id: string) => void;
  
  // 重置状态
  resetFilters: () => void;
  resetPagination: () => void;
  
  // 工具函数
  getUserById: (id: string) => UserInfo | null;
  getUsersByStatus: (status: string) => UserInfo[];
  getUsersByRole: (role: string) => UserInfo[];
  
  // iframe参数处理方法
  setUserFromIframe: (params: IframeParams) => void;
  getCurrentUser: () => UserInfo | null;
  getCurrentUserToken: () => string | null;
  isUserLoggedIn: () => boolean;
  hasPermission: (requiredRole?: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      users: [],
      userList: [],
      userStats: null,
      selectedUser: null,
      isLoading: false,
      isUserListLoading: false,
      lastFetchTime: null,
      cacheExpiry: 5 * 60 * 1000, // 5分钟
      
      pagination: {
        page: 1,
        page_size: 20,
        total: 0
      },
      
      filters: {
        keyword: '',
        status: null,
        type: null,
        gender: null,
        start_date: '',
        end_date: ''
      },
      
      // 设置用户数据
      setUsers: (users) => set({ users }),
      
      // 设置用户列表数据
      setUserList: (userList) => set({ userList }),
      
      // 设置选中的用户
      setSelectedUser: (selectedUser) => set({ selectedUser }),
      
      // 设置用户统计信息
      setUserStats: (userStats) => set({ userStats }),
      
      // 设置加载状态
      setLoading: (isLoading) => set({ isLoading }),
      
      // 设置用户列表加载状态
      setUserListLoading: (isUserListLoading) => set({ isUserListLoading }),
      
      // 设置最后获取时间
      setLastFetchTime: (lastFetchTime) => set({ lastFetchTime }),
      
      // 设置分页信息
      setPagination: (pagination) => set(state => ({
        pagination: { ...state.pagination, ...pagination }
      })),
      
      // 设置筛选条件
      setFilters: (filters) => set(state => ({
        filters: { ...state.filters, ...filters }
      })),
      
      // 检查缓存是否有效
      isCacheValid: () => {
        const { lastFetchTime, cacheExpiry } = get();
        if (!lastFetchTime) return false;
        return Date.now() - lastFetchTime < cacheExpiry;
      },
      
      // 清空缓存
      clearCache: () => {
        set({
          users: [],
          userStats: null,
          lastFetchTime: null
        });
      },
      
      // 清空用户列表缓存
      clearUserListCache: () => {
        set({
          userList: [],
          lastFetchTime: null
        });
      },
      
      // 添加用户
      addUser: (user) => set(state => ({
        users: [...state.users, user],
        userList: [...state.userList, user]
      })),
      
      // 更新用户
      updateUser: (id, updates) => set(state => ({
        users: state.users.map(user => 
          user.userId === id ? { ...user, ...updates } : user
        ),
        userList: state.userList.map(user => 
          user.userId === id ? { ...user, ...updates } : user
        ),
        selectedUser: state.selectedUser?.userId === id 
          ? { ...state.selectedUser, ...updates }
          : state.selectedUser
      })),
      
      // 删除用户
      removeUser: (id) => set(state => ({
        users: state.users.filter(user => user.userId !== id),
        userList: state.userList.filter(user => user.userId !== id),
        selectedUser: state.selectedUser?.userId === id ? null : state.selectedUser
      })),
      
      // 重置筛选条件
      resetFilters: () => set({
        filters: {
          keyword: '',
          status: null,
          type: null,
          gender: null,
          start_date: '',
          end_date: ''
        }
      }),
      
      // 重置分页
      resetPagination: () => set({
        pagination: {
          page: 1,
          page_size: 20,
          total: 0
        }
      }),
      
      // 根据ID获取用户
      getUserById: (id) => {
        const { users } = get();
        return users.find(user => user.userId === id) || null;
      },
      
      // 根据状态获取用户
      getUsersByStatus: (status) => {
        const { users } = get();
        return users.filter(user => user.status === status);
      },
      
      // 根据角色获取用户
      getUsersByRole: (role) => {
        const { users } = get();
        return users.filter(user => user.userRoles?.includes(role));
      },
      
      // 从iframe参数设置用户信息
      setUserFromIframe: (params) => {
        const userInfo: UserInfo = {
          userId: params.userId,
          userToken: params.userToken,
          userAddress: params.userAddress,
          userRoles: params.userRoles,
          nickname: params.nickname,
          status: params.status,
          menu: params.menu
        };
        
        set({ selectedUser: userInfo });
        
        // 如果用户不在列表中，添加到列表
        const { users } = get();
        const existingUser = users.find(user => user.userId === userInfo.userId);
        if (!existingUser && userInfo.userId) {
          set({ users: [...users, userInfo] });
        }
      },
      
      // 获取当前用户
      getCurrentUser: () => {
        const { selectedUser } = get();
        return selectedUser;
      },

      getCurrentUserToken: () => {
        const { selectedUser } = get();
        return selectedUser?.userToken || null;
      },
      
      // 检查用户是否已登录
      isUserLoggedIn: () => {
        const { selectedUser } = get();
        return !!(selectedUser?.userToken && selectedUser?.userId);
      },
      
      // 检查用户权限
      hasPermission: (requiredRole) => {
        const { selectedUser } = get();
        if (!selectedUser?.userRoles) return false;
        
        if (!requiredRole) return true;
        
        // 检查单个角色
        if (selectedUser.userRoles?.includes(requiredRole)) return true;
        
        // 检查角色列表（如果userRoles存在）
        if (selectedUser.userRoles) {
          const userRoles = selectedUser.userRoles.split(',').map(role => role.trim());
          return userRoles.includes(requiredRole);
        }
        
        return false;
      }
    }),
    {
      name: 'sapmall-admin-user-storage',
      // 只持久化必要的状态
      partialize: (state) => ({
        users: state.users,
        selectedUser: state.selectedUser,
        userStats: state.userStats,
        lastFetchTime: state.lastFetchTime,
        pagination: state.pagination,
        filters: state.filters
      })
    }
  )
);
