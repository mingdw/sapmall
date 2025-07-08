/**
 * 商家订单管理系统
 * 基于Sapphire Mall区块链电商平台
 * 简化版本，专注核心功能
 */

class MerchantOrdersManager {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.totalPages = 0;
        this.totalItems = 0;
        this.selectedOrders = new Set();
        this.currentFilters = {
            status: 'all',
            payment: '',
            time: '',
            search: ''
        };
        this.currentPeriod = 'today';
        
        // 模拟数据
        this.mockOrders = this.generateMockOrders();
        this.filteredOrders = [...this.mockOrders];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadStatistics();
        this.loadOrders();
        this.updateUI();
        
        // 隐藏加载指示器，显示主内容
        setTimeout(() => {
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            this.reportHeight();
        }, 1500);
    }
    
    bindEvents() {
        // 时间筛选器
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.loadStatistics();
            });
        });
        
        // 状态筛选器
        document.querySelectorAll('[data-status]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-status]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilters.status = e.target.dataset.status;
                this.applyFilters();
            });
        });
        
        // 搜索
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.debounceSearch();
            });
        }
        
        // 筛选器
        ['paymentFilter', 'timeFilter'].forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.addEventListener('change', (e) => {
                    const filterType = id.replace('Filter', '');
                    this.currentFilters[filterType] = e.target.value;
                    this.applyFilters();
                });
            }
        });
        
        // 页面大小选择器
        const pageSize = document.getElementById('pageSize');
        if (pageSize) {
            pageSize.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        // 全选复选框
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }
    }
    
    generateMockOrders() {
        const orders = [];
        const statuses = ['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'completed', 'cancelled'];
        const payments = ['sap', 'eth', 'usdt'];
        const products = [
            { name: 'NFT艺术作品 #001', type: 'NFT', price: 15.5 },
            { name: '在线设计课程', type: '教育', price: 89.9 },
            { name: '游戏道具包', type: '游戏', price: 25.0 },
            { name: '数字音乐专辑', type: '音乐', price: 12.8 },
            { name: '软件授权许可', type: '软件', price: 199.0 },
            { name: '虚拟会议门票', type: '票务', price: 50.0 }
        ];
        const customers = [
            { name: '张小明', address: '北京市朝阳区' },
            { name: 'John Smith', address: '美国纽约州' },
            { name: '李小红', address: '上海市浦东新区' },
            { name: 'Alice Johnson', address: '英国伦敦' },
            { name: '王大华', address: '广州市天河区' },
            { name: 'Bob Brown', address: '加拿大多伦多' }
        ];
        
        for (let i = 1; i <= 156; i++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const payment = payments[Math.floor(Math.random() * payments.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const totalAmount = product.price * quantity;
            
            // 生成最近30天内的随机时间
            const daysAgo = Math.floor(Math.random() * 30);
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - daysAgo);
            
            orders.push({
                id: `ORD${String(i).padStart(6, '0')}`,
                orderNumber: `SM${Date.now()}${i}`,
                product: product,
                customer: customer,
                quantity: quantity,
                totalAmount: totalAmount,
                paymentMethod: payment,
                status: status,
                createdAt: orderDate,
                updatedAt: orderDate
            });
        }
        
        return orders.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    loadStatistics() {
        const stats = this.calculateStatistics();
        
        // 更新统计数据
        document.getElementById('totalOrders').textContent = stats.totalOrders;
        document.getElementById('totalRevenue').textContent = `${stats.totalRevenue} SAP`;
        document.getElementById('pendingOrders').textContent = stats.pendingOrders;
        document.getElementById('avgRating').textContent = stats.avgRating.toFixed(1);
        
        // 更新趋势数据
        document.getElementById('ordersTrend').textContent = `+${stats.ordersTrend} 较昨日`;
        document.getElementById('revenueTrend').textContent = `+${stats.revenueTrend} SAP`;
        document.getElementById('pendingTrend').textContent = stats.pendingOrders > 0 ? '需处理' : '无待处理';
        document.getElementById('ratingTrend').textContent = `+${stats.ratingTrend.toFixed(1)}`;
        
        // 更新快速操作计数
        document.getElementById('pendingCount').textContent = `${stats.pendingOrders} 个待处理`;
        document.getElementById('shippableCount').textContent = `${stats.shippableOrders} 个可发货`;
        document.getElementById('refundCount').textContent = `${stats.refundRequests} 个申请`;
    }
    
    calculateStatistics() {
        const now = new Date();
        let startDate;
        
        // 根据选择的时间段计算开始日期
        switch (this.currentPeriod) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        
        const periodOrders = this.mockOrders.filter(order => order.createdAt >= startDate);
        const totalOrders = periodOrders.length;
        const totalRevenue = periodOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = this.mockOrders.filter(order => order.status === 'pending').length;
        const shippableOrders = this.mockOrders.filter(order => order.status === 'paid').length;
        const refundRequests = this.mockOrders.filter(order => order.status === 'cancelled').length;
        
        // 模拟趋势数据
        const ordersTrend = Math.floor(totalOrders * 0.1);
        const revenueTrend = (totalRevenue * 0.15).toFixed(1);
        const ratingTrend = 0.2;
        
        return {
            totalOrders,
            totalRevenue: totalRevenue.toFixed(1),
            pendingOrders,
            shippableOrders,
            refundRequests,
            avgRating: 4.6,
            ordersTrend,
            revenueTrend,
            ratingTrend
        };
    }
    
    applyFilters() {
        let filtered = [...this.mockOrders];
        
        // 状态筛选
        if (this.currentFilters.status !== 'all') {
            filtered = filtered.filter(order => order.status === this.currentFilters.status);
        }
        
        // 支付方式筛选
        if (this.currentFilters.payment) {
            filtered = filtered.filter(order => order.paymentMethod === this.currentFilters.payment);
        }
        
        // 时间范围筛选
        if (this.currentFilters.time) {
            const now = new Date();
            let startDate;
            
            switch (this.currentFilters.time) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'yesterday':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    filtered = filtered.filter(order => order.createdAt >= startDate && order.createdAt < endDate);
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    filtered = filtered.filter(order => order.createdAt >= startDate);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    filtered = filtered.filter(order => order.createdAt >= startDate);
                    break;
                case 'quarter':
                    startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                    filtered = filtered.filter(order => order.createdAt >= startDate);
                    break;
            }
            
            if (this.currentFilters.time !== 'yesterday' && startDate) {
                filtered = filtered.filter(order => order.createdAt >= startDate);
            }
        }
        
        // 搜索筛选
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(order => 
                order.orderNumber.toLowerCase().includes(searchTerm) ||
                order.customer.name.toLowerCase().includes(searchTerm) ||
                order.product.name.toLowerCase().includes(searchTerm)
            );
        }
        
        this.filteredOrders = filtered;
        this.totalItems = filtered.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.currentPage = 1;
        
        this.loadOrders();
        this.updatePagination();
        this.clearSelection();
    }
    
    loadOrders() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
        const pageOrders = this.filteredOrders.slice(startIndex, endIndex);
        
        this.renderTableView(pageOrders);
        this.updatePaginationInfo(startIndex + 1, endIndex);
        this.showEmptyState(pageOrders.length === 0);
    }
    
    renderTableView(orders) {
        const container = document.getElementById('orderList');
        if (!container) return;
        
        if (orders.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = orders.map(order => `
            <div class="order-item ${this.selectedOrders.has(order.id) ? 'selected' : ''}" data-order-id="${order.id}">
                <div class="order-checkbox">
                    <input type="checkbox" ${this.selectedOrders.has(order.id) ? 'checked' : ''} 
                           onchange="MerchantOrders.toggleOrderSelection('${order.id}', this.checked)">
                </div>
                <div class="order-product">
                    <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop&crop=center" 
                         alt="${order.product.name}" class="order-product-image">
                    <div class="order-product-info">
                        <div class="order-product-name">${order.product.name}</div>
                        <div class="order-product-type">${order.product.type}</div>
                    </div>
                </div>
                <div class="order-customer">
                    <div class="order-customer-name">${order.customer.name}</div>
                    <div class="order-customer-address">${order.customer.address}</div>
                </div>
                <div class="order-quantity">${order.quantity}</div>
                <div class="order-amount">${order.totalAmount.toFixed(2)} SAP</div>
                <div class="order-payment">${this.getPaymentMethodName(order.paymentMethod)}</div>
                <div class="order-status">
                    <span class="status-badge status-${order.status}">${this.getStatusName(order.status)}</span>
                </div>
                <div class="order-time">${this.formatDate(order.createdAt)}</div>
                <div class="order-actions">
                    <button class="order-action-btn view" onclick="MerchantOrders.showOrderDetail('${order.id}')" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${order.status === 'paid' ? `
                        <button class="order-action-btn ship" onclick="MerchantOrders.showShipOrder('${order.id}')" title="发货">
                            <i class="fas fa-truck"></i>
                        </button>
                    ` : ''}
                    <button class="order-action-btn edit" onclick="MerchantOrders.editOrder('${order.id}')" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updatePagination() {
        const pageNumbers = document.getElementById('pageNumbers');
        if (!pageNumbers) return;
        
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        let paginationHTML = '';
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-page ${i === this.currentPage ? 'active' : ''}" 
                        onclick="MerchantOrders.goToPage(${i})">${i}</button>
            `;
        }
        
        pageNumbers.innerHTML = paginationHTML;
        
        // 更新导航按钮状态
        const firstPage = document.getElementById('firstPage');
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        const lastPage = document.getElementById('lastPage');
        
        if (firstPage) firstPage.disabled = this.currentPage === 1;
        if (prevPage) prevPage.disabled = this.currentPage === 1;
        if (nextPage) nextPage.disabled = this.currentPage === this.totalPages;
        if (lastPage) lastPage.disabled = this.currentPage === this.totalPages;
    }
    
    updatePaginationInfo(startIndex, endIndex) {
        const startIndexEl = document.getElementById('startIndex');
        const endIndexEl = document.getElementById('endIndex');
        const totalItemsEl = document.getElementById('totalItems');
        
        if (startIndexEl) startIndexEl.textContent = startIndex;
        if (endIndexEl) endIndexEl.textContent = endIndex;
        if (totalItemsEl) totalItemsEl.textContent = this.totalItems;
    }
    
    showEmptyState(show) {
        const emptyState = document.getElementById('emptyState');
        const orderPagination = document.getElementById('orderPagination');
        
        if (emptyState) {
            emptyState.style.display = show ? 'flex' : 'none';
        }
        if (orderPagination) {
            orderPagination.style.display = show ? 'none' : 'flex';
        }
    }
    
    toggleOrderSelection(orderId, checked) {
        if (checked === undefined) {
            checked = !this.selectedOrders.has(orderId);
            
            // 更新复选框状态
            const checkbox = document.querySelector(`[data-order-id="${orderId}"] input[type="checkbox"]`);
            if (checkbox) checkbox.checked = checked;
        }
        
        if (checked) {
            this.selectedOrders.add(orderId);
        } else {
            this.selectedOrders.delete(orderId);
        }
        
        // 更新订单项样式
        const orderElement = document.querySelector(`[data-order-id="${orderId}"]`);
        if (orderElement) {
            orderElement.classList.toggle('selected', checked);
        }
        
        this.updateSelectionUI();
    }
    
    toggleSelectAll(checked) {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
        const pageOrders = this.filteredOrders.slice(startIndex, endIndex);
        
        pageOrders.forEach(order => {
            const checkbox = document.querySelector(`[data-order-id="${order.id}"] input[type="checkbox"]`);
            if (checkbox) {
                checkbox.checked = checked;
                this.toggleOrderSelection(order.id, checked);
            }
        });
    }
    
    updateSelectionUI() {
        const selectedCount = this.selectedOrders.size;
        const batchActions = document.getElementById('batchActions');
        const selectedCountEl = document.getElementById('selectedCount');
        
        if (batchActions) {
            batchActions.style.display = selectedCount > 0 ? 'flex' : 'none';
        }
        if (selectedCountEl) {
            selectedCountEl.textContent = selectedCount;
        }
        
        // 更新全选复选框状态
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = Math.min(startIndex + this.pageSize, this.totalItems);
            const pageOrders = this.filteredOrders.slice(startIndex, endIndex);
            const selectedInPage = pageOrders.filter(order => this.selectedOrders.has(order.id)).length;
            
            selectAll.checked = selectedInPage === pageOrders.length && pageOrders.length > 0;
            selectAll.indeterminate = selectedInPage > 0 && selectedInPage < pageOrders.length;
        }
    }
    
    clearSelection() {
        this.selectedOrders.clear();
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('.order-item').forEach(el => el.classList.remove('selected'));
        this.updateSelectionUI();
    }
    
    // 分页导航
    goToPage(page) {
        if (page === 'prev') {
            this.currentPage = Math.max(1, this.currentPage - 1);
        } else if (page === 'next') {
            this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
        } else if (page === 'last') {
            this.currentPage = this.totalPages;
        } else {
            this.currentPage = Math.max(1, Math.min(this.totalPages, parseInt(page)));
        }
        
        this.loadOrders();
        this.updatePagination();
        this.clearSelection();
    }
    
    changePageSize() {
        const pageSize = document.getElementById('pageSize');
        if (pageSize) {
            this.pageSize = parseInt(pageSize.value);
            this.currentPage = 1;
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            this.loadOrders();
            this.updatePagination();
            this.clearSelection();
        }
    }
    
    // 搜索防抖
    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }
    
    // 业务操作方法
    showPendingOrders() {
        this.currentFilters.status = 'pending';
        document.querySelectorAll('[data-status]').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-status="pending"]').classList.add('active');
        this.applyFilters();
    }
    
    showShippableOrders() {
        this.currentFilters.status = 'paid';
        document.querySelectorAll('[data-status]').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-status="paid"]').classList.add('active');
        this.applyFilters();
    }
    
    showRefundRequests() {
        this.currentFilters.status = 'cancelled';
        document.querySelectorAll('[data-status]').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-status="cancelled"]').classList.add('active');
        this.applyFilters();
    }
    
    showOrderDetail(orderId) {
        const order = this.mockOrders.find(o => o.id === orderId);
        if (!order) return;
        
        const modal = document.getElementById('orderModal');
        const modalBody = document.getElementById('orderModalBody');
        
        modalBody.innerHTML = `
            <div class="order-detail-content">
                <div class="order-detail-section">
                    <h4>基本信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>订单编号</label>
                            <span>${order.orderNumber}</span>
                        </div>
                        <div class="detail-item">
                            <label>订单状态</label>
                            <span class="status-badge status-${order.status}">${this.getStatusName(order.status)}</span>
                        </div>
                        <div class="detail-item">
                            <label>下单时间</label>
                            <span>${this.formatDateTime(order.createdAt)}</span>
                        </div>
                        <div class="detail-item">
                            <label>支付方式</label>
                            <span>${this.getPaymentMethodName(order.paymentMethod)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="order-detail-section">
                    <h4>商品信息</h4>
                    <div class="product-detail">
                        <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center" 
                             alt="${order.product.name}" class="product-detail-image">
                        <div class="product-detail-info">
                            <div class="product-detail-name">${order.product.name}</div>
                            <div class="product-detail-type">${order.product.type}</div>
                            <div class="product-detail-price">${order.product.price} SAP × ${order.quantity}</div>
                        </div>
                    </div>
                </div>
                
                <div class="order-detail-section">
                    <h4>客户信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>客户姓名</label>
                            <span>${order.customer.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>收货地址</label>
                            <span>${order.customer.address}</span>
                        </div>
                    </div>
                </div>
                
                <div class="order-detail-section">
                    <h4>金额详情</h4>
                    <div class="amount-summary">
                        <div class="amount-line">
                            <span>商品总额</span>
                            <span>${order.totalAmount.toFixed(2)} SAP</span>
                        </div>
                        <div class="amount-line final">
                            <span>实付金额</span>
                            <span>${order.totalAmount.toFixed(2)} SAP</span>
                        </div>
                    </div>
                </div>
                
                <div class="order-actions-footer">
                    ${order.status === 'pending' ? `
                        <button class="admin-btn admin-btn-primary" onclick="MerchantOrders.confirmOrder('${order.id}')">
                            <i class="fas fa-check"></i> 确认订单
                        </button>
                    ` : ''}
                    ${order.status === 'paid' ? `
                        <button class="admin-btn admin-btn-primary" onclick="MerchantOrders.showShipOrder('${order.id}')">
                            <i class="fas fa-truck"></i> 立即发货
                        </button>
                    ` : ''}
                    <button class="admin-btn admin-btn-outline" onclick="MerchantOrders.hideOrderDetail()">
                        关闭
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }
    
    hideOrderDetail() {
        const modal = document.getElementById('orderModal');
        modal.classList.remove('active');
    }
    
    showShipOrder(orderId) {
        console.log('显示发货界面:', orderId);
        // 这里可以实现发货功能
    }
    
    batchConfirm() {
        if (this.selectedOrders.size === 0) return;
        
        console.log('批量确认订单:', Array.from(this.selectedOrders));
        // 这里可以实现批量确认功能
        this.clearSelection();
    }
    
    batchShip() {
        if (this.selectedOrders.size === 0) return;
        
        const modal = document.getElementById('batchShipModal');
        const modalBody = document.getElementById('batchShipModalBody');
        
        modalBody.innerHTML = `
            <div class="batch-ship-content">
                <p>选中了 ${this.selectedOrders.size} 个订单准备发货</p>
                <div class="selected-orders-preview">
                    ${Array.from(this.selectedOrders).slice(0, 5).map(orderId => {
                        const order = this.mockOrders.find(o => o.id === orderId);
                        return order ? `
                            <div class="selected-order-item">
                                <span>${order.orderNumber}</span>
                                <span>${order.customer.name}</span>
                                <span>${order.totalAmount.toFixed(2)} SAP</span>
                            </div>
                        ` : '';
                    }).join('')}
                    ${this.selectedOrders.size > 5 ? `<div class="more-orders">还有 ${this.selectedOrders.size - 5} 个订单...</div>` : ''}
                </div>
                <div class="batch-actions-footer">
                    <button class="admin-btn admin-btn-primary" onclick="MerchantOrders.confirmBatchShip()">
                        <i class="fas fa-truck"></i> 确认批量发货
                    </button>
                    <button class="admin-btn admin-btn-outline" onclick="MerchantOrders.hideBatchShipModal()">
                        取消
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }
    
    hideBatchShipModal() {
        const modal = document.getElementById('batchShipModal');
        modal.classList.remove('active');
    }
    
    confirmBatchShip() {
        console.log('确认批量发货:', Array.from(this.selectedOrders));
        this.hideBatchShipModal();
        this.clearSelection();
    }
    
    showAnalytics() {
        const modal = document.getElementById('analyticsModal');
        const modalBody = document.getElementById('analyticsModalBody');
        
        modalBody.innerHTML = `
            <div class="analytics-content">
                <div class="analytics-placeholder">
                    <i class="fas fa-chart-line" style="font-size: 48px; color: #3b82f6; margin-bottom: 16px;"></i>
                    <h3>销售数据分析</h3>
                    <p>销售分析功能正在开发中，敬请期待...</p>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }
    
    hideAnalyticsModal() {
        const modal = document.getElementById('analyticsModal');
        modal.classList.remove('active');
    }
    
    confirmOrder(orderId) {
        const order = this.mockOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'confirmed';
            this.loadOrders();
            this.loadStatistics();
            this.hideOrderDetail();
        }
    }
    
    editOrder(orderId) {
        console.log('编辑订单:', orderId);
        // 这里可以实现编辑订单功能
    }
    
    exportData() {
        console.log('导出数据');
        // 这里可以实现数据导出功能
    }
    
    refreshData() {
        this.loadStatistics();
        this.loadOrders();
    }
    
    updateUI() {
        this.updateSelectionUI();
        this.reportHeight();
    }
    
    reportHeight() {
        if (window.reportHeight) {
            // 添加一些延迟确保内容完全渲染
            setTimeout(() => {
                window.reportHeight();
            }, 100);
        }
    }
    
    // 工具方法
    getStatusName(status) {
        const statusMap = {
            pending: '待确认',
            confirmed: '已确认',
            paid: '已付款',
            shipped: '已发货',
            delivered: '已交付',
            completed: '已完成',
            cancelled: '已取消'
        };
        return statusMap[status] || status;
    }
    
    getPaymentMethodName(method) {
        const methodMap = {
            sap: 'SAP代币',
            eth: '以太坊',
            usdt: 'USDT'
        };
        return methodMap[method] || method;
    }
    
    formatDate(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    }
    
    formatDateTime(date) {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}

// 初始化系统
let MerchantOrders;

document.addEventListener('DOMContentLoaded', function() {
    MerchantOrders = new MerchantOrdersManager();
});

// 全局访问接口（用于HTML事件处理）
window.MerchantOrders = {
    showPendingOrders: () => MerchantOrders?.showPendingOrders(),
    showShippableOrders: () => MerchantOrders?.showShippableOrders(),
    showRefundRequests: () => MerchantOrders?.showRefundRequests(),
    showAnalytics: () => MerchantOrders?.showAnalytics(),
    hideAnalyticsModal: () => MerchantOrders?.hideAnalyticsModal(),
    showOrderDetail: (id) => MerchantOrders?.showOrderDetail(id),
    hideOrderDetail: () => MerchantOrders?.hideOrderDetail(),
    showShipOrder: (id) => MerchantOrders?.showShipOrder(id),
    toggleOrderSelection: (id, checked) => MerchantOrders?.toggleOrderSelection(id, checked),
    toggleSelectAll: (checked) => MerchantOrders?.toggleSelectAll(checked),
    clearSelection: () => MerchantOrders?.clearSelection(),
    goToPage: (page) => MerchantOrders?.goToPage(page),
    changePageSize: () => MerchantOrders?.changePageSize(),
    batchConfirm: () => MerchantOrders?.batchConfirm(),
    batchShip: () => MerchantOrders?.batchShip(),
    hideBatchShipModal: () => MerchantOrders?.hideBatchShipModal(),
    confirmBatchShip: () => MerchantOrders?.confirmBatchShip(),
    confirmOrder: (id) => MerchantOrders?.confirmOrder(id),
    editOrder: (id) => MerchantOrders?.editOrder(id),
    exportData: () => MerchantOrders?.exportData(),
    refreshData: () => MerchantOrders?.refreshData()
}; 