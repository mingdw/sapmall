/** 主价 USDC（与 SAP 数值 1:1，后续可接汇率配置） */
export function formatUsdc(price: number | string): string {
  const n = Number(price);
  if (Number.isNaN(n)) return '0 USDC';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K USDC`;
  return `${n.toFixed(2)} USDC`;
}

export function formatSap(price: number | string): string {
  const n = Number(price);
  if (Number.isNaN(n)) return '0 SAP';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K SAP`;
  return `${n} SAP`;
}

/** 主价 ≈ 副价（如 12.50 USDC ≈ 12 SAP） */
export function formatDualPrice(price: number | string): string {
  return `${formatUsdc(price)} ≈ ${formatSap(price)}`;
}

/** @deprecated 使用 formatUsdc */
export function formatUsdu(price: number | string): string {
  return formatUsdc(price);
}

/** @deprecated 使用 formatUsdc */
export function formatUsd(price: number | string): string {
  return formatUsdc(price);
}

export function calcDiscountPercent(price: number, realPrice: number): number | null {
  if (!realPrice || realPrice <= price) return null;
  return Math.round((price / realPrice) * 1000) / 10;
}
