import React from 'react';
import { Product } from '../services/types/productTypes';
import ProductDetailComponent from './ProductCard';
import styles from './ProductCategoryCard.module.scss';

interface ProductCategoryComponentProps {
  // 分类信息
  categoryId: number;
  categoryName: string;
  categoryCode: string;
  categoryIcon: string;
  productCount: number;
  
  // 商品数据
  products: Product[];
  
  // 事件处理
  onMoreClick?: (categoryId: number) => void;
  onProductClick?: (product: Product) => void;
  onProductBuy?: (product: Product) => void;
  
  // 显示配置
  maxDisplayCount?: number; // 最大显示商品数量，默认10个（2行5列）
  showMoreButton?: boolean; // 是否显示更多按钮
}

const ProductCategoryComponent: React.FC<ProductCategoryComponentProps> = ({
  categoryId,
  categoryName,
  categoryCode,
  categoryIcon,
  productCount,
  products,
  onMoreClick,
  onProductClick,
  onProductBuy,
  maxDisplayCount = 10,
  showMoreButton = true
}) => {
  // 限制显示的商品数量
  const displayProducts = products.slice(0, maxDisplayCount);
  
  // 处理更多按钮点击
  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(categoryId);
    }
  };

  return (
    <div className={`${styles.categoryMainCard}`}>
      {/* 分类头部 */}
      <div className={`${styles.categoryMainHeader}`}>
        <div className={`${styles.categoryMainTitle}`}>
          <div className={`${styles.categoryMainIcon} bg-gradient-to-br from-blue-500 to-indigo-600`}>
            <i className={categoryIcon}></i>
          </div>
          <div className={`${styles.categoryMainInfo}`}>
            <h3>{categoryName}</h3>
            <span className={`${styles.categoryItemCount}`}>
              {productCount}个商品
            </span>
          </div>
        </div>
        {showMoreButton && (
          <button 
            className={`${styles.categoryMoreBtn}`}
            onClick={handleMoreClick}
          >
            <span>更多</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>
      
      {/* 商品网格 - 2行5列 */}
      <div className="grid grid-cols-5 gap-4">
        {displayProducts.map((product) => (
          <ProductDetailComponent
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            onProductBuy={onProductBuy}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCategoryComponent;
