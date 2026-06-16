import React, { useEffect, useState } from 'react';
import { getFirstOrderSkuImage } from '../utils/orderImageUtils';
import styles from '../PersonalOrderManager.module.scss';

interface Props {
  skuImgs?: string;
  className?: string;
  placeholderClassName?: string;
}

const OrderProductThumb: React.FC<Props> = ({
  skuImgs,
  className,
  placeholderClassName,
}) => {
  const src = getFirstOrderSkuImage(skuImgs);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className={placeholderClassName ?? styles.productThumbPlaceholder} />;
  }

  return (
    <img
      src={src}
      alt=""
      className={className ?? styles.productThumb}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
};

export default OrderProductThumb;
