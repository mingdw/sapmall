/**
 * 管理后台主要JavaScript文件
 * 包含菜单渲染、页面加载、角色管理等功能
 */

// 全局变量
let currentRole = 'admin'; // 当前用户角色
let currentLanguage = 'zh'; // 当前语言
let currentPage = 'dashboard'; // 当前页面
let isMobile = window.innerWidth <= 768;

// 菜单配置
const menuConfig = {
    admin: [
        {
            title: '平台管理',
            icon: 'fas fa-cogs',
            items: [
                { name: '平台概览', icon: 'fas fa-chart-pie', url: 'dashboard.html', title: '平台概览' },
                { name: '用户管理', icon: 'fas fa-users', url: 'user-management.html', title: '用户管理' },
                { name: '商家管理', icon: 'fas fa-store', url: 'merchant-manage.html', title: '商家管理' },
                { name: '订单管理', icon: 'fas fa-shopping-bag', url: 'admin-orders.html', title: '订单管理' }
            ]
        },
        {
            title: '合约管理',
            icon: 'fas fa-file-contract',
            items: [
                { name: '智能合约', icon: 'fas fa-code', url: 'smart-contracts.html', title: '智能合约' },
                { name: '交易监控', icon: 'fas fa-chart-line', url: 'transaction-monitor.html', title: '交易监控' }
            ]
        },
        
        {
            title: '系统管理',
            icon: 'fas fa-server',
            items: [
                { name: '系统设置', icon: 'fas fa-cog', url: 'system-settings.html', title: '系统设置' },
                { name: '日志管理', icon: 'fas fa-file-alt', url: 'logs.html', title: '日志管理' }
            ]
        },
        {
            title: 'DAO治理',
            icon: 'fas fa-vote-yea',
            items: [
                { name: '治理监控', icon: 'fas fa-chart-pie', url: 'governance-monitor.html', title: '治理监控' },
                { name: '提案管理', icon: 'fas fa-clipboard-list', url: 'admin-proposals.html', title: '提案管理' },
                { name: '治理配置', icon: 'fas fa-sliders-h', url: 'governance-config.html', title: '治理配置' },
                { name: '权限管理', icon: 'fas fa-user-shield', url: 'permission-management.html', title: '权限管理' },
                { name: '系统治理', icon: 'fas fa-tools', url: 'system-governance.html', title: '系统治理' }
            ]
        },
    ],
    user: [
        {
            title: '个人中心',
            icon: 'fas fa-user',
            items: [
                { name: '个人信息', icon: 'fas fa-id-card', url: 'profile.html', title: '个人信息' },
                { name: '安全设置', icon: 'fas fa-shield-alt', url: 'security.html', title: '安全设置' },
                { name: '通知设置', icon: 'fas fa-bell', url: 'notifications.html', title: '通知设置' }
            ]
        },
        {
            title: '我的资产',
            icon: 'fas fa-wallet',
            items: [
                { name: '账户余额', icon: 'fas fa-coins', url: 'balance.html', title: '账户余额' },
                { name: '质押管理', icon: 'fas fa-piggy-bank', url: 'staking.html', title: '质押管理' },
                { name: '交易记录', icon: 'fas fa-history', url: 'transactions.html', title: '交易记录' }
            ]
        },
        {
            title: '交易管理',
            icon: 'fas fa-exchange-alt',
            items: [
                { name: '我的订单', icon: 'fas fa-shopping-cart', url: 'orders.html', title: '我的订单' },
                { name: '我的收货地址', icon: 'fas fa-map-marker-alt', url: 'addresses.html', title: '我的收货地址' },
                { name: '退款/售后', icon: 'fas fa-undo', url: 'refunds.html', title: '退款/售后' }
            ]
        },
        {
            title: 'DAO治理',
            icon: 'fas fa-vote-yea',
            items: [
                { name: '治理概览', icon: 'fas fa-chart-pie', url: 'governance-overview.html', title: '治理概览' },
                { name: '提案管理', icon: 'fas fa-clipboard-list', url: 'user-proposals.html', title: '提案管理' },
                { name: '社区参与', icon: 'fas fa-lock', url: 'user-community.html', title: '社区参与' },
                { name: '治理学习', icon: 'fas fa-graduation-cap', url: 'governance-learn.html', title: '治理学习' }
            ]
        }
    ]
};

