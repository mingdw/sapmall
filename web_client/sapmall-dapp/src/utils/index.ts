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
export const formatCurrency = (amount: number, currency = 'ETH'): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency === 'ETH' ? 'USD' : currency,
  }).format(amount);
};

/**
 * 格式化钱包地址
 * @param address 钱包地址
 * @param startLength 开头显示长度
 * @param endLength 结尾显示长度
 * @returns 格式化后的地址
 */
export const formatAddress = (address: string, startLength = 6, endLength = 4): string => {
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
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
 * 检查是否为有效的以太坊地址
 * @param address 地址字符串
 * @returns 是否为有效地址
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
