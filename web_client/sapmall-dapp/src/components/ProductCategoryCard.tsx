import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { Product } from '../services/types/productTypes';
import ProductDetailComponent from './ProductCard';
import MarketplacePagination from '../pages/marketplace/components/MarketplacePagination';
import styles from './ProductCategoryCard.module.scss';
import {
  categoryPlainIconStyle,
  resolveCategoryIconTheme,
} from '../pages/marketplace/utils/categoryIconTheme';

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
  showPagination?: boolean; // 是否显示分页组件
  
  // 分页配置
  paginationProps?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    isLoading?: boolean;
  };
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
  showMoreButton = true,
  showPagination = false,
  paginationProps
}) => {
  const { t } = useTranslation();
  // 根据是否显示分页来决定商品显示逻辑
  const displayProducts = showPagination ? products : products.slice(0, maxDisplayCount);
  
  // 处理更多按钮点击
  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(categoryId);
    }
  };

  const iconTheme = resolveCategoryIconTheme(categoryCode, categoryIcon);

  return (
    <div className={`${styles.categoryMainCard}`}>
      {/* 分类头部 — 对齐帮助中心 cardSectionHead 布局 */}
      <div className={styles.categoryMainHeader}>
        <div className={styles.categoryMainHead}>
          <div className={styles.categoryMainTitle}>
            <span
              className={styles.categoryMainIcon}
              style={categoryPlainIconStyle(iconTheme)}
            >
              {(() => { const CategoryIcon = iconTheme.icon; return <CategoryIcon size={16} aria-hidden="true" />; })()}
            </span>
            <h3 className={styles.categoryMainTitleText}>{categoryName}</h3>
          </div>
          {showMoreButton && (
            <button
              type="button"
              className={styles.categoryMoreBtn}
              onClick={handleMoreClick}
            >
              <span>{showPagination ? t('marketplacePage.backToMall') : t('marketplacePage.more')}</span>
              {showPagination ? <ArrowLeft size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>

      <div className={styles.categoryMainBody}>
      {paginationProps?.isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">{t('marketplacePage.loadingProducts')}</p>
        </div>
      ) : displayProducts.length > 0 ? (
        <>
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
          
          {/* 分页组件 */}
          {showPagination && paginationProps && (
            <MarketplacePagination
              currentPage={paginationProps.currentPage}
              totalPages={paginationProps.totalPages}
              totalItems={paginationProps.totalItems}
              itemsPerPage={paginationProps.itemsPerPage}
              onPageChange={paginationProps.onPageChange}
              showInfo={true}
              showPageSize={true}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageSizeChange={paginationProps.onPageSizeChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            <Search size={36} className="text-4xl mb-4 block" />
            <p>{t('marketplacePage.noProducts')}</p>
            <p className="text-sm mt-2">{t('marketplacePage.tryOtherFilters')}</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductCategoryComponent;