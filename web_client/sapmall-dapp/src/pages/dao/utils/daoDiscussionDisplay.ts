import type { TFunction } from 'i18next';
import type { DaoDiscussionDetail, DaoDiscussionItem } from '../types';

export const getDiscussionTitle = (
  discussion: Pick<DaoDiscussionItem, 'titleKey' | 'userContent'>,
  t: TFunction,
): string => discussion.userContent?.title ?? t(discussion.titleKey);

export const getDiscussionExcerpt = (
  discussion: Pick<DaoDiscussionItem, 'excerptKey' | 'userContent'>,
  t: TFunction,
): string => discussion.userContent?.excerpt ?? t(discussion.excerptKey);

export const getDiscussionChannel = (
  discussion: Pick<DaoDiscussionItem, 'channelKey' | 'category'>,
  t: TFunction,
): string => {
  if (discussion.channelKey.startsWith('dao.discussionCreate.channels.')) {
    return t(discussion.channelKey);
  }
  return t(discussion.channelKey);
};

export const formatDiscussionActivity = (
  discussion: Pick<DaoDiscussionDetail, 'activityKey' | 'createdAt'>,
  locale: string,
  t: TFunction,
): string => {
  if (!discussion.createdAt) return t(discussion.activityKey);
  const diffMs = Date.now() - discussion.createdAt;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return locale.startsWith('zh') ? '刚刚' : 'Just now';
  if (minutes < 60) return locale.startsWith('zh') ? `${minutes} 分钟前` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return locale.startsWith('zh') ? `${hours} 小时前` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return locale.startsWith('zh') ? `${days} 天前` : `${days}d ago`;
  return locale.startsWith('zh') ? '本周活跃' : 'Active this week';
};
