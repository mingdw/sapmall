/* 快速操作功能JavaScript */

// 快速操作功能管理
const QuickActions = {
    
    // 库存预警功能
    showStockWarning: function() {
        // 获取低库存商品
        const lowStockProducts = ProductManagementPage.data.products.filter(p => 
            p.stock <= p.lowStockThreshold && p.status === 'active'
        );
        const outStockProducts = ProductManagementPage.data.products.filter(p => p.stock === 0 && p.status === 'active');
        // 结构优化：卡片式统计+分区+表格
        const modalHtml = `
            <div class="modal-overlay" id="stockWarningModal">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3><i class="fas fa-exclamation-triangle" style="color: #fbbf24;"></i>库存预警管理</h3>
                        <button class="modal-close" onclick="QuickActions.hideStockWarning()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="warning-summary">
                            <div class="warning-card">
                                <div class="warning-icon" style="background: linear-gradient(135deg, #fbbf24, #f59e0b);"><i class="fas fa-exclamation-triangle"></i></div>
                                <div class="warning-info">
                                    <div class="warning-title">低库存商品</div>
                                    <div class="warning-count">${lowStockProducts.length} 个</div>
                                </div>
                            </div>
                            <div class="warning-card">
                                <div class="warning-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);"><i class="fas fa-times-circle"></i></div>
                                <div class="warning-info">
                                    <div class="warning-title">缺货商品</div>
                                    <div class="warning-count">${outStockProducts.length} 个</div>
                                </div>
                            </div>
                        </div>
                        <div class="warning-actions">
                            <button class="btn btn-primary" onclick="QuickActions.batchRestock()"><i class="fas fa-plus"></i> 批量补货</button>
                            <button class="btn btn-outline" onclick="QuickActions.exportStockReport()"><i class="fas fa-download"></i> 导出库存报告</button>
                        </div>
                        <div class="warning-table">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>商品图片</th>
                                        <th>商品名称</th>
                                        <th>当前库存</th>
                                        <th>预警阈值</th>
                                        <th>状态</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lowStockProducts.map(product => `
                                        <tr>
                                            <td><img src="${product.image}" alt="${product.name}" class="product-thumb"></td>
                                            <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${product.name}</td>
                                            <td><span class="stock-count ${product.stock === 0 ? 'out-of-stock' : 'low-stock'}">${product.stock}</span></td>
                                            <td>${product.lowStockThreshold}</td>
                                            <td><span class="status-badge ${product.stock === 0 ? 'status-danger' : 'status-warning'}">${product.stock === 0 ? '缺货' : '低库存'}</span></td>
                                            <td><button class="btn btn-sm btn-primary" onclick="QuickActions.quickRestock(${product.id})">快速补货</button></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        setTimeout(() => {
            const modal = document.getElementById('stockWarningModal');
            modal.classList.add('show');
        }, 100);
    },

    // 隐藏库存预警模态框
    hideStockWarning: function() {
        const modal = document.getElementById('stockWarningModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },

    // 快速补货
    quickRestock: function(productId) {
        const product = ProductManagementPage.data.products.find(p => p.id === productId);
        if (!product) return;
        
        const newStock = prompt(`请输入 ${product.name} 的补货数量:`, '10');
        if (newStock && !isNaN(newStock)) {
            product.stock = parseInt(newStock);
            ProductManagementPage.showToast(`已为 ${product.name} 补货 ${newStock} 件`, 'success');
            this.hideStockWarning();
            this.showStockWarning(); // 刷新预警页面
        }
    },

    // 批量补货
    batchRestock: function() {
        ProductManagementPage.showToast('批量补货功能正在开发中', 'info');
    },

    // 导出库存报告
    exportStockReport: function() {
        const lowStockProducts = ProductManagementPage.data.products.filter(p => 
            p.stock <= p.lowStockThreshold && p.status === 'active'
        );
        
        const csvContent = ProductManagementPage.convertToCSV(lowStockProducts);
        ProductManagementPage.downloadCSV(csvContent, `库存预警报告_${new Date().toISOString().split('T')[0]}.csv`);
        
        ProductManagementPage.showToast(`已导出库存预警报告，包含 ${lowStockProducts.length} 个商品`, 'success');
    },

    // 待办事项功能
    showTodoList: function() {
        // 获取待办事项
        const pendingProducts = ProductManagementPage.data.products.filter(p => p.status === 'pending');
        const syncFailedProducts = ProductManagementPage.data.products.filter(p => p.chainStatus === '同步失败');
        const draftProducts = ProductManagementPage.data.products.filter(p => p.status === 'draft');
        
        const modalHtml = `
            <div class="modal-overlay" id="todoModal">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-clipboard-list" style="color: #3b82f6;"></i>
                            待办事项管理
                        </h3>
                        <button class="modal-close" onclick="QuickActions.hideTodoList()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="todo-summary">
                            <div class="todo-card">
                                <div class="todo-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="todo-info">
                                    <div class="todo-title">待审核商品</div>
                                    <div class="todo-count">${pendingProducts.length} 个</div>
                                </div>
                            </div>
                            <div class="todo-card">
                                <div class="todo-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                    <i class="fas fa-exclamation-circle"></i>
                                </div>
                                <div class="todo-info">
                                    <div class="todo-title">同步失败</div>
                                    <div class="todo-count">${syncFailedProducts.length} 个</div>
                                </div>
                            </div>
                            <div class="todo-card">
                                <div class="todo-icon" style="background: linear-gradient(135deg, #6b7280, #4b5563);">
                                    <i class="fas fa-edit"></i>
                                </div>
                                <div class="todo-info">
                                    <div class="todo-title">草稿商品</div>
                                    <div class="todo-count">${draftProducts.length} 个</div>
                                </div>
                            </div>
                        </div>

                        <div class="todo-tabs">
                            <div class="tab-nav">
                                <button class="tab-btn active" data-tab="pending">待审核 (${pendingProducts.length})</button>
                                <button class="tab-btn" data-tab="sync-failed">同步失败 (${syncFailedProducts.length})</button>
                                <button class="tab-btn" data-tab="draft">草稿 (${draftProducts.length})</button>
                            </div>
                            
                            <div class="tab-content active" id="pendingTab">
                                <div class="todo-list">
                                    ${pendingProducts.map(product => `
                                        <div class="todo-item">
                                            <div class="todo-item-info">
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <div class="todo-item-details">
                                                    <div class="todo-item-title">${product.name}</div>
                                                    <div class="todo-item-meta">创建时间: ${ProductManagementPage.formatDate(product.createdAt)}</div>
                                                </div>
                                            </div>
                                            <div class="todo-item-actions">
                                                <button class="btn btn-sm btn-success" onclick="QuickActions.approveProduct(${product.id})">
                                                    审核通过
                                                </button>
                                                <button class="btn btn-sm btn-danger" onclick="QuickActions.rejectProduct(${product.id})">
                                                    拒绝
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="tab-content" id="syncFailedTab">
                                <div class="todo-list">
                                    ${syncFailedProducts.map(product => `
                                        <div class="todo-item">
                                            <div class="todo-item-info">
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <div class="todo-item-details">
                                                    <div class="todo-item-title">${product.name}</div>
                                                    <div class="todo-item-meta">错误: ${product.chainError}</div>
                                                </div>
                                            </div>
                                            <div class="todo-item-actions">
                                                <button class="btn btn-sm btn-primary" onclick="QuickActions.retrySync(${product.id})">
                                                    重试同步
                                                </button>
                                                <button class="btn btn-sm btn-outline" onclick="QuickActions.viewSyncDetails(${product.id})">
                                                    查看详情
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="tab-content" id="draftTab">
                                <div class="todo-list">
                                    ${draftProducts.map(product => `
                                        <div class="todo-item">
                                            <div class="todo-item-info">
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <div class="todo-item-details">
                                                    <div class="todo-item-title">${product.name}</div>
                                                    <div class="todo-item-meta">创建时间: ${ProductManagementPage.formatDate(product.createdAt)}</div>
                                                </div>
                                            </div>
                                            <div class="todo-item-actions">
                                                <button class="btn btn-sm btn-primary" onclick="ProductManagementPage.editProduct(${product.id})">
                                                    继续编辑
                                                </button>
                                                <button class="btn btn-sm btn-success" onclick="QuickActions.publishDraft(${product.id})">
                                                    发布
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // 添加标签切换功能
        setTimeout(() => {
            const modal = document.getElementById('todoModal');
            modal.classList.add('show');
            
            // 绑定标签切换事件
            const tabBtns = modal.querySelectorAll('.tab-btn');
            const tabContents = modal.querySelectorAll('.tab-content');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabName = btn.dataset.tab;
                    
                    // 更新按钮状态
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // 更新内容显示
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === tabName + 'Tab') {
                            content.classList.add('active');
                        }
                    });
                });
            });
        }, 100);
    },

    // 隐藏待办事项模态框
    hideTodoList: function() {
        const modal = document.getElementById('todoModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },

    // 审核通过商品
    approveProduct: function(productId) {
        const product = ProductManagementPage.data.products.find(p => p.id === productId);
        if (product) {
            product.status = 'active';
            ProductManagementPage.showToast(`已审核通过: ${product.name}`, 'success');
            this.hideTodoList();
            this.showTodoList();
        }
    },

    // 拒绝商品
    rejectProduct: function(productId) {
        const product = ProductManagementPage.data.products.find(p => p.id === productId);
        if (product) {
            product.status = 'inactive';
            ProductManagementPage.showToast(`已拒绝: ${product.name}`, 'warning');
            this.hideTodoList();
            this.showTodoList();
        }
    },

    // 重试同步
    retrySync: function(productId) {
        const product = ProductManagementPage.data.products.find(p => p.id === productId);
        if (product) {
            product.chainStatus = '同步中';
            ProductManagementPage.showToast(`正在重试同步: ${product.name}`, 'info');
            // 模拟同步过程
            setTimeout(() => {
                product.chainStatus = '已上链';
                product.chainError = '';
                ProductManagementPage.showToast(`同步成功: ${product.name}`, 'success');
                this.hideTodoList();
                this.showTodoList();
            }, 2000);
        }
    },

    // 查看同步详情
    viewSyncDetails: function(productId) {
        const product = ProductManagementPage.data.products.find(p => p.id === productId);
        if (product) {
            alert(`同步详情:\n商品: ${product.name}\n错误信息: ${product.chainError}\n合约地址: ${product.contractAddress}\nTokenID: ${product.tokenId}`);
        }
    },

    // 发布草稿
    publishDraft: function(productId) {
        const product = ProductManagementPage.data.products.find(p => p.id === productId);
        if (product) {
            product.status = 'pending';
            ProductManagementPage.showToast(`已提交审核: ${product.name}`, 'success');
            this.hideTodoList();
            this.showTodoList();
        }
    },

    // 创建优惠活动功能
    showPromotionCreator: function() {
        const modalHtml = `
            <div class="modal-overlay" id="promotionModal">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-percent" style="color: #ec4899;"></i>
                            创建优惠活动
                        </h3>
                        <button class="modal-close" onclick="QuickActions.hidePromotionCreator()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="promotion-types">
                            <div class="promotion-type-card" onclick="QuickActions.selectPromotionType('discount')">
                                <div class="promotion-icon" style="background: linear-gradient(135deg, #ec4899, #db2777);">
                                    <i class="fas fa-percent"></i>
                                </div>
                                <div class="promotion-info">
                                    <div class="promotion-title">商品折扣</div>
                                    <div class="promotion-desc">设置商品价格折扣</div>
                                </div>
                            </div>
                            <div class="promotion-type-card" onclick="QuickActions.selectPromotionType('coupon')">
                                <div class="promotion-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                    <i class="fas fa-ticket-alt"></i>
                                </div>
                                <div class="promotion-info">
                                    <div class="promotion-title">优惠券</div>
                                    <div class="promotion-desc">发放优惠券码</div>
                                </div>
                            </div>
                            <div class="promotion-type-card" onclick="QuickActions.selectPromotionType('flash')">
                                <div class="promotion-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                    <i class="fas fa-bolt"></i>
                                </div>
                                <div class="promotion-info">
                                    <div class="promotion-title">限时抢购</div>
                                    <div class="promotion-desc">设置限时特价</div>
                                </div>
                            </div>
                            <div class="promotion-type-card" onclick="QuickActions.selectPromotionType('bundle')">
                                <div class="promotion-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                    <i class="fas fa-box"></i>
                                </div>
                                <div class="promotion-info">
                                    <div class="promotion-title">捆绑销售</div>
                                    <div class="promotion-desc">多商品组合优惠</div>
                                </div>
                            </div>
                        </div>

                        <div class="promotion-form" id="promotionForm" style="display: none;">
                            <div class="form-section">
                                <h4>活动基本信息</h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label>活动名称</label>
                                        <input type="text" class="form-input" id="promotionName" placeholder="请输入活动名称">
                                    </div>
                                    <div class="form-group">
                                        <label>活动类型</label>
                                        <select class="form-select" id="promotionType">
                                            <option value="discount">商品折扣</option>
                                            <option value="coupon">优惠券</option>
                                            <option value="flash">限时抢购</option>
                                            <option value="bundle">捆绑销售</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>开始时间</label>
                                        <input type="datetime-local" class="form-input" id="promotionStart">
                                    </div>
                                    <div class="form-group">
                                        <label>结束时间</label>
                                        <input type="datetime-local" class="form-input" id="promotionEnd">
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>优惠设置</h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label>折扣比例 (%)</label>
                                        <input type="number" class="form-input" id="discountRate" min="1" max="99" placeholder="例如: 20">
                                    </div>
                                    <div class="form-group">
                                        <label>优惠金额 (ETH)</label>
                                        <input type="number" class="form-input" id="discountAmount" step="0.001" placeholder="例如: 0.1">
                                    </div>
                                    <div class="form-group">
                                        <label>使用条件</label>
                                        <input type="number" class="form-input" id="minAmount" step="0.001" placeholder="最低消费金额">
                                    </div>
                                    <div class="form-group">
                                        <label>发放数量</label>
                                        <input type="number" class="form-input" id="couponCount" min="1" placeholder="优惠券数量">
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>适用商品</h4>
                                <div class="product-selector">
                                    <div class="selector-toolbar">
                                        <button type="button" class="btn btn-outline btn-sm" onclick="QuickActions.selectAllProducts()">
                                            全选
                                        </button>
                                        <button type="button" class="btn btn-outline btn-sm" onclick="QuickActions.clearProductSelection()">
                                            清空
                                        </button>
                                    </div>
                                    <div class="product-list" id="promotionProductList">
                                        ${ProductManagementPage.data.products.map(product => `
                                            <div class="product-item">
                                                <label class="checkbox-label">
                                                    <input type="checkbox" value="${product.id}">
                                                    <span class="checkmark"></span>
                                                </label>
                                                <img src="${product.image}" alt="${product.name}" class="product-thumb">
                                                <div class="product-info">
                                                    <div class="product-name">${product.name}</div>
                                                    <div class="product-price">${product.price} ETH</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline" onclick="QuickActions.hidePromotionCreator()">取消</button>
                        <button type="button" class="btn btn-primary" onclick="QuickActions.createPromotion()" id="createPromotionBtn" style="display: none;">
                            创建活动
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        setTimeout(() => {
            const modal = document.getElementById('promotionModal');
            modal.classList.add('show');
        }, 100);
    },

    // 隐藏优惠活动创建器
    hidePromotionCreator: function() {
        const modal = document.getElementById('promotionModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },

    // 选择优惠活动类型
    selectPromotionType: function(type) {
        const form = document.getElementById('promotionForm');
        const createBtn = document.getElementById('createPromotionBtn');
        const typeSelect = document.getElementById('promotionType');
        
        if (form && createBtn && typeSelect) {
            form.style.display = 'block';
            createBtn.style.display = 'block';
            typeSelect.value = type;
            
            // 滚动到表单
            form.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // 全选商品
    selectAllProducts: function() {
        const checkboxes = document.querySelectorAll('#promotionProductList input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = true);
    },

    // 清空商品选择
    clearProductSelection: function() {
        const checkboxes = document.querySelectorAll('#promotionProductList input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
    },

    // 创建优惠活动
    createPromotion: function() {
        const name = document.getElementById('promotionName')?.value;
        const type = document.getElementById('promotionType')?.value;
        const startTime = document.getElementById('promotionStart')?.value;
        const endTime = document.getElementById('promotionEnd')?.value;
        
        if (!name || !startTime || !endTime) {
            ProductManagementPage.showToast('请填写完整的活动信息', 'warning');
            return;
        }
        
        const selectedProducts = Array.from(document.querySelectorAll('#promotionProductList input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        if (selectedProducts.length === 0) {
            ProductManagementPage.showToast('请选择至少一个商品', 'warning');
            return;
        }
        
        ProductManagementPage.showToast(`优惠活动"${name}"创建成功！`, 'success');
        this.hidePromotionCreator();
    },

    // 客户评论管理功能
    showCommentManagement: function() {
        // 模拟评论数据
        const comments = [
            {
                id: 1,
                productId: 1,
                productName: '稀有数字艺术品 #001',
                productImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center',
                userName: 'CryptoArt_Lover',
                rating: 5,
                content: '非常精美的数字艺术品，质量超出预期！',
                status: 'pending',
                createdAt: '2024-01-20 14:30:00'
            },
            {
                id: 2,
                productId: 2,
                productName: '传奇武器包',
                productImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center',
                userName: 'GameMaster_2024',
                rating: 4,
                content: '游戏道具很实用，但价格稍贵',
                status: 'approved',
                createdAt: '2024-01-19 16:45:00'
            },
            {
                id: 3,
                productId: 1,
                productName: '稀有数字艺术品 #001',
                productImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center',
                userName: 'ArtCollector',
                rating: 3,
                content: '艺术品不错，但发货有点慢',
                status: 'rejected',
                createdAt: '2024-01-18 09:15:00'
            }
        ];
        
        const pendingCount = comments.filter(c => c.status === 'pending').length;
        const approvedCount = comments.filter(c => c.status === 'approved').length;
        const rejectedCount = comments.filter(c => c.status === 'rejected').length;
        
        const modalHtml = `
            <div class="modal-overlay" id="commentModal">
                <div class="modal-container large">
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-comments" style="color: #14b8a6;"></i>
                            客户评论管理
                        </h3>
                        <button class="modal-close" onclick="QuickActions.hideCommentManagement()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="comment-summary">
                            <div class="comment-card">
                                <div class="comment-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="comment-info">
                                    <div class="comment-title">待审核</div>
                                    <div class="comment-count">${pendingCount}</div>
                                </div>
                            </div>
                            <div class="comment-card">
                                <div class="comment-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="comment-info">
                                    <div class="comment-title">已通过</div>
                                    <div class="comment-count">${approvedCount}</div>
                                </div>
                            </div>
                            <div class="comment-card">
                                <div class="comment-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                    <i class="fas fa-times"></i>
                                </div>
                                <div class="comment-info">
                                    <div class="comment-title">已拒绝</div>
                                    <div class="comment-count">${rejectedCount}</div>
                                </div>
                            </div>
                        </div>

                        <div class="comment-filters">
                            <select class="form-select" id="commentStatusFilter" onchange="QuickActions.filterComments()">
                                <option value="">全部状态</option>
                                <option value="pending">待审核</option>
                                <option value="approved">已通过</option>
                                <option value="rejected">已拒绝</option>
                            </select>
                            <select class="form-select" id="commentRatingFilter" onchange="QuickActions.filterComments()">
                                <option value="">全部评分</option>
                                <option value="5">5星</option>
                                <option value="4">4星</option>
                                <option value="3">3星</option>
                                <option value="2">2星</option>
                                <option value="1">1星</option>
                            </select>
                        </div>

                        <div class="comment-list" id="commentList">
                            ${comments.map(comment => `
                                <div class="comment-item" data-status="${comment.status}" data-rating="${comment.rating}">
                                    <div class="comment-header">
                                        <div class="comment-product">
                                            <img src="${comment.productImage}" alt="${comment.productName}" class="product-thumb">
                                            <div class="product-info">
                                                <div class="product-name">${comment.productName}</div>
                                                <div class="comment-meta">
                                                    <span class="user-name">${comment.userName}</span>
                                                    <span class="comment-time">${ProductManagementPage.formatDate(comment.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="comment-rating">
                                            ${'★'.repeat(comment.rating)}${'☆'.repeat(5-comment.rating)}
                                        </div>
                                    </div>
                                    <div class="comment-content">
                                        ${comment.content}
                                    </div>
                                    <div class="comment-actions">
                                        <span class="status-badge status-${comment.status}">
                                            ${comment.status === 'pending' ? '待审核' : 
                                              comment.status === 'approved' ? '已通过' : '已拒绝'}
                                        </span>
                                        ${comment.status === 'pending' ? `
                                            <button class="btn btn-sm btn-success" onclick="QuickActions.approveComment(${comment.id})">
                                                通过
                                            </button>
                                            <button class="btn btn-sm btn-danger" onclick="QuickActions.rejectComment(${comment.id})">
                                                拒绝
                                            </button>
                                        ` : `
                                            <button class="btn btn-sm btn-outline" onclick="QuickActions.replyComment(${comment.id})">
                                                回复
                                            </button>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        setTimeout(() => {
            const modal = document.getElementById('commentModal');
            modal.classList.add('show');
        }, 100);
    },

    // 隐藏评论管理模态框
    hideCommentManagement: function() {
        const modal = document.getElementById('commentModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    },

    // 筛选评论
    filterComments: function() {
        const statusFilter = document.getElementById('commentStatusFilter')?.value;
        const ratingFilter = document.getElementById('commentRatingFilter')?.value;
        const commentItems = document.querySelectorAll('.comment-item');
        
        commentItems.forEach(item => {
            const status = item.dataset.status;
            const rating = item.dataset.rating;
            
            let show = true;
            
            if (statusFilter && status !== statusFilter) {
                show = false;
            }
            
            if (ratingFilter && rating !== ratingFilter) {
                show = false;
            }
            
            item.style.display = show ? 'block' : 'none';
        });
    },

    // 审核通过评论
    approveComment: function(commentId) {
        const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentItem) {
            commentItem.dataset.status = 'approved';
            ProductManagementPage.showToast('评论已审核通过', 'success');
            this.filterComments();
        }
    },

    // 拒绝评论
    rejectComment: function(commentId) {
        const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentItem) {
            commentItem.dataset.status = 'rejected';
            ProductManagementPage.showToast('评论已拒绝', 'warning');
            this.filterComments();
        }
    },

    // 回复评论
    replyComment: function(commentId) {
        const reply = prompt('请输入回复内容:');
        if (reply) {
            ProductManagementPage.showToast('回复已发送', 'success');
        }
    }
}; 