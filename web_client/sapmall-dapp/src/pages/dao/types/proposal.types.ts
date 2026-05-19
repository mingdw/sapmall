export type ProposalStatus =
  | 'draft'
  | 'discussion'
  | 'active'
  | 'passed'
  | 'rejected'
  | 'executed';

export type ProposalType =
  | 'parameter'
  | 'treasury'
  | 'grants'
  | 'protocol'
  | 'community';

export type VoteOption = 'for' | 'against' | 'abstain';

export interface VoteTally {
  for: number;
  against: number;
  abstain: number;
  quorumPercent: number;
  quorumRequired: number;
  participationPercent: number;
}

export interface VoteRecord {
  id: string;
  voterAddress: string;
  option: VoteOption;
  weight: number;
  delegatedFrom?: string;
  txHash?: string;
  votedAt: string;
}

export interface Comment {
  id: string;
  authorAddress: string;
  authorDisplay: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface ProposalTimeline {
  createdAt: string;
  discussionEndsAt?: string;
  votingStartsAt?: string;
  votingEndsAt?: string;
  executedAt?: string;
}

export interface ExecutionInfo {
  status: 'pending' | 'timelock' | 'executed' | 'failed';
  timelockEndsAt?: string;
  txHash?: string;
}

export interface Proposal {
  id: string;
  number: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  impact: string;
  status: ProposalStatus;
  type: ProposalType;
  proposerAddress: string;
  proposerDisplay: string;
  attachments?: { name: string; url: string }[];
  onChain?: {
    chainId: number;
    governorAddress: string;
    proposalId?: string;
  };
  timeline: ProposalTimeline;
  tally: VoteTally;
  voteRecords: VoteRecord[];
  comments: Comment[];
  execution?: ExecutionInfo;
  tags?: string[];
  isHotDiscussion?: boolean;
}

export interface DaoStats {
  memberCount: number;
  activeProposals: number;
  participationRate30d: number;
  treasuryBalance?: string;
}

export interface MyGovernanceSnapshot {
  votingPower: number;
  pendingVotes: number;
  votedCount: number;
  delegateTo?: string;
}
