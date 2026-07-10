import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Globe, X, CheckCircle } from 'lucide-react';
import logoMarkSrc from '../../assets/logo-mark.svg';
import Web3WalletButton from './components/Web3WalletButton';
import headerControlStyles from './HeaderControl.module.scss';
import { HEADER_CTRL_ICON_SIZE, HEADER_CTRL_ICON_STROKE } from './headerControlButton';

const HeaderPageDetail: React.FC = () => {
  const { t, i18n, ready } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  // 根据当前路径确定活跃的导航项
  const getActiveNavItem = () => {
    const path = location.pathname;
    if (path.startsWith('/marketplace')) return 'marketplace';
    if (path.startsWith('/rewards')) return 'rewards';
    if (path.startsWith('/exchange')) return 'exchange';
    if (path.startsWith('/dao')) return 'dao';
    if (path.startsWith('/help')) return 'help';
    return 'marketplace'; // 默认
  };
  
  const activeNavItem = getActiveNavItem();

  // 如果i18n还没有准备好，显示加载状态
  if (!ready) {
    return (
      <nav className="border-b border-gray-700">
        <div className="w-full px-6">
          <div className="flex h-16">
            {/* 第一部分：Logo区域 - 占1/3 */}
            <div className="flex-1 flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-lg shadow-cyan-500/10 ring-1 ring-white/15">
                  <img src={logoMarkSrc} alt="" className="w-full h-full object-contain p-0.5" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">Sapphire Mall</span>
              </div>
            </div>

            {/* 第二部分：导航菜单区域 - 占1/3 */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-300 text-sm">加载中...</div>
            </div>

            {/* 第三部分：语言切换和钱包连接区域 - 占1/3 */}
            <div className="flex-1 flex items-center justify-end">
              <div className="text-gray-300 text-sm">加载中...</div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // 主导航菜单项
  const navItems = [
    { key: 'marketplace', label: t('navigation.marketplace'), href: '/marketplace' },
    { key: 'rewards', label: t('navigation.rewards'), href: '/rewards' },
    { key: 'exchange', label: t('navigation.exchange'), href: '/exchange' },
    { key: 'dao', label: t('navigation.dao'), href: '/dao' },
    { key: 'help', label: t('navigation.help'), href: '/help' },
  ];

  // 处理导航菜单点击
  const handleNavClick = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    // 使用路由导航
    navigate(`/${key}`);
    console.log('导航到:', key);
  };

  // 语言切换
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      {/* 分割线宽度控制 - 95%宽度，居中，包含分割线 */}
      <div className="w-full border-b border-gray-700">
        {/* 导航栏内容区域 - 完全填充分割线宽度，添加内边距与内容区域对齐 */}
        <div className="flex items-center justify-between py-4 w-full px-6">
          {/* Logo区域 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-lg shadow-cyan-500/10 ring-1 ring-white/15">
              <img src={logoMarkSrc} alt="" className="w-full h-full object-contain p-0.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Sapphire Mall</h1>
              <p className="text-xs font-semibold text-gray-400">{t('header.tagline')}</p>
            </div>
          </div>

          {/* 导航菜单区域 */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`nav-link font-semibold ${
                  activeNavItem === item.key
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
                onClick={(e) => handleNavClick(item.key, e)}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon size={20} />
          </button>

          {/* 右侧控制区域 */}
          <div className="hidden md:flex items-center gap-3">
            {/* 语言切换 — 与官网 .lang-trigger 一致 */}
            <div className={headerControlStyles.languageDropdown}>
              <button
                type="button"
                className={headerControlStyles.langTrigger}
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              >
                <Globe size={HEADER_CTRL_ICON_SIZE} strokeWidth={HEADER_CTRL_ICON_STROKE} />
                <span>{i18n.language === 'zh' ? '中文' : 'English'}</span>
              </button>
              <div
                className={`${headerControlStyles.dropdownMenu} ${
                  languageMenuOpen ? headerControlStyles.dropdownMenuShow : ''
                }`}
              >
                <button
                  type="button"
                  className={headerControlStyles.dropdownItem}
                  onClick={() => {
                    handleLanguageChange('zh');
                    setLanguageMenuOpen(false);
                  }}
                >
                  <CheckCircle
                    size={14}
                    className={headerControlStyles.dropdownItemCheck}
                    style={{ opacity: i18n.language === 'zh' ? 1 : 0 }}
                  />
                  中文
                </button>
                <button
                  type="button"
                  className={headerControlStyles.dropdownItem}
                  onClick={() => {
                    handleLanguageChange('en');
                    setLanguageMenuOpen(false);
                  }}
                >
                  <CheckCircle
                    size={14}
                    className={headerControlStyles.dropdownItemCheck}
                    style={{ opacity: i18n.language === 'en' ? 1 : 0 }}
                  />
                  English
                </button>
              </div>
            </div>

            {/* 钱包连接组件 */}
            <Web3WalletButton />
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-gray-900 h-full w-80 transform transition-transform duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-lg shadow-cyan-500/10 ring-1 ring-white/15">
                      <img src={logoMarkSrc} alt="" className="w-full h-full object-contain p-0.5" />
                    </div>
                    <span className="text-lg font-bold text-white">Sapphire Mall</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <nav className="space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-colors font-semibold ${
                        activeNavItem === item.key
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                      onClick={(e) => {
                        handleNavClick(item.key, e);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-700">
                  <Web3WalletButton />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 点击外部关闭语言菜单 */}
        {languageMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setLanguageMenuOpen(false)}
          ></div>
        )}
      </div>
    </header>
  );
};

export default HeaderPageDetail;