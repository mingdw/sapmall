export interface SecurityScore {
  score: number;
  level: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface WalletSecuritySettings {
  transactionConfirmation: boolean;
  highValueAlert: boolean;
  contractInteractionWarning: boolean;
}

export interface AccessControlSettings {
  twoFactorEnabled: boolean;
  autoLock: boolean;
  addressWhitelist: boolean;
}

export interface DeviceInfo {
  id: string;
  name: string;
  icon: string;
  lastActive: string;
  ip: string;
  isCurrent: boolean;
  platform: string;
}

export interface ActivityRecord {
  id: string;
  type: 'login' | 'transaction' | 'settings';
  title: string;
  time: string;
  detail: string;
  status: 'success' | 'warning' | 'pending';
  icon: string;
  warning?: boolean;
}

export interface WhitelistAddress {
  address: string;
  addedAt: string;
}

export interface SecurityData {
  score: SecurityScore;
  walletSecurity: WalletSecuritySettings;
  accessControl: AccessControlSettings;
  devices: DeviceInfo[];
  activities: ActivityRecord[];
  whitelistAddresses: WhitelistAddress[];
}

export type ActivityFilterType = 'all' | 'login' | 'transaction' | 'settings';
