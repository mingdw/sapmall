/**
 * @deprecated 未被 App 引用。实际布局请使用 AdminLayout。
 * 语言切换权威在 DApp 页头，通过 iframe URL lang + postMessage 同步到 Admin。
 * 保留此文件仅作历史参考，请勿再接入独立语言切换器。
 */
import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, Avatar } from 'antd';
import {
  LayoutDashboard,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Header: AntHeader, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={16} />,
      label: t('navigation.dashboard'),
    },
  ];

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
            icon={collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
          <div className="flex items-center space-x-4">
            <Avatar icon={<User size={16} />} />
          </div>
        </AntHeader>
        <Content className="p-6 bg-gray-50">{children}</Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
