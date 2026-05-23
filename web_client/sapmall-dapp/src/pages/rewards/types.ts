/** 平台官方活动分类（含 Bags 外链） */
export type CampaignCategory =
  | 'shopping'
  | 'newbie'
  | 'referral'
  | 'task'
  | 'dao'
  | 'bags';

export type CampaignCategoryFilter = CampaignCategory | 'all';

export type CampaignStatus = 'upcoming' | 'ongoing' | 'ended';

export type RewardType = 'sap' | 'coupon' | 'nft' | 'fee_discount' | 'badge';

export type CampaignWalletHint = 'evm' | 'solana' | 'evm_optional';

export type CampaignCtaType = 'internal' | 'bags_external' | 'mock_claim';

export interface CampaignCta {
  type: CampaignCtaType;
  /** i18n key under rewards.cta.* or rewards.campaignDetail.cta.* */
  labelKey: string;
  href?: string;
  external?: boolean;
}

export interface Campaign {
  slug: string;
  /** i18n: rewards.campaigns.{slug}.* */
  category: CampaignCategory;
  status: CampaignStatus;
  coverUrl: string;
  startAt: string;
  endAt?: string;
  isLongTerm?: boolean;
  rewardTypes: RewardType[];
  hot?: boolean;
  participants?: number;
  walletHint: CampaignWalletHint;
  cta: CampaignCta;
}

export type CampaignSortKey = 'latest' | 'participants' | 'deadline';
