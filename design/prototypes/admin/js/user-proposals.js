// 用户提案管理页面JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeProposalsPage();
});

function initializeProposalsPage() {
    initializeFilterTabs();
    initializeStatCards();
    initializeProposalActions();
    initializeSearchFunctionality();
    initializeSortFunctionality();
    initializeQuickFilters();
    
    // 启动统计数据动画
    animateStatValues();
    
    // 启动进度条动画
    animateProgressBars();
    
    // 初始化搜索清除按钮
    initializeSearchClear();
}

// 筛选标签功能
function initializeFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-btn');
    const proposalsList = document.getElementById('proposalsList');
    const myVotesSection = document.getElementById('myVotesSection');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活跃状态
            filterTabs.forEach(t => t.classList.remove('active'));
            // 添加当前活跃状态
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProposals(filter, proposalsList, myVotesSection);
            
            // 添加点击动画效果
            createRippleEffect(event, this);
        });
    });
}

function filterProposals(filter, proposalsList, myVotesSection) {
    const proposalItems = document.querySelectorAll('.proposal-item');
    const proposalsCard = proposalsList.closest('.admin-info-card');
    
    if (filter === 'my-votes') {
        // 显示投票历史，隐藏提案列表
        proposalsCard.style.display = 'none';
        myVotesSection.style.display = 'block';
        
        // 添加淡入动画
        myVotesSection.style.opacity = '0';
        myVotesSection.style.transform = 'translateY(20px)';
        setTimeout(() => {
            myVotesSection.style.transition = 'all 0.4s ease';
            myVotesSection.style.opacity = '1';
            myVotesSection.style.transform = 'translateY(0)';
        }, 100);
        
        // 更新投票历史的计数
        const voteHistoryCount = document.querySelectorAll('.vote-history-item').length;
        const myVotesCountBadge = myVotesSection.querySelector('.proposals-count-badge');
        if (myVotesCountBadge) {
            myVotesCountBadge.textContent = voteHistoryCount.toString();
        }
        return;
    } else {
        // 显示提案列表，隐藏投票历史
        proposalsCard.style.display = 'block';
        myVotesSection.style.display = 'none';
        
        // 添加提案列表淡入动画
        proposalsCard.style.opacity = '0';
        proposalsCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            proposalsCard.style.transition = 'all 0.4s ease';
            proposalsCard.style.opacity = '1';
            proposalsCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    let visibleCount = 0;
    proposalItems.forEach((item, index) => {
        const status = item.getAttribute('data-status');
        let shouldShow = false;
        
        switch (filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'voting':
                shouldShow = status === 'voting';
                break;
            case 'ended':
                shouldShow = status === 'ended';
                break;
        }
        
        if (shouldShow) {
            visibleCount++;
            item.style.display = 'block';
            // 添加淡入动画，错开时间
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 200 + index * 50);
        } else {
            item.style.display = 'none';
        }
    });
    
    updateProposalsCount(filter, visibleCount);
}

function updateProposalsCount(filter, count) {
    const countBadge = document.querySelector('.proposals-count-badge');
    const paginationInfo = document.querySelector('.pagination-info');
    
    if (countBadge) {
        countBadge.textContent = count.toString();
        // 添加更新动画
        countBadge.style.transform = 'scale(1.2)';
        setTimeout(() => {
            countBadge.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (paginationInfo) {
        const totalRecords = paginationInfo.querySelector('#totalRecords');
        if (totalRecords) {
            totalRecords.textContent = count.toString();
        }
    }
}

// 快速筛选功能
function initializeQuickFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            applyTypeFilter();
            addSelectAnimation(this);
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            applySortFilter();
            addSelectAnimation(this);
        });
    }
}

