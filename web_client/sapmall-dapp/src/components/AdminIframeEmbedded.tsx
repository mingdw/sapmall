import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Result } from 'antd';
import { ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/userStore';
import { useAccount } from 'wagmi';
import { x1Testnet } from 'wagmi/chains';

/** 归一化为 Admin 识别的 zh | en */
function normalizeAdminLang(lang?: string | null): 'zh' | 'en' {
  if (!lang) return 'zh';
  return lang.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

// 菜单项映射：DApp 菜单 key → Admin 实际 component 路径
const menuItemMapping: { [key: string]: string } = {
  'profile':   'personal/profile',
  'security':  'personal/security',
  'notifications': 'personal/notifications',
  'orders':    'trading/orders',
  'cart':      'business/products',
  'settings':  'system/settings',
  'history':   'trading/orders',
  'favorites': 'business/products',
};

// 简化的状态类型
type ComponentState = 'loading' | 'success' | 'error';

interface ComponentStatus {
  state: ComponentState;
  error?: string;
  iframeUrl?: string;
}

interface OpenMerchantDepositMessage {
  type: 'OPEN_MERCHANT_DEPOSIT';
  payload?: {
    intentId?: string;
    amount?: string;
    token?: string;
    chainId?: number | string;
    contractAddress?: string;
    tokenAddress?: string;
    depositStatus?: number;
    returnPath?: string;
    expireAt?: string;
  };
}

const AdminIframeEmbedded: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user, validateUserAccess } = useUserStore();
  const { address } = useAccount();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 简化的状态管理
  const [status, setStatus] = useState<ComponentStatus>({ state: 'loading' });

  const adminLang = useMemo(
    () => normalizeAdminLang(i18n.language),
    [i18n.language]
  );

  // 获取目标菜单项
  const targetMenu = useMemo(() => {
    const menuParam = searchParams.get('menu') || 'dashboard';
    return menuItemMapping[menuParam] || menuParam;
  }, [searchParams]);

  // 构建iframe URL（携带 lang，首屏与 DApp 同步）
  const buildIframeUrl = useCallback((): string => {
    const baseUrl = process.env.REACT_APP_ADMIN_URL || 'http://localhost:7101';

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
      status: user.status.toString(),
      lang: adminLang,
    });

    return `${baseUrl}/#/admin?${params.toString()}`;
  }, [user, address, targetMenu, adminLang]);

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent<OpenMerchantDepositMessage>) => {
      if (!event?.data || event.data.type !== 'OPEN_MERCHANT_DEPOSIT') {
        return;
      }
      const payload = event.data.payload || {};
      const params = new URLSearchParams({
        tab: 'merchantDeposit',
        intentId: payload.intentId || '',
        amount: payload.amount || '',
        token: payload.token || 'USDT',
        chainId: String(payload.chainId || ''),
        contractAddress: payload.contractAddress || '',
        tokenAddress: payload.tokenAddress || '',
        depositStatus: String(payload.depositStatus ?? ''),
        returnPath: payload.returnPath || '/admin?menu=profile',
        expireAt: payload.expireAt || '',
      });
      navigate(`/exchange?${params.toString()}`);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // DApp 语言变更时实时同步到 Admin iframe（无需重建）
  useEffect(() => {
    const postLocale = (lang: string) => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage({ type: 'SET_LOCALE', lang: normalizeAdminLang(lang) }, '*');
    };

    const handleLanguageChanged = (lang: string) => {
      postLocale(lang);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    // 已加载完成时补发一次，避免竞态
    if (status.state === 'success') {
      postLocale(i18n.language);
    }

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, status.state]);

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
                  icon={<RefreshCw size={16} />}
                  onClick={handleRetry}
                >
                  重试
                </Button>
                <Button 
                  icon={<ArrowLeft size={16} />}
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
              ref={iframeRef}
              src={status.iframeUrl}
              className="w-full h-full border-0"
              title="Admin Content"
              style={{
                width: '100%',
                height: '100vh',
                border: 'none',
                outline: 'none',
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