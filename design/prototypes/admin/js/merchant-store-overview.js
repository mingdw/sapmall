// 商家店铺概览页面功能

// 页面数据管理
class StoreOverviewManager {
    constructor() {
        this.currentPeriod = 'today';
        this.metricsData = {};
        this.init();
    }

    init() {
        this.initEventListeners();
        this.loadInitialData();
        this.startDataUpdates();
        this.initAnimations();
    }

    initEventListeners() {
        // 时间选择器
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePeriodChange(e.target.dataset.period);
            });
        });

        // 模态框事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.id);
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // 质押金额输入监听
        const stakeAmountInput = document.getElementById('stakeAmount');
        const stakePeriodSelect = document.getElementById('stakePeriod');
        
        if (stakeAmountInput && stakePeriodSelect) {
            stakeAmountInput.addEventListener('input', this.calculateExpectedReward.bind(this));
            stakePeriodSelect.addEventListener('change', this.calculateExpectedReward.bind(this));
        }
    }

    handlePeriodChange(period) {
        this.currentPeriod = period;
        
        // 更新按钮状态
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');

        // 加载对应时期的数据
        this.loadMetricsData(period);
    }

    loadInitialData() {
        this.loadMetricsData('today');
        this.loadActivities();
    }

    loadMetricsData(period) {
        // 模拟不同时期的数据
        const mockData = {
            today: {
                revenue: { value: '¥12,456', trend: '+12.5%', direction: 'up', commission: '¥345' },
                orders: { value: '123', trend: '+8.3%', direction: 'up', pending: '5' },
                visitors: { value: '896', trend: '+15.7%', direction: 'up', conversion: '13.8%' },
                products: { value: '456', trend: '0%', direction: 'neutral', lowStock: '3' }
            },
            week: {
                revenue: { value: '¥89,234', trend: '+18.2%', direction: 'up', commission: '¥2,678' },
                orders: { value: '567', trend: '+22.1%', direction: 'up', pending: '12' },
                visitors: { value: '5,432', trend: '+28.5%', direction: 'up', conversion: '10.4%' },
                products: { value: '456', trend: '+2.3%', direction: 'up', lowStock: '8' }
            },
            month: {
                revenue: { value: '¥345,678', trend: '+35.7%', direction: 'up', commission: '¥10,370' },
                orders: { value: '2,345', trend: '+42.8%', direction: 'up', pending: '23' },
                visitors: { value: '23,456', trend: '+51.3%', direction: 'up', conversion: '10.0%' },
                products: { value: '456', trend: '+5.2%', direction: 'up', lowStock: '12' }
            },
            year: {
                revenue: { value: '¥4,567,890', trend: '+125.6%', direction: 'up', commission: '¥136,037' },
                orders: { value: '34,567', trend: '+156.7%', direction: 'up', pending: '45' },
                visitors: { value: '345,678', trend: '+189.3%', direction: 'up', conversion: '10.0%' },
                products: { value: '456', trend: '+12.8%', direction: 'up', lowStock: '15' }
            }
        };

        const data = mockData[period];
        this.updateMetricsDisplay(data);
    }

    updateMetricsDisplay(data) {
        // 更新收入数据
        this.updateMetricCard('revenue', data.revenue);
        // 更新订单数据
        this.updateMetricCard('orders', data.orders);
        // 更新访客数据
        this.updateMetricCard('visitors', data.visitors);
        // 更新商品数据
        this.updateMetricCard('products', data.products);
    }

    updateMetricCard(type, data) {
        const card = document.querySelector(`.metric-card.${type}`);
        if (!card) return;

        // 更新数值
        const valueElement = card.querySelector('.metric-value');
        const trendElement = card.querySelector('.metric-trend');
        const subElement = card.querySelector('.metric-sub span');

        if (valueElement) {
            this.animateValue(valueElement, data.value);
        }

        if (trendElement) {
            trendElement.className = `metric-trend ${data.direction}`;
            trendElement.innerHTML = `<i class="fas fa-arrow-${data.direction === 'up' ? 'up' : data.direction === 'down' ? 'down' : 'minus'}"></i> ${data.trend}`;
        }

        if (subElement) {
            const subText = type === 'revenue' ? `平台佣金: ${data.commission}` :
                           type === 'orders' ? `待处理: ${data.pending}` :
                           type === 'visitors' ? `转化率: ${data.conversion}` :
                           `库存不足: ${data.lowStock}`;
            subElement.textContent = subText;
        }
    }

    animateValue(element, targetValue) {
        element.style.opacity = '0.5';
        setTimeout(() => {
            element.textContent = targetValue;
            element.style.opacity = '1';
        }, 150);
    }

    loadActivities() {
        // 模拟活动数据加载
        console.log('最近活动数据已加载');
    }

    startDataUpdates() {
        // 定期更新数据
        setInterval(() => {
            this.loadMetricsData(this.currentPeriod);
        }, 30000); // 每30秒更新一次
    }

    initAnimations() {
        // 页面加载动画
        const sections = document.querySelectorAll('.store-status-banner, .core-metrics-section, .quick-actions-section, .recent-activities-section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
    }

    calculateExpectedReward() {
        const amount = parseFloat(document.getElementById('stakeAmount').value) || 0;
        const period = parseInt(document.getElementById('stakePeriod').value) || 30;
        
        const rates = {
            30: 0.05,
            90: 0.08,
            180: 0.12,
            365: 0.18
        };
        
        const annualRate = rates[period] || 0.05;
        const dailyRate = annualRate / 365;
        const expectedReward = amount * dailyRate * period;
        
        const rewardElement = document.getElementById('expectedReward');
        if (rewardElement) {
            rewardElement.textContent = `${expectedReward.toFixed(2)} SAP`;
        }
    }
}

