# Examples - React Admin Prototype Conversion

## Example 1: Profile Page Conversion

### Input
- Prototype: `design/prototypes/admin/profile.html`
- Target: `web_client/sapmall-admin/src/pages/personal/profile`
- Requirement: KYC 弹窗 4 步流程、复制地址、设置开关

### Expected File Split
- `ProfileManager.tsx`
- `ProfileManager.module.scss`
- `components/UserHeaderCard.tsx`
- `components/ProfileSectionList.tsx`
- `components/KycModal.tsx`
- `types.ts`
- `mock.ts`

### Expected Route Integration
- In `src/router/AdminRouter.tsx` add:
  - `path="/personal/profile"`
  - `element={<ProfileManager />}`

### Expected Output Summary
1. 说明功能映射完成范围（头部信息、分区信息、KYC 流程）
2. 说明 mock 数据与后续 API 对接点
3. 说明 lint 结果

---

## Example 2: Generic Admin HTML Migration

### Input
- Prototype: `design/prototypes/admin/xxx.html`
- Target: `web_client/sapmall-admin/src/pages/platform/xxx`
- Requirement: 使用现有公共组件，不新增 UI 框架

### Expected Steps
1. 解析原型信息结构与交互点
2. 设计组件拆分和类型
3. 实现 mock-first 页面
4. 接入 `AdminRouter`
5. lint 验证并输出结果

### Expected Guardrails
- 复用 `AdminCard`、`AdminButton`、`AdminModal`
- 样式使用 `.module.scss`
- 不改坏已有布局体系
