import type { TransactionReceipt } from 'viem';

/** 从 receipt 计算实际 Gas 花费（wei 字符串） */
export function gasFeeFromReceipt(receipt: TransactionReceipt): string {
  const price = receipt.effectiveGasPrice ?? 0n;
  return (receipt.gasUsed * price).toString();
}

/** 累加多笔 receipt 的 Gas（如 approve + burn） */
export function sumGasFees(receipts: TransactionReceipt[]): string {
  let total = 0n;
  for (const r of receipts) {
    const price = r.effectiveGasPrice ?? 0n;
    total += r.gasUsed * price;
  }
  return total.toString();
}
