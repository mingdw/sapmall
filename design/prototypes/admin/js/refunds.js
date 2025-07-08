// 退款/售后页面JavaScript

// 全局变量
let allRefunds = [];
let filteredRefunds = [];
let currentFilter = 'all';
let currentTypeFilter = 'all';
let currentTimeFilter = 'all';
let searchTerm = '';
let currentPage = 1;
let itemsPerPage = 5;

// 模拟退款记录数据
const mockRefunds = [
    {
        id: 'RF001',
        orderId: 'ORD20241128001',
        orderNumber: '#20241128001',
        type: 'refund',
        reason: 'quality',
        reasonText: '商品质量问题',
        description: '下载的软件无法正常运行，安装后出现多处错误。',
        status: 'pending',
        statusText: '处理中',
        amount: '5.20 SAP',
        productName: 'AI写作助手软件',
        productImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&h=120&fit=crop',
        createTime: '2024-11-28 14:30:25',
        updateTime: '2024-11-28 14:30:25',
        images: ['screenshot1.jpg', 'screenshot2.jpg'],
        customerService: {
            name: '小王',
            avatar: 'CS',
            messages: [
                {
                    type: 'system',
                    content: '您的退款申请已提交，我们会在24小时内处理。',
                    time: '2024-11-28 14:31:00'
                }
            ]
        }
    },
    {
        id: 'RF002',
        orderId: 'ORD20241127003',
        orderNumber: '#20241127003',
        type: 'exchange',
        reason: 'personal',
        reasonText: '个人原因不需要',
        description: '购买错了版本，希望能换成专业版。',
        status: 'approved',
        statusText: '已同意',
        amount: '3.50 SAP',
        productName: '设计模板包',
        productImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=120&h=120&fit=crop',
        createTime: '2024-11-27 10:15:30',
        updateTime: '2024-11-27 16:45:12',
        images: [],
        customerService: {
            name: '小李',
            avatar: 'CS',
            messages: []
        }
    },
    {
        id: 'RF003',
        orderId: 'ORD20241126002',
        orderNumber: '#20241126002',
        type: 'repair',
        reason: 'service',
        reasonText: '商家服务问题',
        description: '购买后商家一直未提供技术支持。',
        status: 'completed',
        statusText: '已完成',
        amount: '2.80 SAP',
        productName: '在线课程',
        productImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=120&h=120&fit=crop',
        createTime: '2024-11-26 09:20:45',
        updateTime: '2024-11-27 11:30:00',
        images: ['chat_record.jpg'],
        customerService: {
            name: '小张',
            avatar: 'CS',
            messages: []
        }
    },
    {
        id: 'RF004',
        orderId: 'ORD20241125001',
        orderNumber: '#20241125001',
        type: 'refund',
        reason: 'description',
        reasonText: '与商品描述不符',
        description: '商品功能与描述完全不符，根本无法使用。',
        status: 'rejected',
        statusText: '已拒绝',
        amount: '4.20 SAP',
        productName: 'NFT艺术品',
        productImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop',
        createTime: '2024-11-25 16:45:30',
        updateTime: '2024-11-26 09:15:20',
        images: [],
        customerService: {
            name: '小陈',
            avatar: 'CS',
            messages: []
        }
    }
];

// 模拟可申请退款的订单数据
const mockOrders = [
    {
        id: 'ORD20241128003',
        number: '#20241128003',
        productName: '3D建模软件',
        amount: '8.50 SAP',
        status: 'delivered',
        createTime: '2024-11-28 16:20:00'
    },
    {
        id: 'ORD20241127005',
        number: '#20241127005',
        productName: '音乐制作包',
        amount: '6.30 SAP',
        status: 'delivered',
        createTime: '2024-11-27 14:30:00'
    }
];

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeRefundsPage();
});

function initializeRefundsPage() {
    console.log('初始化退款/售后页面...');
    
    // 初始化数据
    allRefunds = [...mockRefunds];
    filteredRefunds = [...allRefunds];
    
    // 初始化事件监听器
    initEventListeners();
    
    // 渲染页面
    renderRefunds();
    updatePagination();
    updateFilterCounts();
    
    console.log('退款/售后页面初始化完成');
}

