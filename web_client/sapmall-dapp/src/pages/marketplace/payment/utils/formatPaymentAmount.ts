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
