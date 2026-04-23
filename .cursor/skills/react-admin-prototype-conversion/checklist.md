# Checklist - React Admin Prototype Conversion

## A. Input Validation
- [ ] 已确认原型来源文件路径（例如 `design/prototypes/admin/profile.html`）
- [ ] 已确认目标目录路径（例如 `web_client/sapmall-admin/src/pages/personal/profile`）
- [ ] 已确认目标路由 path

## B. Engineering Constraints
- [ ] 使用 React + TypeScript + SCSS Module
- [ ] 复用 `AdminCard` / `AdminButton` / `AdminModal`
- [ ] 不引入新 UI 框架
- [ ] 不破坏 `AdminLayout` 与 `AdminContentComponent` 兼容性

## C. Code Structure
- [ ] 页面主组件命名清晰（如 `ProfileManager.tsx`）
- [ ] 拆分 `components/`、`types.ts`、`mock.ts`
- [ ] 避免单文件过大和职责混杂
- [ ] 关键状态类型明确，避免不必要的 `any`

## D. Route Integration
- [ ] 在 `AdminRouter` 中接入新页面
- [ ] 路由路径与菜单 component 字段一致
- [ ] 404 与默认路由行为未被破坏

## E. Interaction Completeness
- [ ] 核心按钮有行为或提示
- [ ] 弹窗开关与状态流程可运行
- [ ] 表单基础校验可用
- [ ] 复制、切换、步骤流等反馈正常

## F. Layout/Style Quality
- [ ] 页面无明显横向溢出
- [ ] 左右内边距对称
- [ ] 卡片层级无重复视觉噪音
- [ ] 移动端/窄屏有基础适配

## G. Verification Output
- [ ] 列出改动文件清单
- [ ] 列出可对接 API 点
- [ ] 提供本地验证步骤
- [ ] 汇报 lint 检查结果
