import { ProductSpuView } from '../types/productDetailTypes';

const TAG_POOL = ['热门', '精品', '限时优惠'];

/** TODO: 从 getProductDetails 营销字段解析；当前 mock */
export function resolveMarketingTags(spu: ProductSpuView): string[] {
  const tags: string[] = [];
  if (spu.totalSales > 500) tags.push(TAG_POOL[0]);
  if (spu.status === 1) tags.push(TAG_POOL[1]);
  if (spu.realPrice > spu.price) tags.push(TAG_POOL[2]);
  return tags.length ? tags : [TAG_POOL[1]];
}
