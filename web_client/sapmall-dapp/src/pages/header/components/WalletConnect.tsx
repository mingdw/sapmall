import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, notification } from 'antd';
import { commonApiService } from '../../../services/api/commonApiService';
import MessageUtils from '../../../utils/messageUtils';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const { t, ready } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('Ethereum');
  const [loading, setLoading] = useState(false);

  // 如果i18n还没有准备好，显示加载状态
  if (!ready) {
    return (
      <Button loading>
        <i className="fas fa-wallet mr-2"></i>
        加载中...
      </Button>
    );
  }

  // 钱包连接
  const handleConnect = async () => {
    try {
      setLoading(true);
      MessageUtils.info('正在连接钱包...');
      // 调用获取nonce接口
      const nonceResponse = await commonApiService.getNonceByAddress(walletAddress);
      
      
    } catch (error: any) {
      console.error('钱包连接失败:', error);
      MessageUtils.error(`钱包连接失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 断开钱包连接
  const handleDisconnect = () => {
    setWalletAddress('');
    setIsConnected(false);
    setUserMenuOpen(false);
    
    // 清除token
    localStorage.removeItem('auth_token');
    
    onDisconnect?.();

    // 断开连接提示
    MessageUtils.info('钱包已断开连接');
  };

  // 切换网络
  const handleNetworkChange = (network: string) => {
    setCurrentNetwork(network);
    setNetworkMenuOpen(false);
    MessageUtils.success(`已切换到 ${network} 网络`);
  };

  // 用户菜单项点击处理
  const handleUserMenuClick = (key: string) => {
    setUserMenuOpen(false);
    
    switch (key) {
      case 'profile':
        MessageUtils.info('跳转到个人资料页面');
        break;
      case 'cart':
        MessageUtils.info('跳转到购物车页面');
        break;
      case 'favorites':
        MessageUtils.info('跳转到收藏夹页面');
        break;
      case 'orders':
        MessageUtils.info('跳转到订单页面');
        break;
      case 'history':
        MessageUtils.info('跳转到历史记录页面');
        break;
      case 'settings':
        MessageUtils.info('跳转到设置页面');
        break;
      case 'disconnect':
        handleDisconnect();
        break;
      default:
        break;
    }
  };

  // 用户菜单项
  const userMenuItems = [
    { key: 'profile', icon: 'fas fa-user', label: t('user.profile') },
    { key: 'cart', icon: 'fas fa-shopping-cart', label: t('user.cart'), badge: 3, badgeColor: 'red' },
    { key: 'favorites', icon: 'fas fa-heart', label: t('user.favorites'), badge: 8, badgeColor: 'pink' },
    { key: 'divider1', type: 'divider' },
    { key: 'orders', icon: 'fas fa-file-alt', label: t('user.orders') },
    { key: 'history', icon: 'fas fa-history', label: t('user.history') },
    { key: 'divider2', type: 'divider' },
    { key: 'settings', icon: 'fas fa-cog', label: t('user.settings') },
    { key: 'disconnect', icon: 'fas fa-sign-out-alt', label: t('user.disconnect'), danger: true },
  ];

  // 如果未连接，显示连接按钮
  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          type="primary"
          icon={<i className="fas fa-wallet"></i>}
          onClick={handleConnect}
          loading={loading}
        >
          连接钱包
        </Button>
      </div>
    );
  }

  // 如果已连接，显示用户菜单
  return (
    <div className="flex items-center space-x-3">
      {/* 网络选择器 */}
      <div className="relative">
        <Button
          type="default"
          icon={<div className="network-icon network-ethereum">Ξ</div>}
          onClick={() => setNetworkMenuOpen(!networkMenuOpen)}
        >
          {currentNetwork}
        </Button>
        
        {/* 网络选择下拉菜单 */}
        {networkMenuOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl min-w-[150px] z-50">
            <div className="py-2">
              <Button
                type="text"
                className="w-full justify-start"
                onClick={() => handleNetworkChange('Ethereum')}
              >
                <div className="network-icon network-ethereum mr-2">Ξ</div>
                Ethereum
              </Button>
              <Button
                type="text"
                className="w-full justify-start"
                onClick={() => handleNetworkChange('Polygon')}
              >
                <div className="network-icon network-polygon mr-2">⬢</div>
                Polygon
              </Button>
              <Button
                type="text"
                className="w-full justify-start"
                onClick={() => handleNetworkChange('BSC')}
              >
                <div className="network-icon network-bsc mr-2">B</div>
                BSC
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 用户菜单 */}
      <div className="relative">
        <Button
          type="default"
          icon={<div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>}
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </Button>

        {/* 用户下拉菜单 */}
        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl min-w-[200px] z-50">
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-semibold text-gray-600 border-b border-gray-200">
                余额: 2.5 ETH
              </div>
              {userMenuItems.map((item) => {
                if (item.type === 'divider') {
                  return <div key={item.key} className="h-px bg-gray-200 my-2"></div>;
                }

                return (
                  <Button
                    key={item.key}
                    type="text"
                    className={`w-full justify-start ${
                      item.danger ? 'text-red-500 hover:text-red-700' : ''
                    }`}
                    icon={<i className={`${item.icon} w-4`}></i>}
                    onClick={() => handleUserMenuClick(item.key)}
                  >
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full text-white ml-2 ${
                        item.badgeColor === 'red' ? 'bg-red-500' : 'bg-pink-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 点击外部关闭菜单 */}
      {(userMenuOpen || networkMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setNetworkMenuOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default WalletConnect;
