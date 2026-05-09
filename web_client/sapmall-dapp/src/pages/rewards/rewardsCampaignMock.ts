/**
 * 生态活动列表 — 演示数据（后续可替换为 GET /api/v1/rewards/campaigns）
 */

export type RewardCampaignTab = 'ongoing' | 'upcoming' | 'ended';

export type RewardCampaignCategory = 'bags' | 'dao' | 'task' | 'newbie' | 'referral';

export type RewardCampaignCta = 'bags_external' | 'internal';

export interface RewardCampaign {
  id: string;
  /** i18n 文案前缀：rewards.campaigns.{id}.* */
  i18nKey: string;
  tab: RewardCampaignTab;
  category: RewardCampaignCategory;
  accent: 'indigo' | 'purple' | 'blue' | 'orange' | 'red';
  imageUrl: string;
  hot?: boolean;
  participants?: number;
  /** ISO 8601，用于倒计时；无则展示长期/静态文案 */
  endAt?: string;
  isLongTerm?: boolean;
  cta: RewardCampaignCta;
  /** Bags 外链须为白名单域名（此处仅示例） */
  externalUrl?: string;
  internalHref?: string;
}

export const REWARD_CAMPAIGNS: RewardCampaign[] = [
  {
    id: 'bags-blindbox',
    i18nKey: 'bags-blindbox',
    tab: 'ongoing',
    category: 'bags',
    accent: 'indigo',
    imageUrl:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80&auto=format&fit=crop',
    participants: 1280,
    endAt: new Date(Date.now() + 2 * 86400000 + 14 * 3600000 + 22 * 60000).toISOString(),
    cta: 'bags_external',
    externalUrl: 'https://bags.fm/',
  },
  {
    id: 'dao-may',
    i18nKey: 'dao-may',
    tab: 'ongoing',
    category: 'dao',
    accent: 'purple',
    imageUrl:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80&auto=format&fit=crop',
    participants: 8500,
    endAt: new Date(Date.now() + 15 * 3600000 + 8 * 60000 + 45 * 1000).toISOString(),
    cta: 'internal',
    internalHref: '/dao',
  },
  {
    id: 'node-mining',
    i18nKey: 'node-mining',
    tab: 'ongoing',
    category: 'task',
    accent: 'blue',
    imageUrl:
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80&auto=format&fit=crop',
    participants: 24000,
    isLongTerm: true,
    cta: 'internal',
    internalHref: '/dao',
  },
  {
    id: 'newbie-wallet',
    i18nKey: 'newbie-wallet',
    tab: 'ongoing',
    category: 'newbie',
    accent: 'orange',
    imageUrl:
      'https://images.unsplash.com/photo-1621761191319-6d9d778c84b0?w=800&q=80&auto=format&fit=crop',
    cta: 'internal',
    internalHref: '/marketplace',
  },
  {
    id: 'referral',
    i18nKey: 'referral',
    tab: 'ongoing',
    category: 'referral',
    accent: 'red',
    imageUrl:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop',
    cta: 'internal',
    internalHref: '/help',
  },
  {
    id: 'bags-creator',
    i18nKey: 'bags-creator',
    tab: 'ongoing',
    category: 'bags',
    accent: 'indigo',
    imageUrl:
      'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80&auto=format&fit=crop',
    hot: true,
    cta: 'bags_external',
    externalUrl: 'https://bags.fm/',
  },
  {
    id: 'summer-preview',
    i18nKey: 'summer-preview',
    tab: 'upcoming',
    category: 'bags',
    accent: 'indigo',
    imageUrl:
      'https://images.unsplash.com/photo-1518546308417-db642188de5b?w=800&q=80&auto=format&fit=crop',
    endAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    cta: 'bags_external',
    externalUrl: 'https://bags.fm/',
  },
  {
    id: 'staking-preview',
    i18nKey: 'staking-preview',
    tab: 'upcoming',
    category: 'task',
    accent: 'blue',
    imageUrl:
      'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&q=80&auto=format&fit=crop',
    endAt: new Date(Date.now() + 9 * 86400000).toISOString(),
    cta: 'internal',
    internalHref: '/exchange',
  },
  {
    id: 'spring-ended',
    i18nKey: 'spring-ended',
    tab: 'ended',
    category: 'bags',
    accent: 'indigo',
    imageUrl:
      'https://images.unsplash.com/photo-1614854262312-73fba7c9f783?w=800&q=80&auto=format&fit=crop',
    participants: 5600,
    endAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    cta: 'bags_external',
    externalUrl: 'https://bags.fm/',
  },
];
