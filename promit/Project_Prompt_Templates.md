# SAPMall 项目通用提示词模板

## 说明
本文件用于沉淀 **SAPMall 全项目可复用** 的提示词模板。  
目标是统一 AI 协作输入格式，减少反复沟通成本，提升任务落地质量。

建议规则：
- 每个模板都包含：输入、约束、输出、验收标准；
- 明确目录、技术栈、禁止项；
- 模板编号可持续扩展（T01/T02/T03...）。

---

## T01 - 管理后台页面原型转 React 页面模板（个人中心示例）

请在当前仓库中完成“个人中心”页面从原型到 React 工程页面的转换，严格遵循现有技术栈和工程规范。

### 【输入与目标】
1. 原型来源文件：`design/prototypes/admin/profile.html`
2. 目标目录：`web_client/sapmall-admin/src/pages/personal/profile`
3. 目标工程：`web_client/sapmall-admin`
4. 页面定位：admin 后台的个人中心页面（可被现有菜单与路由体系加载）

### 【必须遵循的工程约束】
1. 技术栈：React + TypeScript + SCSS Module + Ant Design（按现有项目风格）
2. 优先复用公共组件，不重复造轮子：
   - `src/components/common/AdminCard.tsx`
   - `src/components/common/AdminButton.tsx`
   - `src/components/common/AdminModal.tsx`
3. 保持与现有容器机制兼容：
   - Layout: `src/layout/AdminLayout.tsx`
   - 内容容器: `src/components/AdminContentComponent.tsx`
   - 路由映射: `src/components/ComponentMapper.tsx` + `src/router/AdminRouter.tsx`
4. API风格与错误处理遵循现有封装：
   - `src/services/api/baseClient.tsx`
   - `src/utils/messageUtils.tsx`
5. 样式必须使用 module.scss，不使用内联大段样式，不引入新UI库
6. 图标沿用现有 FontAwesome 使用方式（与现有页面一致）

### 【功能拆解要求（按原型保真实现）】
A. 顶部用户信息卡片  
- 头像、用户名、钱包地址（含复制按钮）  
- 角色、KYC状态、开启认证按钮  
- 账户状态文案  

B. 个人信息详情区（分区卡片）  
- 基本信息：用户ID、昵称、性别、生日、注册时间  
- 联系方式：邮箱、手机号  
- 账户设置：公开资料、营销邮件、交易通知（switch）  
- 认证状态：KYC、邮箱验证、手机验证状态展示  

C. KYC认证弹窗（重点）  
- 使用 `AdminModal` 或 Antd `Modal`（优先 `AdminModal`）  
- 4步流程（步骤条 + 内容区 + 底部按钮）：
  1) 基本信息（姓名、证件号）  
  2) 上传身份证正反面（Upload）  
  3) 人脸验证引导（模拟流程）  
  4) 提交完成与待审核状态  
- 上一步/下一步/完成按钮逻辑完整  
- 基本表单校验、交互提示（message）  

D. 交互与状态  
- 复制地址成功提示  
- KYC状态随流程变化（未认证 -> 审核中/已提交）  
- 所有按钮先实现前端可运行逻辑（可先 mock）

### 【代码组织要求】
1. 在 `@profile` 目录下建立清晰结构（可按需要微调）：
   - `ProfileManager.tsx`（页面主组件）
   - `ProfileManager.module.scss`（页面样式）
   - `components/`（如 `UserHeaderCard`, `ProfileSectionList`, `KycModal`）
   - `types.ts`（类型定义）
   - `mock.ts`（临时数据）
2. 组件职责清晰，避免单文件过大；重要状态用 hooks 管理
3. TypeScript 类型完整，避免 any 泛滥
4. 保留后续接后端接口的扩展点（TODO 注释简洁标注）

### 【路由与接入要求】
1. 把新页面接入现有路由（`AdminRouter`）
2. 路由 path 与菜单 component 字段保持一致（若当前菜单字段未知，先给出采用的 path，并在说明中标注可配置项）
3. 不破坏现有页面和已有路由

### 【输出要求】
1. 先给“实现计划（分步骤）”，再开始改代码
2. 每完成一组改动，说明改了哪些文件、为何这样拆分
3. 最后给：
   - 关键实现说明
   - 路由接入点
   - 后续可对接的真实接口清单
   - 本地验证步骤（如何打开该页面）
4. 完成后执行并反馈与改动文件相关的 lint 检查结果（若有报错给出修复）

### 【质量标准】
- 页面视觉和交互尽量贴近 `profile.html` 原型
- 代码风格与 `UserManage` / `ProductManagement` 页面一致
- 无明显类型错误与低级可用性问题

---

## 可选增强短句（可附加到任一模板末尾）
- “禁止只给方案，不要停在分析阶段，必须完成可运行代码改造。”
- “如遇目录命名冲突，请先说明并给出兼容方案后再实施。”
- “改动后请给出最小回归检查清单：路由可达、弹窗可开闭、步骤可切换、复制成功提示可见。”

---

## 模板维护记录
- v1.0：初始化项目通用模板文档，纳入管理后台原型转码模板（T01）。
