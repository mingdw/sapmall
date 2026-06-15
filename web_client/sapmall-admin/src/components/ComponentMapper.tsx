import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminRouter from '../router/AdminRouter';
import { resolveMenuRoute } from '../router/menuRouteMap';

interface ComponentMapperProps {
  componentName?: string;
  menuData?: any;
}

const ComponentMapper: React.FC<ComponentMapperProps> = ({ 
  componentName, 
  menuData 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const resolvedRoute = useMemo(() => resolveMenuRoute(componentName), [componentName]);

  // 当组件名称改变时，导航到对应路由
  useEffect(() => {
    if (resolvedRoute && resolvedRoute !== location.pathname) {
      navigate(resolvedRoute);
    }
  }, [resolvedRoute, navigate, location.pathname]);

  // 如果没有指定组件名称，显示404
  if (!componentName) {
    return <div>请选择菜单项</div>;
  }

  // 使用路由系统渲染组件
  return <AdminRouter menuData={menuData} />;
};

export default ComponentMapper;
