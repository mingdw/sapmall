/**
 * 受保护的路由组件
 * 确保只有经过认证的用户才能访问
 */

import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>请先登录</div> 
}) => {
  const { isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>认证错误: {error}</div>;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;