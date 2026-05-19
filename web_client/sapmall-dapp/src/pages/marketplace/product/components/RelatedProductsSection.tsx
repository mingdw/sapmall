import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import ProductCard from '../../../../components/ProductCard';
import { Product } from '../../../../services/types/productTypes';
import { transformProductForDisplay } from '../../../../utils/productUtils';
import { navigateToProductDetail } from '../paths';
import styles from '../ProductDetailPage.module.scss';

interface RelatedProductsSectionProps {
  items: Product[];
  loading: boolean;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({ items, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (product: Product) => {
    if (!product.code) return;
    navigateToProductDetail(navigate, product.code);
  };

  if (loading) {
    return <div className="py-8 text-center"><Spin /></div>;
  }

  if (!items.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold text-white mb-4">{t('productDetail.relatedTitle')}</h3>
      <div className={styles.relatedGrid}>
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={transformProductForDisplay(p)}
            onProductClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsSection;
