import React, { useMemo, useState } from 'react';
import { Input, Tooltip } from 'antd';
import { ChevronDown, MessageSquare, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OrderPreviewItem, OrderPreviewResult } from '../../../../services/api/orderApi';
import {
  buildSampleProductImageUrl,
  resolveProductImageUrl,
} from '../../../../utils/productImageUrls';
import PaymentMoney from './PaymentMoney';
import PaymentGlassCard from './PaymentGlassCard';
import PaymentCardHeader from './PaymentCardHeader';
import CheckoutQuantityStepper from './CheckoutQuantityStepper';
import {
  buildCheckoutPromotionItems,
  getPromotionRateTag,
  sumPromotionAmount,
} from '../utils/buildCheckoutPromotionItems';
import styles from '../PaymentPage.module.scss';

export interface CheckoutOrderSummaryProps {
  items: OrderPreviewItem[];
  preview: OrderPreviewResult;
  buyerMessage: string;
  onBuyerMessageChange: (value: string) => void;
  quantity: number;
  onQuantityChange: (value: number) => void;
  quantityDisabled?: boolean;
  /** 预览刷新中：按数量本地推算价格 */
  previewRefreshing?: boolean;
}

function resolvePromotionLabel(
  t: (key: string, opts?: { defaultValue?: string }) => string,
  labelKey: string,
): string {
  const key = `payment.summary.promotions.${labelKey}`;
  const translated = t(key);
  return translated === key ? labelKey : translated;
}

function resolveLineTotal(item: OrderPreviewItem, singleLine: boolean, quantity: number): number {
  if (!singleLine) return item.subtotal;
  if (item.quantity === quantity) return item.subtotal;
  const effectiveUnit = item.subtotal / Math.max(item.quantity, 1);
  return effectiveUnit * quantity;
}

function resolveLineListTotal(
  preview: OrderPreviewResult,
  singleLine: boolean,
  quantity: number,
): number | null {
  const listTotal = preview.listAmount ?? preview.originalAmount;
  if (listTotal == null || listTotal <= 0) return null;
  if (!singleLine) return listTotal;
  const item = preview.items[0];
  if (item && item.quantity !== quantity) {
    return (listTotal / Math.max(item.quantity, 1)) * quantity;
  }
  return listTotal;
}

function OrderLineThumb({
  imageUrl,
  alt,
  skuId,
  noImageLabel,
}: {
  imageUrl: string;
  alt: string;
  skuId: number;
  noImageLabel: string;
}) {
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  const resolvedSrc = useMemo(
    () => resolveProductImageUrl(imageUrl || undefined, skuId),
    [imageUrl, skuId],
  );
  const src = fallbackSrc ?? resolvedSrc;

  if (!src) {
    return <span className={styles.orderLineNoImg}>{noImageLabel}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (fallbackSrc === null) {
          setFallbackSrc(buildSampleProductImageUrl(skuId));
        }
      }}
    />
  );
}

