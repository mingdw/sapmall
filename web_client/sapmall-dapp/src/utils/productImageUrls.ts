/**
 * 商品展示用免费样例图（已验证可访问）
 * - picsum 直链 .jpg（避免 seed 重定向偶发失败）
 * - loremflickr 按 lock 固定图片
 * - 少量 Unsplash / Pexels 直链
 */

const VERIFIED_UNSPLASH = [
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1561070791-252531792412?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1558655812-973e6220a4b8?auto=format&fit=crop&w=800&q=80',
];

const PEXELS_SAMPLES = [
  'https://images.pexels.com/photos/11035371/pexels-photo-11035371.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
];

/** loremflickr 分类标签 */
const FLICKR_TAGS: Record<string, string> = {
  '111000': 'abstract,art',
  '112000': 'music,concert',
  '113000': 'digital,technology',
  '114000': 'book,writing',
  '121000': 'portrait,people',
  '122000': 'character,cosplay',
  '123000': 'social,network',
  '131000': 'game,video',
  '132000': 'technology,gaming',
  '133000': 'fantasy,character',
  '134000': 'game,design',
  '135000': 'animal,pet',
  '136000': 'architecture,city',
  '137000': 'car,vehicle',
  '138000': 'space,future',
  '211000': 'design,graphic',
  '212000': 'template,design',
  '213000': 'icon,digital',
  '311000': 'education,book',
  '312000': 'classroom,learning',
};

const DEFAULT_FLICKR_TAG = 'digital,abstract';

function hashSeed(seed: string | number): number {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** picsum 直链（id 10–99，稳定返回 jpg） */
export function picsumDirectUrl(seed: string | number): string {
  const n = 10 + (hashSeed(seed) % 90);
  return `https://picsum.photos/id/${n}/800/600.jpg`;
}

export function loremFlickrUrl(seed: string | number, category3?: string): string {
  const tags = (category3 && FLICKR_TAGS[category3]) || DEFAULT_FLICKR_TAG;
  const lock = hashSeed(seed) % 10000;
  return `https://loremflickr.com/800/600/${tags}/all?lock=${lock}`;
}

export function dummyImageUrl(seed: string | number, label = 'NFT'): string {
  const hues = ['312e81', '1e3a5f', '4c1d95', '134e4a', '7c2d12'];
  const accent = ['c4b5fd', '7dd3fc', 'f0abfc', '5eead4', 'fdba74'];
  const i = hashSeed(seed) % hues.length;
  const text = encodeURIComponent(label.slice(0, 12));
  return `https://dummyimage.com/800x600/${hues[i]}/${accent[i]}.png&text=${text}`;
}

/** 按商品生成主图 URL（写入数据库 / 前端兜底） */
export function buildSampleProductImageUrl(
  seed: string | number,
  category3?: string,
): string {
  const h = hashSeed(`${category3 ?? ''}-${seed}`);
  const mode = h % 5;
  if (mode === 0) return picsumDirectUrl(seed);
  if (mode === 1) return loremFlickrUrl(seed, category3);
  if (mode === 2) return VERIFIED_UNSPLASH[h % VERIFIED_UNSPLASH.length];
  if (mode === 3) return PEXELS_SAMPLES[h % PEXELS_SAMPLES.length];
  return dummyImageUrl(seed, 'SAP');
}

const TRUSTED_HOST =
  /(?:^|\/\/)(?:[^/]+\.)?(?:sap01-1251895040\.cos\.|picsum\.photos|loremflickr\.com|dummyimage\.com|placehold\.co|images\.pexels\.com)/i;

const BLOCKED_HOST = /example\.com|via\.placeholder/i;

const BLOCKED_UNSPLASH = /images\.unsplash\.com/i;

const BLOCKED_PICSUM_SEED = /picsum\.photos\/seed\//i;

export function isTrustedProductImageUrl(url: string): boolean {
  if (!url?.startsWith('http')) return false;
  if (BLOCKED_HOST.test(url)) return false;
  if (BLOCKED_UNSPLASH.test(url)) return false;
  if (BLOCKED_PICSUM_SEED.test(url)) return false;
  if (VERIFIED_UNSPLASH.includes(url)) return true;
  return TRUSTED_HOST.test(url);
}

export function resolveProductImageUrl(
  images: string[] | string | undefined,
  seed: string | number,
  category3?: string,
): string {
  return resolveProductImageList(images, seed, category3)[0];
}

/** 主图：优先 SKU 可信图，否则 SPU 图（与商品详情 gallery 一致） */
export function resolvePrimaryProductImage(
  spuImages: string[] | undefined,
  skuImages: string[] | undefined,
  seed: string | number,
  category3?: string,
): string {
  const skuTrusted = (skuImages ?? []).filter((url) => isTrustedProductImageUrl(url));
  if (skuTrusted.length) return skuTrusted[0];
  return resolveProductImageList(spuImages, seed, category3)[0] ?? buildSampleProductImageUrl(seed, category3);
}

/** 解析商品图列表：过滤无效 URL，至少返回 1 张可用图 */
export function resolveProductImageList(
  images: string[] | string | undefined,
  seed: string | number,
  category3?: string,
): string[] {
  const list = Array.isArray(images)
    ? images
    : typeof images === 'string'
      ? images.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

  const trusted = list.filter((url) => isTrustedProductImageUrl(url));
  if (trusted.length) return trusted;

  return [buildSampleProductImageUrl(seed, category3)];
}
