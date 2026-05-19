const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '../src/pages/product');

const productBuyBox = `import React, { useState } from 'react';
import { Button, InputNumber, Rate, Tag, message } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ThunderboltOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProductDetailView, ProductSkuView } from '../types/productDetailTypes';
import { formatUsd, formatSap, calcDiscountPercent } from '../utils/priceDisplay';
import styles from '../ProductDetailPage.module.scss';

interface ProductBuyBoxProps {
  product: ProductDetailView;
  specKeys: string[];
  selectedSpecs: Record<string, string>;
  selectedSku: ProductSkuView | null;
  canPurchase: boolean;
  onSelectSpec: (key: string, value: string) => void;
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
  onSelectSpec,
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
  const discount = calcDiscountPercent(displayPrice, realPrice);
  const maxQty = Math.max(1, selectedSku?.stock ?? product.spu.totalStock ?? 99);

  const handleAddCart = async () => {
    if (!canPurchase) {
      message.warning(t('productDetail.selectSpecFirst'));
      return;
    }
    await onAddToCart(quantity);
  };

  const handleBuy = () => {
    if (!canPurchase) {
      message.warning(t('productDetail.selectSpecFirst'));
      return;
    }
    onBuyNow(quantity);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className={styles.titleRow}>
        <h1 className={styles.productTitle}>{product.spu.name}</h1>
        <Button
          type="text"
          icon={isFavorited ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
          onClick={onToggleFavorite}
        />
      </motionless>
      <div className={styles.tagRow}>
        {product.marketingTags.map((tag) => (
          <Tag key={tag} color="orange">{tag}</Tag>
        ))}
      </motionless>
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Rate disabled allowHalf value={product.rating} className="text-sm" />
        <span>{product.rating.toFixed(1)}</span>
        <span>({product.reviewCount} {t('productDetail.reviews')})</span>
      </motionless>
      <div className={styles.priceCard}>
        <div>
          <span className={styles.priceUsd}>{formatUsd(displayPrice)}</span>
          <span className={styles.priceSap}>{formatSap(displayPrice)}</span>
        </motionless>
        {discount != null && (
          <div className="text-slate-400 text-sm mt-1 line-through">{formatUsd(realPrice)}</motionless>
        )}
        {discount != null && (
          <Tag color="red" className="ml-2">{discount}% OFF</Tag>
        )}
      </motionless>
      {specKeys.map((key) => (
        <div key={key} className="flex gap-3 items-start">
          <span className={styles.specLabel}>{key}</span>
          <div className="flex flex-wrap gap-2">
            {(product.specifications[key] || []).map((val) => (
              <button
                key={val}
                type="button"
                className={\`\${styles.specBtn} \${selectedSpecs[key] === val ? styles.specBtnActive : ''}\`}
                onClick={() => onSelectSpec(key, val)}
              >
                {val}
              </button>
            ))}
          </motionless>
        </motionless>
      ))}
      <motionless />
    </motionless>
  );
};

export default ProductBuyBox;
`;

// Fix accidental motionless tags in template
function fixTags(s) {
  return s
    .replace(/<motionless \/>/g, '')
    .replace(/<\/motionless>/g, '</div>')
    .replace(/<motionless>/g, '<motionless>')
    .replace(/<motionless>/g, '<div');
}

// Manual fix for buy box - write corrected version
const buyBoxFixed = productBuyBox
  .replace(/<\/motionless>/g, '</motionless>')
  .replace(/<motionless>/g, '<motionless>');

console.log('script placeholder');
