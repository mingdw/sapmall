import { parseImageUrls } from '../../../business/products/components/ProductForm.utils';

/** 将相对路径补全为可访问的绝对地址 */
function resolveMediaUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    const base = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:7101').replace(/\/$/, '');
    return `${base}${trimmed}`;
  }
  return trimmed;
}

/** 解析订单快照中的 skuImgs（支持 JSON 数组、JSON 字符串、逗号分隔、纯 URL） */
export function parseOrderSkuImgs(raw?: string): string[] {
  if (!raw?.trim()) return [];

  const trimmed = raw.trim();

  if (trimmed.startsWith('[') || trimmed.startsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => item != null && String(item).trim())
          .map((item) => resolveMediaUrl(String(item)));
      }
      if (typeof parsed === 'string' && parsed.trim()) {
        return [resolveMediaUrl(parsed)];
      }
    } catch {
      // 继续走通用解析
    }
  }

  return parseImageUrls(trimmed).map(resolveMediaUrl).filter(Boolean);
}

export function getFirstOrderSkuImage(raw?: string): string {
  return parseOrderSkuImgs(raw)[0] || '';
}
