/**
 * 简化的iframe高度自适应管理器
 * 修复页面切换时高度覆盖问题
 */

class SimpleIframeHeightManager {
    constructor() {
        this.iframe = null;
        this.lastUrl = '';
        this.currentOperation = null; // 当前操作的引用
        this.operationId = 0; // 操作ID，用于识别是否是最新操作
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.iframe = document.getElementById('contentIframe');
        if (!this.iframe) {
            console.warn('ContentIframe not found');
            return;
        }
        
        console.log('🎯 启动简化的iframe高度管理器（防覆盖版）');
        
        // 监听iframe加载完成
        this.iframe.addEventListener('load', () => this.handleIframeLoad());
        
        // 监听来自iframe的消息
        window.addEventListener('message', (event) => this.handleMessage(event));
        
        // 记录初始URL
        this.lastUrl = this.iframe.src;
    }
    
    handleIframeLoad() {
        const currentUrl = this.iframe.src;
        
        console.log('📄 Iframe加载完成:', currentUrl);
        
        // 检查是否是新页面
        const isNewPage = currentUrl !== this.lastUrl;
        
        if (isNewPage) {
            console.log('🔄 检测到页面切换，取消之前的操作');
            this.cancelCurrentOperation();
        }
        
        this.lastUrl = currentUrl;
        
        // 创建新的操作ID
        this.operationId++;
        const currentOperationId = this.operationId;
        
        console.log(`📐 开始计算高度 (操作ID: ${currentOperationId})`);
        
        // 延迟计算高度，确保内容完全渲染
        this.currentOperation = setTimeout(() => {
            // 检查操作是否仍然有效
            if (currentOperationId === this.operationId) {
                this.calculateAndSetHeight(currentOperationId);
            } else {
                console.log(`⏹️ 操作已取消 (ID: ${currentOperationId})`);
            }
        }, 300);
    }
    
    cancelCurrentOperation() {
        if (this.currentOperation) {
            clearTimeout(this.currentOperation);
            this.currentOperation = null;
            console.log('🚫 已取消当前高度计算操作');
        }
    }
    
    calculateAndSetHeight(operationId) {
        // 再次检查操作是否仍然有效
        if (operationId !== this.operationId) {
            console.log(`⏹️ 操作已过期，跳过设置 (ID: ${operationId})`);
            return;
        }
        
        console.log(`📐 执行高度计算 (操作ID: ${operationId})`);
        
        try {
            // 尝试直接获取iframe内容高度
            const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            
            if (iframeDoc && iframeDoc.body) {
                // 等待DOM完全渲染
                setTimeout(() => {
                    // 最后一次检查操作有效性
                    if (operationId !== this.operationId) {
                        console.log(`⏹️ DOM渲染等待期间操作被取消 (ID: ${operationId})`);
                        return;
                    }
                    
                    // 多种方式获取内容高度，选择最大值
                    const heights = [
                        iframeDoc.body.scrollHeight,
                        iframeDoc.documentElement.scrollHeight,
                        iframeDoc.body.offsetHeight,
                        iframeDoc.documentElement.offsetHeight,
                        iframeDoc.body.clientHeight,
                        iframeDoc.documentElement.clientHeight
                    ].filter(h => h > 0);
                    
                    const contentHeight = Math.max(...heights, 400);
                    
                    console.log(`✅ 获取内容高度详情 (操作ID: ${operationId}):`);
                    console.log(`- body.scrollHeight: ${iframeDoc.body.scrollHeight}px`);
                    console.log(`- documentElement.scrollHeight: ${iframeDoc.documentElement.scrollHeight}px`);
                    console.log(`- body.offsetHeight: ${iframeDoc.body.offsetHeight}px`);
                    console.log(`- documentElement.offsetHeight: ${iframeDoc.documentElement.offsetHeight}px`);
                    console.log(`- 最终选择高度: ${contentHeight}px`);
                    
                    this.setHeight(contentHeight, operationId);
                }, 300); // 增加等待时间，确保内容完全渲染
                
            } else {
                // 跨域情况，请求iframe内容报告高度
                console.log(`📡 跨域情况，请求iframe报告高度 (操作ID: ${operationId})`);
                this.requestHeightFromIframe(operationId);
                
                // 设置超时，避免无限等待
                setTimeout(() => {
                    if (operationId === this.operationId) {
                        console.log(`⏰ 跨域高度获取超时，使用默认高度 (操作ID: ${operationId})`);
                        this.setHeight(800, operationId);
                    }
                }, 3000); // 增加超时时间
            }
            
        } catch (error) {
            console.log(`📡 跨域保护，使用消息通信 (操作ID: ${operationId})`);
            this.requestHeightFromIframe(operationId);
            
            // 设置超时
            setTimeout(() => {
                if (operationId === this.operationId) {
                    console.log(`⏰ 消息通信超时，使用默认高度 (操作ID: ${operationId})`);
                    this.setHeight(800, operationId);
                }
            }, 3000);
        }
    }
    
