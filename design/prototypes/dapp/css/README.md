# DApp 样式和脚本目录

本目录包含Sapphire Mall DApp页面的所有样式文件和JavaScript模块，旨在提高代码的可维护性和重用性。

## 目录结构

```
dapp/
├── css/                     # CSS样式文件目录
│   ├── README.md           # 本说明文档
│   ├── dapp-common.css     # DApp通用样式文件
│   └── marketplace.css     # Marketplace页面特有样式
└── js/                      # JavaScript脚本文件目录
    ├── dapp-common.js      # DApp通用JavaScript功能模块
    └── marketplace.js      # Marketplace页面特有JavaScript模块
```

## 文件说明

### CSS文件 (css目录)

#### dapp-common.css
包含所有DApp页面的通用样式：
- 页面基础样式（背景、字体等）
- 玻璃效果样式
- 筛选卡片样式
- 商品目录筛选按钮样式
- 通用交互效果
- 响应式布局基础

#### marketplace.css
Marketplace页面的特有样式：
- 商品网格布局
- 商品卡片样式优化
- 商品标签样式（热门、新品、精品等）
- 搜索输入框样式
- 加载动画效果
- 响应式优化

### JavaScript文件 (js目录)

#### dapp-common.js
包含所有DApp页面的通用JavaScript功能：
- 语言切换功能
- Toast提示功能
- 通用工具方法
- 消息监听（语言变更等）

#### marketplace.js
Marketplace页面的特有JavaScript功能：
- 商品卡片交互
- 分类筛选功能
- 搜索功能
- 筛选标签管理
- 清除筛选功能
- 查看更多按钮

## 使用方式

在DApp页面的HTML文件中按以下顺序引用：

```html
<!-- CSS文件 -->
<link rel="stylesheet" href="css/dapp-common.css">
<link rel="stylesheet" href="css/marketplace.css">

<!-- JavaScript文件 -->
<script src="js/dapp-common.js"></script>
<script src="js/marketplace.js"></script>
```

## 样式规范

### CSS类命名约定
- 使用kebab-case命名方式
- 功能性类名：`filter-card`、`product-grid`
- 状态类名：`active`、`selected`、`loading`
- 组件类名：`category-item`、`product-card`

### JavaScript模块约定
- 使用模块化结构，避免全局变量污染
- 功能函数采用驼峰命名：`setupProductCards()`
- 事件处理函数以动词开头：`handleClick()`
- 工具函数以get/set开头：`getCategoryName()`

## 扩展指南

### 添加新页面样式
1. 在css目录下创建`[page-name].css`文件
2. 在对应HTML页面引用CSS文件
3. 遵循现有的样式规范和设计系统

### 添加新页面功能
1. 在js目录下创建`[page-name].js`文件
2. 创建页面功能模块，参考`MarketplaceModule`结构
3. 在对应HTML页面引用JavaScript文件
4. 确保与`dapp-common.js`的兼容性

## 设计系统

### 颜色方案
- 主色：蓝宝石色系（#3b82f6, #2563eb等）
- 背景：深色渐变（#0f172a到#1e293b）
- 文字：白色/灰色层次
- 强调色：各功能模块的品牌色

### 交互效果
- 统一的hover效果和过渡时间（0.3s ease）
- 一致的点击反馈和状态变化
- 流畅的动画效果

### 响应式断点
- 小屏：< 640px
- 中屏：640px - 768px
- 大屏：768px - 1024px
- 超大屏：> 1024px

## 注意事项

1. **依赖关系**：所有页面JavaScript模块都依赖`dapp-common.js`，请确保正确的加载顺序
2. **语言支持**：所有模块都支持中英文切换，新增功能请遵循现有的多语言规范
3. **性能优化**：CSS和JavaScript文件已进行模块化分离，避免单个文件过大
4. **浏览器兼容性**：使用ES6+语法，确保目标浏览器支持
5. **调试模式**：所有模块都包含console日志，便于开发调试

## 维护建议

- 定期检查和优化CSS和JavaScript文件大小
- 移除未使用的样式和功能
- 保持代码注释的更新
- 遵循一致的代码风格和规范
- 保持CSS和JavaScript文件的分离原则 