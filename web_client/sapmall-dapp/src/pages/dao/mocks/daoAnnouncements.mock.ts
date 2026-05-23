import { DAO_EVENTS } from './dao.mock';
import type { DaoEventItem } from '../types';

const ANNOUNCEMENT_SORT: Record<string, string> = {
  e4: '2026-05-08',
  e7: '2026-04-22',
  e8: '2026-04-18',
  e11: '2026-04-02',
};

export const getDaoAnnouncements = (): DaoEventItem[] =>
  DAO_EVENTS.filter((e) => e.category === 'announcement').sort((a, b) =>
    (ANNOUNCEMENT_SORT[b.id] ?? '').localeCompare(ANNOUNCEMENT_SORT[a.id] ?? ''),
  );
