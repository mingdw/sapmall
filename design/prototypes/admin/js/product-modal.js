/* 商品管理模态框专用JavaScript */

const ProductModal = {
    // 当前编辑的商品ID
    currentProductId: null,
    
    // 拖拽相关属性
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    
    // 初始化模态框
    init: function() {
        console.log('ProductModal: 初始化模态框功能...');
        this.bindEvents();
        this.initFormFeatures();
        this.initDragFeature(); // 初始化拖拽功能
    },

    // 初始化拖拽功能
    initDragFeature: function() {
        const modalContainer = document.querySelector('.modal-container');
        const modalHeader = document.querySelector('.modal-header');
        
        if (!modalContainer || !modalHeader) return;

        // 鼠标按下事件
        modalHeader.addEventListener('mousedown', (e) => {
            // 如果点击的是关闭按钮，不启动拖拽
            if (e.target.closest('.modal-close')) return;
            
            this.isDragging = true;
            modalContainer.classList.add('dragging');
            
            // 计算鼠标相对于模态框的偏移
            const rect = modalContainer.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            // 阻止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            e.preventDefault();
            
            // 计算新位置
            const newX = e.clientX - this.dragOffset.x;
            const newY = e.clientY - this.dragOffset.y;
            
            // 获取视口尺寸
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const modalRect = modalContainer.getBoundingClientRect();
            
            // 边界检查
            const minX = 0;
            const minY = 0;
            const maxX = viewportWidth - modalRect.width;
            const maxY = viewportHeight - modalRect.height;
            
            // 限制在视口内
            const clampedX = Math.max(minX, Math.min(maxX, newX));
            const clampedY = Math.max(minY, Math.min(maxY, newY));
            
            // 设置新位置
            modalContainer.style.position = 'fixed';
            modalContainer.style.left = clampedX + 'px';
            modalContainer.style.top = clampedY + 'px';
            modalContainer.style.transform = 'none'; // 移除居中变换
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                modalContainer.classList.remove('dragging');
            }
        });

        // 双击标题栏重置位置
        modalHeader.addEventListener('dblclick', (e) => {
            if (e.target.closest('.modal-close')) return;
            
            this.resetModalPosition();
        });
    },

    // 重置模态框位置到中心
    resetModalPosition: function() {
        const modalContainer = document.querySelector('.modal-container');
        if (modalContainer) {
            modalContainer.style.position = 'relative';
            modalContainer.style.left = 'auto';
            modalContainer.style.top = 'auto';
            modalContainer.style.transform = '';
        }
    },

    // 绑定事件
    bindEvents: function() {
        // Tab切换事件
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // 模态框关闭事件 - 修改：只有点击模态框外部才关闭
        const modalOverlay = document.getElementById('productModal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                // 只有直接点击overlay背景才关闭，点击模态框内容不关闭
                if (e.target === modalOverlay) {
                    this.hide();
                }
            });
        }

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('show')) {
                this.hide();
            }
        });
    },

    // 初始化表单功能
    initFormFeatures: function() {
        this.initCharacterCount();
        this.initTagInput();
        this.initImageUpload();
        this.initRichEditor();
        this.initSKUManagement();
        this.initSalesAttrs();
        this.initSpecAttrs();
        this.initFormValidation();
    },

    // ==================== 模态框显示/隐藏 ====================

    // 显示添加商品模态框
    showAdd: function() {
        this.currentProductId = null;
        this.resetForm();
        document.getElementById('modalTitle').textContent = '添加商品';
        document.getElementById('saveButtonText').textContent = '保存商品';
        this.show();
    },

    // 显示编辑商品模态框
    showEdit: function(productId) {
        this.currentProductId = productId;
        
        // 这里应该从数据源获取商品信息
        const product = this.getProductById(productId);
        if (product) {
            this.populateForm(product);
            document.getElementById('modalTitle').textContent = '编辑商品';
            document.getElementById('saveButtonText').textContent = '更新商品';
            this.show();
        }
    },

    // 显示模态框
    show: function() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.add('show');
            // 不再限制body滚动，允许用户滚动查看完整的模态框内容
            // document.body.style.overflow = 'hidden';
            
            // 重置模态框位置
            this.resetModalPosition();
            
            // 初始化模态框功能
            setTimeout(() => {
                this.initFormFeatures();
            }, 100);
        }
    },

    // 隐藏模态框
    hide: function() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('show');
            // 恢复body滚动（如果之前被限制了）
            document.body.style.overflow = '';
            this.currentProductId = null;
            
            // 重置模态框位置
            this.resetModalPosition();
        }
    },

    // ==================== Tab管理 ====================

    // 切换Tab
    switchTab: function(tabId) {
        // 映射data-tab值到实际的Tab内容ID
        const tabIdMap = {
            'basic': 'basicTab',
            'sales-attrs': 'salesAttrsTab',
            'spec-attrs': 'specAttrsTab',
            'sku-management': 'skuManagementTab',
            'product-details': 'productDetailsTab',
            'seo-settings': 'seoSettingsTab'
        };
        
        // 更新导航按钮
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        
        // 更新内容区域
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const actualTabId = tabIdMap[tabId];
        const targetTab = document.getElementById(actualTabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // 特定Tab的初始化
        this.onTabSwitch(tabId);
    },

    // Tab切换后的处理
    onTabSwitch: function(tabId) {
        switch (tabId) {
            case 'sales-attrs':
                this.updateParamPreview();
                break;
            case 'spec-attrs':
                this.updateSKUPreview();
                break;
            case 'sku-management':
                this.updateBatchActions();
                break;
        }
    },

    // ==================== 表单管理 ====================

    // 重置表单
    resetForm: function() {
        const form = document.getElementById('productForm');
        if (form) {
            form.reset();
        }
        
        // 清除图片预览
        this.clearImagePreviews();
        
        // 清除标签
        const tagsList = document.getElementById('tagsList');
        if (tagsList) {
            tagsList.innerHTML = '';
        }
        
        // 重置富文本编辑器
        const editor = document.getElementById('productDetailEditor');
        if (editor) {
            editor.innerHTML = '';
        }
        
        // 重置销售属性预览
        this.updateParamPreview();
        
        // 重置SKU预览
        this.updateSKUPreview();

        // 切回第一个Tab
        this.switchTab('basic');
    },

    // 填充表单
    populateForm: function(product) {
        // 这里应该根据实际的商品数据结构来填充表单
        // 示例实现
        const fields = {
            spuName: product.name,
            productCategory: product.category,
            productStatus: product.status,
            spuSubtitle: product.subtitle,
            productBrand: product.brand,
            spuDescription: product.description
        };
        
        Object.entries(fields).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element && value !== undefined) {
                element.value = value;
            }
        });

        // 填充标签
        if (product.tags && product.tags.length > 0) {
            this.renderTags(product.tags);
        }

        // 填充富文本内容
        const editor = document.getElementById('productDetailEditor');
        if (editor && product.detailDescription) {
            editor.innerHTML = product.detailDescription;
        }
    },

    // 获取商品数据
    getProductById: function(productId) {
        // 这里应该调用实际的数据获取接口
        // 临时返回模拟数据
        return {
            id: productId,
            name: '示例商品',
            category: 'nft',
            status: 'active',
            subtitle: '示例副标题',
            brand: '示例品牌',
            description: '示例描述',
            tags: ['示例', '商品'],
            detailDescription: '<p>示例详细描述</p>'
        };
    },

    // ==================== 字符计数功能 ====================

    initCharacterCount: function() {
        const inputs = document.querySelectorAll('[maxlength]');
        inputs.forEach(input => {
            const updateCounter = () => {
                const maxLength = parseInt(input.getAttribute('maxlength'));
                const currentLength = input.value.length;
                const counter = input.parentElement.querySelector('.char-count');
                
                if (counter) {
                    counter.textContent = `${currentLength}/${maxLength}`;
                    
                    // 根据字符数量调整颜色
                    if (currentLength > maxLength * 0.9) {
                        counter.style.color = '#ef4444';
                    } else if (currentLength > maxLength * 0.8) {
                        counter.style.color = '#f59e0b';
                    } else {
                        counter.style.color = '#6b7280';
                    }
                }
            };
            
            input.addEventListener('input', updateCounter);
            updateCounter(); // 初始化
        });
    },

    // ==================== 标签管理 ====================

    initTagInput: function() {
        const tagInput = document.getElementById('productTags');
        if (!tagInput) return;
        
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = e.target.value.trim();
                if (tag) {
                    this.addTag(tag);
                    e.target.value = '';
                }
            }
        });
    },

    addTag: function(tagText) {
        const tagsList = document.getElementById('tagsList');
        if (!tagsList) return;
        
        // 检查标签是否已存在
        const existingTags = this.getCurrentTags();
        if (existingTags.includes(tagText)) {
            this.showNotification('标签已存在！', 'warning');
            return;
        }

        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            ${tagText}
            <span class="tag-remove" onclick="ProductModal.removeTag('${tagText}')">&times;</span>
        `;
        
        tagsList.appendChild(tagElement);
    },

    removeTag: function(tagText) {
        const tagsList = document.getElementById('tagsList');
        if (!tagsList) return;
        
        const tags = tagsList.querySelectorAll('.tag-item');
        tags.forEach(tag => {
            if (tag.textContent.trim().replace('×', '').trim() === tagText) {
                tag.remove();
            }
        });
    },

    getCurrentTags: function() {
        const tagsList = document.getElementById('tagsList');
        if (!tagsList) return [];
        
        return Array.from(tagsList.querySelectorAll('.tag-item')).map(tag => 
            tag.textContent.trim().replace('×', '').trim()
        );
    },

    renderTags: function(tags) {
        const tagsList = document.getElementById('tagsList');
        if (!tagsList) return;
        
        tagsList.innerHTML = '';
        tags.forEach(tag => this.addTag(tag));
    },

    // ==================== 图片上传管理 ====================

    initImageUpload: function() {
        // SPU主图上传
        const spuMainImageUpload = document.getElementById('spuMainImageUpload');
        if (spuMainImageUpload) {
            spuMainImageUpload.addEventListener('change', (e) => {
                this.handleSpuMainImageUpload(e.target.files[0]);
            });
        }

        // SPU附加图片上传
        const spuImagesUpload = document.getElementById('spuImagesUpload');
        if (spuImagesUpload) {
            spuImagesUpload.addEventListener('change', (e) => {
                this.handleSpuImagesUpload(Array.from(e.target.files));
            });
        }
    },

    selectSpuMainImage: function() {
        const input = document.getElementById('spuMainImageUpload');
        if (input) input.click();
    },

    addSpuImage: function() {
        const input = document.getElementById('spuImagesUpload');
        if (input) input.click();
    },

    handleSpuMainImageUpload: function(file) {
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('spuMainImagePreview');
            if (preview) {
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="SPU主图" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
                `;
            }
        };
        reader.readAsDataURL(file);
    },

    handleSpuImagesUpload: function(files) {
        const grid = document.getElementById('spuImagesGrid');
        if (!grid) return;
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // 检查是否已有上传按钮，如果有则在其前面插入图片
                    const uploadSlot = grid.querySelector('.upload-slot:last-child');
                    
                    const imageElement = document.createElement('div');
                    imageElement.className = 'uploaded-image'; // 使用新的class名
                    imageElement.innerHTML = `
                        <img src="${e.target.result}" alt="SPU图片">
                        <button class="remove-btn" onclick="ProductModal.removeSpuImage(this)" title="删除图片">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    // 在上传按钮前插入图片
                    if (uploadSlot) {
                        grid.insertBefore(imageElement, uploadSlot);
                    } else {
                        grid.appendChild(imageElement);
                        // 如果没有上传按钮，添加一个
                        this.addUploadSlotToGrid(grid);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    },

    // 新增：向网格添加上传按钮
    addUploadSlotToGrid: function(grid) {
        // 检查是否已有上传按钮，避免重复添加
        if (grid.querySelector('.upload-slot')) return;
        
        const newUploadSlot = document.createElement('div');
        newUploadSlot.className = 'upload-slot';
        newUploadSlot.onclick = () => this.addSpuImage();
        newUploadSlot.innerHTML = `
            <i class="fas fa-plus"></i>
            <span>添加图片</span>
        `;
        grid.appendChild(newUploadSlot);
    },

    // 新增：删除SPU图片
    removeSpuImage: function(button) {
        const imageElement = button.closest('.uploaded-image');
        if (imageElement) {
            imageElement.remove();
            
            // 确保始终有一个上传按钮
            const grid = document.getElementById('spuImagesGrid');
            if (grid && !grid.querySelector('.upload-slot')) {
                this.addUploadSlotToGrid(grid);
            }
        }
    },

    clearImagePreviews: function() {
        // 清除主图预览
        const mainPreview = document.getElementById('spuMainImagePreview');
        if (mainPreview) {
            mainPreview.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-camera"></i>
                    <p>上传主图</p>
                    <small>建议800x800px</small>
                </div>
            `;
        }
        
        // 清除附加图片网格
        const grid = document.getElementById('spuImagesGrid');
        if (grid) {
            // 清空所有内容
            grid.innerHTML = '';
            // 添加上传按钮
            this.addUploadSlotToGrid(grid);
        }
    },

    // ==================== 销售属性管理 ====================

    initSalesAttrs: function() {
        // 绑定现有属性的事件
        this.bindSalesAttrEvents();
    },

    bindSalesAttrEvents: function() {
        const attrItems = document.querySelectorAll('#salesAttrsList .attr-item');
        attrItems.forEach(item => {
            const inputs = item.querySelectorAll('.attr-name, .attr-value');
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            inputs.forEach(input => {
                input.addEventListener('input', () => this.updateParamPreview());
            });
            
            if (checkbox) {
                checkbox.addEventListener('change', () => this.updateParamPreview());
            }
        });
    },

    addSalesAttr: function() {
        const container = document.getElementById('salesAttrsList');
        if (!container) return;
        
        const attrItem = document.createElement('div');
        attrItem.className = 'attr-item';
        attrItem.innerHTML = `
            <div class="attr-row">
                <div class="attr-name-group">
                    <input type="text" placeholder="属性名称" class="form-input attr-name">
                    <label class="checkbox-label">
                        <input type="checkbox" checked>
                        <span class="checkmark"></span>
                        前台展示
                    </label>
                </div>
                <div class="attr-value-group">
                    <input type="text" placeholder="属性值" class="form-input attr-value">
                    <button type="button" class="btn btn-danger btn-sm" onclick="ProductModal.removeSalesAttr(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(attrItem);
        
        // 绑定新增项的事件
        const inputs = attrItem.querySelectorAll('.attr-name, .attr-value');
        const checkbox = attrItem.querySelector('input[type="checkbox"]');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateParamPreview());
        });
        
        if (checkbox) {
            checkbox.addEventListener('change', () => this.updateParamPreview());
        }
    },

    removeSalesAttr: function(button) {
        const attrItem = button.closest('.attr-item');
        if (attrItem) {
            attrItem.remove();
            this.updateParamPreview();
        }
    },

    updateParamPreview: function() {
        const preview = document.getElementById('paramTablePreview');
        if (!preview) return;
        
        const attrItems = document.querySelectorAll('#salesAttrsList .attr-item');
        let html = '';
        
        attrItems.forEach(item => {
            const nameInput = item.querySelector('.attr-name');
            const valueInput = item.querySelector('.attr-value');
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            if (nameInput && valueInput && checkbox) {
                const name = nameInput.value.trim();
                const value = valueInput.value.trim();
                const isChecked = checkbox.checked;
                
                if (name && value && isChecked) {
                    html += `
                        <div class="param-row">
                            <div class="param-name">${name}</div>
                            <div class="param-value">${value}</div>
                        </div>
                    `;
                }
            }
        });
        
        preview.innerHTML = html;
    },

    loadAttrTemplate: function() {
        this.showNotification('属性模板功能开发中...', 'info');
    },

    // ==================== 规格属性管理 ====================

    initSpecAttrs: function() {
        // 绑定现有规格属性的事件
        this.bindSpecAttrEvents();
    },

    bindSpecAttrEvents: function() {
        const specItems = document.querySelectorAll('.spec-attr-item');
        specItems.forEach(item => {
            const inputs = item.querySelectorAll('.spec-name, .spec-value');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.updateSKUPreview());
            });
        });
    },

    addSpecAttr: function() {
        const container = document.querySelector('.spec-attrs-manager');
        if (!container) return;
        
        const specItem = document.createElement('div');
        specItem.className = 'spec-attr-item';
        specItem.innerHTML = `
            <div class="spec-attr-header">
                <label>规格名称</label>
                <input type="text" class="form-input spec-name" placeholder="如：颜色、尺寸、版本">
                <button type="button" class="btn btn-danger btn-sm" onclick="ProductModal.removeSpecAttr(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="spec-values-container">
                <div class="spec-value-item">
                    <input type="text" class="form-input spec-value" placeholder="规格值">
                    <div class="spec-image-upload">
                        <button type="button" class="btn btn-outline btn-sm">上传图片</button>
                        <input type="file" accept="image/*" style="display: none;">
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" onclick="ProductModal.removeSpecValue(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" onclick="ProductModal.addSpecValue(this)">
                <i class="fas fa-plus"></i>
                添加规格值
            </button>
        `;
        
        container.appendChild(specItem);
        
        // 绑定事件
        const inputs = specItem.querySelectorAll('.spec-name, .spec-value');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.updateSKUPreview());
        });
    },

    removeSpecAttr: function(button) {
        const specItem = button.closest('.spec-attr-item');
        if (specItem) {
            specItem.remove();
            this.updateSKUPreview();
        }
    },

    addSpecValue: function(button) {
        const container = button.previousElementSibling;
        if (!container) return;
        
        const valueItem = document.createElement('div');
        valueItem.className = 'spec-value-item';
        valueItem.innerHTML = `
            <input type="text" class="form-input spec-value" placeholder="规格值">
            <div class="spec-image-upload">
                <button type="button" class="btn btn-outline btn-sm">上传图片</button>
                <input type="file" accept="image/*" style="display: none;">
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="ProductModal.removeSpecValue(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(valueItem);
        
        // 绑定事件
        const input = valueItem.querySelector('.spec-value');
        if (input) {
            input.addEventListener('input', () => this.updateSKUPreview());
        }
    },

    removeSpecValue: function(button) {
        const valueItem = button.closest('.spec-value-item');
        if (valueItem) {
            valueItem.remove();
            this.updateSKUPreview();
        }
    },

    updateSKUPreview: function() {
        const specAttrs = document.querySelectorAll('.spec-attr-item');
        const combinations = this.generateSKUCombinations(specAttrs);
        
        const preview = document.getElementById('skuPreview');
        if (!preview) return;
        
        const countElement = preview.querySelector('.sku-count');
        const listElement = preview.querySelector('.sku-preview-list');
        
        if (countElement) {
            countElement.textContent = `(${combinations.length}个SKU)`;
        }
        
        if (listElement) {
            listElement.innerHTML = combinations.map(combo => 
                `<div class="sku-preview-item">${combo}</div>`
            ).join('');
        }
    },

    generateSKUCombinations: function(specAttrs) {
        const specs = [];
        
        specAttrs.forEach(attr => {
            const nameInput = attr.querySelector('.spec-name');
            const valueInputs = attr.querySelectorAll('.spec-value');
            
            if (nameInput) {
                const name = nameInput.value.trim();
                const values = Array.from(valueInputs)
                    .map(input => input.value.trim())
                    .filter(value => value);
                
                if (name && values.length > 0) {
                    specs.push({ name, values });
                }
            }
        });
        
        if (specs.length === 0) return [];
        
        // 生成笛卡尔积
        let result = [[]];
        
        specs.forEach(spec => {
            const temp = [];
            result.forEach(combo => {
                spec.values.forEach(value => {
                    temp.push([...combo, value]);
                });
            });
            result = temp;
        });
        
        return result.map(combo => combo.join(' + '));
    },

    generateSKUs: function() {
        this.showNotification('SKU生成功能开发中...', 'info');
    },

    // ==================== SKU管理 ====================

    initSKUManagement: function() {
        // 初始化SKU选择框
        const selectAllSKU = document.getElementById('selectAllSKU');
        if (selectAllSKU) {
            selectAllSKU.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.sku-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
                this.updateBatchActions();
            });
        }

        // 绑定单个SKU选择框
        const skuCheckboxes = document.querySelectorAll('.sku-checkbox');
        skuCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateBatchActions();
            });
        });
    },

    updateBatchActions: function() {
        const checkboxes = document.querySelectorAll('.sku-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        const batchActions = document.getElementById('skuBatchActions');
        const countElement = document.getElementById('selectedSKUCount');
        
        if (countElement) {
            countElement.textContent = checkedCount;
        }
        
        if (batchActions) {
            batchActions.style.display = checkedCount > 0 ? 'block' : 'none';
        }
    },

    batchEditSKU: function() {
        this.showNotification('批量编辑功能开发中...', 'info');
    },

    importSKU: function() {
        this.showNotification('SKU导入功能开发中...', 'info');
    },

    exportSKU: function() {
        this.showNotification('SKU导出功能开发中...', 'info');
    },

    editSKUDetail: function(button) {
        this.showNotification('SKU详情编辑功能开发中...', 'info');
    },

    // ==================== 富文本编辑器 ====================

    initRichEditor: function() {
        const editorBtns = document.querySelectorAll('.editor-btn');
        
        editorBtns.forEach(btn => {
            const command = btn.getAttribute('data-command');
            if (command) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.execCommand(command, false, null);
                    this.updateEditorButtonStates();
                });
            }
        });

        // 监听编辑器内容变化
        const editor = document.getElementById('productDetailEditor');
        if (editor) {
            editor.addEventListener('keyup', () => this.updateEditorButtonStates());
            editor.addEventListener('mouseup', () => this.updateEditorButtonStates());
        }
    },

    updateEditorButtonStates: function() {
        const commands = ['bold', 'italic', 'underline'];
        commands.forEach(command => {
            const btn = document.querySelector(`[data-command="${command}"]`);
            if (btn) {
                if (document.queryCommandState(command)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    },

    insertImage: function() {
        const url = prompt('请输入图片URL:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    },

    insertVideo: function() {
        const url = prompt('请输入视频URL:');
        if (url) {
            const videoHtml = `<video controls width="100%" style="max-width: 600px;"><source src="${url}"></video>`;
            document.execCommand('insertHTML', false, videoHtml);
        }
    },

    insertParamTable: function() {
        const tableHtml = `
            <table class="param-table-detail">
                <tr>
                    <td>参数名称</td>
                    <td>参数值</td>
                </tr>
                <tr>
                    <td>参数名称2</td>
                    <td>参数值2</td>
                </tr>
            </table>
        `;
        document.execCommand('insertHTML', false, tableHtml);
    },

    insertTemplate: function(type) {
        const editor = document.getElementById('productDetailEditor');
        if (!editor) return;
        
        let templateHtml = '';
        
        switch (type) {
            case 'features':
                templateHtml = `
                    <h3>产品特色</h3>
                    <ul>
                        <li>特色功能1</li>
                        <li>特色功能2</li>
                        <li>特色功能3</li>
                    </ul>
                `;
                break;
            case 'specs':
                templateHtml = `
                    <h3>技术规格</h3>
                    <table class="param-table-detail">
                        <tr>
                            <td>处理器</td>
                            <td>请填写具体规格</td>
                        </tr>
                        <tr>
                            <td>内存</td>
                            <td>请填写具体规格</td>
                        </tr>
                        <tr>
                            <td>存储</td>
                            <td>请填写具体规格</td>
                        </tr>
                    </table>
                `;
                break;
            case 'service':
                templateHtml = `
                    <h3>售后服务</h3>
                    <p>1. 质量保证：正品保证，假一赔十</p>
                    <p>2. 退换政策：7天无理由退换货</p>
                    <p>3. 技术支持：提供专业技术支持服务</p>
                    <p>4. 物流配送：全国包邮，48小时内发货</p>
                `;
                break;
        }
        
        if (templateHtml) {
            editor.innerHTML += templateHtml;
        }
    },

    // ==================== 表单验证 ====================

    initFormValidation: function() {
        // 实时验证
        const requiredInputs = document.querySelectorAll('input[required], select[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    },

    validateField: function(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity() && value !== '';
        
        if (isValid) {
            field.classList.remove('error');
            field.style.borderColor = '#374151';
        } else {
            field.classList.add('error');
            field.style.borderColor = '#ef4444';
        }
        
        return isValid;
    },

    validateForm: function() {
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('请填写所有必填字段！', 'error');
        }
        
        return isValid;
    },

    // ==================== 表单提交 ====================

    saveProduct: function() {
        if (!this.validateForm()) {
            return;
        }
        
        const formData = this.collectFormData();
        
        // 这里应该调用实际的保存接口
        console.log('保存商品数据:', formData);
        
        this.showNotification('商品保存成功！', 'success');
        this.hide();
        
        // 通知主页面刷新数据
        if (window.ProductManagementPage && typeof window.ProductManagementPage.loadProducts === 'function') {
            window.ProductManagementPage.loadProducts();
            window.ProductManagementPage.loadStats();
        }
    },

    saveDraft: function() {
        const formData = this.collectFormData();
        formData.status = 'draft';
        
        // 这里应该调用实际的保存接口
        console.log('保存草稿数据:', formData);
        
        this.showNotification('草稿保存成功！', 'info');
    },

    collectFormData: function() {
        // 收集基本信息
        const basicData = {
            name: document.getElementById('spuName')?.value || '',
            subtitle: document.getElementById('spuSubtitle')?.value || '',
            category: document.getElementById('productCategory')?.value || '',
            brand: document.getElementById('productBrand')?.value || '',
            status: document.getElementById('productStatus')?.value || 'draft',
            publishTime: document.getElementById('publishTime')?.value || '',
            description: document.getElementById('spuDescription')?.value || '',
            tags: this.getCurrentTags()
        };

        // 收集销售属性
        const salesAttrs = this.collectSalesAttrs();
        
        // 收集规格属性
        const specAttrs = this.collectSpecAttrs();
        
        // 收集富文本内容
        const detailDescription = document.getElementById('productDetailEditor')?.innerHTML || '';
        
        // 收集SEO设置
        const seoData = {
            seoTitle: document.getElementById('seoTitle')?.value || '',
            seoDescription: document.getElementById('seoDescription')?.value || '',
            seoKeywords: document.getElementById('seoKeywords')?.value || '',
            urlSlug: document.getElementById('urlSlug')?.value || ''
        };
        
        return {
            id: this.currentProductId,
            ...basicData,
            salesAttrs,
            specAttrs,
            detailDescription,
            seo: seoData,
            updatedAt: new Date().toISOString()
        };
    },

    collectSalesAttrs: function() {
        const attrs = [];
        const attrItems = document.querySelectorAll('#salesAttrsList .attr-item');
        
        attrItems.forEach(item => {
            const nameInput = item.querySelector('.attr-name');
            const valueInput = item.querySelector('.attr-value');
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            if (nameInput && valueInput) {
                const name = nameInput.value.trim();
                const value = valueInput.value.trim();
                const showInFront = checkbox ? checkbox.checked : false;
                
                if (name && value) {
                    attrs.push({ name, value, showInFront });
                }
            }
        });
        
        return attrs;
    },

    collectSpecAttrs: function() {
        const specs = [];
        const specItems = document.querySelectorAll('.spec-attr-item');
        
        specItems.forEach(item => {
            const nameInput = item.querySelector('.spec-name');
            const valueInputs = item.querySelectorAll('.spec-value');
            
            if (nameInput) {
                const name = nameInput.value.trim();
                const values = Array.from(valueInputs)
                    .map(input => input.value.trim())
                    .filter(value => value);
                
                if (name && values.length > 0) {
                    specs.push({ name, values });
                }
            }
        });
        
        return specs;
    },

    // ==================== 工具函数 ====================

    showNotification: function(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : 
                       type === 'error' ? '#ef4444' : 
                       type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: '10001',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    getNotificationIcon: function(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
};

// 将ProductModal暴露到全局作用域
window.ProductModal = ProductModal; 