import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminRouter from '../router/AdminRouter';

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

  // 当组件名称改变时，导航到对应路由
  useEffect(() => {
    if (componentName && componentName !== location.pathname) {
      console.log('导航到路由:', componentName);
      navigate(componentName);
    }
  }, [componentName, navigate, location.pathname]);

  // 如果没有指定组件名称，显示404
  if (!componentName) {
    return <div>请选择菜单项</div>;
  }

  // 使用路由系统渲染组件
  return <AdminRouter menuData={menuData} />;
};

export default ComponentMapper;
