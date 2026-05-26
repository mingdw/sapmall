import { DAO_DISCUSSIONS } from './dao.mock';
import { getUserDiscussionRecord, userRecordToDetail } from '../utils/daoUserDiscussion.storage';
import { getMergedDaoDiscussions } from '../utils/daoDiscussionsList';
import type {
  DaoDiscussionDetail,
  DaoDiscussionDetailBlock,
  DaoDiscussionItem,
  DaoDiscussionReplyItem,
} from '../types';

const OP_AUTHORS: Record<string, string> = {
  d1: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  d2: '0x8ba1f109551bd432803012645eac136c22c177e9',
  d3: '0xAb5801a7D398a744d1A4aB94F8175949CD64eA0',
  d4: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  d5: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
  d6: '0xdD2FD4581271e230360230F9337D0a9502',
  d7: '0xbDA5747bfd3F4E4663b5dA948F941399D6a420e9',
  d8: '0x2546BcD3c84021AE622BC6c443d8A38D0910db0',
  d9: '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
  d10: '0x2546BcD3c84021AE622BC6c443d8A38D0910db0',
  d11: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
};

const REPLY_AUTHORS = [
  '0x8ba1f109551bd432803012645eac136c22c177e9',
  '0xAb5801a7D398a744d1A4aB94F8175949CD64eA0',
  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
  '0x2546BcD3c84021AE622BC6c443d8A38D0910db0',
];

const detailBlocksById: Record<string, DaoDiscussionDetailBlock[]> = {
  d1: [
    { type: 'paragraph', key: 'dao.discussionDetail.d1.intro' },
    { type: 'heading', level: 2, key: 'dao.discussionDetail.d1.h1' },
    { type: 'paragraph', key: 'dao.discussionDetail.d1.p1' },
    { type: 'bulletList', key: 'dao.discussionDetail.d1.bullets1' },
    { type: 'callout', variant: 'info', key: 'dao.discussionDetail.d1.callout' },
  ],
  d2: [
    { type: 'paragraph', key: 'dao.discussionDetail.d2.intro' },
    { type: 'heading', level: 2, key: 'dao.discussionDetail.d2.h1' },
    { type: 'paragraph', key: 'dao.discussionDetail.d2.p1' },
    { type: 'bulletList', key: 'dao.discussionDetail.d2.bullets1' },
    { type: 'callout', variant: 'highlight', key: 'dao.discussionDetail.d2.callout' },
  ],
  d3: [
    { type: 'paragraph', key: 'dao.discussionDetail.d3.intro' },
    { type: 'heading', level: 2, key: 'dao.discussionDetail.d3.h1' },
    { type: 'paragraph', key: 'dao.discussionDetail.d3.p1' },
    { type: 'bulletList', key: 'dao.discussionDetail.d3.bullets1' },
  ],
};

const mockRepliesById: Record<string, DaoDiscussionReplyItem[]> = {
  d1: [
    {
      id: 'd1-r1',
      authorAddress: REPLY_AUTHORS[0],
      bodyKey: 'dao.discussionDetail.d1.replies.r1',
      publishedAtKey: 'dao.discussionDetail.d1.replies.r1Time',
      likes: 18,
    },
    {
      id: 'd1-r2',
      authorAddress: REPLY_AUTHORS[1],
      bodyKey: 'dao.discussionDetail.d1.replies.r2',
      publishedAtKey: 'dao.discussionDetail.d1.replies.r2Time',
      isOfficial: true,
      likes: 42,
    },
    {
      id: 'd1-r3',
      authorAddress: REPLY_AUTHORS[2],
      bodyKey: 'dao.discussionDetail.d1.replies.r3',
      publishedAtKey: 'dao.discussionDetail.d1.replies.r3Time',
      likes: 9,
    },
  ],
  d2: [
    {
      id: 'd2-r1',
      authorAddress: REPLY_AUTHORS[3],
      bodyKey: 'dao.discussionDetail.d2.replies.r1',
      publishedAtKey: 'dao.discussionDetail.d2.replies.r1Time',
      likes: 24,
    },
    {
      id: 'd2-r2',
      authorAddress: REPLY_AUTHORS[4],
      bodyKey: 'dao.discussionDetail.d2.replies.r2',
      publishedAtKey: 'dao.discussionDetail.d2.replies.r2Time',
      likes: 11,
    },
    {
      id: 'd2-r3',
      authorAddress: REPLY_AUTHORS[0],
      bodyKey: 'dao.discussionDetail.d2.replies.r3',
      publishedAtKey: 'dao.discussionDetail.d2.replies.r3Time',
      isOfficial: true,
      likes: 31,
    },
  ],
};

const fallbackDefaultBlocks = (): DaoDiscussionDetailBlock[] => [
  { type: 'paragraph', key: 'dao.discussionDetail.default.intro' },
  { type: 'heading', level: 2, key: 'dao.discussionDetail.default.h1' },
  { type: 'paragraph', key: 'dao.discussionDetail.default.p1' },
  { type: 'callout', variant: 'info', key: 'dao.discussionDetail.default.callout' },
];

const getDefaultMockReplies = (discussion: DaoDiscussionItem): DaoDiscussionReplyItem[] => {
  const count = Math.min(3, Math.max(2, Math.floor(discussion.replies / 35) + 1));
  return Array.from({ length: count }, (_, index) => ({
    id: `${discussion.id}-default-r${index + 1}`,
    authorAddress: REPLY_AUTHORS[index % REPLY_AUTHORS.length],
    bodyKey: `dao.discussionDetail.default.replies.${index + 1}.body`,
    publishedAtKey: `dao.discussionDetail.default.replies.${index + 1}.time`,
    likes: ((discussion.id.charCodeAt(1) || 0) + index * 7) % 28 + 2,
    isOfficial: index === 1 && discussion.tags.includes('official'),
  }));
};

export const getDaoDiscussionDetail = (id: string): DaoDiscussionDetail | undefined => {
  const userRecord = getUserDiscussionRecord(id);
  if (userRecord) return userRecordToDetail(userRecord);

  const base = DAO_DISCUSSIONS.find((d) => d.id === id);
  if (!base) return undefined;

  const blocks = detailBlocksById[id] ?? fallbackDefaultBlocks();

  return {
    ...base,
    authorAddress: OP_AUTHORS[id] ?? REPLY_AUTHORS[0],
    activityKey: `dao.list.discussions.${id}.activity`,
    blocks,
  };
};

export const getMockDiscussionReplies = (discussion: DaoDiscussionItem): DaoDiscussionReplyItem[] =>
  mockRepliesById[discussion.id] ?? getDefaultMockReplies(discussion);

export const getRelatedDaoDiscussions = (
  discussion: DaoDiscussionItem,
  limit = 3,
): DaoDiscussionItem[] =>
  getMergedDaoDiscussions().filter((d) => d.id !== discussion.id && d.category === discussion.category).slice(
    0,
    limit,
  );
