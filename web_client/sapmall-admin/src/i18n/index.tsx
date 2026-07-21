import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { mergeTranslationBundles } from './mergeTranslationBundles';
import { normalizeUiLang } from './normalizeLang';

import zhCommon from './locales/zh/common.json';
import zhPersonal from './locales/zh/personal.json';
import zhTrading from './locales/zh/trading.json';
import zhBusiness from './locales/zh/business.json';
import zhModules from './locales/zh/modules.json';

import enCommon from './locales/en/common.json';
import enPersonal from './locales/en/personal.json';
import enTrading from './locales/en/trading.json';
import enBusiness from './locales/en/business.json';
import enModules from './locales/en/modules.json';

const zhTranslation = mergeTranslationBundles(
  zhCommon,
  zhPersonal,
  zhTrading,
  zhBusiness,
  zhModules
);

const enTranslation = mergeTranslationBundles(
  enCommon,
  enPersonal,
  enTrading,
  enBusiness,
  enModules
);

const resources = {
  zh: { translation: zhTranslation },
  en: { translation: enTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => normalizeUiLang(lng),
    },
  });

export default i18n;
