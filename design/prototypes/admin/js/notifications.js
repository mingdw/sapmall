/* 通知设置页面脚本 */

// 通知数据对象
const NotificationData = {
    // 通知渠道状态
    channels: {
        email: { enabled: true, value: 'user@example.com' },
        mobile: { enabled: true, value: '+86 138****5678' },
        browser: { enabled: true }
    },
    
    // 通知项数据
    notifications: {
        'transaction-confirmation': {
            title: '交易确认通知',
            description: '当您发起交易时，系统将发送确认通知',
            enabled: true,
            category: 'transaction',
            channels: { email: true, mobile: true, browser: true },
            previewContent: {
                email: '您有一笔交易需要确认，请及时处理。',
                mobile: '您有一笔交易需要确认，请及时处理。',
                browser: '您有一笔交易需要确认，请及时处理。'
            }
        },
        'transaction-complete': {
            title: '交易完成通知',
            description: '当您的交易完成时，系统将发送通知',
            enabled: true,
            category: 'transaction',
            channels: { email: true, mobile: true, browser: true },
            previewContent: {
                email: '您的交易已完成，交易金额：1.5 ETH。',
                mobile: '您的交易已完成，交易金额：1.5 ETH。',
                browser: '您的交易已完成，交易金额：1.5 ETH。'
            }
        },
        'login-alert': {
            title: '登录提醒',
            description: '当您的账户在新设备上登录时，系统将发送通知',
            enabled: true,
            category: 'security',
            importance: 'high',
            channels: { email: true, mobile: true, browser: true },
            previewContent: {
                email: '您的账户刚刚在新设备上登录，IP地址：192.168.1.1，如非本人操作，请立即修改密码。',
                mobile: '您的账户刚刚在新设备上登录，IP地址：192.168.1.1，如非本人操作，请立即修改密码。',
                browser: '您的账户刚刚在新设备上登录，IP地址：192.168.1.1，如非本人操作，请立即修改密码。'
            }
        },
        'security-change': {
            title: '安全设置变更',
            description: '当您的安全设置发生变更时，系统将发送通知',
            enabled: true,
            category: 'security',
            importance: 'high',
            channels: { email: true, mobile: true, browser: false },
            previewContent: {
                email: '您的账户安全设置已更改，变更项：启用了双重认证。如非本人操作，请立即联系客服。',
                mobile: '您的账户安全设置已更改，变更项：启用了双重认证。如非本人操作，请立即联系客服。',
                browser: '您的账户安全设置已更改，变更项：启用了双重认证。如非本人操作，请立即联系客服。'
            }
        },
        'system-maintenance': {
            title: '系统维护通知',
            description: '当系统计划维护时，系统将提前发送通知',
            enabled: true,
            category: 'system',
            importance: 'medium',
            channels: { email: true, mobile: false, browser: true },
            frequency: 'daily',
            previewContent: {
                email: '系统将于2024年6月15日 02:00-04:00进行例行维护，期间部分服务可能暂时不可用，请提前做好准备。',
                mobile: '系统将于2024年6月15日 02:00-04:00进行例行维护，期间部分服务可能暂时不可用，请提前做好准备。',
                browser: '系统将于2024年6月15日 02:00-04:00进行例行维护，期间部分服务可能暂时不可用，请提前做好准备。'
            }
        },
        'new-feature': {
            title: '新功能公告',
            description: '当平台发布新功能时，系统将发送通知',
            enabled: false,
            category: 'system',
            importance: 'low',
            channels: { email: true, mobile: false, browser: false },
            frequency: 'weekly',
            previewContent: {
                email: '我们最新上线了"一键买卖"功能，现在您可以更便捷地进行交易，欢迎体验！',
                mobile: '我们最新上线了"一键买卖"功能，现在您可以更便捷地进行交易，欢迎体验！',
                browser: '我们最新上线了"一键买卖"功能，现在您可以更便捷地进行交易，欢迎体验！'
            }
        }
    }
};

