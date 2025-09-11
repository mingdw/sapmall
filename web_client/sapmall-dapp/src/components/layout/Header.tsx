'use client'
import { useState, useRef, useEffect } from 'react';
import '../../style/glass-header.css';
// 类型定义
interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
}
interface FavoriteItem {
  id: number;
  name: string;
  category: string;
}

export const Header: React.FC = () => {
  // 状态管理
  const [currentLanguage, setCurrentLanguage] = useState<'zh' | 'en'>('zh');
  const [currentPage, setCurrentPage] = useState<string>('marketplace');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [network, setNetwork] = useState<{ name: string; iconClass: string; symbol: string }>({ name: 'Ethereum', iconClass: 'network-ethereum', symbol: 'Ξ' });
  const [balance, setBalance] = useState('2.5 ETH');
  const [address, setAddress] = useState('0x1234...5678');
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  // refs for click outside
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const networkDropdownRef = useRef<HTMLDivElement>(null);
  const walletDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const roleModalRef = useRef<HTMLDivElement>(null);

  // 初始化用户数据
  useEffect(() => {
    if (isWalletConnected) {
      setCartItems([
        { id: 1, name: '稀有NFT艺术品', price: '0.5 ETH', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=300' },
        { id: 2, name: '游戏道具包', price: '0.2 ETH', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300' },
        { id: 3, name: '数字收藏卡', price: '0.1 ETH', image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300' }
      ]);
      setFavoriteItems([
        { id: 1, name: '传奇武器皮肤', category: '游戏道具' },
        { id: 2, name: '限量版头像', category: 'NFT艺术' },
        { id: 3, name: '虚拟土地', category: '元宇宙' },
        { id: 4, name: '音乐NFT', category: '数字音乐' },
        { id: 5, name: '体育卡牌', category: '收藏品' },
        { id: 6, name: '3D模型', category: '数字资产' },
        { id: 7, name: '域名NFT', category: '域名' },
        { id: 8, name: '艺术摄影', category: 'NFT艺术' }
      ]);
      setBalance('2.5 ETH');
      setAddress('0x1234...5678');
    } else {
      setCartItems([]);
      setFavoriteItems([]);
      setBalance('0 ETH');
      setAddress('');
    }
  }, [isWalletConnected]);

  // Toast 自动消失
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 点击外部关闭下拉菜单/模态框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
      if (
        networkDropdownRef.current &&
        !networkDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNetworkDropdown(false);
      }
      if (
        walletDropdownRef.current &&
        !walletDropdownRef.current.contains(event.target as Node)
      ) {
        setShowWalletDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
      if (
        showRoleModal &&
        roleModalRef.current &&
        event.target === roleModalRef.current
      ) {
        setShowRoleModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRoleModal]);

  // 切换页面
  const handleSwitchPage = (page: string) => {
    setCurrentPage(page);
    setShowMobileMenu(false);
    // 这里可以加路由跳转逻辑
    showToastMsg(`Switched to ${page} page`, 'info');
  };

  // 语言切换
  const handleSwitchLanguage = (lang: 'zh' | 'en') => {
    setCurrentLanguage(lang);
    setShowLanguageDropdown(false);
  };

  // 网络切换
  const handleSwitchNetwork = (name: string, iconClass: string, symbol: string) => {
    setNetwork({ name, iconClass, symbol });
    setShowNetworkDropdown(false);
    showToastMsg(`已切换到 ${name} 网络`, 'success');
  };

  // 钱包连接
  const handleConnectWallet = () => {
    showToastMsg('正在连接钱包...', 'info');
    setTimeout(() => {
      setIsWalletConnected(true);
      showToastMsg('钱包连接成功', 'success');
    }, 1000);
  };
  const handleDisconnectWallet = () => {
    setIsWalletConnected(false);
    setShowWalletDropdown(false);
    showToastMsg('钱包已断开连接', 'info');
  };

  // 个人资料、购物车、收藏夹、订单、设置、交易历史
  const handleViewProfile = () => {
    if (!isWalletConnected) return showToastMsg('请先连接钱包', 'error');
    setShowRoleModal(true);
    setShowWalletDropdown(false);
  };
  const handleViewCart = () => {
    if (!isWalletConnected) return showToastMsg('请先连接钱包', 'error');
    setShowCartModal(true);
    setShowWalletDropdown(false);
  };
  const handleViewFavorites = () => {
    if (!isWalletConnected) return showToastMsg('请先连接钱包', 'error');
    setShowFavoritesModal(true);
    setShowWalletDropdown(false);
  };
  const handleViewOrders = () => {
    if (!isWalletConnected) return showToastMsg('请先连接钱包', 'error');
    showToastMsg('正在加载订单信息...', 'info');
    setShowWalletDropdown(false);
  };
  const handleViewSettings = () => {
    if (!isWalletConnected) return showToastMsg('请先连接钱包', 'error');
    showToastMsg('正在打开设置...', 'info');
    setShowWalletDropdown(false);
  };
  const handleViewTransactions = () => {
    showToastMsg('正在加载交易历史...', 'info');
    setShowWalletDropdown(false);
  };

  // 购物车操作
  const handleRemoveFromCart = (itemId: number) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    showToastMsg('商品已从购物车移除', 'success');
  };
  const handleProceedToCheckout = () => {
    showToastMsg('正在跳转到结算页面...', 'info');
    setShowCartModal(false);
  };

  // 收藏夹操作
  const handleRemoveFromFavorites = (itemId: number) => {
    setFavoriteItems(items => items.filter(item => item.id !== itemId));
    showToastMsg('已取消收藏', 'success');
  };
  const handleAddToCartFromFavorites = (itemId: number) => {
    const favoriteItem = favoriteItems.find(item => item.id === itemId);
    if (favoriteItem) {
      setCartItems(items => [
        ...items,
        {
          id: Date.now(),
          name: favoriteItem.name,
          price: '0.3 ETH',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
        },
      ]);
      showToastMsg('商品已添加到购物车', 'success');
    }
  };

  // Toast
  function showToastMsg(message: string, type: 'info' | 'success' | 'error') {
    setToast({ message, type });
  }

  // 角色选择
  const handleSelectRole = (role: 'user' | 'merchant' | 'admin') => {
    const roleNames = {
      user: '普通用户',
      merchant: '认证商家',
      admin: '系统管理员',
    };
    showToastMsg(`正在以${roleNames[role]}身份加载管理后台...`, 'info');
    setShowRoleModal(false);
    // 这里可以加 iframe 跳转或页面跳转逻辑
    setTimeout(() => {
      showToastMsg(`${roleNames[role]}后台加载成功`, 'success');
    }, 800);
  };

  // 购物车模态框内容
  const CartModal = () => {
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += parseFloat(item.price.replace(' ETH', ''));
    });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transform scale-100 transition-transform duration-300">
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              <span>{currentLanguage === 'zh' ? '购物车' : 'My Cart'}</span>
            </h2>
            <button onClick={() => setShowCartModal(false)} className="text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <div className="modal-body p-6 overflow-y-auto max-h-[70vh]">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-shopping-cart text-6xl text-gray-500 mb-4"></i>
                <p className="text-gray-400 text-lg">{currentLanguage === 'zh' ? '购物车为空' : 'Cart is empty'}</p>
                <p className="text-gray-500 text-sm mt-2">{currentLanguage === 'zh' ? '去商城逛逛吧' : 'Go shopping now'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-sapphire-400 font-bold">{item.price}</p>
                    </div>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-400 hover:text-red-300 transition-colors">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold text-white">
                    <span>{currentLanguage === 'zh' ? '总计' : 'Total'}</span>
                    <span className="text-sapphire-400">{totalPrice.toFixed(2)} ETH</span>
                  </div>
                  <button onClick={handleProceedToCheckout} className="w-full mt-4 bg-gradient-to-r from-sapphire-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-sapphire-600 hover:to-purple-700 transition-all">
                    <span>{currentLanguage === 'zh' ? '去结算' : 'Checkout'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 收藏夹模态框内容
  const FavoritesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transform scale-100 transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            <span>{currentLanguage === 'zh' ? '我的收藏' : 'My Favorites'}</span>
          </h2>
          <button onClick={() => setShowFavoritesModal(false)} className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className="modal-body p-6 overflow-y-auto max-h-[70vh]">
          {favoriteItems.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-heart text-6xl text-gray-500 mb-4"></i>
              <p className="text-gray-400 text-lg">{currentLanguage === 'zh' ? '收藏夹为空' : 'No favorites yet'}</p>
              <p className="text-gray-500 text-sm mt-2">{currentLanguage === 'zh' ? '收藏喜欢的商品吧' : 'Start collecting your favorites'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-heart text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleAddToCartFromFavorites(item.id)} className="text-sapphire-400 hover:text-sapphire-300 transition-colors" title="添加到购物车">
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                    <button onClick={() => handleRemoveFromFavorites(item.id)} className="text-red-400 hover:text-red-300 transition-colors" title="移除收藏">
                      <i className="fas fa-heart-broken"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 角色选择模态框
  const RoleModal = () => (
    <div ref={roleModalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform scale-100 transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            <span>{currentLanguage === 'zh' ? '选择角色' : 'Select Role'}</span>
          </h2>
          <button onClick={() => setShowRoleModal(false)} className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <button onClick={() => handleSelectRole('user')} className="w-full bg-sapphire-500 hover:bg-sapphire-600 text-white py-3 rounded-lg font-medium transition-all">
            {currentLanguage === 'zh' ? '普通用户后台' : 'User Dashboard'}
          </button>
          <button onClick={() => handleSelectRole('merchant')} className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-all">
            {currentLanguage === 'zh' ? '认证商家后台' : 'Merchant Dashboard'}
          </button>
          <button onClick={() => handleSelectRole('admin')} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-all">
            {currentLanguage === 'zh' ? '系统管理员后台' : 'Admin Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );

  // Toast 组件
  const Toast = () => (
    toast ? (
      <div
        className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-sapphire-600'}`}
        style={{ minWidth: 200 }}
      >
        {toast.message}
      </div>
    ) : null
  );

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="mx-auto px-6 py-4" style={{ width: '90%' }}>
        <div className="flex items-center justify-between">
          {/* Logo  */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-gem text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sapphire-400 to-purple-400 bg-clip-text text-transparent">Sapphire Mall</h1>
              <p className="text-xs text-gray-400">Web3虚拟商品交易平台</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" onClick={() => handleSwitchPage('marketplace')} className={`nav-link ${currentPage === 'marketplace' ? 'text-sapphire-400' : 'text-gray-300 hover:text-sapphire-400'}`} data-zh="代币商城" data-en="Marketplace">代币商城</a>
            <a href="#" onClick={() => handleSwitchPage('staking')} className={`nav-link ${currentPage === 'staking' ? 'text-sapphire-400' : 'text-gray-300 hover:text-sapphire-400'}`} data-zh="质押" data-en="Staking">质押</a>
            <a href="#" onClick={() => handleSwitchPage('exchange')} className={`nav-link ${currentPage === 'exchange' ? 'text-sapphire-400' : 'text-gray-300 hover:text-sapphire-400'}`} data-zh="兑换" data-en="Exchange">兑换</a>
            <a href="#" onClick={() => handleSwitchPage('dao')} className={`nav-link ${currentPage === 'dao' ? 'text-sapphire-400' : 'text-gray-300 hover:text-sapphire-400'}`} data-zh="DAO" data-en="DAO">DAO</a>
            <a href="#" onClick={() => handleSwitchPage('help')} className={`nav-link ${currentPage === 'help' ? 'text-sapphire-400' : 'text-gray-300 hover:text-sapphire-400'}`} data-zh="帮助中心" data-en="Help Center">帮助中心</a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setShowMobileMenu(true)} className="md:hidden text-gray-300 hover:text-white">
            <i className="fas fa-bars text-xl"></i>
          </button>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="language-dropdown relative" ref={languageDropdownRef}>
              <button onClick={() => setShowLanguageDropdown(v => !v)} className="flex items-center space-x-2 text-gray-300 hover:text-sapphire-400 transition-colors">
                <i className="fas fa-globe"></i>
                <span id="currentLanguage">{currentLanguage === 'zh' ? '中文' : 'English'}</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              {showLanguageDropdown && (
                <div className="dropdown-menu absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[120px] z-50" style={{ opacity: 1, visibility: 'visible', transform: 'translateY(0)' }}>
                  <div className="py-2">
                    <button onClick={() => handleSwitchLanguage('zh')} className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      <span>中文</span>
                      <i id="zh-check" className="fas fa-check text-sapphire-400" style={{ opacity: currentLanguage === 'zh' ? 1 : 0 }}></i>
                    </button>
                    <button onClick={() => handleSwitchLanguage('en')} className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                      <span>English</span>
                      <i id="en-check" className="fas fa-check text-sapphire-400" style={{ opacity: currentLanguage === 'en' ? 1 : 0 }}></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Connection */}
            {!isWalletConnected ? (
              <div id="walletDisconnected">
                <button onClick={handleConnectWallet} className="wallet-button">
                  <i className="fas fa-wallet mr-2"></i>
                  <span data-zh="连接钱包" data-en="Connect Wallet">{currentLanguage === 'zh' ? '连接钱包' : 'Connect Wallet'}</span>
                </button>
              </div>
            ) : (
              <div id="walletConnected" className="flex items-center space-x-3">
                {/* Network Selector */}
                <div className="relative" ref={networkDropdownRef}>
                  <button onClick={() => setShowNetworkDropdown(v => !v)} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">
                    <div className={`network-icon ${network.iconClass}`}>{network.symbol}</div>
                    <span className="text-sm">{network.name}</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  {showNetworkDropdown && (
                    <div className="dropdown absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[150px] z-50">
                      <div className="py-2">
                        <button onClick={() => handleSwitchNetwork('Ethereum', 'network-ethereum', 'Ξ')} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          <div className="network-icon network-ethereum">Ξ</div>
                          <span>Ethereum</span>
                        </button>
                        <button onClick={() => handleSwitchNetwork('Polygon', 'network-polygon', '⬢')} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          <div className="network-icon network-polygon">⬢</div>
                          <span>Polygon</span>
                        </button>
                        <button onClick={() => handleSwitchNetwork('BSC', 'network-bsc', 'B')} className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white">
                          <div className="network-icon network-bsc">B</div>
                          <span>BSC</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Wallet Info */}
                <div className="relative" ref={walletDropdownRef}>
                  <button onClick={() => setShowWalletDropdown(v => !v)} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                    <span className="text-sm">{address}</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  {showWalletDropdown && (
                    <div className="dropdown absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[200px] z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-600">
                          余额: {balance}
                        </div>
                        <button onClick={handleViewProfile} className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          <i className="fas fa-user"></i>
                          <span data-zh="个人资料" data-en="Profile">{currentLanguage === 'zh' ? '个人资料' : 'Profile'}</span>
                        </button>
                        <button onClick={handleViewCart} className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-shopping-cart"></i>
                            <span data-zh="我的购物车" data-en="My Cart">{currentLanguage === 'zh' ? '我的购物车' : 'My Cart'}</span>
                          </div>
                          <span id="cartItemCount" className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">{cartItems.length}</span>
                        </button>
                        <button onClick={handleViewFavorites} className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-heart"></i>
                            <span data-zh="我的收藏" data-en="My Favorites">{currentLanguage === 'zh' ? '我的收藏' : 'My Favorites'}</span>
                          </div>
                          <span id="favoriteItemCount" className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">{favoriteItems.length}</span>
                        </button>
                        <div className="border-t border-gray-600 my-1"></div>
                        <button onClick={handleViewOrders} className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          <i className="fas fa-box"></i>
                          <span data-zh="我的订单" data-en="My Orders">{currentLanguage === 'zh' ? '我的订单' : 'My Orders'}</span>
                        </button>
                        <button onClick={handleViewTransactions} className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          <i className="fas fa-history"></i>
                          <span data-zh="交易历史" data-en="Transaction History">{currentLanguage === 'zh' ? '交易历史' : 'Transaction History'}</span>
                        </button>
                        <div className="border-t border-gray-600 my-1"></div>
                        <button onClick={handleViewSettings} className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          <i className="fas fa-cog"></i>
                          <span data-zh="设置" data-en="Settings">{currentLanguage === 'zh' ? '设置' : 'Settings'}</span>
                        </button>
                        <button onClick={handleDisconnectWallet} className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300">
                          <i className="fas fa-sign-out-alt"></i>
                          <span data-zh="断开连接" data-en="Disconnect">{currentLanguage === 'zh' ? '断开连接' : 'Disconnect'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div ref={mobileMenuRef} className="mobile-menu md:hidden fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-700 z-50 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sapphire-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-gem text-white"></i>
              </div>
              <span className="font-bold text-sapphire-400">Sapphire Mall</span>
            </div>
            <button onClick={() => setShowMobileMenu(false)} className="text-gray-400 hover:text-white">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <nav className="space-y-4">
            <a href="#" onClick={() => handleSwitchPage('marketplace')} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" data-zh="代币商城" data-en="Marketplace">代币商城</a>
            <a href="#" onClick={() => handleSwitchPage('staking')} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" data-zh="质押" data-en="Staking">质押</a>
            <a href="#" onClick={() => handleSwitchPage('exchange')} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" data-zh="兑换" data-en="Exchange">兑换</a>
            <a href="#" onClick={() => handleSwitchPage('dao')} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" data-zh="DAO" data-en="DAO">DAO</a>
            <a href="#" onClick={() => handleSwitchPage('help')} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800" data-zh="帮助中心" data-en="Help Center">帮助中心</a>
          </nav>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <button onClick={handleConnectWallet} className="w-full wallet-button flex items-center justify-center space-x-2">
              <i className="fas fa-wallet"></i>
              <span data-zh="连接钱包" data-en="Connect Wallet">{currentLanguage === 'zh' ? '连接钱包' : 'Connect Wallet'}</span>
            </button>
          </div>
        </div>
      )}
      {/* 角色选择模态框 */}
      {showRoleModal && <RoleModal />}
      {/* 购物车模态框 */}
      {showCartModal && <CartModal />}
      {/* 收藏夹模态框 */}
      {showFavoritesModal && <FavoritesModal />}
      {/* Toast */}
      <Toast />
    </header>
  );
}; 