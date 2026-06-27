import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import {
  CheckCircle2,
  Check,
  ShoppingBag,
  FileText,
  Share2,
  ArrowRight,
  Copy,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTxExplorerUrl } from '../../../config/paymentChains';
import { isSapPayment } from '../../../config/paymentCurrencies';
import { formatUsdcDisplay, formatTokenDisplay } from './utils/formatPaymentAmount';
import { buildOrderResultView, buildOrderResultViewFromStatus } from './utils/buildOrderResultView';
import type { PaymentMethod } from './types/paymentTypes';
import { useOrderResultDetail } from './hooks/useOrderResultDetail';
import { redirectToAdmin } from '../../../utils/redirectToAdmin';
import { navigateToMarketplace } from '../paths';
import { OrderPreviewItem } from '../../../services/api/orderApi';
import ProductCard from '../../../components/ProductCard';
import { Product } from '../../../services/types/productTypes';
import { productApiService } from '../../../services/api/productApiService';
import { transformProductForDisplay } from '../../../utils/productUtils';
import {
  resolveProductImageUrl,
  buildSampleProductImageUrl,
} from '../../../utils/productImageUrls';
import styles from './PaymentPage.module.scss';
import resultStyles from './OrderResultPage.module.scss';

interface ResultLocationState {
  txHash?: string;
  chainId?: number;
  items?: OrderPreviewItem[];
  platformFeeAmount?: number;
  payableAmount?: number;
  tokenSymbol?: string;
}

const FULFILLMENT_STEP_KEYS = ['paid', 'shipping', 'completed'] as const;

const shortenHash = (hash: string, head = 10, tail = 8): string => {
  if (hash.length <= head + tail + 3) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
};

