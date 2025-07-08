// 管理员提案管理专用JavaScript功能

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminProposalsPage();
});

// 初始化管理员提案页面
function initializeAdminProposalsPage() {
    // 初始化基础功能
    initializeProposalsPage();
    
    // 初始化管理员专属功能
    initializeAdminFeatures();
}

// 初始化管理员专属功能
function initializeAdminFeatures() {
    // 管理员控制台
    initializeAdminControls();
    
    // 待审核提案管理
    initializePendingProposals();
    
    // 系统提案管理
    initializeSystemProposals();
}

// 初始化管理员控制台
function initializeAdminControls() {
    // 各种管理功能的事件绑定
    bindAdminControlEvents();
}

// 绑定管理员控制事件
function bindAdminControlEvents() {
    // 审核提案
    const reviewCard = document.querySelector('.admin-action-card[onclick*="reviewProposals"]');
    if (reviewCard) {
        reviewCard.addEventListener('click', reviewProposals);
    }
    
    // 治理管理
    const manageCard = document.querySelector('.admin-action-card[onclick*="manageGovernance"]');
    if (manageCard) {
        manageCard.addEventListener('click', manageGovernance);
    }
    
    // 系统配置
    const configCard = document.querySelector('.admin-action-card[onclick*="configureSystem"]');
    if (configCard) {
        configCard.addEventListener('click', configureSystem);
    }
    
    // 活动监控
    const monitorCard = document.querySelector('.admin-action-card[onclick*="monitorActivity"]');
    if (monitorCard) {
        monitorCard.addEventListener('click', monitorActivity);
    }
}

// 初始化待审核提案
function initializePendingProposals() {
    // 批准按钮
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('onclick').match(/approveProposal\('(.+?)'\)/)[1];
            approveProposal(proposalId);
        });
    });
    
    // 拒绝按钮
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('onclick').match(/rejectProposal\('(.+?)'\)/)[1];
            rejectProposal(proposalId);
        });
    });
    
    // 修改按钮
    document.querySelectorAll('.modify-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('onclick').match(/modifyProposal\('(.+?)'\)/)[1];
            modifyProposal(proposalId);
        });
    });
}

// 初始化系统提案
function initializeSystemProposals() {
    // 强制执行按钮
    document.querySelectorAll('.force-execute-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('onclick').match(/forceExecute\('(.+?)'\)/)[1];
            forceExecute(proposalId);
        });
    });
    
    // 暂停按钮
    document.querySelectorAll('.pause-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const proposalId = this.getAttribute('onclick').match(/pauseProposal\('(.+?)'\)/)[1];
            pauseProposal(proposalId);
        });
    });
}

// 审核提案
function reviewProposals() {
    const pendingTab = document.querySelector('[data-filter="pending"]');
    if (pendingTab) {
        pendingTab.click();
        showToast('导航成功', '已切换到待审核提案界面', 'success');
    } else {
        showToast('功能提示', '提案审核功能正在开发中', 'info');
    }
}

// 治理管理
function manageGovernance() {
    const governanceOptions = [
        '投票权重规则配置',
        '提案通过阈值设置',
        '投票周期管理',
        '治理代币参数',
        '奖励机制配置',
        '质押要求调整',
        '社区等级体系',
        '紧急治理机制'
    ];
    
    let optionsList = governanceOptions.map((option, index) => `${index + 1}. ${option}`).join('\n');
    
    const selectedOption = prompt(`请选择治理管理功能（输入序号）：\n\n${optionsList}`);
    
    if (selectedOption && selectedOption >= 1 && selectedOption <= governanceOptions.length) {
        const option = governanceOptions[selectedOption - 1];
        showToast('治理管理', `正在配置"${option}"...`, 'info');
        
        setTimeout(() => {
            showToast('配置完成', `"${option}"配置已更新`, 'success');
        }, 2000);
    } else if (selectedOption !== null) {
        showToast('输入错误', '请输入有效的序号（1-8）', 'error');
    }
}

