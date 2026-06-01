import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译资源
import zhTranslation from './locales/zh/translation.json';
import enTranslation from './locales/en/translation.json';
import zhHelp from './locales/zh/help.json';
import enHelp from './locales/en/help.json';
import zhMarketplacePage from './locales/zh/marketplacePage';
import enMarketplacePage from './locales/en/marketplacePage.json';
import zhPaymentPage from './locales/zh/paymentPage';
import enPaymentPage from './locales/en/paymentPage';
import zhWalletNetworkExtras from './locales/zh/walletNetworkExtras';
import enWalletNetworkExtras from './locales/en/walletNetworkExtras';
import zhProductDetailExtras from './locales/zh/productDetailExtras';
import enProductDetailExtras from './locales/en/productDetailExtras';
import { buildTopicQaI18nTree } from '../pages/help/mocks/helpTopicQaCatalog';

function mergeWalletConnectExtras<T extends Record<string, unknown>>(base: T, extras: typeof zhWalletNetworkExtras): T {
  const baseWc = (base as { walletConnect?: Record<string, unknown> }).walletConnect ?? {};
  const extraWc = extras.walletConnect ?? {};
  return {
    ...base,
    walletConnect: {
      ...baseWc,
      ...extraWc,
      networks: {
        ...(baseWc.networks as Record<string, string> | undefined),
        ...(extraWc.networks as Record<string, string> | undefined),
      },
    },
  } as T;
}

const zhTranslationMerged = mergeWalletConnectExtras(zhTranslation, zhWalletNetworkExtras);
const enTranslationMerged = mergeWalletConnectExtras(enTranslation, enWalletNetworkExtras);

function mergeProductDetailExtras<T extends Record<string, unknown>>(
  base: T,
  extras: typeof zhProductDetailExtras,
): T {
  const basePd = (base as { productDetail?: Record<string, unknown> }).productDetail ?? {};
  const extraPd = extras.productDetail ?? {};
  return {
    ...base,
    productDetail: { ...basePd, ...extraPd },
  } as T;
}

const zhWithProductDetail = mergeProductDetailExtras(zhTranslationMerged, zhProductDetailExtras);
const enWithProductDetail = mergeProductDetailExtras(enTranslationMerged, enProductDetailExtras);

const resources = {
  zh: {
    translation: {
      ...zhWithProductDetail,
      ...zhHelp,
      ...zhMarketplacePage,
      ...zhPaymentPage,
      help: {
        ...zhHelp.help,
        topicQa: buildTopicQaI18nTree('zh'),
      },
    },
  },
  en: {
    translation: {
      ...enWithProductDetail,
      ...enHelp,
      ...enMarketplacePage,
      ...enPaymentPage,
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
