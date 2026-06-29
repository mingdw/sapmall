import type { Campaign } from '../types';

/** 平台官方活动 Mock（站内演示，活动彼此独立） */
export const CAMPAIGNS: Campaign[] = [
  {
    slug: 'newbie-wallet',
    category: 'newbie',
    status: 'ongoing',
    coverUrl:
      'https://images.unsplash.com/photo-1621761191319-6d9d778c84b0?w=800&q=80&auto=format&fit=crop',
    startAt: '2025-01-01T00:00:00.000Z',
    isLongTerm: true,
    rewardTypes: ['coupon'],
    participants: 4200,
    walletHint: 'evm',
    cta: { type: 'mock_claim', labelKey: 'claim', href: '/marketplace' },
  },
  {
    slug: 'sap-pay-bonus',
    category: 'shopping',
    status: 'ongoing',
    coverUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
    startAt: '2025-03-01T00:00:00.000Z',
    endAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    rewardTypes: ['fee_discount', 'sap'],
    hot: true,
    participants: 8900,
    walletHint: 'evm',
    cta: { type: 'internal', labelKey: 'join', href: '/marketplace?campaign=sap-pay-bonus' },
  },
  {
    slug: 'referral',
    category: 'referral',
    status: 'ongoing',
    coverUrl:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop',
    startAt: '2025-01-15T00:00:00.000Z',
    isLongTerm: true,
    rewardTypes: ['sap'],
    participants: 3100,
    walletHint: 'evm',
    cta: { type: 'internal', labelKey: 'invite', href: '/help?topic=getting-started-03' },
  },
  {
    slug: 'node-mining',
    category: 'task',
    status: 'ongoing',
    coverUrl:
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80&auto=format&fit=crop',
    startAt: '2024-06-01T00:00:00.000Z',
    isLongTerm: true,
    rewardTypes: ['fee_discount', 'badge'],
    participants: 24000,
    walletHint: 'evm_optional',
    cta: { type: 'internal', labelKey: 'viewTasks', href: '/dao' },
  },
  {
    slug: 'dao-may',
    category: 'dao',
    status: 'ongoing',
    coverUrl:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80&auto=format&fit=crop',
    startAt: '2025-04-01T00:00:00.000Z',
    endAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    rewardTypes: ['sap'],
    participants: 8500,
    walletHint: 'evm',
    cta: { type: 'internal', labelKey: 'join', href: '/dao' },
  },
  {
    slug: 'staking-preview',
    category: 'shopping',
    status: 'upcoming',
    coverUrl:
      'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&q=80&auto=format&fit=crop',
    startAt: new Date(Date.now() + 4 * 86400000).toISOString(),
    endAt: new Date(Date.now() + 11 * 86400000).toISOString(),
    rewardTypes: ['badge', 'sap'],
    walletHint: 'evm',
    cta: { type: 'internal', labelKey: 'join', href: '/exchange?campaign=staking-preview' },
  },
];

export const getCampaignBySlug = (slug: string): Campaign | undefined =>
  CAMPAIGNS.find((c) => c.slug === slug);
