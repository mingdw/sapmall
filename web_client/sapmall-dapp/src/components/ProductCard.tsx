import React from 'react';
import { Product } from '../services/types/productTypes';
import { formatPrice } from '../utils/productUtils';
import styles from './ProductCard.module.scss';

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
          src={product.image} 
          alt={product.title} 
          className={`${styles.productImage}`} 
        />
        <div className={`${styles.productBadges}`}>
          {product.badges?.map((badge: string, badgeIndex: number) => (
            <div 
              key={badgeIndex} 
              className={`${styles.productBadge} ${styles[badge.toLowerCase()]}`}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.productContent}`}>
        <h4 className={`${styles.productTitle}`}>{product.title}</h4>
        <p className={`${styles.productDescription}`}>{product.description}</p>
        <div className={`${styles.productMeta}`}>
          <span className={`${styles.productPrice}`}>{formatPrice(product.price)}</span>
          <div className={`${styles.productRating}`}>
            <i className="fas fa-star star"></i>
            <span className={`${styles.ratingText}`}>{product.rating?.toFixed(1) || '4.5'}</span>
          </div>
        </div>
        <button 
          className={`${styles.buyBtn}`}
          onClick={handleBuyClick}
        >
          立即购买
        </button>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
