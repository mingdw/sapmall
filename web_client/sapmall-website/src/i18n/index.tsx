import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

// 翻译资源初始化
const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // 不需要转义React内容
    },
    detection: {
      // ?lang=en|zh 供 sitemap / hreflang 爬虫使用，需优先于本地缓存
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    }
  });


type TFunction = (key: string, options?: any) => string;
export const t = i18n.t as TFunction;  

export default i18n; 