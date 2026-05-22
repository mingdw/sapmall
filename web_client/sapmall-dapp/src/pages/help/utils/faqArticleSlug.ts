/** 从 FAQ id（faq-{slug}）解析对应文章 slug */
export const faqArticleSlugFromId = (faqId: string): string =>
  faqId.startsWith('faq-') ? faqId.slice(4) : faqId;
