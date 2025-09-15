import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const { t, ready } = useTranslation();
  const [isConnected, setIsConnected] = useState(true); // 默认已连接，展示完整功能
  const [walletAddress, setWalletAddress] = useState('0x1234...5678'); // 默认地址
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('Ethereum');

  // 如果i18n还没有准备好，显示加载状态
  if (!ready) {
    return (
      <button className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg text-sm text-gray-300">
        <i className="fas fa-wallet"></i>
        <span>加载中...</span>
      </button>
    );
  }

  // 模拟钱包连接
  const handleConnect = async () => {
    try {
      // 这里应该调用实际的钱包连接逻辑
      // 例如 MetaMask, WalletConnect 等
      const mockAddress = '0x1234...5678';
      setWalletAddress(mockAddress);
      setIsConnected(true);
      onConnect?.(mockAddress);
    } catch (error) {
      console.error('钱包连接失败:', error);
    }
  };

  // 断开钱包连接
  const handleDisconnect = () => {
    setWalletAddress('');
    setIsConnected(false);
    setUserMenuOpen(false);
    onDisconnect?.();
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
      <button
        className="wallet-button flex items-center space-x-2"
        onClick={handleConnect}
      >
        <i className="fas fa-wallet mr-2"></i>
        <span className="font-semibold">连接钱包</span>
      </button>
    );
  }

  // 如果已连接，显示用户菜单
  return (
    <div className="flex items-center space-x-3">
      {/* 网络选择器 */}
      <div className="relative">
        <button 
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
          onClick={() => setNetworkMenuOpen(!networkMenuOpen)}
        >
          <div className="network-icon network-ethereum">Ξ</div>
          <span className="text-sm font-semibold">{currentNetwork}</span>
          <i className="fas fa-chevron-down text-xs"></i>
        </button>
        
        {/* 网络选择下拉菜单 */}
        <div className={`absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[150px] z-50 transition-all duration-300 ${
          networkMenuOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
        }`}>
          <div className="py-2">
            <button
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => {
                setCurrentNetwork('Ethereum');
                setNetworkMenuOpen(false);
              }}
            >
              <div className="network-icon network-ethereum">Ξ</div>
              <span>Ethereum</span>
            </button>
            <button
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => {
                setCurrentNetwork('Polygon');
                setNetworkMenuOpen(false);
              }}
            >
              <div className="network-icon network-polygon">⬢</div>
              <span>Polygon</span>
            </button>
            <button
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => {
                setCurrentNetwork('BSC');
                setNetworkMenuOpen(false);
              }}
            >
              <div className="network-icon network-bsc">B</div>
              <span>BSC</span>
            </button>
          </div>
        </div>
      </div>

      {/* 用户菜单 */}
      <div className="relative">
        <button
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
          <span className="text-sm font-semibold">{walletAddress}</span>
          <i className="fas fa-chevron-down text-xs"></i>
        </button>

        {/* 用户下拉菜单 */}
        <div className={`absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[200px] z-50 transition-all duration-300 ${
          userMenuOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
        }`}>
          <div className="py-2">
            <div className="px-4 py-2 text-sm font-semibold text-gray-400 border-b border-gray-600">
              余额: 2.5 ETH
            </div>
            {userMenuItems.map((item) => {
              if (item.type === 'divider') {
                return <div key={item.key} className="h-px bg-gray-600 my-2"></div>;
              }

              const handleItemClick = () => {
                if (item.key === 'disconnect') {
                  handleDisconnect();
                } else {
                  setUserMenuOpen(false);
                  // 这里可以添加其他菜单项的处理逻辑
                }
              };

              return (
                <button
                  key={item.key}
                  className={`flex items-center ${
                    item.badge ? 'justify-between' : 'space-x-2'
                  } w-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors`}
                  onClick={handleItemClick}
                >
                  <div className="flex items-center space-x-2">
                    <i className={`${item.icon} w-4`}></i>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${
                      item.badgeColor === 'red' ? 'bg-red-500' : 'bg-pink-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
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
