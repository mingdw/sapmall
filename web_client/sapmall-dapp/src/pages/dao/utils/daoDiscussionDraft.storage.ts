import type { DaoDiscussionDraft } from '../types';

const STORAGE_KEY = 'sapmall-dao-discussion-draft';

const defaultDraft = (): DaoDiscussionDraft => ({
  title: '',
  excerpt: '',
  category: 'hot',
  tags: [],
  body: '',
  referenceLink: '',
});

export const loadDiscussionDraft = (): DaoDiscussionDraft => {
  if (typeof window === 'undefined') return defaultDraft();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDraft();
    const parsed = JSON.parse(raw) as Partial<DaoDiscussionDraft>;
    return { ...defaultDraft(), ...parsed };
  } catch {
    return defaultDraft();
  }
};

export const saveDiscussionDraft = (draft: DaoDiscussionDraft): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

export const clearDiscussionDraft = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
};
