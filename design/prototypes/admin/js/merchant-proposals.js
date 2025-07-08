// 商家提案管理专用JavaScript功能

// 页面状态管理
let currentPage = 1;
let totalPages = 4;
let itemsPerPage = 10;
let totalItems = 31;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeMerchantProposalsPage();
    updatePaginationInfo();
    initializeTabFilters();
});

// 初始化商家提案页面
function initializeMerchantProposalsPage() {
    // 初始化基础功能
    initializeProposalsPage();
    
    // 初始化商家专属功能
    initializeMerchantFeatures();
}

// 初始化商家专属功能
function initializeMerchantFeatures() {
    // 商家操作卡片点击事件
    initializeMerchantActionCards();
    
    // 我的提案管理
    initializeMyProposalsManagement();
    
    // 初始化表单验证
    initializeFormValidation();
}

// 初始化商家操作卡片
function initializeMerchantActionCards() {
    // 创建提案卡片
    const createCard = document.querySelector('.action-card[onclick*="createProposal"]');
    if (createCard) {
        createCard.addEventListener('click', createNewProposal);
    }
    
    // 管理提案卡片
    const manageCard = document.querySelector('.action-card[onclick*="manageProposals"]');
    if (manageCard) {
        manageCard.addEventListener('click', manageProposals);
    }
    
    // 治理影响力卡片
    const trackCard = document.querySelector('.action-card[onclick*="trackProgress"]');
    if (trackCard) {
        trackCard.addEventListener('click', trackProgress);
    }
}

// 初始化我的提案管理
function initializeMyProposalsManagement() {
    // 撤回提案按钮
    document.querySelectorAll('.withdraw-proposal-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('onclick').match(/withdrawProposal\('(.+?)'\)/)[1];
            withdrawProposal(proposalId);
        });
    });
}

// 创建新提案（更新版本）
function createNewProposal() {
    const modal = document.getElementById('createProposalModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // 重置表单
        const form = document.getElementById('createProposalForm');
        if (form) {
            form.reset();
        }
        
        showToast('info', '请填写提案详细信息');
    }
}

// 关闭创建提案模态框
function closeCreateProposalModal() {
    const modal = document.getElementById('createProposalModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 保存提案草稿
function saveProposalDraft() {
    const formData = getFormData();
    
    if (!formData.title || !formData.description) {
        showToast('warning', '请至少填写提案标题和描述');
        return;
    }
    
    console.log('保存草稿:', formData);
    showToast('success', '草稿已保存');
    
    // 模拟保存延迟
    setTimeout(() => {
        closeCreateProposalModal();
    }, 1000);
}

// 提交提案
function submitProposal() {
    const formData = getFormData();
    
    // 验证必填字段
    if (!validateForm(formData)) {
        return;
    }
    
    console.log('提交提案:', formData);
    showToast('success', '提案已提交审核');
    
    // 模拟提交延迟
    setTimeout(() => {
        closeCreateProposalModal();
        // 刷新页面数据
        refreshProposals();
    }, 1500);
}

// 获取表单数据
function getFormData() {
    return {
        type: document.getElementById('proposalType')?.value || '',
        title: document.getElementById('proposalTitle')?.value.trim() || '',
        description: document.getElementById('proposalDescription')?.value.trim() || '',
        priority: document.getElementById('proposalPriority')?.value || 'normal',
        votingPeriod: document.getElementById('votingPeriod')?.value || '14'
    };
}

// 验证表单
function validateForm(formData) {
    if (!formData.type) {
        showToast('warning', '请选择提案类型');
        return false;
    }
    
    if (!formData.title || formData.title.length < 3) {
        showToast('warning', '提案标题至少需要3个字符');
        return false;
    }
    
    if (!formData.description || formData.description.length < 10) {
        showToast('warning', '提案描述至少需要10个字符');
        return false;
    }
    
    return true;
}

// 分页功能
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
        updatePaginationInfo();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        loadPage(currentPage);
        updatePaginationInfo();
    }
}

