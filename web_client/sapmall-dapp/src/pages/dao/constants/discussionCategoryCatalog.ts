import type { DaoDiscussionCategory } from '../types';

export type DaoDiscussionCategoryIcon = 'flame' | 'store' | 'users';

/** 讨论板块浏览 — 顺序与图标（列表前板块选择） */
export const DAO_DISCUSSION_CATEGORY_CATALOG: ReadonlyArray<{
  category: DaoDiscussionCategory;
  icon: DaoDiscussionCategoryIcon;
}> = [
  { category: 'hot', icon: 'flame' },
  { category: 'marketplace', icon: 'store' },
  { category: 'community', icon: 'users' },
];
