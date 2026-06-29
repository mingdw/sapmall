import type { CampaignCategory } from '../types';

export type RewardsCategoryIcon =
  | 'shopping'
  | 'newbie'
  | 'referral'
  | 'task'
  | 'dao';

export const REWARDS_CATEGORY_CATALOG: ReadonlyArray<{
  category: CampaignCategory;
  icon: RewardsCategoryIcon;
}> = [
  { category: 'shopping', icon: 'shopping' },
  { category: 'newbie', icon: 'newbie' },
  { category: 'referral', icon: 'referral' },
  { category: 'task', icon: 'task' },
  { category: 'dao', icon: 'dao' },
];
