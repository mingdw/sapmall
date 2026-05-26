import type { DaoDiscussionTopicTag } from '../types';

/** 用户发帖可选话题标签（不含版主标签） */
export const DAO_DISCUSSION_CREATE_TAG_OPTIONS: DaoDiscussionTopicTag[] = [
  'hot',
  'governance',
  'poll',
  'bounty',
  'qa',
  'feedback',
];

export const DAO_DISCUSSION_CREATE_MAX_TAGS = 3;
