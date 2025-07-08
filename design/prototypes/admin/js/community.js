// 社区参与页面JavaScript功能

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunityPage();
});

// 初始化社区页面
function initializeCommunityPage() {
    // 初始化时间筛选按钮
    initializeTimeFilter();
    
    // 初始化卡片悬停效果
    initializeCardHoverEffects();
    
    // 初始化事件筛选
    initializeEventFilter();
    
    // 模拟加载用户数据
    loadUserCommunityData();
}

// 初始化时间筛选按钮
function initializeTimeFilter() {
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除其他按钮的active状态
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            // 添加当前按钮的active状态
            this.classList.add('active');
            
            // 根据选择的时间周期更新贡献数据
            const period = this.dataset.period;
            updateContributionData(period);
        });
    });
}

// 初始化卡片悬停效果
function initializeCardHoverEffects() {
    // 为所有可交互卡片添加悬停效果
    document.querySelectorAll('.action-card, .discussion-item, .event-item, .achievement-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// 初始化事件筛选
function initializeEventFilter() {
    const eventFilter = document.getElementById('eventFilter');
    if (eventFilter) {
        eventFilter.addEventListener('change', function() {
            filterEvents();
        });
    }
}

// 加载用户社区数据
function loadUserCommunityData() {
    // 模拟从API加载数据
    setTimeout(() => {
        updateUserStats();
        updateContributionChart();
    }, 500);
}

// 更新用户统计数据
function updateUserStats() {
    const stats = {
        discussions: 156,
        likes: 89,
        points: 1234,
        events: 23
    };
    
    // 动画效果更新数字
    animateCountUp('.stat-value', [stats.discussions, stats.likes, stats.points, stats.events]);
}

// 数字动画效果
function animateCountUp(selector, targetValues) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        if (index < targetValues.length) {
            const target = targetValues[index];
            const current = parseInt(element.textContent.replace(/,/g, '')) || 0;
            const increment = target / 30; // 30帧动画
            let currentValue = 0;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= target) {
                    currentValue = target;
                    clearInterval(timer);
                }
                element.textContent = formatNumber(Math.floor(currentValue));
            }, 50);
        }
    });
}

// 格式化数字显示
function formatNumber(num) {
    return new Intl.NumberFormat('zh-CN').format(num);
}

// 创建新讨论
function createPost() {
    const topics = [
        'DeFi协议优化建议',
        'NFT市场发展趋势',
        'DAO治理机制改进',
        '代币经济模型分析',
        '智能合约安全问题',
        '跨链技术探讨',
        '元宇宙应用场景',
        '区块链游戏体验'
    ];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    const title = prompt(`请输入讨论标题（建议主题：${randomTopic}）:`);
    
    if (title && title.trim()) {
        showToast('发布成功', `您的讨论"${title}"已成功发布！`, 'success');
        
        // 模拟增加讨论数
        setTimeout(() => {
            updateStatValue('.stat-value', 0, 1); // 增加讨论数
            updateContributionList('发起讨论', title, '+10 积分');
        }, 1000);
    }
}

// 参加活动
function joinEvent(eventId) {
    if (eventId) {
        // 特定活动参与
        showToast('参与成功', `您已成功参与活动 ${eventId}！`, 'success');
        
        // 更新按钮状态
        const button = document.querySelector(`button[onclick="joinEvent('${eventId}')"]`);
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> 已参与';
            button.disabled = true;
            button.style.background = 'rgba(16, 185, 129, 0.3)';
        }
    } else {
        // 通用活动参与
        const availableEvents = [
            'SAP生态建设讨论会',
            '智能合约开发大赛',
            '区块链技术分享会',
            'DeFi产品体验活动',
            'NFT创作工坊',
            '社区治理投票活动'
        ];
        
        const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        showToast('活动推荐', `推荐您参与"${randomEvent}"，立即获得积分奖励！`, 'info');
    }
    
    // 更新活动参与数
    setTimeout(() => {
        updateStatValue('.stat-value', 3, 1); // 增加活动参与数
    }, 1000);
}

