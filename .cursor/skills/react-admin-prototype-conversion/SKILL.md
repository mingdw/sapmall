---
name: react-admin-prototype-conversion
description: Convert admin HTML prototypes into React + TypeScript + SCSS Module pages in sapmall-admin with existing common components, routing, and API conventions. Use when user asks for 原型转前端, HTML转React, admin页面还原, 后台页面改造, 页面迁移.
---

# React Admin Prototype Conversion

## Purpose
将 `design/prototypes/admin/*.html` 原型页面，转换为 `web_client/sapmall-admin` 下可维护的 React 页面，并严格遵循当前工程规范。

## When To Use
- 用户提到“原型转前端”
- 用户要求把 HTML 页面改造成 React/TS 页面
- 用户要求按现有后台技术栈复用公共组件与路由体系
- 需要从 `design/prototypes/admin` 迁移到 `web_client/sapmall-admin/src/pages`

## Canonical Prompt Source
- 使用 `promit/Project_Prompt_Templates.md` 中的 `T01` 作为默认模板基线。
- 当模板与实际代码冲突时，以仓库当前代码结构为准，并在结果说明中标注调整原因。

## Required Constraints
1. 技术栈必须保持：
   - React + TypeScript + SCSS Module + Ant Design
2. 优先复用公共组件：
   - `src/components/common/AdminCard.tsx`
   - `src/components/common/AdminButton.tsx`
   - `src/components/common/AdminModal.tsx`
3. 保持容器和路由兼容：
   - `src/layout/AdminLayout.tsx`
   - `src/components/AdminContentComponent.tsx`
   - `src/components/ComponentMapper.tsx`
   - `src/router/AdminRouter.tsx`
4. API 与错误处理遵循：
   - `src/services/api/baseClient.tsx`
   - `src/utils/messageUtils.tsx`
5. 样式要求：
   - 使用 `.module.scss`
   - 不引入新 UI 框架
   - 避免大段内联样式

## Workflow
1. **Read prototype**
   - 读取原型 HTML 的结构、信息块、交互点（弹窗、步骤、切换、筛选等）。
2. **Plan file split**
   - 给出页面目录结构（主页面 + components + types + mock）。
3. **Implement mock-first**
   - 先完成可运行交互，再预留 API TODO 接口点。
4. **Wire route**
   - 将页面接入 `AdminRouter`，路径与菜单 component 字段一致。
5. **Validate**
   - 读取改动文件的 lint 结果，修复可直接定位的问题。
6. **Report**
   - 输出改动文件列表、路由接入点、API 对接点、验证步骤。

## Output Format
按以下顺序输出：
1. 实现计划（简短分步骤）
2. 本次改动文件及原因
3. 路由接入方式
4. 后续 API 对接清单
5. 本地验证步骤
6. lint 检查结果

## Quality Checklist
- 视觉结构尽量贴近原型
- 代码风格与 `UserManage` / `ProductManagement` 保持一致
- 页面在常见分辨率下无明显溢出和裁切
- 关键交互（按钮、弹窗、步骤）可运行

## Extra Resources
- 详细验收清单见 `checklist.md`
- 模板示例见 `examples.md`
