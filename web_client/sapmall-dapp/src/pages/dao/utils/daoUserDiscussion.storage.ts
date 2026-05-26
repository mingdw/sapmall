import type {
  DaoDiscussionCategory,
  DaoDiscussionDetail,
  DaoDiscussionDetailBlock,
  DaoDiscussionDraft,
  DaoDiscussionItem,
  DaoDiscussionTopicTag,
  DaoDiscussionUserContent,
} from '../types';
import { isHtmlContent } from './richText';

const STORAGE_KEY = 'sapmall-dao-user-discussions';

export type DaoUserDiscussionRecord = {
  id: string;
  authorAddress: string;
  createdAt: number;
  title: string;
  excerpt: string;
  category: DaoDiscussionCategory;
  tags: DaoDiscussionTopicTag[];
  body: string;
  referenceLink?: string;
};

type Store = DaoUserDiscussionRecord[];

const readStore = (): Store => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Store;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStore = (store: Store): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const channelKeyForCategory = (category: DaoDiscussionCategory): string =>
  `dao.discussionCreate.channels.${category}`;

const bodyToBlocks = (body: string): DaoDiscussionDetailBlock[] => {
  const trimmed = body.trim();
  if (!trimmed) return [{ type: 'paragraph', text: '' }];
  if (isHtmlContent(trimmed)) {
    return [{ type: 'html', html: trimmed }];
  }
  const chunks = trimmed
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return chunks.map((text) => ({ type: 'paragraph' as const, text }));
};

const toUserContent = (record: DaoUserDiscussionRecord): DaoDiscussionUserContent => ({
  title: record.title,
  excerpt: record.excerpt,
});

export const getUserDiscussionRecords = (): DaoUserDiscussionRecord[] =>
  readStore().sort((a, b) => b.createdAt - a.createdAt);

export const getUserDiscussionRecord = (id: string): DaoUserDiscussionRecord | undefined =>
  readStore().find((r) => r.id === id);

export const userRecordToListItem = (record: DaoUserDiscussionRecord): DaoDiscussionItem => ({
  id: record.id,
  titleKey: '',
  channelKey: channelKeyForCategory(record.category),
  excerptKey: '',
  category: record.category,
  replies: 0,
  views: 1,
  tags: record.tags.includes('new') ? record.tags : ['new', ...record.tags],
  userContent: toUserContent(record),
  createdAt: record.createdAt,
});

export const userRecordToDetail = (record: DaoUserDiscussionRecord): DaoDiscussionDetail => {
  const blocks = bodyToBlocks(record.body);
  if (record.referenceLink?.trim()) {
    blocks.push({
      type: 'callout',
      variant: 'info',
      text: record.referenceLink.trim(),
    });
  }

  return {
    ...userRecordToListItem(record),
    authorAddress: record.authorAddress,
    activityKey: 'dao.discussionDetail.userPosted',
    createdAt: record.createdAt,
    blocks,
  };
};

export const publishUserDiscussion = (
  authorAddress: string,
  draft: DaoDiscussionDraft,
): DaoUserDiscussionRecord => {
  const record: DaoUserDiscussionRecord = {
    id: `user-d-${Date.now()}`,
    authorAddress,
    createdAt: Date.now(),
    title: draft.title.trim(),
    excerpt: draft.excerpt.trim(),
    category: draft.category,
    tags: draft.tags,
    body: draft.body.trim(),
    referenceLink: draft.referenceLink.trim() || undefined,
  };
  writeStore([record, ...readStore()]);
  return record;
};
