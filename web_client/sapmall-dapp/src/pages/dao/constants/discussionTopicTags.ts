import type { DaoDiscussionItem, DaoDiscussionTopicTag } from '../types';

/** 列表行内 / 侧栏标签展示顺序（置顶优先） */
export const DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER: DaoDiscussionTopicTag[] = [
  'pinned',
  'hot',
  'urgent',
  'trendingWeek',
  'official',
  'featured',
  'governance',
  'new',
  'poll',
  'bounty',
  'qa',
  'feedback',
  'resolved',
];

/** 侧栏话题标签筛选（顶部分板块下拉与之独立） */
export const DAO_DISCUSSION_TOPIC_TAG_FILTERS = [
  'all',
  ...DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER,
] as const;

export type DaoDiscussionTopicTagFilter = (typeof DAO_DISCUSSION_TOPIC_TAG_FILTERS)[number];

export const sortDiscussionTopicTags = (tags: DaoDiscussionTopicTag[]): DaoDiscussionTopicTag[] => {
  return [...tags].sort(
    (a, b) =>
      DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER.indexOf(a) -
      DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER.indexOf(b),
  );
};

const getListSortRank = (item: DaoDiscussionItem): number => {
  if (item.tags.length === 0) return 99;
  return Math.min(
    ...item.tags.map((tag) => DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER.indexOf(tag)),
  );
};

/** 默认列表：按标签优先级 → 回复数降序 */
export const sortDiscussionsForList = (list: DaoDiscussionItem[]): DaoDiscussionItem[] => {
  return [...list].sort((a, b) => {
    const rankDiff = getListSortRank(a) - getListSortRank(b);
    if (rankDiff !== 0) return rankDiff;
    return b.replies - a.replies;
  });
};

export const discussionMatchesTopicTagFilter = (
  item: DaoDiscussionItem,
  filter: DaoDiscussionTopicTagFilter,
): boolean => {
  if (filter === 'all') return true;
  return item.tags.includes(filter);
};
