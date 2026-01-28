import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import './i18n';
import AdminLayout from './layout/AdminLayout';
import {  IframeParams } from './types';
import { useUserStore } from './store/userStore';
import { useCategoryStore } from './store/categoryStore';


// 解析URL参数并创建用户对象的组件
const AppContent: React.FC = () => {
  const location = useLocation();
  const [iframeParams, setIframeParams] = useState<IframeParams>({});
  const [lastProcessedUrl, setLastProcessedUrl] = useState<string>('');
  
  // 初始化商品目录（menu_type=0，首次进入后台管理时加载）
  const { fetchProductCategories, hasHydrated } = useCategoryStore();
  
  // 在应用启动时初始化商品目录
  useEffect(() => {
    if (!hasHydrated) return;
    console.log('应用启动，初始化商品目录数据（menu_type=0）');
    fetchProductCategories().catch(error => {
      console.error('初始化商品目录数据失败:', error);
    });
  }, [hasHydrated, fetchProductCategories]);

  useEffect(() => {
    // 构建当前完整的URL标识
    const currentUrl = `${location.pathname}${location.search}${location.hash}`;
    
    // 如果URL没有实际变化，跳过处理
    if (currentUrl === lastProcessedUrl) {
      return;
    }
    
    // 解析URL参数 - 支持hash路由和普通路由
    let searchParams = '';
    
    if (location.search) {
      // 普通路由：/admin?params
      searchParams = location.search;
    } else if (location.hash.includes('?')) {
      // Hash路由：/#/admin?params
      searchParams = location.hash.split('?')[1];
    }
    
    // 如果没有搜索参数，跳过处理
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
      status: urlParams.get('status') || undefined
    };
    
    // 防抖处理，避免快速连续更新
    const timer = setTimeout(() => {
      setIframeParams(params);
      setLastProcessedUrl(currentUrl);
      console.log('解析的iframe参数:', params);
      
      // 将传递的token保存到localStorage
      if (params.userToken) {
        localStorage.setItem('auth_token', params.userToken);
      }
    }, 50); // 50ms防抖
    
    return () => clearTimeout(timer);
  }, [location.search, location.hash, lastProcessedUrl]);



  return (
    <AdminLayout iframeParams={iframeParams}>
      
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
