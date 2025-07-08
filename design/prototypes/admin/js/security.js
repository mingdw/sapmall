/* 安全设置页面专用JavaScript */

// 安全设置数据
const securityData = {
    // 安全评分
    securityScore: 65,
    
    // 安全设置状态
    settings: {
        transactionConfirmation: true,
        highValueAlert: true,
        contractInteractionWarning: true,
        autoLock: true,
        addressWhitelist: false
    },
    
    // 已连接设备
    connectedDevices: [
        {
            id: '1',
            name: 'Windows Chrome',
            ip: '192.168.1.1',
            lastActive: '2024-06-01 14:30:22',
            isCurrent: true
        },
        {
            id: '2',
            name: 'iPhone Safari',
            ip: '172.16.0.5',
            lastActive: '2024-05-28 09:15:43',
            isCurrent: false
        },
        {
            id: '3',
            name: 'macOS Firefox',
            ip: '10.0.0.8',
            lastActive: '2024-05-25 18:22:10',
            isCurrent: false
        }
    ],
    
    // 白名单地址
    whitelistAddresses: [
        { id: '1', label: '个人储蓄钱包', address: '0x1a2b3c4d5e6f7g8h9i0j' },
        { id: '2', label: '交易所账户', address: '0xabcdef1234567890abcdef' }
    ]
};

