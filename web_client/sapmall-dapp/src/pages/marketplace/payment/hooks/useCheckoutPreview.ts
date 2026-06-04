import { useCallback, useEffect, useRef, useState } from 'react';
import { productApiService } from '../../../../services/api/productApiService';
import { orderApi, OrderPreviewResult } from '../../../../services/api/orderApi';
import { parseProductDetailPayload } from '../../product/utils/parseProductDetail';
import { buildSkuSpecText } from '../utils/buildSkuSpecText';
import {
  resolvePrimaryProductImage,
  resolveProductImageUrl,
} from '../../../../utils/productImageUrls';
import { truncateProductBrief } from '../utils/truncateBrief';
import {
  buildCheckoutPromotionItems,
  sumPromotionAmount,
} from '../utils/buildCheckoutPromotionItems';

type ProductPreviewMeta = {
  unitPrice?: number;
  unitRealPrice?: number;
  productName?: string;
  productBrief?: string;
  imageUrl: string;
  specText: string;
  skuCode?: string;
};

export function useCheckoutPreview(params: {
  skuId?: number;
  quantity?: number;
  productCode?: string;
}) {
  const [preview, setPreview] = useState<OrderPreviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPreviewRef = useRef(false);
  const productMetaCacheRef = useRef<{ key: string; meta: ProductPreviewMeta } | null>(null);

  const load = useCallback(async () => {
    const skuId = params.skuId;
    const quantity = params.quantity ?? 1;
    const productCode = params.productCode?.trim();

    if (!skuId || quantity < 1) {
      setError('invalid_params');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const isRefresh = hasPreviewRef.current;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      let unitPrice: number | undefined;
      let unitRealPrice: number | undefined;
      let productName: string | undefined;
      let productBrief: string | undefined;
      let imageUrl = '';
      let specText = '';
      let skuCode: string | undefined;
      let imageSeed: string | number = skuId;
      let category3: string | undefined;

      if (productCode) {
        const cacheKey = `${productCode}:${skuId}`;
        const cached = productMetaCacheRef.current;
        if (cached?.key === cacheKey) {
          ({
            unitPrice,
            unitRealPrice,
            productName,
            productBrief,
            imageUrl,
            specText,
            skuCode,
          } = cached.meta);
        } else {
          const raw = await productApiService.getProductDetailRaw({ productCode });
          const product = parseProductDetailPayload(raw);
          if (product) {
            const sku = product.skus.find((s) => s.id === skuId);
            if (sku) {
              unitPrice = sku.price;
              unitRealPrice =
                product.spu.realPrice > sku.price ? product.spu.realPrice : sku.price;
              skuCode = sku.skuCode;
              specText = buildSkuSpecText(product, sku);
              productName = product.spu.name;
              productBrief = truncateProductBrief(product.spu.description);
              imageSeed = product.spu.id || product.spu.code;
              category3 = product.spu.category3Code;
              imageUrl = resolvePrimaryProductImage(
                product.spu.images,
                sku.images,
                imageSeed,
                category3,
              );
              productMetaCacheRef.current = {
                key: cacheKey,
                meta: {
                  unitPrice,
                  unitRealPrice,
                  productName,
                  productBrief,
                  imageUrl,
                  specText,
                  skuCode,
                },
              };
            }
          }
        }
      }

      const result = await orderApi.preview({
        skuId,
        quantity,
        productCode,
        unitPrice,
        productName,
        productBrief,
        imageUrl,
        specText,
        skuCode,
      });

      if (result.items[0]) {
        if (productName) result.items[0].productName = productName;
        if (productBrief) result.items[0].productBrief = productBrief;
        if (specText) result.items[0].specText = specText;
        if (skuCode) result.items[0].skuCode = skuCode;
        const seed = imageSeed || result.items[0].skuId;
        result.items[0].imageUrl = resolveProductImageUrl(
          imageUrl || result.items[0].imageUrl,
          seed,
          category3,
        );
      }

      const saleSubtotal = result.totalAmount;
      const listUnit =
        unitRealPrice != null && unitPrice != null && unitRealPrice > unitPrice
          ? unitRealPrice
          : undefined;
      const listAmount = listUnit != null ? listUnit * quantity : undefined;

      // 结算层促销（平台 0.5% + 新品 0.3% + 优惠券 1U），与标价→售价差额分开
      const hasCheckoutPromos = listAmount != null && saleSubtotal > 0;
      const promotions = hasCheckoutPromos ? buildCheckoutPromotionItems(saleSubtotal) : [];
      const checkoutPromoTotal = sumPromotionAmount(promotions);
      const payableTotal = Math.max(0, saleSubtotal - checkoutPromoTotal);

      setPreview({
        ...result,
        saleSubtotal,
        listAmount,
        totalAmount: payableTotal,
        originalAmount: listAmount,
        discountAmount: checkoutPromoTotal > 0 ? checkoutPromoTotal : undefined,
        promotions: promotions.length > 0 ? promotions : undefined,
        promotionLabel: undefined,
      });
      hasPreviewRef.current = true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'preview_failed');
      if (!hasPreviewRef.current) {
        setPreview(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params.productCode, params.quantity, params.skuId]);

  useEffect(() => {
    productMetaCacheRef.current = null;
    hasPreviewRef.current = false;
  }, [params.skuId, params.productCode]);

  useEffect(() => {
    load();
  }, [load]);

  return { preview, loading, refreshing, error, reload: load };
}