function applyTypeFilter() {
    const typeFilter = document.getElementById('typeFilter');
    const selectedType = typeFilter.value;
    const proposalItems = document.querySelectorAll('.proposal-item');
    
    let visibleCount = 0;
    proposalItems.forEach(item => {
        const typeElement = item.querySelector('.proposal-type');
        const itemType = typeElement ? typeElement.textContent.trim() : '';
        
        let shouldShow = false;
        
        if (selectedType === 'all') {
            shouldShow = true;
        } else {
            const typeMap = {
                'governance': '治理提案',
                'treasury': '资金提案',
                'technical': '技术提案'
            };
            shouldShow = itemType === typeMap[selectedType];
        }
        
        if (shouldShow) {
            visibleCount++;
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    updateProposalsCount('filtered', visibleCount);
}

function applySortFilter() {
    const sortFilter = document.getElementById('sortFilter');
    const selectedSort = sortFilter.value;
    const proposalsList = document.getElementById('proposalsList');
    const proposalItems = Array.from(proposalsList.children);
    
    proposalItems.sort((a, b) => {
        switch (selectedSort) {
            case 'time':
                // 按提案编号排序（假设编号越大越新）
                const idA = a.querySelector('.proposal-id').textContent.split('-')[1];
                const idB = b.querySelector('.proposal-id').textContent.split('-')[1];
                return parseInt(idB) - parseInt(idA);
                
            case 'participation':
                // 按参与人数排序
                const participationA = extractNumber(a.querySelector('.proposal-info span:nth-child(2)').textContent);
                const participationB = extractNumber(b.querySelector('.proposal-info span:nth-child(2)').textContent);
                return participationB - participationA;
                
            case 'support':
                // 按支持率排序
                const supportA = extractPercentage(a.querySelector('.voting-option.yes').textContent);
                const supportB = extractPercentage(b.querySelector('.voting-option.yes').textContent);
                return supportB - supportA;
                
            default:
                return 0;
        }
    });
    
    // 重新排列DOM元素
    proposalItems.forEach(item => {
        proposalsList.appendChild(item);
    });
    
    // 添加排序动画
    proposalItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

function extractNumber(text) {
    const match = text.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
}

function extractPercentage(text) {
    const match = text.match(/([\d.]+)%/);
    return match ? parseFloat(match[1]) : 0;
}

function addSelectAnimation(selectElement) {
    selectElement.style.transform = 'scale(1.05)';
    selectElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
    setTimeout(() => {
        selectElement.style.transform = 'scale(1)';
        selectElement.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
    }, 200);
}

// 搜索功能增强
function initializeSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchContainer = searchInput?.closest('.search-input-container');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // 搜索框焦点事件
        searchInput.addEventListener('focus', function() {
            searchContainer?.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', function() {
            searchContainer?.classList.remove('focused');
        });
    }
}

function initializeSearchClear() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    if (searchInput && clearBtn) {
        // 监听输入变化显示/隐藏清除按钮
        searchInput.addEventListener('input', function() {
            if (this.value.trim()) {
                clearBtn.style.display = 'block';
                clearBtn.style.opacity = '1';
            } else {
                clearBtn.style.display = 'none';
                clearBtn.style.opacity = '0';
            }
        });
        
        // 清除按钮点击事件
        clearBtn.addEventListener('click', function() {
            clearSearch();
        });
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        
        // 隐藏清除按钮
        if (clearBtn) {
            clearBtn.style.display = 'none';
            clearBtn.style.opacity = '0';
        }
        
        // 清除搜索结果
        performSearch();
        
        // 添加清除动画
        searchInput.style.transform = 'scale(1.02)';
        setTimeout(() => {
            searchInput.style.transform = 'scale(1)';
        }, 150);
    }
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const proposalItems = document.querySelectorAll('.proposal-item');
    
    let visibleCount = 0;
    proposalItems.forEach(item => {
        const title = item.querySelector('.proposal-title').textContent.toLowerCase();
        const description = item.querySelector('.proposal-description').textContent.toLowerCase();
        const id = item.querySelector('.proposal-id').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       id.includes(searchTerm);
        
        if (searchTerm === '' || matches) {
            visibleCount++;
            item.style.display = 'block';
            // 高亮搜索结果
            if (searchTerm !== '') {
                highlightSearchTerm(item, searchTerm);
            } else {
                removeHighlight(item);
            }
        } else {
            item.style.display = 'none';
            removeHighlight(item);
        }
    });
    
    updateProposalsCount('search', visibleCount);
}

function highlightSearchTerm(item, term) {
    const elements = item.querySelectorAll('.proposal-title, .proposal-description, .proposal-id');
    elements.forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
        const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        element.innerHTML = highlightedText;
    });
}

