import React from 'react';
import { Button } from 'antd';
import { HomeOutlined, ReloadOutlined, RocketOutlined } from '@ant-design/icons';

interface NotFoundProps {
  componentName?: string;
  onGoHome?: () => void;
  onRefresh?: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ 
  componentName, 
  onGoHome, 
  onRefresh 
}) => {
  return (
    <div className="web3-coming-soon">
      <div className="coming-soon-container">
        {/* 背景装饰 */}
        <div className="bg-decoration">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        {/* 主要内容 */}
        <div className="coming-soon-content">
          <div className="icon-container">
            <div className="web3-icon">
              <i className="fas fa-cube"></i>
            </div>
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
          
          <h1 className="coming-soon-title">
            页面建设中
          </h1>
          
          <p className="coming-soon-subtitle">
            {componentName 
              ? `"${componentName}" 功能正在开发中` 
              : "您访问的页面正在建设中"
            }
          </p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">开发进度: 75%</span>
          </div>
          
          <div className="feature-preview">
            <div className="feature-item">
              <i className="fas fa-shield-alt"></i>
              <span>安全可靠</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-bolt"></i>
              <span>快速响应</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-users"></i>
              <span>用户友好</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <Button 
              type="primary" 
              icon={<HomeOutlined />} 
              onClick={onGoHome}
              className="web3-button primary"
            >
              返回首页
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={onRefresh}
              className="web3-button secondary"
            >
              刷新页面
            </Button>
          </div>
          
          <div className="coming-soon-footer">
            <div className="footer-icon">
              <RocketOutlined />
            </div>
            <span>敬请期待更多精彩功能</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;