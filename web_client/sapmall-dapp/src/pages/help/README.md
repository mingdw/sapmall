# 帮助中心（Help）

## 路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/help` | `HelpLayout` → `HelpHomePage` | 首页：话题筛选、指南列表、侧栏 FAQ/支持 |
| `/help/a/:slug` | `HelpLayout` → `HelpArticlePage` | 文章详情；无文章时显示未找到 |

路由注册：`HelpRoutes.tsx`，挂载于 `ContentLayout` 的 `/help/*`。

## 目录约定

- `HelpLayout`：Hero、Outlet、`pageRoot` CSS 变量
- `HelpHomePage`：index 首页（原 `HelpPage`）
- `styles/help.shared.module.scss`：模块内可复用面板/标题等
- `constants/helpLayoutClasses.ts`：多页共用 Tailwind 布局 class
- `components/*`：子组件，样式统一为 Tailwind（仅复用 `help.shared` 中的面板/标题 class）
- 页级 SCSS：`HelpLayout.module.scss`、`HelpHomePage.module.scss`（文章 404 已用 Tailwind）

样式规范见项目根 `.cursor/rules/frontend-page-styles.mdc`。
