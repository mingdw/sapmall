import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Result } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { useUserStore } from '../store/userStore';
import { useAccount } from 'wagmi';
import { x1Testnet } from 'wagmi/chains';

// 菜单项映射
const menuItemMapping: { [key: string]: string } = {
  'profile': 'profile',
  'orders': 'merchant-orders',
  'history': 'transactions',
  'settings': 'system-settings',
  'cart': 'product-management',
  'favorites': 'assets'
};

// 简化的状态类型
type ComponentState = 'loading' | 'success' | 'error';

interface ComponentStatus {
  state: ComponentState;
  error?: string;
  iframeUrl?: string;
}

const AdminIframeEmbedded: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, validateUserAccess } = useUserStore();
  const { address } = useAccount();
  
  // 简化的状态管理
  const [status, setStatus] = useState<ComponentStatus>({ state: 'loading' });

  // 获取目标菜单项
  const targetMenu = useMemo(() => {
    const menuParam = searchParams.get('menu') || 'dashboard';
    return menuItemMapping[menuParam] || menuParam;
  }, [searchParams]);
  

  // 构建iframe URL
  const buildIframeUrl = useCallback((): string => {
    const baseUrl = 'http://localhost:7101';
    
    if (!user || !address) {
      throw new Error('用户信息缺失');
    }

    const params = new URLSearchParams({
      menu: targetMenu,
      userId: user.id,
      userToken: user.token || '',
      userAddress: address,
      userRoles: user.roles?.join(',') || '',
      nickname: user.nickname || '',
      status: user.status.toString()
    });
    
    return `${baseUrl}/#/admin?${params.toString()}`;
  }, [user, address, targetMenu]);

  // 简化的加载逻辑
  const loadAdminInterface = useCallback(async () => {
    try {
      setStatus({ state: 'loading' });
      
      // 基本验证
      if (!user || !address) {
        // 如果用户未连接，直接跳转到首页
        console.log('用户未连接，跳转到首页');
        navigate('/marketplace');
        return;
      }
      
      // 构建iframe URL
      const iframeUrl = buildIframeUrl();
      setStatus({ state: 'success', iframeUrl });
      
    } catch (error) {
      // 如果是用户信息缺失的错误，直接跳转到首页
      if (error instanceof Error && error.message.includes('用户信息缺失')) {
        console.log('用户信息缺失，跳转到首页');
        navigate('/marketplace');
        return;
      }
      
      setStatus({ 
        state: 'error', 
        error: error instanceof Error ? error.message : '加载失败' 
      });
    }
  }, [user, address, buildIframeUrl, navigate]);

  // 简化的事件处理
  const handleBackToDapp = useCallback(() => {
    navigate('/marketplace');
  }, [navigate]);

  const handleRetry = useCallback(() => {
    loadAdminInterface();
  }, [loadAdminInterface]);

  // 监听用户连接状态变化
  useEffect(() => {
    // 如果用户断开连接，直接跳转到首页
    if (!user || !address) {
      console.log('检测到用户断开连接，跳转到首页');
      navigate('/marketplace');
      return;
    }
    
    // 如果用户已连接，加载管理界面
    loadAdminInterface();
  }, [user, address, targetMenu, loadAdminInterface, navigate]);

  // 简化的渲染逻辑
  const renderContent = () => {
    if (status.state === 'loading') {
      return (
        <div className="flex items-center justify-center h-full">
          <Spin size="large" />
          <span className="ml-2 text-gray-400">加载中...</span>
        </div>
      );
    }

    if (status.state === 'error') {
      return (
        <div className="h-full flex items-center justify-center p-6 bg-gray-900">
          <Result
            status="error"
            title="加载失败"
            subTitle={status.error || '请稍后重试'}
            extra={[
              <div key="buttons" className="flex gap-3 justify-center">
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={handleRetry}
                >
                  重试
                </Button>
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBackToDapp}
                >
                  返回
                </Button>
              </div>
            ]}
          />
        </div>
      );
    }

    if (status.state === 'success' && status.iframeUrl) {
      return (
        <div className="outer-container">
          <div className="inner-container">
            <iframe
              src={status.iframeUrl}
              className="w-full h-full border-0"
              title="Admin Content"
              style={{ 
                width: '100%',
                height: '100vh',
                border: 'none',
                outline: 'none'
              }}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full" style={{ position: 'relative', overflow: 'hidden' }}>
      {renderContent()}
    </div>
  );
};

export default AdminIframeEmbedded;