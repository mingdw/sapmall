import { CategoryTreeResp } from '../../../../services/types/categoryTypes';
import { findCategoryById } from '../../utils/categoryUtils';
import { ProductSpuView } from '../types/productDetailTypes';

export interface ProductBreadcrumbItem {
  label: string;
  /** null 表示首页（全部商品）；有值表示按该分类筛选 */
  categoryId: number | null;
  clickable: boolean;
}

function appendCategoryLevel(
  items: ProductBreadcrumbItem[],
  categories: CategoryTreeResp[],
  categoryId: number,
  categoryCode: string
): void {
  if (!categoryId || categoryId <= 0) return;
  const matched = findCategoryById(categories, categoryId);
  const label = matched?.name || categoryCode;
  if (!label) return;
  items.push({
    label,
    categoryId,
    clickable: true,
  });
}

export function buildProductBreadcrumbItems(
  spu: ProductSpuView,
  categories: CategoryTreeResp[],
  homeLabel: string
): ProductBreadcrumbItem[] {
  const items: ProductBreadcrumbItem[] = [
    { label: homeLabel, categoryId: null, clickable: true },
  ];

  appendCategoryLevel(items, categories, spu.category1Id, spu.category1Code);
  appendCategoryLevel(items, categories, spu.category2Id, spu.category2Code);
  appendCategoryLevel(items, categories, spu.category3Id, spu.category3Code);

  items.push({
    label: spu.name,
    categoryId: null,
    clickable: false,
  });

  return items;
}
