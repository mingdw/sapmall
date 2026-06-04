/** 与兑换页 SwapCard 一致的 USDC→SAP 汇率（展示用，后续可接 API） */
export const USDC_TO_SAP_RATE = 2.84;

const rawUsd = process.env.REACT_APP_SAP_USD_PRICE;
export const SAP_USD_PRICE = rawUsd ? Number.parseFloat(rawUsd) : 0.351;

export function formatSapUsdPrice(): string {
  return `$${SAP_USD_PRICE.toFixed(4)}`;
}

export function formatUsdcToSapRate(): string {
  return `1 USDC ≈ ${USDC_TO_SAP_RATE} SAP`;
}

/** 商城标价 1 USDC 数值 ≈ 1 SAP 支付数量（平台内 1:1 结算） */
export function calcSapPayAmount(usdcPayable: number): number {
  return usdcPayable;
}
