/**
 * 管理后台调试工具
 * 用于开发和测试阶段的调试功能
 */

// 页面加载完成后的处理
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 管理后台加载完成，使用JavaScript自适应高度方案');
    
    // 监听iframe加载，仅用于日志记录
    const iframe = document.getElementById('contentIframe');
    if (iframe) {
        iframe.addEventListener('load', function() {
            console.log('✅ 页面加载完成:', iframe.src);
            
            // 延迟触发高度检测，确保内容完全渲染
            setTimeout(() => {
                if (window.checkIframeHeight) {
                    window.checkIframeHeight();
                }
            }, 1000);
        });
    }
});

// 调试工具：手动检查iframe高度
window.manualHeightCheck = function() {
    if (window.recalculateHeight) {
        window.recalculateHeight();
        console.log('🔧 手动触发高度重新计算');
    } else {
        console.warn('⚠️ 高度管理器未初始化');
    }
};

// 调试工具：强力设置iframe高度
window.forceHeight = function(height = 1000) {
    const iframe = document.getElementById('contentIframe');
    if (iframe) {
        iframe.setAttribute('style', `
            width: 100% !important;
            height: ${height}px !important;
            min-height: ${height}px !important;
            border: none !important;
            background: transparent !important;
            overflow: visible !important;
            display: block !important;
            border-bottom-left-radius: 16px !important;
            border-bottom-right-radius: 16px !important;
        `);
        console.log('💪 强力设置高度:', height + 'px');
    } else {
        console.warn('⚠️ iframe元素未找到');
    }
};

// 调试工具：显示当前iframe信息
window.showIframeInfo = function() {
    if (window.debugHeight) {
        window.debugHeight();
    } else {
        const iframe = document.getElementById('contentIframe');
        if (iframe) {
            console.log('📊 详细Iframe信息:');
            console.log('- 当前源:', iframe.src);
            console.log('- 实际高度:', iframe.offsetHeight + 'px');
            console.log('- CSS高度:', getComputedStyle(iframe).height);
            console.log('- 内联样式高度:', iframe.style.height);
            console.log('- 视窗高度:', window.innerHeight + 'px');
            console.log('- 容器信息:');
            
            // 检查各个容器的高度
            const containers = [
                '.admin-container',
                '.content-area', 
                '.admin-main-card',
                '.admin-main-card-body'
            ];
            
            containers.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`  - ${selector}: ${element.offsetHeight}px (CSS: ${getComputedStyle(element).height})`);
                }
            });
            
            // 检查iframe内容（如果可以访问）
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc && iframeDoc.body) {
                    console.log('- iframe内容高度:');
                    console.log(`  - body.scrollHeight: ${iframeDoc.body.scrollHeight}px`);
                    console.log(`  - documentElement.scrollHeight: ${iframeDoc.documentElement.scrollHeight}px`);
                    console.log(`  - body.offsetHeight: ${iframeDoc.body.offsetHeight}px`);
                }
            } catch (e) {
                console.log('- iframe内容: 无法访问（跨域）');
            }
        }
    }
};

// 调试工具：测试页面切换
window.testPageSwitch = function() {
    console.log('🧪 开始测试页面切换...');
    const testPages = [
        { url: 'profile.html', title: '个人信息', icon: 'fas fa-user' },
        { url: 'security.html', title: '安全设置', icon: 'fas fa-shield-alt' },
        { url: 'profile.html', title: '个人信息', icon: 'fas fa-user' }
    ];
    
    let index = 0;
    const switchNext = () => {
        if (index < testPages.length) {
            const page = testPages[index];
            console.log(`🔄 切换到: ${page.title} (${page.url})`);
            
            // 使用loadPage函数切换页面
            if (window.loadPage) {
                window.loadPage(page.url, page.title, page.icon);
            }
            
            index++;
            setTimeout(switchNext, 3000); // 3秒后切换下一个
        } else {
            console.log('✅ 页面切换测试完成');
        }
    };
    
    switchNext();
};

// 调试工具：显示管理器状态
window.showManagerStatus = function() {
    if (window.iframeHeightManager) {
        const manager = window.iframeHeightManager;
        console.log('📊 防覆盖高度管理器状态:');
        console.log('- 最后URL:', manager.lastUrl);
        console.log('- 当前操作ID:', manager.operationId);
        console.log('- 是否有进行中的操作:', manager.currentOperation ? '是' : '否');
        console.log('- 管理器类型: 防覆盖版');
        
        // 显示当前iframe信息
        const iframe = document.getElementById('contentIframe');
        if (iframe) {
            console.log('- 当前iframe URL:', iframe.src);
            console.log('- 当前iframe高度:', iframe.offsetHeight + 'px');
        }
    } else {
        console.warn('⚠️ 高度管理器未找到');
    }
}; 