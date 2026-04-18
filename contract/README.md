# Contract Module

本目录用于管理 Sapphire Mall 项目的智能合约相关内容。

## 目录说明

- `contracts/`: Solidity 合约源码
- `scripts/`: 部署与运维脚本
- `test/`: 合约测试
- `deployments/`: 不同网络的部署产物（地址、版本等）
- `docs/`: 合约设计与审计文档

## 推荐下一步（Hardhat）

在本目录执行以下命令初始化 Hardhat：

```bash
npm init -y
npm install -D hardhat @nomicfoundation/hardhat-toolbox typescript ts-node dotenv
npm install @openzeppelin/contracts @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades
npx hardhat
```

建议选择 TypeScript 模板，并按需补充 `hardhat.config.ts` 与网络配置。
