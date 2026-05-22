import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译资源
import zhTranslation from './locales/zh/translation.json';
import enTranslation from './locales/en/translation.json';
import zhHelp from './locales/zh/help.json';
import enHelp from './locales/en/help.json';
import { buildTopicQaI18nTree } from '../pages/help/mocks/helpTopicQaCatalog';

const resources = {
  zh: {
    translation: {
      ...zhTranslation,
      ...zhHelp,
      help: {
        ...zhHelp.help,
        topicQa: buildTopicQaI18nTree('zh'),
      },
    },
  },
  en: {
    translation: {
      ...enTranslation,
      ...enHelp,
      help: {
        ...enHelp.help,
        topicQa: buildTopicQaI18nTree('en'),
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    debug: true, // 开启调试模式
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  } as any); // 添加类型断言

export default i18n;
