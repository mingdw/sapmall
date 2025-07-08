# Sapphire Mall - Web3 Virtual Goods Trading Platform

<div align="center">

![Sapphire Mall Logo](design/prototypes/favicon.svg)

**🌐 Multi-language Support | [English](README_EN.md) | [中文](README.md)**

[![Platform](https://img.shields.io/badge/Platform-Web3-blue.svg)](https://web3js.org/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-green.svg)](https://ethereum.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Development-orange.svg)](https://github.com/your-username/sapmall)

</div>

---

## 📋 Project Overview

**Sapphire Mall** is an innovative blockchain e-commerce platform focused on virtual goods trading. The platform uses the self-issued ERC20 token SAP as the core circulation medium, provides convenient token exchange services through liquidity pools, introduces liquidity staking reward mechanisms, and establishes a DAO governance system, creating a Web3 virtual goods ecosystem that integrates shopping, asset circulation, profit acquisition, and community governance.

### 🌟 Core Features

- **🎯 Virtual Goods Specialization**: Focus on digital content, software tools, online services and other virtual goods trading
- **💎 Liquidity Pool Exchange**: Provide convenient token exchange services through liquidity pools
- **💰 Staking Reward Mechanism**: Liquidity providers can receive platform fee sharing rewards
- **🏛️ DAO Governance Participation**: SAP holders can participate in platform major decision voting
- **🌍 Multi-language Support**: Support Chinese and English bilingual, targeting global users
- **🔐 Transparent On-chain Settlement**: All transaction records are immutable, ensuring transaction transparency

## 🏗️ Project Structure

```
sapmall/
├── 📁 docs/                          # Project Documentation
│   ├── 📄 PRD.md                     # Product Requirements Document (83KB)
│   ├── 📄 White_Paper.md             # Technical White Paper (27KB)
│   ├── 📄 Tokenomics_Detailed.md     # Token Economics Detailed Document (16KB)
│   ├── 📄 Roadmap.md                 # Project Roadmap (21KB)
│   ├── 📄 User_Story_Map.md          # User Story Map (29KB)
│   ├── 📄 Metrics_Framework.md       # Metrics Framework (22KB)
│   └── 📄 Design_Update_Summary.md   # Design Update Summary (5.8KB)
├── 📁 design/                        # Design Files
│   ├── 📁 prototypes/                # Prototype Design
│   │   ├── 🏠 index.html             # Official Website Homepage
│   │   ├── 🛒 dapp.html              # DApp Main Interface
│   │   ├── ⚙️ admin.html             # Admin Backend
│   │   ├── 📊 homepage.html          # Data Display Page
│   │   ├── 📁 admin/                 # Admin Function Modules
│   │   ├── 📁 dapp/                  # DApp Function Modules
│   │   └── 📁 homepage/              # Homepage Function Modules
│   ├── 📁 specs/                     # Design Specifications
│   └── 📄 项目交付总结.md            # Design Delivery Summary
├── 📁 promit/                        # Prompts and Configuration
│   ├── 📄 README.md                  # AI Agent Usage Guide
│   ├── 📄 PM_Web3_Agent_Prompt.md   # Product Manager Agent
│   ├── 📄 UIUX_Designer_Web3_Agent_Prompt.md  # UI/UX Designer Agent
│   ├── 📄 Smart_Contract_Engineer_Agent_Prompt.md  # Smart Contract Engineer Agent
│   ├── 📄 Web_Client_Web3_Agent_Prompt.md  # Frontend Developer Agent
│   └── 📄 Backend_Engineer_Agent_Prompt.md  # Backend Developer Agent
├── 📁 pic/                           # Image Resources
├── 📄 package.json                   # Project Configuration
├── 📄 tailwind.config.js            # Tailwind Configuration
└── 📄 generate_favicon.py           # Icon Generation Tool
```

## 🎨 Design Prototypes

The project includes complete Web3 virtual goods trading platform interface prototypes with modern design style:

### 🎯 Design Features
- **Responsive Design**: Perfect adaptation for desktop, tablet and mobile
- **Dark Theme**: Visual style consistent with Web3 applications
- **Interactive Effects**: Smooth user interaction experience
- **Component-based**: Reusable UI component system
- **Multi-language**: Complete Chinese and English bilingual support

### 📱 Main Pages

| Page | Function Description | File Path |
|------|---------------------|-----------|
| 🏠 **Official Website Homepage** | Platform introduction, data display, quick access | `design/prototypes/index.html` |
| 🛒 **DApp Main Interface** | Product browsing, token exchange, staking management | `design/prototypes/dapp.html` |
| ⚙️ **Admin Backend** | User management, product review, system configuration | `design/prototypes/admin.html` |
| 📊 **Data Display** | Real-time data, statistical charts, platform overview | `design/prototypes/homepage.html` |
| 👤 **User Management** | KYC review, permission assignment, data analysis | `design/prototypes/admin/user-management.html` |

## 🚀 Quick Start

### 1. View Design Prototypes
```bash
# Open official website homepage
open design/prototypes/index.html

# Open DApp main interface
open design/prototypes/dapp.html

# Open admin backend
open design/prototypes/admin.html
```

### 2. Browse Project Documentation
- 📋 **Product Requirements**: [PRD.md](docs/PRD.md) - Detailed product requirements document
- 📖 **Technical White Paper**: [White_Paper.md](docs/White_Paper.md) - Technical architecture and innovations
- 💰 **Token Economics**: [Tokenomics_Detailed.md](docs/Tokenomics_Detailed.md) - Complete economic model
- 🗺️ **Project Roadmap**: [Roadmap.md](docs/Roadmap.md) - Development plans and milestones
- 👥 **User Stories**: [User_Story_Map.md](docs/User_Story_Map.md) - User scenarios and requirements
- 📊 **Metrics Framework**: [Metrics_Framework.md](docs/Metrics_Framework.md) - Evaluation system

## 💰 Token Economics Model

### SAP Token Basic Information
- **Token Standard**: ERC-20
- **Token Name**: Sapphire Mall Token
- **Token Symbol**: SAP
- **Total Supply**: 100,000,000 SAP
- **Token Type**: Utility Token

### Core Mechanisms
- **Liquidity Mining**: Users provide liquidity to receive mining rewards
- **Fee Sharing**: 70% of platform fees distributed to liquidity providers
- **DAO Governance**: SAP holders can participate in platform major decision voting
- **Deflation Mechanism**: Multiple burn mechanisms maintain token scarcity

## 🛠️ Technical Architecture

### Frontend Technology Stack
- **Framework**: React 18 + TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **UI Framework**: Tailwind CSS + Headless UI
- **Internationalization**: react-i18next
- **Web3 Integration**: Wagmi + Viem + TanStack Query
- **Wallet Connection**: Web3Modal v3 + ConnectKit

### Smart Contract Technology
- **Development Framework**: Hardhat + TypeScript
- **Contract Language**: Solidity 0.8.19+
- **Security Tools**: Slither + Mythril + OpenZeppelin
- **Upgrade Mechanism**: OpenZeppelin Upgrades
- **Multi-signature Management**: Gnosis Safe

### Backend Services
- **API Service**: Go + go-zero framework + gRPC
- **Database**: MySQL 8.0+ + Redis + MongoDB
- **Blockchain Interaction**: go-ethereum + custom RPC client
- **File Storage**: IPFS + Pinata + Alibaba Cloud OSS
- **Microservice Architecture**: go-zero microservices + etcd service discovery

## 🤖 AI Development Best Practices

This project actively adopts AI-assisted development and has established a complete AI development workflow and best practices system.

### 🎯 AI Agent Usage Guide

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

### 📝 Prompt Engineering Best Practices

#### English Guide
1. **Clear Role Definition**: Define clear roles and responsibilities for each Agent
2. **Structured Prompts**: Use clear formatting and hierarchical structure to organize prompts
3. **Context Management**: Provide sufficient background information and project context
4. **Iterative Optimization**: Continuously optimize prompt content based on actual usage results
5. **Version Control**: Version control prompts and record improvement history

#### 中文指南
1. **明确角色定位**: 为每个 Agent 定义清晰的角色和职责范围
2. **结构化提示**: 使用清晰的格式和层次结构组织提示词
3. **上下文管理**: 提供足够的背景信息和项目上下文
4. **迭代优化**: 根据实际使用效果不断优化提示词内容
5. **版本控制**: 对提示词进行版本管理，记录改进历史

### 🔧 Code Generation Best Practices

#### English Guide
1. **Code Review**: All AI-generated code must undergo manual review
2. **Test Coverage**: Write complete test cases for generated code
3. **Security Checks**: Pay special attention to security-related code and conduct specialized audits
4. **Performance Optimization**: Conduct performance analysis and optimization of generated code
5. **Documentation**: Write clear documentation and comments for generated code

#### 中文指南
1. **代码审查**: 所有 AI 生成的代码必须经过人工审查
2. **测试覆盖**: 为生成的代码编写完整的测试用例
3. **安全检查**: 特别关注安全相关的代码，进行专项审计
4. **性能优化**: 对生成的代码进行性能分析和优化
5. **文档完善**: 为生成的代码编写清晰的文档和注释

### 🧪 AI-Assisted Testing Strategy

#### English Guide
1. **Automated Test Generation**: Use AI to generate unit tests, integration tests, and end-to-end tests
2. **Boundary Condition Testing**: AI helps identify and test boundary conditions and edge cases
3. **Performance Testing**: Use AI to generate performance test scripts and load testing
4. **Security Testing**: AI-assisted security vulnerability scanning and penetration testing
5. **Regression Testing**: Automated regression testing to ensure new features don't affect existing functionality

#### 中文指南
1. **自动化测试生成**: 使用 AI 生成单元测试、集成测试和端到端测试
2. **边界条件测试**: AI 帮助识别和测试边界条件和异常情况
3. **性能测试**: 使用 AI 生成性能测试脚本和负载测试
4. **安全测试**: AI 辅助进行安全漏洞扫描和渗透测试
5. **回归测试**: 自动化回归测试，确保新功能不影响现有功能

## 📊 Project Metrics

### Target Users
- **Monthly Active Users (MAU)**: Target 10,000+ users (within 6 months)
- **Daily Active Users (DAU)**: Target 2,000+ users
- **User Retention Rate**: 7-day retention > 40%, 30-day retention > 20%

### Business Goals
- **Total Transaction Volume**: Monthly transaction target $1M
- **Token Exchange Volume**: Daily exchange volume > $50K
- **Total Staking Volume**: Liquidity pool TVL > $5M
- **Platform Revenue**: Monthly revenue > $20K

### North Star Metric
**Monthly Liquidity Staking Active Users** - Reflects platform core value and user trust

## 🤝 Contributing

Welcome to participate in project development! Please follow these steps:

1. **Fork** the project repository
2. **Create feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Development Standards
- Follow TypeScript coding standards
- Use Chinese descriptions for commit messages
- New features must include test cases
- Important changes require updating related documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact Us

- **Project Repository**: [https://github.com/your-username/sapmall](https://github.com/your-username/sapmall)
- **Issue Feedback**: [Issues](https://github.com/your-username/sapmall/issues)
- **Discussion**: [Discussions](https://github.com/your-username/sapmall/discussions)

---

<div align="center">

**🌐 Multi-language Support | [English](README_EN.md) | [中文](README.md)**

**Sapphire Mall** - Building the Future of Web3 Virtual Goods Trading Platform 🚀

</div> 