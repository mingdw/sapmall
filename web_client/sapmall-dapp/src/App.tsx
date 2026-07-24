import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, type Locale } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi';
import { sapmallRainbowKitTheme } from './config/rainbowKitTheme';
import { WagmiChainMismatchRecovery } from './components/WagmiChainMismatchRecovery';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import './i18n';
import './styles/dapp-common.css';
import './styles/rainbowkit-overrides.css';
import Layout from './layout/Layout';
import { useCategoryStore } from './store/categoryStore';
import { useChainConfigInit } from './hooks/useChainConfigInit';
import { useCctpSourceBalancePrefetch } from './hooks/useCctpSourceBalancePrefetch';
import '@rainbow-me/rainbowkit/styles.css';

// 降低链上查询默认重试与焦点刷新，减轻公共 RPC 限流（429）
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 12_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/** 必须在 WagmiProvider 内：钱包连接后按链配置预取 CCTP 源链余额 */
const CctpSourceBalancePrefetch: React.FC = () => {
  useCctpSourceBalancePrefetch();
  return null;
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const clearCache = useCategoryStore((s) => s.clearCache);

  // 初始化链配置（可与钱包无关，放在 Provider 外即可）
  useChainConfigInit();

  // 根据当前语言选择对应的 Ant Design 语言包
  const antdLocale = i18n.language === 'en' ? enUS : zhCN;
  const rainbowKitLocale = useMemo<Locale>(
    () => (i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US'),
    [i18n.language],
  );

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
        <RainbowKitProvider
          theme={sapmallRainbowKitTheme}
          locale={rainbowKitLocale}
          // wide：左侧钱包列表 + 右侧引导/二维码；compact 会去掉右侧区域
          modalSize="wide"
          coolMode
          appInfo={{
            appName: 'Sapphire Mall',
            learnMoreUrl: 'https://sapmall.xyz',
          }}
        >
          <WagmiChainMismatchRecovery />
          <CctpSourceBalancePrefetch />
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
