/* 流动性质押管理页面脚本 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initHistoryFilters();
    initPoolActions();
    initRewardActions();
    initPaginationHandlers();
    initHistoryDetailButtons();
    initPoolCardEnhancements();
});

// 初始化流动性池卡片增强效果
function initPoolCardEnhancements() {
    // 为领取收益按钮添加特殊样式标识
    const claimButtons = document.querySelectorAll('.pool-actions .admin-btn-primary');
    claimButtons.forEach(btn => {
        if (btn.textContent.includes('领取收益')) {
            btn.classList.add('claim-reward-btn');
            
            // 添加脉冲动画效果（如果有可领取收益）
            const poolCard = btn.closest('.pool-card');
            const rewardAmount = poolCard.querySelector('.text-green')?.textContent;
            if (rewardAmount && !rewardAmount.includes('0') && !rewardAmount.includes('-')) {
                btn.classList.add('has-rewards');
                addPulseEffect(btn);
            }
        }
    });
    
    // 为进度条添加动画效果
    animateProgressBars();
    
    // 为代币图标添加旋转效果
    initTokenIconEffects();
}

// 添加脉冲效果
function addPulseEffect(button) {
    const pulseInterval = setInterval(() => {
        if (button.disabled || !button.classList.contains('has-rewards')) {
            clearInterval(pulseInterval);
            return;
        }
        
        button.style.animation = 'pulse-glow 2s ease-in-out';
        setTimeout(() => {
            button.style.animation = '';
        }, 2000);
    }, 4000);
}

// 动画化进度条
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 300 + index * 200);
    });
}

// 初始化代币图标效果
function initTokenIconEffects() {
    const tokenIcons = document.querySelectorAll('.token-icon');
    
    tokenIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// 初始化历史记录过滤功能
function initHistoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const historyItems = document.querySelectorAll('.history-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的活动状态
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的活动状态
            this.classList.add('active');
            
            const filterType = this.dataset.filter;
            
            // 显示或隐藏历史项
            historyItems.forEach(item => {
                if (filterType === 'all' || item.dataset.type === filterType) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // 导出记录按钮
    const exportBtn = document.querySelector('.history-actions .admin-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showToast('导出功能正在开发中', 'info');
        });
    }
}

// 初始化流动性池操作
function initPoolActions() {
    // 添加流动性按钮
    const addLiquidityBtns = document.querySelectorAll('.pool-actions .admin-btn-primary');
    addLiquidityBtns.forEach(btn => {
        if (btn.textContent.includes('添加流动性')) {
            btn.addEventListener('click', function() {
                const poolCard = this.closest('.pool-card');
                const poolName = poolCard.querySelector('.pool-name').textContent;
                
                // 添加加载效果
                addButtonLoadingEffect(this);
                
                setTimeout(() => {
                    removeButtonLoadingEffect(this);
                    showToast(`准备添加 ${poolName} 流动性`, 'info');
                }, 1500);
            });
        }
    });
    
    // 移除流动性按钮
    const removeLiquidityBtns = document.querySelectorAll('.pool-actions .admin-btn-danger');
    removeLiquidityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const poolCard = this.closest('.pool-card');
            const poolName = poolCard.querySelector('.pool-name').textContent;
            
            // 添加加载效果
            addButtonLoadingEffect(this);
            
            setTimeout(() => {
                removeButtonLoadingEffect(this);
                showToast(`准备移除 ${poolName} 流动性`, 'warning');
            }, 1500);
        });
    });
    
    // 领取收益按钮
    const claimRewardBtns = document.querySelectorAll('.pool-actions .admin-btn-warning');
    claimRewardBtns.forEach(btn => {
        if (btn.textContent.includes('领取收益')) {
            btn.addEventListener('click', function() {
                if (this.disabled) return;
                
                const poolCard = this.closest('.pool-card');
                const poolName = poolCard.querySelector('.pool-name').textContent;
                const rewardAmount = poolCard.querySelector('.text-green').textContent;
                
                // 添加特殊的领取效果
                addClaimRewardEffect(this);
                
                claimPoolReward(poolName, rewardAmount);
            });
        }
    });
    
    // 流动性池卡片点击事件
    const poolCards = document.querySelectorAll('.pool-card');
    poolCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的是按钮，不触发卡片点击事件
            if (e.target.closest('.pool-actions')) return;
            
            const poolName = this.querySelector('.pool-name').textContent;
            const apy = this.querySelector('.apy-value').textContent;
            const tvl = this.querySelector('.pool-stat .stat-value').textContent;
            
            // 添加卡片点击效果
            this.style.transform = 'translateY(-6px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'translateY(-4px) scale(1)';
            }, 150);
            
            showToast(`${poolName} 流动性池详情：APY ${apy}，总锁定价值 ${tvl}`);
        });
    });
}

// 添加按钮加载效果
function addButtonLoadingEffect(button) {
    const originalText = button.innerHTML;
    button.dataset.originalText = originalText;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
    button.disabled = true;
    button.style.opacity = '0.8';
}

// 移除按钮加载效果
function removeButtonLoadingEffect(button) {
    button.innerHTML = button.dataset.originalText;
    button.disabled = false;
    button.style.opacity = '1';
}

// 添加领取收益特殊效果
function addClaimRewardEffect(button) {
    const originalText = button.innerHTML;
    button.dataset.originalText = originalText;
    
    // 第一阶段：处理中
    button.innerHTML = '<i class="fas fa-cog fa-spin"></i> 处理中...';
    button.disabled = true;
    button.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    
    setTimeout(() => {
        // 第二阶段：确认中
        button.innerHTML = '<i class="fas fa-check-circle fa-pulse"></i> 确认中...';
        button.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
        
        setTimeout(() => {
            // 第三阶段：完成
            button.innerHTML = '<i class="fas fa-check-double"></i> 已领取';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                // 恢复原状
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 1000);
        }, 1000);
    }, 1000);
}

// 初始化奖励操作
function initRewardActions() {
    // 全部领取按钮
    const claimAllBtn = document.querySelector('.claim-all-btn');
    if (claimAllBtn) {
        claimAllBtn.addEventListener('click', function() {
            const totalRewards = document.querySelector('.rewards-amount').textContent;
            showConfirmModal(`确定要领取全部收益：${totalRewards} 吗？`, function() {
                addButtonLoadingEffect(claimAllBtn);
                setTimeout(() => {
                    removeButtonLoadingEffect(claimAllBtn);
                    claimAllRewards();
                }, 2000);
            });
        });
    }
}

// 初始化分页处理器
function initPaginationHandlers() {
    // 分页数字按钮
    const paginationPages = document.querySelectorAll('.pagination-page');
    
    paginationPages.forEach(page => {
        page.addEventListener('click', function() {
            // 移除所有活动状态
            paginationPages.forEach(p => p.classList.remove('active'));
            
            // 添加当前页面的活动状态
            this.classList.add('active');
            
            const pageNumber = this.textContent;
            showToast(`切换到第 ${pageNumber} 页`, 'info');
            
            // 模拟加载新数据
            loadHistoryPage(pageNumber);
        });
    });
    
    // 前一页/后一页按钮
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    if (nextBtn && !nextBtn.disabled) {
        nextBtn.addEventListener('click', function() {
            const currentActive = document.querySelector('.pagination-page.active');
            const nextPage = currentActive.nextElementSibling;
            
            if (nextPage && nextPage.classList.contains('pagination-page')) {
                currentActive.classList.remove('active');
                nextPage.classList.add('active');
                loadHistoryPage(nextPage.textContent);
                updatePaginationButtons();
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const currentActive = document.querySelector('.pagination-page.active');
            const prevPage = currentActive.previousElementSibling;
            
            if (prevPage && prevPage.classList.contains('pagination-page')) {
                currentActive.classList.remove('active');
                prevPage.classList.add('active');
                loadHistoryPage(prevPage.textContent);
                updatePaginationButtons();
            }
        });
    }
}

// 初始化历史详情按钮
function initHistoryDetailButtons() {
    const detailBtns = document.querySelectorAll('.history-detail-btn');
    
    detailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const historyItem = this.closest('.history-item');
            const title = historyItem.querySelector('.history-title').textContent;
            const amount = historyItem.querySelector('.history-amount').textContent;
            const pool = historyItem.querySelector('.history-pool').textContent;
            const time = historyItem.querySelector('.history-time').textContent;
            
            showToast(`${title} 详情：${amount}，${pool}，${time}`, 'info');
        });
    });
}

// 更新分页按钮状态
function updatePaginationButtons() {
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    const currentActive = document.querySelector('.pagination-page.active');
    const allPages = document.querySelectorAll('.pagination-page');
    
    // 更新前一页按钮
    if (currentActive === allPages[0]) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.5';
    } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
    }
    
    // 更新后一页按钮
    if (currentActive === allPages[allPages.length - 1]) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
    } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    }
}

// 模拟加载历史页面数据
function loadHistoryPage(pageNumber) {
    console.log(`Loading history page ${pageNumber}`);
    
    // 模拟加载延迟
    const historyList = document.querySelector('.history-list');
    historyList.style.opacity = '0.6';
    
    setTimeout(() => {
        historyList.style.opacity = '1';
        showToast(`第 ${pageNumber} 页数据加载完成`, 'success');
    }, 500);
}

// 领取流动性池收益
function claimPoolReward(poolName, rewardAmount) {
    showToast('正在处理收益领取...', 'info');
    
    setTimeout(() => {
        // 模拟更新收益数据
        const poolCard = Array.from(document.querySelectorAll('.pool-card'))
            .find(card => card.querySelector('.pool-name').textContent === poolName);
        
        if (poolCard) {
            const rewardElement = poolCard.querySelector('.text-green');
            rewardElement.textContent = '0 SAP';
            
            // 禁用领取按钮并更新样式
            const claimBtn = Array.from(poolCard.querySelectorAll('.admin-btn-primary'))
                .find(btn => btn.textContent.includes('领取收益') || btn.textContent.includes('已领取'));
            if (claimBtn) {
                claimBtn.disabled = true;
                claimBtn.classList.remove('has-rewards');
                claimBtn.innerHTML = '<i class="fas fa-check"></i> 已领取';
                claimBtn.style.background = 'rgba(51, 65, 85, 0.3)';
                claimBtn.style.color = '#64748b';
            }
        }
        
        // 更新总收益
        updateRewardData();
        
        showToast(`成功领取 ${poolName} 收益：${rewardAmount}`, 'success');
    }, 3000);
}

// 领取全部奖励
function claimAllRewards() {
    showToast('正在处理全部奖励领取...', 'info');
    
    setTimeout(() => {
        // 更新奖励金额为0
        document.querySelector('.rewards-amount').textContent = '0.0 SAP';
        
        // 更新各项奖励为0
        document.querySelectorAll('.breakdown-amount').forEach(el => {
            el.textContent = '0.0 SAP';
        });
        
        // 更新待领取收益统计
        const pendingRewardStat = Array.from(document.querySelectorAll('.stat-card'))
            .find(card => card.querySelector('.stat-label').textContent === '待领取收益');
        if (pendingRewardStat) {
            pendingRewardStat.querySelector('.stat-value').textContent = '0.0 SAP';
        }
        
        // 禁用所有领取按钮
        document.querySelectorAll('.claim-reward-btn').forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('has-rewards');
            btn.innerHTML = '<i class="fas fa-check"></i> 已领取';
            btn.style.background = 'rgba(51, 65, 85, 0.3)';
            btn.style.color = '#64748b';
        });
        
        showToast('全部奖励领取成功！', 'success');
    }, 2000);
}

// 更新奖励数据
function updateRewardData() {
    // 计算剩余待领取收益
    const breakdownAmounts = document.querySelectorAll('.breakdown-amount');
    let totalRewards = 0;
    
    breakdownAmounts.forEach(el => {
        const amount = parseFloat(el.textContent.replace(' SAP', ''));
        if (!isNaN(amount)) {
            totalRewards += amount;
        }
    });
    
    // 更新总收益显示
    document.querySelector('.rewards-amount').textContent = totalRewards.toFixed(1) + ' SAP';
    
    // 更新统计卡片中的待领取收益
    const pendingRewardStat = Array.from(document.querySelectorAll('.stat-card'))
        .find(card => card.querySelector('.stat-label').textContent === '待领取收益');
    if (pendingRewardStat) {
        pendingRewardStat.querySelector('.stat-value').textContent = totalRewards.toFixed(1) + ' SAP';
    }
}

// 显示确认模态框
function showConfirmModal(message, confirmCallback) {
    if (confirm(message)) {
        confirmCallback();
    }
}

// 显示提示消息
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
        setTimeout(() => document.body.removeChild(toast), 300);
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