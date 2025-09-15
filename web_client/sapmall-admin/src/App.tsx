import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import './i18n';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const { i18n } = useTranslation();
  
  // 根据当前语言选择对应的 Ant Design 语言包
  const antdLocale = i18n.language === 'en' ? enUS : zhCN;

  return (
    <ConfigProvider locale={antdLocale}>
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
