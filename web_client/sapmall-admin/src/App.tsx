import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import './i18n';
import AdminLayout from './layout/AdminLayout';
import { IframeParams } from './types';
import { useCategoryStore } from './store/categoryStore';
import { normalizeUiLang, isEnglishUi } from './i18n/normalizeLang';

/** DApp → Admin 语言同步消息 */
interface SetLocaleMessage {
  type: 'SET_LOCALE';
  lang: string;
}

/** 允许接收语言同步的父页面来源 */
function isTrustedLocaleOrigin(origin: string): boolean {
  const configured = (process.env.REACT_APP_DAPP_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (configured.includes(origin)) return true;
  // 本地开发默认放行常见 DApp 端口
  if (/^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001|5173)$/.test(origin)) {
    return true;
  }
  return false;
}

// 解析URL参数并创建用户对象的组件
const AppContent: React.FC = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [iframeParams, setIframeParams] = useState<IframeParams>({});
  const [lastProcessedUrl, setLastProcessedUrl] = useState<string>('');

  // 初始化商品目录（menu_type=0，首次进入或 URL 语言变化时加载）
  const { fetchProductCategories, hasHydrated } = useCategoryStore();

  const urlLang = (() => {
    const fromSearch = new URLSearchParams(location.search).get('lang');
    if (fromSearch) return fromSearch;
    if (location.hash.includes('?')) {
      return new URLSearchParams(location.hash.split('?')[1]).get('lang');
    }
    return null;
  })();

  // URL 携带 lang 时驱动 i18n（首屏与 DApp 同步）
  useEffect(() => {
    if (!urlLang) return;
    const next = normalizeUiLang(urlLang);
    if (normalizeUiLang(i18n.language) !== next) {
      i18n.changeLanguage(next);
    }
  }, [urlLang, i18n]);

  // 接收 DApp postMessage 实时切语言
  useEffect(() => {
    const handleMessage = (event: MessageEvent<SetLocaleMessage>) => {
      if (!isTrustedLocaleOrigin(event.origin)) return;
      if (!event?.data || event.data.type !== 'SET_LOCALE') return;
      const next = normalizeUiLang(event.data.lang);
      if (normalizeUiLang(i18n.language) !== next) {
        i18n.changeLanguage(next);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [i18n]);

  useEffect(() => {
    if (!hasHydrated) return;
    fetchProductCategories().catch((error) => {
      console.error('初始化商品目录数据失败:', error);
    });
  }, [hasHydrated, fetchProductCategories, urlLang]);

  useEffect(() => {
    const currentUrl = `${location.pathname}${location.search}${location.hash}`;

    if (currentUrl === lastProcessedUrl) {
      return;
    }

    let searchParams = '';

    if (location.search) {
      searchParams = location.search;
    } else if (location.hash.includes('?')) {
      searchParams = location.hash.split('?')[1];
    }

    if (!searchParams) {
      return;
    }

    const urlParams = new URLSearchParams(searchParams);
    const params: IframeParams = {
      menu: urlParams.get('menu') || undefined,
      userId: urlParams.get('userId') || undefined,
      userToken: urlParams.get('userToken') || undefined,
      userAddress: urlParams.get('userAddress') || undefined,
      userRoles: urlParams.get('userRoles') || undefined,
      nickname: urlParams.get('nickname') || undefined,
      status: urlParams.get('status') || undefined,
    };

    const timer = setTimeout(() => {
      setIframeParams(params);
      setLastProcessedUrl(currentUrl);

      if (params.userToken) {
        localStorage.setItem('auth_token', params.userToken);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location.search, location.hash, lastProcessedUrl]);

  return <AdminLayout iframeParams={iframeParams} />;
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const refreshProductCategories = useCategoryStore((s) => s.refreshProductCategories);
  const clearProductCategoriesCache = useCategoryStore((s) => s.clearProductCategoriesCache);
  const clearCache = useCategoryStore((s) => s.clearCache);
  const clearCategoryListCache = useCategoryStore((s) => s.clearCategoryListCache);

  const antdLocale = isEnglishUi(i18n.language) ? enUS : zhCN;

  // dayjs 跟随 UI 语言
  useEffect(() => {
    dayjs.locale(isEnglishUi(i18n.language) ? 'en' : 'zh-cn');
  }, [i18n.language]);

  // 语言切换时刷新商品目录与后台菜单缓存
  useEffect(() => {
    const handleLanguageChanged = () => {
      clearProductCategoriesCache();
      clearCache();
      clearCategoryListCache();
      refreshProductCategories().catch((error) => {
        console.error('语言切换后刷新商品目录失败:', error);
      });
      // 通知布局层重拉菜单（AdminLayout 监听该事件）
      window.dispatchEvent(new CustomEvent('admin:locale-changed'));
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [
    i18n,
    clearProductCategoriesCache,
    clearCache,
    clearCategoryListCache,
    refreshProductCategories,
  ]);

  return (
    <ConfigProvider locale={antdLocale}>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
