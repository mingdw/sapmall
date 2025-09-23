import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { useConnect, useDisconnect, useAccount, useBalance, useSignMessage, useSwitchChain } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { commonApiService } from '../../../services/api/commonApiService';
import { useUserStore } from '../../../store/userStore';
import MessageUtils from '../../../utils/messageUtils';
import { userApiService } from '../../../services/api/userApiService';
import styles from './WalletConnect.module.scss';
import { UserStatus } from '../../../services/types/userTypes';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
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
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, chainId } = useAccount();
  const { data: balance } = useBalance({ 
    address: isConnected ? address : undefined,
    query: { enabled: isConnected && !!address }
  });
  const { signMessageAsync } = useSignMessage();
  const { switchChain } = useSwitchChain();

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
      // 如果是未授权错误，清理状态
      if (error.message?.includes('UnauthorizedProviderError') || 
          error.message?.includes('not authorized') ||
          error.message?.includes('The requested account and/or method has not been authorized')) {
        console.log('检测到未授权错误，清理状态...');
        setIsDisconnecting(true);
        logout();
        setConnectionError('钱包连接已断开，请重新连接');
        
        // 延迟重置状态
        setTimeout(() => {
          setIsDisconnecting(false);
          setConnectionError(null);
        }, 2000);
      }
    }
  }, [error]);

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
      
      MessageUtils.success('钱包连接成功！');
      
    } catch (error: any) {
      console.error('签名或登录失败:', error);
      const errorMessage = error.message || '登录失败，请重试';
      setConnectionError(errorMessage);
      MessageUtils.error(errorMessage);
      // 不要自动断开钱包连接，让用户手动重试
    } finally {
      setIsConnecting(false);
      setIsProcessingConnection(false);
      signingRef.current = false;
    }
  };

  // 钱包断开连接
  const handleWalletDisconnected = async () => {
    try {
      setIsDisconnecting(true);
      setIsProcessingConnection(false);
      signingRef.current = false;
      
      console.log('开始处理钱包断开连接...');
      
      // 先清除本地状态，避免后续操作触发错误
      logout();
      
      // 调用后端登出接口（如果token存在）
      const { getAuthToken } = useUserStore.getState();
      const token = getAuthToken();
      if (token) {
        try {
          // await userApiService.logout();
        } catch (logoutError) {
          console.warn('后端登出失败，但本地状态已清除:', logoutError);
        }
      }
      
      // 通知父组件
      onDisconnect?.();
      
      MessageUtils.info('钱包已断开连接');
      
    } catch (error: any) {
      console.error('登出失败:', error);
      // 确保本地状态被清除
      logout();
    } finally {
      // 延迟重置断开连接状态，避免立即触发重新连接
      setTimeout(() => {
        setIsDisconnecting(false);
        setIsProcessingConnection(false);
        signingRef.current = false;
        setLastProcessedAddress(null);
      }, 1000);
    }
  };

  // 处理断开连接
  const handleDisconnect = () => {
    try {
      // 先清理登录状态
      handleWalletDisconnected();
      setShowUserDropdown(false);
      
      // 然后断开钱包连接
      disconnect();
    } catch (error: any) {
      console.error('断开连接处理失败:', error);
      // 确保状态被清理
      logout();
      disconnect();
    }
  };

  // 复制地址到剪贴板
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      MessageUtils.success('地址已复制到剪贴板');
    }
  };

  // 网络配置
  const networks = [
    { id: 1, name: 'Ethereum', icon: 'fab fa-ethereum', color: 'text-blue-400', iconClass: 'networkEthereum', symbol: 'Ξ' },
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
      MessageUtils.success('网络切换成功');
    } catch (error: any) {
      console.error('网络切换失败:', error);
      MessageUtils.error(`网络切换失败: ${error.message}`);
    }
  };

  // 处理菜单项点击 - 跳转到admin后台并定位到对应菜单
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        // 跳转到admin后台的个人信息页面
        navigate('/admin?menu=profile');
        break;
      case 'cart':
        // 跳转到admin后台的商品管理页面
        navigate('/admin?menu=cart');
        break;
      case 'favorites':
        // 跳转到admin后台的资产管理页面
        navigate('/admin?menu=favorites');
        break;
      case 'orders':
        // 跳转到admin后台的订单管理页面
        navigate('/admin?menu=orders');
        break;
      case 'history':
        // 跳转到admin后台的交易记录页面
        navigate('/admin?menu=history');
        break;
      case 'settings':
        // 跳转到admin后台的系统设置页面
        navigate('/admin?menu=settings');
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
        加载中...
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
                连接钱包
              </Button>
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  }

  // 如果已连接但未登录，显示连接中状态或错误状态
  if (isConnected && !isLoggedIn) {
    if (connectionError) {
      return (
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => handleWalletConnected(address!)} 
            type="primary"
            icon={<i className="fas fa-redo"></i>}
          >
            重试连接
          </Button>
          <Button 
            onClick={() => disconnect()} 
            type="default"
            icon={<i className="fas fa-times"></i>}
          >
            取消
          </Button>
        </div>
      );
    }
    
    return (
      <Button loading>
        <i className="fas fa-wallet mr-2"></i>
        连接中...
      </Button>
    );
  }

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
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '未知地址'}
          </span>
          <i className="fas fa-chevron-down text-xs"></i>
        </button>
        <div className={`${styles.dropdown} ${showUserDropdown ? styles.show : ''} absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[200px] z-50`}>
          <div className="py-2">
            <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-600">
              余额: {balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : '0.0000 ETH'}
            </div>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'profile' });
                setShowUserDropdown(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <i className="fas fa-user"></i>
              <span>个人资料</span>
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
                <span>我的购物车</span>
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
                <span>我的收藏</span>
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
              <span>我的订单</span>
            </button>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'history' });
                setShowUserDropdown(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <i className="fas fa-history"></i>
              <span>交易历史</span>
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
              <span>设置</span>
            </button>
            
            <button 
              onClick={() => {
                handleMenuClick({ key: 'disconnect' });
                setShowUserDropdown(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>断开连接</span>
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
            <span className="text-lg font-semibold text-gray-900">用户信息</span>
          </div>
        }
        open={showUserModal}
        onCancel={() => setShowUserModal(false)}
        footer={[
          <Button key="copy" onClick={copyAddress} className="mr-2">
            <i className="fas fa-copy mr-2"></i>
            复制地址
          </Button>,
          <Button key="disconnect" type="primary" danger onClick={handleDisconnect}>
            <i className="fas fa-sign-out-alt mr-2"></i>
            断开连接
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
                {user?.nickname || '未设置昵称'}
              </h3>
              <p className="text-sm text-gray-500 font-mono">
                {address}
              </p>
            </div>
          </div>

          {/* 钱包余额 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">钱包余额</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ETH</span>
              <span className="font-mono text-sm">
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : '0.0000 ETH'}
              </span>
            </div>
          </div>

          {/* 用户统计信息 */}
          {user && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">账户信息</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">用户ID:</span>
                  <span className="font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">用户类型:</span>
                  <span>{user.roles ? user.roles.join(', ') : '普通用户'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">状态:</span>
                  <span className={user.status === 1 ? 'text-green-600' : 'text-red-600'}>
                    正常
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">注册时间:</span>
                  <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '未知'}</span>
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
