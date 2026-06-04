import { formatUnits } from 'viem';

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

/** 仅数字部分（不含货币单位），用于拆分样式 */
export function formatAmountNumber(amount: number, currency: string): string {
  const n = Number(amount);
  if (Number.isNaN(n)) return currency === 'SAP' ? '0' : '0.00';
  if (currency === 'SAP') {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }
  return n.toFixed(2);
}
