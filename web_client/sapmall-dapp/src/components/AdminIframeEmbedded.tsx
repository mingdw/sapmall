import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Result, Card, Space, Typography } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { useUserStore } from '../store/userStore';
import { useAccount } from 'wagmi';

// 菜单项映射 - 将dapp用户菜单项映射到admin菜单项
const menuItemMapping: { [key: string]: string } = {
  'profile': 'profile',           // 个人资料 -> 个人信息
  'orders': 'merchant-orders',    // 我的订单 -> 订单管理 (merchant) 或 admin-orders (admin)
  'history': 'transactions',      // 交易历史 -> 交易记录
  'settings': 'system-settings',  // 设置 -> 系统设置
  'cart': 'product-management',   // 购物车 -> 商品管理 (merchant)
  'favorites': 'assets'           // 收藏 -> 资产管理
};

const AdminIframeEmbedded: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, validateUserAccess } = useUserStore();
  const { address } = useAccount();
  
  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [iframeHeight, setIframeHeight] = useState('calc(100vh - 100px)');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  // 获取目标菜单项
  const targetMenu = searchParams.get('menu') || 'dashboard';
  

  // 校验用户登录状态和权限 - 使用userStore的方法
  const validateUserAccessLocal = async (): Promise<{ isValid: boolean; error?: string }> => {
    try {
      setIsValidating(true);
      setValidationError(null);
      
      console.log('开始校验用户权限:', { user, address });
      
      // 使用userStore的校验方法
      const result = await validateUserAccess();
      
      console.log('校验结果:', result);
      return result;
    } catch (error) {
      console.error('用户权限校验失败:', error);
      return { isValid: false, error: '权限校验失败，请重新登录' };
    } finally {
      setIsValidating(false);
    }
  };

  // 构建iframe的URL，包含用户身份信息
  const buildIframeUrl = async () => {
    const baseUrl = 'http://localhost:7101';
    
    // 先进行用户权限校验
    const validation = await validateUserAccessLocal();
    if (!validation.isValid) {
      setValidationError(validation.error || '权限校验失败');
      return null;
    }

    const userToken = user!.token;
    
    // 构建带参数的URL
    const params = new URLSearchParams({
      menu: targetMenu,
      userId: user!.id,
      userToken: userToken,
      userAddress: address!,
      userRoles: user!.roles?.join(',') || '',
      nickname: user!.nickname || '',
      status: user!.status.toString()
    });
    
    const fullUrl = `${baseUrl}/#/admin?${params.toString()}`;
    
    console.log('Admin iframe URL:', fullUrl);
    console.log('User info:', { user, address, targetMenu });
    return fullUrl;
  };

  // 返回dapp主页
  const handleBackToDapp = () => {
    navigate('/marketplace');
  };

  // 处理校验失败
  const handleValidationFailure = (error: string) => {
    setValidationError(error);
    setIframeError(true);
    setLoading(false);
  };

  // 重新校验并加载
  const handleRetryValidation = async () => {
    setValidationError(null);
    setIframeError(false);
    setLoading(true);
    
    try {
      const url = await buildIframeUrl();
      if (url) {
        // 如果校验通过，重新加载iframe
        const iframe = document.querySelector('iframe[title="Admin Content"]') as HTMLIFrameElement;
        if (iframe) {
          iframe.src = url;
        }
      }
    } catch (error) {
      console.error('重新校验失败:', error);
      handleValidationFailure('重新校验失败，请刷新页面重试');
    }
  };

  // 处理iframe加载错误
  const handleIframeError = () => {
    console.log('Admin iframe failed to load');
    setIframeError(true);
    setLoading(false);
  };

  // 处理iframe加载成功
  const handleIframeLoad = () => {
    console.log('Admin iframe loaded successfully');
    setIframeError(false);
    setLoading(false);
    
    // 尝试调整iframe高度以适应内容
    try {
      const iframe = document.querySelector('iframe[title="Admin Content"]') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        // 监听iframe内容高度变化
        const checkHeight = () => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              const bodyHeight = iframeDoc.body?.scrollHeight || iframeDoc.documentElement?.scrollHeight;
              if (bodyHeight && bodyHeight > 0) {
                const newHeight = Math.max(bodyHeight + 20, window.innerHeight - 100);
                setIframeHeight(`${newHeight}px`);
              }
            }
          } catch (e) {
            // 跨域限制，使用默认高度
            console.log('Cannot access iframe content due to CORS');
          }
        };
        
        // 延迟检查高度，确保内容已加载
        setTimeout(checkHeight, 1000);
        iframe.contentWindow.addEventListener('resize', checkHeight);
      }
    } catch (e) {
      console.log('Cannot adjust iframe height:', e);
    }
  };

  // 获取角色显示名称
  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin: '超级管理员',
      merchant: '认证商户',
      user: '普通用户'
    };
    return roleMap[role] || '未知角色';
  };

  // 获取用户角色代码显示名称
  const getUserRoleDisplayName = () => {
    if (!user?.roles || user.roles.length === 0) {
      return '无角色';
    }
    
    const roleNames: { [key: string]: string } = {
      'R0001': '超级管理员',
      'R0002': '认证商户', 
      'R0003': '普通用户'
    };
    
    const validRoles = user.roles.filter(role => roleNames[role]);
    if (validRoles.length > 0) {
      return validRoles.map(role => roleNames[role]).join(', ');
    }
    
    return '未知角色';
  };

  // Iframe组件，支持异步URL构建
  const IframeWithValidation: React.FC = () => {
    useEffect(() => {
      const loadIframe = async () => {
        try {
          const url = await buildIframeUrl();
          if (url) {
            setIframeUrl(url);
          } else {
            handleValidationFailure(validationError || '无法构建iframe URL');
          }
        } catch (error) {
          console.error('构建iframe URL失败:', error);
          handleValidationFailure('构建iframe URL失败');
        }
      };
      
      loadIframe();
    }, [targetMenu]);

    if (!iframeUrl) {
      return (
        <div className="flex items-center justify-center h-full">
          <Spin size="large" />
          <span className="ml-2 text-gray-400">
            {isValidating ? '校验用户权限中...' : '加载Admin界面中...'}
          </span>
        </div>
      );
    }

    return (
      <iframe
        src={iframeUrl}
        className="w-full border-0"
        title="Admin Content"
        onError={handleIframeError}
        onLoad={handleIframeLoad}
        style={{ 
          display: loading ? 'none' : 'block',
          width: '100%',
          height: iframeHeight,
          minHeight: '90vh',
          border: 'none',
          outline: 'none',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden'
        }}
      />
    );
  };

  useEffect(() => {
    // 设置加载状态
    setLoading(true);
    setIframeError(false);
    setValidationError(null);
    setIframeUrl(null);
  }, [targetMenu]);

  return (
    <div className="w-[95%] mx-auto h-full text-white">
      {/* 主容器 - 与代币商城首页保持一致 */}
      <div className="w-full h-full">
        {/* iframe容器 - 占据全部空间，允许滚动 */}
        <div className="w-full h-full overflow-auto rounded-lg border border-gray-700">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Spin size="large" />
              <span className="ml-2 text-gray-400">加载Admin界面中...</span>
            </div>
          )}
          
          {!iframeError && !validationError ? (
            <IframeWithValidation />
          ) : (
            /* 备用内容 - 当iframe加载失败或校验失败时显示 */
            <div className="h-full flex items-center justify-center p-6 bg-gray-900">
              <div className="max-w-2xl w-full bg-gray-800 border border-gray-700 rounded-lg shadow-2xl">
                {/* 关闭按钮 */}
                <div className="flex justify-end p-4 border-b border-gray-700">
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBackToDapp}
                    className="text-gray-400 hover:text-white"
                  >
                    关闭
                  </Button>
                </div>
                
                {/* 错误内容 */}
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {validationError ? "访问权限验证失败" : "管理界面暂时无法访问"}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {validationError || "我们正在努力修复这个问题，请稍后再试"}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-300 text-sm">
                      {validationError 
                        ? validationError.includes('角色权限不足') 
                          ? `当前用户角色：${getUserRoleDisplayName()}，需要R0001、R0002或R0003角色才能访问管理界面`
                          : "请检查您的登录状态和权限设置"
                        : "可能的原因：服务正在维护中或网络连接异常"
                      }
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {validationError ? (
                      <Button 
                        type="primary" 
                        icon={<i className="fas fa-wallet"></i>}
                        onClick={() => navigate('/marketplace')}
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                      >
                        连接钱包
                      </Button>
                    ) : (
                      <Button 
                        type="primary" 
                        icon={<ReloadOutlined />}
                        onClick={() => window.location.reload()}
                        size="large"
                        className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                      >
                        重新加载
                      </Button>
                    )}
                    <Button 
                      icon={<HomeOutlined />}
                      onClick={handleBackToDapp}
                      size="large"
                      className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                    >
                      返回首页
                    </Button>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <p className="text-gray-500 text-xs">
                      {validationError 
                        ? "如果问题持续存在，请重新登录或联系技术支持"
                        : "如果问题持续存在，请联系技术支持"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIframeEmbedded;