# DAO 社区（Dao）

## 路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/dao` | `DaoLayout` → `DaoHomePage` | 首页：提案 / 讨论 / 活动三 Tab 列表与侧栏 |
| `/dao/events/:id` | `DaoLayout` → `DaoEventDetailPage` | 活动详情 |
| `/dao/proposals/:id` | `DaoLayout` → `DaoProposalDetailPage` | 提案详情 |
| `/dao/proposals/new` | `DaoLayout` → `DaoProposalCreatePage` | 发起提案 |
| `/dao/discussions/:id` | `DaoLayout` → `DaoDiscussionDetailPage` | 讨论详情 |
| `/dao/discussions/new` | `DaoLayout` → `DaoDiscussionCreatePage` | 发起讨论 |

路由注册：`DaoRoutes.tsx`，挂载于 `ContentLayout` 的 `/dao/*`。

## 目录约定

- `DaoLayout` + `DaoLayout.module.scss`：Hero、公告条、Outlet、`pageRoot` CSS 变量
- `DaoHomePage`：index 首页（列表 + 侧栏，布局用 Tailwind 常量）
- 子页面：`*DetailPage` / `*CreatePage` 薄包装，详情 UI 在 `components/Dao*Detail` 等
- `styles/dao.shared.module.scss`：面板、侧栏标题等模块内复用
- `styles/dao.detailCommon.module.scss`：详情页正文/面包屑等复用
- `styles/dao.listTags.module.scss`：列表与详情标签样式
- `constants/daoLayoutClasses.ts`：多页共用 Tailwind 布局 class
- `components/*`：逐步迁 Tailwind；Quill/Hero 动效见 `index.css` + `styles/daoHeroBackground.global.scss`
- **已迁 Tailwind**：侧栏卡片、公告条、分类浏览、标签筛选、规则卡、回复编辑器、Hero 壳层、活动详情、富文本壳层等
- **全局样式（非 Module）**：`styles/daoHeroBackground.global.scss`、`daoHeroCarousel.global.scss`、`daoTabOverview.global.scss`（由 `index.css` 引入，供 Hero/侧栏概览动效与布局）
- **仍保留 `.module.scss`**：`DaoMainListCard`、`DaoProposalDetail`、`DaoDiscussionDetail`、`DaoDiscussionEditor`、`DaoProposalEditor`（待续）

样式规范见项目根 `.cursor/rules/frontend-page-styles.mdc`。
