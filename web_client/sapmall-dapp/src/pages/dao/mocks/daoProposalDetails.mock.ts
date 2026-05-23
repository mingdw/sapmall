import { DAO_DISCORD_URL } from '../constants';
import { DAO_PROPOSALS } from './dao.mock';
import type {
  DaoProposalDetail,
  DaoProposalDetailBlock,
  DaoProposalItem,
  DaoProposalTimelineStep,
} from '../types';

const detailBlocksById: Record<string, DaoProposalDetailBlock[]> = {
  p1: [
    { type: 'heading', level: 2, key: 'dao.proposalDetail.p1.h1' },
    { type: 'paragraph', key: 'dao.proposalDetail.p1.p1' },
    { type: 'heading', level: 3, key: 'dao.proposalDetail.p1.h2' },
    { type: 'bulletList', key: 'dao.proposalDetail.p1.bullets1' },
    { type: 'callout', variant: 'highlight', key: 'dao.proposalDetail.p1.callout' },
  ],
  p3: [
    { type: 'heading', level: 2, key: 'dao.proposalDetail.p3.h1' },
    { type: 'paragraph', key: 'dao.proposalDetail.p3.p1' },
    { type: 'bulletList', key: 'dao.proposalDetail.p3.bullets1' },
    { type: 'callout', variant: 'info', key: 'dao.proposalDetail.p3.callout' },
  ],
  p4: [
    { type: 'heading', level: 2, key: 'dao.proposalDetail.p4.h1' },
    { type: 'paragraph', key: 'dao.proposalDetail.p4.p1' },
    { type: 'bulletList', key: 'dao.proposalDetail.p4.bullets1' },
    { type: 'callout', variant: 'info', key: 'dao.proposalDetail.p4.callout' },
  ],
};

const defaultBlocks = (): DaoProposalDetailBlock[] => [
  { type: 'heading', level: 2, key: 'dao.proposalDetail.default.h1' },
  { type: 'paragraph', key: 'dao.proposalDetail.default.p1' },
  { type: 'callout', variant: 'info', key: 'dao.proposalDetail.default.callout' },
];

type DetailExtra = Pick<
  DaoProposalDetail,
  | 'quorumRequired'
  | 'differentialRequired'
  | 'votingNetworkKey'
  | 'forumUrl'
  | 'references'
  | 'timeline'
  | 'createdAtKey'
>;

const buildTimeline = (proposal: DaoProposalItem, createdAtKey: string): DaoProposalTimelineStep[] => {
  const { status } = proposal;
  const stepStatus = (phase: DaoProposalTimelineStep['id']): DaoProposalTimelineStep['status'] => {
    if (status === 'pending') {
      if (phase === 'created') return 'done';
      if (phase === 'open') return 'current';
      return 'pending';
    }
    if (status === 'active') {
      if (phase === 'created' || phase === 'open') return 'done';
      if (phase === 'closed') return 'current';
      return 'pending';
    }
    if (phase === 'executed') return status === 'passed' ? 'pending' : 'pending';
    return 'done';
  };

  const executedStatus: DaoProposalTimelineStep['status'] =
    status === 'passed' ? 'current' : 'pending';

  return [
    {
      id: 'created',
      labelKey: 'dao.proposalDetail.timeline.created',
      atKey: createdAtKey,
      status: stepStatus('created'),
    },
    {
      id: 'open',
      labelKey: 'dao.proposalDetail.timeline.open',
      atKey: proposal.startAtKey,
      status: status === 'pending' ? 'current' : 'done',
    },
    {
      id: 'closed',
      labelKey: 'dao.proposalDetail.timeline.closed',
      atKey: proposal.endAtKey,
      status: status === 'active' ? 'current' : status === 'pending' ? 'pending' : 'done',
    },
    {
      id: 'executed',
      labelKey: 'dao.proposalDetail.timeline.executed',
      atKey:
        status === 'passed'
          ? `dao.proposalDetail.${proposal.id}.executedAt`
          : 'dao.proposalDetail.timeline.pendingExecution',
      status: executedStatus,
    },
  ];
};

const detailExtraById: Partial<Record<string, Partial<DetailExtra>>> = {
  p1: {
    quorumRequired: 1000,
    differentialRequired: 200,
    createdAtKey: 'dao.proposalDetail.p1.createdAt',
  },
  p3: {
    quorumRequired: 800,
    differentialRequired: 150,
    createdAtKey: 'dao.proposalDetail.p3.createdAt',
  },
  p4: {
    quorumRequired: 1200,
    differentialRequired: 300,
    createdAtKey: 'dao.proposalDetail.p4.createdAt',
  },
};

const defaultReferences = () => [
  { labelKey: 'dao.proposalDetail.references.forum', url: DAO_DISCORD_URL },
  { labelKey: 'dao.proposalDetail.references.discussion', url: DAO_DISCORD_URL },
  { labelKey: 'dao.proposalDetail.references.implementation', url: 'https://github.com/sapmall' },
];

const buildDetailExtra = (proposal: DaoProposalItem): DetailExtra => {
  const override = detailExtraById[proposal.id] ?? {};
  return {
    quorumRequired: override.quorumRequired ?? 800,
    differentialRequired: override.differentialRequired ?? 150,
    votingNetworkKey: 'dao.proposalDetail.votingNetworkEthereum',
    forumUrl: DAO_DISCORD_URL,
    references: defaultReferences(),
    timeline: buildTimeline(proposal, override.createdAtKey ?? proposal.startAtKey),
    createdAtKey: override.createdAtKey ?? proposal.startAtKey,
  };
};

export const getDaoProposalDetail = (id: string): DaoProposalDetail | undefined => {
  const base = DAO_PROPOSALS.find((p) => p.id === id);
  if (!base) return undefined;
  const blocks = detailBlocksById[id] ?? defaultBlocks();
  return { ...base, ...buildDetailExtra(base), blocks };
};

export const getRelatedDaoProposals = (proposal: DaoProposalItem, limit = 3): DaoProposalItem[] =>
  DAO_PROPOSALS.filter(
    (p) => p.id !== proposal.id && p.tagKeys.some((tag) => proposal.tagKeys.includes(tag)),
  ).slice(0, limit);
