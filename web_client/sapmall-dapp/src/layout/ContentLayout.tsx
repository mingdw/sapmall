import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarketPlacePageDetail from '../pages/marketplace/MarketPlacePageDetail';
import RewardsPageDetail from '../pages/rewards/RewardsPageDetail';
import ExchangePageDetail from '../pages/exchange/ExchangePageDetail';
import DaoRoutes from '../pages/dao/DaoRoutes';
import DaoLayout from '../pages/dao/DaoLayout';
import HelpPageDetail from '../pages/help/HelpPageDetail';
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
        <Route path="/dao/*" element={
          <DaoLayout>
            <DaoRoutes />
          </DaoLayout>
        } />
        <Route path="/help" element={
          <div className="mx-auto w-[95%]">
            <HelpPageDetail />
          </div>
        } />
        <Route path="/admin" element={<AdminIframeEmbedded />} />
      </Routes>
    </main>
  );
};

export default ContentLayout;
