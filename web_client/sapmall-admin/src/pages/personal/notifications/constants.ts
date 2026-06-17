import type {
  NotificationData,
  TypeFilterTab,
  NotificationTypeItem,
  FrequencyOption,
} from './types';

export type {
  NotificationData,
  TypeFilterTab,
  NotificationTypeItem,
  FrequencyOption,
};

export const TYPE_FILTER_TABS: { key: TypeFilterTab; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'transaction', label: '交易通知' },
  { key: 'security', label: '安全通知' },
  { key: 'system', label: '系统通知' },
];

export const FREQUENCY_OPTIONS: { value: FrequencyOption; label: string }[] = [
  { value: 'immediate', label: '实时' },
  { value: 'daily', label: '每日' },
  { value: 'weekly', label: '每周' },
];

export const IMPORTANCE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  high: { label: '重要', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)' },
  medium: { label: '中等', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' },
  low: { label: '低', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.3)' },
};

export const PREVIEW_CONTENT: Record<string, { title: string; body: string }> = {
  'transaction-confirmation': { title: '交易确认通知', body: '您有一笔交易需要确认，请及时处理。' },
  'transaction-complete': { title: '交易完成通知', body: '您的交易已成功完成，详情请查看订单记录。' },
  'login-alert': { title: '登录提醒', body: '您的账户在新设备上登录，如非本人操作请立即处理。' },
  'security-change': { title: '安全设置变更', body: '您的安全设置已发生变更，如非本人操作请立即联系客服。' },
  'system-maintenance': { title: '系统维护通知', body: '系统将于近期进行维护升级，届时部分功能可能暂时不可用。' },
  'new-feature': { title: '新功能公告', body: '平台发布了新功能，快来体验吧！' },
};

export const mockNotificationData: NotificationData = {
  channels: {
    email: { enabled: true, value: 'user@example.com' },
    mobile: { enabled: true, value: '+86 138****5678' },
    browser: { enabled: true, value: '' },
  },
  types: [
    {
      id: 'transaction-confirmation',
      title: '交易确认通知',
      description: '当您发起交易时，系统将发送确认通知',
      icon: 'fa-exchange-alt',
      iconColor: '#3b82f6',
      category: 'transaction',
      importance: 'high',
      enabled: true,
      channels: { email: true, mobile: true, browser: true },
    },
    {
      id: 'transaction-complete',
      title: '交易完成通知',
      description: '当您的交易完成时，系统将发送通知',
      icon: 'fa-check-circle',
      iconColor: '#22c55e',
      category: 'transaction',
      importance: 'high',
      enabled: true,
      channels: { email: true, mobile: true, browser: true },
    },
    {
      id: 'login-alert',
      title: '登录提醒',
      description: '当您的账户在新设备上登录时，系统将发送通知',
      icon: 'fa-sign-in-alt',
      iconColor: '#f59e0b',
      category: 'security',
      importance: 'high',
      enabled: true,
      channels: { email: true, mobile: true, browser: true },
    },
    {
      id: 'security-change',
      title: '安全设置变更',
      description: '当您的安全设置发生变更时，系统将发送通知',
      icon: 'fa-shield-alt',
      iconColor: '#ef4444',
      category: 'security',
      importance: 'high',
      enabled: true,
      channels: { email: true, mobile: true, browser: false },
    },
    {
      id: 'system-maintenance',
      title: '系统维护通知',
      description: '当系统计划维护时，系统将提前发送通知',
      icon: 'fa-server',
      iconColor: '#8b5cf6',
      category: 'system',
      importance: 'medium',
      enabled: true,
      channels: { email: true, mobile: false, browser: true },
      hasFrequency: true,
      frequency: 'daily',
    },
    {
      id: 'new-feature',
      title: '新功能公告',
      description: '当平台发布新功能时，系统将发送通知',
      icon: 'fa-bullhorn',
      iconColor: '#06b6d4',
      category: 'system',
      importance: 'low',
      enabled: false,
      channels: { email: true, mobile: false, browser: false },
      hasFrequency: true,
      frequency: 'weekly',
    },
  ],
};