// 帮助新手
function helpNewbie() {
    const helpTopics = [
        '钱包连接问题',
        '交易手续费说明',
        'NFT购买流程',
        '代币质押操作',
        '投票参与方法',
        '安全防护建议'
    ];
    
    const randomTopic = helpTopics[Math.floor(Math.random() * helpTopics.length)];
    
    const confirmed = confirm(`发现新用户需要帮助！\n\n问题类型：${randomTopic}\n\n您愿意提供帮助吗？\n（帮助他人可获得额外积分奖励）`);
    
    if (confirmed) {
        showToast('感谢帮助', `您已成功帮助新用户解决"${randomTopic}"问题！`, 'success');
        
        // 模拟帮助奖励
        setTimeout(() => {
            updateContributionList('帮助新用户', randomTopic, '+15 积分');
            updateStatValue('.stat-value', 2, 15); // 增加积分
        }, 1000);
    }
}

// 反馈问题
function reportIssue() {
    const issueTypes = [
        '页面显示异常',
        '交易功能故障',
        '连接钱包失败',
        '数据加载错误',
        '用户体验问题',
        '安全漏洞报告',
        '功能改进建议',
        '性能优化建议'
    ];
    
    let typeList = issueTypes.map((type, index) => `${index + 1}. ${type}`).join('\n');
    
    const selectedType = prompt(`请选择问题类型（输入序号）：\n\n${typeList}`);
    
    if (selectedType && selectedType >= 1 && selectedType <= issueTypes.length) {
        const issueType = issueTypes[selectedType - 1];
        const description = prompt(`请详细描述"${issueType}"的具体情况：`);
        
        if (description && description.trim()) {
            showToast('提交成功', `您的问题反馈已提交，我们会尽快处理！`, 'success');
            
            // 模拟反馈奖励
            setTimeout(() => {
                updateContributionList('反馈问题', issueType, '+20 积分');
                updateStatValue('.stat-value', 2, 20); // 增加积分
            }, 1000);
        }
    } else if (selectedType !== null) {
        showToast('输入错误', '请输入有效的序号（1-8）', 'error');
    }
}

// 查看全部讨论
function viewAllDiscussions() {
    showToast('功能提示', '正在跳转到讨论区全部内容...', 'info');
    
    // 模拟页面跳转
    setTimeout(() => {
        showToast('功能提示', '讨论区详细页面正在开发中，敬请期待！', 'warning');
    }, 1500);
}

