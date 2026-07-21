/** 统一内部语言码为 zh | en */
export function normalizeUiLang(lang?: string | null): 'zh' | 'en' {
  if (!lang) return 'zh';
  const lower = lang.trim().toLowerCase();
  if (lower.startsWith('en')) return 'en';
  return 'zh';
}

/** 是否为英文 UI */
export function isEnglishUi(lang?: string | null): boolean {
  return normalizeUiLang(lang) === 'en';
}