// 系统配置
function configureSystem() {
    const systemOptions = [
        '治理合约参数',
        '多签钱包配置',
        '紧急暂停机制',
        '升级权限管理',
        '安全参数设置',
        '手续费参数',
        '时间锁配置',
        '访问控制列表'
    ];
    
    let optionsList = systemOptions.map((option, index) => `${index + 1}. ${option}`).join('\n');
    
    const selectedOption = prompt(`请选择系统配置功能（输入序号）：\n\n${optionsList}`);
    
    if (selectedOption && selectedOption >= 1 && selectedOption <= systemOptions.length) {
        const option = systemOptions[selectedOption - 1];
        showToast('系统配置', `正在配置"${option}"...`, 'info');
        
        setTimeout(() => {
            showToast('配置完成', `"${option}"配置已更新`, 'success');
        }, 2000);
    } else if (selectedOption !== null) {
        showToast('输入错误', '请输入有效的序号（1-8）', 'error');
    }
}

// 活动监控
function monitorActivity() {
    const monitoringData = {
        activeVoters: 1247,
        totalProposals: 35,
        pendingProposals: 2,
        systemHealth: '良好',
        networkActivity: '高',
        securityStatus: '安全',
        recentAlerts: [
            '检测到异常投票模式',
            '新提案创建频率较高',
            '治理代币转移活跃',
            '系统性能正常'
        ],
        performanceMetrics: {
            avgResponseTime: '120ms',
            uptime: '99.98%',
            errorRate: '0.02%'
        }
    };
    
    let alertsList = monitoringData.recentAlerts.map(alert => `• ${alert}`).join('\n');
    
    const message = `
🔍 实时活动监控报告

📊 核心指标：
• 活跃投票者：${monitoringData.activeVoters}人
• 总提案数：${monitoringData.totalProposals}个
• 待处理提案：${monitoringData.pendingProposals}个
• 系统健康状态：${monitoringData.systemHealth}
• 网络活跃度：${monitoringData.networkActivity}
• 安全状态：${monitoringData.securityStatus}

⚡ 性能指标：
• 平均响应时间：${monitoringData.performanceMetrics.avgResponseTime}
• 系统正常运行时间：${monitoringData.performanceMetrics.uptime}
• 错误率：${monitoringData.performanceMetrics.errorRate}

🚨 最近告警：
${alertsList}

💡 建议操作：
• 继续监控异常投票模式
• 审查高频提案创建
• 保持安全参数更新
• 定期备份系统数据
    `.trim();
    
    alert(message);
}

// 批准提案
function approveProposal(proposalId) {
    const confirmMessage = `确认批准提案 ${proposalId} 吗？\n\n✅ 批准后的操作：\n• 提案将进入正式投票阶段\n• 发送通知给社区成员\n• 记录审核日志\n• 更新提案状态`;
    
    if (confirm(confirmMessage)) {
        showToast('处理中', '正在批准提案...', 'info');
        
        setTimeout(() => {
            // 更新提案状态
            const proposalItem = document.querySelector(`[data-proposal-id="${proposalId}"]`);
            if (proposalItem) {
                // 移除待审核状态
                proposalItem.style.opacity = '0.7';
                proposalItem.style.pointerEvents = 'none';
                
                // 添加已批准标记
                const pendingId = proposalItem.querySelector('.pending-id');
                if (pendingId) {
                    pendingId.textContent = pendingId.textContent.replace('(待审核)', '(已批准)');
                }
                
                // 更新操作按钮
                const actions = proposalItem.querySelector('.pending-actions');
                if (actions) {
                    actions.innerHTML = '<span style="color: #10b981; font-size: 12px;"><i class="fas fa-check"></i> 已批准</span>';
                }
            }
            
            showToast('批准成功', `提案 ${proposalId} 已成功批准并进入投票阶段`, 'success');
            
            // 更新统计数据
            updateAdminStats('approve');
        }, 1500);
    }
}