// 语言配置
const languages = {
    zh: {
        selectRole: '选择用户角色',
        selectRoleDesc: '请选择您要体验的用户角色',
        normalUser: '普通用户',
        normalUserDesc: '个人中心、资产管理、交易管理、DAO治理',
        certifiedMerchant: '认证商户',
        certifiedMerchantDesc: '包含普通用户功能 + 商家中心',
        systemAdmin: '系统管理员',
        systemAdminDesc: '平台管理、合约管理、DAO治理管理、系统管理',
        switchToNormalUser: '切换到普通用户',
        switchToMerchant: '切换到认证商户',
        switchToAdmin: '切换到系统管理员',
        settings: '设置',
        logout: '退出登录',
        dashboard: '数据概览',
        adminBackend: '管理后台'
    },
    en: {
        selectRole: 'Select User Role',
        selectRoleDesc: 'Please select the user role you want to experience',
        normalUser: 'Normal User',
        normalUserDesc: 'Personal Center, Asset Management, Trading Management, DAO Governance',
        certifiedMerchant: 'Certified Merchant',
        certifiedMerchantDesc: 'Includes normal user functions + Merchant Center',
        systemAdmin: 'System Administrator',
        systemAdminDesc: 'Platform Management, Contract Management, DAO Governance Management, System Management',
        switchToNormalUser: 'Switch to Normal User',
        switchToMerchant: 'Switch to Certified Merchant',
        switchToAdmin: 'Switch to System Administrator',
        settings: 'Settings',
        logout: 'Logout',
        dashboard: 'Dashboard',
        adminBackend: 'Admin Backend'
    }
};

// 页面标题映射
const pageTitles = {
    'dashboard': '数据概览',
    'orders': '订单管理',
    'products': '商品管理',
    'users': '用户管理',
    'transactions': '交易管理',
    'analytics': '数据分析',
    'reports': '报表中心',
    'settings': '系统设置',
    'logs': '操作日志'
};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 抑制一些常见的原型开发中的控制台错误
    suppressPrototypeErrors();
    
    initializeApp();
    setupEventListeners();
    checkMobileView();
    
    // 网络状态监控
    monitorNetworkStatus();
});

// 抑制原型开发中的常见错误
function suppressPrototypeErrors() {
    // 覆盖console.error以过滤一些无关紧要的错误
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        
        // 过滤掉一些原型开发中常见但无害的错误
        if (message.includes('Could not establish connection') ||
            message.includes('Receiving end does not exist') ||
            message.includes('Unchecked runtime.lastError') ||
            message.includes('Extension context invalidated')) {
            // 这些通常是浏览器扩展相关的错误，在原型开发中可以忽略
            console.log('🔇 已过滤浏览器扩展相关错误:', message);
            return;
        }
        
        // 其他错误正常显示
        originalError.apply(console, args);
    };
    
    console.log('🛡️ 错误过滤器已激活');
}

// 网络状态监控
function monitorNetworkStatus() {
    // 监听网络状态变化
    window.addEventListener('online', function() {
        console.log('🌐 网络连接已恢复');
        showToast('success', '网络状态', '网络连接已恢复');
    });
    
    window.addEventListener('offline', function() {
        console.log('📴 网络连接已断开');
        showToast('warning', '网络状态', '网络连接已断开，某些功能可能受限');
    });
    
    // 初始网络状态检查
    if (!navigator.onLine) {
        console.log('📴 当前处于离线状态');
    } else {
        console.log('🌐 网络连接正常');
    }
}

