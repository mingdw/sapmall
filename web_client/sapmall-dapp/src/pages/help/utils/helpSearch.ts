import type { TFunction } from 'i18next';
import type { HelpArticleMeta, HelpCategoryFilter } from '../types';
import { articleSummaryKey, articleTitleKey } from './articleI18nKey';

export const filterHelpArticles = (
  articles: HelpArticleMeta[],
  category: HelpCategoryFilter,
  keyword: string,
  t: TFunction,
): HelpArticleMeta[] => {
  const q = keyword.trim().toLowerCase();
  return articles.filter((article) => {
    const catMatch = category === 'all' || article.category === category;
    if (!q) return catMatch;

    const title = t(articleTitleKey(article.slug)).toLowerCase();
    const summary = t(articleSummaryKey(article.slug)).toLowerCase();
    const tags = article.tagKeys.map((k) => t(k).toLowerCase()).join(' ');

    return catMatch && (title.includes(q) || summary.includes(q) || tags.includes(q));
  });
};
