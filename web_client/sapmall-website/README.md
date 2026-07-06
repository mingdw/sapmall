# Sapphire Mall Website

Sapphire Mall 官网（`sapmall-website`），面向 Web3 电商与 DAO 生态的品牌展示站。当前为 **浅色 Editorial 风格** 单页落地页 + 法律条款子页，基于 React + TypeScript + Tailwind CSS 构建，视觉与交互经 AI Skills 辅助设计与多轮迭代落地。

---

## 技术栈

| 类别 | 选型 | 说明 |
|------|------|------|
| 框架 | **React 19** + **TypeScript 5** | Create React App (`react-scripts` 5) |
| 样式 | **Tailwind CSS 3.4** + **CSS 变量设计令牌** | 主样式在 `src/index.css`，Tailwind 作辅助工具类 |
| 路由 | **React Router 7** | `/` 首页；`/privacy` `/terms` `/cookies` 法律页 |
| 国际化 | **react-i18next** + **i18next-browser-languagedetector** | 中 / 英双语，文案在 `src/i18n/locales/`，浏览器语言自动检测 |
| SEO | **react-helmet-async** | `components/SEO.tsx`，含 Open Graph / Twitter Card / JSON-LD 结构化数据 |
| 图标 | **Lucide React**（主力） | 首页全部图标；Font Awesome / Ant Design Icons 为历史依赖，首页 UI 不依赖 |
| UI 库 | **Ant Design 5** | 仅 `App.tsx` 中 `ConfigProvider` 区域设置 + `LegalPage`，非页面主 UI |
| 构建 | **PostCSS** + **Autoprefixer** | CSS 后处理 |
| 环境变量 | **cross-env** | `npm start` 通过 `cross-env PORT=3006` 指定端口 |

开发端口：**3006**。

---

## 项目结构