// 拒绝提案
function rejectProposal(proposalId) {
    const reason = prompt(`请输入拒绝提案 ${proposalId} 的原因：\n\n常见原因：\n• 内容不符合规范\n• 技术方案不可行\n• 缺少必要信息\n• 重复提案\n• 其他原因`);
    
    if (reason && reason.trim()) {
        showToast('处理中', '正在拒绝提案...', 'info');
        
        setTimeout(() => {
            // 更新提案状态
            const proposalItem = document.querySelector(`[data-proposal-id="${proposalId}"]`);
            if (proposalItem) {
                proposalItem.style.opacity = '0.5';
                proposalItem.style.pointerEvents = 'none';
                
                // 添加拒绝标记
                const pendingId = proposalItem.querySelector('.pending-id');
                if (pendingId) {
                    pendingId.textContent = pendingId.textContent.replace('(待审核)', '(已拒绝)');
                }
                
                // 更新操作按钮
                const actions = proposalItem.querySelector('.pending-actions');
                if (actions) {
                    actions.innerHTML = `<span style="color: #ef4444; font-size: 12px;"><i class="fas fa-times"></i> 已拒绝</span>`;
                }
            }
            
            showToast('拒绝成功', `提案 ${proposalId} 已被拒绝，原因：${reason}`, 'success');
            
            // 更新统计数据
            updateAdminStats('reject');
        }, 1500);
    } else if (reason !== null) {
        showToast('输入错误', '请输入拒绝原因', 'error');
    }
}

// 修改提案
function modifyProposal(proposalId) {
    const modifyOptions = [
        '修改提案标题',
        '调整提案内容',
        '更新执行参数',
        '修改投票周期',
        '调整通过阈值',
        '更新优先级',
        '添加备注说明'
    ];
    
    let optionsList = modifyOptions.map((option, index) => `${index + 1}. ${option}`).join('\n');
    
    const selectedOption = prompt(`选择要修改的内容（输入序号）：\n\n${optionsList}`);
    
    if (selectedOption && selectedOption >= 1 && selectedOption <= modifyOptions.length) {
        const option = modifyOptions[selectedOption - 1];
        const newValue = prompt(`请输入新的${option}：`);
        
        if (newValue && newValue.trim()) {
            showToast('修改中', `正在修改提案 ${proposalId} 的${option}...`, 'info');
            
            setTimeout(() => {
                showToast('修改成功', `提案 ${proposalId} 的${option}已更新`, 'success');
            }, 1500);
        }
    } else if (selectedOption !== null) {
        showToast('输入错误', '请输入有效的序号（1-7）', 'error');
    }
}

// 强制执行
function forceExecute(proposalId) {
    const confirmMessage = `⚠️ 确认强制执行系统提案 ${proposalId} 吗？\n\n🚨 警告：\n• 此操作将跳过正常投票流程\n• 立即执行提案内容\n• 无法撤销执行结果\n• 将记录强制执行日志\n\n请确保您有足够的权限执行此操作。`;
    
    if (confirm(confirmMessage)) {
        // 二次确认
        const secondConfirm = confirm(`最后确认：您确定要强制执行提案 ${proposalId} 吗？\n\n此操作不可撤销！`);
        
        if (secondConfirm) {
            showToast('执行中', '正在强制执行系统提案...', 'warning');
            
            setTimeout(() => {
                // 更新提案状态
                const proposalItem = document.querySelector(`[data-proposal-id="${proposalId}"]`);
                if (proposalItem) {
                    // 添加执行完成标记
                    const statusBadge = proposalItem.querySelector('.priority-badge');
                    if (statusBadge) {
                        statusBadge.textContent = '已强制执行';
                        statusBadge.className = 'priority-badge priority-high';
                    }
                    
                    // 更新操作按钮
                    const actions = proposalItem.querySelector('.admin-actions');
                    if (actions) {
                        actions.innerHTML = '<span style="color: #ef4444; font-size: 12px;"><i class="fas fa-bolt"></i> 已强制执行</span>';
                    }
                }
                
                showToast('执行成功', `系统提案 ${proposalId} 已强制执行`, 'success');
                
                // 更新统计数据
                updateAdminStats('execute');
            }, 3000);
        }
    }
}

