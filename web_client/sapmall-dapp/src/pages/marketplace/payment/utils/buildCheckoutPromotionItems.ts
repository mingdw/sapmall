import type { CheckoutPromotionLine } from '../types/paymentTypes';

/** 平台促销：商品总额 × 0.5% */
export const PLATFORM_PROMO_RATE = 0.005;
/** 新品折扣：商品总额 × 0.3% */
export const NEW_PRODUCT_DISCOUNT_RATE = 0.003;
/** 优惠券：固定 1 USDC */
export const CHECKOUT_COUPON_AMOUNT = 1;

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/** 按商品总额计算结算层促销明细 */
export function buildCheckoutPromotionItems(goodsTotal: number): CheckoutPromotionLine[] {
  if (goodsTotal <= 0) return [];

  const platform = roundMoney(goodsTotal * PLATFORM_PROMO_RATE);
  const newProduct = roundMoney(goodsTotal * NEW_PRODUCT_DISCOUNT_RATE);
  const coupon = CHECKOUT_COUPON_AMOUNT;

  const lines: CheckoutPromotionLine[] = [];
  if (platform >= 0.01) {
    lines.push({ id: 'platform', labelKey: 'platform_promo', amount: platform });
  }
  if (newProduct >= 0.01) {
    lines.push({ id: 'new_product', labelKey: 'new_product_discount', amount: newProduct });
  }
  if (coupon >= 0.01) {
    lines.push({ id: 'coupon', labelKey: 'coupon', amount: coupon });
  }
  return lines;
}

export function sumPromotionAmount(lines: CheckoutPromotionLine[]): number {
  return roundMoney(lines.reduce((sum, line) => sum + line.amount, 0));
}

/** 促销行展示标签（比例 / 面额） */
export function getPromotionRateTag(labelKey: string): string | undefined {
  switch (labelKey) {
    case 'platform_promo':
      return '0.5%';
    case 'new_product_discount':
      return '0.3%';
    case 'coupon':
      return '1U';
    default:
      return undefined;
  }
}
