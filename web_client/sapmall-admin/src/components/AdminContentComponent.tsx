import React from 'react';
import { Typography, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ComponentMapper from './ComponentMapper';
import { CategoryTreeResp } from '../services/types/categoryTypes';
import './AdminContentComponent.css';

const { Title, Text } = Typography;

interface AdminContentComponentProps {
  selectedMenu: CategoryTreeResp | null;
}

const AdminContentComponent: React.FC<AdminContentComponentProps> = ({ selectedMenu }) => {
  // 处理常见问题点击
  const handleHelpClick = () => {
    // 这里可以打开帮助弹窗或跳转到帮助页面
    console.log('打开常见问题帮助');
    // 可以根据 selectedMenu 的 help_key 或相关字段来显示对应的帮助内容
  };

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
        {/* 卡片标题头部 - 参考原型图设计 */}
        <div className="admin-content-card-header">
          <div className="admin-content-card-title">
            <i className={`fas ${selectedMenu.icon || 'fa-cog'}`}></i>
            <span>{selectedMenu.name}</span>
          </div>
          {/* 常见问题按钮 - 可能没有，根据菜单配置决定 */}
          {selectedMenu.help_key && (
            <Button 
              type="link" 
              size="small"
              icon={<QuestionCircleOutlined />}
              onClick={handleHelpClick}
              className="admin-content-help-btn"
            >
              常见问题
            </Button>
          )}
        </div>
        
        {/* 内容区域 */}
        <div className="admin-content-card-body">
          <ComponentMapper 
            componentName={selectedMenu.component} 
            menuData={selectedMenu}
          />
        </div>
      </div>
    );
  };

  return renderContent();
};

export default AdminContentComponent;
