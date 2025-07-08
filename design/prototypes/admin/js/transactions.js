/* 交易记录页面脚本 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initFilterButtons();
    initSearchAndFilter();
    initTransactionActions();
    initModalHandlers();
    initCopyButtons();
    initPageActions();
    initPaginationHandlers();
    updateStats();
});

// 初始化筛选按钮
function initFilterButtons() {
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
            let visibleCount = 0;
            transactionItems.forEach(item => {
                if (filterType === 'all' || item.dataset.type === filterType) {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // 显示筛选提示
            const filterNames = {
                'all': '全部',
                'receive': '收入',
                'send': '支出',
                'swap': '兑换',
                'stake': '质押',
                'reward': '奖励',
                'governance': '治理'
            };
            
            showToast(`已筛选${filterNames[filterType]}交易，共 ${visibleCount} 条记录`);
        });
    });
}

// 初始化搜索和筛选功能
function initSearchAndFilter() {
    const searchInput = document.querySelector('.search-input');
    const timeSelect = document.querySelector('.filter-select');
    
    // 搜索功能
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 500);
        });
        
        // 支持回车键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // 时间筛选
    if (timeSelect) {
        timeSelect.addEventListener('change', function() {
            const days = this.value;
            filterByTime(days);
        });
    }
}

// 执行搜索
function performSearch(searchTerm) {
    const transactionItems = document.querySelectorAll('.transaction-item');
    const activeFilter = document.querySelector('.filter-btn.active').dataset.tab;
    let visibleCount = 0;
    
    const term = searchTerm.toLowerCase().trim();
    
    transactionItems.forEach(item => {
        // 首先检查类型筛选
        const typeMatch = activeFilter === 'all' || item.dataset.type === activeFilter;
        
        if (!typeMatch) {
            item.style.display = 'none';
            return;
        }
        
        // 如果没有搜索词，显示所有符合类型的项目
        if (!term) {
            item.style.display = 'flex';
            visibleCount++;
            return;
        }
        
        // 搜索匹配
        const title = item.querySelector('.transaction-title').textContent.toLowerCase();
        const address = item.querySelector('.transaction-address').textContent.toLowerCase();
        
        const searchMatch = title.includes(term) || address.includes(term);
        
        if (searchMatch) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    if (term) {
        showToast(`搜索到 ${visibleCount} 条相关记录`);
    }
}

// 按时间筛选
function filterByTime(days) {
    const transactionItems = document.querySelectorAll('.transaction-item');
    let visibleCount = 0;
    
    if (days === 'all') {
        transactionItems.forEach(item => {
            if (item.style.display !== 'none') {
                visibleCount++;
            }
        });
        return;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    transactionItems.forEach(item => {
        const timeText = item.querySelector('.transaction-time').textContent;
        const itemDate = new Date(timeText.replace(' ', 'T'));
        
        if (itemDate >= cutoffDate) {
            // 保持当前显示状态
            if (item.style.display !== 'none') {
                visibleCount++;
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    showToast(`已筛选最近 ${days} 天的记录`);
}

// 初始化交易操作
function initTransactionActions() {
    const transactionItems = document.querySelectorAll('.transaction-item');
    
    transactionItems.forEach(item => {
        const viewBtn = item.querySelector('.transaction-detail-btn');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => showTransactionDetail(item));
        }
        
        // 添加交易项点击效果
        item.addEventListener('click', function(e) {
            // 如果点击的是按钮，不触发项目点击事件
            if (e.target.closest('.transaction-detail-btn')) return;
            
            // 添加点击反馈效果
            this.style.transform = 'translateY(-2px) scale(1.01)';
            setTimeout(() => {
                this.style.transform = 'translateY(-1px)';
            }, 150);
        });
    });
}

// 显示交易详情
function showTransactionDetail(transactionItem) {
    const modal = document.getElementById('transactionModal');
    if (!modal) return;
    
    // 提取交易数据
    const title = transactionItem.querySelector('.transaction-title').textContent;
    const amount = transactionItem.querySelector('.transaction-amount').textContent;
    const time = transactionItem.querySelector('.transaction-time').textContent;
    const address = transactionItem.querySelector('.transaction-address').textContent;
    const status = transactionItem.querySelector('.transaction-badge').textContent.trim();
    const type = transactionItem.dataset.type;
    
    // 生成模拟数据
    const mockData = generateMockTransactionData(type, title, amount);
    
    // 填充模态框数据
    document.getElementById('txType').textContent = title;
    document.getElementById('txAmount').textContent = amount;
    document.getElementById('txHash').textContent = mockData.hash;
    document.getElementById('txFrom').textContent = mockData.from;
    document.getElementById('txTo').textContent = mockData.to;
    document.getElementById('blockNumber').textContent = mockData.blockNumber;
    document.getElementById('txTime').textContent = time + ':25';
    document.getElementById('txFee').textContent = mockData.fee;
    document.getElementById('txConfirmations').textContent = mockData.confirmations;
    document.getElementById('txStatus').innerHTML = status;
    document.getElementById('txNote').textContent = mockData.note;
    
    // 显示模态框
    openModal(modal);
}

// 生成模拟交易数据
function generateMockTransactionData(type, title, amount) {
    const mockHashes = [
        '0x7f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f8f5a2e45c0d3c9f0acef4e70',
        '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f8f5a2e45c0d3c9f0acef4e71',
        '0x9f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f8f5a2e45c0d3c9f0acef4e72'
    ];
    
    const mockAddresses = [
        '0x742d35Cc6C6C26b4d6C6d6C6d6C6d6C6d6C6d6C6',
        '0x853e46Dd7D7D37e5d7D7d7D7d7D7d7D7d7D7d7D7',
        '0x964f57Ee8E8E48f6e8E8e8E8e8E8e8E8e8E8e8E8'
    ];
    
    const typeNotes = {
        'swap': '通过 SAP/USDT 流动性池兑换',
        'stake': '向 SAP/ETH 流动性池添加流动性',
        'reward': '来自流动性挖矿的奖励收益',
        'send': '向指定地址发送代币',
        'receive': '从指定地址接收代币',
        'governance': '参与社区治理投票'
    };
    
    return {
        hash: mockHashes[Math.floor(Math.random() * mockHashes.length)],
        from: mockAddresses[Math.floor(Math.random() * mockAddresses.length)],
        to: mockAddresses[Math.floor(Math.random() * mockAddresses.length)],
        blockNumber: (19234567 + Math.floor(Math.random() * 1000)).toLocaleString(),
        fee: (Math.random() * 5 + 1).toFixed(1) + ' SAP (0.3%)',
        confirmations: Math.floor(Math.random() * 50 + 10) + ' 确认',
        note: typeNotes[type] || '交易备注信息'
    };
}

// 初始化模态框处理器
function initModalHandlers() {
    const modal = document.getElementById('transactionModal');
    const closeBtn = modal?.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal(modal);
        }
    });
}

// 初始化复制按钮
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const codeElement = this.parentElement.querySelector('code');
            if (codeElement) {
                copyToClipboard(codeElement.textContent);
            }
        });
    });
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('已复制到剪贴板', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// 备用复制方法
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('已复制到剪贴板', 'success');
    } catch (err) {
        showToast('复制失败，请手动复制', 'error');
    }
    
    document.body.removeChild(textArea);
}

// 初始化页面操作
function initPageActions() {
    // 导出按钮
    const exportBtn = document.querySelector('.transactions-header-actions .admin-btn-outline');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTransactions);
    }
    
    // 刷新按钮
    const refreshBtn = document.querySelector('.transactions-header-actions .admin-btn-primary');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshTransactions);
    }
    
    // 模态框中的操作按钮
    const blockchainBtn = document.querySelector('.transaction-actions .admin-btn:first-child');
    const exportReceiptBtn = document.querySelector('.transaction-actions .admin-btn:last-child');
    
    if (blockchainBtn) {
        blockchainBtn.addEventListener('click', function() {
            showToast('正在打开区块浏览器...', 'info');
            // 这里可以添加实际的区块浏览器链接逻辑
        });
    }
    
    if (exportReceiptBtn) {
        exportReceiptBtn.addEventListener('click', function() {
            showToast('正在生成交易收据...', 'info');
            // 这里可以添加实际的收据导出逻辑
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
            showToast(`切换到第 ${pageNumber} 页`);
            
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
    console.log(`Loading transaction page ${pageNumber}`);
    
    // 模拟加载延迟
    const transactionList = document.querySelector('.transaction-list');
    transactionList.style.opacity = '0.6';
    
    setTimeout(() => {
        transactionList.style.opacity = '1';
        showToast(`第 ${pageNumber} 页数据加载完成`, 'success');
    }, 500);
}

// 导出交易记录
function exportTransactions() {
    showToast('正在准备导出数据...', 'info');
    
    setTimeout(() => {
        showToast('交易记录导出功能正在开发中', 'warning');
    }, 1000);
}

// 刷新交易记录
function refreshTransactions() {
    showToast('正在刷新交易数据...', 'info');
    
    // 模拟刷新延迟
    setTimeout(() => {
        updateStats();
        showToast('交易数据已更新', 'success');
    }, 1500);
}

// 更新统计数据
function updateStats() {
    const statValues = document.querySelectorAll('.transactions-stat-card .stat-value');
    
    // 模拟数据更新
    const newValues = ['156', '2,850 SAP', '45.8 SAP', '1,250 SAP'];
    
    statValues.forEach((element, index) => {
        if (newValues[index]) {
            element.style.opacity = '0.6';
            setTimeout(() => {
                element.textContent = newValues[index];
                element.style.opacity = '1';
            }, 300);
        }
    });
}

// 打开模态框
function openModal(modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // 添加打开动画
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

// 关闭模态框
function closeModal(modal) {
    modal.querySelector('.modal-content').style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 200);
}

// 显示提示消息 - 复用公共样式
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
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
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