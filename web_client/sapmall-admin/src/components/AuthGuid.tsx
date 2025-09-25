import React, { useEffect, useState, ReactNode } from 'react';
import { Spin, Alert, Button, Result } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useUserStore } from '../store/userStore';
import { userApi } from '../services/api/userApi';
import { IframeParams } from '../types';

interface AuthGuidProps {
  children: ReactNode;
  requiredRole?: string; // 可选的权限要求
  fallbackComponent?: ReactNode; // 自定义未授权时的组件
  onAuthSuccess?: () => void; // 授权成功回调
  onAuthFailure?: (error: string) => void; // 授权失败回调
  iframeParams?: IframeParams; // iframe参数
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

const AuthGuid: React.FC<AuthGuidProps> = ({
  children,
  requiredRole,
  fallbackComponent,
  onAuthSuccess,
  onAuthFailure,
  iframeParams
}) => {
  const {
    isUserLoggedIn,
    hasPermission,
    getCurrentUser,
    getCurrentUserToken,
    setUserFromIframe
  } = useUserStore();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    hasPermission: false
  });

  // 检查用户登录状态和权限
  const checkAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // 1. 检查本地存储的登录状态
      const isLoggedIn = isUserLoggedIn();
      const currentUser = getCurrentUser();
      const userToken = getCurrentUserToken();

      console.log('AuthGuid - 检查登录状态:', {
        isLoggedIn,
        currentUser,
        hasToken: !!userToken
      });

      // 2. 如果有iframe参数，先设置用户信息
      if (iframeParams && iframeParams.userToken && iframeParams.userId) {
        console.log('AuthGuid - 从iframe参数设置用户信息:', iframeParams);
        setUserFromIframe(iframeParams);
      }

      // 3. 验证token有效性（可选，根据实际需求）
      if (isLoggedIn && userToken) {
        try {
          // 尝试获取用户信息来验证token
          const userInfoResponse = await userApi.getUserInfo();
          console.log('AuthGuid - 用户信息验证成功:', userInfoResponse);
        } catch (error) {
          console.warn('AuthGuid - Token验证失败，但继续使用本地状态:', error);
          // 即使API调用失败，也继续使用本地状态
        }
      }

      // 4. 检查权限
      const hasRequiredPermission = requiredRole ? hasPermission(requiredRole) : true;

      // 5. 更新认证状态
      const newAuthState: AuthState = {
        isAuthenticated: isLoggedIn,
        isLoading: false,
        error: null,
        hasPermission: hasRequiredPermission
      };

      setAuthState(newAuthState);

      // 6. 触发回调
      if (isLoggedIn && hasRequiredPermission) {
        onAuthSuccess?.();
      } else if (!isLoggedIn) {
        onAuthFailure?.('用户未登录');
      } else if (!hasRequiredPermission) {
        onAuthFailure?.('权限不足');
      }

    } catch (error) {
      console.error('AuthGuid - 认证检查失败:', error);
      const errorMessage = error instanceof Error ? error.message : '认证检查失败';
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
        hasPermission: false
      });
      
      onAuthFailure?.(errorMessage);
    }
  };

  // 初始化和参数变化时检查认证
  useEffect(() => {
    checkAuth();
  }, [iframeParams, requiredRole]);

  // 重新检查认证
  const handleRetry = () => {
    checkAuth();
  };

  // 渲染加载状态
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">正在验证用户身份...</div>
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (authState.error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          <Alert
            message="认证失败"
            description={authState.error}
            type="error"
            icon={<ExclamationCircleOutlined />}
            action={
              <Button size="small" danger onClick={handleRetry}>
                重试
              </Button>
            }
            showIcon
          />
        </div>
      </div>
    );
  }

  // 渲染未登录状态
  if (!authState.isAuthenticated) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Result
          status="403"
          title="未登录"
          subTitle="请先登录后再访问此页面"
          extra={
            <Button type="primary" onClick={handleRetry} icon={<ReloadOutlined />}>
              重新检查
            </Button>
          }
        />
      </div>
    );
  }

  // 渲染权限不足状态
  if (!authState.hasPermission) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Result
          status="403"
          title="权限不足"
          subTitle={`您没有访问此页面的权限${requiredRole ? `（需要 ${requiredRole} 权限）` : ''}`}
          extra={
            <Button type="primary" onClick={handleRetry} icon={<ReloadOutlined />}>
              重新检查
            </Button>
          }
        />
      </div>
    );
  }

  // 认证成功，渲染子组件
  return <>{children}</>;
};

export default AuthGuid;
