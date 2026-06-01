import { ProductDetailView, ProductSkuView } from '../../product/types/productDetailTypes';

/** 根据 SKU indexs 与规格表生成可读规格文案 */
export function buildSkuSpecText(product: ProductDetailView, sku: ProductSkuView): string {
  const specKeys = Object.keys(product.specifications);
  if (!specKeys.length) {
    return sku.title?.trim() || sku.skuCode || '';
  }

  if (!sku.indexs) {
    return sku.title?.trim() || specKeys.map((k) => product.saleAttrs[k]).filter(Boolean).join(' · ') || sku.skuCode;
  }

  const parts = sku.indexs.split('_').map((v) => Number(v));
  const labels: string[] = [];

  specKeys.forEach((key, i) => {
    const values = product.specifications[key] || [];
    const idx = parts[i];
    const value = Number.isFinite(idx) && values[idx] != null ? values[idx] : null;
    if (value) labels.push(`${key}: ${value}`);
  });

  return labels.length ? labels.join(' · ') : sku.skuCode;
}