```
sapmall-website/
├── public/
│   ├── images/dapp/              # DApp 流程预览截图（中/英）
│   ├── favicon.svg
│   └── index.html
├── src/
│   ├── assets/
│   │   └── logo-mark.svg         # 品牌 Logo 标记
│   ├── components/
│   │   ├── SEO.tsx               # SEO 元标签 + 结构化数据
│   │   ├── RevealOnScroll.tsx    # 滚动入场动效（IntersectionObserver）
│   │   └── home/                 # 首页区块组件（18 个文件）
│   │       ├── SiteNav.tsx            # 粘性顶栏 + 锚点导航 + 语言切换 + 移动端抽屉
│   │       ├── HeroSection.tsx        # Hero 区域（统计数据计数动画）
│   │       ├── CoreValuesSection.tsx  # 核心价值（使命愿景、平台优势、商业机会）
│   │       ├── PlatformFeaturesSection.tsx # 平台功能（核心能力、网络代币、使用步骤、安全透明）
│   │       ├── RoadmapSection.tsx     # 路线图时间线
│   │       ├── AboutSection.tsx       # 关于我们（团队介绍、价值观）
│   │       ├── SupportSection.tsx     # 支持（FAQ、文档资源、联系我们）
│   │       ├── SiteFooter.tsx         # 页脚（品牌、导航、生态网络、订阅）
│   │       ├── ActionButton.tsx       # 通用 CTA 按钮（支持 primary/outline 变体）
│   │       ├── FeatureCard.tsx        # 功能卡片（能力网格用）
│   │       ├── FaqAccordionItem.tsx   # FAQ 手风琴项
│   │       ├── DappPreviewFrame.tsx   # DApp 浏览器预览框
│   │       └── NetworkTokenPanel.tsx  # 网络 ↔ 代币联动选择面板
│   ├── config/
│   │   ├── siteLinks.ts          # DApp / 外链 / 支付网络配置
│   │   └── dappPreviewImages.ts  # DApp 预览截图路径映射
│   ├── hooks/
│   │   ├── useActiveSection.ts   # 滚动高亮当前导航项（IntersectionObserver）
│   │   ├── useNavElevated.ts     # 滚动后导航栏加深
│   │   └── useClickOutside.ts    # 点击外部关闭（语言下拉等）
│   ├── i18n/
│   │   ├── index.tsx             # i18next 初始化 + LanguageDetector
│   │   └── locales/
│   │       ├── zh/translation.json   # 中文文案
│   │       └── en/translation.json   # 英文文案
│   ├── layout/
│   │   ├── Header.tsx            # 备用布局 Header（非首页使用）
│   │   └── Footer.tsx            # 备用布局 Footer（非首页使用）
│   ├── pages/
│   │   ├── HomePage.tsx          # 首页（7 个区块组件挂载）
│   │   └── LegalPage.tsx         # 法律页面（隐私政策、条款、Cookie）
│   ├── utils/
│   │   └── motion.ts             # staggerDelay() 延迟工具函数
│   ├── App.tsx                   # 路由 + ConfigProvider + HelmetProvider
│   ├── App.css
│   ├── index.tsx                 # 应用入口
│   └── index.css                 # 设计令牌 + 全局组件样式（1699 行）
├── .env.example
├── tailwind.config.js            # Tailwind 配置（brand 色阶 + 字体）
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 页面与内容结构

### 首页单页锚点（`HomePage.tsx`）

| 锚点 ID | 导航文案 | 组件 | 主要内容 |
|---------|----------|------|----------|
| `#home` | 首页 | `HeroSection` | 主标题、CTA 按钮组（开始交易/白皮书/演示）、四组统计数据计数动画 |
| `#core-values` | 核心价值 | `CoreValuesSection` | 使命 / 愿景、平台四大优势、商业机会 / 优势 / 路线图 |
| `#features` | 平台功能 | `PlatformFeaturesSection` | 核心能力 3×2 卡片、支持网络与代币选择、使用步骤 + DApp 预览、安全与透明 |
| `#roadmap` | 产品路线图 | `RoadmapSection` | 时间线阶段卡片 |
| `#about` | 关于我们 | `AboutSection` | 团队介绍、价值观（创新 / 用户至上 / 社区） |
| `#support` | 支持 | `SupportSection` | FAQ 手风琴、文档与资源卡片、联系我们（邮件/Telegram/Discord） |

页脚 `SiteFooter`：四列布局（品牌社交 / 快速导航 / 生态网络 / 邮件订阅）+ 底栏版权与法律链接。

### 子页面

| 路由 | 页面 | 说明 |
|------|------|------|
| `/privacy` | `LegalPage kind="privacy"` | 隐私政策 |
| `/terms` | `LegalPage kind="terms"` | 服务条款 |
| `/cookies` | `LegalPage kind="cookies"` | Cookie 政策 |

---

## 设计系统

> 官网已完成 **深色渐变 → 浅色 Editorial** 改版，刻意去除常见「AI 模板感」（深紫渐变、居中暗色 Hero、三等分功能卡等）。

### 字体系统

| 角色 | 字体 | 来源 | CSS Token | 用途 |
|------|------|------|-----------|------|
| 正文 / UI | **Outfit** | Google Fonts | `--font-sans` | 段落、按钮、标签、导航等所有正文 |
| 标题 / 展示 | **Instrument Serif** | Google Fonts | `--font-display` | Hero 标题、区块标题（`.hero-title`、`.section-title`） |

**字重范围：** Outfit 使用 400（Regular）、500（Medium）、600（SemiBold）、700（Bold）四档字重，避免仅有 Regular + Bold 的粗糙层级。

**排版细节：**
- 大标题负字距 `letter-spacing: -0.02em`，增强紧凑感
- 小标签 / 眉题正字距 `letter-spacing: 0.12em` + `text-transform: uppercase`
- 统计数字启用 `font-variant-numeric: tabular-nums` 等宽数字
- 标题使用 `text-wrap: balance` 防止孤字换行

