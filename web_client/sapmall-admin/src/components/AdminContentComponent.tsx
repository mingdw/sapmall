import React from 'react';
import { Typography } from 'antd';
import ComponentMapper from './ComponentMapper';
import { CategoryTreeResp } from '../services/types/categoryTypes';

const { Title, Text } = Typography;

interface AdminContentComponentProps {
  selectedMenu: CategoryTreeResp | null;
}

const AdminContentComponent: React.FC<AdminContentComponentProps> = ({ selectedMenu }) => {
  // 渲染内容
  const renderContent = () => {
    if (!selectedMenu) {
      return (
        <div className="admin-content-welcome">
          <div className="welcome-icon">
            <i className="fas fa-mouse-pointer"></i>
          </div>
          <Title level={3} type="secondary" className="welcome-title">
            欢迎使用管理后台
          </Title>
          <Text type="secondary" className="welcome-subtitle">
            请从左侧菜单选择要查看的内容
          </Text>
        </div>
      );
    }

    // 检查是否为外部链接
    if (selectedMenu.is_external && selectedMenu.external_url) {
      return (
        <div className="admin-content-external">
          <div className="external-icon">
            <i className="fas fa-external-link-alt"></i>
          </div>
          <Title level={3} type="secondary" className="external-title">
            外部链接
          </Title>
          <Text type="secondary" className="external-subtitle">
            此菜单项指向外部链接
          </Text>
          <div className="external-actions">
            <button 
              className="external-button"
              onClick={() => window.open(selectedMenu.external_url, '_blank')}
            >
              <i className="fas fa-external-link-alt"></i>
              打开链接
            </button>
          </div>
        </div>
      );
    }

    // 根据component字段渲染对应的组件
    return (
      <div className="admin-content-main">
        <ComponentMapper 
          componentName={selectedMenu.component} 
          menuData={selectedMenu}
        />
      </div>
    );
  };

  return (
    <div className="admin-content-container">
      {renderContent()}
    </div>
  );
};

export default AdminContentComponent;
