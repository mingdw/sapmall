export type NotificationChannel = 'email' | 'mobile' | 'browser';

export type NotificationCategory = 'transaction' | 'security' | 'system';

export type ImportanceLevel = 'high' | 'medium' | 'low';

export type FrequencyOption = 'immediate' | 'daily' | 'weekly';

export interface ChannelSetting {
  enabled: boolean;
  value: string;
}

export interface ChannelSettings {
  email: ChannelSetting;
  mobile: ChannelSetting;
  browser: ChannelSetting;
}

export interface NotificationTypeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  category: NotificationCategory;
  importance: ImportanceLevel;
  enabled: boolean;
  channels: Record<NotificationChannel, boolean>;
  frequency?: FrequencyOption;
  hasFrequency?: boolean;
}

export interface NotificationData {
  channels: ChannelSettings;
  types: NotificationTypeItem[];
}

export type TypeFilterTab = 'all' | NotificationCategory;
