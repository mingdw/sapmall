// 提案管理通用JavaScript功能

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProposalsPage();
});

// 初始化提案页面
function initializeProposalsPage() {
    // 筛选标签切换
    initializeFilterTabs();
    
    // 搜索功能
    initializeSearch();
    
    // 投票按钮事件
    initializeVoteButtons();
    
    // 卡片悬停效果
    initializeCardHoverEffects();
}

// 初始化筛选标签
function initializeFilterTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除其他标签的active状态
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            // 添加当前标签的active状态
            this.classList.add('active');
            
            // 根据筛选条件显示/隐藏内容
            const filter = this.dataset.filter;
            filterProposals(filter);
        });
    });
}

// 初始化搜索功能
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProposals();
            }
        });
    }
}

// 初始化投票按钮
function initializeVoteButtons() {
    document.querySelectorAll('.vote-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            
            const proposalItem = this.closest('.proposal-item');
            const proposalTitle = proposalItem.querySelector('.proposal-title').textContent;
            const voteType = this.classList.contains('vote-btn-yes') ? '支持' : 
                           this.classList.contains('vote-btn-no') ? '反对' : '弃权';
            
            // 获取提案ID
            const proposalId = proposalItem.querySelector('.proposal-id').textContent.split('#')[1];
            
            // 调用投票函数
            vote(this, voteType.toLowerCase() === '支持' ? 'yes' : voteType.toLowerCase() === '反对' ? 'no' : 'abstain', proposalId);
        });
    });
}

// 初始化卡片悬停效果
function initializeCardHoverEffects() {
    document.querySelectorAll('.proposal-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// 筛选提案
function filterProposals(filter) {
    const proposalsList = document.getElementById('proposalsList');
    const myVotesSection = document.getElementById('myVotesSection');
    const myProposalsSection = document.getElementById('myProposalsSection');
    
    // 隐藏所有区域
    if (proposalsList) proposalsList.style.display = 'none';
    if (myVotesSection) myVotesSection.style.display = 'none';
    if (myProposalsSection) myProposalsSection.style.display = 'none';
    
    if (filter === 'my-votes' && myVotesSection) {
        myVotesSection.style.display = 'block';
    } else if (filter === 'my-proposals' && myProposalsSection) {
        myProposalsSection.style.display = 'block';
    } else if (proposalsList) {
        proposalsList.style.display = 'block';
        
        // 筛选提案项目
        const proposalItems = document.querySelectorAll('.proposal-item');
        proposalItems.forEach(item => {
            const status = item.dataset.status;
            if (filter === 'all') {
                item.style.display = 'block';
            } else if (filter === 'voting' && status === 'voting') {
                item.style.display = 'block';
            } else if (filter === 'ended' && status === 'ended') {
                item.style.display = 'block';
            } else if (filter === 'pending' && status === 'pending') {
                item.style.display = 'block';
            } else if (filter === 'active' && status === 'active') {
                item.style.display = 'block';
            } else if (filter === 'system' && status === 'system') {
                item.style.display = 'block';
            } else if (filter === 'emergency' && status === 'emergency') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// 搜索提案
function searchProposals() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const proposalItems = document.querySelectorAll('.proposal-item');
    
    proposalItems.forEach(item => {
        const title = item.querySelector('.proposal-title').textContent.toLowerCase();
        const description = item.querySelector('.proposal-description').textContent.toLowerCase();
        const id = item.querySelector('.proposal-id').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || id.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 投票功能
function vote(button, choice, proposalId) {
    const proposalItem = button.closest('.proposal-item');
    const proposalTitle = proposalItem.querySelector('.proposal-title').textContent;
    const choiceText = choice === 'yes' ? '支持' : choice === 'no' ? '反对' : '弃权';
    
    // 获取用户投票权重（模拟）
    const votingWeight = getUserVotingWeight();
    
    if (confirm(`确认对提案"${proposalTitle}"投${choiceText}票吗？\n\n您的投票权重: ${votingWeight} SAP`)) {
        // 模拟投票成功
        const actionButtons = proposalItem.querySelector('.proposal-actions');
        actionButtons.innerHTML = `
            <button class="vote-btn vote-btn-voted" disabled>
                <i class="fas fa-check"></i>
                已投票 (${choiceText})
            </button>
            <a href="#" class="view-details-btn">
                <i class="fas fa-eye"></i>
                详情
            </a>
        `;
        
        // 更新投票进度（模拟）
        updateVotingProgress(proposalItem, choice);
        
        // 显示成功提示
        showToast('投票成功', `您已成功对提案 ${proposalId} 投${choiceText}票`);
        
        // 更新统计数据
        updateStats();
    }
}

// 获取用户投票权重
function getUserVotingWeight() {
    // 模拟不同角色的投票权重
    const currentRole = getCurrentUserRole();
    switch (currentRole) {
        case 'admin':
            return '5,000.00';
        case 'merchant':
            return '2,456.78';
        case 'user':
        default:
            return '1,234.56';
    }
}

// 获取当前用户角色
function getCurrentUserRole() {
    return localStorage.getItem('currentRole') || 'user';
}

// 更新投票进度
function updateVotingProgress(proposalItem, choice) {
    const progressFill = proposalItem.querySelector('.progress-fill');
    const votingOptions = proposalItem.querySelectorAll('.voting-option');
    
    if (!progressFill || !votingOptions.length) return;
    
    // 简单的模拟逻辑
    if (choice === 'yes') {
        const currentPercentage = parseFloat(progressFill.style.width) || 50;
        const newPercentage = Math.min(currentPercentage + 0.5, 95);
        progressFill.style.width = newPercentage + '%';
        
        if (votingOptions[0]) {
            votingOptions[0].textContent = `支持 ${newPercentage.toFixed(1)}%`;
        }
        if (votingOptions[1]) {
            votingOptions[1].textContent = `反对 ${(100 - newPercentage).toFixed(1)}%`;
        }
    }
}

// 更新统计数据
function updateStats() {
    const statCards = document.querySelectorAll('.stat-card .stat-value');
    if (statCards.length >= 3) {
        const myParticipated = parseInt(statCards[2].textContent) + 1;
        const totalProposals = parseInt(statCards[0].textContent);
        const participationRate = ((myParticipated / totalProposals) * 100).toFixed(1);
        
        statCards[2].textContent = myParticipated;
        if (statCards[3]) {
            statCards[3].textContent = participationRate + '%';
        }
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

// 排序菜单切换
function toggleSortMenu() {
    showToast('功能提示', '排序功能正在开发中，敬请期待！', 'info');
}

// 导航到提案管理页面（根据角色）
function navigateToProposals() {
    const currentRole = getCurrentUserRole();
    
    let targetPage = '';
    switch (currentRole) {
        case 'admin':
            targetPage = 'admin-proposals.html';
            break;
        case 'merchant':
            targetPage = 'merchant-proposals.html';
            break;
        case 'user':
        default:
            targetPage = 'user-proposals.html';
            break;
    }
    
    window.location.href = targetPage;
}

// 工具函数：格式化数字
function formatNumber(num) {
    return new Intl.NumberFormat('zh-CN').format(num);
}

// 工具函数：格式化日期
function formatDate(date) {
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// 工具函数：计算时间差
function getTimeRemaining(endDate) {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;
    
    if (diff <= 0) {
        return '已结束';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        return `剩余 ${days}天 ${hours}小时`;
    } else {
        return `剩余 ${hours}小时`;
    }
} 