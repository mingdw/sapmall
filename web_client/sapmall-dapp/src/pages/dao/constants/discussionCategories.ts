import type { DaoDiscussionCategory, DaoDiscussionCategoryFilter, DaoDiscussionItem } from '../types';

/** 讨论板块下拉选项 */
export const DAO_DISCUSSION_CATEGORY_FILTERS: DaoDiscussionCategoryFilter[] = [
  'all',
  'hot',
  'marketplace',
  'community',
];

export const discussionMatchesCategoryFilter = (
  item: DaoDiscussionItem,
  filter: DaoDiscussionCategoryFilter,
): boolean => {
  if (filter === 'all') return true;
  return item.category === filter;
};