// 安全设置页面对象
const SecurityPage = {
    // 当前步骤 (用于双重认证设置)
    currentStep: 1,
    
    // 初始化
    init: function() {
        this.setupEventListeners();
        this.updateSecurityScore();
    },
    
    // 设置事件监听器
    setupEventListeners: function() {
        // 安全设置开关
        const toggleSwitches = document.querySelectorAll('.toggle-switch input');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('change', this.handleToggleChange);
        });
        
        // 设置双重认证按钮
        const setupTwoFactorBtn = document.getElementById('setupTwoFactorBtn');
        if (setupTwoFactorBtn) {
            setupTwoFactorBtn.addEventListener('click', this.openTwoFactorModal);
        }
        
        // 管理白名单按钮
        const manageWhitelistBtn = document.getElementById('manageWhitelistBtn');
        if (manageWhitelistBtn) {
            manageWhitelistBtn.addEventListener('click', this.openWhitelistModal);
        }
        
        // 紧急冻结账户按钮
        const freezeAccountBtn = document.getElementById('freezeAccountBtn');
        if (freezeAccountBtn) {
            freezeAccountBtn.addEventListener('click', this.openFreezeAccountModal);
        }
        
        // 设置恢复选项按钮
        const setupRecoveryBtn = document.getElementById('setupRecoveryBtn');
        if (setupRecoveryBtn) {
            setupRecoveryBtn.addEventListener('click', this.handleSetupRecovery);
        }
        
        // 断开设备连接按钮
        const disconnectBtns = document.querySelectorAll('.device-action .btn-danger');
        disconnectBtns.forEach(btn => {
            btn.addEventListener('click', this.handleDisconnectDevice);
        });
        
        // 关闭模态框按钮
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', this.closeAllModals);
        });
        
        // 双重认证模态框的上一步/下一步按钮
        const prevStepBtn = document.getElementById('prevStepBtn');
        const nextStepBtn = document.getElementById('nextStepBtn');
        if (prevStepBtn && nextStepBtn) {
            prevStepBtn.addEventListener('click', () => this.navigateStep(-1));
            nextStepBtn.addEventListener('click', () => this.navigateStep(1));
        }
        
        // 白名单模态框的添加按钮
        const addAddressBtn = document.getElementById('addAddressBtn');
        if (addAddressBtn) {
            addAddressBtn.addEventListener('click', this.addWhitelistAddress);
        }
        
        // 白名单模态框的删除按钮
        const deleteAddressBtns = document.querySelectorAll('.delete-address');
        deleteAddressBtns.forEach(btn => {
            btn.addEventListener('click', this.deleteWhitelistAddress);
        });
        
        // 冻结账户模态框的输入框
        const freezeConfirmInput = document.getElementById('freezeConfirmInput');
        if (freezeConfirmInput) {
            freezeConfirmInput.addEventListener('input', this.validateFreezeConfirm);
        }
        
        // 冻结账户模态框的取消按钮
        const cancelFreezeBtn = document.getElementById('cancelFreezeBtn');
        if (cancelFreezeBtn) {
            cancelFreezeBtn.addEventListener('click', this.closeAllModals);
        }
        
        // 冻结账户模态框的确认按钮
        const confirmFreezeBtn = document.getElementById('confirmFreezeBtn');
        if (confirmFreezeBtn) {
            confirmFreezeBtn.addEventListener('click', this.handleFreezeAccount);
        }
    },
    
    // 处理开关变化
    handleToggleChange: function() {
        const settingId = this.id;
        const isChecked = this.checked;
        
        // 更新数据
        securityData.settings[settingId] = isChecked;
        
        // 显示提示
        const settingName = {
            'transactionConfirmation': '交易确认',
            'highValueAlert': '高额交易提醒',
            'contractInteractionWarning': '合约交互警告',
            'autoLock': '自动锁定',
            'addressWhitelist': '地址白名单'
        };
        
        PageUtils.showToast('设置已更新', `${settingName[settingId]}已${isChecked ? '启用' : '禁用'}`, isChecked ? 'success' : 'info');
        
        // 更新安全评分
        SecurityPage.updateSecurityScore();
    },
    
    // 打开双重认证模态框
    openTwoFactorModal: function() {
        const modal = document.getElementById('twoFactorModal');
        if (modal) {
            modal.classList.add('active');
            SecurityPage.resetTwoFactorSteps();
        }
    },
    
    // 打开白名单模态框
    openWhitelistModal: function() {
        const modal = document.getElementById('whitelistModal');
        if (modal) {
            modal.classList.add('active');
        }
    },
    
    // 打开冻结账户模态框
    openFreezeAccountModal: function() {
        const modal = document.getElementById('freezeAccountModal');
        if (modal) {
            modal.classList.add('active');
            
            // 重置输入框
            const input = document.getElementById('freezeConfirmInput');
            const confirmBtn = document.getElementById('confirmFreezeBtn');
            if (input && confirmBtn) {
                input.value = '';
                confirmBtn.disabled = true;
            }
        }
    },
    
    // 关闭所有模态框
    closeAllModals: function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    },
    
    // 重置双重认证步骤
    resetTwoFactorSteps: function() {
        // 重置当前步骤
        SecurityPage.currentStep = 1;
        
        // 更新步骤状态
        const steps = document.querySelectorAll('.setup-steps .step');
        steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // 更新内容显示
        const contents = document.querySelectorAll('.step-content-item');
        contents.forEach((content, index) => {
            if (index === 0) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // 更新按钮状态
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        if (prevBtn && nextBtn) {
            prevBtn.disabled = true;
            nextBtn.textContent = '下一步';
        }
    },
    
    // 导航步骤
    navigateStep: function(direction) {
        const newStep = SecurityPage.currentStep + direction;
        
        // 检查步骤范围
        if (newStep < 1 || newStep > 3) return;
        
        // 更新当前步骤
        SecurityPage.currentStep = newStep;
        
        // 更新步骤状态
        const steps = document.querySelectorAll('.setup-steps .step');
        steps.forEach((step, index) => {
            if (index + 1 < newStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === newStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // 更新内容显示
        const contents = document.querySelectorAll('.step-content-item');
        contents.forEach((content, index) => {
            if (index + 1 === newStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // 更新按钮状态
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        if (prevBtn && nextBtn) {
            prevBtn.disabled = newStep === 1;
            
            if (newStep === 3) {
                nextBtn.textContent = '完成';
            } else {
                nextBtn.textContent = '下一步';
            }
            
            // 如果是最后一步点击完成，则完成设置
            if (newStep === 3 && direction === 1) {
                nextBtn.addEventListener('click', SecurityPage.completeTwoFactorSetup, { once: true });
            }
        }
    },
    
    // 完成双重认证设置
    completeTwoFactorSetup: function() {
        // 获取验证码输入
        const verificationInput = document.querySelector('.step-content-item[data-step-content="3"] .form-input');
        
        if (!verificationInput || !verificationInput.value) {
            PageUtils.showToast('验证失败', '请输入验证码', 'error');
            return;
        }
        
        // 模拟验证成功
        PageUtils.showToast('设置成功', '双重认证已成功启用', 'success');
        
        // 关闭模态框
        SecurityPage.closeAllModals();
        
        // 更新按钮状态
        const setupBtn = document.getElementById('setupTwoFactorBtn');
        if (setupBtn) {
            setupBtn.innerHTML = '<i class="fas fa-check"></i> 已设置';
            setupBtn.classList.remove('btn-primary');
            setupBtn.classList.add('btn-success');
        }
        
        // 更新安全评分
        SecurityPage.updateSecurityScore(10);
    },
    
    // 添加白名单地址
    addWhitelistAddress: function() {
        const labelInput = document.getElementById('addressLabel');
        const addressInput = document.getElementById('addressValue');
        
        if (!labelInput || !addressInput) return;
        
        const label = labelInput.value.trim();
        const address = addressInput.value.trim();
        
        if (!label || !address) {
            PageUtils.showToast('添加失败', '请填写标签和地址', 'error');
            return;
        }
        
        // 创建新地址对象
        const newAddress = {
            id: Date.now().toString(),
            label: label,
            address: address
        };
        
        // 添加到数据
        securityData.whitelistAddresses.push(newAddress);
        
        // 添加到表格
        const tbody = document.getElementById('whitelistTableBody');
        if (tbody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${label}</td>
                <td><span class="address-value">${address}</span></td>
                <td>
                    <button class="btn btn-danger btn-sm delete-address">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            // 添加删除事件
            const deleteBtn = tr.querySelector('.delete-address');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', SecurityPage.deleteWhitelistAddress);
            }
            
            tbody.appendChild(tr);
        }
        
        // 清空输入框
        labelInput.value = '';
        addressInput.value = '';
        
        // 显示提示
        PageUtils.showToast('添加成功', '地址已添加到白名单', 'success');
    },
    
    // 删除白名单地址
    deleteWhitelistAddress: function() {
        // 获取行元素
        const tr = this.closest('tr');
        if (!tr) return;
        
        // 获取地址
        const addressElement = tr.querySelector('.address-value');
        if (!addressElement) return;
        
        const address = addressElement.textContent;
        
        // 从数据中删除
        securityData.whitelistAddresses = securityData.whitelistAddresses.filter(item => item.address !== address);
        
        // 从表格中删除
        tr.remove();
        
        // 显示提示
        PageUtils.showToast('删除成功', '地址已从白名单移除', 'success');
    },
    
    // 验证冻结确认输入
    validateFreezeConfirm: function() {
        const confirmBtn = document.getElementById('confirmFreezeBtn');
        if (!confirmBtn) return;
        
        // 检查输入是否为"FREEZE"
        confirmBtn.disabled = this.value !== 'FREEZE';
    },
    
    // 处理冻结账户
    handleFreezeAccount: function() {
        // 显示提示
        PageUtils.showToast('账户已冻结', '您的账户已被紧急冻结，请联系客服解冻', 'warning');
        
        // 关闭模态框
        SecurityPage.closeAllModals();
    },
    
    // 处理设置恢复选项
    handleSetupRecovery: function() {
        // 显示提示
        PageUtils.showToast('功能开发中', '账户恢复选项设置功能即将推出', 'info');
    },
    
    // 处理断开设备连接
    handleDisconnectDevice: function() {
        // 获取设备信息
        const deviceItem = this.closest('.device-item');
        if (!deviceItem) return;
        
        const deviceName = deviceItem.querySelector('.device-details h4').textContent.split('<')[0].trim();
        
        // 显示确认提示
        if (confirm(`确定要断开 ${deviceName} 的连接吗？`)) {
            // 从DOM中移除
            deviceItem.remove();
            
            // 显示提示
            PageUtils.showToast('断开成功', `${deviceName} 已断开连接`, 'success');
        }
    },
    
    // 更新安全评分
    updateSecurityScore: function(bonus = 0) {
        // 基础分数
        let score = 40;
        
        // 根据设置计算分数
        if (securityData.settings.transactionConfirmation) score += 10;
        if (securityData.settings.highValueAlert) score += 10;
        if (securityData.settings.contractInteractionWarning) score += 10;
        if (securityData.settings.autoLock) score += 5;
        if (securityData.settings.addressWhitelist) score += 10;
        
        // 添加额外分数 (如双重认证)
        score += bonus;
        
        // 限制最大分数为100
        score = Math.min(score, 100);
        
        // 更新数据
        securityData.securityScore = score;
        
        // 更新UI
        const scoreText = document.querySelector('.percentage');
        const scorePath = document.querySelector('.circle');
        
        if (scoreText && scorePath) {
            scoreText.textContent = score + '%';
            scorePath.setAttribute('stroke-dasharray', `${score}, 100`);
            
            // 根据分数设置颜色
            let color = '#3b82f6'; // 默认蓝色
            
            if (score < 50) {
                color = '#ef4444'; // 红色
            } else if (score < 80) {
                color = '#f59e0b'; // 黄色
            } else {
                color = '#10b981'; // 绿色
            }
            
            scorePath.setAttribute('stroke', color);
        }
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    SecurityPage.init();
});

// 页面工具对象
const PageUtils = {
    // 显示提示
    showToast: function(title, message, type = 'info') {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // 设置图标
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'times-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        // 设置内容
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <div class="toast-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(toast);
        
        // 添加CSS
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    display: flex;
                    align-items: center;
                    background: rgba(15, 23, 42, 0.9);
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 9999;
                    min-width: 300px;
                    max-width: 400px;
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                }
                
                .toast.show {
                    transform: translateX(0);
                }
                
                .toast-icon {
                    font-size: 24px;
                    margin-right: 16px;
                }
                
                .toast-content {
                    flex: 1;
                }
                
                .toast-content h4 {
                    color: #f1f5f9;
                    margin: 0 0 5px 0;
                    font-size: 16px;
                    font-weight: 500;
                }
                
                .toast-content p {
                    color: #94a3b8;
                    margin: 0;
                    font-size: 14px;
                }
                
                .toast-close {
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    margin-left: 16px;
                }
                
                .toast-info .toast-icon {
                    color: #3b82f6;
                }
                
                .toast-success .toast-icon {
                    color: #10b981;
                }
                
                .toast-error .toast-icon {
                    color: #ef4444;
                }
                
                .toast-warning .toast-icon {
                    color: #f59e0b;
                }
            `;
            document.head.appendChild(style);
        }
        
        // 显示提示
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // 添加关闭事件
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            });
        }
        
        // 自动关闭
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
    }
}; 