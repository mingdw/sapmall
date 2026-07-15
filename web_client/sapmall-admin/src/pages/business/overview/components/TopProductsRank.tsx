import React from 'react';
import type { TopProduct } from '../types';
import styles from '../StoreOverview.module.scss';

interface TopProductsRankProps {
  products: TopProduct[];
}

const TopProductsRank: React.FC<TopProductsRankProps> = ({ products }) => {
  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionLabel}>热销商品</h3>
      </div>
      <ul className={styles.rankList}>
        {products.map((product, index) => (
          <li key={product.id} className={styles.rankItem}>
            <span className={`${styles.rankIndex} ${index < 3 ? styles.rankTop : ''}`}>
              {index + 1}
            </span>
            <div className={styles.rankContent}>
              <div className={styles.rankNameRow}>
                <span className={styles.rankName}>{product.name}</span>
                <span className={styles.rankRevenue}>{product.revenue}</span>
              </div>
              <div className={styles.rankBarTrack}>
                <div className={styles.rankBarFill} style={{ width: `${product.share}%` }} />
              </div>
              <div className={styles.rankMeta}>销量 {product.salesCount}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TopProductsRank;
