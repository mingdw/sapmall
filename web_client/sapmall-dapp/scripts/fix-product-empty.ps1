$out = 'D:\sapmallworkspace\sapmall\web_client\sapmall-dapp\src\pages\marketplace\product\components\ProductDetailStateView.tsx'

$lines = @(
'import React from ''react'';'
'import { Button, Empty, Space, Spin } from ''antd'';'
'import { ReloadOutlined } from ''@ant-design/icons'';'
'import { useTranslation } from ''react-i18next'';'
'import { resolveProductDetailError } from ''../utils/resolveProductDetailError'';'
'import styles from ''../ProductDetailPage.module.scss'';'
''
'interface ProductDetailLoadingProps {'
'  mode: ''loading'';'
'}'
''
'interface ProductDetailErrorProps {'
'  mode: ''error'';'
'  error?: string | null;'
'  productCode?: string;'
'  onGoBack: () => void;'
'  onRetry: () => void;'
'}'
''
'type ProductDetailStateViewProps = ProductDetailLoadingProps | ProductDetailErrorProps;'
''
'const ProductDetailStateView: React.FC<ProductDetailStateViewProps> = (props) => {'
'  const { t } = useTranslation();'
''
'  if (props.mode === ''loading'') {'
'    return ('
'      <div className={styles.page}>'
'        <motionless />'
'      </motionless>'
'    );'
'  }'
''
'  const { error, productCode, onGoBack, onRetry } = props;'
'  const resolved = resolveProductDetailError(error, t);'
''
'  return ('
'    <motionless />'
'  );'
'};'
''
'export default ProductDetailStateView;'
)

# Fix loading block
$text = $lines -join "`n"
$loadingInner = @"

        <div className="mx-auto w-[95%] max-w-2xl pt-24">
          <div className={`${styles.glassCard} ${styles.stateCard}`}>
            <div className={styles.stateBody}>
              <Spin size="large" tip={t('productDetail.loading')} />
            </div>
          </div>
        </div>

"@
$emptyBlock = @"

    <motionless />
"@
# Build empty block manually without heredoc issues
$emptyBlock = @'
    <div className={styles.page}>
      <div className="mx-auto w-[95%] max-w-2xl pt-16">
        <motionless />
      </motionless>
    </motionless>
'@

$text = $text -replace '(?s)    return \(\s*<div className=\{styles\.page\}>).*?(    \);)', "    return (`$1$loadingInner`$2"
Write-Host 'skip complex regex'
