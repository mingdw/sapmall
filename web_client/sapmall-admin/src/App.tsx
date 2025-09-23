import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import './i18n';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound';
import {  IframeParams } from './types';


// 解析URL参数并创建用户对象的组件
const AppContent: React.FC = () => {
  const location = useLocation();
  const [iframeParams, setIframeParams] = useState<IframeParams>({});

  useEffect(() => {
    // 解析URL参数
    const urlParams = new URLSearchParams(location.search);
    const params: IframeParams = {
      menu: urlParams.get('menu') || undefined,
      userId: urlParams.get('userId') || undefined,
      userToken: urlParams.get('userToken') || undefined,
      userAddress: urlParams.get('userAddress') || undefined,
      userRole: urlParams.get('userRole') || undefined,
      userRoles: urlParams.get('userRoles') || undefined,
      nickname: urlParams.get('nickname') || undefined,
      status: urlParams.get('status') || undefined
    };
    
    setIframeParams(params);
    
    // 如果有token，保存到localStorage
    if (params.userToken) {
      localStorage.setItem('authToken', params.userToken);
    }
    
    console.log('解析的iframe参数:', params);
  }, [location.search]);

  const handleLogout = () => {
    // 处理退出登录逻辑
    console.log('用户退出登录');
    localStorage.removeItem('authToken');
  };

  return (
    <AdminLayout onLogout={handleLogout} iframeParams={iframeParams}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* 嵌入式路由 - 用于在dapp中嵌入 */}
        <Route path="/admin" element={<Dashboard />} />
        {/* 其他路由将显示404页面，直到实际页面组件创建 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminLayout>
  );
};

const App: React.FC = () => {
  const { i18n } = useTranslation();
  
  // 根据当前语言选择对应的 Ant Design 语言包
  const antdLocale = i18n.language === 'en' ? enUS : zhCN;

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
