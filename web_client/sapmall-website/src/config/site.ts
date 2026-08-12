/** 官网生产域名与 SEO 绝对 URL 工具 */

const DEFAULT_SITE_URL = 'https://sapmall.xyz';

/** 站点根地址（无尾斜杠），可由 REACT_APP_SITE_URL 覆盖 */
export const SITE_URL = (
  process.env.REACT_APP_SITE_URL || DEFAULT_SITE_URL
).replace(/\/$/, '');

/** 将站内路径转为绝对 URL */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${normalized}`;
}
