import type { DaoProposalDraft } from '../types';

const STORAGE_KEY = 'sapmall-dao-proposal-draft';

const defaultDraft = (): DaoProposalDraft => {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const toDateInput = (d: Date) => d.toISOString().slice(0, 10);

  return {
    title: '',
    summary: '',
    tagKeys: [],
    startAt: toDateInput(start),
    endAt: toDateInput(end),
    motivation: '',
    specification: '',
    callout: '',
    referenceForum: '',
    referenceImplementation: '',
  };
};

export const createEmptyProposalDraft = (): DaoProposalDraft => defaultDraft();

export const loadProposalDraft = (): DaoProposalDraft => {
  if (typeof window === 'undefined') return defaultDraft();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDraft();
    const parsed = JSON.parse(raw) as Partial<DaoProposalDraft>;
    return { ...defaultDraft(), ...parsed };
  } catch {
    return defaultDraft();
  }
};

export const saveProposalDraft = (draft: DaoProposalDraft): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

export const clearProposalDraft = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
};
