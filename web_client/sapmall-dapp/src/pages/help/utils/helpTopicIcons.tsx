import {
  ArrowLeftRight,
  Building2,
  Gift,
  Headphones,
  Shield,
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
  shield: Shield,
  building: Building2,
  support: Headphones,
};
