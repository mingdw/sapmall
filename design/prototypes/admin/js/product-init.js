/* 商品管理页面初始化脚本 */

// 确保全局对象存在
window.ProductManagementPage = window.ProductManagementPage || {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 页面初始化开始 ===');
    console.log('ProductModal 状态:', typeof ProductModal);
    console.log('ProductManagementPage 状态:', typeof ProductManagementPage);
    
    // 初始化ProductModal（如果存在）
    if (window.ProductModal && typeof ProductModal.init === 'function') {
        ProductModal.init();
        console.log('✅ ProductModal 初始化完成');
    } else {
        console.warn('⚠️ ProductModal 未找到或初始化方法不存在');
    }
    
    // 初始化ProductManagementPage（如果存在）
    if (window.ProductManagementPage && typeof ProductManagementPage.init === 'function') {
        ProductManagementPage.init();
        console.log('✅ ProductManagementPage 初始化完成');
    } else {
        console.warn('⚠️ ProductManagementPage 未找到或初始化方法不存在');
    }
    
    // 绑定模态框操作方法
    bindModalMethods();
    
    // 测试模态框元素是否存在
    const modal = document.getElementById('productModal');
    console.log('模态框元素状态:', modal ? '找到' : '未找到');
    
    console.log('=== 页面初始化完成 ===');
    
    // 添加测试函数到全局
    window.testModal = function() {
        console.log('测试模态框显示...');
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
            console.log('模态框已显示');
        } else {
            console.error('找不到模态框');
        }
    };
});

// 绑定模态框相关方法
function bindModalMethods() {
    // 绑定添加商品模态框
    ProductManagementPage.showAddModal = function() { 
        console.log('尝试显示添加商品模态框...');
        
        // 首先尝试使用ProductModal
        if (typeof ProductModal !== 'undefined' && ProductModal.showAdd) {
            console.log('使用ProductModal.showAdd()');
            ProductModal.showAdd(); 
        } else {
            console.log('ProductModal不可用，使用备用方案');
            // 备用方案：直接操作DOM
            const modal = document.getElementById('productModal');
            if (modal) {
                console.log('找到模态框，显示...');
                modal.style.display = 'flex';
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                // 重置表单
                const form = document.getElementById('productForm');
                if (form) form.reset();
                
                // 更新标题
                const title = document.getElementById('modalTitle');
                if (title) title.textContent = '添加商品';
                
                const saveText = document.getElementById('saveButtonText');
                if (saveText) saveText.textContent = '保存商品';
            } else {
                console.error('找不到模态框元素');
                alert('模态框加载失败，请刷新页面重试');
            }
        }
    };
    
    // 绑定编辑商品方法
    ProductManagementPage.editProduct = function(productId) { 
        console.log('尝试编辑商品:', productId);
        
        if (typeof ProductModal !== 'undefined' && ProductModal.showEdit) {
            ProductModal.showEdit(productId); 
        } else {
            // 备用方案
            const modal = document.getElementById('productModal');
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                const title = document.getElementById('modalTitle');
                if (title) title.textContent = '编辑商品';
                
                const saveText = document.getElementById('saveButtonText');
                if (saveText) saveText.textContent = '更新商品';
            }
        }
    };
    
    // 绑定隐藏模态框方法
    ProductManagementPage.hideModal = function() { 
        console.log('隐藏模态框');
        
        if (typeof ProductModal !== 'undefined' && ProductModal.hide) {
            ProductModal.hide(); 
        } else {
            // 备用方案
            const modal = document.getElementById('productModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }
    };
    
    // 绑定保存商品方法
    ProductManagementPage.saveProduct = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.saveProduct(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    // 绑定保存草稿方法
    ProductManagementPage.saveDraft = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.saveDraft(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    // 绑定SPU图片相关方法
    window.selectSpuMainImage = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.selectSpuMainImage(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    window.addSpuImage = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.addSpuImage(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    // 绑定销售属性相关方法
    ProductManagementPage.addSalesAttr = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.addSalesAttr(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.removeSalesAttr = function(btn) { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.removeSalesAttr(btn); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.loadAttrTemplate = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.loadAttrTemplate(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    // 绑定规格属性相关方法
    ProductManagementPage.addSpecAttr = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.addSpecAttr(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.removeSpecAttr = function(btn) { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.removeSpecAttr(btn); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.addSpecValue = function(btn) { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.addSpecValue(btn); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.removeSpecValue = function(btn) { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.removeSpecValue(btn); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.generateSKUs = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.generateSKUs(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    // 绑定SKU管理相关方法
    ProductManagementPage.batchEditSKU = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.batchEditSKU(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.importSKU = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.importSKU(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.exportSKU = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.exportSKU(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.editSKUDetail = function(btn) { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.editSKUDetail(btn); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    // 绑定富文本编辑器相关方法
    ProductManagementPage.insertImage = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.insertImage(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.insertVideo = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.insertVideo(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.insertParamTable = function() { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.insertParamTable(); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    ProductManagementPage.insertTemplate = function(type) { 
        if (typeof ProductModal !== 'undefined') {
            ProductModal.insertTemplate(type); 
        } else {
            console.warn('ProductModal 未加载');
        }
    };
    
    console.log('模态框方法绑定完成');
} 