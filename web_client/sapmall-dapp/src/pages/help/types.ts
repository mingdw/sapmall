export type HelpCategory =
  | 'getting-started'
  | 'wallet-security'
  | 'exchange-payment'
  | 'marketplace'
  | 'merchant'
  | 'order-support'
  | 'dao-community';

export type HelpCategoryFilter = HelpCategory | 'all';

export type HelpArticleBlock =
  | { type: 'paragraph'; key: string }
  | { type: 'heading'; level: 2 | 3; key: string }
  | { type: 'steps'; key: string }
  | { type: 'callout'; variant: 'tip' | 'warning'; key: string }
  | { type: 'figure'; category: HelpCategory; captionKey: string }
  | { type: 'image'; src: string; altKey: string; captionKey?: string }
  | { type: 'link'; key: string; href: string; external?: boolean };

export interface HelpArticleMeta {
  slug: string;
  category: HelpCategory;
  tagKeys: string[];
  updatedAt: string;
  hot?: boolean;
  /** 演示阅读量 */
  viewCount: number;
  blocks: HelpArticleBlock[];
  /** 演示：有用 / 无用计数 */
  helpfulCount: number;
  notHelpfulCount: number;
}

export interface HelpFaqItem {
  id: string;
  category: HelpCategory;
  questionKey: string;
  answerKey: string;
}

export type HelpTopicIcon =
  | 'wallet'
  | 'exchange'
  | 'store'
  | 'gift'
  | 'users'
  | 'shield'
  | 'building'
  | 'support';

export interface HelpQuickLink {
  id: string;
  category: HelpCategory;
  icon: HelpTopicIcon;
  titleKey: string;
  descKey: string;
  /** 站内路由或 `#search=keyword` */
  href: string;
  searchHint?: string;
}

export type HelpSupportActionId = 'liveChat' | 'feedback' | 'community';

export type HelpSupportActionIcon = 'headphones' | 'pen-line' | 'users';

export interface HelpSupportAction {
  id: HelpSupportActionId;
  icon: HelpSupportActionIcon;
  titleKey: string;
  /** 用于无障碍说明 */
  descKey: string;
  /** 站内路由；外链或 mailto 用 external */
  href?: string;
  external?: boolean;
}

export type HelpContactChannelIcon = 'mail' | 'send' | 'hash' | 'clock';

export interface HelpContactChannel {
  id: string;
  icon: HelpContactChannelIcon;
  labelKey: string;
  valueKey: string;
  href?: string;
  external?: boolean;
}
