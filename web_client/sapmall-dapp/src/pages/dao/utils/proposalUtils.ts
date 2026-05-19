import { Proposal, ProposalStatus, VoteTally } from '../types/proposal.types';

export function formatRelativeTime(iso: string, locale: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale.startsWith('zh') ? 'zh' : 'en', { numeric: 'auto' });
  if (abs < 3600000) return rtf.format(Math.round(diff / 60000), 'minute');
  if (abs < 86400000) return rtf.format(Math.round(diff / 3600000), 'hour');
  return rtf.format(Math.round(diff / 86400000), 'day');
}

export function getVotePercentages(tally: VoteTally): { for: number; against: number; abstain: number } {
  const total = tally.for + tally.against + tally.abstain || 1;
  return {
    for: Math.round((tally.for / total) * 100),
    against: Math.round((tally.against / total) * 100),
    abstain: Math.round((tally.abstain / total) * 100),
  };
}

export function getControversyScore(tally: VoteTally): number {
  const total = tally.for + tally.against || 1;
  const ratio = Math.min(tally.for, tally.against) / total;
  return Math.round(ratio * 100);
}

export function isVotingOpen(status: ProposalStatus): boolean {
  return status === 'active';
}

export function canVote(status: ProposalStatus): boolean {
  return status === 'active';
}

export function sortProposals(
  proposals: Proposal[],
  sortBy: 'latest' | 'ending' | 'participation' | 'controversy'
): Proposal[] {
  const copy = [...proposals];
  switch (sortBy) {
    case 'ending':
      return copy.sort((a, b) => {
        const ae = a.timeline.votingEndsAt ? new Date(a.timeline.votingEndsAt).getTime() : Infinity;
        const be = b.timeline.votingEndsAt ? new Date(b.timeline.votingEndsAt).getTime() : Infinity;
        return ae - be;
      });
    case 'participation':
      return copy.sort((a, b) => b.tally.participationPercent - a.tally.participationPercent);
    case 'controversy':
      return copy.sort((a, b) => getControversyScore(b.tally) - getControversyScore(a.tally));
    default:
      return copy.sort(
        (a, b) => new Date(b.timeline.createdAt).getTime() - new Date(a.timeline.createdAt).getTime()
      );
  }
}

export function filterProposals(
  proposals: Proposal[],
  opts: {
    status?: ProposalStatus | 'all';
    type?: string;
    mine?: boolean;
    query?: string;
  }
): Proposal[] {
  let result = proposals;
  if (opts.status && opts.status !== 'all') {
    result = result.filter((p) => p.status === opts.status);
  }
  if (opts.type && opts.type !== 'all') {
    result = result.filter((p) => p.type === opts.type);
  }
  if (opts.query?.trim()) {
    const q = opts.query.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.number.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
    );
  }
  return result;
}

export function getCommentCount(proposal: Proposal): number {
  return proposal.comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length ?? 0),
    0
  );
}
