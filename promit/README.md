# Cursor 自定义 Agent 使用说明

> 本文档介绍如何在 [Cursor IDE](https://www.cursor.so/) 中自定义 agent（智能助手），以及如何高效使用自定义 agent 赋能你的开发流程。内容涵盖 agent 创建步骤、配置参数、使用方法与最佳实践。

---

## 目录
- [1. 什么是 Cursor Agent？](#1-什么是-cursor-agent)
- [2. 自定义 Agent 的步骤](#2-自定义-agent-的步骤)
  - [2.1 打开 Chat 对话框](#21-打开-chat-对话框)
  - [2.2 点击 Agent 按钮](#22-点击-agent-按钮)
  - [2.3 添加自定义模型](#23-添加自定义模型)
  - [2.4 配置 Agent 参数](#24-配置-agent-参数)
- [3. 自定义 Agent 的配置选项](#3-自定义-agent-的配置选项)
- [4. 如何使用自定义 Agent](#4-如何使用自定义-agent)
- [5. 当前目录下的 Agent 说明](#5-当前目录下的-agent-说明)
- [6. 最佳实践与常见问题](#6-最佳实践与常见问题)
- [7. 参考资料](#7-参考资料)

---

## 1. 什么是 Cursor Agent？

Cursor Agent 是 Cursor IDE 内置的 AI 智能助手，可以理解你的自然语言指令，自动完成代码编辑、批量重构、终端命令执行等复杂任务。通过自定义 agent，你可以让 AI 具备特定的能力，如代码审查、自动测试、文档生成等。

## 2. 自定义 Agent 的步骤（详细指南）

### ⚠️ 重要提示：区分 Models 和 Agents

- **Models（模型）页面**：用于管理 AI 模型（如 GPT-4、Claude 等），**不是**配置 Agent 的地方
- **Agents（智能助手）页面**：用于创建和配置自定义 Agent，**这才是**我们要去的地方

如果你点击 "Add Custom Model" 后进入了 Models 页面，请按照下面的步骤正确进入 Agents 页面。

### 2.1 打开 Cursor 设置

1. 使用快捷键 `Cmd/Ctrl + ,` 打开 Settings（设置）
2. 或者点击菜单栏：`File` → `Preferences` → `Settings`

### 2.2 找到 Agent 设置入口

在 Cursor 中，创建自定义 Agent 的正确方式是通过 **Chat 对话框**中的 **Custom Modes（自定义模式）**功能：

**正确方式：通过 Chat 对话框创建 Custom Mode**

1. **打开 Chat 对话框**：
   - 使用快捷键 `Cmd/Ctrl + I` 打开 Chat
   - 或者点击左侧边栏的 Chat 图标

2. **找到模式选择器**：
   - 在 Chat 对话框的顶部或底部，找到**模式选择器**（Mode Selector）
   - 可能显示为下拉菜单或按钮，通常显示当前模式（如 "Chat"、"Composer"、"Agent" 等）

3. **添加自定义模式**：
   - 点击模式选择器，查看可用的模式列表
   - 查找 **"Add Custom Mode"**、**"Create Custom Mode"** 或 **"+"** 按钮
   - 点击该按钮，打开自定义模式配置界面

**⚠️ 重要说明**：
- Settings → Agents 页面是**通用设置**，不是创建 Agent 的地方
- 实际的 Agent 创建需要通过 Chat 对话框中的 Custom Modes 功能
- Custom Mode 就是自定义 Agent 的另一种说法

### 2.3 添加自定义 Agent（手动添加项目中的 Agent）

#### 步骤 1：打开 Custom Mode 配置界面

1. **打开 Chat 对话框**（`Cmd/Ctrl + I`）

2. **找到模式选择器**：
   - 在 Chat 对话框的顶部或底部查找模式选择器
   - 可能显示为下拉菜单，当前可能显示 "Chat"、"Composer" 或 "Agent"

3. **点击模式选择器**，查看模式列表

4. **添加自定义模式**：
   - 在模式列表中查找 **"Add Custom Mode"**、**"Create Custom Mode"**、**"+"** 或类似的按钮
   - 点击该按钮，打开自定义模式配置界面

**如果找不到模式选择器或添加按钮**：
- 尝试在 Chat 对话框中右键点击，查看是否有相关选项
- 或者查看 Chat 对话框的设置图标（齿轮图标）
- 确保 Cursor 已更新到最新版本

**⚠️ 重要提示**：
- Settings → Agents 页面显示的是 Agent 的**通用设置**（如默认模式、文本大小等），不是创建 Agent 的地方
- 创建自定义 Agent 需要通过 Chat 对话框中的 **Custom Modes** 功能
- Custom Mode = 自定义 Agent

#### 步骤 2：配置基本参数

在 Custom Mode 配置界面中，填写以下基本信息：

- **Name（名称）**：为你的自定义 Agent 起一个描述性的名称
  - 例如：`PM Web3 Agent`、`UI/UX Designer`、`Smart Contract Engineer` 等
  
- **Icon（图标）**（可选）：为 Agent 选择一个图标

- **Shortcut（快捷键）**（可选）：设置一个快捷键来快速切换到这个 Agent

- **Model（模型）**：选择底层 AI 模型
  - 推荐选项：`GPT-4 Turbo`、`Claude 3.5 Sonnet`、`GPT-4` 等
  - 根据你的 Cursor 订阅计划选择可用的模型
  - 如果配置界面中没有 Model 选项，可能需要在 Settings → Models 中先启用模型

- **Temperature（温度）**（如果可用）：控制输出的随机性
  - 范围：0-1 之间
  - 推荐值：
    - 代码生成：0.2-0.3（更确定性）
    - 创意设计：0.7-0.9（更随机性）
    - 一般任务：0.5-0.7
  - 注意：某些版本的 Cursor 可能不显示 Temperature 选项

#### 步骤 3：添加 System Prompt（系统提示词）

这是最关键的一步，需要将项目中的 Agent 提示词文件内容复制到 System Prompt 字段：

1. **打开项目中的 Agent 文件**：
   - 在 Cursor 中打开 `promit/` 目录下的 Agent 提示词文件（如 `PM_Web3_Agent_Prompt.md`）
   - 或者使用文件管理器找到对应的 `.md` 文件

2. **复制全部内容**：
   - 使用 `Cmd/Ctrl + A` 全选文件内容
   - 使用 `Cmd/Ctrl + C` 复制

3. **粘贴到 Instructions 字段**：
   - 在 Custom Mode 配置界面中，找到 **Instructions**、**Custom Instructions**、**System Prompt** 或 **System Instructions** 字段
   - 这个字段可能是一个大的文本输入框
   - 点击该字段，使用 `Cmd/Ctrl + V` 粘贴刚才复制的内容
   - 确保所有内容都已正确粘贴
   - 这是最关键的一步，这个字段定义了 Agent 的行为和角色

#### 步骤 4：配置工具权限

根据 Agent 的用途，选择合适的工具权限（Tools）：

- **Edit（编辑）**：允许 Agent 编辑代码文件
  - ✅ 所有 Agent 都应该启用
  
- **Search（搜索）**：允许 Agent 搜索代码库
  - ✅ 所有 Agent 都应该启用
  
- **Terminal（终端）**：允许 Agent 执行终端命令
  - ✅ 推荐用于：Backend Engineer、Smart Contract Engineer
  - ❌ 通常不需要：PM、UI/UX Designer
  
- **MCP（Model Context Protocol）**：允许 Agent 使用外部工具和服务
  - 根据具体需求选择

**注意**：工具权限选项可能以复选框（Checkbox）或开关（Toggle）的形式出现，确保启用所需的工具。

#### 步骤 5：保存配置

1. 检查所有配置项是否正确
2. 点击 **Save**（保存）或 **Create**（创建）按钮
3. Agent 创建成功后，会在 Agent 列表中显示

### 2.4 配置示例

以下是一个完整的配置示例（以 PM Web3 Agent 为例）：

```
Name: PM Web3 Agent
Model: GPT-4 Turbo
Temperature: 0.6
System Prompt: [粘贴 PM_Web3_Agent_Prompt.md 的全部内容]
Tools: ✅ Edit, ✅ Search, ❌ Terminal
```

## 3. 自定义 Agent 的配置选项

### 3.1 系统提示（System Prompt）

系统提示是定义 Agent 行为的关键，建议包含：
- Agent 的角色定位
- 具体任务描述
- 输出格式要求
- 代码风格偏好

**示例系统提示：**
```
你是一个专业的代码审查员，专注于：
1. 代码质量和可读性
2. 安全漏洞检查
3. 性能优化建议
4. 最佳实践遵循

请以结构化的方式提供反馈，包括：
- 问题严重程度（高/中/低）
- 具体问题描述
- 改进建议
- 示例代码（如适用）
```

### 3.2 工具选择

根据 Agent 的用途选择合适的工具：
- **Edit**：允许 Agent 编辑代码文件
- **Search**：允许 Agent 搜索代码库
- **Terminal**：允许 Agent 执行终端命令
- **MCP**：允许 Agent 使用外部工具和服务

### 3.3 上下文设置

- **File Context**：指定 Agent 可以访问的文件范围
- **Repository Context**：设置整个代码库的访问权限
- **Memory**：配置 Agent 的记忆能力

## 4. 如何使用自定义 Agent

### 4.1 激活自定义 Agent

1. 打开 Chat 对话框（`Cmd/Ctrl + I`）
2. 点击左下角的 Agent 按钮
3. 从列表中选择你创建的自定义 Agent
4. 开始与 Agent 对话

### 4.2 典型使用场景

#### 代码审查 Agent
```
用户：请审查这个函数的安全性
Agent：[分析代码并提供安全建议]
```

#### 测试生成 Agent
```
用户：为这个组件生成单元测试
Agent：[生成完整的测试用例]
```

#### 文档生成 Agent
```
用户：为这个 API 生成文档
Agent：[生成符合规范的 API 文档]
```

### 4.3 多 Agent 协作

你可以创建多个专门的 Agent，并在不同场景下使用：
- **Code Reviewer**：代码审查
- **Test Generator**：测试生成
- **Doc Writer**：文档编写
- **Bug Finder**：问题排查

## 5. 当前目录下的 Agent 说明

本目录包含了 **5 个专门为 Web3 开发设计的 Agent 提示词模板**，可以直接在 Cursor 中使用。这些 Agent 可以协同工作，形成完整的 Web3 开发流程。

### 5.1 PM Web3 Agent（产品经理）

**文件位置**：`PM_Web3_Agent_Prompt.md`

**主要功能**：
- 将模糊的产品构想转化为清晰、可执行的产品规划方案
- 生成完整的产品需求文档（PRD）
- 创建用户故事地图和产品路线图
- 进行市场分析和竞品分析

**适用场景**：
- 产品规划与设计
- PRD 文档生成
- 需求分析与整理
- 产品迭代规划

**推荐配置**：
- Model: GPT-4 Turbo
- Temperature: 0.6
- Tools: ✅ Edit, ✅ Search

**使用方法**：
1. 按照 [第 2 节](#2-自定义-agent-的步骤详细指南) 的步骤创建 Agent
2. 将 `PM_Web3_Agent_Prompt.md` 的**全部内容**复制到 System Prompt
3. 配置工具权限（Edit, Search）
4. 提供产品创意或需求，Agent 会生成完整的 PRD 文档

---

### 5.2 UI/UX Designer Agent（UI/UX 设计师）

**文件位置**：`UIUX_Designer_Web3_Agent_Prompt.md`

**主要功能**：
- 将产品需求转化为高保真 HTML 原型
- 支持多平台设计（桌面端、Web端、移动端、小程序、浏览器插件）
- 使用 HTML + Tailwind CSS + FontAwesome 技术栈
- 生成像素级完美、高度仿真、可交互的多界面原型

**适用场景**：
- Web3 DApp 界面设计
- 多平台原型制作
- 高保真 UI 实现
- 设计规范制定

**推荐配置**：
- Model: GPT-4 Turbo
- Temperature: 0.5
- Tools: ✅ Edit, ✅ Search

**使用方法**：
1. 按照 [第 2 节](#2-自定义-agent-的步骤详细指南) 的步骤创建 Agent
2. 将 `UIUX_Designer_Web3_Agent_Prompt.md` 的**全部内容**复制到 System Prompt
3. 配置工具权限（Edit, Search）
4. 提供 PRD 文档和用户故事地图，Agent 会生成高保真原型

---

### 5.3 Smart Contract Engineer Agent（智能合约工程师）

**文件位置**：`Smart_Contract_Engineer_Agent_Prompt.md`

**主要功能**：
- 将产品需求转化为安全、高效的智能合约
- 支持多链开发（Ethereum、Layer2、BSC、Solana、Polkadot、Cosmos）
- 使用 Solidity/Vyper/Rust 等技术栈
- 遵循最新安全标准和最佳实践

**适用场景**：
- 智能合约开发
- 安全审计和优化
- DeFi 协议实现
- 跨链应用开发

**推荐配置**：
- Model: GPT-4 Turbo
- Temperature: 0.3
- Tools: ✅ Edit, ✅ Search, ✅ Terminal

**使用方法**：
1. 按照 [第 2 节](#2-自定义-agent-的步骤详细指南) 的步骤创建 Agent
2. 将 `Smart_Contract_Engineer_Agent_Prompt.md` 的**全部内容**复制到 System Prompt
3. 配置工具权限（Edit, Search, Terminal）
4. 提供 PRD 文档和业务需求，Agent 会生成智能合约代码

---

### 5.4 Backend Engineer Agent（后端工程师）

**文件位置**：`Backend_Engineer_Agent_Prompt.md`

**主要功能**：
- 设计并开发稳定、高效、可扩展的后端服务
- 生成 OpenAPI 3.0 规范的 API 文档
- 设计数据库模型和架构
- 实现业务逻辑和数据交互

**适用场景**：
- 后端 API 开发
- 数据库设计
- 系统架构设计
- 业务逻辑实现

**推荐配置**：
- Model: GPT-4 Turbo
- Temperature: 0.3
- Tools: ✅ Edit, ✅ Search, ✅ Terminal

**使用方法**：
1. 按照 [第 2 节](#2-自定义-agent-的步骤详细指南) 的步骤创建 Agent
2. 将 `Backend_Engineer_Agent_Prompt.md` 的**全部内容**复制到 System Prompt
3. 配置工具权限（Edit, Search, Terminal）
4. 提供 PRD 文档，Agent 会生成 API 定义和数据库设计

---

### 5.5 Web Client Web3 Agent（Web 前端工程师）

**文件位置**：`Web_Client_Web3_Agent_Prompt.md`

**主要功能**：
- 使用现代前端框架（Next.js）实现 Web 应用
- 根据 UI 截图和设计规范高保真还原界面
- 集成 Web3 前端框架（Ethers.js、Wagmi 等）
- 实现业务逻辑和数据交互

**适用场景**：
- Web3 DApp 前端开发
- UI 界面实现
- Web3 钱包集成
- 前后端联调

**推荐配置**：
- Model: GPT-4 Turbo
- Temperature: 0.3
- Tools: ✅ Edit, ✅ Search, ✅ Terminal

**使用方法**：
1. 按照 [第 2 节](#2-自定义-agent-的步骤详细指南) 的步骤创建 Agent
2. 将 `Web_Client_Web3_Agent_Prompt.md` 的**全部内容**复制到 System Prompt
3. 配置工具权限（Edit, Search, Terminal）
4. 提供 UI 截图、设计规范和 API 文档，Agent 会生成前端代码

---

### 5.6 Agent 协作流程

这 5 个 Agent 可以协同工作，形成完整的 Web3 开发流程：

```
1. PM Web3 Agent
   ↓ 产出 PRD 和用户故事地图
   
2. UI/UX Designer Agent
   ↓ 创建高保真原型和设计规范
   
3. Smart Contract Engineer Agent
   ↓ 实现智能合约
   
4. Backend Engineer Agent
   ↓ 实现后端 API
   
5. Web Client Web3 Agent
   ↓ 集成前端、后端和合约
```

### 5.7 快速开始指南

#### 方法：通过 Chat 对话框创建 Custom Mode（正确方式）

1. **打开 Chat 对话框**：
   - 使用快捷键 `Cmd/Ctrl + I` 打开 Chat

2. **找到模式选择器**：
   - 在 Chat 对话框的顶部或底部，找到**模式选择器**（Mode Selector）
   - 可能显示为下拉菜单，当前可能显示 "Chat"、"Composer" 或 "Agent"

3. **添加自定义模式**：
   - 点击模式选择器，查看模式列表
   - 查找 **"Add Custom Mode"**、**"Create Custom Mode"**、**"+"** 或类似的按钮
   - 点击该按钮，打开 Custom Mode 配置界面

4. **打开并复制 Agent 文件内容**：
   - 在 Cursor 中打开 `promit/` 目录下的 Agent 文件（如 `PM_Web3_Agent_Prompt.md`）
   - 使用 `Cmd/Ctrl + A` 全选
   - 使用 `Cmd/Ctrl + C` 复制全部内容

5. **配置 Custom Mode**：
   - **Name**：填写 Agent 名称（如：PM Web3 Agent）
   - **Icon**（可选）：选择一个图标
   - **Shortcut**（可选）：设置快捷键
   - **Model**：如果可用，选择底层 AI 模型（如：GPT-4 Turbo、Claude 3.5 Sonnet 等）
   - **Instructions / Custom Instructions**：**将复制的提示词内容粘贴到这里**（这是最关键的一步）
   - **Tools**：配置工具权限（Edit、Search、Terminal 等）
   - 点击 **Save**、**Create** 或 **Done** 保存

6. **重复步骤 3-5**，为其他 Agent 文件创建对应的 Custom Mode

**⚠️ 重要提示**：
- Settings → Agents 页面是通用设置，不是创建 Agent 的地方
- 必须通过 Chat 对话框中的 Custom Modes 功能来创建自定义 Agent

#### 方法二：批量添加

如果你想一次性添加所有 Agent，可以：

1. 按照方法一的步骤，逐个添加每个 Agent
2. 建议按照工作流程顺序添加：
   - 先添加 PM Web3 Agent
   - 再添加 UI/UX Designer Agent
   - 然后添加 Smart Contract Engineer Agent
   - 接着添加 Backend Engineer Agent
   - 最后添加 Web Client Web3 Agent

### 5.8 验证 Agent 是否配置成功

1. 打开 Chat 对话框（`Cmd/Ctrl + I`）
2. 点击左下角的 Agent 按钮
3. 在 Agent 列表中应该能看到你创建的所有 Agent
4. 选择一个 Agent，开始对话测试

**测试示例**（以 PM Web3 Agent 为例）：
```
用户：我想开发一个去中心化的投票 DApp，请帮我生成 PRD 文档
Agent：[应该会开始提问并生成完整的 PRD 文档]
```

## 6. 最佳实践与常见问题

### 6.1 最佳实践

1. **明确角色定位**：为每个 Agent 定义清晰的角色和职责
2. **优化系统提示**：详细描述期望的行为和输出格式
3. **合理选择工具**：只启用 Agent 真正需要的工具
4. **测试和迭代**：通过实际使用不断优化 Agent 配置

### 6.2 常见问题

**Q: 如何找到 Agent 设置页面？**
A: 
- **正确方式**：打开 Settings（`Cmd/Ctrl + ,`），在左侧导航菜单中点击 **"Agents"**
- ⚠️ **注意**：不是 "Models" 页面，而是 **"Agents"** 页面
- 如果左侧导航菜单中没有 "Agents"，可能是 Cursor 版本较旧，建议更新到最新版本

**Q: Settings → Agents 页面没有添加 Agent 的按钮？**
A:
- **这是正常的**！Settings → Agents 页面显示的是 Agent 的通用设置，不是创建 Agent 的地方
- **正确方式**：通过 Chat 对话框创建 Custom Mode
  1. 打开 Chat（`Cmd/Ctrl + I`）
  2. 找到模式选择器（Mode Selector）
  3. 点击 "Add Custom Mode" 或类似的按钮
  4. 在配置界面中填写信息并粘贴提示词

**Q: 找不到模式选择器或 "Add Custom Mode" 按钮？**
A:
- 确保 Cursor 已更新到最新版本
- 尝试在 Chat 对话框中查找：
  - 顶部或底部的下拉菜单
  - 设置图标（齿轮图标）
  - 右键菜单
- 如果仍然找不到，可能需要启用 Custom Modes 功能：
  - Settings → Features → Chat → 启用 Custom Modes

**Q: Instructions / System Prompt 字段在哪里？**
A:
- 在 Custom Mode 配置界面中
- 可能显示为 "Instructions"、"Custom Instructions"、"System Prompt"、"System Instructions" 等
- 通常是一个大的文本输入框
- 如果找不到，请确认你打开的是 Custom Mode 配置界面，而不是其他设置页面

**Q: 如何确认提示词已正确粘贴？**
A:
- 检查 System Prompt 字段中的内容是否完整
- 确认没有遗漏文件开头的部分
- 可以滚动查看整个字段内容

**Q: Agent 没有按预期工作？**
A: 
- 检查 System Prompt 是否完整粘贴（建议重新复制粘贴一次）
- 确认工具权限是否正确设置
- 检查选择的模型是否支持 Agent 功能
- 尝试调整 Temperature 参数

**Q: 如何让 Agent 更专业？**
A: 
- 确保 System Prompt 内容完整
- 在对话中明确说明你的需求
- 提供足够的上下文信息（如 PRD 文档、设计规范等）

**Q: 可以创建多少个自定义 Agent？**
A: 
- 理论上没有限制
- 建议控制在 5-10 个以内，便于管理
- 本项目提供了 5 个专业 Agent，建议全部添加

**Q: 如何分享自定义 Agent？**
A: 
- 目前 Cursor 的自定义 Agent 是本地配置
- 可以通过分享提示词文件（`.md` 文件）给其他用户
- 其他用户按照相同的步骤添加即可

**Q: 如何删除或编辑已创建的 Agent？**
A:
- 在 Agent 选择面板中，找到对应的 Agent
- 通常会有编辑或删除选项（可能是右键菜单或设置图标）
- 或者通过 Cursor 设置中的 Agent 管理功能

**Q: 提示词文件很大，粘贴时卡顿怎么办？**
A:
- 这是正常现象，等待粘贴完成即可
- 如果粘贴失败，尝试分段粘贴
- 确保 Cursor 有足够的内存和性能

## 7. 参考资料

- [Cursor 官方文档](https://docs.cursor.so/)
- [Cursor 社区论坛](https://forum.cursor.com/)
- [Cursor Agent 最佳实践](https://forum.cursor.com/t/tips-for-agent-its-very-powerful/33111)

---

如有疑问，欢迎在社区或评论区交流！