function goToPage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
        currentPage = page;
        loadPage(currentPage);
        updatePaginationInfo();
    }
}

// 加载指定页面
function loadPage(page) {
    console.log('加载第', page, '页');
    showToast('info', `正在加载第${page}页...`);
    
    // 这里可以添加实际的数据加载逻辑
    setTimeout(() => {
        showToast('success', `已加载第${page}页`);
    }, 500);
}

// 更新分页信息
function updatePaginationInfo() {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    // 更新分页文本
    const paginationText = document.querySelector('.pagination-text');
    if (paginationText) {
        paginationText.textContent = `显示第 ${startItem}-${endItem} 项，共 ${totalItems} 项`;
    }
    
    // 更新按钮状态
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
    
    // 更新页码按钮
    updatePageNumbers();
}

// 更新页码按钮
function updatePageNumbers() {
    const pageNumbers = document.querySelectorAll('.pagination-number');
    
    pageNumbers.forEach(btn => {
        btn.classList.remove('active');
        const pageNum = parseInt(btn.textContent);
        if (pageNum === currentPage) {
            btn.classList.add('active');
        }
    });
}

// 导出提案
function exportProposals() {
    console.log('导出提案数据');
    showToast('info', '正在导出提案数据...');
    
    // 模拟导出延迟
    setTimeout(() => {
        showToast('success', '提案数据导出成功');
    }, 2000);
}

// 刷新提案
function refreshProposals() {
    console.log('刷新提案列表');
    showToast('info', '正在刷新数据...');
    
    // 模拟刷新延迟
    setTimeout(() => {
        showToast('success', '数据已刷新');
        updatePaginationInfo();
    }, 1000);
}

// 类型筛选
function applyTypeFilter() {
    const typeFilter = document.getElementById('typeFilter');
    const selectedType = typeFilter?.value || 'all';
    console.log('类型筛选:', selectedType);
    showToast('info', '正在按类型筛选...');
}

// 排序筛选
function applySortFilter() {
    const sortFilter = document.getElementById('sortFilter');
    const selectedSort = sortFilter?.value || 'time';
    console.log('排序:', selectedSort);
    showToast('info', `正在按${getSortName(selectedSort)}...`);
}

// 获取排序名称
function getSortName(sortType) {
    const sortNames = {
        'time': '时间排序',
        'participation': '参与度排序',
        'support': '支持率排序',
        'activity': '活跃度排序'
    };
    return sortNames[sortType] || sortType;
}

// 初始化表单验证
function initializeFormValidation() {
    const form = document.getElementById('createProposalForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitProposal();
        });
    }
}

// 管理提案
function manageProposals() {
    // 切换到我的提案标签
    const myProposalsTab = document.querySelector('[data-filter="my-proposals"]');
    if (myProposalsTab) {
        myProposalsTab.click();
        showToast('导航成功', '已切换到我的提案管理界面', 'success');
    } else {
        showToast('功能提示', '我的提案管理功能正在开发中', 'info');
    }
}

// 跟踪治理影响力
function trackProgress() {
    const influenceData = {
        proposalCount: 3,
        passRate: 66.7,
        communityImpact: '中等',
        governancePoints: 1250,
        merchantLevel: '银级',
        nextLevelPoints: 156,
        recentActivity: [
            '发起商家保证金调整提案',
            '参与平台手续费讨论',
            '支持AI商品分类提案',
            '反对质押收益算法修改'
        ]
    };
    
    let activityList = influenceData.recentActivity.map(activity => `• ${activity}`).join('\n');
    
    const message = `
📊 治理影响力统计报告

🏆 基础数据：
• 发起提案数量：${influenceData.proposalCount}个
• 提案通过率：${influenceData.passRate}%
• 社区影响力：${influenceData.communityImpact}
• 治理积分：${influenceData.governancePoints}分
• 商家治理等级：${influenceData.merchantLevel}

⭐ 升级进度：
距离金级还需 ${influenceData.nextLevelPoints} 积分

📈 最近活动：
${activityList}

💡 提升建议：
• 积极参与社区讨论
• 发起高质量提案
• 提高提案通过率
• 增强与其他商家的合作
    `.trim();
    
    alert(message);
}

