import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarketPlacePageDetail from '../pages/marketplace/MarketPlacePageDetail';
import RewardsPageDetail from '../pages/rewards/RewardsPageDetail';
import ExchangePageDetail from '../pages/exchange/ExchangePageDetail';
import DaoPageDetail from '../pages/dao/DaoPageDetail';
import HelpPageDetail from '../pages/help/HelpPageDetail';
import AdminIframeEmbedded from '../components/AdminIframeEmbedded';

const ContentLayout: React.FC = () => {
  return (
    <main className="relative w-full min-w-0 flex-1" style={{ overflow: 'visible' }}>
      <Routes>
        {/* 默认重定向到代币商城 */}
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        {/* 各功能页面路由 - 使用95%宽度容器（不设 h-full，避免内层撑满视口产生双滚动） */}
        <Route path="/marketplace" element={
          <div className="mx-auto w-[95%]">
            <MarketPlacePageDetail />
          </div>
        } />
        <Route path="/rewards" element={
          <div className="mx-auto w-[95%]">
            <RewardsPageDetail />
          </div>
        } />
        <Route path="/exchange" element={
          <div className="mx-auto w-[95%]">
            <ExchangePageDetail />
          </div>
        } />
        <Route path="/dao" element={
          <div className="mx-auto w-[95%]">
            <DaoPageDetail />
          </div>
        } />
        <Route path="/help" element={
          <div className="mx-auto w-[95%]">
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