// 快速操作功能
function addProduct() {
    showToast('info', '跳转到商品上架页面...');
}

function manageOrders() {
    showToast('info', '跳转到订单管理页面...');
}

function viewAnalytics() {
    const modal = document.getElementById('analyticsModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => { renderAnalyticsChart(); }, 100);
    }
}

function customerService() {
    const modal = document.getElementById('customerServiceModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // 滚动到聊天消息底部
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    }
}

function storeSettings() {
    showToast('info', '跳转到店铺设置页面...');
}

function promotions() {
    showToast('info', '跳转到营销推广页面...');
}

function closeModal(modalId) {
    storeManager.closeModal(modalId);
}

// Toast通知系统
function showToast(type, message) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${iconMap[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 数据刷新功能
function refreshData() {
    showToast('info', '正在刷新数据...');
    
    setTimeout(() => {
        storeManager.loadInitialData();
        showToast('success', '数据刷新完成');
    }, 1000);
}

// 初始化
let storeManager;

document.addEventListener('DOMContentLoaded', function() {
    storeManager = new StoreOverviewManager();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl+R 刷新数据
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            refreshData();
        }
    });
});

// CSS样式注入
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        z-index: 1001;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        min-width: 300px;
        max-width: 400px;
    }
    
    .toast.toast-show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-primary);
    }
    
    .toast.toast-success .toast-content i { color: var(--accent-green); }
    .toast.toast-error .toast-content i { color: var(--accent-red); }
    .toast.toast-info .toast-content i { color: var(--accent-blue); }
    .toast.toast-warning .toast-content i { color: var(--accent-orange); }
    
    /* 数据加载动画 */
    .metric-value {
        transition: opacity 0.3s ease;
    }
    
    /* 状态指示器动画增强 */
    .status-indicator.online {
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
    }
    
    /* 悬停效果增强 */
    .metric-card:hover .metric-value {
        color: var(--accent-blue);
        text-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
    }
    
    .action-card:hover .action-title {
        color: var(--accent-blue);
    }
    
    /* 响应式Toast */
    @media (max-width: 768px) {
        .toast {
            right: 10px;
            left: 10px;
            min-width: auto;
            max-width: none;
            transform: translateY(-100px);
        }
        
        .toast.toast-show {
            transform: translateY(0);
        }
    }
    
    /* 按钮悬停效果 */
    .action-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;

document.head.appendChild(style);

