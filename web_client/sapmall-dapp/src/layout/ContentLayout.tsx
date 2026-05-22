import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarketPlacePageDetail from '../pages/marketplace/MarketPlacePageDetail';
import RewardsPageDetail from '../pages/rewards/RewardsPageDetail';
import ExchangePageDetail from '../pages/exchange/ExchangePageDetail';
import DaoPage from '../pages/dao/DaoPage';
import HelpRoutes from '../pages/help/HelpRoutes';
import AdminIframeEmbedded from '../components/AdminIframeEmbedded';
import ProductDetailPage from '../pages/marketplace/product/ProductDetailPage';
import CheckoutStubPage from '../pages/checkout/CheckoutStubPage';

const ContentLayout: React.FC = () => {
  return (
    <main className="relative w-full min-w-0 flex-1" style={{ overflow: 'visible' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/marketplace" replace />} />
        <Route path="/marketplace" element={
          <div className="mx-auto w-[95%]">
            <MarketPlacePageDetail />
          </div>
        } />
        <Route path="/marketplace/product/:productCode" element={
          <div className="mx-auto w-[95%]">
            <ProductDetailPage />
          </div>
        } />
        <Route path="/checkout/stub" element={
          <div className="mx-auto w-[95%]">
            <CheckoutStubPage />
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
        <Route path="/dao" element={<DaoPage />} />
        <Route path="/dao/*" element={<DaoPage />} />
        <Route path="/help/*" element={<HelpRoutes />} />
        <Route path="/admin" element={<AdminIframeEmbedded />} />
      </Routes>
    </main>
  );
};

export default ContentLayout;
