import type { HelpArticleMeta, HelpCategoryFilter } from './types';

export type HelpOutletContext = {
  keyword: string;
  category: HelpCategoryFilter;
  filteredArticles: HelpArticleMeta[];
  onKeywordChange: (value: string) => void;
  onTopicSelect: (topic: HelpCategoryFilter) => void;
};
