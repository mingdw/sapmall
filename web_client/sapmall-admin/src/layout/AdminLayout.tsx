import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Button, Dropdown, Avatar, Typography } from 'antd';
import { 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IframeParams } from '../types';
import { menuConfig } from '../config/menuConfig';

const { Header: AntHeader, Sider, Content } = AntLayout;
const { Text } = Typography;

// 定义菜单项类型
interface MenuItem {
  id: string;
  name: string;
  icon: string;
  url: string;
  title: string;
}

// 定义菜单组类型
interface MenuGroup {
  id: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

// 定义布局组件属性
interface AdminLayoutProps {
  children: React.ReactNode;
  iframeParams?: IframeParams;
  onLogout?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children,
  iframeParams,
  onLogout 
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // 默认用户信息
  const user = {
    id: iframeParams?.userId || '1',
    username: iframeParams?.nickname || 'admin',
    email: 'admin@example.com',
    role: (iframeParams?.userRole as 'admin' | 'merchant' | 'user') || 'admin',
    status: 'active' as const,
    createdAt: '',
    updatedAt: ''
  };

  // 获取当前角色的菜单配置
  const currentMenuConfig = menuConfig[user.role] || [];

  // 将菜单配置转换为Ant Design Menu的格式
  const menuItems = currentMenuConfig.map((group: MenuGroup) => ({
    key: group.id,
    icon: <i className={group.icon} />,
    label: group.title,
    children: group.items.map((item: MenuItem) => ({
      key: item.id,
      icon: <i className={item.icon} />,
      label: item.name,
      onClick: () => handleMenuClick(item)
    }))
  }));

  // 处理菜单点击
  const handleMenuClick = (menuItem: MenuItem) => {
    setSelectedKeys([menuItem.id]);
    navigate(menuItem.url);
  };

  // 根据当前路径设置选中的菜单项
  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = currentMenuConfig
      .flatMap((group: MenuGroup) => group.items)
      .find((item: MenuItem) => item.url === currentPath);
    
    if (currentMenuItem) {
      setSelectedKeys([currentMenuItem.id]);
    }
  }, [location.pathname, currentMenuConfig]);

  // 语言切换
  const languageItems = [
    {
      key: 'zh',
      label: '中文',
    },
    {
      key: 'en',
      label: 'English',
    },
  ];

  const handleLanguageChange = ({ key }: { key: string }) => {
    i18n.changeLanguage(key);
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/profile')
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: onLogout
    }
  ];

  // 获取当前页面标题
  const getCurrentPageTitle = () => {
    const currentMenuItem = currentMenuConfig
      .flatMap((group: MenuGroup) => group.items)
      .find((item: MenuItem) => item.id === selectedKeys[0]);
    return currentMenuItem?.title || '后台管理';
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

  return (
    <AntLayout className="h-full w-full">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="shadow-lg"
        width={260}
      >
        <div className="h-16 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700">
          <span className="text-white font-bold text-lg">
            {collapsed ? 'SM' : 'SapMall Admin'}
          </span>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          className="mt-4 border-r-0"
          style={{ height: 'calc(100% - 64px)', overflowY: 'auto' }}
        />
      </Sider>
      
      <AntLayout>
        <AntHeader className="bg-white px-4 flex items-center justify-between shadow-sm border-b">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg mr-4"
            />
            <Text strong className="text-lg">
              {getCurrentPageTitle()}
            </Text>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dropdown
              menu={{ 
                items: languageItems, 
                onClick: handleLanguageChange 
              }}
              placement="bottomRight"
            >
              <Button type="text" icon={<GlobalOutlined />}>
                {i18n.language === 'zh' ? '中文' : 'English'}
              </Button>
            </Dropdown>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <div className="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                <Avatar 
                  icon={<UserOutlined />} 
                  className="mr-2"
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div className="flex flex-col">
                  <Text strong className="text-sm">{user.username}</Text>
                  <Text type="secondary" className="text-xs">
                    {getRoleDisplayName(user.role)}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </AntHeader>
        
        <Content className="p-6 bg-gray-50" style={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default AdminLayout;