    setHeight(height, operationId) {
        // 最终检查操作有效性
        if (operationId !== this.operationId) {
            console.log(`⏹️ 设置高度时操作已过期，跳过 (ID: ${operationId})`);
            return;
        }
        
        const finalHeight = Math.max(height, 400);
        console.log(`💪 设置iframe高度: ${finalHeight}px (操作ID: ${operationId})`);
        
        // 强力设置iframe高度，覆盖所有CSS规则
        this.iframe.setAttribute('style', `
            width: 100% !important;
            height: ${finalHeight}px !important;
            min-height: ${finalHeight}px !important;
            max-height: none !important;
            border: none !important;
            background: transparent !important;
            overflow: visible !important;
            display: block !important;
            border-bottom-left-radius: 16px !important;
            border-bottom-right-radius: 16px !important;
            flex: none !important;
            contain: none !important;
        `);
        
        // 同时设置CSS属性，确保兼容性
        this.iframe.style.setProperty('height', `${finalHeight}px`, 'important');
        this.iframe.style.setProperty('min-height', `${finalHeight}px`, 'important');
        
        // 设置容器样式，确保容器能够适应内容
        const containers = [
            { selector: '.admin-main-card', extraHeight: 100 },
            { selector: '.admin-main-card-body', extraHeight: 20 },
            { selector: '.content-area', extraHeight: 120 }
        ];
        
        containers.forEach(({ selector, extraHeight }) => {
            const element = document.querySelector(selector);
            if (element) {
                const containerHeight = finalHeight + extraHeight;
                element.setAttribute('style', `
                    height: auto !important;
                    min-height: ${containerHeight}px !important;
                    max-height: none !important;
                    overflow: visible !important;
                    flex: 1 !important;
                    contain: none !important;
                `);
                element.style.setProperty('min-height', `${containerHeight}px`, 'important');
            }
        });
        
        // 验证设置结果
        setTimeout(() => {
            const actualHeight = this.iframe.offsetHeight;
            console.log(`✅ 高度设置完成 (操作ID: ${operationId})`);
            console.log(`- 期望高度: ${finalHeight}px`);
            console.log(`- 实际高度: ${actualHeight}px`);
            console.log(`- 当前URL: ${this.iframe.src}`);
            
            if (Math.abs(actualHeight - finalHeight) > 10) {
                console.warn(`⚠️ 高度设置可能未生效，期望${finalHeight}px，实际${actualHeight}px`);
            }
        }, 100);
        
        // 清理当前操作
        this.currentOperation = null;
    }
    
    requestHeightFromIframe(operationId) {
        try {
            if (this.iframe.contentWindow) {
                this.iframe.contentWindow.postMessage({
                    type: 'requestHeight',
                    source: 'heightManager',
                    operationId: operationId // 传递操作ID
                }, '*');
                console.log(`📤 已请求iframe报告高度 (操作ID: ${operationId})`);
            }
        } catch (error) {
            console.warn(`⚠️ 无法向iframe发送消息: ${error.message} (操作ID: ${operationId})`);
        }
    }
    
    handleMessage(event) {
        if (event.data && event.data.type === 'reportHeight' && event.data.height) {
            const reportedHeight = parseInt(event.data.height);
            const messageOperationId = event.data.operationId || this.operationId; // 兼容性处理
            
            if (reportedHeight > 0) {
                console.log(`📊 收到iframe高度报告: ${reportedHeight}px (操作ID: ${messageOperationId})`);
                
                // 检查消息是否对应当前操作
                if (messageOperationId === this.operationId) {
                    this.setHeight(reportedHeight, messageOperationId);
                } else {
                    console.log(`⏹️ 收到过期的高度报告，忽略 (消息ID: ${messageOperationId}, 当前ID: ${this.operationId})`);
                }
            }
        }
    }
    
    // 手动触发高度重新计算（供外部调用）
    recalculate() {
        console.log('🔧 手动重新计算高度');
        
        // 取消当前操作
        this.cancelCurrentOperation();
        
        // 创建新的操作ID
        this.operationId++;
        const currentOperationId = this.operationId;
        
        console.log(`📐 开始手动计算高度 (操作ID: ${currentOperationId})`);
        
        // 立即计算高度
        this.currentOperation = setTimeout(() => {
            if (currentOperationId === this.operationId) {
                this.calculateAndSetHeight(currentOperationId);
            }
        }, 100);
    }
}

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
            
            console.log(`📤 报告页面高度: ${height}px${operationId ? ` (操作ID: ${operationId})` : ''}`);
            
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    type: 'reportHeight',
                    height: height,
                    source: 'IframeHeightReporter',
                    operationId: operationId // 传递操作ID
                }, '*');
            }
            
            return height;
        } catch (error) {
            console.warn('⚠️ 高度报告失败:', error.message);
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
                const operationId = event.data.operationId; // 获取操作ID
                setTimeout(() => this.reportHeight(operationId), 100);
            }
        });
        
        console.log('✅ iframe内容高度自动报告已启动（支持操作ID）');
    }
};

// 自动初始化
const heightManager = new SimpleIframeHeightManager();

// 导出到全局作用域
window.iframeHeightManager = heightManager;
window.recalculateHeight = () => heightManager.recalculate();

// 简化的调试工具
window.debugHeight = function() {
    const iframe = document.getElementById('contentIframe');
    if (iframe) {
        console.log('🔍 iframe高度信息:');
        console.log('- 当前URL:', iframe.src);
        console.log('- 实际高度:', iframe.offsetHeight + 'px');
        console.log('- CSS高度:', getComputedStyle(iframe).height);
        console.log('- 内联样式:', iframe.style.height);
        
        // 显示管理器状态
        if (window.iframeHeightManager) {
            const manager = window.iframeHeightManager;
            console.log('📊 防覆盖高度管理器状态:');
            console.log('- 最后URL:', manager.lastUrl);
            console.log('- 当前操作ID:', manager.operationId);
            console.log('- 是否有进行中的操作:', manager.currentOperation ? '是' : '否');
            console.log('- 管理器类型: 防覆盖版');
        }
        
        // 尝试获取iframe内容高度
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && iframeDoc.body) {
                console.log('- 内容高度:', iframeDoc.body.scrollHeight + 'px');
            }
        } catch (e) {
            console.log('- 内容高度: 无法获取（跨域）');
        }
    }
};

// 如果当前页面在iframe中，自动启动高度报告
if (window.parent && window.parent !== window) {
    window.IframeHeightReporter.autoReport();
} 