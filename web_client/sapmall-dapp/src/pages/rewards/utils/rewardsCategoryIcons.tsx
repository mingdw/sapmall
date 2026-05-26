import {
  Box,
  Gift,
  Landmark,
  Pickaxe,
  ShoppingBag,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import type { RewardsCategoryIcon } from '../constants/rewardsCategoryCatalog';

export const REWARDS_CATEGORY_ICON_MAP: Record<RewardsCategoryIcon, LucideIcon> = {
  shopping: ShoppingBag,
  newbie: Gift,
  referral: UserPlus,
  task: Pickaxe,
  dao: Landmark,
  bags: Box,
};
