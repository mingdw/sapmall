/* 账户余额页面脚本 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initTransactionFilters();
    initQuickActions();
    initRewardActions();
    initModalHandlers();
    initCopyButtons();
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
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTransactions(searchTerm);
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase();
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
    const exportBtn = document.querySelector('.section-actions .btn');
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
    const claimAllBtn = document.querySelector('.rewards-actions .btn-primary');
    if (claimAllBtn) {
        claimAllBtn.addEventListener('click', function() {
            const rewardAmount = document.querySelector('.rewards-amount').textContent;
            showConfirmModal(`确定要领取全部收益：${rewardAmount} 吗？`, function() {
                claimAllRewards();
            });
        });
    }
    
    // 管理奖励按钮事件已通过onclick处理
}

// 初始化模态框处理器
function initModalHandlers() {
    // 交易详情模态框
    const transactionModal = document.getElementById('transactionModal');
    const viewDetailBtns = document.querySelectorAll('.transaction-status .btn-icon');
    
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
    
    // 二维码和地址相关按钮
    const downloadQrBtn = document.querySelector('.address-actions .btn:first-child');
    const shareAddressBtn = document.querySelector('.address-actions .btn:last-child');
    
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', function() {
            showToast('二维码下载功能正在开发中', 'info');
        });
    }
    
    if (shareAddressBtn) {
        shareAddressBtn.addEventListener('click', function() {
            const address = document.querySelector('.address-value code').textContent;
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
    const status = transactionItem.querySelector('.badge').textContent.trim();
    
    // 更新模态框内容
    document.getElementById('txType').textContent = type;
    document.getElementById('txAmount').textContent = amount;
    document.getElementById('txTime').textContent = time + ':25';
    document.getElementById('txStatus').innerHTML = transactionItem.querySelector('.badge').innerHTML;
    
    // 模拟交易详情数据
    document.getElementById('txHash').textContent = '0x7f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f8f5a2e45c0d3c9f0acef4e70';
    document.getElementById('txConfirmations').textContent = '24 确认';
    document.getElementById('txNote').textContent = '-';
    
    // 根据交易类型设置发送方和接收方
    if (type === '接收') {
        document.getElementById('txFrom').textContent = '0xabc...def';
        document.getElementById('txTo').textContent = '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f';
    } else if (type === '发送') {
        document.getElementById('txFrom').textContent = '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f';
        document.getElementById('txTo').textContent = '0x123...789';
    } else {
        document.getElementById('txFrom').textContent = '-';
        document.getElementById('txTo').textContent = '-';
    }
    
    // 显示模态框
    const modal = document.getElementById('transactionModal');
    openModal(modal);
}

// 领取全部奖励
function claimAllRewards() {
    showToast('正在处理奖励领取...', 'info');
    
    setTimeout(() => {
        showToast('已成功领取全部奖励：15.2 SAP', 'success');
        
        // 模拟更新余额
        updateBalanceData();
        
        // 清空奖励显示
        const rewardsAmount = document.querySelector('.rewards-amount');
        if (rewardsAmount) {
            rewardsAmount.textContent = '0 SAP';
        }
        
        // 更新奖励明细
        const breakdownSummary = document.querySelector('.rewards-breakdown-summary');
        if (breakdownSummary) {
            breakdownSummary.innerHTML = `
                <div style="width: 100%; text-align: center; padding: 20px; color: #94a3b8;">
                    <i class="fas fa-check-circle" style="font-size: 32px; color: #10b981; margin-bottom: 8px; display: block;"></i>
                    <span>所有奖励已领取完毕</span>
                </div>
            `;
        }
    }, 2000);
}

// 更新余额数据
function updateBalanceData() {
    // 模拟更新主账户余额
    const mainBalance = document.querySelector('.balance-amount');
    if (mainBalance) {
        const currentAmount = parseInt(mainBalance.textContent.replace(/[^\d]/g, ''));
        const newAmount = currentAmount + 15; // 假设增加15 SAP
        mainBalance.textContent = `${newAmount.toLocaleString()} SAP`;
    }
}

// 打开模态框
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 显示确认模态框
function showConfirmModal(message, confirmCallback) {
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal confirm-modal';
    confirmModal.style.display = 'flex';
    
    confirmModal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3><i class="fas fa-question-circle"></i> 确认操作</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <p style="text-align: center; margin: 20px 0; color: #e2e8f0;">${message}</p>
                <div class="confirm-actions" style="display: flex; justify-content: flex-end; gap: 12px;">
                    <button class="btn btn-outline cancel-btn">取消</button>
                    <button class="btn btn-primary confirm-btn">确认</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmModal);
    
    const closeBtn = confirmModal.querySelector('.close-modal');
    const cancelBtn = confirmModal.querySelector('.cancel-btn');
    const confirmBtn = confirmModal.querySelector('.confirm-btn');
    
    const closeModal = () => {
        confirmModal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(confirmModal);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', () => {
        closeModal();
        if (typeof confirmCallback === 'function') {
            confirmCallback();
        }
    });
    
    confirmModal.addEventListener('click', function(event) {
        if (event.target === confirmModal) {
            closeModal();
        }
    });
}

// 显示提示信息
function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
        
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 300px;
            }
            .toast {
                background: #1e293b;
                border-left: 4px solid #3b82f6;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                display: flex;
                padding: 12px;
                opacity: 0;
                transform: translateX(20px);
                transition: all 0.3s ease;
            }
            .toast.show {
                opacity: 1;
                transform: translateX(0);
            }
            .toast-info {
                border-left-color: #3b82f6;
            }
            .toast-success {
                border-left-color: #10b981;
            }
            .toast-error {
                border-left-color: #ef4444;
            }
            .toast-icon {
                margin-right: 12px;
                display: flex;
                align-items: center;
                color: #3b82f6;
            }
            .toast-success .toast-icon {
                color: #10b981;
            }
            .toast-error .toast-icon {
                color: #ef4444;
            }
            .toast-content {
                flex: 1;
            }
            .toast-message {
                color: #e2e8f0;
                font-size: 14px;
            }
            .toast-close {
                color: #94a3b8;
                cursor: pointer;
                font-size: 16px;
                margin-left: 8px;
            }
        `;
        document.head.appendChild(style);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close">&times;</div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 分页和其他功能
document.addEventListener('DOMContentLoaded', function() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', function() {
                showToast('分页功能正在开发中', 'info');
            });
        }
    });
    
    // 交易详情模态框中的操作按钮
    const modalActionBtns = document.querySelectorAll('.transaction-actions .btn');
    modalActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.textContent.trim();
            showToast(`${actionText}功能正在开发中`, 'info');
        });
    });
}); 