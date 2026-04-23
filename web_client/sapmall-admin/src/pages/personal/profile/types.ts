import type { UploadFile } from 'antd/es/upload/interface';

export type ProfileGender = 'unknown' | 'male' | 'female';

export type KycStatus = 'not_verified' | 'pending' | 'verified';
export type MerchantDepositStatus = 'not_applied' | 'pending_payment' | 'confirming' | 'paid';

export interface ProfileSettings {
  profilePublic: boolean;
  marketingEmails: boolean;
  transactionNotifications: boolean;
}

/** 个人中心展示用的操作记录（与 sys_user_operation_log 展示字段对齐，详情以后端为准） */
export interface ProfileOperationLogItem {
  id: string;
  createdAt: string;
  bizModule: string;
  actionType: string;
  summary: string;
  resultStatus: 'success' | 'failed' | 'partial';
}

export interface ProfileData {
  userId: string;
  username: string;
  nickname: string;
  walletAddress: string;
  userRole: string;
  statusText: string;
  brief: string;
  gender: ProfileGender;
  birthday: string;
  registerTime: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: KycStatus;
  merchantDepositStatus: MerchantDepositStatus;
  settings: ProfileSettings;
  operationLogs: ProfileOperationLogItem[];
}

export interface MerchantDepositIntent {
  intentId: string;
  amount: string;
  token: string;
  chainId: number;
  contractAddress: string;
  expireAt: string;
  txHash?: string;
}

export interface KycBasicForm {
  realName: string;
  nationality: 'cn_mainland' | 'other';
  documentNumber: string;
}

export interface KycSubmitPayload {
  basicInfo: KycBasicForm;
  frontFile: UploadFile;
  backFile?: UploadFile;
}
