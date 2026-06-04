import { SAP_USD_PRICE } from './sapMarket';

/**
 * 展示用：1 单位代币 ≈ 多少 USDC（USDC≈USD）。
 * 参考公开市场，非链上即时报价；生产环境由预言机替换。
 *
 * 参考日期：2026-06-04
 * - USDT / DAI：CoinMarketCap 历史快照 2026-03-27（≈$1 锚定，微小偏离）
 * - BNB：~$619（freecurrencyrates / CMC 2026-03 区间）
 * - SOL：~$81（Statista 2026-06-02）
 * - BTC (cirBTC)：~$64,028（StatMuse / 主流行情 2026-06-04）
 * - EURC：~$1.16（欧元稳定币，随 EUR/USD，CoinMarketCap 2026）
 * - SAP：平台配置 SAP_USD_PRICE
 */
export const PAYMENT_TOKEN_RATES_AS_OF = '2026-06-04';

const STABLECOIN_TO_USDC: Record<string, number> = {
  USDC: 1,
  USDT: 0.9994,
  BUSD: 0.9985,
  DAI: 0.9996,
};

const ASSET_TO_USDC: Record<string, number> = {
  EURC: 1.16,
  BNB: 619.41,
  SOL: 81.13,
  cirBTC: 64027.99,
};

export function getReferenceTokenToUsdcRate(symbol: string): number {
  if (symbol === 'SAP') return SAP_USD_PRICE;
  if (symbol in STABLECOIN_TO_USDC) return STABLECOIN_TO_USDC[symbol];
  if (symbol in ASSET_TO_USDC) return ASSET_TO_USDC[symbol];
  return 1;
}
