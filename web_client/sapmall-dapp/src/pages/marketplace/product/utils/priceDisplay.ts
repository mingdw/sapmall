/** 主价 USD（与 SAP 数值 1:1，后续可接汇率配置） */
export function formatUsd(price: number): string {
  const n = Number(price);
  if (Number.isNaN(n)) return '$0.00';
  return `$${n.toFixed(2)}`;
}

export function formatSap(price: number): string {
  const n = Number(price);
  if (Number.isNaN(n)) return '0 SAP';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K SAP`;
  return `${n} SAP`;
}

export function calcDiscountPercent(price: number, realPrice: number): number | null {
  if (!realPrice || realPrice <= price) return null;
  return Math.round((price / realPrice) * 1000) / 10;
}
