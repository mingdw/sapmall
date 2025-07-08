/* 
 * 账户余额页面专用脚本
 * 只包含余额页面特有的功能
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initTransactionFilters();
    initQuickActions();
    initRewardActions();
    initModalHandlers();
    initCopyButtons();
    initAddressActions();
});

// 初始化交易记录过滤功能
function initTransactionFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const transactionItems = document.querySelectorAll('.transaction-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的活动状态
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的活动状态
            this.classList.add('active');
            
            const filterType = this.dataset.tab;
            
            // 显示或隐藏交易项
            transactionItems.forEach(item => {
                if (filterType === 'all' || item.dataset.type === filterType) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTransactions(searchTerm);
        });
    }
    
    function filterTransactions(searchTerm) {
        transactionItems.forEach(item => {
            const title = item.querySelector('.transaction-title').textContent.toLowerCase();
            const address = item.querySelector('.transaction-address').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || address.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 导出按钮
    const exportBtn = document.querySelector('.section-actions .admin-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showToast('导出功能正在开发中', 'info');
        });
    }
}

// 初始化快速操作
function initQuickActions() {
    const actionItems = document.querySelectorAll('.action-item');
    
    actionItems.forEach(item => {
        // 跳过已有onclick的项目（如质押管理）
        if (item.onclick) return;
        
        item.addEventListener('click', function() {
            const actionText = this.querySelector('.action-text').textContent;
            showToast(`${actionText}功能正在开发中`, 'info');
        });
    });
}

// 初始化奖励操作
function initRewardActions() {
    // 全部领取按钮
    const claimAllBtn = document.querySelector('.rewards-actions .admin-btn-primary');
    if (claimAllBtn) {
        claimAllBtn.addEventListener('click', function() {
            const rewardAmount = document.querySelector('.rewards-amount').textContent;
            showConfirmModal(`确定要领取全部收益：${rewardAmount} 吗？`, function() {
                claimAllRewards();
            });
        });
    }
}

// 初始化模态框处理器
function initModalHandlers() {
    // 交易详情模态框
    const transactionModal = document.getElementById('transactionModal');
    const viewDetailBtns = document.querySelectorAll('.transaction-detail-btn');
    
    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const transactionItem = this.closest('.transaction-item');
            showTransactionDetail(transactionItem);
        });
    });
    
    // 关闭模态框事件
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // 分页按钮交互
    initPaginationHandlers();
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
            
            // 这里可以添加实际的分页逻辑
            const pageNumber = this.textContent;
            showToast(`切换到第 ${pageNumber} 页`, 'info');
            
            // 模拟加载新数据
            loadTransactionPage(pageNumber);
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
                loadTransactionPage(nextPage.textContent);
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
                loadTransactionPage(prevPage.textContent);
                updatePaginationButtons();
            }
        });
    }
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

// 模拟加载交易页面数据
function loadTransactionPage(pageNumber) {
    // 这里可以添加实际的数据加载逻辑
    console.log(`Loading transaction page ${pageNumber}`);
    
    // 模拟加载延迟
    const transactionList = document.querySelector('.transaction-list');
    transactionList.style.opacity = '0.6';
    
    setTimeout(() => {
        transactionList.style.opacity = '1';
        showToast(`第 ${pageNumber} 页数据加载完成`, 'success');
    }, 500);
}

// 初始化复制按钮
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetElement = this.previousElementSibling;
            let textToCopy = '';
            
            if (targetElement.tagName === 'CODE') {
                textToCopy = targetElement.textContent;
            } else {
                textToCopy = targetElement.value || targetElement.textContent;
            }
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('已复制到剪贴板', 'success');
            }).catch(() => {
                showToast('复制失败', 'error');
            });
        });
    });
}

// 初始化地址相关操作
function initAddressActions() {
    // 二维码和地址相关按钮
    const downloadQrBtn = document.querySelector('.address-actions .admin-btn:first-child');
    const shareAddressBtn = document.querySelector('.address-actions .admin-btn:last-child');
    
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', function() {
            showToast('二维码下载功能正在开发中', 'info');
        });
    }
    
    if (shareAddressBtn) {
        shareAddressBtn.addEventListener('click', function() {
            const address = document.querySelector('.admin-item-value code').textContent;
            if (navigator.share) {
                navigator.share({
                    title: 'SAP钱包地址',
                    text: `我的SAP钱包地址：${address}`
                });
            } else {
                navigator.clipboard.writeText(address);
                showToast('地址已复制到剪贴板', 'success');
            }
        });
    }
}

// 显示交易详情
function showTransactionDetail(transactionItem) {
    const type = transactionItem.querySelector('.transaction-title').textContent;
    const amount = transactionItem.querySelector('.transaction-amount').textContent;
    const address = transactionItem.querySelector('.transaction-address').textContent;
    const time = transactionItem.querySelector('.transaction-time').textContent;
    const status = transactionItem.querySelector('.transaction-badge').textContent.trim();
    
    // 更新模态框内容
    document.getElementById('txType').textContent = type;
    document.getElementById('txAmount').textContent = amount;
    document.getElementById('txTime').textContent = time + ':25';
    document.getElementById('txStatus').innerHTML = transactionItem.querySelector('.transaction-badge').innerHTML;
    
    // 根据交易类型设置发送方和接收方
    const addressText = address.replace('来自: ', '').replace('发往: ', '').replace('流动性池: ', '').replace('来源: ', '');
    
    if (type === '接收') {
        document.getElementById('txFrom').textContent = addressText;
        document.getElementById('txTo').textContent = '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f';
    } else if (type === '发送') {
        document.getElementById('txFrom').textContent = '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f';
        document.getElementById('txTo').textContent = addressText;
    } else {
        document.getElementById('txFrom').textContent = '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f';
        document.getElementById('txTo').textContent = addressText;
    }
    
    // 生成模拟的交易哈希
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);
    document.getElementById('txHash').textContent = txHash;
    document.getElementById('txConfirmations').textContent = Math.floor(Math.random() * 50 + 10) + ' 确认';
    document.getElementById('txNote').textContent = '-';
    
    // 显示模态框
    openModal(document.getElementById('transactionModal'));
}

// 领取全部奖励
function claimAllRewards() {
    // 模拟领取过程
    showToast('正在处理奖励领取...', 'info');
    
    setTimeout(() => {
        // 更新奖励金额为0
        document.querySelector('.rewards-amount').textContent = '0.0 SAP';
        
        // 更新各项奖励为0
        document.querySelectorAll('.breakdown-summary-amount').forEach(el => {
            el.textContent = '0.0 SAP';
        });
        
        // 更新主账户余额（模拟增加）
        const currentBalance = parseFloat(document.querySelector('.balance-amount').textContent.replace(' SAP', '').replace(',', ''));
        const newBalance = currentBalance + 15.2;
        document.querySelector('.balance-amount').textContent = newBalance.toLocaleString() + ' SAP';
        
        showToast('奖励领取成功！', 'success');
    }, 2000);
}

// 打开模态框
function openModal(modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
}

// 关闭模态框
function closeModal(modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
}

// 显示确认模态框
function showConfirmModal(message, confirmCallback) {
    // 创建简单的确认对话框
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