// 初始化事件监听器
function initEventListeners() {
    // 筛选标签
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.dataset.status;
            setActiveFilter(status);
        });
    });
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchTerm = this.value.toLowerCase();
                applyFilters();
            }, 300);
        });
    }
    
    // 模态框外点击关闭
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // 文件上传
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // 表单提交
    const refundForm = document.getElementById('refundForm');
    if (refundForm) {
        refundForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRefundForm();
        });
    }
}

// 设置活跃筛选器
function setActiveFilter(status) {
    currentFilter = status;
    currentPage = 1;
    
    // 更新UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-status="${status}"]`).classList.add('active');
    
    applyFilters();
}

// 应用筛选器
function applyFilters() {
    filteredRefunds = allRefunds.filter(refund => {
        // 状态筛选
        const statusMatch = currentFilter === 'all' || refund.status === currentFilter;
        
        // 类型筛选
        const typeMatch = currentTypeFilter === 'all' || refund.type === currentTypeFilter;
        
        // 时间筛选
        const timeMatch = currentTimeFilter === 'all' || isInTimeRange(refund.createTime, currentTimeFilter);
        
        // 搜索筛选
        const searchMatch = !searchTerm || 
            refund.orderNumber.toLowerCase().includes(searchTerm) ||
            refund.productName.toLowerCase().includes(searchTerm) ||
            refund.reasonText.toLowerCase().includes(searchTerm) ||
            refund.id.toLowerCase().includes(searchTerm);
        
        return statusMatch && typeMatch && timeMatch && searchMatch;
    });
    
    currentPage = 1;
    renderRefunds();
    updatePagination();
    updateFilterCounts();
}

// 渲染退款记录
function renderRefunds() {
    const refundsList = document.getElementById('refundsList');
    const emptyState = document.getElementById('emptyState');
    
    if (!refundsList) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageRefunds = filteredRefunds.slice(startIndex, endIndex);
    
    if (pageRefunds.length === 0) {
        refundsList.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        refundsList.innerHTML = pageRefunds.map(refund => createRefundHTML(refund)).join('');
    }
}

