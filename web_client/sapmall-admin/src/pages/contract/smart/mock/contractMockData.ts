import type { DeploymentRecord } from '../types';

/** Mock 部署记录数据 */
export const mockDeploymentRecords: DeploymentRecord[] = [
  {
    id: 'dep-001',
    network: 'arcTestnet',
    chainId: 5042002,
    deployedAt: '2026-07-03T02:09:38.417Z',
    deployer: '0x276c145eb3c7f1017e00d4bee7fbaca88531ab40',
    admin: '0x276c145EB3C7F1017E00D4Bee7FBAca88531Ab40',
    contracts: [
      { name: 'SettlementVault', type: 'standalone', address: '0xf5137b68cdc765261ac6a39819c0c1b55bc6a111', category: 'payment' },
      { name: 'PaymentRouter', type: 'proxy', address: '0xa9af86f5ac67a270d52f0e0936623cb2e4a71a9b', category: 'payment' },
      { name: 'PaymentRouterImpl', type: 'implementation', address: '0x8cdfc9662263362ddb7d8341b5dc32ea92b5c298', category: 'payment' },
    ],
    paymentToken: '0x3600000000000000000000000000000000000000',
    platformConfigAdmin: '0x276c145EB3C7F1017E00D4Bee7FBAca88531Ab40',
    raw: {
      network: 'arcTestnet',
      chainId: 5042002,
      deployedAt: '2026-07-03T02:09:38.417Z',
      deployer: '0x276c145eb3c7f1017e00d4bee7fbaca88531ab40',
      admin: '0x276c145EB3C7F1017E00D4Bee7FBAca88531Ab40',
      settlementVault: '0xf5137b68cdc765261ac6a39819c0c1b55bc6a111',
      paymentRouter: '0xa9af86f5ac67a270d52f0e0936623cb2e4a71a9b',
      paymentRouterImplementation: '0x8cdfc9662263362ddb7d8341b5dc32ea92b5c298',
      platformConfig: '0x0000000000000000000000000000000000000000',
      platformConfigImplementation: '0x0000000000000000000000000000000000000000',
      paymentConfig: {
        paymentToken: '0x3600000000000000000000000000000000000000',
        chainId: 5042002,
      },
      platformConfigAdmin: '0x276c145EB3C7F1017E00D4Bee7FBAca88531Ab40',
    },
  },
  {
    id: 'dep-002',
    network: 'lineaSepolia',
    chainId: 59141,
    deployedAt: '2026-06-15T14:22:00.000Z',
    deployer: '0x276c145eb3c7f1017e00d4bee7fbaca88531ab40',
    admin: '0x276c145EB3C7F1017E00D4Bee7FBAca88531Ab40',
    contracts: [
      { name: 'SettlementVault', type: 'standalone', address: '0xe4a1B523c6B3a1c8Dc01bE3e9F5c0a3f2D7b8e91', category: 'payment' },
      { name: 'PaymentRouter', type: 'proxy', address: '0xd2c4e7a3b5f8e1a09c3d7b6e5f4a3c2d1b8e7f90', category: 'payment' },
      { name: 'PaymentRouterImpl', type: 'implementation', address: '0xb1a3f6c2d4e5b7a8c9f0e3d2c1b0a9f8e7d6c5b4', category: 'payment' },
      { name: 'PlatformConfig', type: 'proxy', address: '0xc3f5a7b9d2e1f4c6b8a0d3e5f7c9b1a3d6e8f0c2', category: 'platformConfig' },
      { name: 'PlatformConfigImpl', type: 'implementation', address: '0xa2e4b6c8d0f2a4b6c8e0d2f4a6b8c0e2d4f6a8b0', category: 'platformConfig' },
      { name: 'SAPSwapRouter', type: 'proxy', address: '0xf5a7c9b1d3e5f7a9c1b3d5e7f9a1c3b5d7e9f1a3', category: 'swap' },
      { name: 'SAPSwapRouterImpl', type: 'implementation', address: '0xe4b6c8d0f2a4b6c8e0d2f4a6b8c0e2d4f6a8b0c2', category: 'swap' },
      { name: 'SAPToken', type: 'proxy', address: '0xd3a5b7c9e1f3a5b7c9e1f3a5b7c9e1f3a5b7c9e1', category: 'token' },
      { name: 'SAPTokenImpl', type: 'implementation', address: '0xc2b4a6d8e0f2a4b6c8e0d2f4a6b8c0e2d4f6a8b0', category: 'token' },
    ],
    paymentToken: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C823b',
    platformConfigAdmin: '0x276c145EB3C7F1017E00D4Bee7FBAca88531Ab40',
    raw: {
      network: 'lineaSepolia',
      chainId: 59141,
      deployedAt: '2026-06-15T14:22:00.000Z',
      deployer: '0x276c145eb3c7f1017e00d4bee7fbaca88531ab40',
      admin: '0x276c145EB3C7F1017E00D4Bee7FBAca88531Ab40',
      settlementVault: '0xe4a1B523c6B3a1c8Dc01bE3e9F5c0a3f2D7b8e91',
      paymentRouter: '0xd2c4e7a3b5f8e1a09c3d7b6e5f4a3c2d1b8e7f90',
      paymentRouterImplementation: '0xb1a3f6c2d4e5b7a8c9f0e3d2c1b0a9f8e7d6c5b4',
      platformConfig: '0xc3f5a7b9d2e1f4c6b8a0d3e5f7c9b1a3d6e8f0c2',
      platformConfigImplementation: '0xa2e4b6c8d0f2a4b6c8e0d2f4a6b8c0e2d4f6a8b0',
    },
  },
];

/** 已知合约定义（用于合约总览） */
export const CONTRACT_DEFINITIONS = [
  { name: 'PaymentRouter', category: 'payment' as const, type: 'proxy' as const, description: '支付路由代理合约，处理订单支付与结算' },
  { name: 'PaymentRouterImpl', category: 'payment' as const, type: 'implementation' as const, description: 'PaymentRouter 实现合约' },
  { name: 'SettlementVault', category: 'payment' as const, type: 'standalone' as const, description: '结算金库，托管支付资金' },
  { name: 'SAPSwapRouter', category: 'swap' as const, type: 'proxy' as const, description: 'SAP 兑换路由代理合约' },
  { name: 'SAPSwapRouterImpl', category: 'swap' as const, type: 'implementation' as const, description: 'SAPSwapRouter 实现合约' },
  { name: 'SAPToken', category: 'token' as const, type: 'proxy' as const, description: 'SAP 代币代理合约' },
  { name: 'SAPTokenImpl', category: 'token' as const, type: 'implementation' as const, description: 'SAPToken 实现合约' },
  { name: 'PlatformConfig', category: 'platformConfig' as const, type: 'proxy' as const, description: '平台配置代理合约' },
  { name: 'PlatformConfigImpl', category: 'platformConfig' as const, type: 'implementation' as const, description: 'PlatformConfig 实现合约' },
];
