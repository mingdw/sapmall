import type { DaoProposalStatus, DaoProposalVoteChoice } from '../types';

type MetricsInput = {
  votesFor: number;
  votesAgainst: number;
  quorumRequired: number;
  differentialRequired: number;
  status: DaoProposalStatus;
};

export type DaoProposalMetrics = {
  totalParticipation: number;
  forPct: number;
  againstPct: number;
  forPctRounded: number;
  differential: number;
  quorumReached: boolean;
  differentialReached: boolean;
  displayState: DaoProposalStatus;
};

export const computeProposalMetrics = ({
  votesFor,
  votesAgainst,
  quorumRequired,
  differentialRequired,
  status,
}: MetricsInput): DaoProposalMetrics => {
  const totalParticipation = votesFor + votesAgainst;
  const forPct = totalParticipation > 0 ? (votesFor / totalParticipation) * 100 : 0;
  const againstPct = totalParticipation > 0 ? (votesAgainst / totalParticipation) * 100 : 0;
  const forPctRounded = Math.round(forPct);
  const differential = votesFor - votesAgainst;
  const quorumReached = totalParticipation >= quorumRequired;
  const differentialReached = differential >= differentialRequired;

  return {
    totalParticipation,
    forPct,
    againstPct,
    forPctRounded,
    differential,
    quorumReached,
    differentialReached,
    displayState: status,
  };
};

export const formatProposalVoteCount = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

export const formatProposalCompact = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export type { DaoProposalVoteChoice };
