import { useCallback, useEffect, useState } from 'react';
import { productApiService } from '../../../../services/api/productApiService';
import { Product } from '../../../../services/types/productTypes';
import { ProductDetailView } from '../types/productDetailTypes';
import { parseProductDetailPayload } from '../utils/parseProductDetail';

export function useProductDetail(productCode: string | undefined) {
  const [product, setProduct] = useState<ProductDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const code = productCode?.trim();
    if (!code) {
      setError('缺少商品编码');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const raw = await productApiService.getProductDetailRaw({ productCode: code });
      const parsed = parseProductDetailPayload(raw);
      if (!parsed) {
        throw new Error('商品详情解析失败');
      }
      setProduct(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productCode]);

  useEffect(() => {
    load();
  }, [load]);

  return { product, loading, error, reload: load };
}

export function useRelatedProducts(
  category1Code: string | undefined,
  excludeCode: string | undefined
) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category1Code) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const resp = await productApiService.getProducts({
          categoryCodes: category1Code,
          page: 1,
          pageSize: 12,
        });
        if (cancelled) return;
        const filtered = resp.products.filter((p) => p.code !== excludeCode).slice(0, 10);
        setItems(filtered);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category1Code, excludeCode]);

  return { items, loading };
}
