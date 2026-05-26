import React, { useEffect, useState } from 'react';
import { Product } from '../services/types/productTypes';
import { formatUsdc, formatSap, formatDualPrice } from '../pages/marketplace/product/utils/priceDisplay';
import { resolveProductImageUrl, picsumDirectUrl, dummyImageUrl } from '../utils/productImageUrls';
import styles from './ProductCard.module.scss';

// 徽章显示文本映射
const getBadgeDisplayText = (badge: string): string => {
  const badgeTextMap: { [key: string]: string } = {
    'hot': '热门',
    'new': '新品',
    'featured': '精选',
    'art': '艺术',
    'tool': '工具',
    'epic': '史诗',
    'legendary': '传奇',
    'mythical': '神话',
    'sale': '促销',
    'limited': '限量',
    'trending': '热门',
    'premium': '高级'
  };
  
  return badgeTextMap[badge.toLowerCase()] || badge;
};

interface ProductDetailComponentProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  onProductBuy?: (product: Product) => void;
}

const ProductDetailComponent: React.FC<ProductDetailComponentProps> = ({
  product,
  onProductClick,
  onProductBuy
}) => {
  const imageSeed = product.id ?? product.code ?? product.title;
  const category3 = product.category3Code ?? product.category;
  const fallbackChain = [
    resolveProductImageUrl(undefined, imageSeed, category3),
    picsumDirectUrl(imageSeed),
    dummyImageUrl(imageSeed, 'SAP'),
  ];
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [imageSrc, setImageSrc] = useState(product.image || fallbackChain[0]);

  useEffect(() => {
    setFallbackIndex(0);
    setImageSrc(product.image || fallbackChain[0]);
  }, [product.image, product.id, product.code, product.title]);

  const handleImageError = () => {
    setFallbackIndex((prev) => {
      const next = prev + 1;
      if (next < fallbackChain.length) {
        setImageSrc(fallbackChain[next]);
      }
      return next;
    });
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProductBuy) {
      onProductBuy(product);
    }
  };

  return (
    <div 
      className={`${styles.productCard}`}
      onClick={handleCardClick}
    >
      <div className={`${styles.productImageContainer}`}>
        <img
          src={imageSrc}
          alt={product.title}
          className={`${styles.productImage}`}
          loading="lazy"
          onError={handleImageError}
        />
        <div className={`${styles.productBadges}`}>
          {product.badges?.map((badge: string, badgeIndex: number) => (
            <div 
              key={badgeIndex} 
              className={`${styles.productBadge} ${styles[badge.toLowerCase()]}`}
            >
              {getBadgeDisplayText(badge)}
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.productContent}`}>
        <h4 className={`${styles.productTitle}`}>{product.title}</h4>
        <p className={`${styles.productDescription}`}>{product.description}</p>
        <div className={`${styles.productMeta}`}>
          <div
            className={styles.productPriceBlock}
            title={formatDualPrice(product.price)}
          >
            <span className={styles.productPricePrimary}>{formatUsdc(product.price)}</span>
            <span className={styles.productPriceApprox} aria-hidden> ≈ </span>
            <span className={styles.productPriceSecondary}>{formatSap(product.price)}</span>
          </div>
          <div className={styles.productRating}>
            <i className={`fas fa-star ${styles.star}`} aria-hidden />
            <span className={styles.ratingText}>{product.rating?.toFixed(1) || '4.5'}</span>
          </div>
        </div>
        <button
          type="button"
          className={styles.buyBtn}
          onClick={handleBuyClick}
        >
          立即购买
        </button>
      </div>
    </div>
  );
};

export default ProductDetailComponent;