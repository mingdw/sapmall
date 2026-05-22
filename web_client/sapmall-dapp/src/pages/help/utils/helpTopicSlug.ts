/** 从 topic QA slug（如 getting-started-03）解析文章序号（0-based） */
export const parseTopicQaArticleIndex = (slug: string): number => {
  const match = slug.match(/-(\d{2})$/);
  return match ? Number.parseInt(match[1], 10) - 1 : 0;
};
