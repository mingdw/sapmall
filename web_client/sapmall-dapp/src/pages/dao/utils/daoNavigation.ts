import type { DaoDiscussionCategory, DaoDiscussionCategoryFilter } from '../types';

export const daoHomePath = '/dao';

export const DAO_DISCUSSION_BOARD_PARAM = 'board';

const DAO_DISCUSSION_CATEGORIES: DaoDiscussionCategory[] = ['hot', 'marketplace', 'community'];

export const isDaoDiscussionCategory = (value: string | null): value is DaoDiscussionCategory =>
  value !== null && (DAO_DISCUSSION_CATEGORIES as string[]).includes(value);

export const readDaoDiscussionBoardFromSearch = (search: string): DaoDiscussionCategoryFilter => {
  const board = new URLSearchParams(search).get(DAO_DISCUSSION_BOARD_PARAM);
  return isDaoDiscussionCategory(board) ? board : 'all';
};

export const buildDaoDiscussionsListSearch = (
  board?: DaoDiscussionCategoryFilter,
): string => {
  const params = new URLSearchParams({ tab: 'discussions' });
  if (board && board !== 'all') {
    params.set(DAO_DISCUSSION_BOARD_PARAM, board);
  }
  return params.toString();
};

export const daoDiscussionsListPath = (
  board?: DaoDiscussionCategoryFilter,
): string => `${daoHomePath}?${buildDaoDiscussionsListSearch(board)}`;

export const daoEventsListPath = `${daoHomePath}?tab=events`;

export const daoProposalsListPath = daoHomePath;

export const daoDiscussionPath = (id: string): string => `${daoHomePath}/discussions/${id}`;

export const daoDiscussionCreatePath = `${daoHomePath}/discussions/new`;

export const daoEventPath = (id: string): string => `${daoHomePath}/events/${id}`;

export const daoProposalPath = (id: string): string => `${daoHomePath}/proposals/${id}`;

export const daoProposalCreatePath = `${daoHomePath}/proposals/new`;

export const isDaoViewTab = (value: string | null): value is 'proposals' | 'discussions' | 'events' =>
  value === 'proposals' || value === 'discussions' || value === 'events';
