import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from '../components/NotFound';

import PlatformDashboard from '../pages/platform/dashboard/PlatformDashboard';
import UserManagement from '../pages/platform/users/UserManage';
import MerchantManager from '../pages/platform/merchants/MerchantManager';
import OrderManager from '../pages/platform/orders/OrderManager';
import CategoryManagement from '../pages/platform/categories/CategoryManagement';
import DictionariesManager from '../pages/system/dictionaries/DictionariesManager';
import ChainNetManager from '../pages/system/chainnet/ChainNetManager';
import SystemSettingsPage from '../pages/system/settings/SystemSettingsPage';
import ProductManagement from '../pages/business/products/ProductManagement';
import ProfileManager from '../pages/personal/profile/ProfileManager';
import PersonalOrderManager from '../pages/trading/order/PersonalOrderManager';

interface AdminRouterProps {
  menuData?: any;
}

const AdminRouter: React.FC<AdminRouterProps> = ({ menuData }) => {
  return (
    <Routes>
      {/* 个人中心 */}
      <Route path="/personal/profile" element={<ProfileManager />} />

      {/* 交易管理 - 我的订单（与 sys_category U003001 path/component 一致） */}
      <Route path="/trading/orders" element={<PersonalOrderManager />} />
      <Route path="/personal/orders" element={<Navigate to="/trading/orders" replace />} />

      {/* 平台管理 */}
      <Route path="/platform/dashboard" element={<PlatformDashboard menuData={menuData} />} />
      <Route path="/platform/users" element={<UserManagement />} />
      <Route path="/platform/merchants" element={<MerchantManager />} />
      <Route path="/platform/orders" element={<OrderManager />} />
      <Route path="/platform/categories" element={<CategoryManagement />} />

      {/* 系统管理 */}
      <Route path="/system/dictionaries" element={<DictionariesManager />} />
      <Route path="/system/chainnet" element={<ChainNetManager />} />
      <Route path="/system/settings" element={<SystemSettingsPage />} />

      {/* 商品管理 */}
      <Route path="/business/products" element={<ProductManagement />} />

      <Route path="/" element={<Navigate to="/platform/dashboard" replace />} />
      <Route path="*" element={<NotFound componentName="未找到页面" />} />
    </Routes>
  );
};

export default AdminRouter;