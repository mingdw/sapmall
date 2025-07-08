/**
 * iframe高度自动报告工具
 * 用于所有在iframe中显示的内容页面
 */

// 如果当前页面在iframe中，自动启动高度报告
if (window.parent && window.parent !== window) {
    // 为iframe内容页面提供的高度报告工具（防覆盖版）
    window.IframeHeightReporter = {
        reportHeight(operationId = null) {
            try {
                const height = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.offsetHeight
                );
                
                const pageName = document.title || window.location.pathname.split('/').pop();
                console.log(`📤 ${pageName}页面报告高度: ${height}px${operationId ? ` (操作ID: ${operationId})` : ''}`);
                
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'reportHeight',
                        height: height,
                        source: 'IframeHeightReporter',
                        operationId: operationId,
                        page: window.location.pathname.split('/').pop()
                    }, '*');
                }
                
                return height;
            } catch (error) {
                console.warn(`⚠️ ${document.title || '页面'}高度报告失败:`, error.message);
                return null;
            }
        },
        
        // 页面加载完成后自动报告一次
        autoReport() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.reportHeight(), 500);
                });
            } else {
                setTimeout(() => this.reportHeight(), 500);
            }
            
            // 监听高度请求
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'requestHeight') {
                    const operationId = event.data.operationId;
                    setTimeout(() => this.reportHeight(operationId), 100);
                }
            });
            
            const pageName = document.title || window.location.pathname.split('/').pop();
            console.log(`✅ ${pageName}页面高度自动报告已启动（支持操作ID）`);
        }
    };
    
    // 启动高度报告
    window.IframeHeightReporter.autoReport();
} 