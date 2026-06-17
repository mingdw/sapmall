import type {
  SecurityScore,
  WalletSecuritySettings,
  AccessControlSettings,
  DeviceInfo,
  ActivityRecord,
  WhitelistAddress,
  SecurityData,
  ActivityFilterType,
} from './types';

export type {
  SecurityScore,
  WalletSecuritySettings,
  AccessControlSettings,
  DeviceInfo,
  ActivityRecord,
  WhitelistAddress,
  SecurityData,
  ActivityFilterType,
};

export const ACTIVITY_PAGE_SIZE = 6;

export const ACTIVITY_FILTER_OPTIONS: { key: ActivityFilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'login', label: '登录' },
  { key: 'transaction', label: '交易' },
  { key: 'settings', label: '设置' },
];

export const mockSecurityData: SecurityData = {
  score: {
    score: 65,
    level: 'medium',
    suggestion: '您的账户安全级别中等，建议完善更多安全设置',
  },
  walletSecurity: {
    transactionConfirmation: true,
    highValueAlert: true,
    contractInteractionWarning: true,
  },
  accessControl: {
    twoFactorEnabled: false,
    autoLock: true,
    addressWhitelist: false,
  },
  devices: [
    {
      id: 'device-1',
      name: 'Windows Chrome',
      icon: 'fa-desktop',
      lastActive: '2024-06-01 14:30:22',
      ip: '192.168.1.1',
      isCurrent: true,
      platform: 'Windows',
    },
    {
      id: 'device-2',
      name: 'iPhone Safari',
      icon: 'fa-mobile-alt',
      lastActive: '2024-05-28 09:15:43',
      ip: '172.16.0.5',
      isCurrent: false,
      platform: 'iOS',
    },
    {
      id: 'device-3',
      name: 'macOS Firefox',
      icon: 'fa-laptop',
      lastActive: '2024-05-25 18:22:10',
      ip: '10.0.0.8',
      isCurrent: false,
      platform: 'macOS',
    },
  ],
  activities: [
    {
      id: 'act-1',
      type: 'login',
      title: '登录成功',
      time: '2024-06-01 14:30:22',
      detail: 'Windows Chrome · IP: 192.168.1.1 · 北京',
      status: 'success',
      icon: 'fa-sign-in-alt',
    },
    {
      id: 'act-2',
      type: 'transaction',
      title: '购买商品 "数字艺术品#3721"',
      time: '2024-05-31 18:45:10',
      detail: '交易哈希: 0xabc...123 · 金额: 0.5 ETH',
      status: 'success',
      icon: 'fa-exchange-alt',
    },
    {
      id: 'act-3',
      type: 'settings',
      title: '更改安全设置',
      time: '2024-05-30 10:15:33',
      detail: '启用高额交易提醒 · IP: 192.168.1.1',
      status: 'success',
      icon: 'fa-cog',
    },
    {
      id: 'act-4',
      type: 'login',
      title: '登录尝试失败',
      time: '2024-05-29 22:10:45',
      detail: 'Android Chrome · IP: 103.24.56.78 · 上海',
      status: 'warning',
      icon: 'fa-exclamation-triangle',
      warning: true,
    },
    {
      id: 'act-5',
      type: 'transaction',
      title: '充值 1.5 ETH',
      time: '2024-05-28 09:45:12',
      detail: '交易哈希: 0xdef...456 · 来源: 外部钱包',
      status: 'success',
      icon: 'fa-wallet',
    },
    {
      id: 'act-6',
      type: 'settings',
      title: 'KYC认证申请提交',
      time: '2024-05-27 16:30:20',
      detail: '身份认证申请已提交，等待审核 · IP: 192.168.1.1',
      status: 'pending',
      icon: 'fa-user-shield',
    },
  ],
  whitelistAddresses: [
    { address: '0x1234567890abcdef1234567890abcdef12345678', addedAt: '2024-05-20 10:30' },
    { address: '0x9876543210fedcba9876543210fedcba98765432', addedAt: '2024-05-18 14:25' },
  ],
};
