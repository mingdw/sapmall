import type { TFunction } from 'i18next';

export function getCategoryLabel(t: TFunction, category: string): string {
  const map: Record<string, string> = {
    transaction: t('personal.notifications.filterTransaction'),
    security: t('personal.notifications.filterSecurity'),
    system: t('personal.notifications.filterSystem'),
  };
  return map[category] || category;
}

export function getFrequencyLabel(t: TFunction, freq: string): string {
  const map: Record<string, string> = {
    immediate: t('personal.notifications.freqImmediate'),
    daily: t('personal.notifications.freqDaily'),
    weekly: t('personal.notifications.freqWeekly'),
  };
  return map[freq] || freq;
}
