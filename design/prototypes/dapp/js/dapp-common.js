/**
 * DApp 通用 JavaScript 功能模块
 */

// 全局变量
let currentLang = 'zh';
window.currentLang = currentLang;

/**
 * 语言切换功能
 */
function updateLanguage(lang) {
    currentLang = lang;
    window.currentLang = lang; // 设置全局变量
    
    // 更新所有带语言属性的元素
    document.querySelectorAll('[data-zh], [data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });

    // 更新占位符
    document.querySelectorAll('[data-placeholder-zh], [data-placeholder-en]').forEach(element => {
        const placeholder = element.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });

    console.log(`Language switched to: ${lang}`);
}

/**
 * Toast 提示功能
 */
function showToast(message, type = 'info', duration = 3000) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 隐藏动画
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

/**
 * 获取类别显示名称
 */
function getCategoryDisplayName(categoryName) {
    const nameMap = {
        'Price': '价格',
        'Rating': '评分', 
        'Sales': '销量',
        'Time': '时间'
    };
    return nameMap[categoryName] || categoryName;
}

/**
 * 搜索功能
 */
function initSearchFeature() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length > 0) {
                this.style.borderColor = '#3b82f6';
                this.style.backgroundColor = '#374151';
            } else {
                this.style.borderColor = '';
                this.style.backgroundColor = '';
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchQuery = searchInput ? searchInput.value : '';
            const message = currentLang === 'zh' 
                ? `正在筛选: ${searchQuery || '所有商品'}` 
                : `Filtering: ${searchQuery || 'All products'}`;
            showToast(message, 'info');
        });
    }
}

/**
 * 监听来自父窗口的语言变更消息
 */
function initLanguageListener() {
    window.addEventListener('message', function(event) {
        if (event.data.type === 'LANGUAGE_CHANGE') {
            updateLanguage(event.data.language);
        }
    });
}

/**
 * 初始化所有功能
 */
function initDAppCommon() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DApp common functions initializing...');
        
        // 初始化各个功能模块
        initLanguageListener();
        
        console.log('DApp common functions initialized');
    });
}

// 自动初始化
initDAppCommon();

// 导出主要函数供其他模块使用
window.DAppCommon = {
    updateLanguage,
    showToast,
    getCategoryDisplayName
}; 