// 筛选事件
function filterEvents() {
    const filter = document.getElementById('eventFilter').value;
    const eventItems = document.querySelectorAll('.event-item');
    
    eventItems.forEach(item => {
        const status = item.dataset.status;
        if (filter === 'all' || status === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // 显示筛选结果提示
    const visibleCount = Array.from(eventItems).filter(item => item.style.display !== 'none').length;
    showToast('筛选完成', `找到 ${visibleCount} 个${getFilterLabel(filter)}活动`, 'info');
}

// 获取筛选标签
function getFilterLabel(filter) {
    const labels = {
        'all': '',
        'ongoing': '进行中的',
        'upcoming': '即将开始的',
        'ended': '已结束的'
    };
    return labels[filter] || '';
}

// 注册活动
function registerEvent(eventId) {
    const confirmed = confirm(`确认报名参加活动 ${eventId} 吗？\n\n报名成功后将获得参与积分奖励！`);
    
    if (confirmed) {
        showToast('报名成功', `您已成功报名活动 ${eventId}！`, 'success');
        
        // 更新按钮状态
        const button = document.querySelector(`button[onclick="registerEvent('${eventId}')"]`);
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> 已报名';
            button.disabled = true;
            button.style.background = 'rgba(59, 130, 246, 0.3)';
        }
        
        // 更新统计
        setTimeout(() => {
            updateStatValue('.stat-value', 3, 1); // 增加活动参与数
            updateContributionList('报名活动', eventId, '+5 积分');
        }, 1000);
    }
}

// 查看活动详情
function viewEventDetails(eventId) {
    showToast('功能提示', `正在加载活动 ${eventId} 的详细信息...`, 'info');
    
    // 模拟加载详情
    setTimeout(() => {
        showToast('功能提示', '活动详情页面正在开发中，敬请期待！', 'warning');
    }, 1500);
}

// 更新贡献数据
function updateContributionData(period) {
    const periodData = {
        week: {
            discussions: 12,
            likes: 8,
            points: 85,
            events: 2
        },
        month: {
            discussions: 45,
            likes: 32,
            points: 320,
            events: 8
        },
        year: {
            discussions: 156,
            likes: 89,
            points: 1234,
            events: 23
        }
    };
    
    const data = periodData[period] || periodData.week;
    
    // 更新统计数据
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        animateCountUp('.stat-value', [data.discussions, data.likes, data.points, data.events]);
    }
    
    showToast('数据更新', `已切换到${getPeriodLabel(period)}的贡献数据`, 'success');
}

// 获取时间周期标签
function getPeriodLabel(period) {
    const labels = {
        'week': '本周',
        'month': '本月',
        'year': '本年'
    };
    return labels[period] || '本周';
}

// 更新贡献列表
function updateContributionList(type, title, reward) {
    const contributionList = document.querySelector('.contribution-list');
    if (contributionList) {
        const newItem = document.createElement('div');
        newItem.className = 'contribution-item';
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateY(-10px)';
        
        const iconClass = getContributionIconClass(type);
        const now = new Date().toLocaleString('zh-CN');
        
        newItem.innerHTML = `
            <div class="contribution-icon ${iconClass}">
                <i class="${getContributionIcon(type)}"></i>
            </div>
            <div class="contribution-content">
                <div class="contribution-title">${type}：${title}</div>
                <div class="contribution-time">刚刚</div>
            </div>
            <div class="contribution-reward">${reward}</div>
        `;
        
        // 插入到列表顶部
        contributionList.insertBefore(newItem, contributionList.firstChild);
        
        // 动画显示
        setTimeout(() => {
            newItem.style.transition = 'all 0.3s ease';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, 100);
        
        // 限制列表长度
        const items = contributionList.querySelectorAll('.contribution-item');
        if (items.length > 6) {
            items[items.length - 1].remove();
        }
    }
}

// 获取贡献图标类
function getContributionIconClass(type) {
    const iconClasses = {
        '发起讨论': 'blue',
        '参与讨论': 'green',
        '获得点赞': 'blue',
        '帮助新用户': 'purple',
        '反馈问题': 'orange',
        '报名活动': 'green'
    };
    return iconClasses[type] || 'blue';
}

// 获取贡献图标
function getContributionIcon(type) {
    const icons = {
        '发起讨论': 'fas fa-pen',
        '参与讨论': 'fas fa-comment',
        '获得点赞': 'fas fa-thumbs-up',
        '帮助新用户': 'fas fa-hands-helping',
        '反馈问题': 'fas fa-bug',
        '报名活动': 'fas fa-calendar-plus'
    };
    return icons[type] || 'fas fa-star';
}

// 更新统计值
function updateStatValue(selector, index, increment) {
    const elements = document.querySelectorAll(selector);
    if (elements[index]) {
        const current = parseInt(elements[index].textContent.replace(/,/g, '')) || 0;
        const newValue = current + increment;
        
        // 动画更新
        let currentValue = current;
        const step = increment / 10;
        const timer = setInterval(() => {
            currentValue += step;
            if ((increment > 0 && currentValue >= newValue) || (increment < 0 && currentValue <= newValue)) {
                currentValue = newValue;
                clearInterval(timer);
            }
            elements[index].textContent = formatNumber(Math.floor(currentValue));
        }, 50);
    }
}

// 更新贡献图表
function updateContributionChart() {
    // 这里可以集成真实的图表库，如Chart.js
    const chartPlaceholder = document.querySelector('.chart-placeholder');
    if (chartPlaceholder) {
        // 模拟图表更新
        chartPlaceholder.style.opacity = '0.5';
        setTimeout(() => {
            chartPlaceholder.style.opacity = '1';
            showToast('图表更新', '贡献活跃度图表已更新', 'success');
        }, 1000);
    }
}

// 显示提示消息
function showToast(title, message, type = 'success') {
    const toastId = 'toast-' + Date.now();
    const toastColors = {
        success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981', icon: 'fa-check-circle' },
        error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', icon: 'fa-exclamation-circle' },
        warning: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', color: '#fbbf24', icon: 'fa-exclamation-triangle' },
        info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6', icon: 'fa-info-circle' }
    };
    
    const colors = toastColors[type] || toastColors.success;
    
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; z-index: 1000; background: ${colors.bg}; border: 1px solid ${colors.border}; border-radius: 12px; padding: 16px; color: ${colors.color}; display: flex; align-items: center; gap: 12px; backdrop-filter: blur(20px); max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            <i class="fas ${colors.icon}"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 14px; opacity: 0.9; line-height: 1.4;">${message}</div>
            </div>
            <button onclick="document.getElementById('${toastId}').remove()" style="background: none; border: none; color: ${colors.color}; cursor: pointer; opacity: 0.7; padding: 4px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            toastElement.remove();
        }
    }, 5000);
}

// 工具函数：格式化时间
function formatTime(date) {
    return new Intl.DateTimeFormat('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// 工具函数：获取随机元素
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
} 