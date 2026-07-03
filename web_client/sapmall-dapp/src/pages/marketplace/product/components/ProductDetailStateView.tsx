import React, { useState } from 'react';
import { Button, Empty, Spin } from 'antd';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resolveProductDetailError } from '../utils/resolveProductDetailError';
import styles from '../ProductDetailPage.module.scss';

interface ProductDetailLoadingProps {
  mode: 'loading';
}

interface ProductDetailErrorProps {
  mode: 'error';
  error?: string | null;
  productCode?: string;
  onGoBack: () => void;
  onRetry: () => void;
}

type ProductDetailStateViewProps = ProductDetailLoadingProps | ProductDetailErrorProps;

const ProductDetailStateView: React.FC<ProductDetailStateViewProps> = (props) => {
  const { t } = useTranslation();
  const [retrying, setRetrying] = useState(false);

  if (props.mode === 'loading') {
    return (
      <div className={styles.page}>
        <div className="mx-auto w-[95%] max-w-2xl pt-24">
          <div className={styles.stateCard}>
            <div className={styles.stateBody}>
              <Spin size="large" tip={t('productDetail.loading')} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { error, productCode, onGoBack, onRetry } = props;
  const resolved = resolveProductDetailError(error, t);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="mx-auto w-[95%] max-w-2xl pt-16">
        <div className={styles.stateCard}>
          <Empty
            className={styles.stateEmpty}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className={styles.stateEmptyDesc}>
                <p className={styles.stateEmptyTitle}>{t(resolved.titleKey)}</p>
                <p className={styles.stateSubTitle}>{t(resolved.descKey)}</p>
                {productCode ? (
                  <p className={styles.stateCode}>
                    {`${t('productDetail.productCodeLabel')}: ${productCode}`}
                  </p>
                ) : null}
              </div>
            }
          >
            <div className={styles.stateActions}>
              <Button
                type="text"
                icon={<ArrowLeft size={16} />}
                className={styles.backBtn}
                onClick={onGoBack}
              >
                {t('productDetail.backToPrevious')}
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<RefreshCw size={16} />}
                loading={retrying}
                onClick={handleRetry}
                className={styles.retryBtn}
              >
                {t('productDetail.retry')}
              </Button>
            </div>
          </Empty>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailStateView;
