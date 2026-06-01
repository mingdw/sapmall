import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProductDetailView, ProductSkuView } from '../types/productDetailTypes';

function generateIndexs(
  selectedSpecs: Record<string, string>,
  specKeys: string[],
  specifications: Record<string, string[]>
): string {
  return specKeys
    .map((key) => {
      const values = specifications[key] || [];
      const selected = selectedSpecs[key];
      const index = values.indexOf(selected);
      return index === -1 ? 0 : index;
    })
    .join('_');
}

/** SKU indexs 与所选规格是否一致（兼容 indexs 维度少于规格维度，如仅 "0" / "1"） */
function skuMatchesSelectedSpecs(
  sku: ProductSkuView,
  selectedSpecs: Record<string, string>,
  specKeys: string[],
  specifications: Record<string, string[]>
): boolean {
  if (!sku.indexs) return true;
  const parts = sku.indexs.split('_').map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n))) return false;

  return parts.every((partIdx, i) => {
    const key = specKeys[i];
    if (!key) return true;
    const values = specifications[key] || [];
    const selected = selectedSpecs[key];
    if (!selected) return false;
    return values[partIdx] === selected;
  });
}

/** 用 SKU 标题兜底：多 SKU 但 indexs 与规格维度不一致时常见 */
function findSkuByTitleHints(
  skus: ProductSkuView[],
  selectedSpecs: Record<string, string>,
  specKeys: string[],
): ProductSkuView | null {
  const labels = specKeys.map((k) => selectedSpecs[k]?.trim()).filter(Boolean) as string[];
  if (!labels.length) return null;

  const matched = skus.filter((sku) => {
    const title = (sku.title ?? '').trim();
    if (!title) return false;
    return labels.every((label) => title.includes(label));
  });
  if (matched.length === 1) return matched[0];
  if (matched.length > 1) {
    return matched.find((s) => s.stock > 0) ?? matched[0];
  }
  return null;
}

function pickDefaultSku(skus: ProductSkuView[]): ProductSkuView | null {
  if (!skus.length) return null;
  const inStock = skus.find((s) => s.stock > 0);
  if (inStock) return inStock;
  if (skus.length === 1) return skus[0];
  return skus.reduce((prev, cur) =>
    (cur.saleCount ?? 0) > (prev.saleCount ?? 0) ? cur : prev
  );
}

function findSkuBySpecs(
  skus: ProductSkuView[],
  selectedSpecs: Record<string, string>,
  specKeys: string[],
  specifications: Record<string, string[]>
): ProductSkuView | null {
  if (!skus.length) return null;
  if (!specKeys.length) return pickDefaultSku(skus);
  if (skus.length === 1) return skus[0];

  const indexs = generateIndexs(selectedSpecs, specKeys, specifications);
  const exact = skus.find((s) => s.indexs === indexs);
  if (exact) return exact;

  const partial = skus.find((s) => skuMatchesSelectedSpecs(s, selectedSpecs, specKeys, specifications));
  if (partial) return partial;

  const byTitle = findSkuByTitleHints(skus, selectedSpecs, specKeys);
  if (byTitle) return byTitle;

  return null;
}

function isResolvedSku(sku: ProductSkuView | null): sku is ProductSkuView {
  if (!sku) return false;
  return sku.id > 0 || Boolean(sku.skuCode?.trim());
}

function getActiveSpecKeys(specifications: Record<string, string[]>): string[] {
  return Object.keys(specifications).filter((k) => (specifications[k]?.length ?? 0) > 0);
}

/** 在已选其它维度前提下，SKU 是否覆盖 partialSpecs 中已填写的规格值 */
function skuMatchesPartialSpecs(
  sku: ProductSkuView,
  partialSpecs: Record<string, string>,
  specKeys: string[],
  specifications: Record<string, string[]>
): boolean {
  const requiredKeys = specKeys.filter((k) => Boolean(partialSpecs[k]?.trim()));
  if (!requiredKeys.length) return true;

  for (const key of requiredKeys) {
    const selected = partialSpecs[key]!.trim();
    const values = specifications[key] || [];
    const dimIdx = specKeys.indexOf(key);
    let matched = false;

    if (sku.indexs) {
      const parts = sku.indexs.split('_').map((p) => Number(p));
      if (!parts.some((n) => Number.isNaN(n))) {
        const partIdx = parts[dimIdx];
        if (partIdx !== undefined && values[partIdx] === selected) {
          matched = true;
        }
      }
    }
    if (!matched && (sku.title ?? '').includes(selected)) {
      matched = true;
    }
    if (!matched) return false;
  }
  return true;
}

