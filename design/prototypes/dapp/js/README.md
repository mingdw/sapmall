# DApp JavaScript 模块目录

本目录包含Sapphire Mall DApp页面的所有JavaScript功能模块。

## 文件列表

- `dapp-common.js` - DApp通用JavaScript功能模块
- `marketplace.js` - Marketplace页面特有JavaScript功能模块

## 模块说明

### dapp-common.js
通用功能模块，为所有DApp页面提供基础功能：

**主要功能：**
- 语言切换功能 (`updateLanguage`)
- Toast提示系统 (`showToast`)
- 筛选标签选择 (`initFilterTags`)
- 清除按钮功能 (`initClearButtons`)
- 商品分类选择 (`initCategorySelection`)
- 搜索功能 (`initSearchFeature`)
- 折叠功能 (`initCollapseFeature`)

**全局变量：**
- `currentLang` - 当前语言设置

**导出对象：**
```javascript
window.DAppCommon = {
    updateLanguage,
    showToast,
    getCategoryDisplayName
}
```

### marketplace.js
Marketplace页面专用功能模块：

**主要功能：**
- 商品卡片交互 (`setupProductCards`)
- 分类筛选功能 (`setupCategoryFilters`)
- 筛选标签管理 (`setupFilterTags`)
- 搜索功能实现 (`setupSearchFunctionality`)
- 展开/收起筛选 (`setupMoreFilters`)
- 清除筛选功能 (`setupClearFilters`)
- 查看更多按钮 (`setupViewMoreButtons`)
- 分类下拉菜单 (`setupCategoryDropdowns`)

**模块对象：**
```javascript
window.MarketplaceModule = {
    init,
    setupProductCards,
    setupCategoryFilters,
    // ... 其他方法
}
```

## 使用方式

### 引用顺序
```html
<!-- 1. 先引用通用模块 -->
<script src="js/dapp-common.js"></script>
<!-- 2. 再引用页面特有模块 -->
<script src="js/marketplace.js"></script>
```

### 依赖关系
- `marketplace.js` 依赖 `dapp-common.js`
- 所有页面模块都应该依赖 `dapp-common.js`
- 页面模块间不应有相互依赖

## 开发规范

### 模块结构
```javascript
const ModuleName = {
    init() {
        // 初始化所有功能
    },
    
    setupFeature() {
        // 设置具体功能
    },
    
    onLanguageChange(lang) {
        // 语言变更回调
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    ModuleName.init();
});

// 导出模块
window.ModuleName = ModuleName;
```

### 命名约定
- 模块名使用大驼峰：`MarketplaceModule`
- 方法名使用小驼峰：`setupProductCards`
- 事件处理函数以动词开头：`handleClick`
- 工具函数以get/set开头：`getCategoryName`

### 事件处理
- 使用 `addEventListener` 而不是内联事件
- 适当使用 `stopPropagation()` 防止事件冒泡
- 添加必要的错误处理和边界检查

### 语言支持
- 使用 `window.currentLang` 获取当前语言
- 监听 `message` 事件处理语言变更
- 实现 `onLanguageChange` 回调函数

## 调试和开发

### Console 日志
所有模块都包含详细的console日志：
```javascript
console.log('Module initialized');
console.log('Feature action:', data);
```

### 错误处理
```javascript
if (typeof window.DAppCommon === 'undefined') {
    console.warn('DAppCommon not loaded');
}
```

## 扩展指南

### 添加新页面模块
1. 创建 `[page-name].js` 文件
2. 实现标准的模块结构
3. 确保依赖 `dapp-common.js`
4. 在对应HTML页面引用
5. 更新本文档

### 添加新功能
1. 在对应模块中添加新方法
2. 在 `init()` 方法中调用
3. 遵循现有的命名和结构规范
4. 添加适当的错误处理和日志 