export const daoHomePath = '/dao';

export const daoEventsListPath = `${daoHomePath}?tab=events`;

export const daoProposalsListPath = daoHomePath;

export const daoDiscussionsListPath = `${daoHomePath}?tab=discussions`;

export const daoDiscussionPath = (id: string): string => `${daoHomePath}/discussions/${id}`;

export const daoEventPath = (id: string): string => `${daoHomePath}/events/${id}`;

export const daoProposalPath = (id: string): string => `${daoHomePath}/proposals/${id}`;

export const daoProposalCreatePath = `${daoHomePath}/proposals/new`;

export const isDaoViewTab = (value: string | null): value is 'proposals' | 'discussions' | 'events' =>
  value === 'proposals' || value === 'discussions' || value === 'events';
