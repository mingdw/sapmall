import type { ChainEventInfo, ContractCategory, ContractType, ListenerType } from './types';

/** 事件处理状态 */
export const EVENT_PROCESS_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  FAILED: 3,
  OTHER: 4,
} as const;

export const EVENT_PROCESS_STATUS_OPTIONS = [
  { label: '待处理', value: EVENT_PROCESS_STATUS.PENDING },
  { label: '处理中', value: EVENT_PROCESS_STATUS.PROCESSING },
  { label: '处理成功', value: EVENT_PROCESS_STATUS.SUCCESS },
  { label: '处理失败', value: EVENT_PROCESS_STATUS.FAILED },
  { label: '其它', value: EVENT_PROCESS_STATUS.OTHER },
];

export const getEventProcessStatusLabel = (status: number) => {
  const found = EVENT_PROCESS_STATUS_OPTIONS.find((o) => o.value === status);
  return found?.label ?? `未知(${status})`;
};

export const getEventProcessStatusClass = (status: number) => {
  if (status === EVENT_PROCESS_STATUS.SUCCESS) return 'statusSuccess';
  if (status === EVENT_PROCESS_STATUS.FAILED) return 'statusFail';
  if (status === EVENT_PROCESS_STATUS.PROCESSING) return 'statusProcessing';
  return 'statusPending';
};

/** 业务类型选项 */
export const BUSINESS_TYPE_OPTIONS = [
  { label: '支付', value: 'payment' },
  { label: '兑换', value: 'swap' },
  { label: '商品', value: 'product' },
  { label: '订单', value: 'order' },
  { label: '治理', value: 'governance' },
  { label: '奖励', value: 'reward' },
];

/** 监听器类型标签 */
export const LISTENER_TYPE_LABELS: Record<ListenerType, string> = {
  swap: 'Swap 监听器',
  config: 'Config 监听器',
  payment: 'Payment 监听器',
};

/** 合约分类标签 */
export const CONTRACT_CATEGORY_LABELS: Record<ContractCategory, string> = {
  payment: '支付合约',
  swap: '兑换合约',
  token: '代币合约',
  platformConfig: '平台配置',
};

/** 合约类型标签 */
export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  proxy: '代理合约',
  implementation: '实现合约',
  standalone: '独立合约',
};

/** 合约分类颜色映射 */
export const CONTRACT_CATEGORY_COLORS: Record<ContractCategory, string> = {
  payment: '#60a5fa',
  swap: '#34d399',
  token: '#fbbf24',
  platformConfig: '#a78bfa',
};

/** 合约分类图标 */
export const CONTRACT_CATEGORY_ICONS: Record<ContractCategory, string> = {
  payment: 'fas fa-credit-card',
  swap: 'fas fa-exchange-alt',
  token: 'fas fa-coins',
  platformConfig: 'fas fa-cogs',
};

/** 生成 mock 事件数据 */
export const generateMockChainEvents = (): ChainEventInfo[] => {
  const events: ChainEventInfo[] = [];
  const eventTemplates = [
    { businessType: 'swap', eventName: 'TokensSwapped', contractName: 'SAPSwapRouter' },
    { businessType: 'swap', eventName: 'SwapExecuted', contractName: 'SAPSwapRouter' },
    { businessType: 'payment', eventName: 'PaymentSettled', contractName: 'PaymentRouter' },
    { businessType: 'payment', eventName: 'PaymentRefunded', contractName: 'PaymentRouter' },
    { businessType: 'payment', eventName: 'TokenAdded', contractName: 'PaymentRouter' },
    { businessType: 'swap', eventName: 'LiquidityAdded', contractName: 'SAPSwapRouter' },
    { businessType: 'governance', eventName: 'ProposalCreated', contractName: 'PlatformConfig' },
    { businessType: 'reward', eventName: 'RewardDistributed', contractName: 'SAPToken' },
  ];
  const processStatuses = [0, 0, 1, 2, 2, 2, 3, 2, 2, 2];
  const chains = [
    { chainId: 5042002, chainName: 'Arc Testnet' },
    { chainId: 59141, chainName: 'Linea Sepolia' },
  ];

  for (let i = 1; i <= 48; i++) {
    const template = eventTemplates[i % eventTemplates.length];
    const chain = chains[i % chains.length];
    const status = processStatuses[i % processStatuses.length];
    const now = new Date();
    const eventTime = new Date(now.getTime() - i * 3600_000);

    events.push({
      id: i,
      businessType: template.businessType,
      businessId: 1000 + i,
      businessCode: `${template.businessType.toUpperCase()}-${1000 + i}`,
      chainId: chain.chainId,
      chainName: chain.chainName,
      contractAddress: `0x${(0xa9af86f5ac67a270d52f0e0936623cb2e4a71a9b + i).toString(16).padStart(40, '0')}`,
      contractName: template.contractName,
      txHash: i % 5 === 0 ? undefined : `0x${Math.random().toString(16).slice(2).padEnd(64, '0').slice(0, 64)}`,
      blockNumber: 5000000 + i * 7,
      txIndex: i % 20,
      logIndex: i % 5,
      eventName: template.eventName,
      eventSig: `0x${Math.random().toString(16).slice(2).padEnd(64, '0').slice(0, 64)}`,
      eventPayload: {
        from: `0x${Math.random().toString(16).slice(2).padEnd(40, '0').slice(0, 40)}`,
        to: `0x${Math.random().toString(16).slice(2).padEnd(40, '0').slice(0, 40)}`,
        amount: (Math.random() * 1000).toFixed(2),
        tokenSymbol: ['USDC', 'EURC', 'cirBTC'][i % 3],
      },
      eventTime: eventTime.toISOString(),
      confirmations: 12 + (i % 50),
      processStatus: status,
      retryCount: status === 3 ? (i % 3) + 1 : 0,
      errorMsg: status === 3 ? '合约调用失败: execution reverted' : undefined,
      createdAt: eventTime.toISOString(),
    });
  }

  return events;
};
