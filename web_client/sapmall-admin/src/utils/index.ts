// 通用工具函数

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 格式化货币
 * @param amount 金额
 * @param currency 货币类型
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (amount: number, currency = 'CNY'): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * 规范化 Font Awesome 图标类名
 * 兼容 "fa-xxx"（短格式）和 "fas fa-xxx"（完整格式）两种写法
 * @param icon 图标类名字符串
 * @param fallback 缺省图标（短格式，如 'fa-cog'）
 * @returns 规范化后的完整 className，如 'fas fa-cog'
 */
export const normalizeFaIcon = (icon?: string, fallback = 'fa-cog'): string => {
  const raw = (icon || '').trim();
  if (!raw) return `fas ${fallback}`;
  if (/^(fas|far|fab|fa-solid|fa-regular|fa-brands)\s/.test(raw)) return raw;
  return `fas ${raw}`;
};