const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  items,
  preview,
  buyerMessage,
  onBuyerMessageChange,
  quantity,
  onQuantityChange,
  quantityDisabled = false,
  previewRefreshing = false,
}) => {
  const { t } = useTranslation();
  const singleLine = items.length === 1;
  const [promoExpanded, setPromoExpanded] = useState(true);

  const displayGoodsTotal = useMemo(() => {
    const item = items[0];
    const base =
      preview.saleSubtotal ??
      items.reduce((sum, row) => sum + row.subtotal, 0);
    if (!singleLine || !item) return base;
    if (!previewRefreshing && item.quantity === quantity) {
      return preview.saleSubtotal ?? item.subtotal;
    }
    const unit = (preview.saleSubtotal ?? item.subtotal) / Math.max(item.quantity, 1);
    return unit * quantity;
  }, [items, preview.saleSubtotal, previewRefreshing, quantity, singleLine]);

  const hasCheckoutPromos =
    (preview.listAmount ?? preview.originalAmount) != null && displayGoodsTotal > 0;

  const promotionLines = useMemo(
    () => (hasCheckoutPromos ? buildCheckoutPromotionItems(displayGoodsTotal) : []),
    [displayGoodsTotal, hasCheckoutPromos],
  );

  const displayDiscount = useMemo(
    () => (promotionLines.length ? sumPromotionAmount(promotionLines) : 0),
    [promotionLines],
  );

  const displayPayable = useMemo(() => {
    if (!previewRefreshing && singleLine && items[0]?.quantity === quantity) {
      return preview.totalAmount;
    }
    return Math.max(0, displayGoodsTotal - displayDiscount);
  }, [
    displayDiscount,
    displayGoodsTotal,
    items,
    preview.totalAmount,
    previewRefreshing,
    quantity,
    singleLine,
  ]);

  const promoItems = useMemo(
    () =>
      promotionLines.map((line) => ({
        key: line.id,
        label: resolvePromotionLabel(t, line.labelKey),
        rateTag: getPromotionRateTag(line.labelKey),
        amount: line.amount,
      })),
    [promotionLines, t],
  );

  const lineListTotal = useMemo(
    () => resolveLineListTotal(preview, singleLine, quantity),
    [preview, singleLine, quantity],
  );

  return (
    <PaymentGlassCard className="p-5 md:p-6 mt-6">
      <PaymentCardHeader
        icon={<Package strokeWidth={1.75} aria-hidden />}
        iconVariant="product"
        title={t('payment.summary.title')}
      />

      <div className={styles.orderLines}>
        {items.map((item) => {
          const lineTotal = resolveLineTotal(item, singleLine, quantity);
          const showLineStrike = lineListTotal != null && lineListTotal > lineTotal + 0.0001;

          return (
            <article key={item.skuId} className={styles.orderLine}>
              <div className={styles.orderLineThumb}>
                <OrderLineThumb
                  imageUrl={item.imageUrl}
                  alt={item.productName}
                  skuId={item.skuId}
                  noImageLabel={t('payment.summary.noImage')}
                />
              </div>

              <div className={styles.orderLineBody}>
                <div className={styles.orderLineMainRow}>
                  <div className={styles.orderLineInfoCol}>
                    <h3 className={styles.orderLineTitle}>{item.productName}</h3>
                    {item.productBrief ? (
                      <Tooltip title={item.productBrief} placement="topLeft">
                        <p className={styles.orderLineBrief}>{item.productBrief}</p>
                      </Tooltip>
                    ) : null}
                    {item.specText ? (
                      <p className={styles.orderLineSpec}>{item.specText}</p>
                    ) : null}
                  </div>

                  <div className={styles.orderLineAsideCol}>
                    <div className={styles.orderLinePriceCol}>
                      <PaymentMoney
                        amount={lineTotal}
                        currency="USDC"
                        size="md"
                        className={styles.orderLinePriceMain}
                      />
                      {showLineStrike ? (
                        <PaymentMoney
                          amount={lineListTotal}
                          currency="USDC"
                          size="sm"
                          className={styles.orderLinePriceWas}
                        />
                      ) : null}
                    </div>
                    <div className={styles.orderLineQtyWrap}>
                      {singleLine ? (
                        <CheckoutQuantityStepper
                          value={quantity}
                          onChange={onQuantityChange}
                          disabled={quantityDisabled}
                        />
                      ) : (
                        <span className={styles.orderLineQtyReadonly}>
                          {'\u00d7'}
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={`${styles.orderNoteRow} ${styles.contactField}`}>
        <label htmlFor="checkout-buyer-message" className={styles.fieldLabel}>
          <MessageSquare size={14} className="inline mr-1.5 align-[-2px]" aria-hidden />
          {t('payment.summary.buyerMessage')}
        </label>
        <Input
          id="checkout-buyer-message"
          value={buyerMessage}
          maxLength={200}
          placeholder={t('payment.summary.buyerMessagePlaceholder')}
          onChange={(e) => onBuyerMessageChange(e.target.value)}
          disabled={quantityDisabled}
        />
      </div>

      <div className={styles.summaryPriceBlock}>
        <div className={styles.summarySheet}>
          <div className={styles.summaryTotalsRow}>
            <div className={styles.summaryTotalsGoodsLabel}>
              <span className={styles.summaryRowTitle}>{t('payment.summary.goodsTotal')}</span>
              <span className={styles.summaryTotalsHint}>{t('payment.summary.goodsTotalHint')}</span>
            </div>
            <PaymentMoney amount={displayGoodsTotal} currency="USDC" className={styles.summaryRowAmount} />
          </div>

          {promoItems.length > 0 ? (
            <div className={styles.summaryPromoBlock}>
              <button
                type="button"
                className={styles.summaryPromoToggle}
                onClick={() => setPromoExpanded((open) => !open)}
                aria-expanded={promoExpanded}
                aria-label={t('payment.summary.promotionToggleAria')}
              >
                <span className={styles.summaryPromoToggleLeft}>
                  <span className={styles.summaryPromoTitle}>{t('payment.summary.promotionInfo')}</span>
                  <span className={styles.summaryPromoCount}>
                    {t('payment.summary.promotionCount', { count: promoItems.length })}
                  </span>
                </span>
                <span className={styles.summaryPromoToggleValue}>
                  <span className={styles.summaryPromoSavedLabel}>{t('payment.summary.promotionSaved')}</span>
                  <PaymentMoney
                    amount={displayDiscount}
                    currency="USDC"
                    sign="-"
                    className={styles.summaryPromoAmount}
                  />
                  <span
                    className={`${styles.summaryPromoChevron} ${promoExpanded ? styles.summaryPromoChevronOpen : ''}`}
                  >
                    <ChevronDown size={14} strokeWidth={2} aria-hidden />
                  </span>
                </span>
              </button>

              {promoExpanded ? (
                <ul className={styles.summaryPromoList}>
                  {promoItems.map((item) => (
                    <li key={item.key} className={styles.summaryPromoItem}>
                      <span className={styles.summaryPromoItemLabel}>
                        {item.label}
                        {item.rateTag ? (
                          <span className={styles.summaryPromoItemTag}> {item.rateTag}</span>
                        ) : null}
                      </span>
                      <PaymentMoney
                        amount={item.amount}
                        currency="USDC"
                        sign="-"
                        size="sm"
                        className={styles.summaryPromoItemAmount}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.summaryPayableRow}>
        <span className={styles.summaryPayableLabel}>{t('payment.summary.payableTotal')}</span>
        <PaymentMoney
          amount={displayPayable}
          currency="USDC"
          size="lg"
          className={styles.summaryPayableAmount}
        />
      </div>
    </PaymentGlassCard>
  );
};

export default CheckoutOrderSummary;
