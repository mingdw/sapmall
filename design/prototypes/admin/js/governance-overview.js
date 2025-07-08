// 治理概览页面专用JavaScript

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeGovernanceOverview();
});

// 初始化治理概览页面
function initializeGovernanceOverview() {
    console.log('初始化治理概览页面...');
    
    // 初始化统计数据动画
    initializeStatsAnimation();
    
    // 初始化提案交互
    initializeProposalInteractions();
    
    // 初始化快速操作
    initializeQuickActions();
    
    console.log('治理概览页面初始化完成');
}

// 初始化统计数据动画
function initializeStatsAnimation() {
    // 为统计卡片添加入场动画
    const statCards = document.querySelectorAll('.orders-stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // 添加数值动画效果
    animateStatValues();
}

// 数值动画效果
function animateStatValues() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(valueElement => {
        const finalValue = valueElement.textContent;
        const isPercentage = finalValue.includes('%');
        const isCurrency = finalValue.includes('SAP');
        const isLargeNumber = finalValue.includes('M') || finalValue.includes('K');
        
        // 提取数字
        let numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
        
        if (isNaN(numericValue)) return;
        
        // 动画计数
        let currentValue = 0;
        const increment = numericValue / 30; // 30帧动画
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            // 格式化显示
            let displayValue = currentValue.toFixed(isPercentage || isCurrency ? 1 : 0);
            
            if (isPercentage) {
                valueElement.textContent = displayValue + '%';
            } else if (isCurrency) {
                valueElement.textContent = displayValue + ' SAP';
            } else if (isLargeNumber) {
                if (finalValue.includes('M')) {
                    valueElement.textContent = (currentValue / 1000).toFixed(1) + 'M';
                } else if (finalValue.includes('K')) {
                    valueElement.textContent = (currentValue / 1000).toFixed(0) + 'K';
                }
            } else {
                valueElement.textContent = Math.floor(currentValue);
            }
        }, 50);
    });
}

// 初始化提案交互
function initializeProposalInteractions() {
    // 为提案卡片添加点击展开功能
    const proposalItems = document.querySelectorAll('.proposal-item');
    
    proposalItems.forEach(item => {
        // 添加展开/收起功能
        const description = item.querySelector('.proposal-description');
        if (description && description.textContent.length > 100) {
            const fullText = description.textContent;
            const shortText = fullText.substring(0, 100) + '...';
            
            description.textContent = shortText;
            description.style.cursor = 'pointer';
            description.title = '点击查看完整描述';
            
            let isExpanded = false;
            description.addEventListener('click', function() {
                if (isExpanded) {
                    this.textContent = shortText;
                    this.title = '点击查看完整描述';
                } else {
                    this.textContent = fullText;
                    this.title = '点击收起描述';
                }
                isExpanded = !isExpanded;
            });
        }
        
        // 添加悬停效果增强
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// 初始化快速操作
function initializeQuickActions() {
    // 为快速操作卡片添加涟漪效果
    const actionItems = document.querySelectorAll('.action-item');
    
    actionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 创建涟漪效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(59, 130, 246, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加涟漪动画CSS
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 导航功能
function navigateToVoting() {
    showToast('正在跳转到投票中心...', 'info');
    // 这里可以添加实际的页面跳转逻辑
    setTimeout(() => {
        window.parent.postMessage({
            type: 'navigate',
            page: 'voting'
        }, '*');
    }, 500);
}

function navigateToCreateProposal() {
    showToast('正在跳转到创建提案页面...', 'info');
    setTimeout(() => {
        window.parent.postMessage({
            type: 'navigate',
            page: 'create-proposal'
        }, '*');
    }, 500);
}

function navigateToCommunity() {
    showToast('正在跳转到社区页面...', 'info');
    setTimeout(() => {
        window.parent.postMessage({
            type: 'navigate',
            page: 'community'
        }, '*');
    }, 500);
}

function navigateToLearning() {
    showToast('正在跳转到学习中心...', 'info');
    setTimeout(() => {
        window.parent.postMessage({
            type: 'navigate',
            page: 'learning'
        }, '*');
    }, 500);
}

// 提案相关功能增强
function voteOnProposal(proposalId, choice) {
    const choiceText = choice === 'yes' ? '支持' : choice === 'no' ? '反对' : '弃权';
    
    if (confirm(`确认对提案 ${proposalId} 投${choiceText}票吗？`)) {
        // 模拟投票过程
        showToast('正在提交投票...', 'info');
        
        setTimeout(() => {
            // 更新UI
            const proposalItem = document.querySelector(`[data-proposal-id="${proposalId}"]`);
            if (proposalItem) {
                const actionButtons = proposalItem.querySelector('.proposal-actions');
                actionButtons.innerHTML = `
                    <button class="vote-btn vote-btn-voted" disabled>
                        <i class="fas fa-check"></i>
                        已投票 (${choiceText})
                    </button>
                `;
            }
            
            showToast(`投票成功！您已对提案 ${proposalId} 投${choiceText}票`, 'success');
            
            // 更新统计数据
            updateGovernanceStats();
        }, 1000);
    }
}

// 更新治理统计数据
function updateGovernanceStats() {
    // 模拟更新参与率
    const participationRate = document.querySelector('.governance-stat-card .stat-value');
    if (participationRate && participationRate.textContent.includes('%')) {
        const currentRate = parseFloat(participationRate.textContent);
        const newRate = Math.min(currentRate + 0.1, 100);
        participationRate.textContent = newRate.toFixed(1) + '%';
    }
    
    // 更新治理积分
    const governancePoints = document.querySelectorAll('.governance-stat-card .stat-value');
    const pointsElement = Array.from(governancePoints).find(el => 
        !el.textContent.includes('%') && 
        !el.textContent.includes('SAP') && 
        parseInt(el.textContent) < 1000
    );
    
    if (pointsElement) {
        const currentPoints = parseInt(pointsElement.textContent);
        const newPoints = currentPoints + Math.floor(Math.random() * 5) + 1;
        pointsElement.textContent = newPoints;
        
        // 添加变化动画
        pointsElement.style.transform = 'scale(1.1)';
        pointsElement.style.color = '#10b981';
        setTimeout(() => {
            pointsElement.style.transform = 'scale(1)';
            pointsElement.style.color = '';
        }, 300);
    }
}

// Toast通知功能
function showToast(message, type = 'info') {
    // 移除现有的toast
    const existingToast = document.querySelector('.governance-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = `governance-toast toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
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

// 数据刷新功能
function refreshGovernanceData() {
    showToast('正在刷新治理数据...', 'info');
    
    // 模拟数据刷新
    setTimeout(() => {
        // 重新初始化统计动画
        initializeStatsAnimation();
        showToast('治理数据已刷新', 'success');
    }, 1000);
}

// 导出功能
function exportGovernanceData() {
    showToast('正在导出治理数据...', 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        showToast('治理数据导出完成', 'success');
    }, 2000);
}

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面重新可见时，刷新数据
        refreshGovernanceData();
    }
});

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl+R 刷新数据
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshGovernanceData();
    }
    
    // Ctrl+E 导出数据
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportGovernanceData();
    }
}); 