**字体加载：** 通过 Google Fonts CDN 在 `index.css` 首行 `@import`，并配合 `SEO.tsx` 中 `<link rel="preconnect">` 预连接优化。

### 配色方案（Design Tokens）

设计令牌定义于 `src/index.css` `:root`，并与 `tailwind.config.js` 中 `brand` 色阶对齐。

#### 中性色

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-canvas` | `#f7f6f3` | 页面画布背景、交替区块内容带 |
| `--color-surface` | `#ffffff` | 卡片底色、标题带底色 |
| `--color-surface-muted` | `#f9f9f8` | 默认区块内容带、浅灰蓝分区 |
| `--color-border` | `#eaeaea` | 默认边框线 |
| `--color-border-strong` | `rgba(0, 0, 0, 0.08)` | 加强边框 |
| `--color-text` | `#111111` | 主文字 |
| `--color-text-secondary` | `#787774` | 次要说明文字 |
| `--color-text-muted` | `#9b9a97` | 弱化文字（时间戳、提示） |

#### 品牌色（Sapphire Blue）

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-accent` | `#149eca` | 主 CTA 背景、强调元素 |
| `--color-accent-hover` | `#0e7ea3` | 按钮 hover 态 |
| `--color-accent-soft` | `#e1f3fe` | 图标底色、FAQ hover、浅强调背景 |
| `--color-accent-text` | `#1f6c9f` | 链接字色、眉题字色、次级强调 |

**Tailwind 扩展色（`tailwind.config.js`）：**

| Tailwind 类 | 色值 | 对应 Token |
|-------------|------|-----------|
| `brand-50` | `#ecfeff` | — |
| `brand-100` | `#e1f3fe` | `--color-accent-soft` |
| `brand-200` | `#bae6fd` | — |
| `brand-300` | `#7dd3fc` | — |
| `brand-400` | `#61dafb` | — |
| `brand-500` | `#149eca` | `--color-accent` |
| `brand-600` | `#0e7ea3` | `--color-accent-hover` |
| `brand-700` | `#0c6a8a` | — |
| `brand-800` | `#0a5570` | — |
| `brand-900` | `#084058` | — |

#### 分区背景节奏

| 层级 | 默认区块 | 交替区块 `--alt` |
|------|----------|------------------|
| 标题带 | 浅蓝渐变 → 白 `#ffffff` | 灰蓝渐变 `#e8edf2` → `#dfe8ef` |
| 内容带 | 灰蓝底 `#e8edf2` | 画布底 `#f7f6f3` |

标题带与内容带之间使用品牌色分隔线 `rgba(20, 158, 202, 0.14)`。

