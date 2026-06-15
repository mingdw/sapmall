/** 链网络 status：0 启用（可切换/支付），1 禁用（仅展示） */
export const CHAIN_NETWORK_STATUS = {
  ENABLED: 0,
  DISABLED: 1,
} as const;

export const CHAIN_NETWORK_STATUS_OPTIONS = [
  { label: '启用（可切换/支付）', value: CHAIN_NETWORK_STATUS.ENABLED },
  { label: '禁用（仅展示）', value: CHAIN_NETWORK_STATUS.DISABLED },
];

export const getChainNetworkStatusLabel = (status: number) =>
  status === CHAIN_NETWORK_STATUS.ENABLED ? '启用' : '禁用';

/** 支付代币 status：0 启用，1 禁用 */
export const PAYMENT_TOKEN_STATUS = {
  ENABLED: 0,
  DISABLED: 1,
} as const;

export const PAYMENT_TOKEN_STATUS_OPTIONS = [
  { label: '启用', value: PAYMENT_TOKEN_STATUS.ENABLED },
  { label: '禁用', value: PAYMENT_TOKEN_STATUS.DISABLED },
];

/** 链上同步状态 */
export const SYNC_STATUS = {
  PENDING: 0,
  SYNCING: 1,
  SYNCED: 2,
  FAILED: 3,
} as const;

export const SYNC_STATUS_OPTIONS = [
  { label: '待同步', value: SYNC_STATUS.PENDING },
  { label: '同步中', value: SYNC_STATUS.SYNCING },
  { label: '已同步', value: SYNC_STATUS.SYNCED },
  { label: '失败', value: SYNC_STATUS.FAILED },
];

export const getSyncStatusLabel = (status: number) => {
  const found = SYNC_STATUS_OPTIONS.find((o) => o.value === status);
  return found?.label ?? `未知(${status})`;
};

export const getSyncStatusClass = (status: number) => {
  if (status === SYNC_STATUS.SYNCED) return 'syncOk';
  if (status === SYNC_STATUS.FAILED) return 'syncFail';
  if (status === SYNC_STATUS.SYNCING) return 'syncing';
  return 'syncPending';
};
