import { DAO_EVENTS } from './dao.mock';
import type { DaoEventDetail, DaoEventDetailBlock, DaoEventItem } from '../types';

const detailBlocksById: Record<string, DaoEventDetailBlock[]> = {
  e1: [
    { type: 'paragraph', key: 'dao.eventDetail.e1.intro' },
    { type: 'image', srcKey: 'cover', altKey: 'dao.eventDetail.e1.coverAlt', captionKey: 'dao.eventDetail.e1.coverCaption' },
    { type: 'heading', level: 2, key: 'dao.eventDetail.e1.h1' },
    { type: 'paragraph', key: 'dao.eventDetail.e1.p1' },
    { type: 'bulletList', key: 'dao.eventDetail.e1.bullets1' },
    { type: 'heading', level: 3, key: 'dao.eventDetail.e1.h2' },
    { type: 'paragraph', key: 'dao.eventDetail.e1.p2' },
    { type: 'callout', variant: 'highlight', key: 'dao.eventDetail.e1.callout' },
  ],
  e2: [
    { type: 'paragraph', key: 'dao.eventDetail.e2.intro' },
    { type: 'image', srcKey: 'cover', altKey: 'dao.eventDetail.e2.coverAlt' },
    { type: 'heading', level: 2, key: 'dao.eventDetail.e2.h1' },
    { type: 'bulletList', key: 'dao.eventDetail.e2.bullets1' },
    { type: 'paragraph', key: 'dao.eventDetail.e2.p1' },
    { type: 'callout', variant: 'info', key: 'dao.eventDetail.e2.callout' },
  ],
  e3: [
    { type: 'paragraph', key: 'dao.eventDetail.e3.intro' },
    { type: 'image', srcKey: 'cover', altKey: 'dao.eventDetail.e3.coverAlt', captionKey: 'dao.eventDetail.e3.coverCaption' },
    { type: 'heading', level: 2, key: 'dao.eventDetail.e3.h1' },
    { type: 'paragraph', key: 'dao.eventDetail.e3.p1' },
    { type: 'bulletList', key: 'dao.eventDetail.e3.bullets1' },
    { type: 'paragraph', key: 'dao.eventDetail.e3.p2' },
  ],
};

const defaultBlocks = (id: string): DaoEventDetailBlock[] => [
  { type: 'paragraph', key: `dao.eventDetail.${id}.intro` },
  { type: 'image', srcKey: 'cover', altKey: `dao.eventDetail.${id}.coverAlt` },
  { type: 'heading', level: 2, key: `dao.eventDetail.${id}.h1` },
  { type: 'paragraph', key: `dao.eventDetail.${id}.p1` },
  { type: 'callout', variant: 'info', key: `dao.eventDetail.${id}.callout` },
];

export const getDaoEventDetail = (id: string): DaoEventDetail | undefined => {
  const base = DAO_EVENTS.find((e) => e.id === id);
  if (!base) return undefined;
  const blocks = detailBlocksById[id] ?? defaultBlocks(id);
  return { ...base, blocks };
};

export const getRelatedDaoEvents = (event: DaoEventItem, limit = 3): DaoEventItem[] =>
  DAO_EVENTS.filter((e) => e.id !== event.id && e.category === event.category).slice(0, limit);
