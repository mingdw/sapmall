/**
 * 页面通用脚本
 * 包含所有页面共用的功能和工具函数
 */

// 通用工具函数
const PageCommon = {
    
    // 格式化金额显示
    formatAmount(amount, currency = 'SAP') {
        if (typeof amount === 'string') {
            amount = parseFloat(amount.replace(/[^\d.-]/g, ''));
        }
        
        if (isNaN(amount)) return '0.00 ' + currency;
        
        return amount.toFixed(2) + ' ' + currency;
    },
    
    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD HH:mm') {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        switch (format) {
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'YYYY-MM-DD HH:mm':
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            case 'YYYY-MM-DD HH:mm:ss':
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            case 'MM-DD HH:mm':
                return `${month}-${day} ${hours}:${minutes}`;
            default:
                return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
    },
    
    // 相对时间格式化
    formatRelativeTime(date) {
        if (!date) return '';
        
        const now = new Date();
        const target = new Date(date);
        const diffMs = now - target;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins}分钟前`;
        if (diffHours < 24) return `${diffHours}小时前`;
        if (diffDays < 7) return `${diffDays}天前`;
        
        return this.formatDate(date, 'MM-DD HH:mm');
    },
    
    // 复制到剪贴板
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
            } else {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            this.showToast('success', '复制成功', '内容已复制到剪贴板');
            return true;
        } catch (error) {
            console.error('复制失败:', error);
            this.showToast('error', '复制失败', '无法访问剪贴板');
            return false;
        }
    },
    
    // 显示提示消息
    showToast(type = 'info', title = '', message = '') {
        // 如果存在全局showToast函数，使用它
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }
        
        // 否则创建简单的提示
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${title || this.getToastTitle(type)}</span>
            </div>
            <div class="toast-body">${message}</div>
        `;

        // 添加样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '16px',
            borderRadius: '8px',
            color: 'white',
            minWidth: '300px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        // 设置背景色
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        toast.style.background = colors[type] || colors.info;
        
        // 添加到页面
        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // 自动移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },

    // 获取提示图标
    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    // 获取提示标题
    getToastTitle(type) {
        const titles = {
            success: '成功',
            error: '错误',
            warning: '警告',
            info: '提示'
        };
        return titles[type] || '提示';
    },
    
    // 验证邮箱格式
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // 验证手机号格式
    validatePhone(phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    },
    
    // 验证钱包地址格式
    validateWalletAddress(address) {
        // 简单的以太坊地址验证
        const re = /^0x[a-fA-F0-9]{40}$/;
        return re.test(address);
    },
    
    // 生成随机ID
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // 防抖函数
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 数组分页
    paginateArray(array, page, pageSize = 10) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return {
            data: array.slice(startIndex, endIndex),
            currentPage: page,
            totalPages: Math.ceil(array.length / pageSize),
            totalItems: array.length,
            pageSize: pageSize
        };
    },
    
    // 金额转换（SAP to USD等）
    convertAmount(amount, fromCurrency = 'SAP', toCurrency = 'USD') {
        // 模拟汇率
        const rates = {
            'SAP': { 'USD': 250, 'CNY': 1800 },
            'USD': { 'SAP': 0.004, 'CNY': 7.2 },
            'CNY': { 'SAP': 0.0006, 'USD': 0.14 }
        };
        
        if (fromCurrency === toCurrency) return amount;
        
        const rate = rates[fromCurrency]?.[toCurrency];
        if (!rate) return amount;
        
        return (amount * rate).toFixed(2);
    },
    
    // 加载状态管理
    showLoading(target = document.body) {
        const loading = document.createElement('div');
        loading.id = 'page-loading';
        loading.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
            ">
                <div style="text-align: center;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 32px; margin-bottom: 16px;"></i>
                    <div>加载中...</div>
                </div>
                </div>
            `;
        
        target.appendChild(loading);
    },

    // 隐藏加载状态
    hideLoading() {
        const loading = document.getElementById('page-loading');
        if (loading) {
            loading.remove();
        }
    },
    
    // 确认对话框
    confirm(message, title = '确认操作') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                ">
                    <div style="
                        background: #1e293b;
                        border-radius: 12px;
                        padding: 24px;
                        max-width: 400px;
                        color: white;
                    ">
                        <h3 style="margin: 0 0 16px 0; color: #e2e8f0;">${title}</h3>
                        <p style="margin: 0 0 24px 0; color: #94a3b8;">${message}</p>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button id="cancel-btn" style="
                                padding: 8px 16px;
                                background: transparent;
                                border: 1px solid #64748b;
                                color: #94a3b8;
                                border-radius: 6px;
                                cursor: pointer;
                            ">取消</button>
                            <button id="confirm-btn" style="
                                padding: 8px 16px;
                                background: #3b82f6;
                                border: none;
                                color: white;
                                border-radius: 6px;
                                cursor: pointer;
                            ">确认</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            modal.querySelector('#confirm-btn').onclick = () => {
                modal.remove();
                resolve(true);
            };
            
            modal.querySelector('#cancel-btn').onclick = () => {
                modal.remove();
                resolve(false);
            };
            
            // 点击背景关闭
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            };
        });
    }
};

// 表单验证工具
const FormValidator = {
    
    // 验证单个字段
    validateField(value, rules) {
        const errors = [];
        
        // 必填验证
        if (rules.required && (!value || value.trim() === '')) {
            errors.push('此字段为必填项');
        }
        
        // 长度验证
        if (value && rules.minLength && value.length < rules.minLength) {
            errors.push(`最少需要${rules.minLength}个字符`);
        }
        
        if (value && rules.maxLength && value.length > rules.maxLength) {
            errors.push(`最多允许${rules.maxLength}个字符`);
        }
        
        // 格式验证
        if (value && rules.email && !PageCommon.validateEmail(value)) {
            errors.push('邮箱格式不正确');
        }
        
        if (value && rules.phone && !PageCommon.validatePhone(value)) {
            errors.push('手机号格式不正确');
        }
        
        if (value && rules.wallet && !PageCommon.validateWalletAddress(value)) {
            errors.push('钱包地址格式不正确');
        }
        
        return errors;
    },
    
    // 验证整个表单
    validateForm(formData, rules) {
        const errors = {};
        let isValid = true;
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const fieldErrors = this.validateField(formData[field], fieldRules);
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
                isValid = false;
            }
        }
        
        return { isValid, errors };
    },
    
    // 显示字段错误
    showFieldError(fieldName, errors) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        // 移除旧的错误提示
        const oldError = field.parentNode.querySelector('.field-error');
        if (oldError) oldError.remove();
        
        // 添加错误样式
        field.classList.add('error');
        
        if (errors.length > 0) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px;';
            errorDiv.textContent = errors[0];
            
            field.parentNode.appendChild(errorDiv);
        }
    },
    
    // 清除字段错误
    clearFieldError(fieldName) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    }
};

// 将工具函数挂载到全局
window.PageCommon = PageCommon;
window.FormValidator = FormValidator;

// 页面通用初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 页面通用脚本已加载');
    
    // 初始化所有复制按钮
    document.addEventListener('click', function(e) {
        if (e.target.matches('.copy-btn') || e.target.closest('.copy-btn')) {
            const btn = e.target.matches('.copy-btn') ? e.target : e.target.closest('.copy-btn');
            const text = btn.dataset.copy || btn.textContent;
            PageCommon.copyToClipboard(text);
        }
    });
    
    // 初始化所有表单验证
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
                e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // 这里可以添加具体的验证规则
            console.log('表单数据:', data);
        });
    });
});

console.log('✅ page-common.js 加载完成'); 