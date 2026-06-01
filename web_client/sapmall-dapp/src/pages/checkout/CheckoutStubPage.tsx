import React from 'react';
import { Navigate } from 'react-router-dom';

/** 旧结算占位路由：301 至商城首页 */
const CheckoutStubPage: React.FC = () => <Navigate to="/marketplace" replace />;

export default CheckoutStubPage;
