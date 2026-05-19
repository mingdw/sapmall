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

function findSkuBySpecs(
  skus: ProductSkuView[],
  selectedSpecs: Record<string, string>,
  specKeys: string[],
  specifications: Record<string, string[]>
): ProductSkuView | null {
  if (!skus.length) return null;
  if (!specKeys.length) return skus[0];

  const indexs = generateIndexs(selectedSpecs, specKeys, specifications);
  const matched = skus.find((s) => s.indexs === indexs);
  if (matched) return matched;

  return skus.find((s) => {
    if (!s.indexs) return true;
    const parts = s.indexs.split('_').map(Number);
    return specKeys.every((key, i) => {
      const values = specifications[key];
      const selected = selectedSpecs[key];
      return values[parts[i]] === selected;
    });
  }) ?? null;
}

export function useSkuMatrix(product: ProductDetailView | null) {
  const specKeys = useMemo(
    () => Object.keys(product?.specifications ?? {}),
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
    const keys = Object.keys(specs);
    const initial: Record<string, string> = {};
    keys.forEach((k) => {
      if (specs[k]?.length) initial[k] = specs[k][0];
    });

    let defaultSku = product.skus[0] ?? null;
    if (product.skus.length > 1) {
      defaultSku = product.skus.reduce((prev, cur) =>
        (cur.saleCount ?? 0) > (prev.saleCount ?? 0) ? cur : prev
      );
    }

    if (defaultSku?.indexs && keys.length) {
      const parts = defaultSku.indexs.split('_').map(Number);
      keys.forEach((key, i) => {
        const values = specs[key];
        if (values && typeof parts[i] === 'number' && values[parts[i]]) {
          initial[key] = values[parts[i]];
        }
      });
    }

    setSelectedSpecs(initial);
    setSelectedSku(findSkuBySpecs(product.skus, initial, keys, specs) ?? defaultSku);
  }, [product]);

  const onSelectSpec = useCallback(
    (specKey: string, value: string) => {
      if (!product) return;
      setSelectedSpecs((prev) => {
        const next = { ...prev, [specKey]: value };
        const sku = findSkuBySpecs(product.skus, next, specKeys, product.specifications);
        setSelectedSku(sku);
        return next;
      });
    },
    [product, specKeys]
  );

  const allSpecsSelected = specKeys.every((k) => selectedSpecs[k]);
  const canPurchase = Boolean(selectedSku && selectedSku.stock > 0 && allSpecsSelected);

  return {
    specKeys,
    selectedSpecs,
    selectedSku,
    onSelectSpec,
    allSpecsSelected,
    canPurchase,
  };
}