// 撤回提案
function withdrawProposal(proposalId) {
    const confirmMessage = `确认要撤回提案 ${proposalId} 吗？\n\n⚠️ 注意事项：\n• 撤回后将无法恢复\n• 已投票的用户投票也将失效\n• 可能影响您的治理信誉度`;
    
    if (confirm(confirmMessage)) {
        // 模拟撤回过程
        showToast('处理中', '正在撤回提案...', 'info');
        
        setTimeout(() => {
            // 移除提案项目
            const proposalItem = document.querySelector(`[data-proposal-id="${proposalId}"]`);
            if (proposalItem) {
                proposalItem.style.opacity = '0.5';
                proposalItem.style.pointerEvents = 'none';
                
                // 添加撤回标记
                const statusBadge = proposalItem.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.textContent = '已撤回';
                    statusBadge.className = 'status-badge status-failed';
                }
                
                // 禁用操作按钮
                const actions = proposalItem.querySelector('.my-proposal-actions');
                if (actions) {
                    actions.innerHTML = '<span style="color: #64748b; font-size: 12px;">已撤回</span>';
                }
            }
            
            showToast('撤回成功', `提案 ${proposalId} 已成功撤回`, 'success');
            
            // 更新统计数据
            updateMerchantStats();
        }, 1500);
    }
}

// 更新商家统计数据
function updateMerchantStats() {
    const statCards = document.querySelectorAll('.stat-card .stat-value');
    if (statCards.length >= 3) {
        // 减少我发起的提案数量
        const myProposals = parseInt(statCards[2].textContent);
        if (myProposals > 0) {
            statCards[2].textContent = myProposals - 1;
        }
        
        // 重新计算参与率
        const totalProposals = parseInt(statCards[0].textContent);
        const myParticipated = parseInt(statCards[3].textContent);
        const newParticipationRate = ((myParticipated / totalProposals) * 100).toFixed(1);
        
        if (statCards[4]) {
            statCards[4].textContent = newParticipationRate + '%';
        }
    }
}

// 编辑提案
function editProposal(proposalId) {
    showToast('功能提示', `提案 ${proposalId} 编辑功能正在开发中`, 'info');
}

// 查看提案详情
function viewProposalDetails(proposalId) {
    showToast('功能提示', `提案 ${proposalId} 详情页面正在开发中`, 'info');
}

// 商家专属投票功能（重写基础投票功能）
function merchantVote(button, choice, proposalId) {
    const proposalItem = button.closest('.proposal-item');
    const proposalTitle = proposalItem.querySelector('.proposal-title').textContent;
    const choiceText = choice === 'yes' ? '支持' : choice === 'no' ? '反对' : '弃权';
    
    // 商家有更高的投票权重
    const votingWeight = '2,456.78';
    const merchantBonus = '（商家增强权重）';
    
    const confirmMessage = `确认对提案"${proposalTitle}"投${choiceText}票吗？\n\n您的投票权重: ${votingWeight} SAP ${merchantBonus}\n\n💎 商家特权：\n• 投票权重增加 50%\n• 优先显示投票结果\n• 获得额外治理积分`;
    
    if (confirm(confirmMessage)) {
        // 调用基础投票功能
        vote(button, choice, proposalId);
        
        // 商家额外奖励
        setTimeout(() => {
            showToast('商家奖励', '恭喜！您获得了额外的治理积分奖励', 'success');
        }, 2000);
    }
}

// 导出商家专属功能（覆盖全局函数）
window.createProposal = createNewProposal;
window.manageProposals = manageProposals;
window.trackProgress = trackProgress;
window.withdrawProposal = withdrawProposal;
window.vote = merchantVote; // 使用商家专属投票功能 

// 商家版提案管理功能
class MerchantProposalsManager {
    constructor() {
        this.currentFilter = 'all';
        this.currentView = 'list';
        this.currentSort = 'time';
        this.proposals = [];
        this.init();
    }

