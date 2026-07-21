import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Layout as AntLayout, Menu, Button, Typography, Spin } from 'antd';
import { 
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IframeParams } from '../types';
import { useIframeParams } from '../hooks/useIframeParams';
import { useMenuData } from '../hooks/useMenuData';
import { useCategoryStore } from '../store/categoryStore';
import { CategoryTreeResp } from '../services/types/categoryTypes';
import AdminContentComponent from '../components/AdminContentComponent';
import { normalizeFaIcon } from '../utils';


const { Header: AntHeader, Sider, Content } = AntLayout;
const { Title, Text } = Typography;

interface AdminLayoutProps {
  iframeParams?: IframeParams;
  onLogout?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  iframeParams,
  onLogout 
}) => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<CategoryTreeResp | null>(null);
  
  // 内容区域引用，用于滚动提示
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理iframe参数
  useIframeParams(iframeParams);

  // 确保商品目录（menu_type=0）已加载并缓存（兜底：避免某些场景下初始化未触发）
  const { hasHydrated, productCategories, fetchProductCategories } = useCategoryStore();
  useEffect(() => {
    if (!hasHydrated) return;
    if (productCategories.length > 0) return;
    fetchProductCategories().catch((error) => {
      console.error('AdminLayout 初始化商品目录数据失败', error);
    });
  }, [hasHydrated, productCategories.length, fetchProductCategories]);
  
  // 获取菜单数据
  const {
    menuTree,
    isLoading,
    hasMenus,
    setActiveMenuByUrl,
    refreshMenus,
    fetchUserMenus
  } = useMenuData();

  // 语言切换后强制重拉后台菜单（Accept-Language 变化）
  useEffect(() => {
    const onLocaleChanged = () => {
      refreshMenus().catch((error) => {
        console.error('语言切换后刷新菜单失败', error);
      });
    };
    window.addEventListener('admin:locale-changed', onLocaleChanged);
    return () => window.removeEventListener('admin:locale-changed', onLocaleChanged);
  }, [refreshMenus]);

  // 仅用于订阅语言变化，触发菜单文案区域重渲染（菜单名来自 API）
  void i18n.language; 

  // 根据iframe参数设置选中的菜单项
  useEffect(() => {
    if (hasMenus && iframeParams?.menu && menuTree.length > 0) {
      const targetMenu = iframeParams.menu;
      console.log('根据iframe参数设置菜单选中状�?', targetMenu);

      const normalizeMenuValue = (value?: string): string => {
        if (!value) return '';
        return decodeURIComponent(value)
          .trim()
          .toLowerCase()
          .replace(/^#\/?/, '')
          .replace(/^\//, '')
          .replace(/\?.*$/, '');
      };

      const targetAliasMap: Record<string, string[]> = {
        profile:       ['profile', 'personal/profile'],
        security:      ['security', 'personal/security'],
        notifications: ['notifications', 'personal/notifications'],
        dashboard:     ['dashboard', 'platform/dashboard'],
        orders:        ['orders', 'trading/orders', 'personal/orders'],
        cart:          ['cart', 'business/products'],
        settings:      ['settings', 'system/settings'],
        history:       ['history', 'trading/orders'],
        favorites:     ['favorites', 'business/products'],
        users:         ['users', 'platform/users'],
        merchants:     ['merchants', 'platform/merchants'],
        categories:    ['categories', 'platform/categories'],
        dictionaries:  ['dictionaries', 'system/dictionaries'],
        chainnet:      ['chainnet', 'system/chainnet'],
        smart:         ['smart', 'contract/smart'],
        balance:       ['balance', 'assets/balance'],
        rewards:       ['rewards', 'assets/rewards'],
        transactions:  ['transactions', 'assets/transactions'],
        addresses:     ['addresses', 'trading/addresses'],
      };
      const normalizedTarget = normalizeMenuValue(targetMenu);
      const candidates = new Set<string>([
        normalizedTarget,
        ...(targetAliasMap[normalizedTarget] || []),
      ]);
      
      // 查找对应的菜单项
      const findMenuByTarget = (menus: CategoryTreeResp[]): CategoryTreeResp | null => {
        for (const menu of menus) {
          const normalizedUrl = normalizeMenuValue(menu.url || '');
          const normalizedComponent = normalizeMenuValue(menu.component || '');
          const normalizedName = normalizeMenuValue(menu.name || '');

          const matchByExact =
            candidates.has(normalizedUrl) ||
            candidates.has(normalizedComponent) ||
            candidates.has(normalizedName);

          const matchByContains = [...candidates].some((candidate) => {
            if (!candidate) return false;
            return (
              normalizedUrl.includes(candidate) ||
              normalizedComponent.includes(candidate) ||
              normalizedName.includes(candidate)
            );
          });

          if (matchByExact || matchByContains) {
            return menu;
          }
          if (menu.children) {
            const found = findMenuByTarget(menu.children);
            if (found) return found;
          }
        }
        return null;
      };

      const foundMenu = findMenuByTarget(menuTree);
      if (foundMenu) {
        console.log('找到匹配的菜单项:', foundMenu);
        setSelectedMenuId(foundMenu.id);
        setSelectedMenu(foundMenu);
        setActiveMenuByUrl(foundMenu.url);
      } else {
        console.log('未找到匹配的菜单项，使用默认欢迎页面');
        setSelectedMenuId(null);
        setSelectedMenu(null);
      }
    }
  }, [hasMenus, iframeParams?.menu, menuTree, setActiveMenuByUrl]);

  // 处理菜单点击
  const handleMenuClick = (menuItem: CategoryTreeResp) => {
    setSelectedMenuId(menuItem.id);
    setSelectedMenu(menuItem);
    setActiveMenuByUrl(menuItem.url);
    
    // 通知父窗口菜单变�?
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'MENU_CHANGE',
        menu: menuItem.url
      }, '*');
    }
  };

  // 找到第一个可点击叶子菜单，供默认欢迎页跳转使�?
  const getFirstLeafMenu = useCallback((menus: CategoryTreeResp[]): CategoryTreeResp | null => {
    for (const menu of menus) {
      if (menu.children && menu.children.length > 0) {
        const leaf = getFirstLeafMenu(menu.children);
        if (leaf) return leaf;
      } else {
        return menu;
      }
    }
    return null;
  }, []);

  const firstLeafMenu = useMemo(() => getFirstLeafMenu(menuTree), [menuTree, getFirstLeafMenu]);

  const handleEnterDefaultMenu = useCallback(() => {
    if (!firstLeafMenu) return;
    handleMenuClick(firstLeafMenu);
  }, [firstLeafMenu]);

  // 构建菜单�?
  const buildMenuItems = (menus: CategoryTreeResp[]): any[] => {
    return menus.map(menu => ({
      key: menu.id.toString(),
      label: menu.name,
      icon: menu.icon ? <i className={normalizeFaIcon(menu.icon)}></i> : null,
      children: menu.children && menu.children.length > 0 
        ? buildMenuItems(menu.children)
        : undefined,
      onClick: menu.children && menu.children.length > 0 
        ? undefined 
        : () => handleMenuClick(menu)
    }));
  };

  // 移除 renderContent 函数，使�?AdminContentComponent 组件

  // 渲染菜单内容
  const renderMenuContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      );
    }

    if (!hasMenus) {
      return (
        <div className="p-4 text-center">
          <div className="flex flex-col items-center justify-center h-64">
            <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <Text type="secondary" className="text-lg mb-2 text-white">{t('layout.menuLoadFailed')}</Text>
            <Text type="secondary" className="text-sm mb-4 text-gray-300">
              {t('layout.menuLoadFailedHint')}
            </Text>
            <Button 
              type="primary" 
              icon={<RefreshCw size={16} />}
              onClick={refreshMenus}
              size="small"
            >
              {t('layout.reloadMenu')}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="menu-container">
        {menuTree.map((menuGroup, groupIndex) => (
          <div key={groupIndex} className="menu-group">
            <div className="menu-group-title">
              <i className={normalizeFaIcon(menuGroup.icon, 'fa-folder')}></i>
              {!collapsed && <span>{menuGroup.name}</span>}
            </div>
            <div className="menu-group-content">
              {menuGroup.children && menuGroup.children.map((menuItem) => (
                <div
                  key={menuItem.id}
                  className={`menu-item ${selectedMenuId === menuItem.id ? 'active' : ''}`}
                  onClick={() => handleMenuClick(menuItem)}
                >
                  <div className="menu-item-content">
                    <i className={normalizeFaIcon(menuItem.icon, 'fa-circle')}></i>
                    {!collapsed && <span>{menuItem.name}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-container">
      {/* 左侧菜单�?*/}
      <aside className="sidebar" id="sidebar">
        {renderMenuContent()}
      </aside>
      
      {/* 右侧内容区域 */}
      <main className="content-area">
        <AdminContentComponent
          selectedMenu={selectedMenu}
          firstMenuName={firstLeafMenu?.name}
          onEnterDefaultMenu={handleEnterDefaultMenu}
        />
      </main>
    </div>
  );
};

export default AdminLayout;