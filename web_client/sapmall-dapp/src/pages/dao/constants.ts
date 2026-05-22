import type { DaoHeroDimension } from './types';

/** Discord 社区（占位，上线前替换） */
export const DAO_DISCORD_URL = 'https://discord.gg/sapmall';

/** Hero 维度背景图（可替换为 /public/dao/hero/*.webp） */
export const DAO_HERO_BACKGROUNDS: Record<DaoHeroDimension, string> = {
  discussions:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
  proposals:
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
  events:
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80',
};

/** 外链图加载失败时的备用图 */
export const DAO_HERO_BACKGROUNDS_FALLBACK: Record<DaoHeroDimension, string> = {
  discussions: 'https://picsum.photos/seed/sapmall-dao-discussions/1600/900',
  proposals: 'https://picsum.photos/seed/sapmall-dao-proposals/1600/900',
  events: 'https://picsum.photos/seed/sapmall-dao-events/1600/900',
};

/** 下区叠入 Hero 的上移量（部分叠层） */
export const DAO_OVERLAP_PX = 48;

/** 列表每页条数 */
export const DAO_PAGE_SIZE = 10;

export {
  DAO_EVENT_PICSUM_IMAGE_URLS,
  DAO_EVENT_REAL_IMAGE_URLS,
  getDaoEventFallbackImageUrl,
  getDaoEventMockImageUrl,
} from './utils/daoEventThumb';
