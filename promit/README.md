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

## 2. 自定义 Agent 的步骤

### 2.1 打开 Chat 对话框

1. 在 Cursor IDE 中，使用快捷键 `Cmd + I`（Mac）或 `Ctrl + I`（Windows/Linux）打开 Chat 对话框
2. 或者点击左侧边栏的 Chat 图标

### 2.2 点击 Agent 按钮

1. 在 Chat 对话框的底部，找到左下角的 **Agent** 按钮
2. 点击该按钮，会弹出 Agent 选择面板

### 2.3 添加自定义模型

1. 在 Agent 选择面板中，点击 **"Add Custom Model"** 或 **"添加自定义模型"** 按钮
2. 系统会打开自定义 Agent 配置界面

### 2.4 配置 Agent 参数

在配置界面中，你需要设置以下参数：

#### 基本设置
- **Name（名称）**：为你的自定义 Agent 起一个描述性的名称，如 "Code Reviewer"、"Test Generator" 等
- **Model（模型）**：选择底层 AI 模型，如 GPT-4、Claude 等
- **Temperature（温度）**：控制输出的随机性，0-1 之间，数值越低越确定性

#### 高级设置
- **System Prompt（系统提示）**：定义 Agent 的角色和行为规范
- **Tools（工具）**：选择 Agent 可以使用的工具，如文件编辑、终端命令、搜索等
- **Context（上下文）**：设置 Agent 可以访问的文件范围

#### 示例配置
```
Name: Code Reviewer
Model: GPT-4
Temperature: 0.3
System Prompt: 你是一个专业的代码审查员，专注于代码质量、安全性和最佳实践。请仔细检查代码并提供改进建议。
Tools: Edit, Search, Terminal
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

本目录包含了两个专门为 Web3 开发设计的 Agent 提示词模板，可以直接在 Cursor 中使用：

### 5.1 UI/UX Designer Agent

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

**使用方法**：
1. 在 Cursor 中创建自定义 Agent
2. 将 `UIUX_Designer_Web3_Agent_Prompt.md` 的内容复制到 System Prompt
3. 配置相应的工具权限（Edit, Search）
4. 提供 PRD 文档和用户故事地图

### 5.2 Smart Contract Engineer Agent

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

**使用方法**：
1. 在 Cursor 中创建自定义 Agent
2. 将 `Smart_Contract_Engineer_Agent_Prompt.md` 的内容复制到 System Prompt
3. 配置相应的工具权限（Edit, Search, Terminal）
4. 提供 PRD 文档和业务需求

### 5.3 Agent 协作流程

这两个 Agent 可以协同工作，形成完整的 Web3 开发流程：

1. **PM Agent** 产出 PRD 和用户故事地图
2. **UI/UX Designer Agent** 创建高保真原型
3. **Smart Contract Engineer Agent** 实现智能合约
4. **Frontend Developer Agent** 集成前端和合约

### 5.4 快速开始

要使用这些 Agent，请按以下步骤操作：

1. **复制 Agent 提示词**：
   ```bash
   # 复制 UI/UX Designer Agent
   cp UIUX_Designer_Web3_Agent_Prompt.md ~/.cursor/agents/ui-ux-designer.md
   
   # 复制 Smart Contract Engineer Agent
   cp Smart_Contract_Engineer_Agent_Prompt.md ~/.cursor/agents/smart-contract-engineer.md
   ```

2. **在 Cursor 中配置**：
   - 打开 Chat 对话框
   - 点击 Agent 按钮
   - 选择 "Add Custom Model"
   - 将对应的提示词内容粘贴到 System Prompt
   - 配置相应的工具权限

3. **开始使用**：
   - 选择对应的 Agent
   - 提供项目需求和 PRD 文档
   - 开始协作开发

## 6. 最佳实践与常见问题

### 6.1 最佳实践

1. **明确角色定位**：为每个 Agent 定义清晰的角色和职责
2. **优化系统提示**：详细描述期望的行为和输出格式
3. **合理选择工具**：只启用 Agent 真正需要的工具
4. **测试和迭代**：通过实际使用不断优化 Agent 配置

### 6.2 常见问题

**Q: Agent 没有按预期工作？**
A: 检查系统提示是否清晰，工具权限是否正确设置

**Q: 如何让 Agent 更专业？**
A: 在系统提示中加入具体的专业知识和标准

**Q: 可以创建多少个自定义 Agent？**
A: 理论上没有限制，但建议控制在 5-10 个以内，便于管理

**Q: 如何分享自定义 Agent？**
A: 目前 Cursor 的自定义 Agent 是本地配置，可以通过导出配置文件分享

## 7. 参考资料

- [Cursor 官方文档](https://docs.cursor.so/)
- [Cursor 社区论坛](https://forum.cursor.com/)
- [Cursor Agent 最佳实践](https://forum.cursor.com/t/tips-for-agent-its-very-powerful/33111)

---

如有疑问，欢迎在社区或评论区交流！
