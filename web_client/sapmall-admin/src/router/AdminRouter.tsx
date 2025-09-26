import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from '../components/NotFound';

// 导入页面组件
import PlatformDashboard from '../pages/platform/dashboard/PlatformDashboard';
import UserManagement from '../pages/platform/users/UserManage';

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
      {/* <Route path="/user/profile" element={<UserProfile menuData={menuData} />} /> */}
      
      {/* 订单管理路由 */}
      {/* <Route path="/order/management" element={<OrderManagement menuData={menuData} />} /> */}
      {/* <Route path="/order/statistics" element={<OrderStatistics menuData={menuData} />} /> */}
      
      {/* 系统管理路由 */}
      {/* <Route path="/system/settings" element={<SystemSettings menuData={menuData} />} /> */}
      {/* <Route path="/system/logs" element={<SystemLogs menuData={menuData} />} /> */}
      
      {/* DAO治理路由 */}
      {/* <Route path="/dao/governance" element={<DAOGovernance menuData={menuData} />} /> */}
      {/* <Route path="/dao/proposals" element={<DAOProposals menuData={menuData} />} /> */}
      
      {/* 默认路由 - 重定向到平台概览 */}
      <Route path="/" element={<Navigate to="/platform/dashboard" replace />} />
      
      {/* 404 路由 - 如果路径不匹配，显示404 */}
      <Route path="*" element={<NotFound componentName="未找到页面" />} />
    </Routes>
  );
};

export default AdminRouter;
