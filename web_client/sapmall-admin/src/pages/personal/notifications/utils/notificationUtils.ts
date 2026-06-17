export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    transaction: '交易',
    security: '安全',
    system: '系统',
  };
  return map[category] || category;
}

export function getFrequencyLabel(freq: string): string {
  const map: Record<string, string> = {
    immediate: '实时',
    daily: '每日',
    weekly: '每周',
  };
  return map[freq] || freq;
}