// 创建退款记录HTML
function createRefundHTML(refund) {
    const typeMap = {
        refund: { text: '退款', class: 'type-refund' },
        exchange: { text: '换货', class: 'type-exchange' },
        repair: { text: '维修', class: 'type-repair' }
    };
    
    const typeInfo = typeMap[refund.type] || { text: '未知', class: 'type-refund' };
    
    return `
        <div class="refund-row">
            <div class="refund-col refund-info">
                <div class="refund-id">${refund.id}</div>
                <div class="refund-type-badge ${typeInfo.class}">${typeInfo.text}</div>
                <div class="refund-reason">${refund.reasonText}</div>
            </div>
            <div class="refund-col order-info">
                <div class="order-number">${refund.orderNumber}</div>
                <div class="product-name">${refund.productName}</div>
            </div>
            <div class="refund-col refund-amount">
                ${refund.amount}
            </div>
            <div class="refund-col">
                <span class="status-badge status-${refund.status}">${refund.statusText}</span>
            </div>
            <div class="refund-col refund-time">
                ${formatDateTime(refund.createTime)}
            </div>
            <div class="refund-col refund-actions">
                <button class="admin-btn admin-btn-primary admin-btn-sm" onclick="viewRefundDetail('${refund.id}')">
                    <i class="fas fa-eye"></i>详情
                </button>
                ${refund.status === 'pending' ? `
                    <button class="admin-btn admin-btn-danger admin-btn-sm" onclick="cancelRefund('${refund.id}')">
                        <i class="fas fa-times"></i>撤销
                    </button>
                ` : ''}
                ${refund.status !== 'rejected' ? `
                    <button class="admin-btn admin-btn-outline admin-btn-sm" onclick="contactCustomerService('${refund.id}')">
                        <i class="fas fa-comments"></i>客服
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// 格式化日期时间
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${month}-${day} ${hours}:${minutes}`;
}

// 更新分页
function updatePagination() {
    const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const totalRecordsSpan = document.getElementById('totalRecords');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
    if (totalRecordsSpan) totalRecordsSpan.textContent = filteredRefunds.length;
    
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

// 翻页
function changePage(delta) {
    const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
    const newPage = currentPage + delta;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderRefunds();
        updatePagination();
    }
}

// 显示退款申请模态框
function showRefundModal() {
    const modal = document.getElementById('refundModal');
    const orderSelect = document.getElementById('orderSelect');
    
    // 清空表单
    const form = document.getElementById('refundForm');
    if (form) form.reset();
    
    // 填充订单选项
    if (orderSelect) {
        orderSelect.innerHTML = '<option value="">请选择要退款的订单</option>';
        mockOrders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `${order.number} - ${order.productName} (${order.amount})`;
            orderSelect.appendChild(option);
        });
        
        orderSelect.addEventListener('change', function() {
            if (this.value) {
                showSelectedOrder(this.value);
            } else {
                document.getElementById('selectedOrder').style.display = 'none';
            }
        });
    }
    
    if (modal) {
        modal.style.display = 'block';
    }
}

// 显示选中的订单信息
function showSelectedOrder(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    const selectedOrderDiv = document.getElementById('selectedOrder');
    
    if (order && selectedOrderDiv) {
        selectedOrderDiv.innerHTML = `
            <div class="selected-order-info">
                <h5>订单详情</h5>
                <p><strong>订单号：</strong>${order.number}</p>
                <p><strong>商品：</strong>${order.productName}</p>
                <p><strong>金额：</strong>${order.amount}</p>
                <p><strong>状态：</strong>已交付</p>
                <p><strong>下单时间：</strong>${order.createTime}</p>
            </div>
        `;
        selectedOrderDiv.style.display = 'block';
    }
}

// 处理文件上传
function handleFileUpload(event) {
    const files = event.target.files;
    const preview = document.getElementById('uploadPreview');
    
    if (!preview) return;
    
    // 清空现有预览
    preview.innerHTML = '';
    
    // 最多上传3张图片
    const maxFiles = Math.min(files.length, 3);
    
    for (let i = 0; i < maxFiles; i++) {
        const file = files[i];
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="预览图片">
                    <button class="remove-preview" onclick="removePreview(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                preview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        }
    }
}

// 移除预览图片
function removePreview(button) {
    button.parentElement.remove();
}

// 提交退款申请表单
function submitRefundForm() {
    const form = document.getElementById('refundForm');
    const formData = new FormData(form);
    
    const orderSelect = document.getElementById('orderSelect');
    const description = document.getElementById('description');
    const reasonInputs = document.querySelectorAll('input[name="reason"]:checked');
    
    // 表单验证
    if (!orderSelect.value) {
        showToast('请选择要退款的订单', 'error');
        return;
    }
    
    if (reasonInputs.length === 0) {
        showToast('请选择退款原因', 'error');
        return;
    }
    
    if (!description.value.trim()) {
        showToast('请填写问题描述', 'error');
        return;
    }
    
    // 模拟提交
    const newRefund = {
        id: 'RF' + String(Date.now()).slice(-3),
        orderId: orderSelect.value,
        orderNumber: mockOrders.find(o => o.id === orderSelect.value)?.number || '',
        type: 'refund',
        reason: reasonInputs[0].value,
        reasonText: reasonInputs[0].nextElementSibling.textContent,
        description: description.value,
        status: 'pending',
        statusText: '处理中',
        amount: mockOrders.find(o => o.id === orderSelect.value)?.amount || '0 SAP',
        productName: mockOrders.find(o => o.id === orderSelect.value)?.productName || '',
        productImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&h=120&fit=crop',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        images: [],
        customerService: {
            name: '系统',
            avatar: 'SYS',
            messages: []
        }
    };
    
    // 添加到列表
    allRefunds.unshift(newRefund);
    filteredRefunds = [...allRefunds];
    
    // 刷新显示
    renderRefunds();
    updatePagination();
    
    // 关闭模态框
    closeRefundModal();
    
    showToast('退款申请提交成功，我们会尽快处理！', 'success');
}

// 查看退款详情
function viewRefundDetail(refundId) {
    const refund = allRefunds.find(r => r.id === refundId);
    if (!refund) return;
    
    const modal = document.getElementById('refundDetailModal');
    const modalBody = document.getElementById('refundDetailBody');
    
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="refund-detail">
                <div class="detail-section">
                    <h4 class="detail-title">
                        <i class="fas fa-info-circle"></i>
                        申请信息
                    </h4>
                    <div class="detail-content">
                        <div class="detail-row">
                            <label>申请编号:</label>
                            <span>${refund.id}</span>
                        </div>
                        <div class="detail-row">
                            <label>申请类型:</label>
                            <span>${refund.type === 'refund' ? '退款' : refund.type === 'exchange' ? '换货' : '维修'}</span>
                        </div>
                        <div class="detail-row">
                            <label>申请原因:</label>
                            <span>${refund.reasonText}</span>
                        </div>
                        <div class="detail-row">
                            <label>问题描述:</label>
                            <span class="description-text">${refund.description}</span>
                        </div>
                        <div class="detail-row">
                            <label>申请状态:</label>
                            <span class="status-badge status-${refund.status}">${refund.statusText}</span>
                        </div>
                        <div class="detail-row">
                            <label>申请时间:</label>
                            <span>${refund.createTime}</span>
                        </div>
                        <div class="detail-row">
                            <label>更新时间:</label>
                            <span>${refund.updateTime}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4 class="detail-title">
                        <i class="fas fa-shopping-cart"></i>
                        订单信息
                    </h4>
                    <div class="detail-content">
                        <div class="order-detail">
                            <img src="${refund.productImage}" alt="${refund.productName}" class="product-image">
                            <div class="product-info">
                                <div class="product-name">${refund.productName}</div>
                                <div class="order-number">订单号: ${refund.orderNumber}</div>
                                <div class="refund-amount">金额: ${refund.amount}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${refund.images && refund.images.length > 0 ? `
                    <div class="detail-section">
                        <h4 class="detail-title">
                            <i class="fas fa-images"></i>
                            上传凭证
                        </h4>
                        <div class="detail-content">
                            <div class="evidence-images">
                                ${refund.images.map(img => `
                                    <div class="evidence-item">
                                        <i class="fas fa-image"></i>
                                        <span>${img}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="detail-actions">
                    ${refund.status === 'pending' ? `
                        <button class="admin-btn admin-btn-danger" onclick="cancelRefund('${refund.id}'); closeRefundDetailModal();">
                            <i class="fas fa-times"></i>
                            撤销申请
                        </button>
                    ` : ''}
                    <button class="admin-btn admin-btn-primary" onclick="contactCustomerService('${refund.id}'); closeRefundDetailModal();">
                        <i class="fas fa-comments"></i>
                        联系客服
                    </button>
                    <button class="admin-btn admin-btn-outline" onclick="closeRefundDetailModal()">
                        关闭
                    </button>
                </div>
            </div>
        `;
    }
    
    if (modal) {
        modal.style.display = 'block';
    }
}

// 联系客服
function contactCustomerService(refundId) {
    const refund = allRefunds.find(r => r.id === refundId);
    if (!refund) return;
    
    const modal = document.getElementById('chatModal');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatMessages) {
        // 清空聊天记录
        chatMessages.innerHTML = '';
        
        // 添加系统消息
        addChatMessage('system', `您好！我是客服${refund.customerService.name}，关于您的${refund.type === 'refund' ? '退款' : '售后'}申请 ${refund.id}，有什么可以帮助您的吗？`, new Date().toLocaleTimeString());
        
        // 如果有历史消息，加载它们
        if (refund.customerService.messages && refund.customerService.messages.length > 0) {
            refund.customerService.messages.forEach(msg => {
                addChatMessage(msg.type, msg.content, msg.time);
            });
        }
    }
    
    if (modal) {
        modal.style.display = 'block';
    }
}