### 圆角与阴影

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-sm` | `8px` | 按钮、标签、下拉菜单 |
| `--radius-md` | `12px` | 卡片、分区容器 |
| `--radius-lg` | `16px` | 大容器、图片包裹 |
| `--shadow-soft` | `0 2px 12px rgba(20, 158, 202, 0.06)` | 卡片默认阴影（品牌色调） |
| `--shadow-hover` | `0 8px 24px rgba(20, 158, 202, 0.1)` | 卡片悬浮阴影 |

### 动效配置

| Token / 函数 | 值 | 用途 |
|-------------|-----|------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 所有过渡动画缓动 |
| `STAGGER_MS` | `70ms` | stagger 错峰间隔 |
| `STAGGER_MAX_MS` | `420ms` | 单组 stagger 最大延迟 |

**动效清单：**

| 动效 | 实现方式 | 说明 |
|------|----------|------|
| 滚动入场 | `RevealOnScroll` + IntersectionObserver | 支持 `up / fade / left / right` 变体 + staggerDelay |
| Hero stagger | 左右分栏交错入场 | `staggerDelay(index)` 递增延迟 |
| 统计计数 | `setInterval` + 进度插值 | 2 秒渐增，支持 `prefers-reduced-motion` |
| 导航提升 | `useNavElevated` hook | 滚动后 `site-nav--elevated` 背景加深 |
| FAQ 手风琴 | `FaqAccordionItem` | `grid-template-rows` 高度过渡 + 答案透明度 |
| DApp 预览 | `DappPreviewFrame` | 步骤切换 cross-fade |
| 网络/代币面板 | `NetworkTokenPanel` | 选择联动 + `token-fade-in` 入场动画 |
| 卡片悬浮 | CSS `transition` | `box-shadow` + `translateY(-2px)` + `border-color` |
| 按钮反馈 | CSS `:active` | `transform: scale(0.98)` |
| 无障碍 | `prefers-reduced-motion: reduce` | 关闭 reveal / FAQ 过渡 / 计数动画 |

### 响应式断点

| 断点 | 宽度 | 用途 |
|------|------|------|
| `sm` | `640px` | 能力网格 2 列、联系网格 4 列 |
| `md` | `768px` | Bento 网格 12 列、关于/功能左右分栏 |
| `lg` | `1024px` | 导航展开、Hero 左右分栏、页脚 4 列 |

移动端导航折叠为自定义 overlay + drawer（非 Ant Design Drawer）。

---

## AI 辅助设计说明

本官网视觉与结构在 Cursor Agent / MiMoCode 环境下迭代，主要引用以下 **AI Skills**（路径相对于 monorepo 根目录 `sapmall/`）：

### 使用的 Skills

| Skill | 路径 | 作用 |
|-------|------|------|
| **design-taste-frontend** | `.agents/skills/design-taste-frontend/SKILL.md` | 反模板（Anti-Slop）前端设计：推断页面气质、设定三档拨盘、避免 AI 默认审美 |
| **redesign-existing-projects** | `.agents/skills/redesign-existing-projects/SKILL.md` | 改版审计：识别紫蓝渐变、Inter 泛滥、纯黑按钮等问题并定向升级 |
| **fronted-design** | `.cursor/skills/fronted-design/SKILL.md` | 高质感界面实现约束，与现有技术栈协作落地 |

### 其他可用 Skills（本项目未使用，但可按需引入）

| Skill | 路径 | 适用场景 |
|-------|------|----------|
| **high-end-visual-design** | `.agents/skills/high-end-visual-design/SKILL.md` | 定义高端视觉标准（字体、间距、阴影、卡片结构） |
| **minimalist-ui** | `.agents/skills/minimalist-ui/SKILL.md` | 极简编辑风格界面（暖色单色、字体对比、扁平 bento 网格） |
| **stitch-design-taste** | `.agents/skills/stitch-design-taste/SKILL.md` | 语义化设计系统，生成 DESIGN.md 强制执行反泛型 UI 标准 |
| **ui-ux-pro-max** | `.cursor/skills/ui-ux-pro-max/SKILL.md` | 67 种风格、96 种配色、57 种字体配对的 UI/UX 设计智能 |
| **imagegen-frontend-web** | `.agents/skills/imagegen-frontend-web/SKILL.md` | 前端设计参考图生成（每区一张图） |
| **brandkit** | `.agents/skills/brandkit/SKILL.md` | 品牌视觉系统（Logo、色彩、字体规范） |
| **image-to-code** | `.agents/skills/image-to-code/SKILL.md` | 图片转代码（设计稿 → 实现） |
| **gpt-taste** | `.agents/skills/gpt-taste/SKILL.md` | GSAP ScrollTrigger 动效 + AIDA 页面结构 |

### Design Read（设计读解）

> *Reading this as: Web3 电商品牌落地页，面向投资者与早期用户，偏 editorial / 信任优先语言，采用 Instrument Serif + Outfit 字体配对、浅色纸感分区与单一 Sapphire 蓝强调色。*

### 三档拨盘（design-taste-frontend）

| 拨盘 | 设定值 | 本项目体现 |
|------|--------|------------|
| **DESIGN_VARIANCE** | 6 | 结构规整（6 锚点、对称标题区），卡片网格有节奏变化 |
| **MOTION_INTENSITY** | 5–6 | 滚动 reveal + Hero stagger + FAQ 过渡，无过度物理动效 |
| **VISUAL_DENSITY** | 4 | 留白充足，单区块信息适中，非仪表盘高密度 |

### 刻意规避的 AI 默认模式

- 深色紫蓝 mesh 渐变 Hero
- Inter + `slate-900` 通用组合
- 黑白主按钮（已改为 `#149eca` 品牌蓝）
- 三等分完全相同的 feature 卡片墙
- 全站 glassmorphism / 无限循环微动效

