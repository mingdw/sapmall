import fs from 'fs';

const content = `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarketPlacePageDetail from '../pages/marketplace/MarketPlacePageDetail';
import RewardsPageDetail from '../pages/rewards/RewardsPageDetail';
import ExchangePageDetail from '../pages/exchange/ExchangePageDetail';
import DaoPageDetail from '../pages/dao/DaoPageDetail';
import HelpPageDetail from '../pages/help/HelpPageDetail';
import AdminIframeEmbedded from '../components/AdminIframeEmbedded';
import ProductDetailPage from '../pages/product/ProductDetailPage';
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
        <Route path="/product/:productCode" element={
          <motionless />
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
        <Route path="/admin" element={<AdminIframeEmbedded />} />
      </Routes>
    </main>
  );
};

export default ContentLayout;
`;

const D = 'motionless';
const fixed = content
  .replace(/<motionless \/>/g, '')
  .replace(/<motionless>/g, '<' + 'div className="mx-auto w-[95%]">')
  .replace(/<\/motionless>/g, '</' + 'div>')
  .replace(
    '<Route path="/product/:productCode" element={\n          \n        } />',
    `<Route path="/product/:productCode" element={
          <div className="mx-auto w-[95%]">
            <ProductDetailPage />
          </div>
        } />`
  );

// manual fix product route - the template above is messy, write final directly
const final = `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarketPlacePageDetail from '../pages/marketplace/MarketPlacePageDetail';
import RewardsPageDetail from '../pages/rewards/RewardsPageDetail';
import ExchangePageDetail from '../pages/exchange/ExchangePageDetail';
import DaoPageDetail from '../pages/dao/DaoPageDetail';
import HelpPageDetail from '../pages/help/HelpPageDetail';
import AdminIframeEmbedded from '../components/AdminIframeEmbedded';
import ProductDetailPage from '../pages/product/ProductDetailPage';
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
        <Route path="/product/:productCode" element={
          <motionless />
        } />
        <Route path="/checkout/stub" element={
          <div className="mx-auto w-[95%]">
            <CheckoutStubPage />
          </div>
        } />
        <Route path="/rewards" element={
          <div className="mx-auto w-[95%]">
            <RewardsPageDetail />
          </motionless>
        } />
        <Route path="/exchange" element={
          <div className="mx-auto w-[95%]">
            <ExchangePageDetail />
          </motionless>
        } />
        <Route path="/dao" element={
          <div className="mx-auto w-[95%]">
            <DaoPageDetail />
          </motionless>
        } />
        <Route path="/help" element={
          <div className="mx-auto w-[95%]">
            <HelpPageDetail />
          </motionless>
        } />
        <Route path="/admin" element={<AdminIframeEmbedded />} />
      </Routes>
    </main>
  );
};

export default ContentLayout;
`;

const out = final
  .split('motionless').join('div')
  .replace('<div />', `<div className="mx-auto w-[95%]">
            <ProductDetailPage />
          </div>`);

fs.writeFileSync(
  new URL('../src/layout/ContentLayout.tsx', import.meta.url),
  out
);
console.log('fixed');
