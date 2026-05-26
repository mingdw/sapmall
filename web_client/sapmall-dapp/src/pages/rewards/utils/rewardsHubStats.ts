import type { Campaign } from '../types';
import { getCampaignDaysLeft } from './rewardsCampaignTime';

export type RewardsHubStats = {
  ongoingCount: number;
  upcomingCount: number;
  totalParticipants: number;
  endingSoonCount: number;
};

export const computeRewardsHubStats = (campaigns: Campaign[]): RewardsHubStats => {
  const ongoing = campaigns.filter((c) => c.status === 'ongoing');
  const upcoming = campaigns.filter((c) => c.status === 'upcoming');

  return {
    ongoingCount: ongoing.length,
    upcomingCount: upcoming.length,
    totalParticipants: ongoing.reduce((sum, c) => sum + (c.participants ?? 0), 0),
    endingSoonCount: ongoing.filter((c) => {
      const days = getCampaignDaysLeft(c);
      return days !== null && days <= 7;
    }).length,
  };
};

export const pickFeaturedCampaigns = (
  campaigns: Campaign[],
  status: Campaign['status'],
  limit = 3,
): Campaign[] => {
  const pool = campaigns.filter((c) => c.status === status);
  const scored = [...pool].sort((a, b) => {
    const aDays = getCampaignDaysLeft(a);
    const bDays = getCampaignDaysLeft(b);
    const aUrgent = a.hot ? 2 : aDays !== null && aDays <= 5 ? 1 : 0;
    const bUrgent = b.hot ? 2 : bDays !== null && bDays <= 5 ? 1 : 0;
    if (bUrgent !== aUrgent) return bUrgent - aUrgent;
    return (b.participants ?? 0) - (a.participants ?? 0);
  });
  return scored.slice(0, limit);
};