function formatPaidAt(iso?: string, locale = 'zh-CN'): string {
  if (!iso?.trim()) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDiscount(amount: number): string {
  if (amount <= 0) return formatUsdcDisplay(0);
  return `-${formatUsdcDisplay(amount)}`;
}

const OrderResultPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderCode: orderCodeParam } = useParams<{ orderCode: string }>();
  const state = (location.state || {}) as ResultLocationState;

  const { orderDetail, statusDetail, loading } = useOrderResultDetail({
    orderCode: orderCodeParam,
    txHash: state.txHash,
    chainId: state.chainId,
  });

  const txFallback = useMemo(
    () => ({
      txHash: statusDetail?.txHash?.trim() || state.txHash?.trim() || undefined,
      chainId: statusDetail?.chainId ?? state.chainId,
    }),
    [state.chainId, state.txHash, statusDetail?.chainId, statusDetail?.txHash],
  );

  const resultFallback = useMemo(
    () => ({
      ...txFallback,
      platformFeeAmount: state.platformFeeAmount ?? statusDetail?.platformFeeAmount,
      payableAmount: state.payableAmount ?? statusDetail?.payableAmount,
      tokenSymbol: state.tokenSymbol ?? statusDetail?.tokenSymbol,
    }),
    [
      state.payableAmount,
      state.platformFeeAmount,
      state.tokenSymbol,
      statusDetail?.payableAmount,
      statusDetail?.platformFeeAmount,
      statusDetail?.tokenSymbol,
      txFallback,
    ],
  );

  const resultView = useMemo(() => {
    if (orderDetail) {
      return buildOrderResultView(orderDetail, state.items, resultFallback, statusDetail);
    }
    if (statusDetail) {
      return buildOrderResultViewFromStatus(statusDetail, resultFallback, state.items);
    }
    return null;
  }, [orderDetail, resultFallback, state.items, statusDetail]);

  const paymentToken =
    (resultView?.paidTokenSymbol ??
      state.tokenSymbol ??
      statusDetail?.tokenSymbol ??
      'USDC') as PaymentMethod;
  const showPlatformFeeRow = !isSapPayment(paymentToken);

  const orderCode = resultView?.orderCode ?? orderCodeParam?.trim() ?? '';
  const chainId = resultView?.chainId ?? txFallback.chainId;
  const txHash = resultView?.txHash ?? txFallback.txHash;
  const explorer = txHash && chainId ? getTxExplorerUrl(chainId, txHash) : undefined;
  const displayItems = resultView?.items?.length ? resultView.items : state.items ?? [];
  const locale = i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US';

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoadingRecs(true);
        const resp = await productApiService.getProducts({ page: 1, pageSize: 5 });
        const currentProductCode = displayItems[0]?.productCode;
        const filtered = resp.products.filter((p) => p.code !== currentProductCode);
        setRecommendations(filtered.slice(0, 5));
      } catch {
        setRecommendations([]);
      } finally {
        setLoadingRecs(false);
      }
    };
    loadRecommendations();
  }, [displayItems]);

  const handleCopyOrderCode = () => {
    if (!orderCode) return;
    navigator.clipboard.writeText(orderCode);
  };

  const handleShare = () => {
    const shareData = {
      title: t('payment.result.shareTitle', 'Sapphire Mall Order'),
      text: t('payment.result.shareText', 'I just purchased on Sapphire Mall!'),
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
  };

  const handleProductClick = (product: Product) => {
    if (!product.code) return;
    navigate(`/marketplace/product/${product.code}`);
  };

  const renderDetailValue = (value: React.ReactNode) =>
    loading ? <Spin size="small" /> : value;

  return (
    <div className={`${styles.pageShell} ${resultStyles.pageRoot}`}>
      <div className={styles.pageGlow} aria-hidden />

      <div className={resultStyles.resultUpper}>
        <div className={resultStyles.resultUpperBg} aria-hidden />
        <div className={resultStyles.confetti} aria-hidden>
          {Array.from({ length: 14 }).map((_, index) => (
            <span
              key={index}
              className={resultStyles.confettiDot}
              style={{ '--delay': `${index * 0.08}s` } as React.CSSProperties}
            />
          ))}
        </div>

        <section className={resultStyles.heroZone} aria-labelledby="order-success-title">
          <div className={resultStyles.heroContent}>
            <ol className={resultStyles.fulfillmentTrack} aria-label={t('payment.resultSteps.aria')}>
              {FULFILLMENT_STEP_KEYS.map((key, index) => {
                const done = index === 0;
                const current = index === 1;
                return (
                  <li
                    key={key}
                    className={`${resultStyles.fulfillmentStep} ${done ? resultStyles.fulfillmentDone : ''} ${current ? resultStyles.fulfillmentCurrent : ''}`}
                  >
                    <span className={resultStyles.fulfillmentDot} aria-hidden>
                      {done ? <Check size={12} strokeWidth={3} /> : index + 1}
                    </span>
                    <span className={resultStyles.fulfillmentLabel}>
                      {t(`payment.resultSteps.${key}`)}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className={resultStyles.heroCenter}>
              <div className={resultStyles.successIconWrap}>
                <span className={resultStyles.successRing} aria-hidden />
                <span className={resultStyles.successRingOuter} aria-hidden />
                <CheckCircle2 className={resultStyles.successIcon} size={72} strokeWidth={1.5} />
              </div>
              <h1 id="order-success-title" className={resultStyles.successTitle}>
                {t('payment.result.successTitle')}
              </h1>
              <p className={resultStyles.successDesc}>{t('payment.result.successDesc')}</p>
            </div>
          </div>
        </section>

        <section className={resultStyles.detailZone} aria-label={t('payment.result.amountDetails')}>
          <div className={resultStyles.detailCard}>
            <h2 className={resultStyles.detailCardTitle}>{t('payment.result.amountDetails')}</h2>
            <dl className={resultStyles.detailList}>
              {orderCode ? (
                <div className={resultStyles.detailRow}>
                  <dt>{t('payment.result.orderCode')}</dt>
                  <dd className={resultStyles.detailOrderCode}>
                    <span className={resultStyles.detailMono}>{orderCode}</span>
                    <button
                      type="button"
                      className={resultStyles.copyOrderBtn}
                      onClick={handleCopyOrderCode}
                      aria-label={t('payment.result.copyOrderCode')}
                    >
                      <Copy size={14} aria-hidden />
                    </button>
                  </dd>
                </div>
              ) : null}
              <div className={resultStyles.detailRow}>
                <dt>{t('payment.result.goodsTotalAmount')}</dt>
                <dd>{renderDetailValue(formatUsdcDisplay(resultView?.goodsTotal ?? 0))}</dd>
              </div>
              <div className={resultStyles.detailRow}>
                <dt>{t('payment.result.discountAmount')}</dt>
                <dd
                  className={
                    (resultView?.discountTotal ?? 0) > 0 ? resultStyles.detailValueDiscount : undefined
                  }
                >
                  {renderDetailValue(formatDiscount(resultView?.discountTotal ?? 0))}
                </dd>
              </div>
              {showPlatformFeeRow ? (
                <div className={resultStyles.detailRow}>
                  <dt>{t('payment.result.platformFee')}</dt>
                  <dd>
                    {renderDetailValue(
                      resultView != null &&
                        (resultView.platformFeeDisplay > 0 || resultView.platformFeeUsdc > 0)
                        ? resultView.platformFeeDisplaySymbol === 'USDC'
                          ? formatUsdcDisplay(
                              resultView.platformFeeDisplay || resultView.platformFeeUsdc,
                            )
                          : formatTokenDisplay(
                              resultView.platformFeeDisplay,
                              resultView.platformFeeDisplaySymbol,
                            )
                        : formatUsdcDisplay(0),
                    )}
                  </dd>
                </div>
              ) : null}
              <div className={resultStyles.detailRow}>
                <dt>{t('payment.result.gasFee')}</dt>
                <dd>{renderDetailValue(formatUsdcDisplay(resultView?.gasFee ?? 0))}</dd>
              </div>
              <div className={`${resultStyles.detailRow} ${resultStyles.detailRowTotal}`}>
                <dt>{t('payment.result.paidAmount')}</dt>
                <dd className={resultStyles.detailValueAccent}>
                  {renderDetailValue(
                    formatTokenDisplay(
                      resultView?.paidAmount ?? 0,
                      resultView?.paidTokenSymbol ?? 'USDC',
                    ),
                  )}
                </dd>
              </div>
              <div className={resultStyles.detailRow}>
                <dt>{t('payment.result.paidAt')}</dt>
                <dd>{renderDetailValue(formatPaidAt(resultView?.paidAt, locale))}</dd>
              </div>
              <div className={resultStyles.detailRow}>
                <dt>{t('payment.result.txHash')}</dt>
                <dd>
                  {loading && !txHash ? (
                    <Spin size="small" />
                  ) : txHash ? (
                    explorer ? (
                      <a
                        href={explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={resultStyles.txLink}
                        title={t('payment.result.viewExplorer')}
                      >
                        {shortenHash(txHash)}
                      </a>
                    ) : (
                      <span className={resultStyles.detailMono}>{shortenHash(txHash)}</span>
                    )
                  ) : (
                    <span className={resultStyles.detailMono}>—</span>
                  )}
                </dd>
              </div>
            </dl>

            <div className={resultStyles.detailActions}>
              <Button
                type="primary"
                icon={<ShoppingBag size={16} />}
                onClick={() => navigateToMarketplace(navigate)}
                className={resultStyles.primaryBtn}
              >
                {t('payment.result.continueShopping')}
              </Button>
              <Button
                icon={<FileText size={16} />}
                onClick={() => redirectToAdmin('orders')}
                className={resultStyles.secondaryBtn}
              >
                {t('payment.result.viewOrders')}
              </Button>
              <Button
                icon={<Share2 size={16} />}
                onClick={handleShare}
                className={resultStyles.secondaryBtn}
              >
                {t('payment.result.share')}
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className={resultStyles.bodyZone}>
        {displayItems.length > 0 && (
          <section className={resultStyles.itemsSection} aria-labelledby="ordered-items-title">
            <div className={resultStyles.itemsSectionHead}>
              <h2 id="ordered-items-title" className={resultStyles.itemsSectionTitle}>
                {t('payment.result.orderedItems')}
              </h2>
              <span className={resultStyles.itemsSectionCount}>
                {t('payment.result.itemsCount', { count: displayItems.length })}
              </span>
            </div>
            <ul className={resultStyles.itemsPlainList}>
              {displayItems.map((item) => (
                <li key={item.skuId} className={resultStyles.itemsPlainRow}>
                  <div className={resultStyles.itemsPlainThumb}>
                    <img
                      src={
                        resolveProductImageUrl(item.imageUrl, item.skuId)
                        || buildSampleProductImageUrl(item.skuId)
                      }
                      alt={item.productName}
                      className={resultStyles.itemsPlainImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = buildSampleProductImageUrl(item.skuId);
                      }}
                    />
                  </div>
                  <div className={resultStyles.itemsPlainBody}>
                    <p className={resultStyles.itemsPlainName}>{item.productName}</p>
                    {item.specText ? (
                      <p className={resultStyles.itemsPlainSpec}>{item.specText}</p>
                    ) : null}
                    <p className={resultStyles.itemsPlainQty}>×{item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={resultStyles.recommendSection} aria-labelledby="recommend-title">
          <div className={resultStyles.recommendHeader}>
            <div>
              <h2 id="recommend-title" className={resultStyles.recommendTitle}>
                {t('payment.result.youMayAlsoLike')}
              </h2>
              <p className={resultStyles.recommendSubtitle}>
                {t('payment.result.recommendHint', '为你精选更多好物')}
              </p>
            </div>
            <Link to="/marketplace" className={resultStyles.viewAllLink}>
              {t('payment.result.viewAll')}
              <ArrowRight size={16} />
            </Link>
          </div>
          {loadingRecs ? (
            <div className={resultStyles.recommendLoading}>
              <Spin />
            </div>
          ) : recommendations.length > 0 ? (
            <div className={resultStyles.recommendGrid}>
              {recommendations.map((product, index) => (
                <div
                  key={product.id}
                  className={resultStyles.recommendItem}
                  style={{ '--rec-delay': `${0.1 + index * 0.07}s` } as React.CSSProperties}
                >
                  <ProductCard
                    product={transformProductForDisplay(product)}
                    onProductClick={handleProductClick}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <p className={resultStyles.helpLink}>
          <Link to="/help" className={resultStyles.helpLinkText}>
            {t('payment.result.helpLink')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrderResultPage;
