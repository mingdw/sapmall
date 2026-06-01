import { useCallback, useEffect, useState } from 'react';
import { productApiService } from '../../../../services/api/productApiService';
import { orderApi, OrderPreviewResult } from '../../../../services/api/orderApi';
import { parseProductDetailPayload } from '../../product/utils/parseProductDetail';
import { buildSkuSpecText } from '../utils/buildSkuSpecText';
import { resolveProductImageList } from '../../../../utils/productImageUrls';

export function useCheckoutPreview(params: {
  skuId?: number;
  quantity?: number;
  productCode?: string;
}) {
  const [preview, setPreview] = useState<OrderPreviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const skuId = params.skuId;
    const quantity = params.quantity ?? 1;
    const productCode = params.productCode?.trim();

    if (!skuId || quantity < 1) {
      setError('invalid_params');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let unitPrice: number | undefined;
      let productName: string | undefined;
      let imageUrl = '';
      let specText = '';
      let skuCode: string | undefined;

      if (productCode) {
        const raw = await productApiService.getProductDetailRaw({ productCode });
        const product = parseProductDetailPayload(raw);
        if (product) {
          const sku = product.skus.find((s) => s.id === skuId);
          if (sku) {
            unitPrice = sku.price;
            skuCode = sku.skuCode;
            specText = buildSkuSpecText(product, sku);
            productName = product.spu.name;
            const imgs = resolveProductImageList(
              sku.images?.length ? sku.images : product.spu.images,
              product.spu.id || product.spu.code,
              product.spu.category3Code,
            );
            imageUrl = imgs[0] ?? '';
          }
        }
      }

      const result = await orderApi.preview({
        skuId,
        quantity,
        productCode,
        unitPrice,
        productName,
        imageUrl,
        specText,
        skuCode,
      });
      setPreview(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'preview_failed');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }, [params.productCode, params.quantity, params.skuId]);

  useEffect(() => {
    load();
  }, [load]);

  return { preview, loading, error, reload: load };
}
