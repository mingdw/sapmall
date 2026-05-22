import type { HelpCategory, HelpTopicIcon } from '../types';

/** 帮助中心主题树 — 顺序与图标（左侧树、按主题浏览共用） */
export const HELP_TOPIC_CATALOG: ReadonlyArray<{
  category: HelpCategory;
  icon: HelpTopicIcon;
}> = [
  { category: 'getting-started', icon: 'gift' },
  { category: 'wallet-security', icon: 'wallet' },
  { category: 'exchange-payment', icon: 'exchange' },
  { category: 'marketplace', icon: 'store' },
  { category: 'merchant', icon: 'building' },
  { category: 'order-support', icon: 'support' },
  { category: 'dao-community', icon: 'users' },
];
