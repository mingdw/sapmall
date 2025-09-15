import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Dropdown, Menu, message } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined, 
  FileTextOutlined, 
  HistoryOutlined 
} from '@ant-design/icons';
import { commonApiService } from '../services/api/commonApiService';
import MessageUtils from '../utils/messageUtils';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查是否已经登录
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // 处理钱包连接
  const handleConnect = async () => {
    try {
      setLoading(true);
      
      if (!isConnected) {
        // 如果未连接，使用RainbowKit的连接按钮
        MessageUtils.info('请先连接钱包');
        return;
      }

      // 如果已连接，进行登录流程
      await handleLogin();
    } catch (error: any) {
      console.error('钱包连接失败:', error);
      MessageUtils.error(`钱包连接失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 处理登录
  const handleLogin = async () => {
    if (!address) return;

    try {
      setLoading(true);
      MessageUtils.info('正在验证钱包...');

      // 1. 获取nonce
      const nonceResponse = await commonApiService.getNonceByAddress(address);
      
      // 2. 签名消息
      const message = `Sapphire Mall Login\nNonce: ${nonceResponse.nonce}`;
      const signature = await signMessageAsync({ message });
      
      // 3. 登录
      const loginResponse = await commonApiService.login(address, signature);
      
      // 4. 保存token
      localStorage.setItem('auth_token', loginResponse.token);
      setIsLoggedIn(true);
      
      // 5. 触发连接回调
      onConnect?.(address);
      
      MessageUtils.success('钱包连接成功！');
    } catch (error: any) {
      console.error('登录失败:', error);
      MessageUtils.error(`登录失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 处理断开连接
  const handleDisconnect = () => {
    // 清除token
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    
    // 断开钱包连接
    disconnect();
    
    // 触发断开回调
    onDisconnect?.();
    
    MessageUtils.info('钱包已断开连接');
  };

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'cart',
      icon: <ShoppingCartOutlined />,
      label: '购物车',
    },
    {
      key: 'favorites',
      icon: <HeartOutlined />,
      label: '收藏夹',
    },
    {
      key: 'orders',
      icon: <FileTextOutlined />,
      label: '订单',
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: '历史记录',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'disconnect',
      icon: <LogoutOutlined />,
      label: '断开连接',
      danger: true,
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'disconnect':
        handleDisconnect();
        break;
      default:
        MessageUtils.info(`跳转到${userMenuItems.find(item => item.key === key)?.label}页面`);
        break;
    }
  };

  // 如果未连接钱包，显示RainbowKit连接按钮
  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <ConnectButton />
      </div>
    );
  }

  // 如果已连接钱包但未登录，显示登录按钮
  if (isConnected && !isLoggedIn) {
    return (
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <Button
          type="primary"
          loading={loading}
          onClick={handleLogin}
        >
          登录
        </Button>
      </div>
    );
  }

  // 如果已连接且已登录，显示用户菜单
  return (
    <div className="flex items-center space-x-3">
      {/* 网络信息 */}
      <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>

      {/* 用户菜单 */}
      <Dropdown
        menu={{
          items: userMenuItems as any,
          onClick: handleMenuClick,
        }}
        placement="bottomRight"
        trigger={['click']}
      >
        <Button
          type="default"
          icon={<UserOutlined />}
          loading={loading}
        >
          用户菜单
        </Button>
      </Dropdown>
    </div>
  );
};

export default WalletConnect;
