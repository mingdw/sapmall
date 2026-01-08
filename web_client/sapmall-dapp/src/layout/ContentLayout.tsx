import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarketPlacePageDetail from '../pages/marketplace/MarketPlacePageDetail';
import ProductDetailPage from '../pages/marketplace/ProductDetailPage';
import RewardsPageDetail from '../pages/rewards/RewardsPageDetail';
import ExchangePageDetail from '../pages/exchange/ExchangePageDetail';
import DaoPageDetail from '../pages/dao/DaoPageDetail';
import HelpPageDetail from '../pages/help/HelpPageDetail';
import AdminIframeEmbedded from '../components/AdminIframeEmbedded';

const ContentLayout: React.FC = () => {
  return (
    <main className="flex-1 min-h-0" style={{ overflow: 'visible', position: 'relative' }}>
      <Routes>
        {/* 默认重定向到代币商城 */}
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        {/* 各功能页面路由 - 使用95%宽度容器 */}
        <Route
          path="/marketplace/product/:productId"
          element={
            <div className="w-[95%] mx-auto h-full">
              <ProductDetailPage />
            </div>
          }
        />
        <Route path="/marketplace" element={
          <div className="w-[95%] mx-auto h-full">
            <MarketPlacePageDetail />
          </div>
        } />
        <Route path="/rewards" element={
          <div className="w-[95%] mx-auto h-full">
            <RewardsPageDetail />
          </div>
        } />
        <Route path="/exchange" element={
          <div className="w-[95%] mx-auto h-full">
            <ExchangePageDetail />
          </div>
        } />
        <Route path="/dao" element={
          <div className="w-[95%] mx-auto h-full">
            <DaoPageDetail />
          </div>
        } />
        <Route path="/help" element={
          <div className="w-[95%] mx-auto h-full">
            <HelpPageDetail />
          </div>
        } />
        {/* 后台管理路由 - 使用iframe嵌入admin系统，不使用容器限制 */}
        <Route path="/admin" element={<AdminIframeEmbedded />} />
      </Routes>
    </main>
  );
};

export default ContentLayout;