    init() {
        this.initEventListeners();
        this.loadProposals();
        this.updateStats();
    }

    initEventListeners() {
        // 筛选标签
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });

        // 视图切换
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleViewChange(e.target.dataset.view);
            });
        });

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // 模态框关闭
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
    }

    handleFilterChange(filter) {
        this.currentFilter = filter;
        
        // 更新标签状态
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // 筛选提案
        this.filterProposals();
        this.updateProposalsCount();
    }

    handleViewChange(view) {
        this.currentView = view;
        
        // 更新视图按钮状态
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // 应用视图样式
        this.applyViewStyle();
    }

    handleSearch(query) {
        const proposals = document.querySelectorAll('.proposal-item');
        const lowerQuery = query.toLowerCase();

        proposals.forEach(proposal => {
            const title = proposal.querySelector('.proposal-title').textContent.toLowerCase();
            const description = proposal.querySelector('.proposal-description').textContent.toLowerCase();
            const id = proposal.querySelector('.proposal-id').textContent.toLowerCase();

            if (title.includes(lowerQuery) || description.includes(lowerQuery) || id.includes(lowerQuery)) {
                proposal.style.display = 'block';
            } else {
                proposal.style.display = 'none';
            }
        });

        this.updateProposalsCount();
    }

    filterProposals() {
        const proposals = document.querySelectorAll('.proposal-item');
        
        proposals.forEach(proposal => {
            const status = proposal.dataset.status;
            const isMerchant = proposal.classList.contains('merchant-proposal');
            const isMy = proposal.classList.contains('my-proposal');
            const isVoted = proposal.classList.contains('voted-proposal');
            
            let shouldShow = false;
            
            switch (this.currentFilter) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'voting':
                    shouldShow = status === 'voting';
                    break;
                case 'merchant-related':
                    shouldShow = isMerchant;
                    break;
                case 'my-proposals':
                    shouldShow = isMy;
                    break;
                case 'my-votes':
                    shouldShow = isVoted;
                    break;
            }
            
            proposal.style.display = shouldShow ? 'block' : 'none';
        });
    }

    applyViewStyle() {
        const proposalsBody = document.querySelector('.proposals-body');
        if (this.currentView === 'grid') {
            proposalsBody.classList.add('grid-view');
        } else {
            proposalsBody.classList.remove('grid-view');
        }
    }

    updateProposalsCount() {
        const visibleProposals = document.querySelectorAll('.proposal-item[style*="block"], .proposal-item:not([style*="none"])');
        const countElement = document.querySelector('.proposals-count');
        if (countElement) {
            countElement.textContent = `共 ${visibleProposals.length} 个提案`;
        }
    }

    updateStats() {
        // 模拟统计数据更新
        const stats = {
            total: 23,
            userParticipated: 18,
            userParticipationRate: 78.3,
            myProposals: 7,
            merchantRelated: 12,
            influenceLevel: 'A+'
        };

        // 更新统计显示
        this.animateStatValue('.user-stats .stat-card:nth-child(1) .stat-value', stats.total);
        this.animateStatValue('.user-stats .stat-card:nth-child(2) .stat-value', stats.userParticipated);
        this.animateStatValue('.user-stats .stat-card:nth-child(3) .stat-value', stats.userParticipationRate, '%');
        
        this.animateStatValue('.merchant-stats .stat-card:nth-child(1) .stat-value', stats.myProposals);
        this.animateStatValue('.merchant-stats .stat-card:nth-child(2) .stat-value', stats.merchantRelated);
        
        // 影响力等级特殊处理
        const influenceElement = document.querySelector('.merchant-stats .stat-card:nth-child(3) .stat-value');
        if (influenceElement) {
            influenceElement.textContent = stats.influenceLevel;
        }
    }

    animateStatValue(selector, targetValue, suffix = '') {
        const element = document.querySelector(selector);
        if (!element) return;

        const currentValue = parseInt(element.textContent) || 0;
        const increment = (targetValue - currentValue) / 20;
        let current = currentValue;

        const animation = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= targetValue) || (increment < 0 && current <= targetValue)) {
                current = targetValue;
                clearInterval(animation);
            }
            element.textContent = Math.round(current) + suffix;
        }, 50);
    }

    loadProposals() {
        // 模拟加载提案数据
        this.proposals = [
            {
                id: 'SIP-017',
                title: '降低商家入驻保证金至5,000 SAP',
                type: 'merchant',
                status: 'voting',
                support: 89.5
            },
            {
                id: 'SIP-019',
                title: '增设"数码配件"商品分类',
                type: 'my',
                status: 'draft',
                support: 0
            },
            {
                id: 'SIP-015',
                title: '调整平台交易手续费率至0.25%',
                type: 'general',
                status: 'voting',
                support: 72.3
            },
            {
                id: 'SIP-016',
                title: '引入流动性挖矿激励机制',
                type: 'defi',
                status: 'voting',
                support: 89.2,
                voted: true
            }
        ];
    }
}

