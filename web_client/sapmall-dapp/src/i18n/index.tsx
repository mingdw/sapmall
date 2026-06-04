import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { mergeTranslationBundles } from './mergeTranslationBundles';
import { buildTopicQaI18nTree } from '../pages/help/mocks/helpTopicQaCatalog';

import zhCommon from './locales/zh/translation_common.json';
import zhMarketplace from './locales/zh/translation_marketplace.json';
import zhRewards from './locales/zh/translation_rewards.json';
import zhExchange from './locales/zh/translation_exchange.json';
import zhDao from './locales/zh/translation_dao.json';
import zhHelp from './locales/zh/translation_help.json';

import enCommon from './locales/en/translation_common.json';
import enMarketplace from './locales/en/translation_marketplace.json';
import enRewards from './locales/en/translation_rewards.json';
import enExchange from './locales/en/translation_exchange.json';
import enDao from './locales/en/translation_dao.json';
import enHelp from './locales/en/translation_help.json';

function buildLocaleTranslation(
  common: Record<string, unknown>,
  marketplace: Record<string, unknown>,
  rewards: Record<string, unknown>,
  exchange: Record<string, unknown>,
  dao: Record<string, unknown>,
  help: Record<string, unknown>,
  locale: 'zh' | 'en',
) {
  const merged = mergeTranslationBundles(
    common,
    marketplace,
    rewards,
    exchange,
    dao,
    help,
  );
  const helpRoot = (merged.help ?? {}) as Record<string, unknown>;
  return {
    ...merged,
    help: {
      ...helpRoot,
      topicQa: buildTopicQaI18nTree(locale),
    },
  };
}

const resources = {
  zh: {
    translation: buildLocaleTranslation(
      zhCommon as Record<string, unknown>,
      zhMarketplace as Record<string, unknown>,
      zhRewards as Record<string, unknown>,
      zhExchange as Record<string, unknown>,
      zhDao as Record<string, unknown>,
      zhHelp as Record<string, unknown>,
      'zh',
    ),
  },
  en: {
    translation: buildLocaleTranslation(
      enCommon as Record<string, unknown>,
      enMarketplace as Record<string, unknown>,
      enRewards as Record<string, unknown>,
      enExchange as Record<string, unknown>,
      enDao as Record<string, unknown>,
      enHelp as Record<string, unknown>,
      'en',
    ),
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
