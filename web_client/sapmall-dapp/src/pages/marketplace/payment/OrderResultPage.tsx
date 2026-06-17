import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import {
  CheckCircle2,
  Check,
  ShoppingBag,
  FileText,
  Share2,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTxExplorerUrl } from '../../../config/paymentChains';
import { estimateGasFeeUsdc } from './utils/estimateGasFee';
import { formatUsdcDisplay } from './utils/formatPaymentAmount';
import PaymentGlassCard from './components/PaymentGlassCard';
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
  /** 实付金额（USDC） */
  amount?: number;
  chainId?: number;
  items?: OrderPreviewItem[];
  /** 商品总金额（不含平台费与 Gas） */
  goodsAmount?: number;
  /** 预估 Gas 费（USDC） */
  gasFeeUsdc?: number;
}

const FULFILLMENT_STEP_KEYS = ['paid', 'shipping', 'completed'] as const;

/** 缩短链上哈希展示 */
const shortenHash = (hash: string, head = 10, tail = 8): string => {
  if (hash.length <= head + tail + 3) return hash;
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`;
};

const OrderResultPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as ResultLocationState;

  const explorer =
    state.txHash && state.chainId ? getTxExplorerUrl(state.chainId, state.txHash) : undefined;

  const goodsTotal = useMemo(() => {
    if (state.goodsAmount != null) return state.goodsAmount;
    if (state.items?.length) {
      return state.items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);
    }
    return 0;
  }, [state.goodsAmount, state.items]);

  const gasFee = useMemo(
    () => state.gasFeeUsdc ?? estimateGasFeeUsdc(state.chainId),
    [state.gasFeeUsdc, state.chainId],
  );

  const paidAmount = state.amount ?? goodsTotal + gasFee;
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoadingRecs(true);
        const resp = await productApiService.getProducts({ page: 1, pageSize: 5 });
        const currentProductCode = state.items?.[0]?.productCode;
        const filtered = resp.products.filter((p) => p.code !== currentProductCode);
        setRecommendations(filtered.slice(0, 5));
      } catch {
        setRecommendations([]);
      } finally {
        setLoadingRecs(false);
      }
    };
    loadRecommendations();
  }, [state.items]);

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

        {/* 区域一：支付成功 */}
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

        {/* 区域二：金额与交易信息 */}
        <section className={resultStyles.detailZone} aria-label={t('payment.result.amountDetails')}>
          <div className={resultStyles.detailCard}>
          <dl className={resultStyles.detailList}>
            <div className={resultStyles.detailRow}>
              <dt>{t('payment.result.goodsTotalAmount')}</dt>
              <dd>{formatUsdcDisplay(goodsTotal)}</dd>
            </div>
            <div className={resultStyles.detailRow}>
              <dt>{t('payment.result.paidAmount')}</dt>
              <dd className={resultStyles.detailValueAccent}>{formatUsdcDisplay(paidAmount)}</dd>
            </div>
            <div className={resultStyles.detailRow}>
              <dt>{t('payment.result.gasFee')}</dt>
              <dd>{formatUsdcDisplay(gasFee)}</dd>
            </div>
            {state.txHash && (
              <div className={resultStyles.detailRow}>
                <dt>{t('payment.result.txHash')}</dt>
                <dd>
                  {explorer ? (
                    <a
                      href={explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={resultStyles.txLink}
                      title={t('payment.result.viewExplorer')}
                    >
                      {shortenHash(state.txHash)}
                    </a>
                  ) : (
                    <span className={resultStyles.detailMono}>{shortenHash(state.txHash)}</span>
                  )}
                </dd>
              </div>
            )}
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
        {state.items && state.items.length > 0 && (
          <PaymentGlassCard className={`${resultStyles.resultCard} ${resultStyles.itemsCard}`}>
            <div className={resultStyles.cardHeader}>
              <Package size={18} strokeWidth={1.75} className={resultStyles.cardHeaderIcon} />
              <div>
                <h2 className={resultStyles.cardTitle}>{t('payment.result.orderedItems')}</h2>
                <p className={resultStyles.cardSubtitle}>
                  {t('payment.result.itemsCount', {
                    count: state.items.length,
                    defaultValue: `${state.items.length} 件商品`,
                  })}
                </p>
              </div>
            </div>
            <div className={resultStyles.orderItems}>
              {state.items.map((item, index) => (
                <div
                  key={item.skuId}
                  className={resultStyles.orderItem}
                  style={{ '--item-delay': `${0.08 + index * 0.06}s` } as React.CSSProperties}
                >
                  <div className={resultStyles.orderItemThumb}>
                    <img
                      src={
                        resolveProductImageUrl(item.imageUrl, item.skuId)
                        || buildSampleProductImageUrl(item.skuId)
                      }
                      alt={item.productName}
                      className={resultStyles.orderItemImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = buildSampleProductImageUrl(item.skuId);
                      }}
                    />
                  </div>
                  <div className={resultStyles.orderItemInfo}>
                    <h3 className={resultStyles.orderItemName}>{item.productName}</h3>
                    {item.specText && (
                      <p className={resultStyles.orderItemSpec}>{item.specText}</p>
                    )}
                    <div className={resultStyles.orderItemMeta}>
                      <span className={resultStyles.orderItemQty}>×{item.quantity}</span>
                      <span className={resultStyles.orderItemPrice}>
                        {formatUsdcDisplay(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PaymentGlassCard>
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