// 添加聊天消息
function addChatMessage(type, content, time) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${type === 'user' ? 'ME' : 'CS'}</div>
        <div class="message-content">
            ${content}
            <div class="message-time">${time}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 发送消息
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput || !messageInput.value.trim()) return;
    
    const message = messageInput.value.trim();
    const currentTime = new Date().toLocaleTimeString();
    
    // 添加用户消息
    addChatMessage('user', message, currentTime);
    
    // 清空输入框
    messageInput.value = '';
    
    // 模拟客服回复
    setTimeout(() => {
        const replies = [
            '我已经收到您的消息，正在为您查询相关信息...',
            '感谢您的耐心等待，我会尽快为您处理。',
            '根据您的描述，我需要进一步核实情况。',
            '您的问题我已记录，会在1个工作日内给您回复。'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        addChatMessage('system', randomReply, new Date().toLocaleTimeString());
    }, 1000);
}

// 撤销退款申请
function cancelRefund(refundId) {
    if (!confirm('确定要撤销这个退款申请吗？撤销后无法恢复。')) {
        return;
    }
    
    const index = allRefunds.findIndex(r => r.id === refundId);
    if (index !== -1) {
        allRefunds.splice(index, 1);
        applyFilters();
        showToast('退款申请已撤销', 'success');
    }
}

