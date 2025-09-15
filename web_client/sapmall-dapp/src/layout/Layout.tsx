import React from 'react';
import HeaderPageDetail from '../pages/header/HeaderPageDetail';
import ContentLayout from './ContentLayout';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 整体宽度控制 - 95%宽度，自适应，居中 */}
      <div className="w-[95%] mx-auto">
        {/* Header 区域 - 固定高度 */}
        <HeaderPageDetail />
        
        {/* 主内容区域 - 由ContentLayout管理路由 */}
        <ContentLayout />
        
        {/* Footer 区域 - 自适应内容高度 */}
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
