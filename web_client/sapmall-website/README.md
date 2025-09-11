# Sapphire Mall Website

Sapphire Mall 官网项目，基于 React + Ant Design + Tailwind CSS + React Router 技术栈构建。

## 技术栈

- **React 19** - 前端框架
- **TypeScript** - 类型安全
- **Ant Design 5** - UI 组件库
- **Tailwind CSS 4** - 样式框架
- **React Router** - 路由管理
- **Font Awesome** - 图标库

## 项目结构

```
src/
├── components/          # 通用组件
├── layout/             # 布局组件
│   ├── Header.tsx      # 头部导航
│   └── Footer.tsx      # 页脚
├── pages/              # 页面组件
│   └── HomePage.tsx    # 首页
├── App.tsx             # 主应用组件
├── index.tsx           # 应用入口
└── index.css           # 全局样式
```

## 功能特性

### 首页 (HomePage)
- **Hero区域**: 主标题、描述、CTA按钮、统计数据展示
- **核心价值**: 使命愿景、平台优势展示
- **平台功能**: 六大核心功能模块
- **关于我们**: 团队介绍、价值观、联系方式

### 响应式设计
- 支持桌面端、平板端、移动端
- 使用 Tailwind CSS 实现响应式布局
- 移动端抽屉菜单

### 交互功能
- 统计数据动画效果
- 悬停效果和过渡动画
- 语言切换功能
- 平滑滚动导航

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

项目将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

### 运行测试
```bash
npm test
```

## 设计特色

### 视觉设计
- **深色主题**: 使用渐变背景和深色配色方案
- **现代UI**: 采用卡片式布局和圆角设计
- **品牌色彩**: 蓝色到紫色的渐变主题色
- **图标系统**: 使用 Font Awesome 图标库

### 动画效果
- 统计数据计数动画
- 卡片悬停效果
- 按钮交互反馈
- 页面滚动动画

### 内容结构
- **价值主张**: 突出70%收益分成等核心优势
- **功能展示**: 六大平台功能模块
- **团队介绍**: 专业团队背景展示
- **联系方式**: 多渠道联系方式

## 部署说明

### 构建优化
- 代码分割和懒加载
- 图片优化
- CSS 压缩
- JavaScript 压缩

### 环境配置
- 开发环境: `npm start`
- 生产环境: `npm run build`

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

© 2025 Sapphire Mall. 保留所有权利。