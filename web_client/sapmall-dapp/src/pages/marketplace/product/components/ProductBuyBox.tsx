import React, { useState } from 'react';
import {
  Button,
  Rate,
  Tag,
  message,
} from 'antd';
import {
  ShoppingCart,
  Heart,
  Zap,
  Share2,
  Minus,
  Plus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductDetailView, ProductSkuView } from '../types/productDetailTypes';
import { formatUsdc, formatSap, formatDualPrice, calcDiscountPercent } from '../utils/priceDisplay';
import styles from '../ProductDetailPage.module.scss';

interface ProductBuyBoxProps {
  product: ProductDetailView;
  specKeys: string[];
  selectedSpecs: Record<string, string>;
  selectedSku: ProductSkuView | null;
  canPurchase: boolean;
  purchaseBlockReason?: 'spec' | 'stock' | null;
  onSelectSpec: (key: string, value: string) => void;
  isSpecValueAvailable: (key: string, value: string) => boolean;
  onAddToCart: (quantity: number) => Promise<void>;
  onBuyNow: (quantity: number) => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  cartLoading?: boolean;
}

const ProductBuyBox: React.FC<ProductBuyBoxProps> = ({
  product,
  specKeys,
  selectedSpecs,
  selectedSku,
  canPurchase,
  purchaseBlockReason,
  onSelectSpec,
  isSpecValueAvailable,
  onAddToCart,
  onBuyNow,
  isFavorited,
  onToggleFavorite,
  cartLoading,
}) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  const displayPrice = selectedSku?.price ?? product.spu.price;
  const realPrice = product.spu.realPrice;
  const discountPercent = calcDiscountPercent(displayPrice, realPrice);
  const maxQty = selectedSku?.stock ?? product.spu.totalStock ?? 99;
  const stockStatus = maxQty > 10 ? 'sufficient' : maxQty > 0 ? 'limited' : 'outOfStock';
  const soldCount = selectedSku?.saleCount ?? product.spu.totalSales ?? 0;

  const warnCannotPurchase = () => {
    if (purchaseBlockReason === 'stock') {
      message.warning(t('productDetail.outOfStock'));
      return;
    }
    message.warning(t('productDetail.selectSpecFirst'));
  };

  const handleAddCart = async () => {
    if (!canPurchase) {
      warnCannotPurchase();
      return;
    }
    await onAddToCart(quantity);
  };

  const handleBuy = () => {
    if (!canPurchase) {
      warnCannotPurchase();
      return;
    }
    onBuyNow(quantity);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `${product.spu.name} - ${formatDualPrice(displayPrice)}`;

    if (navigator.share) {
      navigator.share({
        title: product.spu.name,
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        message.info('分享已取消');
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        message.success('分享链接已复制');
      }).catch(() => {
        message.error('复制失败，请手动分享');
      });
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQty = Math.max(1, Math.min(quantity + change, maxQty));
    setQuantity(newQty);
  };

  const briefIntro = product.spu.description
    ? product.spu.description.split('\n').slice(0, 3).filter(line => line.trim())
    : [];

  const stockStatusText = {
    sufficient: '库存充足',
    limited: `仅剩 ${maxQty} 件`,
    outOfStock: '已售罄',
  }[stockStatus];

  const stockStatusColor = {
    sufficient: '#22c55e',
    limited: '#f59e0b',
    outOfStock: '#ef4444',
  }[stockStatus];

  return (
    <div className={styles.buyBoxWrapper}>
      {/* Fixed Top: Title + Promo Tags */}
      <div className={styles.titleTagRow}>
        <div className={styles.titleSection}>
          <h1 className={styles.productTitle}>{product.spu.name}</h1>
          {product.spu.description && (
            <p className={styles.productSubtitle}>{product.spu.description.split('\n')[0]}</p>
          )}
        </div>
        <div className={styles.tagsSection}>
          {product.marketingTags.slice(0, 2).map((tag) => (
            <Tag key={tag} className={styles.promoTagInline}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      {/* Fixed Second Row: Rating + Price */}
      <div className={styles.ratingPriceRow}>
        <div className={styles.ratingSection}>
          <Rate disabled allowHalf value={product.rating} className={styles.ratingStars} />
          <span className={styles.ratingText}>{product.rating.toFixed(1)}</span>
          <span className={styles.reviewCount}>({product.reviewCount})</span>
          <span className={styles.soldCount}>已售 {(soldCount / 1000).toFixed(1)}k</span>
        </div>
        <div className={styles.priceSection}>
          <div
            className={styles.priceMain}
            title={formatDualPrice(displayPrice)}
          >
            <span className={styles.currentPrice}>{formatUsdc(displayPrice)}</span>
            <span className={styles.priceApprox} aria-hidden> ≈ </span>
            <span className={styles.sapPrice}>{formatSap(displayPrice)}</span>
          </div>
          <span className={styles.originalPrice} title={`原 ${formatDualPrice(realPrice)}`}>
            原 {formatDualPrice(realPrice)}
          </span>
          <Tag color="orange" className={styles.discountTag}>-{discountPercent}%</Tag>
        </div>
      </div>

      <div className={styles.buyBoxMeta}>
        <div className={styles.brandBriefSection}>
          {product.spu.brand && (
            <div className={styles.brandBriefRow}>
              <span className={styles.infoLabel}>品牌</span>
              <span className={styles.infoValue}>{product.spu.brand}</span>
            </div>
          )}
          {briefIntro.length > 0 && (
            <div className={styles.briefIntroInline}>
              <span className={styles.infoLabel}>商品亮点</span>
              <ul className={styles.briefListInline}>
                {briefIntro.map((line, idx) => (
                  <li key={idx}>{line.trim()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Spec Row */}
      {specKeys.length > 0 && (
        <div className={styles.specRowCompact}>
          {specKeys.map((key) => (
            <div key={key} className={styles.specItemCompact}>
              <span className={styles.specLabelCompact}>{key}</span>
              <div className={styles.specButtonsCompact}>
                {(product.specifications[key] || []).slice(0, 5).map((val) => {
                  const available = isSpecValueAvailable(key, val);
                  return (
                    <button
                      key={val}
                      type="button"
                      disabled={!available}
                      className={`${styles.specBtnCompact} ${
                        available && selectedSpecs[key] === val
                          ? styles.specBtnCompactActive
                          : ''
                      } ${!available ? styles.specBtnCompactDisabled : ''}`}
                      onClick={() => onSelectSpec(key, val)}
                      aria-disabled={!available}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fixed Quantity Row */}
      <div className={styles.quantityRowCompact}>
        <div className={styles.quantityControl}>
          <span className={styles.quantityLabel}>{t('productDetail.quantity')}:</span>
          <div className={styles.quantityInput}>
            <Button
              type="text"
              size="small"
              icon={<Minus size={16} />}
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className={styles.qtyBtn}
            />
            <span className={styles.qtyDisplay}>{quantity}</span>
            <Button
              type="text"
              size="small"
              icon={<Plus size={16} />}
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= maxQty}
              className={styles.qtyBtn}
            />
          </div>
        </div>
        <div className={styles.stockInfo}>
          <span className={styles.stockStatus} style={{ color: stockStatusColor }}>
            {stockStatusText}
          </span>
        </div>
      </div>

      {/* Fixed Button Group - New Layout */}
      <div className={styles.buttonGroupCompact}>
        <div className={styles.mainButtonsRow}>
        <Button
            type="primary"
            icon={<Zap size={16} />}
            onClick={handleBuy}
            className={styles.buyNowBtnCompact}
          >
            {t('productDetail.buyNow')}
          </Button>
          <Button
            icon={<ShoppingCart size={16} />}
            loading={cartLoading}
            onClick={handleAddCart}
            className={styles.cartBtnCompact}
          >
            {t('productDetail.addToCart')}
          </Button>
          <div className={styles.iconButtonsRow}>
            <Button
              type="text"
              icon={<Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />}
              onClick={onToggleFavorite}
              className={styles.iconBtn}
              title="收藏"
            />
            <Button
              type="text"
              icon={<Share2 size={16} />}
              onClick={handleShare}
              className={styles.iconBtn}
              title="分享"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBuyBox;
