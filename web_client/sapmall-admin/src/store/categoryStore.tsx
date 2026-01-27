import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoryTreeResp } from '../services/types/categoryTypes';
import { commonApiService } from '../services/api/commonApiService';

// 分页信息类型
interface PaginationInfo {
  page: number;
  page_size: number;
  total: number;
}

// 筛选条件类型
interface FilterInfo {
  keyword: string;
  level: number | null;
  parent_id: number | null;
  status: number | null;
}

// 分类状态接口
interface CategoryState {
  // 商品目录数据（menu_type=0，用于商品管理）
  productCategories: CategoryTreeResp[];
  // 后台菜单目录数据（menu_type=1，用于后台菜单，由useMenuData管理）
  categories: CategoryTreeResp[];
  categoryList: CategoryTreeResp[];
  
  // 当前选中的分类
  selectedCategory: CategoryTreeResp | null;
  
  // 加载状态
  isLoading: boolean;
  isCategoryListLoading: boolean;
  // 商品目录加载状态
  isProductCategoriesLoading: boolean;
  // 商品目录最后获取时间
  productCategoriesLastFetchTime: number | null;
  lastFetchTime: number | null;
  
  // 缓存时间（5分钟）
  cacheExpiry: number;
  
  // 分页信息
  pagination: PaginationInfo;
  
  // 搜索和筛选条件
  filters: FilterInfo;
  
  // 分类统计信息
  categoryStats: {
    total_categories: number;
    level1_categories: number;
    level2_categories: number;
    level3_categories: number;
    active_categories: number;
  } | null;
  
  // 操作函数
  setCategories: (categories: CategoryTreeResp[]) => void;
  setCategoryList: (categoryList: CategoryTreeResp[]) => void;
  setSelectedCategory: (category: CategoryTreeResp | null) => void;
  setCategoryStats: (stats: any) => void;
  setLoading: (loading: boolean) => void;
  setCategoryListLoading: (loading: boolean) => void;
  setLastFetchTime: (time: number) => void;
  setPagination: (pagination: Partial<PaginationInfo>) => void;
  setFilters: (filters: Partial<FilterInfo>) => void;
  
  // 检查缓存是否有效
  isCacheValid: () => boolean;
  
  // 清空缓存
  clearCache: () => void;
  clearCategoryListCache: () => void;
  
  // 分类管理操作
  addCategory: (category: CategoryTreeResp) => void;
  updateCategory: (id: number, updates: Partial<CategoryTreeResp>) => void;
  removeCategory: (id: number) => void;
  
  // 重置状态
  resetFilters: () => void;
  resetPagination: () => void;
  
  // 工具函数
  getCategoryById: (id: number) => CategoryTreeResp | null;
  getCategoriesByLevel: (level: number) => CategoryTreeResp[];
  getCategoriesByParent: (parentId: number) => CategoryTreeResp[];
  getCategoriesByStatus: (status: number) => CategoryTreeResp[];
  
  // 构建分类树结构
  buildCategoryTree: (categories: CategoryTreeResp[]) => CategoryTreeResp[];
  
  // 从API获取商品目录树并缓存（menu_type=0，首次进入后台管理时调用）
  fetchProductCategories: () => Promise<void>;
  
  // 刷新商品目录树（强制从API获取）
  refreshProductCategories: () => Promise<void>;
  
  // 检查商品目录缓存是否有效
  isProductCategoriesCacheValid: () => boolean;
  
  // 从API获取分类树并缓存（用于商品分类，categoryType=0，已废弃，使用fetchProductCategories）
  fetchCategoryTree: (categoryType?: number) => Promise<void>;
  
