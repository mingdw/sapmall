/* 提示框功能 */

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