// 导出退款记录
function exportRefunds() {
    showToast('导出功能开发中...', 'info');
}

// 刷新退款记录
function refreshRefunds() {
    // 模拟刷新
    showToast('数据已刷新', 'success');
    renderRefunds();
}

// 关闭模态框函数
function closeRefundModal() {
    const modal = document.getElementById('refundModal');
    if (modal) modal.style.display = 'none';
}

function closeRefundDetailModal() {
    const modal = document.getElementById('refundDetailModal');
    if (modal) modal.style.display = 'none';
}

function closeChatModal() {
    const modal = document.getElementById('chatModal');
    if (modal) modal.style.display = 'none';
}

// 其他申请模态框（暂时用toast提示）
function showExchangeModal() {
    showToast('换货申请功能开发中...', 'info');
}

function showRepairModal() {
    showToast('维修申请功能开发中...', 'info');
}

function showConsultModal() {
    showToast('正在为您转接人工客服...', 'info');
    setTimeout(() => {
        contactCustomerService('general');
    }, 1000);
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        background: ${getToastColor(type)};
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getToastColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// 聊天功能辅助函数
function insertEmoji() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        const emojis = ['😊', '😔', '👍', '❤️', '🤝', '💡'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        messageInput.value += randomEmoji;
        messageInput.focus();
    }
}

function uploadFile() {
    showToast('文件上传功能开发中...', 'info');
}

// 新增筛选功能
function applyTypeFilter() {
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        currentTypeFilter = typeFilter.value;
        currentPage = 1;
        applyFilters();
    }
}

function applyTimeFilter() {
    const timeFilter = document.getElementById('timeFilter');
    if (timeFilter) {
        currentTimeFilter = timeFilter.value;
        currentPage = 1;
        applyFilters();
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchTerm = '';
        currentPage = 1;
        applyFilters();
        searchInput.focus();
    }
}

// 检查日期是否在指定时间范围内
function isInTimeRange(dateString, range) {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
        case 'today':
            return date >= today;
        case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date >= weekAgo;
        case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return date >= monthAgo;
        default:
            return true;
    }
}

// 更新筛选计数
function updateFilterCounts() {
    const statusButtons = document.querySelectorAll('.filter-btn');
    statusButtons.forEach(btn => {
        const status = btn.dataset.status;
        if (status !== 'all') {
            const count = allRefunds.filter(refund => refund.status === status).length;
            const text = btn.textContent.split('(')[0].trim();
            btn.textContent = count > 0 ? `${text} (${count})` : text;
        }
    });
} 