// 初始化应用
function initializeApp() {
    // 检查是否有保存的角色
    const savedRole = localStorage.getItem('currentRole');
    const savedLanguage = localStorage.getItem('currentLanguage');
    
    // 验证角色是否有效
    const validRoles = ['user', 'merchant', 'admin'];
    if (savedRole && validRoles.includes(savedRole)) {
        currentRole = savedRole;
        renderMenu(savedRole);
    } else {
        // 默认设置为普通用户角色
        currentRole = 'user';
        localStorage.setItem('currentRole', 'user');
        renderMenu('user');
    }
    
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        updateLanguageDisplay();
    }
    
    // 渲染菜单后，自动加载第一个页面
    let config;
    if (currentRole === 'merchant') {
        config = getMerchantMenuConfig();
    } else {
        config = menuConfig[currentRole] || menuConfig.user;
    }
    if (config.length > 0 && config[0].items.length > 0) {
        const firstItem = config[0].items[0];
        loadPage(firstItem.url, firstItem.title, firstItem.icon);
    }
    
    // 监听来自父窗口的消息（用于角色切换）
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'setRole') {
            const role = event.data.role;
            if (validRoles.includes(role)) {
                currentRole = role;
                localStorage.setItem('currentRole', role);
                renderMenu(role);
                
                // 向父窗口发送确认消息
                if (event.source) {
                    event.source.postMessage({
                        type: 'roleSet',
                        role: role
                    }, '*');
                }
            }
        } else if (event.data && event.data.type === 'getRole') {
            // 响应角色请求
            if (event.source) {
                event.source.postMessage({
                    type: 'currentRole',
                    role: currentRole
                }, '*');
            }
        }
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 侧边栏切换
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // 语言切换
    const langToggle = document.getElementById('langToggle');
    const langMenu = document.getElementById('langMenu');
    if (langToggle && langMenu) {
        langToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
        });
    }
    
    // 用户菜单切换
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userMenu = document.getElementById('userMenu');
    if (userMenuToggle && userMenu) {
        userMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('hidden');
        });
    }
    
    // 点击外部关闭下拉菜单
    document.addEventListener('click', function() {
        const langMenu = document.getElementById('langMenu');
        const userMenu = document.getElementById('userMenu');
        if (langMenu) langMenu.classList.add('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    });
    
    // 监听iframe加载完成
    const contentFrame = document.getElementById('contentFrame');
    if (contentFrame) {
        contentFrame.addEventListener('load', function() {
            // 可以在这里添加iframe加载完成后的处理逻辑
            console.log('Content frame loaded:', contentFrame.src);
        });
    }
}

// 选择角色
function selectRole(role) {
    const validRoles = ['user', 'merchant', 'admin'];
    if (!validRoles.includes(role)) {
        console.error('Invalid role:', role);
        return;
    }
    
    currentRole = role;
    localStorage.setItem('currentRole', role);
    
    renderMenu(role);
    updateRoleDisplay();
    
    // 显示切换成功提示
    const roleNames = {
        'user': '普通用户',
        'merchant': '认证商家',
        'admin': '系统管理员'
    };
    showToast('success', '角色切换成功', `已切换到${roleNames[role]}模式`);
}

// 渲染菜单
function renderMenu(role) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // 根据角色获取菜单配置
    let config;
    if (role === 'merchant') {
        config = getMerchantMenuConfig(); // 使用动态生成的商家菜单（包含用户菜单）
    } else {
        config = menuConfig[role] || menuConfig.user;
    }
    
    sidebar.innerHTML = config.map(group => `
        <div class="menu-group">
            <div class="menu-group-title">
                <i class="${group.icon}"></i>
                <span>${group.title}</span>
            </div>
            <div class="menu-group-content">
                ${group.items.map(item => `
                    <div class="menu-item" onclick="loadPage('${item.url}', '${item.title}', '${item.icon}')">
                        <div class="menu-item-content">
                            <i class="${item.icon}"></i>
                            <span>${item.name}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // 设置默认激活项
    setActiveMenuItem(config[0].items[0].url);
}

// 加载页面
function loadPage(url, title, icon) {
    const iframe = document.getElementById('contentIframe');
    const pageTitle = document.getElementById('pageTitle');
    const pageIcon = document.getElementById('pageIcon');
    
    if (iframe) {
        console.log('🔄 开始加载新页面:', url);
        
        // 立即通知高度管理器页面即将切换
        if (window.iframeHeightManager) {
            window.iframeHeightManager.isLoading = true;
            console.log('📄 通知高度管理器：页面切换开始');
        }
        
        // 显示加载状态
        showLoading();
        
        // 设置加载完成的处理
        const handleLoad = function() {
            hideLoading();
            console.log('✅ 页面加载成功:', url);
            
            // 延迟触发高度检测，确保内容完全渲染
            setTimeout(() => {
                if (window.iframeHeightManager) {
                    console.log('🔧 触发新页面高度检测');
                    window.iframeHeightManager.recalculate();
                }
                
                // 额外的手动检测，确保高度正确
                setTimeout(() => {
                    if (window.recalculateHeight) {
                        console.log('🔧 执行额外的高度检测');
                        window.recalculateHeight();
                    }
                }, 1000);
            }, 500);
            
            iframe.removeEventListener('load', handleLoad);
            iframe.removeEventListener('error', handleError);
        };
        
        const handleError = function(event) {
            hideLoading();
            console.error('❌ 页面加载失败:', url, event);
            
            // 重置加载状态
            if (window.iframeHeightManager) {
                window.iframeHeightManager.isLoading = false;
            }
            
            // 检查是否是网络连接问题
            if (navigator.onLine === false) {
                showError('网络连接已断开，请检查网络连接后重试');
            } else {
                showError(`页面加载失败：${url}<br/>请确保文件存在并且服务器正常运行`);
            }
            
            iframe.removeEventListener('load', handleLoad);
            iframe.removeEventListener('error', handleError);
        };
        
        // 添加超时处理
        const loadTimeout = setTimeout(() => {
            console.warn('⏰ 页面加载超时:', url);
            hideLoading();
            
            // 重置加载状态
            if (window.iframeHeightManager) {
                window.iframeHeightManager.isLoading = false;
            }
            
            showError('页面加载超时，请重试');
            iframe.removeEventListener('load', handleLoad);
            iframe.removeEventListener('error', handleError);
        }, 10000); // 10秒超时
        
        iframe.addEventListener('load', () => {
            clearTimeout(loadTimeout);
            handleLoad();
        });
        iframe.addEventListener('error', (event) => {
            clearTimeout(loadTimeout);
            handleError(event);
        });
        
        // 设置新的源地址
        iframe.src = url;
    }
    
    // 更新卡片头部标题和图标
    if (pageTitle) {
        pageTitle.textContent = title;
    }
    
    if (pageIcon) {
        pageIcon.className = icon;
    }
    
    // 设置活跃菜单项
    setActiveMenuItem(url);
}

// 设置活跃菜单项
function setActiveMenuItem(url) {
    // 移除所有活跃状态
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加活跃状态到当前项
    document.querySelectorAll('.menu-item').forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(url)) {
            item.classList.add('active');
        }
    });
}

