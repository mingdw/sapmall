import { useEffect } from 'react';
import { commonApiService } from '../../../services/api/commonApiService';
import { useCategoryStore } from '../../../store/categoryStore';

/**
 * 进入页面时始终拉取最新目录树；若有缓存则先展示缓存（stale-while-revalidate）。
 */
export function useCategoryTreeRefresh(): void {
  const setCategories = useCategoryStore((s) => s.setCategories);
  const setLoading = useCategoryStore((s) => s.setLoading);
  const setLastFetchTime = useCategoryStore((s) => s.setLastFetchTime);

  useEffect(() => {
    let cancelled = false;
    const hasCached = useCategoryStore.getState().categories.length > 0;

    const fetchCategories = async () => {
      if (!hasCached) {
        setLoading(true);
      }

      try {
        const response = await commonApiService.getCategoryTree(0);
        if (cancelled) return;
        const categoryList = Array.isArray(response) ? response : [response];
        setCategories(categoryList);
        setLastFetchTime(Date.now());
      } catch (error) {
        console.error('获取分类失败:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchCategories();

    return () => {
      cancelled = true;
    };
  }, [setCategories, setLoading, setLastFetchTime]);
}
