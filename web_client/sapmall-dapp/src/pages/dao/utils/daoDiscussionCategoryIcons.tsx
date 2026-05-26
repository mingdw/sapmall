import { Flame, Store, Users, type LucideIcon } from 'lucide-react';
import type { DaoDiscussionCategoryIcon } from '../constants/discussionCategoryCatalog';

export const DAO_DISCUSSION_CATEGORY_ICON_MAP: Record<DaoDiscussionCategoryIcon, LucideIcon> = {
  flame: Flame,
  store: Store,
  users: Users,
};
