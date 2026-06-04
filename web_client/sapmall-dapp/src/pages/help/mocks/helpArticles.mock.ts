import type { HelpArticleMeta } from '../types';
import { buildHelpTopicArticles } from './helpTopicQaCatalog';

export const HELP_ARTICLES: HelpArticleMeta[] = buildHelpTopicArticles();

export const getHelpArticleBySlug = (slug: string): HelpArticleMeta | undefined =>
  HELP_ARTICLES.find((a) => a.slug === slug);
