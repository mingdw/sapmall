import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'antd';
import { useConnect, useDisconnect, useAccount, useBalance, useSignMessage, useSwitchChain } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { commonApiService } from '../../../services/api/commonApiService';
import { useUserStore } from '../../../store/userStore';
import MessageUtils from '../../../utils/messageUtils';
import { userApiService } from '../../../services/api/userApiService';
import styles from './WalletConnect.module.scss';
import { UserStatus } from '../../../services/types/userTypes';

/** 与语言无关的错误码，供静默处理分支识别 */
const WALLET_ERR_USER_REJECTED_SIGN = 'WALLET_ERR_USER_REJECTED_SIGN';
const WALLET_ERR_AUTH_REVOKED = 'WALLET_ERR_AUTH_REVOKED';

function isSilentWalletAuthMessage(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message === WALLET_ERR_USER_REJECTED_SIGN ||
    message === WALLET_ERR_AUTH_REVOKED
  );
}

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const { t, ready } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isProcessingConnection, setIsProcessingConnection] = useState(false);
  const [lastProcessedAddress, setLastProcessedAddress] = useState<string | null>(null);
  const signingRef = useRef<boolean>(false);

  // Wagmi hooks
  const { status: connectStatus, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({
    address: isConnected ? address : undefined,
    chainId,
  });
  const { signMessageAsync } = useSignMessage();
  const { switchChain } = useSwitchChain();
  const isPending = connectStatus === 'pending';

  // Zustand store
  const { 
    user, 
    tokenBalances, 
    isLoggedIn, 
    setUser, 
    setTokenBalances, 
    setLoggedIn, 
    setConnected,
    setStatus,
    setAuthToken,
    login,
    logout 
  } = useUserStore();

  // 同步wagmi连接状态到userStore
  useEffect(() => {
    console.log('同步连接状态到userStore:', { isConnected, address });
    setConnected(isConnected);
    setStatus(isConnected ? UserStatus.ACTIVE : UserStatus.INACTIVE);
    
    // 当钱包完全断开连接时，清理所有状态
    if (!isConnected && !address) {
      console.log('钱包完全断开，清理所有状态');
      setConnectionError(null);
      setIsConnecting(false);
      setIsDisconnecting(false);
      setIsProcessingConnection(false);
      setLastProcessedAddress(null);
      signingRef.current = false;
    }
  }, [isConnected, address, setConnected, setStatus]);

  // 监听连接状态变化
  useEffect(() => {
    console.log('连接状态变化:', { isConnected, address, isLoggedIn, isConnecting, isDisconnecting, isProcessingConnection, lastProcessedAddress });
    
    // 防止在断开连接过程中触发重新连接
    if (isDisconnecting) {
      console.log('正在断开连接中，跳过状态处理');
      return;
    }
    
    // 防止重复处理连接
    if (isConnecting || isProcessingConnection) {
      console.log('正在连接中，跳过重复处理');
      return;
    }
    
    // 防止重复处理同一个地址
    if (isConnected && address && address === lastProcessedAddress) {
      console.log('地址已处理过，跳过重复处理:', address);
      return;
    }
    
    // 只有在真正连接且有地址且未登录时才处理连接
    if (isConnected && address && !isLoggedIn) {
      console.log('开始处理钱包连接...');
      setLastProcessedAddress(address);
      handleWalletConnected(address);
    } 
    // 只有在真正断开连接且已登录时才处理断开
    else if (!isConnected && isLoggedIn && address === undefined) {
      console.log('开始处理钱包断开连接...');
      setLastProcessedAddress(null);
      handleWalletDisconnected();
    }
  }, [isConnected, address, isLoggedIn, isDisconnecting, isProcessingConnection, lastProcessedAddress]);

  // 监听钱包错误
  useEffect(() => {
    if (error) {
      console.error('钱包错误:', error);
      
      // 检查是否是授权相关错误
      const isAuthError = error.message?.includes('UnauthorizedProviderError') || 
                         error.message?.includes('not authorized') ||
                         error.message?.includes('The requested account and/or method has not been authorized') ||
                         error.message?.includes('User rejected') ||
                         error.message?.includes('rejected') ||
                         error.name === 'UserRejectedRequestError';
      
      if (isAuthError) {
        console.log('检测到授权错误，清理状态并静默处理...');
        
        // 静默清理状态，不显示错误提示
        setIsDisconnecting(true);
        logout();
        
        // 清理所有连接相关状态
        setConnectionError(null);
        setIsConnecting(false);
        setIsProcessingConnection(false);
        setLastProcessedAddress(null);
        signingRef.current = false;
        
        // 延迟重置断开状态
        setTimeout(() => {
          setIsDisconnecting(false);
        }, 1000);
        
        // 不显示错误消息，让用户重新连接
        return;
      }
      
      // 其他错误正常处理
      setConnectionError(error.message || t('walletConnect.connectionFailed'));
    }
  }, [error, t]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        setShowNetworkMenu(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 钱包连接成功后的处理
  const handleWalletConnected = async (walletAddress: string) => {
    // 防止重复调用
    if (isConnecting || isProcessingConnection || signingRef.current) {
      console.log('正在处理连接中，跳过重复调用');
      return;
    }

    try {
      setIsConnecting(true);
      setIsProcessingConnection(true);
      signingRef.current = true;
      setConnectionError(null);
      
      console.log('开始处理钱包连接，地址:', walletAddress);
      
      // 1. 获取随机数
      const nonceResponse = await commonApiService.getNonceByAddress(walletAddress);
      const nonce = nonceResponse.nonce;
      
      console.log('获取到nonce:', nonce);
      
      // 2. 使用personal_sign方法，避免Ethereum前缀
      const signature = await signMessageAsync({ 
        message: nonce
      }).catch((signError) => {
        console.error('签名失败:', signError);
        
        // 检查是否是用户拒绝签名
        if (signError.message?.includes('User rejected') || 
            signError.message?.includes('rejected') ||
            signError.name === 'UserRejectedRequestError') {
          throw new Error(WALLET_ERR_USER_REJECTED_SIGN);
        }
        
        // 检查是否是授权错误
        if (signError.message?.includes('not authorized') ||
            signError.message?.includes('The requested account and/or method has not been authorized')) {
          throw new Error(WALLET_ERR_AUTH_REVOKED);
        }
        
        throw signError;
      });
      
      console.log('签名信息:', {
        address: walletAddress,
        nonce: nonce,
        signature: signature
      });
      
      // 3. 调用登录接口
      const loginApiResponse = await commonApiService.login(walletAddress, signature);
      console.log('登陆结果:', loginApiResponse);
      if (loginApiResponse.token === '') {
        throw new Error('Not Authorized');
      }
      const userInfo = loginApiResponse.user_info;

      const completeUserInfo = {
        id: userInfo.id.toString(),
        address: userInfo.address,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        status: userInfo.status,
        roles: userInfo.roles,
        created_at: userInfo.created_at,
        updated_at: userInfo.updated_at,
        token: loginApiResponse.token // 将token也保存在user对象中
      };
      
      // 5. 使用login方法保存用户信息和token
      login(completeUserInfo, loginApiResponse.token);
      
      // 6. 通知父组件
      onConnect?.(walletAddress);
      
      MessageUtils.success(t('walletConnect.walletConnectSuccess'));
      
    } catch (error: any) {
      console.error('签名或登录失败:', error);
      
      // 检查是否是授权相关错误
      const isAuthError =
        error.message?.includes('not authorized') ||
        error.message?.includes('The requested account and/or method has not been authorized') ||
        isSilentWalletAuthMessage(error.message);
      
      if (isAuthError) {
        console.log('检测到授权错误，静默处理...');
        // 静默清理状态，不显示错误提示
        setConnectionError(null);
        setIsConnecting(false);
        setIsProcessingConnection(false);
        signingRef.current = false;
        return;
      }
      
      // 其他错误正常处理
      const errorMessage = error.message || t('walletConnect.loginFailedRetry');
      setConnectionError(errorMessage);
      MessageUtils.error(errorMessage);
    } finally {
      setIsConnecting(false);
      setIsProcessingConnection(false);
      signingRef.current = false;
    }
  };

  // 简化的钱包断开连接处理
  const handleWalletDisconnected = async () => {
    try {
      console.log('处理钱包断开连接...');
      
      // 清除本地状态
      logout();
      
      // 关闭所有弹窗和下拉菜单
      setShowUserModal(false);
      setShowUserDropdown(false);
      setShowNetworkMenu(false);
      
      // 重置所有连接相关状态
      setIsConnecting(false);
      setIsDisconnecting(false);
      setIsProcessingConnection(false);
      setConnectionError(null);
      setLastProcessedAddress(null);
      signingRef.current = false;
      
      // 通知父组件
      onDisconnect?.();
      
      console.log('钱包断开连接完成');
      
    } catch (error: any) {
      console.error('断开连接处理失败:', error);
      // 确保本地状态被清除
      logout();
      // 强制清理所有状态
      setConnectionError(null);
      setIsConnecting(false);
      setIsDisconnecting(false);
      setIsProcessingConnection(false);
    }
  };

  // 处理断开连接
  const handleDisconnect = () => {
    try {
      // 先断开钱包连接
      disconnect();
      
      // 然后清理状态
      handleWalletDisconnected();
      
    } catch (error: any) {
      console.error('断开连接处理失败:', error);
      // 确保状态被清理
      logout();
    }
  };

  // 复制地址到剪贴板
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      MessageUtils.success(t('walletConnect.addressCopied'));
    }
  };

  // 网络配置
  const networks = [
    { id: 1, name: 'Ethereum', icon: 'fab fa-ethereum', color: 'text-blue-400', iconClass: 'networkEthereum', symbol: 'Ξ' },
    { id: 8453, name: 'Base', icon: 'fas fa-layer-group', color: 'text-blue-500', iconClass: 'networkBase', symbol: '◎' },
    { id: 11155111, name: 'Sepolia', icon: 'fab fa-ethereum', color: 'text-blue-300', iconClass: 'networkSepolia', symbol: 'Ξ' },
    { id: 5, name: 'Goerli', icon: 'fab fa-ethereum', color: 'text-blue-200', iconClass: 'networkGoerli', symbol: 'Ξ' },
    { id: 17000, name: 'Holesky', icon: 'fab fa-ethereum', color: 'text-blue-100', iconClass: 'networkHolesky', symbol: 'Ξ' },
    { id: 56, name: 'BSC', icon: 'fas fa-cube', color: 'text-yellow-400', iconClass: 'networkBsc', symbol: 'B' },
    { id: 137, name: 'Polygon', icon: 'fab fa-polygon', color: 'text-purple-400', iconClass: 'networkPolygon', symbol: '⬢' },
  ];

  // 获取当前网络信息
  const getCurrentNetwork = () => {
    return networks.find(network => network.id === chainId) || networks[0];
  };

  // 处理网络切换
  const handleNetworkSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
      setShowNetworkMenu(false);
      MessageUtils.success(t('walletConnect.networkSwitchSuccess'));
    } catch (error: any) {
      console.error('网络切换失败:', error);
      MessageUtils.error(t('walletConnect.networkSwitchFail', { message: error?.message ?? '' }));
    }
  };

  // 处理菜单项点击 - 跳转到admin后台并定位到对应菜单
  const handleMenuClick = ({ key }: { key: string }) => {
    const adminUrlBase = '/admin';

    const redirectToAdmin = (menu: string) => {
      const url = `${adminUrlBase}?menu=${menu}`;
      window.open(url, '_self');
    };

    switch (key) {
      case 'profile':
        redirectToAdmin('profile');
        break;
      case 'cart':
        redirectToAdmin('cart');
        break;
      case 'favorites':
        redirectToAdmin('favorites');
        break;
      case 'orders':
        redirectToAdmin('orders');
        break;
      case 'history':
        redirectToAdmin('history');
        break;
      case 'settings':
        redirectToAdmin('settings');
        break;
      case 'disconnect':
        handleDisconnect();
        break;
      default:
        break;
    }
  };


  // 如果i18n还没有准备好，显示加载状态
  if (!ready) {
    return (
      <Button loading>
        <i className="fas fa-wallet mr-2"></i>
        {t('common.loading')}
      </Button>
    );
  }

  // 如果未连接，显示连接按钮
  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal, mounted }) => {
          const ready = mounted;
          
          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              <Button
                type="primary"
                icon={<i className="fas fa-wallet"></i>}
                onClick={openConnectModal}
                loading={isPending || isConnecting}
              >
                {t('walletConnect.connectWallet')}
              </Button>
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  }

  // 如果已连接但未登录，显示连接中状态
  if (isConnected && !isLoggedIn) {
    // 如果有连接错误，显示重试按钮
    if (connectionError) {
      return (
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => handleWalletConnected(address!)} 
            type="primary"
            icon={<i className="fas fa-redo"></i>}
          >
            {t('walletConnect.retryConnect')}
          </Button>
          <Button 
            onClick={() => handleDisconnect()} 
            type="default"
            icon={<i className="fas fa-times"></i>}
          >
            {t('common.cancel')}
          </Button>
        </div>
      );
    }
    
    // 如果正在处理连接，显示加载状态
    if (isProcessingConnection) {
      return (
        <Button loading>
          <i className="fas fa-wallet mr-2"></i>
          {t('walletConnect.connecting')}
        </Button>
      );
    }
    
    // 如果钱包已连接但用户未登录，且不在处理中，显示连接钱包按钮
    return (
      <ConnectButton.Custom>
        {({ openConnectModal, mounted }) => {
          const ready = mounted;
          
          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              <Button
                type="primary"
                icon={<i className="fas fa-wallet"></i>}
                onClick={openConnectModal}
                loading={isPending || isConnecting}
              >
                {t('walletConnect.connectWallet')}
              </Button>
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  }

  const nativeBalanceAmount =
    balance != null
      ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol ?? 'ETH'}`
      : `0.0000 ETH`;

  // 如果已连接，显示用户信息区域（完全按照原型页面布局）
  return (
    <div className="flex items-center space-x-3">
      {/* 网络切换下拉 - 完全按照原型实现 */}
      <div className="relative">
        <button 
          onClick={() => setShowNetworkMenu(!showNetworkMenu)}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
        >
          <div className={`${styles.networkIcon} ${styles[getCurrentNetwork().iconClass]}`}>
            {getCurrentNetwork().symbol}
          </div>
          <span className="text-sm">{getCurrentNetwork().name}</span>
          <i className="fas fa-chevron-down text-xs"></i>
        </button>
        <div className={`${styles.dropdown} ${showNetworkMenu ? styles.show : ''} absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[150px] z-50`}>
          <div className="py-2">
            {networks.map((network) => (
              <button
                key={network.id.toString()}
                onClick={() => {
                  handleNetworkSwitch(network.id);
                  setShowNetworkMenu(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className={`${styles.networkIcon} ${styles[network.iconClass]}`}>
                  {network.symbol}
                </div>
                <span>{network.name}</span>
                {network.id === chainId && (
                  <i className="fas fa-check text-sapphire-400 ml-auto"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 用户菜单 - 完全按照原型实现 */}
      <div className="relative">
        <button 
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
        >
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
          <span className="text-sm">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : t('walletConnect.unknownAddress')}
          </span>
          <i className="fas fa-chevron-down text-xs"></i>
        </button>
        <div className={`${styles.dropdown} ${showUserDropdown ? styles.show : ''} absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[200px] z-50`}>
          <div className="py-2">
            <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-600">
              {t('walletConnect.balanceDisplay', { amount: nativeBalanceAmount })}
            </div>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'profile' });
                setShowUserDropdown(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <i className="fas fa-user"></i>
              <span>{t('user.profile')}</span>
            </button>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'cart' });
                setShowUserDropdown(false);
              }}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center space-x-2">
                <i className="fas fa-shopping-cart"></i>
                <span>{t('user.cart')}</span>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">3</span>
            </button>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'favorites' });
                setShowUserDropdown(false);
              }}
              className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center space-x-2">
                <i className="fas fa-heart"></i>
                <span>{t('user.favorites')}</span>
              </div>
              <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">8</span>
            </button>
            
            <div className="border-t border-gray-600 my-1"></div>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'orders' });
                setShowUserDropdown(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <i className="fas fa-box"></i>
              <span>{t('user.orders')}</span>
            </button>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'history' });
                setShowUserDropdown(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <i className="fas fa-history"></i>
              <span>{t('user.history')}</span>
            </button>
            
            <div className="border-t border-gray-600 my-1"></div>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'settings' });
                setShowUserDropdown(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <i className="fas fa-cog"></i>
              <span>{t('user.settings')}</span>
            </button>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'disconnect' });
                setShowUserDropdown(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>{t('user.disconnect')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 用户信息模态框 - 使用Antd Modal和自定义样式 */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <span className="text-lg font-semibold text-gray-900">{t('walletConnect.modalTitle')}</span>
          </div>
        }
        open={showUserModal}
        onCancel={() => setShowUserModal(false)}
        footer={[
          <Button key="copy" onClick={copyAddress} className="mr-2">
            <i className="fas fa-copy mr-2"></i>
            {t('walletConnect.copyAddress')}
          </Button>,
          <Button key="disconnect" type="primary" danger onClick={handleDisconnect}>
            <i className="fas fa-sign-out-alt mr-2"></i>
            {t('user.disconnect')}
          </Button>,
        ]}
        width={500}
        className={styles.userModal}
      >
        <div className="space-y-4">
          {/* 用户头像和基本信息 */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.nickname || t('walletConnect.noNickname')}
              </h3>
              <p className="text-sm text-gray-500 font-mono">
                {address}
              </p>
            </div>
          </div>

          {/* 钱包余额 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('walletConnect.walletBalance')}</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{balance?.symbol ?? 'ETH'}</span>
              <span className="font-mono text-sm">
                {nativeBalanceAmount}
              </span>
            </div>
          </div>

          {/* 用户统计信息 */}
          {user && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('walletConnect.accountInfo')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('walletConnect.userId')}</span>
                  <span className="font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('walletConnect.userType')}</span>
                  <span>{user.roles ? user.roles.join(', ') : t('walletConnect.defaultRole')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('walletConnect.accountStatus')}</span>
                  <span className={user.status === 1 ? 'text-green-600' : 'text-red-600'}>
                    {t('walletConnect.statusActive')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('walletConnect.registeredAt')}</span>
                  <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : t('walletConnect.unknown')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default WalletConnect;