function removeHighlight(item) {
    const highlights = item.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 统计卡片动画
function initializeStatCards() {
    const statCards = document.querySelectorAll('.proposals-stat-card');
    
    statCards.forEach((card, index) => {
        // 添加悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 60px rgba(16, 185, 129, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.12)';
        });
        
        // 添加点击波纹效果
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

function animateStatValues() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(value => {
        const finalValue = value.textContent;
        const isPercentage = finalValue.includes('%');
        const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
        
        if (!isNaN(numericValue)) {
            let currentValue = 0;
            const increment = numericValue / 30; // 30帧动画
            const suffix = isPercentage ? '%' : '';
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                
                if (numericValue >= 1000) {
                    value.textContent = formatNumber(currentValue) + suffix;
                } else {
                    value.textContent = currentValue.toFixed(isPercentage ? 1 : 0) + suffix;
                }
            }, 50);
        }
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return Math.round(num).toString();
}

// 进度条动画
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = targetWidth;
        }, 500 + index * 200);
    });
}

// 提案操作功能
function initializeProposalActions() {
    const voteButtons = document.querySelectorAll('.vote-btn:not([disabled])');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleVoteAction(this);
        });
    });
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showProposalDetails(this);
        });
    });
}

function handleVoteAction(button) {
    const proposalItem = button.closest('.proposal-item');
    const proposalId = proposalItem.querySelector('.proposal-id').textContent;
    const voteType = button.classList.contains('vote-btn-yes') ? 'support' : 
                    button.classList.contains('vote-btn-no') ? 'oppose' : 'abstain';
    
    // 显示确认对话框
    showVoteConfirmation(proposalId, voteType, button);
}

function showVoteConfirmation(proposalId, voteType, button) {
    const voteText = voteType === 'support' ? '支持' : 
                    voteType === 'oppose' ? '反对' : '弃权';
    
    // 创建确认对话框
    const overlay = document.createElement('div');
    overlay.className = 'vote-confirmation-overlay';
    overlay.innerHTML = `
        <div class="vote-confirmation-modal">
            <div class="confirmation-header">
                <i class="fas fa-vote-yea"></i>
                <h3>确认投票</h3>
            </div>
            <div class="confirmation-content">
                <p>您确定要对 <strong>${proposalId}</strong> 投 <strong class="vote-type-${voteType}">${voteText}</strong> 票吗？</p>
                <p class="vote-weight">您的投票权重: <strong>1,234.56 SAP</strong></p>
            </div>
            <div class="confirmation-actions">
                <button class="admin-btn admin-btn-outline" onclick="closeVoteConfirmation()">取消</button>
                <button class="admin-btn admin-btn-primary" onclick="confirmVote('${proposalId}', '${voteType}', this)">确认投票</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // 添加样式
    addVoteConfirmationStyles();
    
    // 动画效果
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.querySelector('.vote-confirmation-modal').style.transform = 'scale(1)';
    }, 10);
    
    overlay.style.opacity = '0';
    overlay.querySelector('.vote-confirmation-modal').style.transform = 'scale(0.9)';
    overlay.querySelector('.vote-confirmation-modal').style.transition = 'transform 0.3s ease';
}

function addVoteConfirmationStyles() {
    if (document.querySelector('#vote-confirmation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'vote-confirmation-styles';
    style.textContent = `
        .vote-confirmation-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        }
        
        .vote-confirmation-modal {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 20px;
            padding: 32px;
            max-width: 480px;
            width: 90%;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(20px);
        }
        
        .confirmation-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
            color: #60a5fa;
        }
        
        .confirmation-header i {
            font-size: 24px;
        }
        
        .confirmation-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #f1f5f9;
        }
        
        .confirmation-content p {
            color: #cbd5e1;
            line-height: 1.6;
            margin-bottom: 16px;
        }
        
        .vote-weight {
            background: rgba(59, 130, 246, 0.1);
            padding: 12px;
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            font-size: 14px;
        }
        
        .vote-type-support { color: #34d399; }
        .vote-type-oppose { color: #f87171; }
        .vote-type-abstain { color: #94a3b8; }
        
        .confirmation-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
        }
    `;
    document.head.appendChild(style);
}

function closeVoteConfirmation() {
    const overlay = document.querySelector('.vote-confirmation-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('.vote-confirmation-modal').style.transform = 'scale(0.9)';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

function confirmVote(proposalId, voteType, button) {
    // 显示加载状态
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 投票中...';
    button.disabled = true;
    
    // 模拟投票请求
    setTimeout(() => {
        closeVoteConfirmation();
        showVoteSuccess(proposalId, voteType);
        updateProposalAfterVote(proposalId, voteType);
    }, 2000);
}

function showVoteSuccess(proposalId, voteType) {
    const voteText = voteType === 'support' ? '支持' : 
                    voteType === 'oppose' ? '反对' : '弃权';
    
    // 创建成功提示
    const toast = document.createElement('div');
    toast.className = 'vote-success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>投票成功！您对 ${proposalId} 投了 ${voteText} 票</span>
        </div>
    `;
    
    // 添加样式
    addToastStyles();
    
    document.body.appendChild(toast);
    
    // 动画显示
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4000);
}

