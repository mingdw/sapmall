import type { HelpCategory } from '../types';

const TOPIC_PARAM = 'topic';

const HELP_CATEGORIES: HelpCategory[] = [
  'getting-started',
  'wallet-security',
  'exchange-payment',
  'marketplace',
  'merchant',
  'order-support',
  'dao-community',
];

export const isHelpCategory = (value: string | null): value is HelpCategory =>
  value !== null && (HELP_CATEGORIES as string[]).includes(value);

export const helpHomePath = '/help';

export const helpTopicPath = (category: HelpCategory): string =>
  `${helpHomePath}?${TOPIC_PARAM}=${category}`;

export const readHelpTopicFromSearch = (search: string): HelpCategory | null => {
  const topic = new URLSearchParams(search).get(TOPIC_PARAM);
  return isHelpCategory(topic) ? topic : null;
};
