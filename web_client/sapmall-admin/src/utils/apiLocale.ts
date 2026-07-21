import i18n from '../i18n';

/** 规范为 HTTP Accept-Language（BCP 47） */
export function normalizeApiLocale(lang: string): string {
  const lower = lang.trim().toLowerCase();
  if (!lower) return 'zh-CN';
  if (lower.startsWith('zh')) return 'zh-CN';
  if (lower.startsWith('en')) return 'en-US';
  return lang;
}

/** 从 search 或 hash 查询串中读取 lang */
export function getUrlLangParam(): string | null {
  const fromSearch = new URLSearchParams(window.location.search).get('lang');
  if (fromSearch) return fromSearch;
  const hash = window.location.hash || '';
  if (hash.includes('?')) {
    return new URLSearchParams(hash.split('?')[1]).get('lang');
  }
  return null;
}

/** 获取当前 API 请求语言（与 i18n 切换保持一致） */
export function getCurrentApiLocale(): string {
  const urlLocale = getUrlLangParam();
  if (urlLocale) return normalizeApiLocale(urlLocale);

  const i18nLang = i18n.language || localStorage.getItem('i18nextLng') || '';
  if (i18nLang) return normalizeApiLocale(i18nLang);

  return navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US';
}
