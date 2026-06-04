import {
  ArrowLeftRight,
  Building2,
  Gift,
  Headphones,
  Store,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { HelpTopicIcon } from '../types';

export const HELP_TOPIC_ICON_MAP: Record<HelpTopicIcon, LucideIcon> = {
  wallet: Wallet,
  exchange: ArrowLeftRight,
  store: Store,
  gift: Gift,
  users: Users,
  building: Building2,
  support: Headphones,
};
