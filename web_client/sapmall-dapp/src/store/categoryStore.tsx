import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoryTreeResp, AttrGroupResp } from '../services/types/categoryTypes';

// 分类状态接口
interface CategoryState {
  // 分类数据
  categories: CategoryTreeResp[];
  allAttrGroups: AttrGroupResp[];
  
  // 加载状态
  isLoading: boolean;
  lastFetchTime: number | null;
  
  // 缓存时间（5分钟）
  cacheExpiry: number;
  
  // 操作函数
  setCategories: (categories: CategoryTreeResp[]) => void;
  setAllAttrGroups: (attrGroups: AttrGroupResp[]) => void;
  setLoading: (loading: boolean) => void;
  setLastFetchTime: (time: number) => void;
  
  // 检查缓存是否有效
  isCacheValid: () => boolean;
  
  // 清空缓存
  clearCache: () => void;
  
  // 根据分类ID收集attrGroups
  collectAttrGroupsForCategory: (categoryId: number | null) => AttrGroupResp[];
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      // 初始状态
      categories: [],
      allAttrGroups: [],
      isLoading: false,
      lastFetchTime: null,
      cacheExpiry: 5 * 60 * 1000, // 5分钟
      
      // 设置分类数据
      setCategories: (categories) => {
        set({ categories });
        
        // 同时收集所有一级目录的attrGroups
        const allGroups: AttrGroupResp[] = [];
        categories.forEach(category => {
          if (category.attrGroups && category.attrGroups.length > 0) {
            allGroups.push(...category.attrGroups);
          }
        });
        set({ allAttrGroups: allGroups });
      },
      
      // 设置attrGroups
      setAllAttrGroups: (attrGroups) => set({ allAttrGroups: attrGroups }),
      
      // 设置加载状态
      setLoading: (loading) => set({ isLoading: loading }),
      
      // 设置最后获取时间
      setLastFetchTime: (time) => set({ lastFetchTime: time }),
      
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
          allAttrGroups: [],
          lastFetchTime: null
        });
      },
      
      // 根据分类ID收集attrGroups
      collectAttrGroupsForCategory: (categoryId) => {
        const { categories } = get();
        
        if (categoryId === null || categoryId === 0) {
          // 全部商品：显示所有一级目录的attrGroups
          const allGroups: AttrGroupResp[] = [];
          categories.forEach(category => {
            if (category.attrGroups && category.attrGroups.length > 0) {
              allGroups.push(...category.attrGroups);
            }
          });
          return allGroups;
        }

        // 查找选中的分类
        const findCategoryById = (cats: CategoryTreeResp[], id: number): CategoryTreeResp | null => {
          for (const cat of cats) {
            if (cat.id === id) return cat;
            if (cat.children) {
              const found = findCategoryById(cat.children, id);
              if (found) return found;
            }
          }
          return null;
        };

        const selectedCategory = findCategoryById(categories, categoryId);
        if (!selectedCategory) return [];

        const collectedGroups: AttrGroupResp[] = [];
        
        // 收集当前分类的attrGroups
        if (selectedCategory.attrGroups && selectedCategory.attrGroups.length > 0) {
          collectedGroups.push(...selectedCategory.attrGroups);
        }

        // 如果是二级或三级分类，还需要收集父级的attrGroups
        if (selectedCategory.level > 1) {
          // 查找父级分类
          const findParentCategory = (cats: CategoryTreeResp[], childId: number): CategoryTreeResp | null => {
            for (const cat of cats) {
              if (cat.children) {
                for (const child of cat.children) {
                  if (child.id === childId) return cat;
                  if (child.children) {
                    const found = findParentCategory([child], childId);
                    if (found) return cat;
                  }
                }
              }
            }
            return null;
          };

          let currentParent = findParentCategory(categories, categoryId);
          while (currentParent && currentParent.level >= 1) {
            if (currentParent.attrGroups && currentParent.attrGroups.length > 0) {
              // 避免重复添加
              const existingIds = collectedGroups.map(g => g.id);
              const newGroups = currentParent.attrGroups.filter(g => !existingIds.includes(g.id));
              collectedGroups.unshift(...newGroups); // 父级的放在前面
            }
            
            // 继续查找更上级的父级
            if (currentParent.level > 1) {
              currentParent = findParentCategory(categories, currentParent.id);
            } else {
              break;
            }
          }
        }

        return collectedGroups;
      }
    }),
    {
      name: 'category-store', // 本地存储的key
      partialize: (state) => ({
        categories: state.categories,
        allAttrGroups: state.allAttrGroups,
        lastFetchTime: state.lastFetchTime
      })
    }
  )
);
