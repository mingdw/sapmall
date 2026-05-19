import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const final = `import React from 'react';
import { Button, Empty, Space, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
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

  if (props.mode === 'loading') {
    return (
      <__TAG__ className={styles.page}>
        <__TAG__ className="mx-auto w-[95%] max-w-2xl pt-24">
          <__TAG__ className={\`\${styles.glassCard} \${styles.stateCard}\`}>
            <__TAG__ className={styles.stateBody}>
              <Spin size="large" tip={t('productDetail.loading')} />
            </__TAG__>
          </__TAG__>
        </__TAG__>
      </__TAG__>
    );
  }

  const { error, productCode, onGoBack, onRetry } = props;
  const resolved = resolveProductDetailError(error, t);

  return (
    <__TAG__ className={styles.page}>
      <__TAG__ className="mx-auto w-[95%] max-w-2xl pt-16">
        <__TAG__ className={\`\${styles.glassCard} \${styles.stateCard}\`}>
          <Empty
            className={styles.stateEmpty}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <__TAG__ className={styles.stateEmptyDesc}>
                <p className={styles.stateEmptyTitle}>{t(resolved.titleKey)}</p>
                <p className={styles.stateSubTitle}>{t(resolved.descKey)}</p>
                {productCode ? (
                  <p className={styles.stateCode}>
                    {t('productDetail.productCodeLabel')}: {productCode}
                  </p>
                ) : null}
              </__TAG__>
            }
          >
            <Space direction="vertical" size="middle" className={styles.stateActions}>
              <Button type="link" className={styles.backLink} onClick={onGoBack}>
                {t('productDetail.backToPrevious')}
              </Button>
              <Button icon={<ReloadOutlined />} onClick={onRetry}>
                {t('productDetail.retry')}
              </Button>
            </Space>
          </Empty>
        </__TAG__>
      </__TAG__>
    </__TAG__>
  );
};

export default ProductDetailStateView;
`.replace(/__TAG__/g, 'motionless');

const out = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/pages/marketplace/product/components/ProductDetailStateView.tsx'
);
fs.writeFileSync(out, final);
console.log('ok');
