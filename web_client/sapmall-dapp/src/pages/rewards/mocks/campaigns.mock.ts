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
    slug: 'bags-blindbox',
    category: 'bags',
    status: 'ongoing',
    coverUrl:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80&auto=format&fit=crop',
    startAt: '2025-02-01T00:00:00.000Z',
    endAt: new Date(Date.now() + 3 * 86400000).toISOString(),
    rewardTypes: ['nft', 'coupon'],
    participants: 1280,
    walletHint: 'solana',
    cta: {
      type: 'bags_external',
      labelKey: 'goBags',
      href: 'https://bags.fm/',
      external: true,
    },
  },
  {
    slug: 'bags-creator',
    category: 'bags',
    status: 'ongoing',
    coverUrl:
      'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80&auto=format&fit=crop',
    startAt: '2025-03-10T00:00:00.000Z',
    endAt: new Date(Date.now() + 10 * 86400000).toISOString(),
    rewardTypes: ['nft', 'badge'],
    hot: true,
    participants: 560,
    walletHint: 'solana',
    cta: {
      type: 'bags_external',
      labelKey: 'creator',
      href: 'https://bags.fm/',
      external: true,
    },
  },
  {
    slug: 'summer-preview',
    category: 'bags',
    status: 'upcoming',
    coverUrl:
      'https://images.unsplash.com/photo-1518546308417-db642188de5b?w=800&q=80&auto=format&fit=crop',
    startAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    endAt: new Date(Date.now() + 21 * 86400000).toISOString(),
    rewardTypes: ['nft'],
    walletHint: 'solana',
    cta: {
      type: 'bags_external',
      labelKey: 'goBags',
      href: 'https://bags.fm/',
      external: true,
    },
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
  {
    slug: 'spring-ended',
    category: 'bags',
    status: 'ended',
    coverUrl:
      'https://images.unsplash.com/photo-1614854262312-73fba7c9f783?w=800&q=80&auto=format&fit=crop',
    startAt: '2025-01-01T00:00:00.000Z',
    endAt: '2025-03-01T00:00:00.000Z',
    rewardTypes: ['nft'],
    participants: 5600,
    walletHint: 'solana',
    cta: {
      type: 'bags_external',
      labelKey: 'goBags',
      href: 'https://bags.fm/',
      external: true,
    },
  },
];

export const getCampaignBySlug = (slug: string): Campaign | undefined =>
  CAMPAIGNS.find((c) => c.slug === slug);