// 模态框管理
function showMerchantAllianceModal() {
    const modal = document.getElementById('merchantAllianceModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function showMerchantDataModal() {
    const modal = document.getElementById('merchantDataModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    });
}

// 投票功能 (继承自proposals-common.js)
function vote(button, voteType, proposalId) {
    if (typeof window.vote === 'function') {
        window.vote(button, voteType, proposalId);
    } else {
        // 备用投票逻辑
        const buttons = button.parentElement.querySelectorAll('.vote-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('vote-btn-voted');
        });
        
        button.disabled = true;
        button.classList.add('vote-btn-voted');
        button.innerHTML = `<i class="fas fa-check"></i> 已投票`;
        
        showToast('success', `已对提案 ${proposalId} 投票：${voteType === 'yes' ? '支持' : voteType === 'no' ? '反对' : '弃权'}`);
    }
}

// 搜索功能
function searchProposals() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && merchantProposalsManager) {
        merchantProposalsManager.handleSearch(searchInput.value);
    }
}

// 导航功能
function navigateToProposals() {
    // 这里可以实现页面跳转逻辑
    console.log('跳转到提案管理页面');
}

// 初始化
let merchantProposalsManager;

document.addEventListener('DOMContentLoaded', function() {
    merchantProposalsManager = new MerchantProposalsManager();
    
    // 添加页面加载动画
    const elements = document.querySelectorAll('.merchant-actions-section, .dual-identity-stats, .proposals-list');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// CSS动画样式
const style = document.createElement('style');
style.textContent = `
    .grid-view {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 20px;
    }
    
    .grid-view .proposal-item {
        margin-bottom: 0;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-color);
        z-index: 1001;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        min-width: 300px;
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
    
    @media (max-width: 768px) {
        .toast {
            right: 10px;
            left: 10px;
            min-width: auto;
            transform: translateY(-100px);
        }
        
        .toast.toast-show {
            transform: translateY(0);
        }
        
        .grid-view {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

// --- Tab筛选优化 ---
// 监听tab按钮点击，筛选提案并重置分页
function initializeTabFilters() {
    const tabButtons = document.querySelectorAll('.filter-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 切换active
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // 获取筛选类型
            const filterType = this.dataset.filter;
            // 重置分页
            currentPage = 1;
            // 筛选并渲染
            filterAndRenderProposals(filterType);
            updatePaginationInfo();
        });
    });
}

// 根据筛选类型渲染提案列表
function filterAndRenderProposals(filterType) {
    const allProposals = Array.from(document.querySelectorAll('.proposal-item'));
    allProposals.forEach(item => {
        let show = false;
        if (filterType === 'all') show = true;
        else if (filterType === 'voting') show = item.dataset.status === 'voting';
        else if (filterType === 'active') show = item.dataset.status === 'active';
        else if (filterType === 'merchant-related') show = item.classList.contains('merchant-proposal');
        else if (filterType === 'my-proposals') show = item.classList.contains('my-proposal');
        item.style.display = show ? 'block' : 'none';
    });
} 