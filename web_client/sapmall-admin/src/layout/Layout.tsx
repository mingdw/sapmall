import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, Dropdown, Avatar } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Header: AntHeader, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t('navigation.dashboard'),
    },
  ];

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

  return (
    <AntLayout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="h-16 flex items-center justify-center bg-sapphire-600">
          <span className="text-white font-bold text-lg">
            {collapsed ? 'SM' : 'SapMall Admin'}
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          items={menuItems}
          className="mt-4"
        />
      </Sider>
      <AntLayout>
        <AntHeader className="bg-white px-4 flex items-center justify-between shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
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
            <Avatar icon={<UserOutlined />} />
          </div>
        </AntHeader>
        <Content className="p-6 bg-gray-50">
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