function addToastStyles() {
    if (document.querySelector('#toast-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        .vote-success-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.95));
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .toast-content i {
            font-size: 18px;
        }
    `;
    document.head.appendChild(style);
}

function updateProposalAfterVote(proposalId, voteType) {
    const proposalItems = document.querySelectorAll('.proposal-item');
    
    proposalItems.forEach(item => {
        const idElement = item.querySelector('.proposal-id');
        if (idElement && idElement.textContent === proposalId) {
            const actionsContainer = item.querySelector('.proposal-actions');
            const voteText = voteType === 'support' ? '支持' : 
                           voteType === 'oppose' ? '反对' : '弃权';
            
            // 更新按钮状态
            actionsContainer.innerHTML = `
                <button class="vote-btn vote-btn-voted" disabled>
                    <i class="fas fa-check"></i>
                    已投票 (${voteText})
                </button>
                <button class="admin-btn admin-btn-outline admin-btn-sm view-details-btn">
                    <i class="fas fa-eye"></i>
                    详情
                </button>
            `;
            
            // 重新绑定详情按钮事件
            const newDetailsBtn = actionsContainer.querySelector('.view-details-btn');
            newDetailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showProposalDetails(this);
            });
        }
    });
}

function showProposalDetails(button) {
    const proposalItem = button.closest('.proposal-item');
    const proposalId = proposalItem.querySelector('.proposal-id').textContent;
    const proposalTitle = proposalItem.querySelector('.proposal-title').textContent;
    
    // 创建详情模态框
    const overlay = document.createElement('div');
    overlay.className = 'proposal-details-overlay';
    overlay.innerHTML = `
        <div class="proposal-details-modal">
            <div class="modal-header">
                <h3>${proposalTitle}</h3>
                <button class="close-btn" onclick="closeProposalDetails()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                <div class="proposal-detail-section">
                    <h4><i class="fas fa-info-circle"></i> 提案信息</h4>
                    <p><strong>提案编号:</strong> ${proposalId}</p>
                    <p><strong>发起人:</strong> 0x1234...5678</p>
                    <p><strong>发起时间:</strong> 2024-01-10 14:30</p>
                    <p><strong>投票截止:</strong> 2024-01-15 18:00</p>
                </div>
                
                <div class="proposal-detail-section">
                    <h4><i class="fas fa-file-alt"></i> 详细说明</h4>
                    <p>这是一个关于调整平台交易手续费率的重要提案。通过将当前0.3%的手续费率降低至0.25%，我们预期能够...</p>
                </div>
                
                <div class="proposal-detail-section">
                    <h4><i class="fas fa-chart-bar"></i> 投票统计</h4>
                    <div class="vote-stats-grid">
                        <div class="vote-stat-item">
                            <div class="vote-stat-value">72.3%</div>
                            <div class="vote-stat-label">支持率</div>
                        </div>
                        <div class="vote-stat-item">
                            <div class="vote-stat-value">1,234</div>
                            <div class="vote-stat-label">参与人数</div>
                        </div>
                        <div class="vote-stat-item">
                            <div class="vote-stat-value">45,678</div>
                            <div class="vote-stat-label">投票权重</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    addProposalDetailsStyles();
    
    // 动画效果
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.querySelector('.proposal-details-modal').style.transform = 'scale(1)';
    }, 10);
}

