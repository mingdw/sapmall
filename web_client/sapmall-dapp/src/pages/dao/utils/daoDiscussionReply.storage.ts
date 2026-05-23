import type { DaoDiscussionReplyItem } from '../types';

const STORAGE_KEY = 'sapmall-dao-discussion-replies';

type ReplyStore = Record<string, DaoDiscussionReplyItem[]>;

const readStore = (): ReplyStore => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ReplyStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (store: ReplyStore): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const getUserDiscussionReplies = (discussionId: string): DaoDiscussionReplyItem[] => {
  const store = readStore();
  return store[discussionId] ?? [];
};

export const addUserDiscussionReply = (
  discussionId: string,
  authorAddress: string,
  body: string,
): DaoDiscussionReplyItem => {
  const store = readStore();
  const reply: DaoDiscussionReplyItem = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    authorAddress,
    body: body.trim(),
    createdAt: Date.now(),
    likes: 0,
  };
  store[discussionId] = [...(store[discussionId] ?? []), reply];
  writeStore(store);
  return reply;
};
