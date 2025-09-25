import { useEffect, useCallback, useState } from 'react';
import { useCategoryStore } from '../store/categoryStore';
import { userApi } from '../services/api/userApi';
import { useUserStore } from '../store/userStore';
import { CategoryTreeResp } from '../services/types/categoryTypes';

/**
 * 简化版菜单数据管理Hook
 * 核心原则：单一职责，简单直接
 */
export const useMenuData = () => {
  const {
    categories,
    categoryList,
    selectedCategory,
    isLoading,
    setCategories,
    setCategoryList,
    setSelectedCategory,
    setLoading,
    buildCategoryTree,
    getCategoryById
  } = useCategoryStore();

  const { isUserLoggedIn, getCurrentUser } = useUserStore();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // 将树形菜单结构扁平化
  const flattenMenuTree = useCallback((tree: CategoryTreeResp[]): CategoryTreeResp[] => {
    const result: CategoryTreeResp[] = [];
    
    const flatten = (items: CategoryTreeResp[]) => {
      items.forEach(item => {
        const flatItem = { ...item };
        delete flatItem.children;
        result.push(flatItem);
        
        if (item.children && item.children.length > 0) {
          flatten(item.children);
        }
      });
    };
    
    flatten(tree);
    return result;
  }, []);

  // 根据URL查找菜单项
  const findCategoryByUrl = useCallback((url: string): CategoryTreeResp | null => {
    return categoryList.find(item => item.url === url) || null;
  }, [categoryList]);

  // 根据ID查找菜单项
  const findCategoryById = useCallback((id: number): CategoryTreeResp | null => {
    return getCategoryById(id);
  }, [getCategoryById]);

  // 核心：获取菜单数据
  const fetchUserMenus = useCallback(async () => {
    // 防止重复调用
    if (isLoading || isFetching) {
      console.log('菜单正在获取中，跳过重复调用');
      return;
    }
    
    // 检查用户登录状态
    if (!isUserLoggedIn()) {
      console.log('用户未登录，跳过菜单获取');
      return;
    }

    try {
      setIsFetching(true);
      setLoading(true);
      console.log('开始获取用户菜单...');
      
      // 检查 token 是否存在
      const token = localStorage.getItem('auth_token');
      console.log('当前 token:', token ? '存在' : '不存在');
      
      const response = await userApi.getUserMenus();
      console.log('菜单API响应:', response);
      console.log('response 类型:', typeof response);
      console.log('response 是否为数组:', Array.isArray(response));
      console.log('response 长度:', response?.length);
      
      // 检查响应是否为空或未定义
      if (response === undefined || response === null) {
        throw new Error('API 返回了 undefined 或 null，可能是认证失败或网络问题');
      }
      
      // 简化判断：只要有数据就处理
      if (response && Array.isArray(response) && response.length > 0) {  
        const menuData = response;
        
        // 检查数据格式并处理
        const isTreeStructure = menuData.some(item => item.children && item.children.length > 0);
        
        let tree: CategoryTreeResp[];
        let flatList: CategoryTreeResp[];
        
        if (isTreeStructure) {
          tree = menuData;
          flatList = flattenMenuTree(menuData);
        } else {
          tree = buildCategoryTree(menuData);
          flatList = menuData;
        }
        
        // 更新状态
        setCategories(tree);
        setCategoryList(flatList);
        
        console.log('菜单数据获取成功:', { 
          treeCount: tree.length, 
          itemCount: menuData.length 
        });
      } else {
        console.warn('菜单数据为空');
      }
    } catch (error) {
      console.error('获取菜单数据失败:', error);
    } finally {
      setLoading(false);
      setIsFetching(false);
      setHasInitialized(true);
    }
  }, [isUserLoggedIn, isLoading, isFetching, setLoading, setCategories, setCategoryList, flattenMenuTree, buildCategoryTree]);

  // 刷新菜单数据
  const refreshMenus = useCallback(async () => {
    setHasInitialized(false);
    await fetchUserMenus();
  }, [fetchUserMenus]);

  // 根据URL设置当前选中的菜单
  const setActiveMenuByUrl = useCallback((url: string) => {
    const menuItem = findCategoryByUrl(url);
    if (menuItem) {
      setSelectedCategory(menuItem);
    }
  }, [findCategoryByUrl, setSelectedCategory]);

  // 根据ID设置当前选中的菜单
  const setActiveMenuById = useCallback((id: number) => {
    const menuItem = findCategoryById(id);
    if (menuItem) {
      setSelectedCategory(menuItem);
    }
  }, [findCategoryById, setSelectedCategory]);

  // 监听用户登录状态变化
  useEffect(() => {
    if (isUserLoggedIn() && !hasInitialized && !isLoading && !isFetching) {
      fetchUserMenus();
    }
  }, [isUserLoggedIn, hasInitialized, isLoading, isFetching]);

  return {
    // 数据
    menuTree: categories,
    menuList: categoryList,
    selectedMenu: selectedCategory,
    isLoading,
    
    // 方法
    fetchUserMenus,
    refreshMenus,
    setActiveMenuByUrl,
    setActiveMenuById,
    
    // 状态
    hasMenus: categories.length > 0,
    hasInitialized
  };
};
