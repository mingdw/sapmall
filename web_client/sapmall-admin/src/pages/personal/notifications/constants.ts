import type { TFunction } from 'i18next';
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

const TYPE_FILTER_DEFS: { key: TypeFilterTab; labelKey: string }[] = [
  { key: 'all', labelKey: 'personal.notifications.filterAll' },
  { key: 'transaction', labelKey: 'personal.notifications.filterTransaction' },
  { key: 'security', labelKey: 'personal.notifications.filterSecurity' },
  { key: 'system', labelKey: 'personal.notifications.filterSystem' },
];

/** @deprecated 请使用 getTypeFilterTabs(t) */
export const TYPE_FILTER_TABS: { key: TypeFilterTab; label: string }[] = TYPE_FILTER_DEFS.map(
  (d) => ({ key: d.key, label: d.labelKey })
);

export function getTypeFilterTabs(t: TFunction) {
  return TYPE_FILTER_DEFS.map((d) => ({ key: d.key, label: t(d.labelKey) }));
}

const FREQUENCY_DEFS: { value: FrequencyOption; labelKey: string }[] = [
  { value: 'immediate', labelKey: 'personal.notifications.freqImmediate' },
  { value: 'daily', labelKey: 'personal.notifications.freqDaily' },
  { value: 'weekly', labelKey: 'personal.notifications.freqWeekly' },
];

/** @deprecated 请使用 getFrequencyOptions(t) */
export const FREQUENCY_OPTIONS: { value: FrequencyOption; label: string }[] = FREQUENCY_DEFS.map(
  (d) => ({ value: d.value, label: d.labelKey })
);

export function getFrequencyOptions(t: TFunction) {
  return FREQUENCY_DEFS.map((d) => ({ value: d.value, label: t(d.labelKey) }));
}

export const IMPORTANCE_CONFIG: Record<
  string,
  { labelKey: string; color: string; bg: string; border: string }
> = {
  high: {
    labelKey: 'personal.notifications.importanceHigh',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  medium: {
    labelKey: 'personal.notifications.importanceMedium',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  low: {
    labelKey: 'personal.notifications.importanceLow',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.3)',
  },
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
      title: 'Transaction Confirmation',
      description: 'Sends confirmation when you initiate a transaction',
      icon: 'fa-exchange-alt',
      iconColor: '#3b82f6',
      category: 'transaction',
      importance: 'high',
      enabled: true,
      channels: { email: true, mobile: true, browser: true },
    },
    {
      id: 'transaction-complete',
      title: 'Transaction Complete',
      description: 'Notifies when your transaction is completed',
      icon: 'fa-check-circle',
      iconColor: '#22c55e',
      category: 'transaction',
      importance: 'high',
      enabled: true,
      channels: { email: true, mobile: true, browser: true },
    },
    {
      id: 'login-alert',
      title: 'Login Alert',
      description: 'Notifies when your account logs in from a new device',
      icon: 'fa-sign-in-alt',
      iconColor: '#f59e0b',
      category: 'security',
      importance: 'high',
      enabled: true,
      channels: { email: true, mobile: true, browser: true },
    },
    {
      id: 'security-change',
      title: 'Security Change',
      description: 'Notifies when your security settings change',
      icon: 'fa-shield-alt',
      iconColor: '#ef4444',
      category: 'security',
      importance: 'high',
      enabled: true,
      channels: { email: true, mobile: true, browser: false },
    },
    {
      id: 'system-maintenance',
      title: 'System Maintenance',
      description: 'Notifies in advance of planned system maintenance',
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
      title: 'New Feature Announcement',
      description: 'Notifies when new features are released',
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