/** 是否存在 SKU 与「当前其它维度选型 + 本按钮规格值」兼容 */
export function isSpecValueAvailable(
  skus: ProductSkuView[],
  specKey: string,
  value: string,
  selectedSpecs: Record<string, string>,
  specKeys: string[],
  specifications: Record<string, string[]>
): boolean {
  if (!skus.length) return false;
  const trial = { ...selectedSpecs, [specKey]: value };
  return skus.some((sku) =>
    skuMatchesPartialSpecs(sku, trial, specKeys, specifications)
  );
}

function buildInitialSpecs(
  skus: ProductSkuView[],
  keys: string[],
  specs: Record<string, string[]>
): Record<string, string> {
  const initial: Record<string, string> = {};
  for (const k of keys) {
    const values = specs[k] || [];
    const found = values.find((v) =>
      isSpecValueAvailable(skus, k, v, initial, keys, specs)
    );
    if (found) initial[k] = found;
  }
  return initial;
}

export function useSkuMatrix(product: ProductDetailView | null) {
  const specKeys = useMemo(
    () => getActiveSpecKeys(product?.specifications ?? {}),
    [product?.specifications]
  );

  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [selectedSku, setSelectedSku] = useState<ProductSkuView | null>(null);

  useEffect(() => {
    if (!product) {
      setSelectedSpecs({});
      setSelectedSku(null);
      return;
    }

    const specs = product.specifications;
    const keys = getActiveSpecKeys(specs);
    let initial = buildInitialSpecs(product.skus, keys, specs);

    const defaultSku = pickDefaultSku(product.skus);

    if (defaultSku?.indexs && keys.length) {
      const fromSku: Record<string, string> = {};
      const parts = defaultSku.indexs.split('_').map(Number);
      keys.forEach((key, i) => {
        const values = specs[key];
        if (values && typeof parts[i] === 'number' && values[parts[i]]) {
          fromSku[key] = values[parts[i]];
        }
      });
      if (
        keys.every((key) =>
          fromSku[key]
            ? isSpecValueAvailable(
                product.skus,
                key,
                fromSku[key],
                fromSku,
                keys,
                specs
              )
            : true
        )
      ) {
        initial = fromSku;
      }
    }

    setSelectedSpecs(initial);
    setSelectedSku(findSkuBySpecs(product.skus, initial, keys, specs) ?? defaultSku ?? null);
  }, [product]);

  const checkSpecValueAvailable = useCallback(
    (specKey: string, value: string) => {
      if (!product) return false;
      return isSpecValueAvailable(
        product.skus,
        specKey,
        value,
        selectedSpecs,
        specKeys,
        product.specifications
      );
    },
    [product, selectedSpecs, specKeys]
  );

  const onSelectSpec = useCallback(
    (specKey: string, value: string) => {
      if (!product) return;
      if (
        !isSpecValueAvailable(
          product.skus,
          specKey,
          value,
          selectedSpecs,
          specKeys,
          product.specifications
        )
      ) {
        return;
      }
      setSelectedSpecs((prev) => {
        const next = { ...prev, [specKey]: value };
        const sku =
          findSkuBySpecs(product.skus, next, specKeys, product.specifications) ??
          findSkuBySpecs(product.skus, prev, specKeys, product.specifications) ??
          pickDefaultSku(product.skus);
        setSelectedSku(sku);
        return next;
      });
    },
    [product, specKeys, selectedSpecs]
  );

  const allSpecsSelected =
    specKeys.length === 0 ||
    specKeys.every((k) => Boolean(selectedSpecs[k]?.trim()));

  const effectiveStock =
    selectedSku?.stock ?? product?.spu.totalStock ?? 0;

  const hasSku = isResolvedSku(selectedSku);

  const canPurchase = Boolean(hasSku && allSpecsSelected && effectiveStock > 0);

  const purchaseBlockReason: 'spec' | 'stock' | null = !canPurchase
    ? !hasSku || !allSpecsSelected
      ? 'spec'
      : 'stock'
    : null;

  return {
    specKeys,
    selectedSpecs,
    selectedSku,
    onSelectSpec,
    isSpecValueAvailable: checkSpecValueAvailable,
    allSpecsSelected,
    canPurchase,
    purchaseBlockReason,
  };
}