### 保留的品牌资产

- 现有 Logo 标记（`src/assets/logo-mark.svg`）
- Sapphire 主色 `#149eca`（与 DApp 品牌延续）
- 核心文案结构（使命、功能、路线图、支持区）

---

## 环境配置

复制 `.env.example` 为 `.env.local` 并按部署环境修改：

```bash
cp .env.example .env.local
```

| 变量 | 说明 | 默认 |
|------|------|------|
| `REACT_APP_DAPP_URL` | DApp 入口 | `http://localhost:7102` |
| `REACT_APP_WHITEPAPER_URL` | 白皮书链接 | GitHub |
| `REACT_APP_DEMO_URL` | 演示视频 | YouTube |
| `REACT_APP_GITHUB_URL` | 代码仓库 | GitHub |
| `REACT_APP_TWITTER_URL` | Twitter | twitter.com |
| `REACT_APP_TELEGRAM_URL` | Telegram | t.me |
| `REACT_APP_DISCORD_URL` | Discord | discord.com |
| `REACT_APP_HELP_PATH` | DApp 帮助路径 | `/help` |
| `REACT_APP_AUDIT_URL` | 审计报告 | GitHub |

支付网络列表见 `src/config/siteLinks.ts` 中 `paymentNetworks`，与 DApp / 后端 `sys_chain_network` 对齐。

### DApp 预览截图

将截图放入 `public/images/dapp/`，文件名与 `src/config/dappPreviewImages.ts` 映射一致（含 `marketplace-zh.png`、`wallet-pay-zh.png` 等）。

---

## 开发指南

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装与运行

```bash
npm install
npm start      # http://localhost:3006
npm run build  # 输出 build/
npm test
```

### 新增首页区块（建议流程）

1. 在 `src/components/home/` 新建区块组件，使用 `section-block` + `section-header` 结构
2. 在 `HomePage.tsx` 引入并挂载到 `<main>`
3. 在 `SiteNav.tsx` / `SiteFooter.tsx` / `useActiveSection.ts` 补充锚点 ID
4. 在 `src/i18n/locales/zh|en/translation.json` 添加文案
5. 需要动效时用 `RevealOnScroll` + `staggerDelay()`，样式优先扩展 `index.css` 设计令牌

### 样式修改原则

- **优先改 CSS 变量**（`index.css` `:root`），再同步 `tailwind.config.js`
- 新组件复用 `.surface-card`、`.icon-box`、`.action-btn--*`、`.section-header` 等已有类
- 避免引入第二套 accent 色或新的展示字体，保持 editorial 一致性

---

## 构建与部署

- 生产构建：`npm run build`，静态资源输出至 `build/`
- 可用 `serve -s build` 本地预览生产包
- 部署时需注入正确的 `REACT_APP_*` 环境变量（CRA 构建时内联）

### 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

---

## 相关项目

| 项目 | 路径 | 关系 |
|------|------|------|
| DApp 商城 | `web_client/sapmall-dapp` | `REACT_APP_DAPP_URL` 跳转目标 |
| 管理后台 | `web_client/sapmall-admin` | 独立后台，官网仅外链展示 |
| 智能合约 | `contract/` | 支付 / 代币网络信息来源 |

---

## 许可证

© 2025 Sapphire Mall. 保留所有权利。
