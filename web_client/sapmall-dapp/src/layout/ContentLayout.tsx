import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarketPlacePageDetail from '../pages/marketplace/MarketPlacePageDetail';
import StakingPageDetail from '../pages/staking/StakingPageDetail';
import ExchangePageDetail from '../pages/exchange/ExchangePageDetail';
import DaoPageDetail from '../pages/dao/DaoPageDetail';
import HelpPageDetail from '../pages/help/HelpPageDetail';

const ContentLayout: React.FC = () => {
  return (
    <main className="flex-1 min-h-0">
      <Routes>
        {/* 默认重定向到代币商城 */}
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        {/* 各功能页面路由 */}
        <Route path="/marketplace" element={<MarketPlacePageDetail />} />
        <Route path="/staking" element={<StakingPageDetail />} />
        <Route path="/exchange" element={<ExchangePageDetail />} />
        <Route path="/dao" element={<DaoPageDetail />} />
        <Route path="/help" element={<HelpPageDetail />} />
      </Routes>
    </main>
  );
};

export default ContentLayout;