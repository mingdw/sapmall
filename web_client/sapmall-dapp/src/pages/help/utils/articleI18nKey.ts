const TOPIC_QA_SLUG_RE = /^(getting-started|wallet-security|exchange-payment|marketplace|merchant|order-support|dao-community)-\d{2}$/;

/** 旧文章 slug → i18n articles 子键（保留兼容） */
const SLUG_TO_I18N_KEY: Record<string, string> = {};

export const isTopicQaSlug = (slug: string): boolean => TOPIC_QA_SLUG_RE.test(slug);

export const articleI18nKey = (slug: string): string =>
  SLUG_TO_I18N_KEY[slug] ??
  slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/-/g, '');

export const articleTitleKey = (slug: string) =>
  isTopicQaSlug(slug)
    ? `help.topicQa.${slug}.title`
    : `help.articles.${articleI18nKey(slug)}.title`;

export const articleSummaryKey = (slug: string) =>
  isTopicQaSlug(slug)
    ? `help.topicQa.${slug}.summary`
    : `help.articles.${articleI18nKey(slug)}.summary`;

export const articleBodyKey = (slug: string) =>
  isTopicQaSlug(slug) ? `help.topicQa.${slug}.body` : null;
