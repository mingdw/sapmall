import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderPageDetail from '../pages/header/HeaderPageDetail';
import ContentLayout from './ContentLayout';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // 判断是否为admin路由
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div 
      className={`${isAdminRoute ? 'min-h-screen' : 'h-screen'} bg-gray-900 text-white flex flex-col`}
    >
      {/* Header 区域 - 始终显示 */}
      <HeaderPageDetail />
      
      {/* 主内容区域 - 由ContentLayout管理路由，占据剩余空间 */}
      <div className={`${isAdminRoute ? 'flex-1' : 'flex-1 min-h-0'}`}>
        <ContentLayout />
      </div>
      
      {/* Footer 区域 - 自适应内容高度 */}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