  // 刷新分类树（强制从API获取，已废弃，使用refreshProductCategories）
  refreshCategoryTree: (categoryType?: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      // 初始状态
      productCategories: [], // 商品目录（menu_type=0）
      categories: [], // 后台菜单目录（menu_type=1）
      categoryList: [],
      selectedCategory: null,
      isLoading: false,
      isCategoryListLoading: false,
      isProductCategoriesLoading: false,
      productCategoriesLastFetchTime: null,
      lastFetchTime: null,
      cacheExpiry: 5 * 60 * 1000, // 5分钟
      
      pagination: {
        page: 1,
        page_size: 20,
        total: 0
      },
      
      filters: {
        keyword: '',
        level: null,
        parent_id: null,
        status: null
      },
      
      categoryStats: null,
      
      // 设置分类数据
      setCategories: (categories) => set({ categories }),
      
      // 设置分类列表数据
      setCategoryList: (categoryList) => set({ categoryList }),
      
      // 设置选中的分类
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      
      // 设置分类统计信息
      setCategoryStats: (categoryStats) => set({ categoryStats }),
      
      // 设置加载状态
      setLoading: (isLoading) => set({ isLoading }),
      
      // 设置分类列表加载状态
      setCategoryListLoading: (isCategoryListLoading) => set({ isCategoryListLoading }),
      
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
          categories: [],
          categoryStats: null,
          lastFetchTime: null
        });
      },
      
      // 清空分类列表缓存
      clearCategoryListCache: () => {
        set({
          categoryList: [],
          lastFetchTime: null
        });
      },
      
      // 添加分类
      addCategory: (category) => set(state => ({
        categories: [...state.categories, category],
        categoryList: [...state.categoryList, category]
      })),
      
      // 更新分类
      updateCategory: (id, updates) => set(state => ({
        categories: state.categories.map(cat => 
          cat.id === id ? { ...cat, ...updates } : cat
        ),
        categoryList: state.categoryList.map(cat => 
          cat.id === id ? { ...cat, ...updates } : cat
        ),
        selectedCategory: state.selectedCategory?.id === id 
          ? { ...state.selectedCategory, ...updates }
          : state.selectedCategory
      })),
      
      // 删除分类
      removeCategory: (id) => set(state => ({
        categories: state.categories.filter(cat => cat.id !== id),
        categoryList: state.categoryList.filter(cat => cat.id !== id),
        selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory
      })),
      
      // 重置筛选条件
      resetFilters: () => set({
        filters: {
          keyword: '',
          level: null,
          parent_id: null,
          status: null
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
      
      // 根据ID获取分类
      getCategoryById: (id) => {
        const { categories } = get();
        const findCategoryById = (cats: CategoryTreeResp[], targetId: number): CategoryTreeResp | null => {
          for (const cat of cats) {
            if (cat.id === targetId) return cat;
            if (cat.children) {
              const found = findCategoryById(cat.children, targetId);
              if (found) return found;
            }
          }
          return null;
        };
        return findCategoryById(categories, id);
      },
      
      // 根据级别获取分类
      getCategoriesByLevel: (level) => {
        const { categories } = get();
        const result: CategoryTreeResp[] = [];
        const findCategoriesByLevel = (cats: CategoryTreeResp[], targetLevel: number) => {
          cats.forEach(cat => {
            if (cat.level === targetLevel) {
              result.push(cat);
            }
            if (cat.children) {
              findCategoriesByLevel(cat.children, targetLevel);
            }
          });
        };
        findCategoriesByLevel(categories, level);
        return result;
      },
      
      // 根据父级ID获取分类
      getCategoriesByParent: (parentId) => {
        const { categories } = get();
        if (parentId === 0) {
          // 获取一级分类
          return categories.filter(cat => cat.parent_id === 0);
        }
        
        const result: CategoryTreeResp[] = [];
        const findCategoriesByParent = (cats: CategoryTreeResp[], targetParentId: number) => {
          cats.forEach(cat => {
            if (cat.parent_id === targetParentId) {
              result.push(cat);
            }
            if (cat.children) {
              findCategoriesByParent(cat.children, targetParentId);
            }
          });
        };
        findCategoriesByParent(categories, parentId);
        return result;
      },
      
      // 根据状态获取分类
      getCategoriesByStatus: (status) => {
        const { categories } = get();
        const result: CategoryTreeResp[] = [];
        const findCategoriesByStatus = (cats: CategoryTreeResp[], targetStatus: number) => {
          cats.forEach(cat => {
            if (cat.status === targetStatus) {
              result.push(cat);
            }
            if (cat.children) {
              findCategoriesByStatus(cat.children, targetStatus);
            }
          });
        };
        findCategoriesByStatus(categories, status);
        return result;
      },
      
      // 构建分类树结构
      buildCategoryTree: (categories) => {
        const categoryMap = new Map<number, CategoryTreeResp>();
        const rootCategories: CategoryTreeResp[] = [];
        
        // 先创建所有分类的映射
        categories.forEach(category => {
          categoryMap.set(category.id, { ...category, children: [] });
        });
        
        // 构建树结构
        categories.forEach(category => {
          const categoryWithChildren = categoryMap.get(category.id)!;
          if (category.parent_id === 0) {
            rootCategories.push(categoryWithChildren);
          } else {
            const parent = categoryMap.get(category.parent_id);
            if (parent) {
              if (!parent.children) {
                parent.children = [];
              }
              parent.children.push(categoryWithChildren);
            }
          }
        });
        
        return rootCategories;
      },
      
      // 从API获取商品目录树并缓存（menu_type=0，首次进入后台管理时调用）
      fetchProductCategories: async () => {
        const { isProductCategoriesCacheValid, productCategories, isProductCategoriesLoading } = get();
        
        // 如果缓存有效且有数据，直接返回
        if (isProductCategoriesCacheValid() && productCategories.length > 0) {
          console.log('使用缓存的商品目录数据');
          return;
        }
        
        // 如果正在加载，避免重复请求
        if (isProductCategoriesLoading) {
          console.log('商品目录数据正在加载中，跳过重复请求');
          return;
        }
        
        try {
          set({ isProductCategoriesLoading: true });
          console.log('从API获取商品目录数据（menu_type=0）');
          const tree = await commonApiService.getCategoryTree(0);
          const categoryList = Array.isArray(tree) ? tree : [tree];
          
          // 类型转换：将 commonApiService 返回的类型转换为 store 使用的类型
          const convertedList: CategoryTreeResp[] = categoryList.map((cat: any) => ({
            ...cat,
            parent_id: cat.parentId || cat.parent_id || 0,
            url: cat.code || cat.url || '',
          }));
          
          set({ 
            productCategories: convertedList,
            productCategoriesLastFetchTime: Date.now(),
            isProductCategoriesLoading: false
          });
          console.log('商品目录数据获取成功并已缓存');
        } catch (error) {
          console.error('获取商品目录数据失败:', error);
          set({ isProductCategoriesLoading: false });
          throw error;
        }
      },
      
      // 刷新商品目录树（强制从API获取）
      refreshProductCategories: async () => {
        try {
          set({ isProductCategoriesLoading: true });
          console.log('强制刷新商品目录数据（menu_type=0）');
          const tree = await commonApiService.getCategoryTree(0);
          const categoryList = Array.isArray(tree) ? tree : [tree];
          
          // 类型转换：将 commonApiService 返回的类型转换为 store 使用的类型
          const convertedList: CategoryTreeResp[] = categoryList.map((cat: any) => ({
            ...cat,
            parent_id: cat.parentId || cat.parent_id || 0,
            url: cat.code || cat.url || '',
          }));
          
          set({ 
            productCategories: convertedList,
            productCategoriesLastFetchTime: Date.now(),
            isProductCategoriesLoading: false
          });
          console.log('商品目录数据刷新成功并已缓存');
        } catch (error) {
          console.error('刷新商品目录数据失败:', error);
          set({ isProductCategoriesLoading: false });
          throw error;
        }
      },
      
      // 检查商品目录缓存是否有效
      isProductCategoriesCacheValid: () => {
        const { productCategoriesLastFetchTime, cacheExpiry } = get();
        if (!productCategoriesLastFetchTime) return false;
        return Date.now() - productCategoriesLastFetchTime < cacheExpiry;
      },
      
      // 从API获取分类树并缓存（用于商品分类，categoryType=0，已废弃，使用fetchProductCategories）
      fetchCategoryTree: async (categoryType = 0) => {
        // 兼容旧代码，如果是商品目录（categoryType=0），使用新的方法
        if (categoryType === 0) {
          return get().fetchProductCategories();
        }
        // 其他类型暂不支持
        console.warn('fetchCategoryTree已废弃，请使用fetchProductCategories');
      },
      
      // 刷新分类树（强制从API获取，已废弃，使用refreshProductCategories）
      refreshCategoryTree: async (categoryType = 0) => {
        // 兼容旧代码，如果是商品目录（categoryType=0），使用新的方法
        if (categoryType === 0) {
          return get().refreshProductCategories();
        }
        // 其他类型暂不支持
        console.warn('refreshCategoryTree已废弃，请使用refreshProductCategories');
      }
    }),
    {
      name: 'sapmall-admin-category-storage',
      // 只持久化必要的状态
      partialize: (state) => ({
        productCategories: state.productCategories, // 持久化商品目录
        productCategoriesLastFetchTime: state.productCategoriesLastFetchTime,
        categories: state.categories,
        categoryStats: state.categoryStats,
        lastFetchTime: state.lastFetchTime,
        pagination: state.pagination,
        filters: state.filters
      })
    }
  )
);
