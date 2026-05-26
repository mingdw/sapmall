/** 富文本 HTML → 纯文本（用于字数统计与校验） */
export const stripHtmlToPlainText = (html: string): string => {
  if (!html) return '';
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent ?? div.innerText ?? '').replace(/\s+/g, ' ').trim();
};

export const getPlainTextLength = (html: string): number => stripHtmlToPlainText(html).length;

export const isHtmlContent = (value: string): boolean => /<[a-z][\s\S]*>/i.test(value);
