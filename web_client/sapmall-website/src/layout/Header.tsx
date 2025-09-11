import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRocket, faGlobe, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState('zh');

  const menuItems = [
    {
      key: 'home',
      label: <a href="#home">首页</a>,
    },
    {
      key: 'core-values',
      label: <a href="#core-values">核心价值</a>,
    },
    {
      key: 'features',
      label: <a href="#features">平台功能</a>,
    },
    {
      key: 'about',
      label: <a href="#about">关于我们</a>,
    },
    {
      key: 'docs',
      label: <a href="#docs">文档</a>,
    },
  ];

  const languageMenu = (
    <Menu
      selectedKeys={[currentLang]}
      onClick={({ key }) => setCurrentLang(key as string)}
    >
      <Menu.Item key="zh" icon={<FontAwesomeIcon icon={faCheckCircle} style={{ opacity: currentLang === 'zh' ? 1 : 0 }} />}>
        中文
      </Menu.Item>
      <Menu.Item key="en" icon={<FontAwesomeIcon icon={faCheckCircle} style={{ opacity: currentLang === 'en' ? 1 : 0 }} />}>
        English
      </Menu.Item>
    </Menu>
  );

  const launchDApp = () => {
    console.log('Launching DApp...');
  };

  return (
    <AntHeader className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50 px-0">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">💎</span>
            </div>
            <div>
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sapphire Mall
              </Link>
              <div className="text-xs text-gray-400">Web3虚拟商品交易平台</div>
            </div>
          </div>

          {/* 桌面端导航菜单 */}
          <div className="hidden md:flex items-center space-x-8">
            <Menu
              mode="horizontal"
              items={menuItems}
              className="border-none bg-transparent"
              style={{ minWidth: 0, flex: 'auto', justifyContent: 'center' }}
              theme="dark"
            />
          </div>

          {/* 右侧按钮区域 */}
          <div className="flex items-center space-x-4">
            {/* 语言切换 */}
            <Dropdown overlay={languageMenu} trigger={['click']}>
              <Button 
                type="text" 
                icon={<FontAwesomeIcon icon={faGlobe} />}
                className="text-gray-300 hover:text-blue-400 border-none bg-transparent"
              >
                {currentLang === 'zh' ? '中文' : 'English'}
              </Button>
            </Dropdown>

            {/* 启动应用按钮 */}
            <Button 
              type="primary"
              icon={<FontAwesomeIcon icon={faRocket} />}
              onClick={launchDApp}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700 h-10 px-6 font-semibold"
            >
              启动应用
            </Button>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <Button 
                type="text" 
                icon={<FontAwesomeIcon icon={faBars} />}
                onClick={() => setMobileMenuVisible(true)}
                className="text-gray-300 hover:text-blue-400 border-none bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        className="dark"
      >
        <Menu
          mode="vertical"
          items={menuItems}
          className="border-none"
          theme="dark"
        />
        <div className="mt-4">
          <Button 
            type="primary" 
            icon={<FontAwesomeIcon icon={faRocket} />}
            onClick={launchDApp}
            className="w-full"
            size="large"
          >
            启动应用
          </Button>
        </div>
      </Drawer>
    </AntHeader>
  );
};

export default Header;
