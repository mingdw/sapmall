import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from '../components/NotFound';

// 导入页面组件
import PlatformDashboard from '../pages/platform/dashboard/PlatformDashboard';
import UserManagement from '../pages/platform/users/UserManage';
import MerchantManager from '../pages/platform/merchants/MerchantManager';
import CategoryManger from '../pages/platform/categories/CategoryManger';
import OrderManager from '../pages/platform/orders/OrderManager';

interface AdminRouterProps {
  menuData?: any;
}

const AdminRouter: React.FC<AdminRouterProps> = ({ menuData }) => {
  return (
    <Routes>
      {/* 平台管理路由 */}
      <Route path="/platform/dashboard" element={<PlatformDashboard menuData={menuData} />} />
      
      {/* 用户管理路由 */}
      <Route path="/platform/users" element={<UserManagement />} />
      
      {/* 商户管理路由 */}
      <Route path="/platform/merchants" element={<MerchantManager />} />
      
      {/* 订单管理路由 */}
      <Route path="/platform/orders" element={<OrderManager />} />
      
      {/* 商品目录设置路由 */}
      <Route path="/platform/categories" element={<CategoryManger />} />
      
      <Route path="/" element={<Navigate to="/platform/dashboard" replace />} />
      
      {/* 404 路由 - 如果路径不匹配，显示404 */}
      <Route path="*" element={<NotFound componentName="未找到页面" />} />
    </Routes>
  );
};

export default AdminRouter;
