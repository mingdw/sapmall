import { HELP_RELATED_ARTICLE_COUNT } from '../constants/helpGuide';
import { HELP_ARTICLES } from '../mocks/helpArticles.mock';
import type { HelpArticleMeta, HelpCategory } from '../types';
import { parseTopicQaArticleIndex } from './helpTopicSlug';

/** 同主题下除当前篇以外的其他问题，按文章序号邻近度排序，默认最多 5 条 */
export const getRelatedTopicArticles = (
  currentSlug: string,
  category: HelpCategory,
  allArticles: HelpArticleMeta[] = HELP_ARTICLES,
  limit = HELP_RELATED_ARTICLE_COUNT,
): HelpArticleMeta[] => {
  const currentIndex = parseTopicQaArticleIndex(currentSlug);

  return allArticles
    .filter((a) => a.category === category && a.slug !== currentSlug)
    .sort((a, b) => {
      const distA = Math.abs(parseTopicQaArticleIndex(a.slug) - currentIndex);
      const distB = Math.abs(parseTopicQaArticleIndex(b.slug) - currentIndex);
      if (distA !== distB) return distA - distB;
      return parseTopicQaArticleIndex(a.slug) - parseTopicQaArticleIndex(b.slug);
    })
    .slice(0, limit);
};