function closeProposalDetails() {
    const overlay = document.querySelector('.proposal-details-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('.proposal-details-modal').style.transform = 'scale(0.9)';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

function addProposalDetailsStyles() {
    if (document.querySelector('#proposal-details-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'proposal-details-styles';
    style.textContent = `
        .proposal-details-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .proposal-details-modal {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 20px;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(20px);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 32px;
            border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .modal-header h3 {
            margin: 0;
            color: #f1f5f9;
            font-size: 20px;
            font-weight: 700;
        }
        
        .close-btn {
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 20px;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .close-btn:hover {
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
        }
        
        .modal-content {
            padding: 32px;
        }
        
        .proposal-detail-section {
            margin-bottom: 32px;
        }
        
        .proposal-detail-section h4 {
            color: #60a5fa;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .proposal-detail-section p {
            color: #cbd5e1;
            line-height: 1.6;
            margin-bottom: 12px;
        }
        
        .vote-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
        }
        
        .vote-stat-item {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        
        .vote-stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #60a5fa;
            margin-bottom: 8px;
        }
        
        .vote-stat-label {
            font-size: 12px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    `;
    document.head.appendChild(style);
}

// 排序功能
function initializeSortFunctionality() {
    // 排序功能已集成到快速筛选中
}

// 分页功能
function changePage(direction) {
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (!currentPageElement || !totalPagesElement) return;
    
    const currentPage = parseInt(currentPageElement.textContent);
    const totalPages = parseInt(totalPagesElement.textContent);
    
    let newPage = currentPage + direction;
    
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    
    if (newPage !== currentPage) {
        currentPageElement.textContent = newPage;
        
        // 更新按钮状态
        prevBtn.disabled = newPage === 1;
        nextBtn.disabled = newPage === totalPages;
        
        // 添加页面切换动画
        const proposalsList = document.getElementById('proposalsList');
        proposalsList.style.opacity = '0.5';
        proposalsList.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            proposalsList.style.transition = 'all 0.3s ease';
            proposalsList.style.opacity = '1';
            proposalsList.style.transform = 'translateY(0)';
        }, 150);
    }
}

// 导出和刷新功能
function exportProposals() {
    showToast('导出功能开发中...', 'info');
}

function refreshProposals() {
    // 添加刷新动画
    const refreshBtn = event.target.closest('.admin-btn');
    const icon = refreshBtn.querySelector('i');
    
    icon.style.animation = 'fa-spin 1s linear infinite';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        icon.style.animation = '';
        refreshBtn.disabled = false;
        showToast('数据已刷新', 'success');
        
        // 重新初始化进度条动画
        animateProgressBars();
    }, 1500);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `vote-success-toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 动画显示
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

// 工具函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // 添加动画样式
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 搜索高亮样式
const searchHighlightStyle = document.createElement('style');
searchHighlightStyle.textContent = `
    .search-highlight {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2));
        color: #60a5fa;
        padding: 2px 4px;
        border-radius: 4px;
        font-weight: 600;
        box-shadow: 0 1px 3px rgba(59, 130, 246, 0.2);
    }
`;
document.head.appendChild(searchHighlightStyle);

// 全局函数（供HTML调用）
window.vote = function(button, voteType, proposalId) {
    handleVoteAction(button);
};

window.clearSearch = clearSearch;
window.closeVoteConfirmation = closeVoteConfirmation;
window.confirmVote = confirmVote;
window.closeProposalDetails = closeProposalDetails;
window.changePage = changePage;
window.exportProposals = exportProposals;
window.refreshProposals = refreshProposals;
window.applyTypeFilter = applyTypeFilter;
window.applySortFilter = applySortFilter; 