// 暂停提案
function pauseProposal(proposalId) {
    const confirmMessage = `确认暂停系统提案 ${proposalId} 吗？\n\n⏸️ 暂停后：\n• 提案执行将被暂停\n• 可以随时恢复执行\n• 暂停期间不会有任何变更\n• 将通知相关人员`;
    
    if (confirm(confirmMessage)) {
        showToast('处理中', '正在暂停系统提案...', 'info');
        
        setTimeout(() => {
            // 更新提案状态
            const proposalItem = document.querySelector(`[data-proposal-id="${proposalId}"]`);
            if (proposalItem) {
                // 添加暂停标记
                const statusBadge = proposalItem.querySelector('.priority-badge');
                if (statusBadge) {
                    statusBadge.textContent = '已暂停';
                    statusBadge.className = 'priority-badge priority-medium';
                }
                
                // 更新操作按钮
                const actions = proposalItem.querySelector('.admin-actions');
                if (actions) {
                    actions.innerHTML = `
                        <button class="force-execute-btn" onclick="resumeProposal('${proposalId}')">
                            <i class="fas fa-play"></i>
                            恢复
                        </button>
                        <span style="color: #fbbf24; font-size: 12px;"><i class="fas fa-pause"></i> 已暂停</span>
                    `;
                }
            }
            
            showToast('暂停成功', `系统提案 ${proposalId} 已暂停执行`, 'success');
        }, 1500);
    }
}

// 恢复提案
function resumeProposal(proposalId) {
    if (confirm(`确认恢复系统提案 ${proposalId} 的执行吗？`)) {
        showToast('处理中', '正在恢复系统提案...', 'info');
        
        setTimeout(() => {
            showToast('恢复成功', `系统提案 ${proposalId} 已恢复执行`, 'success');
        }, 1500);
    }
}

// 更新管理员统计数据
function updateAdminStats(action) {
    const statCards = document.querySelectorAll('.admin-stat-card .admin-stat-value');
    
    if (statCards.length >= 2) {
        switch (action) {
            case 'approve':
                // 减少待审核数量
                const pending = parseInt(statCards[1].textContent);
                if (pending > 0) {
                    statCards[1].textContent = pending - 1;
                }
                
                // 增加进行中数量
                if (statCards[2]) {
                    const active = parseInt(statCards[2].textContent);
                    statCards[2].textContent = active + 1;
                }
                break;
                
            case 'reject':
                // 减少待审核数量
                const pendingReject = parseInt(statCards[1].textContent);
                if (pendingReject > 0) {
                    statCards[1].textContent = pendingReject - 1;
                }
                
                // 增加已拒绝数量
                if (statCards[4]) {
                    const rejected = parseInt(statCards[4].textContent);
                    statCards[4].textContent = rejected + 1;
                }
                break;
                
            case 'execute':
                // 增加已完成数量
                if (statCards[3]) {
                    const completed = parseInt(statCards[3].textContent);
                    statCards[3].textContent = completed + 1;
                }
                break;
        }
    }
}

// 导出管理员专属功能
window.reviewProposals = reviewProposals;
window.manageGovernance = manageGovernance;
window.configureSystem = configureSystem;
window.monitorActivity = monitorActivity;
window.approveProposal = approveProposal;
window.rejectProposal = rejectProposal;
window.modifyProposal = modifyProposal;
window.forceExecute = forceExecute;
window.pauseProposal = pauseProposal;
window.resumeProposal = resumeProposal; 