// Chart.js渲染销售趋势
function renderAnalyticsChart() {
    if (!window.Chart) return;
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;
    if (window.analyticsChartInstance) {
        window.analyticsChartInstance.destroy();
    }
    window.analyticsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '销售额',
                data: [1200, 1800, 1500, 2100, 2600, 2300, 3200],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.08)',
                pointBackgroundColor: '#3b82f6',
                pointRadius: 4,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#8ca0b3', font: { weight: 500 } }
                },
                y: {
                    grid: { color: 'rgba(51,65,85,0.15)' },
                    ticks: { color: '#8ca0b3', font: { weight: 500 } }
                }
            }
        }
    });
}

// 客户服务相关函数
function selectCustomer(element, customerId) {
    // 移除所有active状态
    document.querySelectorAll('.customer-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加active状态到当前选中项
    element.classList.remove('unread');
    element.classList.add('active');
    
    // 移除未读标记
    const unreadBadge = element.querySelector('.unread-badge');
    if (unreadBadge) {
        unreadBadge.style.display = 'none';
    }
    
    // 更新聊天窗口标题
    updateChatHeader(element);
    
    // 加载对应的聊天记录
    loadChatHistory(customerId);
}

function updateChatHeader(customerElement) {
    const customerName = customerElement.querySelector('.customer-name').textContent.split(' ')[0];
    const customerAvatar = customerElement.querySelector('.customer-avatar img').src;
    const isOnline = customerElement.querySelector('.online-status').classList.contains('online');
    
    const chatHeader = document.querySelector('.current-customer');
    if (chatHeader) {
        chatHeader.querySelector('img').src = customerAvatar;
        chatHeader.querySelector('.customer-name').textContent = customerName;
        chatHeader.querySelector('.customer-status').textContent = isOnline ? '在线' : '离线';
        chatHeader.querySelector('.customer-status').className = `customer-status ${isOnline ? 'online' : 'offline'}`;
    }
}

function loadChatHistory(customerId) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    // 模拟不同客户的聊天记录
    const chatData = {
        'customer1': [
            { type: 'customer', text: '您好，请问我的订单什么时候发货？', time: '14:32' },
            { type: 'agent', text: '您好！您的订单 #ORD-2024-001234 已经打包完成，预计今天下午发货，明天就能收到。感谢您的耐心等待！', time: '14:35' },
            { type: 'customer', text: '太好了！谢谢您的回复', time: '14:36' }
        ],
        'customer2': [
            { type: 'customer', text: '商品质量很好，谢谢！', time: '15:20' },
            { type: 'agent', text: '非常感谢您的认可！我们会继续努力提供更好的商品和服务。如果还有其他需要帮助的地方，随时联系我们！', time: '15:22' }
        ],
        'customer3': [
            { type: 'customer', text: '可以退换货吗？', time: '13:15' },
            { type: 'agent', text: '当然可以！我们支持7天无理由退换货。请您提供订单号，我来帮您处理退换货申请。', time: '13:18' }
        ],
        'customer4': [
            { type: 'customer', text: '有优惠券可以使用吗？', time: '12:30' },
            { type: 'agent', text: '是的！目前有满100减20的优惠券可以使用，有效期到本月底。您可以在下单时选择使用。', time: '12:32' },
            { type: 'customer', text: '好的，谢谢！', time: '12:33' }
        ]
    };
    
    const messages = chatData[customerId] || [];
    chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${message.time}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
    });
    
    // 滚动到底部
    scrollToBottom();
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    // 添加客服消息
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message agent-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${currentTime}</div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    
    // 清空输入框
    messageInput.value = '';
    
    // 滚动到底部
    scrollToBottom();
    
    // 模拟客户回复
    setTimeout(() => {
        const customerReplies = [
            '好的，谢谢！',
            '明白了',
            '收到',
            '谢谢您的帮助',
            '好的，我会注意的'
        ];
        const randomReply = customerReplies[Math.floor(Math.random() * customerReplies.length)];
        
        const replyDiv = document.createElement('div');
        replyDiv.className = 'message customer-message';
        replyDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${randomReply}</div>
                <div class="message-time">${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;
        chatMessages.appendChild(replyDiv);
        scrollToBottom();
    }, 1000 + Math.random() * 2000);
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// 自动调整输入框高度
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
        
        // 支持回车发送
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}); 