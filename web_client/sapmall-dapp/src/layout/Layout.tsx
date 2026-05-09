import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderPageDetail from '../pages/header/HeaderPageDetail';
import ContentLayout from './ContentLayout';
import FooterPageDetail from '../pages/footer/FooterPageDetail';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // 判断是否为admin路由
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div
      className={`flex flex-col bg-gray-900 text-white ${
        isAdminRoute ? 'h-screen min-h-0' : 'min-h-screen'
      }`}
    >
      {/* Header */}
      <div className="shrink-0">
        <HeaderPageDetail />
      </div>

      {isAdminRoute ? (
        /* Admin：固定视口高度，内层单独滚动（iframe） */
        <div className="min-h-0 flex-1 overflow-hidden">
          <ContentLayout />
        </div>
      ) : (
        <>
          {/* 普通页：整页一条滚动条，页脚紧跟主内容末尾 */}
          <div className="w-full min-w-0 flex-1">
            <ContentLayout />
          </div>
          <div className="shrink-0">
            <FooterPageDetail />
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
