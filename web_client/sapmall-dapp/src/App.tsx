import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { WagmiChainMismatchRecovery } from './components/WagmiChainMismatchRecovery';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import './i18n';
import './styles/dapp-common.css';
import Layout from './layout/Layout';
import { useCategoryStore } from './store/categoryStore';
import '@rainbow-me/rainbowkit/styles.css';

// 创建React Query客户端
const queryClient = new QueryClient();

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const clearCache = useCategoryStore((s) => s.clearCache);
  
  // 根据当前语言选择对应的 Ant Design 语言包
  const antdLocale = i18n.language === 'en' ? enUS : zhCN;

  // 语言切换时清空目录缓存，marketplace 页面 hook 会按新语言重新拉取
  useEffect(() => {
    const handleLanguageChanged = () => {
      clearCache();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, clearCache]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WagmiChainMismatchRecovery />
          <ConfigProvider locale={antdLocale}>
            <Router>
              <div className="App">
                <Layout />
              </div>
            </Router>
          </ConfigProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
