# Sapphire Mall - Web3 Virtual Goods Trading Platform

<div align="center">

![Sapphire Mall Logo](design/prototypes/favicon.svg)

**🌐 Multi-language Support | [English](README_EN.md) | [中文](README.md)**

[![Platform](https://img.shields.io/badge/Platform-Web3-blue.svg)](https://web3js.org/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Arc-green.svg)](https://docs.arc.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Development-orange.svg)](https://github.com/your-username/sapmall)

</div>

---

## 📋 Project Overview

**Sapphire Mall** is a decentralized, community-driven virtual goods trading platform. Built on blockchain with **community governance** at its core and **DAO** mechanisms for decision-making, it uses the **ERC-20 token SAP** as the ecosystem token, combining community tasks and governance incentives into an auditable, participatory Web3 commerce and co-governance narrative.

**Stablecoin payments on [Arc](https://docs.arc.io/)**: Checkout is deeply integrated with **Arc Testnet**, supporting **USDC, EURC, cirBTC**, and other on-chain assets. List prices are quoted in **USDC**; settlement converts and transfers in the payer’s chosen token in real time. With Arc’s **near-instant confirmation and low gas**, users complete browse → approve → pay → confirm on a single chain, while **SAP** payments and fee-discount policies remain available.

**Cross-chain payments via Arc**: The Arc settlement layer unifies multi-source assets—users can pay with **USDC**, **EURC**, or bridged **cirBTC** without manually bridging on another chain before checkout. Backend **PaymentRouter** and **SettlementVault** route payment intents and funds; order state aligns with on-chain **`PaymentPaid`** events, reducing reconciliation cost for multi-asset payers.

The platform **[integrates Bags](https://bags.fm/) (Solana)** for **project launch, Launch Intent flows, and open API / SDK**, keeping **campaigns, marketing, and governance collaboration** **separate from the main payment path**: on-chain campaigns **ship fast and spread easily**, while the main site keeps a stable boundary around **Arc stablecoin orders and the SAP economy**. Campaign rules follow official disclosures.

**Entry convention**: In the DApp, **all campaigns, rewards, and Bags-related copy and outbound links** live under **`/rewards`** (top nav **Ecosystem**). **`/marketplace`** is **browse and checkout only**—not the primary entry for campaigns or rewards (see `docs/Bags_Activity_Marketing_PRD.md`).

**Wallets and campaigns (user cost)**: Users who **only browse, buy, and use the SAP main path** need **only an EVM wallet**. **Bags ecosystem activities** run on **Bags (Solana)**; users must **connect a Solana wallet on Bags and approve as prompted** (the top-bar EVM login cannot substitute). **Non-participants are unaffected** and **dual wallets are not required**. Optional **EVM ↔ Solana binding** (Phase 2) is for on-site benefits and profiles—see PRD **§3.2**.

**Bags developer resources**: [Docs](https://docs.bags.fm/) · [Developer portal](https://dev.bags.fm/login) · [TypeScript SDK (npm)](https://www.npmjs.com/package/@bagsfm/bags-sdk)

### 🌟 Core Features

- **⚡ Deep Arc integration**: DApp, PaymentRouter, chain config, and **Arc Testnet** natively aligned; **near-instant** on-chain confirmation, unified intents and settlement vault, auditable payment path with order state synced to events
- **💵 Multi-stablecoin checkout**: **USDC / EURC / cirBTC** and **SAP** on Arc; mall prices in **USDC**, on-chain settlement converted to the payment token
- **🌉 Arc cross-chain payments**: Euro and Bitcoin-mapped assets settle on **Arc**; one wallet and one chain for multi-currency checkout
- **🏛️ Decentralized governance**: DAO-based community decisions and parameter discussion (primary narrative tied to SAP)
- **👥 Community-driven**: Members participate in review, arbitration, and co-building with incentivized contributions
- **🎯 Virtual goods focus**: Digital content, software tools, online services, and similar virtual goods
- **💎 Contribution incentives**: Tasks, arbitration, governance, and other participation channels with rewards
- **💰 Value sharing**: Platform value aligned with contributors, treasury, and governance goals (see tokenomics and PRD)
- **🌍 Global & multilingual**: Chinese and English UI and docs for users and developers
- **🔐 Transparent on-chain governance**: Key decisions and allocation logic auditable on-chain; off-chain flows documented

## 🏗️ Project Structure

```
sapmall/
├── 📁 backend_service/               # Backend Service (Go + go-zero)
├── 📁 web_client/                    # Frontend Applications
│   ├── 📁 sapmall-admin/             # Admin Backend (React + TypeScript)
│   ├── 📁 sapmall-dapp/              # DApp Application (React + Web3)
│   └── 📁 sapmall-website/           # Official Website (React)
├── 📁 env/                           # Environment config & one-click scripts
│   └── 📁 dev/                       # Development Environment Docker Configuration
├── 📁 design/                        # Design Files
│   ├── 📁 prototypes/                # Prototype Design
│   └── 📁 specs/                     # Design Specifications
├── 📁 docs/                          # Project Documentation
│   ├── 📄 PRD.md                     # Product Requirements Document
│   ├── 📄 White_Paper.md             # Technical White Paper
│   ├── 📄 Tokenomics_Detailed.md     # Token Economics Model
│   ├── 📄 Roadmap.md                 # Project Roadmap
│   ├── 📄 User_Story_Map.md          # User Story Map
│   ├── 📄 Metrics_Framework.md       # Metrics Framework
│   └── 📄 Bags_Activity_Marketing_PRD.md  # Bags campaigns & marketing (sub-domain PRD)
├── 📁 promit/                        # AI Agent Prompts
├── 📁 pic/                           # Image Resources
├── 📄 docker-compose.yml             # Docker Compose File
├── 📄 generate_favicon.py           # Icon Generation Tool
└── 📄 README.md                      # Project Description
```

## 🎨 Design & Prototypes

The repo includes **runnable React frontends** (`web_client/`) and **high-fidelity HTML prototypes** (`design/prototypes/`): the former is the engineering mainline; the latter supports early interaction and visual alignment.

### 🎯 Design Features

- **Responsive layout**: Desktop and mobile; key transaction paths complete main actions within one screen  
- **Dark Web3 visual language**: High contrast, low glare, asset and status information first  
- **Componentized & maintainable**: React pages split by domain; prototypes iterate quickly for demos  
- **Internationalization (i18n)**: Chinese and English in the DApp, consistent with bilingual docs  
- **Readable on-chain state**: Wallet, network, balance, and action feedback to reduce mistakes  
- **Arc payment flow**: Checkout supports multi-stablecoin selection, gas hints, and trackable on-chain confirmation  
- **Community discussion & co-building**: `/dao` aggregates **Proposals / Discussions / Events**; category and tag filters, rich-text posts and replies, sidebar participation stats, and quick links to proposals/discussions you joined; connect wallet to start discussions and proposals  
- **On-chain governance loop**: Proposal detail with vote progress, rules, and results; create proposals, on-chain/simulated voting, delegation notes; Events tab for community agenda and ops—aligned with SAP-weight governance (see `docs/PRD.md`)  
- **Admin content funneling**: **sapmall-admin** handles product listing, categories and attributes, merchant/KYC review, orders, and platform dashboard; approved merchant products **flow to the DApp marketplace**; platform ops can seed categories and content for cold-start **catalog, topics, and governance supply**  

### 📱 Main Pages & Code Entry (current repo layout)

#### `sapmall-dapp` (User DApp · React + Web3)

| Route | Description | Source |
|------|-------------|--------|
| `/marketplace` | Tokenized mall: browse, filter, **Arc multi-stablecoin checkout** (**not** the campaigns/rewards hub) | `web_client/sapmall-dapp/src/pages/marketplace/` |
| `/exchange` | Swap and asset-related UI | `web_client/sapmall-dapp/src/pages/exchange/` |
| `/rewards` | **Ecosystem campaigns**: activities, rewards, **Bags** copy and links (**single hub**, top nav) | `web_client/sapmall-dapp/src/pages/rewards/` |
| `/dao` | Community participation / DAO UI | `web_client/sapmall-dapp/src/pages/dao/` |
| `/help` | Help center | `web_client/sapmall-dapp/src/pages/help/` |
| `/admin` | Embedded **admin** (iframe, same-origin or configured Admin URL) | `web_client/sapmall-dapp/src/components/AdminIframeEmbedded.tsx` |
| Global layout | Top nav, wallet connect, i18n | `web_client/sapmall-dapp/src/pages/header/`, `src/i18n/` |

Routing: `web_client/sapmall-dapp/src/layout/ContentLayout.tsx`. Bags integration: `docs/Bags_Activity_Marketing_PRD.md`.

#### `sapmall-admin` / `sapmall-website`

| App | Description | Path |
|------|-------------|------|
| **sapmall-admin** | Platform and merchant operations (React + TS) | `web_client/sapmall-admin/` |
| **sapmall-website** | Marketing site (React) | `web_client/sapmall-website/` |

#### `design/prototypes` (HTML prototypes · design & demo)

| Area | Description | Example paths |
|------|-------------|---------------|
| Website entry | Brand and landing | `design/prototypes/index.html`, `design/prototypes/homepage.html` |
| DApp prototype kit | Marketplace, exchange, DAO, help, etc. (**`/rewards`** for campaigns in production) | `design/prototypes/dapp.html`; subpages in `design/prototypes/dapp/` |
| Admin prototype kit | Dashboard, orders, users, merchants | `design/prototypes/admin.html`; subpages in `design/prototypes/admin/` |
| Brand assets | Logo / favicon vectors | `design/prototypes/favicon.svg` (evolved into DApp `src/assets/logo-mark.svg`) |

## 🚀 Quick Start

### 1. One-Click Development Environment Setup

#### Method 1: Complete Container Environment (Recommended for Production Testing)
```bash
# Navigate to environment configuration directory
cd env/dev

# One-click startup of all services (Supports Docker/Podman)
./start_local_dev_env.sh
```

#### Method 2: Local Development Environment (Windows Platform Development & Debugging)

> The following steps have been verified in **Windows 10/11 + PowerShell** environment, suitable for local debugging and frontend/backend development.

##### 1. Software Installation & Preparation
- [Node.js 18 LTS](https://nodejs.org/en/) (Check *Automatically install the necessary tools* during installation)
- [Go 1.19+](https://go.dev/dl/)
- [MySQL 8.0 Community Edition](https://dev.mysql.com/downloads/installer/)
- [Redis for Windows](https://github.com/tporadowski/redis) (or run Redis in WSL/Docker)
- [Nginx for Windows](https://nginx.org/en/download.html) (Extract to `C:\nginx`, optional)

##### 2. Configure and Start MySQL (Database)
1. Install **MySQL Server 8.0** via MySQL Installer, note down the root password.
2. Open PowerShell and execute:
   ```powershell
   # Navigate to MySQL installation directory (default path)
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"

   # Login to MySQL (enter root password)
   .\mysql.exe -u root -p

   -- Create database
   CREATE DATABASE IF NOT EXISTS sapphire_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;

   # Import database base structure
   .\mysql.exe -u root -p sapphire_mall < d:\web3space\sapmall\backend_service\docs\sapphire_mall.sql
   
   # Import menu data (requires base structure to be imported first)
   .\mysql.exe -u root -p sapphire_mall < d:\web3space\sapmall\backend_service\docs\sapphire_mall_menu_20250102.sql
   ```
3. If remote connection is needed, create `sapmall_user` user in *MySQL Workbench* and grant all privileges to `sapphire_mall` database.

##### 3. Start Redis (Cache)
1. Extract Redis to `C:\redis`, execute in PowerShell:
   ```powershell
   cd C:\redis
   .\redis-server.exe redis.windows.conf
   ```
2. Open a new PowerShell window to verify:
   ```powershell
   cd C:\redis
   .\redis-cli.exe ping  # Should return PONG if successful
   ```

##### 4. (Optional) Configure Nginx Unified Entry Point
1. Copy `env\dev\nginx\nginx.conf.template` from repository to `C:\nginx\conf\nginx.conf`, and replace `${HOST_IP}` with `127.0.0.1`.
2. Execute in PowerShell:
   ```powershell
   cd C:\nginx
   .\nginx.exe       # Start
   # To stop: .\nginx.exe -s stop
   # Reload config: .\nginx.exe -s reload
   ```
> After startup, access frontends and API via `http://localhost:7101/7102/7103`.

##### 5. Start Backend Service (Go + go-zero)
1. Execute in PowerShell:
   ```powershell
   cd d:\web3space\sapmall\backend_service\app
   go mod tidy
   ```
2. Modify `DB.DataSource` and `Redis` configuration in `etc\sapmall_dev.yaml` according to your local database information.
3. Start backend (recommended to use IDE port 8889):
   ```powershell
   go run sapmall_start.go -f etc/sapmall_dev.yaml --port 8889
   ```
4. Verify API availability by accessing `http://localhost:8889/swagger-ui/` in browser.

##### 6. Start Frontend Admin Backend
```powershell
cd d:\web3space\sapmall\web_client\sapmall-admin
npm install
$env:PORT=3004; npm start   # Admin backend default port 3004
```
Access URL: `http://localhost:3004` (or via Nginx at `http://localhost:7101`).

##### 7. Start Frontend DApp
```powershell
cd d:\web3space\sapmall\web_client\sapmall-dapp
npm install
$env:PORT=3005; npm start   # DApp default port 3005
```
Access URL: `http://localhost:3005` (or via Nginx at `http://localhost:7102`).

##### 8. Recommended Startup Order
1. MySQL → 2. Redis → 3. Backend Service → 4. Nginx (optional) → 5. Admin → 6. DApp.

##### 9. Quick Troubleshooting Tips
- **Port Check**: `Get-NetTCPConnection -LocalPort 8889` (PowerShell)
- **API Health Check**: `Invoke-WebRequest http://localhost:8889/api/common/health`
- **Redis Ping**: `redis-cli.exe ping`

After completing the above steps, you can fully run the backend, DApp, and admin backend locally on Windows. To stop, sequentially stop frontend processes, backend `go run` process, and Redis/MySQL/Nginx services.

#### Environment Requirements
- **Container Runtime**: Docker or Podman
- **Node.js**: Version 18+
- **Go**: Version 1.19+
- **Port Requirements**: Ensure the following ports are not occupied
  - 3004-3006 (Frontend services)
  - 8080, 7101-7103 (Nginx proxy)
  - 8888-8889 (Backend API)
  - 3306 (MySQL), 6379 (Redis), 2379 (etcd)

### 2. Access Services

#### Unified Entry Point (Recommended)
Access through Nginx proxy with intelligent routing and load balancing:

| Service | Access URL | Description |
|---------|------------|-------------|
| 🏠 **Official Website** | http://localhost:7103 | Project website and introduction |
| 🛒 **DApp Application** | http://localhost:7102 | Web3 virtual goods trading platform |
| ⚙️ **Admin Backend** | http://localhost:7101 | Platform management and data statistics |
| 🔧 **Backend API** | http://localhost:7101/api/ | RESTful API endpoints |
| 📚 **API Documentation** | http://localhost:7101/swagger-ui/ | Swagger API documentation |

#### Direct Access (Development Debugging)
Bypass Nginx proxy and access services directly:

| Service | Access URL | Description |
|---------|------------|-------------|
| 🏠 **Official Website** | http://localhost:3006 | React application |
| 🛒 **DApp Application** | http://localhost:3005 | React + Web3 application |
| ⚙️ **Admin Backend** | http://localhost:3004 | React + TypeScript application |
| 🔧 **Backend API** | http://localhost:8888/api/ | Go + go-zero API |
| 📚 **API Documentation** | http://localhost:8888/swagger-ui/ | Swagger UI |

### 3. Intelligent Routing Explanation

The project adopts intelligent routing design, supporting multiple access methods:

#### Routing Priority
1. **IDE Development Instance** (Priority) - Supports hot reload, suitable for development debugging
2. **Container Instance** (Backup) - Production environment configuration, suitable for testing

#### Routing Configuration
- **Backend Service**: IDE instance(8889) → Container instance(8888)
- **Admin Backend**: IDE instance(3004) → Container instance(3001)
- **DApp Application**: IDE instance(3005) → Container instance(3002)
- **Official Website**: IDE instance(3006) → Container instance(3003)

### 4. Management Commands

#### Start/Stop Services
```bash
# Start complete environment
./start_local_dev_env.sh

# Stop all services
./stop_local_dev_env.sh

# Restart services
./restart_local_dev_env.sh

# Check service status
./status.sh
```

#### View Logs
```bash
# View Nginx proxy logs
podman logs -f sapmall-nginx

# View backend service logs
podman logs -f sapmall-backend_service

# View MySQL logs
podman logs -f sapmall-mysql

# View frontend application logs
podman logs -f sapmall-admin
podman logs -f sapmall-dapp
podman logs -f sapmall-website
```

#### Container Debugging
```bash
# Enter backend service container
podman exec -it sapmall-backend_service bash

# Enter MySQL container
podman exec -it sapmall-mysql bash

# Enter frontend application container
podman exec -it sapmall-admin sh
```

### 5. View Design Prototypes
```bash
# Open official website homepage
open design/prototypes/index.html

# Open DApp main interface
open design/prototypes/dapp.html

# Open admin backend
open design/prototypes/admin.html
```

### 6. Browse Project Documentation
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
- **Payment contracts**: Arc Testnet **PaymentRouter** / **SettlementVault**, multi-token intents and **`PaymentPaid`** event protocol
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

### 📝 Prompt Engineering Best Practices

#### English Guide
1. **Clear Role Definition**: Define clear roles and responsibilities for each Agent
2. **Structured Prompts**: Use clear formatting and hierarchical structure to organize prompts
3. **Context Management**: Provide sufficient background information and project context
4. **Iterative Optimization**: Continuously optimize prompt content based on actual usage results
5. **Version Control**: Version control prompts and record improvement history


### 🔧 Code Generation Best Practices

#### English Guide
1. **Code Review**: All AI-generated code must undergo manual review
2. **Test Coverage**: Write complete test cases for generated code
3. **Security Checks**: Pay special attention to security-related code and conduct specialized audits
4. **Performance Optimization**: Conduct performance analysis and optimization of generated code
5. **Documentation**: Write clear documentation and comments for generated code

### 🧪 AI-Assisted Testing Strategy

#### English Guide
1. **Automated Test Generation**: Use AI to generate unit tests, integration tests, and end-to-end tests
2. **Boundary Condition Testing**: AI helps identify and test boundary conditions and edge cases
3. **Performance Testing**: Use AI to generate performance test scripts and load testing
4. **Security Testing**: AI-assisted security vulnerability scanning and penetration testing
5. **Regression Testing**: Automated regression testing to ensure new features don't affect existing functionality

## 📊 Project Metrics

### Target Users
- **Monthly Active Users (MAU)**: Target 10,000+ users (within 6 months)
- **Daily Active Users (DAU)**: Target 2,000+ users
- **User Retention Rate**: 7-day retention > 40%, 30-day retention > 20%

### Business Goals
- **Total Transaction Volume**: Monthly transaction target $1M
- **Token Exchange Volume**: Daily exchange volume > $50K
- **SAP Payment Share**: SAP-based orders ≥ 25% of total transactions
- **Platform Revenue**: Monthly revenue > $20K

### North Star Metric
**Monthly Active Contributors** - Measures the vibrancy of governance, arbitration, and community tasks

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

## 🖼️ Project Screenshots

The following are main page screenshots of the project for quick preview on GitHub:

<p align="center">
  <img src="pic/官网首页_zh_01.png" alt="Homepage (Chinese) 01" width="800" />
  <br /><em>Homepage (Chinese) 01</em>
</p>
<p align="center">
  <img src="pic/官网首页_zh_02.png" alt="Homepage (Chinese) 02" width="800" />
  <br /><em>Homepage (Chinese) 02</em>
</p>
<p align="center">
  <img src="pic/官网首页_zh_03.png" alt="Homepage (Chinese) 03" width="800" />
  <br /><em>Homepage (Chinese) 03</em>
</p>
<p align="center">
  <img src="pic/官网首页_en_01.png" alt="Homepage (English) 01" width="800" />
  <br /><em>Homepage (English) 01</em>
</p>
<p align="center">
  <img src="pic/官网首页_en_02.png" alt="Homepage (English) 02" width="800" />
  <br /><em>Homepage (English) 02</em>
</p>
<p align="center">
  <img src="pic/官网首页_en_03.png" alt="Homepage (English) 03" width="800" />
  <br /><em>Homepage (English) 03</em>
</p>
<p align="center">
  <img src="pic/dapp_zh_商城首页_01.png" alt="DApp Mall Homepage (Chinese)" width="800" />
  <br /><em>DApp Mall Homepage (Chinese)</em>
</p>
<p align="center">
  <img src="pic/dapp_商品明细.png" alt="DApp Product Detail" width="800" />
  <br /><em>DApp Product Detail</em>
</p>
<p align="center">
  <img src="pic/dapp_zh_兑换.png" alt="DApp Exchange (Chinese)" width="800" />
  <br /><em>DApp Exchange (Chinese)</em>
</p>
<p align="center">
  <img src="pic/dao首页.png" alt="DAO Homepage" width="800" />
  <br /><em>DAO Homepage</em>
</p>
<p align="center">
  <img src="pic/dao投票.png" alt="DAO Voting" width="800" />
  <br /><em>DAO Voting</em>
</p>
<p align="center">
  <img src="pic/帮助中心.png" alt="Help Center" width="800" />
  <br /><em>Help Center</em>
</p>
<p align="center">
  <img src="pic/admin_01_普通用户的后台管理_01.png" alt="Admin - Regular User Management 01" width="800" />
  <br /><em>Admin - Regular User Management 01</em>
</p>
<p align="center">
  <img src="pic/admin_01_普通用户的后台管理_02.png" alt="Admin - Regular User Management 02" width="800" />
  <br /><em>Admin - Regular User Management 02</em>
</p>
<p align="center">
  <img src="pic/admin_普通用户.png" alt="Admin - Regular User" width="800" />
  <br /><em>Admin - Regular User</em>
</p>
<p align="center">
  <img src="pic/admin_02_商家用户后台管理_01.png" alt="Admin - Merchant User Management 01" width="800" />
  <br /><em>Admin - Merchant User Management 01</em>
</p>
<p align="center">
  <img src="pic/admin_02_商家用户后台管理_02.png" alt="Admin - Merchant User Management 02" width="800" />
  <br /><em>Admin - Merchant User Management 02</em>
</p>
<p align="center">
  <img src="pic/admin_02_商家用户后台管理_02admin_02_商家用户后台管理_03.png" alt="Admin - Merchant User Management 02-03" width="800" />
  <br /><em>Admin - Merchant User Management 02-03</em>
</p>
<p align="center">
  <img src="pic/admin_02_商家用户后台管理_02admin_03_系统管理员用户后台管理_03.png" alt="Admin - Merchant & System Admin Management 03" width="800" />
  <br /><em>Admin - Merchant & System Admin Management 03</em>
</p> 