// 通知设置页面对象
const NotificationSettings = {
    // 初始化
    init: function() {
        this.setupEventListeners();
        this.applyInitialState();
        this.updateNotificationChannels();
    },
    
    // 应用初始状态
    applyInitialState: function() {
        // 设置通知开关初始状态
        Object.keys(NotificationData.notifications).forEach(id => {
            const notification = NotificationData.notifications[id];
            const toggle = document.querySelector(`.notification-toggle[data-id="${id}"]`);
            if (toggle) {
                toggle.checked = notification.enabled;
                
                // 设置渠道开关状态
                const channelToggles = document.querySelectorAll(`.channel-toggle[data-id="${id}"]`);
                channelToggles.forEach(channelToggle => {
                    const channel = channelToggle.dataset.channel;
                    channelToggle.checked = notification.channels[channel];
                    channelToggle.disabled = !notification.enabled;
                });
                
                // 设置频率选择状态
                const frequencySelect = document.querySelector(`.form-select[data-id="${id}"]`);
                if (frequencySelect && notification.frequency) {
                    frequencySelect.value = notification.frequency;
                    frequencySelect.disabled = !notification.enabled;
                }
            }
        });
        
        // 设置通知渠道状态
        document.getElementById('emailEnabled').checked = NotificationData.channels.email.enabled;
        document.getElementById('emailInput').value = NotificationData.channels.email.value;
        document.getElementById('emailInput').disabled = !NotificationData.channels.email.enabled;
        
        document.getElementById('mobileEnabled').checked = NotificationData.channels.mobile.enabled;
        document.getElementById('mobileInput').value = NotificationData.channels.mobile.value;
        document.getElementById('mobileInput').disabled = !NotificationData.channels.mobile.enabled;
        
        document.getElementById('browserEnabled').checked = NotificationData.channels.browser.enabled;
        
        // 设置默认活动标签
        const defaultFilterBtn = document.querySelector('.filter-btn[data-tab="all"]');
        if (defaultFilterBtn) {
            defaultFilterBtn.classList.add('active');
        }
    },
    
    // 设置事件监听器
    setupEventListeners: function() {
        // 通知开关
        const notificationToggles = document.querySelectorAll('.notification-toggle');
        notificationToggles.forEach(toggle => {
            toggle.addEventListener('change', this.handleNotificationToggle);
        });
        
        // 通知渠道开关
        const channelToggles = document.querySelectorAll('.channel-toggle');
        channelToggles.forEach(toggle => {
            toggle.addEventListener('change', this.handleChannelToggle);
        });
        
        // 频率选择
        const frequencySelects = document.querySelectorAll('.form-select');
        frequencySelects.forEach(select => {
            select.addEventListener('change', this.handleFrequencyChange);
        });
        
        // 预览按钮
        const previewButtons = document.querySelectorAll('.preview-btn');
        previewButtons.forEach(button => {
            button.addEventListener('click', this.handlePreview);
        });
        
        // 分类过滤按钮
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', this.handleFilterClick);
        });
        
        // 全部启用/禁用按钮
        document.getElementById('enableAllBtn').addEventListener('click', () => this.handleBatchOperation(true));
        document.getElementById('disableAllBtn').addEventListener('click', () => this.handleBatchOperation(false));
        
        // 保存设置按钮
        document.getElementById('saveSettingsBtn').addEventListener('click', this.handleSaveSettings);
        
        // 保存通知渠道设置按钮
        document.getElementById('saveChannelBtn').addEventListener('click', this.saveChannelSettings);
        
        // 通知渠道开关状态变更
        document.getElementById('emailEnabled').addEventListener('change', function() {
            NotificationData.channels.email.enabled = this.checked;
            document.getElementById('emailInput').disabled = !this.checked;
            NotificationSettings.updateNotificationChannels();
        });
        
        document.getElementById('mobileEnabled').addEventListener('change', function() {
            NotificationData.channels.mobile.enabled = this.checked;
            document.getElementById('mobileInput').disabled = !this.checked;
            NotificationSettings.updateNotificationChannels();
        });
        
        document.getElementById('browserEnabled').addEventListener('change', function() {
            NotificationData.channels.browser.enabled = this.checked;
            NotificationSettings.updateNotificationChannels();
        });
        
        // 测试浏览器通知按钮
        document.getElementById('testBrowserNotification').addEventListener('click', this.testBrowserNotification);
        
        // 预览模态框标签
        const previewTabs = document.querySelectorAll('.preview-tab');
        previewTabs.forEach(tab => {
            tab.addEventListener('click', this.handlePreviewTabClick);
        });
        
        // 关闭模态框按钮
        const closeModalButtons = document.querySelectorAll('.close-modal');
        closeModalButtons.forEach(button => {
            button.addEventListener('click', this.closeAllModals);
        });
        
        // 点击模态框外部关闭
        window.addEventListener('click', function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // 确保预览按钮可以正常工作
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const notificationId = this.dataset.id;
                NotificationSettings.handlePreview.call(this);
            });
        });
    },
    
    // 更新通知类型中的可用通知渠道
    updateNotificationChannels: function() {
        // 遍历所有通知渠道选项
        const channelToggles = document.querySelectorAll('.channel-toggle');
        channelToggles.forEach(toggle => {
            const channel = toggle.dataset.channel;
            const channelOption = toggle.parentElement;
            
            // 如果该渠道被禁用，则禁用对应的选项
            if (!NotificationData.channels[channel].enabled) {
                toggle.checked = false;
                toggle.disabled = true;
                channelOption.classList.add('disabled');
                
                // 添加不可用提示
                if (!channelOption.querySelector('.channel-unavailable')) {
                    const unavailableMsg = document.createElement('span');
                    unavailableMsg.className = 'channel-unavailable';
                    unavailableMsg.textContent = '未启用';
                    channelOption.appendChild(unavailableMsg);
                }
                
                // 更新数据
                const notificationId = toggle.dataset.id;
                if (NotificationData.notifications[notificationId]) {
                    NotificationData.notifications[notificationId].channels[channel] = false;
                }
            } else {
                toggle.disabled = false;
                channelOption.classList.remove('disabled');
                
                // 移除不可用提示
                const unavailableMsg = channelOption.querySelector('.channel-unavailable');
                if (unavailableMsg) {
                    channelOption.removeChild(unavailableMsg);
                }
            }
        });
        
        // 检查通知项是否有可用的通知渠道
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            const toggles = item.querySelectorAll('.channel-toggle:not([disabled])');
            const mainToggle = item.querySelector('.notification-toggle');
            const notificationId = mainToggle.dataset.id;
            
            // 如果没有可用的通知渠道，禁用整个通知项
            if (toggles.length === 0) {
                mainToggle.checked = false;
                mainToggle.disabled = true;
                item.classList.add('disabled');
                
                // 更新数据
                if (NotificationData.notifications[notificationId]) {
                    NotificationData.notifications[notificationId].enabled = false;
                }
            } else {
                mainToggle.disabled = false;
                item.classList.remove('disabled');
            }
        });
    },
    
    // 处理通知开关变更
    handleNotificationToggle: function() {
        const notificationId = this.dataset.id;
        const isEnabled = this.checked;
        
        // 更新数据
        if (NotificationData.notifications[notificationId]) {
            NotificationData.notifications[notificationId].enabled = isEnabled;
        }
        
        // 更新渠道开关状态
        const channelToggles = document.querySelectorAll(`.channel-toggle[data-id="${notificationId}"]`);
        channelToggles.forEach(channelToggle => {
            channelToggle.disabled = !isEnabled;
        });
        
        // 更新频率选择状态
        const frequencySelect = document.querySelector(`.form-select[data-id="${notificationId}"]`);
        if (frequencySelect) {
            frequencySelect.disabled = !isEnabled;
        }
    },
    
    // 处理通知渠道开关变更
    handleChannelToggle: function() {
        const notificationId = this.dataset.id;
        const channel = this.dataset.channel;
        const isEnabled = this.checked;
        
        // 更新数据
        if (NotificationData.notifications[notificationId]) {
            NotificationData.notifications[notificationId].channels[channel] = isEnabled;
        }
    },
    
    // 处理频率选择变更
    handleFrequencyChange: function() {
        const notificationId = this.dataset.id;
        const frequency = this.value;
        
        // 更新数据
        if (NotificationData.notifications[notificationId]) {
            NotificationData.notifications[notificationId].frequency = frequency;
        }
    },
    
    // 处理预览按钮点击
    handlePreview: function() {
        const notificationId = this.dataset.id;
        const notification = NotificationData.notifications[notificationId];
        
        if (notification) {
            // 设置预览内容
            document.getElementById('emailSubject').textContent = notification.title;
            document.getElementById('emailBody').textContent = notification.previewContent.email;
            
            document.getElementById('mobileTitle').textContent = notification.title;
            document.getElementById('mobileBody').textContent = notification.previewContent.mobile;
            
            document.getElementById('browserTitle').textContent = notification.title;
            document.getElementById('browserBody').textContent = notification.previewContent.browser;
            
            // 显示预览模态框
            document.getElementById('previewModal').style.display = 'block';
        }
    },
    
    // 处理过滤按钮点击
    handleFilterClick: function() {
        const tabId = this.dataset.tab;
        
        // 移除所有按钮的活动状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 添加当前按钮的活动状态
        this.classList.add('active');
        
        // 显示或隐藏通知项
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            if (tabId === 'all' || item.dataset.category === tabId) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    },
    
    // 处理批量操作
    handleBatchOperation: function(isEnable) {
        // 获取当前可见的通知项
        const visibleItems = Array.from(document.querySelectorAll('.notification-item')).filter(item => {
            return item.style.display !== 'none' && !item.classList.contains('disabled');
        });
        
        // 更新通知开关状态
        visibleItems.forEach(item => {
            const toggle = item.querySelector('.notification-toggle');
            if (toggle && !toggle.disabled) {
                toggle.checked = isEnable;
                
                // 触发变更事件
                const event = new Event('change');
                toggle.dispatchEvent(event);
            }
        });
        
        // 显示操作结果提示
        this.showToast(`已${isEnable ? '启用' : '禁用'}所有可见的通知`);
    },
    
    // 处理保存设置
    handleSaveSettings: function() {
        // 这里可以添加保存到服务器的逻辑
        
        // 显示保存成功提示
        NotificationSettings.showToast('通知类型设置已保存成功', 'success');
    },
    
    // 处理预览标签点击
    handlePreviewTabClick: function() {
        const previewId = this.dataset.preview;
        
        // 移除所有标签的活动状态
        document.querySelectorAll('.preview-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 添加当前标签的活动状态
        this.classList.add('active');
        
        // 隐藏所有预览面板
        document.querySelectorAll('.preview-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // 显示当前预览面板
        document.querySelector(`.preview-panel[data-preview-content="${previewId}"]`).classList.add('active');
    },
    
    // 关闭所有模态框
    closeAllModals: function() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    },
    
    // 测试浏览器通知
    testBrowserNotification: function() {
        if (Notification.permission === 'granted') {
            sendTestNotification();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    sendTestNotification();
                }
            });
        } else {
            NotificationSettings.showToast('浏览器通知权限已被拒绝，请在浏览器设置中允许通知', 'error');
        }
        
        function sendTestNotification() {
            const notification = new Notification('测试通知', {
                body: '这是一条测试通知，用于验证浏览器通知功能是否正常。',
                icon: '/favicon.ico'
            });
            
            notification.onclick = function() {
                window.focus();
                notification.close();
            };
            
            NotificationSettings.showToast('测试通知已发送', 'success');
        }
    },
    
    // 显示提示信息
    showToast: function(message, type = 'info') {
        // 创建或获取提示容器
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // 设置提示内容
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-close">&times;</div>
        `;
        
        // 添加到提示容器
        toastContainer.appendChild(toast);
        
        // 显示提示
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // 绑定关闭按钮事件
        toast.querySelector('.toast-close').addEventListener('click', function() {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        });
        
        // 自动关闭
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },
    
    // 保存通知渠道设置
    saveChannelSettings: function() {
        // 更新通知渠道数据
        NotificationData.channels.email.enabled = document.getElementById('emailEnabled').checked;
        NotificationData.channels.email.value = document.getElementById('emailInput').value;
        
        NotificationData.channels.mobile.enabled = document.getElementById('mobileEnabled').checked;
        NotificationData.channels.mobile.value = document.getElementById('mobileInput').value;
        
        NotificationData.channels.browser.enabled = document.getElementById('browserEnabled').checked;
        
        // 更新通知类型中的可用通知渠道
        NotificationSettings.updateNotificationChannels();
        
        // 显示保存成功提示
        NotificationSettings.showToast('通知渠道设置已保存', 'success');
    }
};

// 验证邮箱格式
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// 验证手机号格式
function validatePhone(phone) {
    const re = /^\+?[0-9]{1,4}[\s-]?[0-9]{6,14}$/;
    return re.test(String(phone));
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    NotificationSettings.init();
}); 