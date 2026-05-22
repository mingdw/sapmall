import type { HelpArticleMeta } from '../types';
import { buildHelpTopicArticles } from './helpTopicQaCatalog';

export const HELP_ARTICLES: HelpArticleMeta[] = buildHelpTopicArticles();

export const getHelpArticleBySlug = (slug: string): HelpArticleMeta | undefined =>
  HELP_ARTICLES.find((a) => a.slug === slug);

export const getHotHelpArticles = (): HelpArticleMeta[] =>
  HELP_ARTICLES.filter((a) => a.hot);