// 显示加载状态
function showLoading() {
    const iframe = document.getElementById('contentIframe');
    if (iframe) {
        // 在iframe上添加加载遮罩，而不是替换iframe
        iframe.style.display = 'none';
        
        // 创建加载遮罩
        let loadingOverlay = document.querySelector('.loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p style="margin-top: 16px; color: #94a3b8;">加载中...</p>
                </div>
            `;
            iframe.parentNode.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
    }
}

// 隐藏加载状态
function hideLoading() {
    const iframe = document.getElementById('contentIframe');
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    if (iframe) {
        iframe.style.display = 'block';
    }
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// 显示错误信息
function showError(message) {
    const iframe = document.getElementById('contentIframe');
    if (iframe) {
        iframe.style.display = 'none';
        
        // 创建错误遮罩
        let errorOverlay = document.querySelector('.error-overlay');
        if (!errorOverlay) {
            errorOverlay = document.createElement('div');
            errorOverlay.className = 'error-overlay';
            iframe.parentNode.appendChild(errorOverlay);
        }
        
        errorOverlay.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>加载失败</h3>
                <p>${message}</p>
                <button class="retry-button" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    重新加载
                </button>
            </div>
        `;
        errorOverlay.style.display = 'flex';
    }
}

// 切换用户角色
function switchUserRole(role) {
    currentRole = role;
    renderMenu(role);
    
    // 加载默认页面
    let config;
    if (role === 'merchant') {
        config = getMerchantMenuConfig();
    } else {
        config = menuConfig[role] || menuConfig.user;
    }
    
    if (config.length > 0 && config[0].items.length > 0) {
        const firstItem = config[0].items[0];
        loadPage(firstItem.url, firstItem.title, firstItem.icon);
    }
}

// 显示帮助信息
function showHelp() {
    alert('这里是帮助信息，可以显示当前页面的使用说明。');
}

// 调试工具：显示iframe信息（简化版本）
function showIframeInfo() {
    const iframe = document.getElementById('contentIframe');
    if (iframe) {
        console.log('📊 Iframe信息:');
        console.log('- 当前源:', iframe.src);
        console.log('- 实际高度:', iframe.offsetHeight + 'px');
        console.log('- CSS高度:', getComputedStyle(iframe).height);
        console.log('- 视窗高度:', window.innerHeight + 'px');
        console.log('- 使用CSS clamp()自适应高度方案');
    }
}

// 将函数添加到全局作用域，方便调试
window.showIframeInfo = showIframeInfo;

// 更新角色显示
function updateRoleDisplay() {
    const roleTitle = document.getElementById('roleTitle');
    const userRoleText = document.getElementById('userRoleText');
    const roleConfig = menuConfig[currentRole];
    
    if (roleTitle && roleConfig) {
        roleTitle.textContent = roleConfig.title;
    }
    
    if (userRoleText && roleConfig) {
        userRoleText.textContent = roleConfig.roleText;
    }
}

// 页面导航
function navigateToPage(page, title, pageId) {
    const contentFrame = document.getElementById('contentFrame');
    const currentPageElement = document.getElementById('currentPage');
    
    if (contentFrame && page) {
        contentFrame.src = page;
        currentPage = pageId || 'dashboard';
    }
    
    if (currentPageElement && title) {
        currentPageElement.textContent = title;
    }
    
    // 更新菜单激活状态
    updateMenuActiveState(pageId);
}

// 更新菜单激活状态
function updateMenuActiveState(activePageId) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 找到对应的菜单项并激活
    const activeMenuItem = document.querySelector(`[onclick*="${activePageId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
}

// 切换侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// 语言切换
function switchLanguage(lang) {
    if (!languages[lang]) return;
    
    currentLanguage = lang;
    localStorage.setItem('currentLanguage', lang);
    updateLanguageDisplay();
    
    // 隐藏语言菜单
    const langMenu = document.getElementById('langMenu');
    if (langMenu) {
        langMenu.classList.add('hidden');
    }
    
    showToast('success', '语言切换成功', `已切换到${lang === 'zh' ? '中文' : 'English'}`);
}

// 更新语言显示
function updateLanguageDisplay() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const flagAndText = currentLanguage === 'zh' ? '🇨🇳 中文' : '🇺🇸 English';
        langToggle.innerHTML = `
            <span class="text-sm">${flagAndText}</span>
            <i class="fas fa-chevron-down text-xs text-gray-500"></i>
        `;
    }
}

// 显示Toast通知
function showToast(type, title, message) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastIcon || !toastTitle || !toastMessage) return;
    
    // 设置图标和样式
    let iconClass = '';
    let iconColor = '';
    
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            iconColor = 'text-green-500';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            iconColor = 'text-yellow-500';
            break;
        case 'error':
            iconClass = 'fas fa-times-circle';
            iconColor = 'text-red-500';
            break;
        default:
            iconClass = 'fas fa-info-circle';
            iconColor = 'text-blue-500';
    }
    
    toastIcon.innerHTML = `<i class="${iconClass} ${iconColor} text-xl"></i>`;
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // 显示Toast
    toast.classList.remove('hidden');
    
    // 3秒后自动隐藏
    setTimeout(() => {
        hideToast();
    }, 3000);
}

// 隐藏Toast通知
function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('hidden');
    }
}

// 响应式处理
function checkMobileView() {
    isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // 移动端处理
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    } else {
        // 桌面端处理
        closeMobileMenu();
    }
}

// 移动端菜单切换
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
        
        // 防止背景滚动
        document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
    }
}

// 关闭移动端菜单
function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// 窗口大小变化处理
function handleResize() {
    const newIsMobile = window.innerWidth <= 768;
    
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        checkMobileView();
    }
}

// 页面加载完成提示
console.log('Admin backend initialized successfully');

// 导出主要函数（如果需要在其他地方使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderMenu,
        loadPage,
        getCurrentUserRole: function() {
            return currentRole;
        },
        setUserRole,
        showLoading,
        hideLoading,
        showError
    };
}

// 动态生成merchant菜单配置（继承user + 添加商家中心）
function getMerchantMenuConfig() {
    // 深拷贝user菜单配置
    const userMenus = JSON.parse(JSON.stringify(menuConfig.user));
    
    // 修改DAO治理菜单为商家版本
    const daoGovernanceIndex = userMenus.findIndex(menu => menu.title === 'DAO治理');
    if (daoGovernanceIndex !== -1) {
        userMenus[daoGovernanceIndex] = {
            title: 'DAO治理',
            icon: 'fas fa-vote-yea',
            items: [
                { name: '治理概览', icon: 'fas fa-chart-pie', url: 'merchant-governance-overview.html', title: '商家治理概览' },
                { name: '提案管理', icon: 'fas fa-clipboard-list', url: 'merchant-proposals.html', title: '提案管理' },
                { name: '社区参与', icon: 'fas fa-users', url: 'user-community.html', title: '社区参与' },
                { name: '治理学习', icon: 'fas fa-graduation-cap', url: 'governance-learn.html', title: '治理学习' }
            ]
        };
    }
    
    // 添加商家中心菜单
    const merchantCenter = {
        title: '商家中心',
        icon: 'fas fa-store',
        items: [
            { name: '店铺概览', icon: 'fas fa-chart-pie', url: 'merchant-store-overview.html', title: '店铺概览' },
            { name: '商品管理', icon: 'fas fa-box', url: 'product-management.html', title: '商品管理' },
            { name: '订单管理', icon: 'fas fa-shopping-bag', url: 'merchant-orders.html', title: '商家订单管理' },
            { name: '评价管理', icon: 'fas fa-star', url: 'merchant-reviews.html', title: '评价管理' },
            { name: '交易数据', icon: 'fas fa-chart-bar', url: 'merchant-trade-data.html', title: '交易数据' }
        ]
    };
    
    // 将商家中心菜单插入到合适的位置（在交易管理之后，DAO治理之前）
    const tradeManagementIndex = userMenus.findIndex(menu => menu.title === '交易管理');
    const insertIndex = tradeManagementIndex !== -1 ? tradeManagementIndex + 1 : userMenus.length - 1;
    userMenus.splice(insertIndex, 0, merchantCenter);
    
    return userMenus;
} 