import type { DaoProposalVoteChoice } from '../types';
import { DAO_DISCUSSIONS, DAO_PROPOSALS } from '../mocks/dao.mock';

const STORAGE_KEY = 'sapmall-dao-proposal-votes';

type VoteStore = Record<string, Record<string, DaoProposalVoteChoice>>;

const readStore = (): VoteStore => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as VoteStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (store: VoteStore): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const MOCK_VOTING_POWER = 120;

const hashAddress = (address: string): number => {
  const key = address.toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const pickDeterministicIds = (allIds: string[], count: number, seed: string): string[] => {
  const limit = Math.min(count, allIds.length);
  return [...allIds]
    .sort((a, b) => hashAddress(`${seed}:${a}`) - hashAddress(`${seed}:${b}`))
    .slice(0, limit);
};

export const getMockUserParticipatedProposalIds = (address: string): string[] => {
  const store = readStore();
  const key = address.toLowerCase();
  const votedIds = Object.keys(store[key] ?? {});
  const knownIds = new Set(DAO_PROPOSALS.map((p) => p.id));

  if (votedIds.length > 0) {
    return votedIds.filter((id) => knownIds.has(id));
  }

  const hash = hashAddress(address);
  const targetCount = (hash % 14) + 4;
  return pickDeterministicIds(
    DAO_PROPOSALS.map((p) => p.id),
    targetCount,
    `${address}:proposals`,
  );
};

export const getMockUserParticipatedDiscussionIds = (address: string): string[] => {
  const hash = hashAddress(address);
  const targetCount = (hash % 16) + 5;
  return pickDeterministicIds(
    DAO_DISCUSSIONS.map((d) => d.id),
    targetCount,
    `${address}:discussions`,
  );
};

export type MockUserGovernanceStats = {
  historicalParticipation: number;
  votingPower: number;
  lifetimeVoteWeight: number;
  activeLevel: 'high' | 'medium' | 'low';
};

export const getMockUserGovernanceStats = (address: string): MockUserGovernanceStats => {
  const hash = hashAddress(address);
  const historicalParticipation = (hash % 14) + 4;
  const votingPower = MOCK_VOTING_POWER;
  const lifetimeVoteWeight = votingPower * historicalParticipation + (hash % 80);
  const activeLevel: MockUserGovernanceStats['activeLevel'] =
    hash % 3 === 0 ? 'high' : hash % 3 === 1 ? 'medium' : 'low';

  return {
    historicalParticipation,
    votingPower,
    lifetimeVoteWeight,
    activeLevel,
  };
};

export const getMockUserParticipationSummary = (address: string): {
  proposalsParticipated: number;
  discussionsParticipated: number;
} => ({
  proposalsParticipated: getMockUserParticipatedProposalIds(address).length,
  discussionsParticipated: getMockUserParticipatedDiscussionIds(address).length,
});

export const getMockVotingPower = (_address: string): number => MOCK_VOTING_POWER;

export const getUserProposalVote = (
  address: string | undefined,
  proposalId: string,
): DaoProposalVoteChoice | null => {
  if (!address) return null;
  const store = readStore();
  return store[address.toLowerCase()]?.[proposalId] ?? null;
};

export const setUserProposalVote = (
  address: string,
  proposalId: string,
  choice: DaoProposalVoteChoice,
): void => {
  const store = readStore();
  const key = address.toLowerCase();
  store[key] = { ...(store[key] ?? {}), [proposalId]: choice };
  writeStore(store);
};

export const applyUserVoteToTotals = (
  votesFor: number,
  votesAgainst: number,
  choice: DaoProposalVoteChoice,
  power: number,
): { votesFor: number; votesAgainst: number } =>
  choice === 'for'
    ? { votesFor: votesFor + power, votesAgainst }
    : { votesFor, votesAgainst: votesAgainst + power };
