import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarketPlacePageDetail from '../pages/marketplace/MarketPlacePageDetail';
import RewardsRoutes from '../pages/rewards/RewardsRoutes';
import ExchangePageDetail from '../pages/exchange/ExchangePageDetail';
import DaoRoutes from '../pages/dao/DaoRoutes';
import HelpRoutes from '../pages/help/HelpRoutes';
import AdminIframeEmbedded from '../components/AdminIframeEmbedded';
import ProductDetailPage from '../pages/marketplace/product/ProductDetailPage';
import CheckoutStubPage from '../pages/checkout/CheckoutStubPage';
import CheckoutPage from '../pages/marketplace/payment/CheckoutPage';
import OrderResultPage from '../pages/marketplace/payment/OrderResultPage';

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
        <Route path="/marketplace/payment" element={
          <CheckoutPage />
        } />
        <Route path="/marketplace/payment/result/:orderCode" element={
          <OrderResultPage />
        } />
        <Route path="/checkout/stub" element={<CheckoutStubPage />} />
        <Route path="/rewards/*" element={
          <div className="mx-auto w-[95%]">
            <RewardsRoutes />
          </div>
        } />
        <Route path="/exchange" element={
          <div className="mx-auto w-[95%]">
            <ExchangePageDetail />
          </div>
        } />
        <Route path="/dao/*" element={<DaoRoutes />} />
        <Route path="/help/*" element={<HelpRoutes />} />
        <Route path="/admin" element={<AdminIframeEmbedded />} />
      </Routes>
    </main>
  );
};

export default ContentLayout;
