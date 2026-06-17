import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { commonApiService } from '../../../services/api/commonApiService';
import { useCategoryStore } from '../../../store/categoryStore';
import { getCurrentApiLocale } from '../../../utils/apiLocale';

/**
 * 进入页面时拉取最新目录树；语言切换时重新请求；若有同语言缓存则先展示（stale-while-revalidate）。
 */
export function useCategoryTreeRefresh(): void {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const setCategories = useCategoryStore((s) => s.setCategories);
  const setLoading = useCategoryStore((s) => s.setLoading);
  const setLastFetchTime = useCategoryStore((s) => s.setLastFetchTime);
  const setCategoriesLocale = useCategoryStore((s) => s.setCategoriesLocale);

  useEffect(() => {
    let cancelled = false;
    const apiLocale = getCurrentApiLocale();
    const { categories, categoriesLocale } = useCategoryStore.getState();
    const hasCached = categories.length > 0 && categoriesLocale === apiLocale;

    const fetchCategories = async () => {
      if (!hasCached) {
        setLoading(true);
      }

      try {
        const response = await commonApiService.getCategoryTree(0);
        if (cancelled) return;
        const categoryList = Array.isArray(response) ? response : [response];
        setCategories(categoryList);
        setCategoriesLocale(apiLocale);
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
  }, [locale, setCategories, setCategoriesLocale, setLastFetchTime, setLoading]);
}
