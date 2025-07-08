/* 订单页面脚本 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 订单页面开始初始化...');
    
    try {
        // 显示加载状态
        showLoadingState();
        
        // 初始化各个功能模块
        console.log('📋 初始化筛选按钮...');
        initFilterButtons();
        
        console.log('🔍 初始化搜索和筛选...');
        initSearchAndFilter();
        
        console.log('🎯 初始化订单操作...');
        initOrderActions();
        
        console.log('🪟 初始化模态框处理器...');
        initModalHandlers();
        
        console.log('📄 初始化页面操作...');
        initPageActions();
        
        console.log('📄 初始化分页处理器...');
        initPaginationHandlers();
        
        console.log('📊 生成模拟订单数据...');
        generateMockOrders();
        
        console.log('🎨 渲染订单列表...');
        renderOrders();
        
        console.log('📈 更新统计数据...');
        updateStats();
        
        // 隐藏加载状态，显示主内容
        hideLoadingState();
        
        console.log('✅ 订单页面初始化完成！');
        
    } catch (error) {
        console.error('❌ 订单页面初始化失败:', error);
        showErrorState(error.message);
    }
});

// 显示加载状态
function showLoadingState() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
    
    if (mainContent) {
        mainContent.style.display = 'none';
    }
}

// 隐藏加载状态
function hideLoadingState() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const mainContent = document.getElementById('mainContent');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    if (mainContent) {
        mainContent.style.display = 'block';
    }
}

// 显示错误状态
function showErrorState(errorMessage) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    if (loadingIndicator) {
        loadingIndicator.innerHTML = `
            <div style="text-align: center; color: #ef4444;">
                <i class="fas fa-exclamation-circle" style="font-size: 32px; margin-bottom: 16px;"></i>
                <div style="font-size: 16px; margin-bottom: 8px;">页面加载失败</div>
                <div style="font-size: 14px; color: #94a3b8;">${errorMessage}</div>
                <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    重新加载
                </button>
            </div>
        `;
    }
}

// 全局变量
let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentFilter = 'all';

// 模拟订单数据生成
function generateMockOrders() {
    const products = [
        {
            name: '数字艺术品 #3721',
            desc: 'NFT收藏品 · 限量版',
            image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=100&h=100&fit=crop&crop=center',
            type: 'nft'
        },
        {
            name: '游戏道具包',
            desc: '游戏内物品 · 装备强化',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop&crop=center',
            type: 'game'
        },
        {
            name: '虚拟土地',
            desc: '元宇宙地产 · 黄金地段',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center',
            type: 'virtual'
        },
        {
            name: '音乐专辑 NFT',
            desc: '数字音乐 · 独家发行',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center',
            type: 'music'
        },
        {
            name: '收藏卡牌',
            desc: '数字卡牌 · 传奇级别',
            image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=100&h=100&fit=crop&crop=center',
            type: 'game'
        }
    ];

    const statuses = ['pending', 'paid', 'delivered', 'cancelled'];
    const paymentMethods = ['wallet', 'metamask', 'card'];
    
    allOrders = [];
    
    for (let i = 1; i <= 128; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const price = (Math.random() * 2 + 0.1).toFixed(1);
        const fiatPrice = (parseFloat(price) * 250).toFixed(2);
        
        // 生成随机日期（最近6个月）
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 180));
        
        allOrders.push({
            id: `ORD-2024-${String(i).padStart(3, '0')}`,
            product: product,
            status: status,
            quantity: quantity,
            amount: {
                value: `${price} SAP`,
                fiat: `≈ $${fiatPrice}`
            },
            paymentMethod: paymentMethod,
            time: date.toISOString().slice(0, 16).replace('T', ' ')
        });
    }
    
    filteredOrders = [...allOrders];
}

// 初始化筛选按钮
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的活动状态
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的活动状态
            this.classList.add('active');
            
            const filterType = this.dataset.status;
            currentFilter = filterType;
            currentPage = 1;
            
            applyFilters();
            renderOrders();
            updatePagination();
            
            // 显示筛选提示
            const filterNames = {
                'all': '全部',
                'pending': '待付款',
                'paid': '已付款',
                'delivered': '已交付',
                'cancelled': '已取消'
            };
            
            showToast(`已筛选${filterNames[filterType]}订单，共 ${filteredOrders.length} 条记录`);
        });
    });
}

// 初始化搜索和筛选功能
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const timeFilter = document.getElementById('timeFilter');
    
    // 搜索功能
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 500);
        });
        
        // 支持回车键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // 时间筛选
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            const days = this.value;
            filterByTime(days);
        });
    }
}

// 执行搜索
function performSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    applyFilters(term);
    renderOrders();
    updatePagination();
    
    if (term) {
        showToast(`搜索到 ${filteredOrders.length} 条相关记录`);
    }
}

// 按时间筛选
function filterByTime(days) {
    if (days === 'all') {
        applyFilters();
        renderOrders();
        updatePagination();
        return;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    applyFilters('', cutoffDate);
    renderOrders();
    updatePagination();
    
    showToast(`已筛选最近 ${days} 天的记录`);
}

// 应用筛选条件
function applyFilters(searchTerm = '', timeFilter = null) {
    filteredOrders = allOrders.filter(order => {
        // 状态筛选
        const statusMatch = currentFilter === 'all' || order.status === currentFilter;
        
        // 搜索筛选
        const searchMatch = !searchTerm || 
            order.id.toLowerCase().includes(searchTerm) ||
            order.product.name.toLowerCase().includes(searchTerm) ||
            order.product.desc.toLowerCase().includes(searchTerm);
        
        // 时间筛选
        let timeMatch = true;
        if (timeFilter) {
            const orderTime = new Date(order.time);
            timeMatch = orderTime >= timeFilter;
        }
        
        return statusMatch && searchMatch && timeMatch;
    });
    
    currentPage = 1;
}

// 渲染订单列表
function renderOrders() {
    const orderList = document.querySelector('.order-list');
    if (!orderList) return;
    
    // 计算分页
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageOrders = filteredOrders.slice(startIndex, endIndex);
    
    if (pageOrders.length === 0) {
        orderList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <p>暂无订单记录</p>
            </div>
        `;
        return;
    }
    
    orderList.innerHTML = pageOrders.map(order => createOrderHTML(order)).join('');
}

// 创建订单HTML
function createOrderHTML(order) {
    const statusInfo = getStatusInfo(order.status);
    const paymentIcon = getPaymentIcon(order.paymentMethod);
    
    return `
        <div class="order-item" data-order-id="${order.id}">
            <!-- 商品信息列 -->
            <div class="order-main-info">
                <img src="${order.product.image}" alt="${order.product.name}" class="order-product-image">
                <div class="order-details">
                    <div class="order-header">
                        <span class="order-id">${order.id}</span>
                        <span class="order-type-badge ${order.product.type}">
                            <i class="fas fa-${getTypeIcon(order.product.type)}"></i>
                            ${getTypeName(order.product.type)}
                        </span>
                    </div>
                    <div class="order-product-name">${order.product.name}</div>
                    <div class="order-product-desc">${order.product.desc}</div>
                </div>
            </div>
            
            <!-- 数量列 -->
            <div class="order-quantity-column">
                <span class="order-quantity">${order.quantity}</span>
            </div>
            
            <!-- 金额列 -->
            <div class="order-amount-column">
                <div class="order-amount">${order.amount.value}</div>
                <div class="order-amount-fiat">${order.amount.fiat}</div>
            </div>
            
            <!-- 支付方式列 -->
            <div class="order-payment-column">
                <div class="order-payment-method">
                    <i class="fab fa-${paymentIcon}"></i>
                    ${getPaymentName(order.paymentMethod)}
                </div>
            </div>
            
            <!-- 状态列 -->
            <div class="order-status-column">
                <span class="order-status-badge ${order.status}">
                    <i class="fas fa-${statusInfo.icon}"></i>
                    ${statusInfo.text}
                </span>
            </div>
            
            <!-- 时间列 -->
            <div class="order-time-column">
                <div class="order-time">${formatOrderTime(order.time)}</div>
            </div>
            
            <!-- 操作列 -->
            <div class="order-actions-column">
                ${getActionButtons(order)}
            </div>
        </div>
    `;
}

// 获取状态信息
function getStatusInfo(status) {
    const statusMap = {
        'pending': { text: '待付款', icon: 'clock' },
        'paid': { text: '已付款', icon: 'check-circle' },
        'delivered': { text: '已交付', icon: 'truck' },
        'cancelled': { text: '已取消', icon: 'times-circle' }
    };
    return statusMap[status] || { text: '未知', icon: 'question' };
}

// 获取类型图标
function getTypeIcon(type) {
    const iconMap = {
        'nft': 'gem',
        'game': 'gamepad',
        'virtual': 'cube',
        'music': 'music'
    };
    return iconMap[type] || 'tag';
}

// 获取类型名称
function getTypeName(type) {
    const nameMap = {
        'nft': 'NFT',
        'game': '游戏',
        'virtual': '虚拟',
        'music': '音乐'
    };
    return nameMap[type] || '其他';
}

// 获取支付图标
function getPaymentIcon(method) {
    const iconMap = {
        'wallet': 'wallet',
        'metamask': 'ethereum',
        'card': 'credit-card'
    };
    return iconMap[method] || 'wallet';
}

// 获取支付名称
function getPaymentName(method) {
    const nameMap = {
        'wallet': '钱包',
        'metamask': 'MetaMask',
        'card': '银行卡'
    };
    return nameMap[method] || '其他';
}

// 获取操作按钮
function getActionButtons(order) {
    switch (order.status) {
        case 'pending':
            return `
                <button class="order-action-btn pay-btn" onclick="payOrder('${order.id}')" title="立即支付">
                    <i class="fas fa-credit-card"></i>
                </button>
                <button class="order-action-btn cancel-btn" onclick="cancelOrder('${order.id}')" title="取消订单">
                    <i class="fas fa-times"></i>
                </button>
            `;
        case 'paid':
            return `
                <button class="order-action-btn" onclick="viewOrderDetail('${order.id}')" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        case 'delivered':
            return `
                <button class="order-action-btn" onclick="viewOrderDetail('${order.id}')" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="order-action-btn" onclick="rateOrder('${order.id}')" title="评价">
                    <i class="fas fa-star"></i>
                </button>
            `;
        case 'cancelled':
            return `
                <button class="order-action-btn" onclick="viewOrderDetail('${order.id}')" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        default:
            return `
                <button class="order-action-btn" onclick="viewOrderDetail('${order.id}')" title="查看详情">
                    <i class="fas fa-eye"></i>
                </button>
            `;
    }
}

// 初始化订单操作
function initOrderActions() {
    // 事件委托处理订单项点击
    document.addEventListener('click', function(e) {
        const orderItem = e.target.closest('.order-item');
        if (orderItem && !e.target.closest('.order-actions')) {
            // 添加点击反馈效果
            orderItem.style.transform = 'translateY(-2px) scale(1.01)';
            setTimeout(() => {
                orderItem.style.transform = 'translateY(-1px)';
            }, 150);
        }
    });
}

// 支付订单
function payOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('paymentModal');
    const modalBody = document.getElementById('paymentModalBody');
    
    modalBody.innerHTML = `
        <div class="payment-content">
            <div class="payment-order-info">
                <h4>订单信息</h4>
                <div class="payment-detail-item">
                    <span>订单号:</span>
                    <span>${order.id}</span>
                </div>
                <div class="payment-detail-item">
                    <span>商品:</span>
                    <span>${order.product.name}</span>
                </div>
                <div class="payment-detail-item">
                    <span>数量:</span>
                    <span>${order.quantity}</span>
            </div>
                <div class="payment-detail-item">
                    <span>金额:</span>
                    <span>${order.amount.value} ${order.amount.fiat}</span>
            </div>
            </div>
            
            <div class="payment-methods">
                <h4>选择支付方式</h4>
                <div class="payment-method-list">
                    <div class="payment-method-item active" data-method="wallet">
                        <i class="fas fa-wallet"></i>
                        <span>SAP钱包</span>
                        <div class="method-balance">余额: 15.6 SAP</div>
            </div>
                    <div class="payment-method-item" data-method="metamask">
                        <i class="fab fa-ethereum"></i>
                        <span>MetaMask</span>
                        <div class="method-balance">连接钱包</div>
                </div>
            </div>
            </div>
            
            <div class="payment-actions">
                <button class="admin-btn admin-btn-outline" onclick="closePaymentModal()">取消</button>
                <button class="admin-btn admin-btn-primary" onclick="processPayment('${orderId}')">
                    <i class="fas fa-credit-card"></i>
                    确认支付
                </button>
            </div>
        </div>
    `;
    
    openModal(modal);
}

// 处理支付
function processPayment(orderId) {
    showToast('正在处理支付...', 'info');
    
    // 模拟支付处理
    setTimeout(() => {
        const order = allOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'paid';
            renderOrders();
            updateStats();
            closePaymentModal();
            showToast('支付成功！', 'success');
        }
    }, 2000);
}

// 取消订单
function cancelOrder(orderId) {
    if (confirm('确定要取消这个订单吗？')) {
        const order = allOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
        renderOrders();
            updateStats();
            showToast('订单已取消', 'warning');
        }
    }
}

// 查看订单详情
function viewOrderDetail(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const modalBody = document.getElementById('orderModalBody');
    
    const statusInfo = getStatusInfo(order.status);
    
    modalBody.innerHTML = `
        <div class="order-detail-content">
            <div class="order-detail-header">
                <img src="${order.product.image}" alt="${order.product.name}" class="detail-product-image">
                <div class="detail-product-info">
                    <h4>${order.product.name}</h4>
                    <p>${order.product.desc}</p>
                    <span class="order-type-badge ${order.product.type}">
                        <i class="fas fa-${getTypeIcon(order.product.type)}"></i>
                        ${getTypeName(order.product.type)}
                        </span>
                </div>
            </div>

            <div class="order-detail-info">
                <div class="detail-item">
                    <span class="detail-label">订单号:</span>
                    <span class="detail-value">${order.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">状态:</span>
                    <span class="order-status-badge ${order.status}">
                        <i class="fas fa-${statusInfo.icon}"></i>
                        ${statusInfo.text}
                    </span>
                    </div>
                <div class="detail-item">
                    <span class="detail-label">数量:</span>
                    <span class="detail-value">${order.quantity}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">金额:</span>
                    <span class="detail-value">${order.amount.value} ${order.amount.fiat}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">支付方式:</span>
                    <span class="detail-value">
                        <i class="fab fa-${getPaymentIcon(order.paymentMethod)}"></i>
                        ${getPaymentName(order.paymentMethod)}
                    </span>
            </div>
                <div class="detail-item">
                    <span class="detail-label">下单时间:</span>
                    <span class="detail-value">${order.time}</span>
                </div>
            </div>

            <div class="order-detail-actions">
                ${getDetailActionButtons(order)}
            </div>
        </div>
    `;
    
    openModal(modal);
}

// 获取详情页操作按钮
function getDetailActionButtons(order) {
    switch (order.status) {
        case 'pending':
            return `
                <button class="admin-btn admin-btn-primary" onclick="payOrder('${order.id}')">
                    <i class="fas fa-credit-card"></i>
                    立即支付
                </button>
                <button class="admin-btn admin-btn-outline" onclick="cancelOrder('${order.id}')">
                    <i class="fas fa-times"></i>
                    取消订单
                </button>
            `;
        case 'delivered':
            return `
                <button class="admin-btn admin-btn-primary" onclick="rateOrder('${order.id}')">
                    <i class="fas fa-star"></i>
                    评价商品
                </button>
                <button class="admin-btn admin-btn-outline" onclick="reorderProduct('${order.id}')">
                    <i class="fas fa-redo"></i>
                    再次购买
                </button>
            `;
        default:
            return `
                <button class="admin-btn admin-btn-outline" onclick="closeOrderModal()">
                    <i class="fas fa-check"></i>
                    确定
                </button>
            `;
    }
}

// 评价订单
function rateOrder(orderId) {
    closeOrderModal();
    showToast('跳转到评价页面...', 'info');
}

// 再次购买
function reorderProduct(orderId) {
    closeOrderModal();
    showToast('商品已添加到购物车', 'success');
}

// 初始化模态框处理器
function initModalHandlers() {
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // 点击模态框背景关闭
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
}

// 初始化页面操作
function initPageActions() {
    // 导出按钮
    const exportBtn = document.querySelector('.orders-header-actions .admin-btn-outline');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportOrders);
    }
    
    // 刷新按钮
    const refreshBtn = document.querySelector('.orders-header-actions .admin-btn-primary');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshOrders);
    }
}

// 初始化分页处理器
function initPaginationHandlers() {
    // 分页数字按钮
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('pagination-page')) {
            const pages = document.querySelectorAll('.pagination-page');
            pages.forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            
            currentPage = parseInt(e.target.textContent);
            renderOrders();
            updatePagination();
        }
    });
    
    // 前一页/后一页按钮
    document.addEventListener('click', function(e) {
        if (e.target.closest('.pagination-btn')) {
            const btn = e.target.closest('.pagination-btn');
            if (btn.disabled) return;
            
            const isNext = btn.querySelector('.fa-chevron-right');
            const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
            
            if (isNext && currentPage < totalPages) {
                currentPage++;
            } else if (!isNext && currentPage > 1) {
                currentPage--;
            }
            
            renderOrders();
            updatePagination();
        }
    });
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginationPages = document.querySelector('.pagination-pages');
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    if (!paginationPages) return;
    
    // 更新页码按钮
    let pagesHTML = '';
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        pagesHTML += `
            <button class="pagination-page ${i === currentPage ? 'active' : ''}">${i}</button>
        `;
    }
    
    paginationPages.innerHTML = pagesHTML;
    
    // 更新前后按钮状态
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
        prevBtn.style.opacity = currentPage <= 1 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.style.opacity = currentPage >= totalPages ? '0.5' : '1';
    }
}

// 更新统计数据
function updateStats() {
    const totalOrders = allOrders.length;
    const deliveredOrders = allOrders.filter(o => o.status === 'delivered').length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'paid').length;
    const totalAmount = allOrders.reduce((sum, order) => {
        const amount = parseFloat(order.amount.value.replace(' SAP', ''));
        return sum + amount;
    }, 0);
    
    // 更新统计卡片
    const statValues = document.querySelectorAll('.orders-stat-card .stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = totalOrders;
        statValues[1].textContent = deliveredOrders;
        statValues[2].textContent = pendingOrders;
        statValues[3].textContent = `${totalAmount.toFixed(1)} SAP`;
    }
}

// 导出订单
function exportOrders() {
    showToast('正在准备导出数据...', 'info');
    
    setTimeout(() => {
        showToast('订单数据导出功能正在开发中', 'warning');
    }, 1000);
}

// 刷新订单
function refreshOrders() {
    showToast('正在刷新订单数据...', 'info');
    
    setTimeout(() => {
        generateMockOrders();
        applyFilters();
        renderOrders();
        updateStats();
        updatePagination();
        showToast('订单数据已更新', 'success');
    }, 1500);
}

// 打开模态框
function openModal(modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal(modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// 关闭订单模态框
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    closeModal(modal);
}

// 关闭支付模态框
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    closeModal(modal);
}

// 显示提示消息 - 复用公共样式
function showToast(message, type = 'info') {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${getToastTitle(type)}</span>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 自动移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 获取提示图标
function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// 获取提示标题
function getToastTitle(type) {
    const titles = {
        'success': '成功',
        'error': '错误',
        'warning': '警告',
        'info': '提示'
    };
    return titles[type] || '提示';
}

// 格式化订单时间显示
function formatOrderTime(timeString) {
    const date = new Date(timeString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        // 今天 - 显示时间
        return date.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    } else if (diffDays === 1) {
        // 昨天
        return '昨天';
    } else if (diffDays < 7) {
        // 一周内 - 显示天数
        return `${diffDays}天前`;
    } else {
        // 超过一周 - 显示日期
        return date.toLocaleDateString('zh-CN', { 
            month: '2-digit', 
            day: '2-digit'
        });
    }
}
   