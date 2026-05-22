/**
 * 大事件列表封面图
 * - 优先：DAO_EVENT_REAL_IMAGE_URLS（Pexels 真实照片直链，需可访问外网）
 * - 失败回退：内嵌 SVG（getDaoEventFallbackImageUrl）
 *
 * 其他可选图源（自行替换 URL）：
 * - Picsum: https://picsum.photos/id/{id}/640/400
 * - Unsplash: https://images.unsplash.com/photo-...?w=640&h=400&fit=crop
 * - 项目静态资源: /dao/events/e1.jpg（放 public/dao/events/）
 */

type EventThumbTheme = {
  from: string;
  to: string;
  accent: string;
  label: string;
};

/** Pexels 免费可商用照片直链（320×200 裁剪） */
export const DAO_EVENT_REAL_IMAGE_URLS: Record<string, string> = {
  e1: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e2: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e3: 'https://images.pexels.com/photos/325521/pexels-photo-325521.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e4: 'https://images.pexels.com/photos/267415/pexels-photo-267415.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e5: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e6: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e7: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e8: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e9: 'https://images.pexels.com/photos/7376/pexels-photo-7376.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e10: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
  e11: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&fit=crop',
};

/** Picsum 备用直链（与 e1–e6 一一对应） */
export const DAO_EVENT_PICSUM_IMAGE_URLS: Record<string, string> = {
  e1: 'https://picsum.photos/id/28/640/400',
  e2: 'https://picsum.photos/id/60/640/400',
  e3: 'https://picsum.photos/id/106/640/400',
  e4: 'https://picsum.photos/id/119/640/400',
  e5: 'https://picsum.photos/id/160/640/400',
  e6: 'https://picsum.photos/id/180/640/400',
  e7: 'https://picsum.photos/id/201/640/400',
  e8: 'https://picsum.photos/id/225/640/400',
  e9: 'https://picsum.photos/id/239/640/400',
  e10: 'https://picsum.photos/id/248/640/400',
  e11: 'https://picsum.photos/id/257/640/400',
};

const EVENT_THUMB_THEMES: Record<string, EventThumbTheme> = {
  e1: { from: '#4f46e5', to: '#7c3aed', accent: '#c4b5fd', label: 'AMA' },
  e2: { from: '#d97706', to: '#f59e0b', accent: '#fde68a', label: 'Grant' },
  e3: { from: '#047857', to: '#10b981', accent: '#6ee7b7', label: 'Milestone' },
  e4: { from: '#6d28d9', to: '#8b5cf6', accent: '#ddd6fe', label: 'News' },
  e5: { from: '#1d4ed8', to: '#3b82f6', accent: '#93c5fd', label: 'AMA' },
  e6: { from: '#b45309', to: '#ea580c', accent: '#fcd34d', label: 'Grant' },
  e7: { from: '#047857', to: '#10b981', accent: '#6ee7b7', label: 'Milestone' },
  e8: { from: '#6d28d9', to: '#8b5cf6', accent: '#ddd6fe', label: 'News' },
  e9: { from: '#1d4ed8', to: '#3b82f6', accent: '#93c5fd', label: 'AMA' },
  e10: { from: '#d97706', to: '#f59e0b', accent: '#fde68a', label: 'Grant' },
  e11: { from: '#6d28d9', to: '#8b5cf6', accent: '#ddd6fe', label: 'News' },
};

const buildEventThumbSvg = (theme: EventThumbTheme): string => {
  const { from, to, accent, label } = theme;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" fill="url(#bg)"/>
  <circle cx="260" cy="48" r="56" fill="${accent}" opacity="0.22"/>
  <circle cx="48" cy="168" r="40" fill="${accent}" opacity="0.16"/>
  <rect x="20" y="20" width="72" height="8" rx="4" fill="rgba(255,255,255,0.35)"/>
  <rect x="20" y="36" width="48" height="6" rx="3" fill="rgba(255,255,255,0.22)"/>
  <text x="160" y="112" text-anchor="middle" fill="rgba(255,255,255,0.95)" font-size="26" font-weight="700" font-family="system-ui,-apple-system,Segoe UI,sans-serif">${label}</text>
</svg>`;
};

/** 外链失败时的本地 SVG 占位 */
export const getDaoEventFallbackImageUrl = (eventId: string): string => {
  const theme = EVENT_THUMB_THEMES[eventId] ?? {
    from: '#334155',
    to: '#64748b',
    accent: '#cbd5e1',
    label: eventId.toUpperCase(),
  };
  const svg = buildEventThumbSvg(theme);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/** 列表封面主图：真实照片 URL */
export const getDaoEventMockImageUrl = (eventId: string): string =>
  DAO_EVENT_REAL_IMAGE_URLS[eventId] ?? getDaoEventFallbackImageUrl(eventId);
