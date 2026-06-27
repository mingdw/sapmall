import { formatUnits } from 'viem';

function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) return value;
  return value.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

export function formatUsdcFromRaw(amount: string, decimals: number): string {
  try {
    const formatted = formatUnits(BigInt(amount), decimals);
    const n = Number.parseFloat(formatted);
    if (Number.isNaN(n)) return '0.00';
    return n.toFixed(2);
  } catch {
    return '0.00';
  }
}

export function formatUsdcDisplay(amount: number): string {
  return `${amount.toFixed(2)} USDC`;
}

/** 支付币种金额展示（实付等） */
export function formatTokenDisplay(amount: number, symbol: string): string {
  return `${formatAmountNumber(amount, symbol)} ${symbol}`;
}

/** 链上余额展示（cirBTC 等高价资产需保留更多小数位） */
export function formatTokenBalanceDisplay(amount: number, symbol: string): string {
  if (Number.isNaN(amount) || amount === 0) {
    if (symbol === 'SAP' || symbol === 'cirBTC') return '0';
    return '0.0000';
  }
  if (symbol === 'SAP') {
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toFixed(4);
  }
  if (symbol === 'cirBTC') {
    if (amount >= 1) return amount.toFixed(4);
    return trimTrailingZeros(amount.toFixed(8));
  }
  if (amount >= 1000) return amount.toFixed(2);
  return amount.toFixed(4);
}

/** 仅数字部分（不含货币单位），用于拆分样式 */
export function formatAmountNumber(amount: number, currency: string): string {
  const n = Number(amount);
  if (Number.isNaN(n)) {
    if (currency === 'SAP' || currency === 'cirBTC') return '0';
    return '0.00';
  }
  if (currency === 'cirBTC') {
    if (n >= 1) return n.toFixed(4);
    return trimTrailingZeros(n.toFixed(8));
  }
  if (currency === 'SAP') {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }
  return n.toFixed(2);
}
