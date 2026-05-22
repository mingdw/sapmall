/** 主题问题列表每页条数 */
export const HELP_GUIDE_PAGE_SIZE = 10;

/** 右侧常见问题默认展示条数（无分页） */
export const HELP_FAQ_DISPLAY_LIMIT = 5;

/** 文章详情页「同主题其他问题」默认条数 */
export const HELP_RELATED_ARTICLE_COUNT = 5;

/** 按偏移量轮换展示 FAQ（循环） */
export const sliceHelpFaqWindow = <T,>(items: T[], offset: number, limit: number): T[] => {
  if (items.length === 0) return [];
  if (items.length <= limit) return items;
  const start = offset % items.length;
  const out: T[] = [];
  for (let i = 0; i < limit; i += 1) {
    out.push(items[(start + i) % items.length]);
  }
  return out;
};
