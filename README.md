# Sapphire Mall - Web3 虚拟商品交易平台

<div align="center">

![Sapphire Mall Logo](design/prototypes/favicon.svg)

**🌐 多语言支持 | [English](README_EN.md) | [中文](README.md)**

[![Platform](https://img.shields.io/badge/Platform-Web3-blue.svg)](https://web3js.org/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-green.svg)](https://ethereum.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Development-orange.svg)](https://github.com/your-username/sapmall)

</div>

---

## 📋 项目概述

**Sapphire Mall** 是一个专注于虚拟商品交易的创新型区块链电商平台。平台以自发行的ERC20代币SAP为核心流通媒介，通过流动性池提供便捷的代币兑换服务，引入流动性质押收益机制，并建立DAO治理系统，打造集购物、资产流通、收益获取、社区治理于一体的Web3虚拟商品生态。

### 🌟 核心特色

- **🎯 虚拟商品专精**: 专注于数字内容、软件工具、在线服务等虚拟商品交易
- **💎 流动性池兑换**: 通过流动性池提供便捷的代币兑换服务
- **💰 质押收益机制**: 流动性提供者可获得平台手续费分成收益
- **🏛️ DAO治理参与**: SAP持有者可参与平台重大决策投票
- **🌍 多语言支持**: 支持中英文双语，面向全球用户
- **🔐 透明链上结算**: 所有交易记录不可篡改，保障交易透明度

## 🏗️ 项目结构

```
sapmall/
├── 📁 docs/                          # 项目文档
│   ├── 📄 PRD.md                     # 产品需求文档 (83KB)
│   ├── 📄 White_Paper.md             # 技术白皮书 (27KB)
│   ├── 📄 Tokenomics_Detailed.md     # 代币经济模型详细文档 (16KB)
│   ├── 📄 Roadmap.md                 # 项目路线图 (21KB)
│   ├── 📄 User_Story_Map.md          # 用户故事地图 (29KB)
│   ├── 📄 Metrics_Framework.md       # 指标框架 (22KB)
│   └── 📄 Design_Update_Summary.md   # 设计更新总结 (5.8KB)
├── 📁 design/                        # 设计文件
│   ├── 📁 prototypes/                # 原型设计
│   │   ├── 🏠 index.html             # 官网首页
│   │   ├── 🛒 dapp.html              # DApp主界面
│   │   ├── ⚙️ admin.html             # 管理后台
│   │   ├── 📊 homepage.html          # 数据展示页面
│   │   ├── 📁 admin/                 # 管理功能模块
│   │   ├── 📁 dapp/                  # DApp功能模块
│   │   └── 📁 homepage/              # 首页功能模块
│   ├── 📁 specs/                     # 设计规范
│   └── 📄 项目交付总结.md            # 设计交付总结
├── 📁 promit/                        # 提示词和配置
│   ├── 📄 README.md                  # AI Agent 使用说明
│   ├── 📄 PM_Web3_Agent_Prompt.md   # 产品经理 Agent
│   ├── 📄 UIUX_Designer_Web3_Agent_Prompt.md  # UI/UX设计师 Agent
│   ├── 📄 Smart_Contract_Engineer_Agent_Prompt.md  # 智能合约工程师 Agent
│   ├── 📄 Web_Client_Web3_Agent_Prompt.md  # 前端开发工程师 Agent
│   └── 📄 Backend_Engineer_Agent_Prompt.md  # 后端开发工程师 Agent
├── 📁 pic/                           # 图片资源
├── 📄 package.json                   # 项目配置
├── 📄 tailwind.config.js            # Tailwind配置
└── 📄 generate_favicon.py           # 图标生成工具
```

## 🎨 设计原型

项目包含完整的Web3虚拟商品交易平台界面原型，采用现代化的设计风格：

### 🎯 设计特色
- **响应式设计**: 完美适配桌面端、平板端和移动端
- **暗色主题**: 符合Web3应用的视觉风格
- **交互动效**: 流畅的用户交互体验
- **组件化**: 可复用的UI组件系统
- **多语言**: 完整的中英文双语支持

### 📱 主要页面

| 页面 | 功能描述 | 文件路径 |
|------|----------|----------|
| 🏠 **官网首页** | 平台介绍、数据展示、快速入口 | `design/prototypes/index.html` |
| 🛒 **DApp主界面** | 商品浏览、代币兑换、质押管理 | `design/prototypes/dapp.html` |
| ⚙️ **管理后台** | 用户管理、商品审核、系统配置 | `design/prototypes/admin.html` |
| 📊 **数据展示** | 实时数据、统计图表、平台概览 | `design/prototypes/homepage.html` |
| 👤 **用户管理** | KYC审核、权限分配、数据分析 | `design/prototypes/admin/user-management.html` |

## 🚀 快速开始

### 1. 查看设计原型
   ```bash
# 打开官网首页
   open design/prototypes/index.html

# 打开DApp主界面
open design/prototypes/dapp.html

# 打开管理后台
open design/prototypes/admin.html
```

### 2. 浏览项目文档
- 📋 **产品需求**: [PRD.md](docs/PRD.md) - 详细的产品需求文档
- 📖 **技术白皮书**: [White_Paper.md](docs/White_Paper.md) - 技术架构和创新点
- 💰 **代币经济**: [Tokenomics_Detailed.md](docs/Tokenomics_Detailed.md) - 完整的经济模型
- 🗺️ **项目路线**: [Roadmap.md](docs/Roadmap.md) - 开发计划和里程碑
- 👥 **用户故事**: [User_Story_Map.md](docs/User_Story_Map.md) - 用户场景和需求
- 📊 **指标框架**: [Metrics_Framework.md](docs/Metrics_Framework.md) - 评估体系

## 💰 代币经济模型

### SAP代币基本信息
- **代币标准**: ERC-20
- **代币名称**: Sapphire Mall Token
- **代币符号**: SAP
- **总供应量**: 100,000,000 SAP
- **代币类型**: 功能型代币（Utility Token）

### 核心机制
- **流动性挖矿**: 用户提供流动性获得挖矿奖励
- **手续费分成**: 平台手续费的70%分配给流动性提供者
- **DAO治理**: SAP持有者可参与平台重大决策投票
- **通缩机制**: 多重销毁机制保持代币稀缺性

## 🛠️ 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **状态管理**: Redux Toolkit + RTK Query
- **UI框架**: Tailwind CSS + Headless UI
- **国际化**: react-i18next
- **Web3集成**: Wagmi + Viem + TanStack Query
- **钱包连接**: Web3Modal v3 + ConnectKit

### 智能合约技术
- **开发框架**: Hardhat + TypeScript
- **合约语言**: Solidity 0.8.19+
- **安全工具**: Slither + Mythril + OpenZeppelin
- **升级机制**: OpenZeppelin Upgrades
- **多签管理**: Gnosis Safe

### 后端服务
- **API服务**: Go + go-zero框架 + gRPC
- **数据库**: MySQL 8.0+ + Redis + MongoDB
- **区块链交互**: go-ethereum + 自定义RPC客户端
- **文件存储**: IPFS + Pinata + 阿里云OSS
- **微服务架构**: go-zero微服务 + etcd服务发现

## 🤖 AI 开发最佳实践

本项目积极采用 AI 辅助开发，建立了完整的 AI 开发工作流程和最佳实践体系。

### 🎯 AI Agent 使用指南

#### 中文指南
我们为项目开发配置了专门的 AI Agent，包括：

1. **产品经理 Agent** (`promit/PM_Web3_Agent_Prompt.md`)
   - 专注于 Web3 产品需求分析和产品规划
   - 制定产品路线图和功能优先级
   - 编写详细的产品需求文档（PRD）
   - 设计用户故事和用户旅程

2. **UI/UX 设计师 Agent** (`promit/UIUX_Designer_Web3_Agent_Prompt.md`)
   - 专注于 Web3 界面设计和用户体验
   - 支持多平台原型制作（桌面端、移动端、小程序）
   - 使用 HTML + Tailwind CSS + FontAwesome 技术栈
   - 生成像素级完美的高保真原型

3. **智能合约工程师 Agent** (`promit/Smart_Contract_Engineer_Agent_Prompt.md`)
   - 专注于智能合约开发和安全审计
   - 支持多链开发（Ethereum、Layer2、BSC、Solana等）
   - 遵循最新安全标准和最佳实践
   - 使用 Solidity/Vyper/Rust 等技术栈

4. **前端开发工程师 Agent** (`promit/Web_Client_Web3_Agent_Prompt.md`)
   - 专注于 Web3 前端应用开发
   - 使用 React + TypeScript + Web3 技术栈
   - 实现钱包连接和区块链交互
   - 构建响应式和用户友好的界面

5. **后端开发工程师 Agent** (`promit/Backend_Engineer_Agent_Prompt.md`)
   - 专注于后端服务和 API 开发
   - 使用 Go + 微服务架构
   - 实现区块链数据索引和处理
   - 构建高可用和可扩展的服务

#### English Guide
We have configured specialized AI Agents for project development, including:

1. **Product Manager Agent** (`promit/PM_Web3_Agent_Prompt.md`)
   - Focuses on Web3 product requirement analysis and product planning
   - Develops product roadmaps and feature priorities
   - Writes detailed product requirements documents (PRD)
   - Designs user stories and user journeys

2. **UI/UX Designer Agent** (`promit/UIUX_Designer_Web3_Agent_Prompt.md`)
   - Focuses on Web3 interface design and user experience
   - Supports multi-platform prototype creation (desktop, mobile, mini-program)
   - Uses HTML + Tailwind CSS + FontAwesome tech stack
   - Generates pixel-perfect high-fidelity prototypes

3. **Smart Contract Engineer Agent** (`promit/Smart_Contract_Engineer_Agent_Prompt.md`)
   - Focuses on smart contract development and security auditing
   - Supports multi-chain development (Ethereum, Layer2, BSC, Solana, etc.)
   - Follows latest security standards and best practices
   - Uses Solidity/Vyper/Rust and other tech stacks

4. **Frontend Developer Agent** (`promit/Web_Client_Web3_Agent_Prompt.md`)
   - Focuses on Web3 frontend application development
   - Uses React + TypeScript + Web3 tech stack
   - Implements wallet connection and blockchain interaction
   - Builds responsive and user-friendly interfaces

5. **Backend Developer Agent** (`promit/Backend_Engineer_Agent_Prompt.md`)
   - Focuses on backend services and API development
   - Uses Go + microservice architecture
   - Implements blockchain data indexing and processing
   - Builds highly available and scalable services

### 📝 提示词工程最佳实践

#### 中文指南
1. **明确角色定位**: 为每个 Agent 定义清晰的角色和职责范围
2. **结构化提示**: 使用清晰的格式和层次结构组织提示词
3. **上下文管理**: 提供足够的背景信息和项目上下文
4. **迭代优化**: 根据实际使用效果不断优化提示词内容
5. **版本控制**: 对提示词进行版本管理，记录改进历史

### 🔧 代码生成最佳实践

#### 中文指南
1. **代码审查**: 所有 AI 生成的代码必须经过人工审查
2. **测试覆盖**: 为生成的代码编写完整的测试用例
3. **安全检查**: 特别关注安全相关的代码，进行专项审计
4. **性能优化**: 对生成的代码进行性能分析和优化
5. **文档完善**: 为生成的代码编写清晰的文档和注释


### 🧪 AI 辅助测试策略

#### 中文指南
1. **自动化测试生成**: 使用 AI 生成单元测试、集成测试和端到端测试
2. **边界条件测试**: AI 帮助识别和测试边界条件和异常情况
3. **性能测试**: 使用 AI 生成性能测试脚本和负载测试
4. **安全测试**: AI 辅助进行安全漏洞扫描和渗透测试
5. **回归测试**: 自动化回归测试，确保新功能不影响现有功能


## 📊 项目指标

### 目标用户
- **月活跃用户 (MAU)**: 目标10,000+用户（6个月内）
- **日活跃用户 (DAU)**: 目标2,000+用户
- **用户留存率**: 7天留存率 > 40%，30天留存率 > 20%

### 业务目标
- **交易总量**: 月交易量目标100万美元
- **代币兑换量**: 日均兑换量 > 5万美元
- **质押总量**: 流动性池TVL > 500万美元
- **平台收入**: 月收入 > 2万美元

### 北极星指标
**月度流动性质押活跃用户数** - 反映平台核心价值和用户信任度

## 🤝 贡献指南

欢迎参与项目开发！请遵循以下步骤：

1. **Fork** 项目仓库
2. **创建功能分支**: `git checkout -b feature/AmazingFeature`
3. **提交代码更改**: `git commit -m 'Add some AmazingFeature'`
4. **推送到分支**: `git push origin feature/AmazingFeature`
5. **发起 Pull Request**

### 开发规范
- 遵循TypeScript编码规范
- 提交信息使用中文描述
- 新功能需要包含测试用例
- 重要更改需要更新相关文档

## 📄 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。

## 📞 联系我们

- **项目地址**: [https://github.com/your-username/sapmall](https://github.com/your-username/sapmall)
- **问题反馈**: [Issues](https://github.com/your-username/sapmall/issues)
- **讨论交流**: [Discussions](https://github.com/your-username/sapmall/discussions)

---

<div align="center">

**🌐 多语言支持 | [English](README_EN.md) | [中文](README.md)**

**Sapphire Mall** - 构建未来的Web3虚拟商品交易平台 🚀

</div>

## 🖼️ 项目原型图

项目主要页面截图如下，便于在 GitHub 上快速预览核心界面：

<p align="center">
  <img src="pic/官网首页_zh_01.png" alt="官网首页_zh_01" width="800" />
  <br /><em>官网首页_zh_01</em>
</p>
<p align="center">
  <img src="pic/官网首页_zh_02.png" alt="官网首页_zh_02" width="800" />
  <br /><em>官网首页_zh_02</em>
</p>
<p align="center">
  <img src="pic/官网首页_zh_03.png" alt="官网首页_zh_03" width="800" />
  <br /><em>官网首页_zh_03</em>
</p>
<p align="center">
  <img src="pic/官网首页_en_01.png" alt="官网首页_en_01" width="800" />
  <br /><em>官网首页_en_01</em>
</p>
<p align="center">
  <img src="pic/官网首页_en_02.png" alt="官网首页_en_02" width="800" />
  <br /><em>官网首页_en_02</em>
</p>
<p align="center">
  <img src="pic/官网首页_en_03.png" alt="官网首页_en_03" width="800" />
  <br /><em>官网首页_en_03</em>
</p>
<p align="center">
  <img src="pic/dapp_zh_商城首页_01.png" alt="dapp_zh_商城首页_01" width="800" />
  <br /><em>dapp_zh_商城首页_01</em>
</p>
<p align="center">
  <img src="pic/dapp_商品明细.png" alt="dapp_商品明细" width="800" />
  <br /><em>dapp_商品明细</em>
</p>
<p align="center">
  <img src="pic/dapp_zh_兑换.png" alt="dapp_zh_兑换" width="800" />
  <br /><em>dapp_zh_兑换</em>
</p>
<p align="center">
  <img src="pic/dapp_zh_质押.png" alt="dapp_zh_质押" width="800" />
  <br /><em>dapp_zh_质押</em>
</p>
<p align="center">
  <img src="pic/dapp_en_质押.png" alt="dapp_en_质押" width="800" />
  <br /><em>dapp_en_质押</em>
</p>
<p align="center">
  <img src="pic/dao首页.png" alt="dao首页" width="800" />
  <br /><em>dao首页</em>
</p>
<p align="center">
  <img src="pic/dao投票.png" alt="dao投票" width="800" />
  <br /><em>dao投票</em>
</p>
<p align="center">
  <img src="pic/帮助中心.png" alt="帮助中心" width="800" />
  <br /><em>帮助中心</em>
</p>
<p align="center">
  <img src="pic/admin_01_普通用户的后台管理_01.png" alt="admin_01_普通用户的后台管理_01" width="800" />
  <br /><em>admin_01_普通用户的后台管理_01</em>
</p>
<p align="center">
  <img src="pic/admin_01_普通用户的后台管理_02.png" alt="admin_01_普通用户的后台管理_02" width="800" />
  <br /><em>admin_01_普通用户的后台管理_02</em>
</p>
<p align="center">
  <img src="pic/admin_普通用户.png" alt="admin_普通用户" width="800" />
  <br /><em>admin_普通用户</em>
</p>
<p align="center">
  <img src="pic/admin_02_商家用户后台管理_01.png" alt="admin_02_商家用户后台管理_01" width="800" />
  <br /><em>admin_02_商家用户后台管理_01</em>
</p>
<p align="center">
  <img src="pic/admin_02_商家用户后台管理_02.png" alt="admin_02_商家用户后台管理_02" width="800" />
  <br /><em>admin_02_商家用户后台管理_02</em>
</p>
<p align="center">
  <img src="pic/admin_02_商家用户后台管理_02admin_02_商家用户后台管理_03.png" alt="admin_02_商家用户后台管理_02admin_02_商家用户后台管理_03" width="800" />
  <br /><em>admin_02_商家用户后台管理_02admin_02_商家用户后台管理_03</em>
</p>
<p align="center">
  <img src="pic/admin_02_商家用户后台管理_02admin_03_系统管理员用户后台管理_03.png" alt="admin_02_商家用户后台管理_02admin_03_系统管理员用户后台管理_03" width="800" />
  <br /><em>admin_02_商家用户后台管理_02admin_03_系统管理员用户后台管理_03</em>
</p> 