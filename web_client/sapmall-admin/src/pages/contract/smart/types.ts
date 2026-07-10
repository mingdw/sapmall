/** 合约类型 */
export type ContractType = 'proxy' | 'implementation' | 'standalone';

/** 合约分类 */
export type ContractCategory = 'payment' | 'swap' | 'token' | 'platformConfig';

/** 合约信息 */
export interface ContractInfo {
  id: string;
  name: string;
  category: ContractCategory;
  type: ContractType;
  address: string;
  implementationAddress?: string;
  chainId: number;
  chainName: string;
  chainCode: string;
  explorerUrl?: string;
  version?: string;
  deployedAt?: string;
  status: 'deployed' | 'notConfigured';
  description?: string;
}

/** 链上事件 */
export interface ChainEventInfo {
  id: number;
  businessType: string;
  businessId: number;
  businessCode?: string;
  chainId: number;
  chainName: string;
  contractAddress: string;
  contractName?: string;
  txHash?: string;
  blockNumber: number;
  txIndex: number;
  logIndex: number;
  eventName: string;
  eventSig: string;
  eventPayload?: Record<string, unknown>;
  rawLog?: Record<string, unknown>;
  eventTime?: string;
  confirmations: number;
  processStatus: number;
  retryCount: number;
  errorMsg?: string;
  createdAt: string;
}

/** 监听器类型 */
export type ListenerType = 'swap' | 'config' | 'payment';

/** 监听器状态 */
export interface ListenerStatusInfo {
  chainId: number;
  chainName: string;
  chainCode: string;
  listenerType: ListenerType;
  enabled: boolean;
  startBlock: number;
  lastBlock: number;
  currentBlock?: number;
  pollInterval: number;
  lag: number;
  status: 'running' | 'stopped' | 'error';
  lastError?: string;
  lastScanAt?: string;
}

/** 部署记录 */
export interface DeploymentRecord {
  id: string;
  network: string;
  chainId: number;
  deployedAt: string;
  deployer: string;
  admin: string;
  contracts: {
    name: string;
    type: ContractType;
    address: string;
    category: ContractCategory;
  }[];
  paymentToken?: string;
  platformConfigAdmin?: string;
  raw?: Record<string, unknown>;
}

// 常量和标签定义见 constants.ts
