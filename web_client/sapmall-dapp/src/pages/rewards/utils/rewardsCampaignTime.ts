import type { Campaign } from '../types';

export const getCampaignDaysLeft = (campaign: Campaign): number | null => {
  if (campaign.isLongTerm || !campaign.endAt) return null;
  const diff = new Date(campaign.endAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

export const getCampaignTimeProgress = (campaign: Campaign): number | null => {
  if (campaign.isLongTerm || !campaign.endAt) return null;
  const start = new Date(campaign.startAt).getTime();
  const end = new Date(campaign.endAt).getTime();
  const now = Date.now();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
};

export const formatCampaignPeriodLabel = (
  campaign: Campaign,
  t: (key: string) => string,
): string => {
  if (campaign.isLongTerm) return t('rewards.longTerm');
  if (campaign.endAt) {
    return `${campaign.startAt.slice(0, 10)} — ${campaign.endAt.slice(0, 10)}`;
  }
  return campaign.startAt.slice(0, 10);
};
