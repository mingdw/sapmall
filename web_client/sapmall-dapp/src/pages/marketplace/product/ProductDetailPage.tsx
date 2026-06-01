import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Breadcrumb, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import ProductGallery from './components/ProductGallery';
import ProductBuyBox from './components/ProductBuyBox';
import ProductTabs from './components/ProductTabs';
import RelatedProductsSection from './components/RelatedProductsSection';
import ProductDetailStateView from './components/ProductDetailStateView';
import { useProductDetail, useRelatedProducts } from './hooks/useProductDetail';
import { useSkuMatrix } from './hooks/useSkuMatrix';
import { ProductDetailLocationState } from './types/productDetailTypes';
import { buildProductBreadcrumbItems } from './utils/buildProductBreadcrumb';
import { navigateToMarketplace } from '../paths';
import { useCategoryStore } from '../../../store/categoryStore';
import { useCategoryTreeRefresh } from '../hooks/useCategoryTreeRefresh';
import { cartApi } from '../../../services/api/cartApi';
import { favoriteApi } from '../../../services/api/favoriteApi';
import { isTrustedProductImageUrl, resolveProductImageList } from '../../../utils/productImageUrls';
import { redirectToAdmin } from '../../../utils/redirectToAdmin';
import styles from './ProductDetailPage.module.scss';

const ProductDetailPage: React.FC = () => {
  const { productCode: productCodeParam } = useParams<{ productCode: string }>();
  const productCode = productCodeParam
    ? decodeURIComponent(productCodeParam)
    : undefined;
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isConnected } = useAccount();
  const state = (location.state || {}) as ProductDetailLocationState;

  const { product, loading, error, reload } = useProductDetail(productCode);

  const { categories } = useCategoryStore();

  useCategoryTreeRefresh();

  const breadcrumbItems = useMemo(() => {
    if (!product) return [];
    return buildProductBreadcrumbItems(
      product.spu,
      categories,
      t('productDetail.breadcrumbHome')
    );
  }, [product, categories, t]);

  const sku = useSkuMatrix(product);
  const { items: relatedItems, loading: relatedLoading } = useRelatedProducts(
    product?.spu.category1Code,
    product?.spu.code
  );

  const [isFavorited, setIsFavorited] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.buyIntent && product && buyBoxRef.current) {
      buyBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.buyIntent, product]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const { spu } = product;
    const seed = spu.id || spu.code;
    const category3 = spu.category3Code;

    const skuTrusted = (sku.selectedSku?.images ?? []).filter((url) =>
      isTrustedProductImageUrl(url),
    );
    const spuResolved = resolveProductImageList(spu.images, seed, category3);

    if (skuTrusted.length) {
      const merged = [...skuTrusted];
      spuResolved.forEach((url) => {
        if (!merged.includes(url)) merged.push(url);
      });
      return merged;
    }

    return spuResolved;
  }, [product, sku.selectedSku]);

  const handleAddToCart = async (quantity: number) => {
    if (!product || !sku.selectedSku) return;
    setCartLoading(true);
    try {
      const result = await cartApi.addToCart({
        productId: product.spu.id,
        productCode: product.spu.code,
        skuId: sku.selectedSku.id,
        skuCode: sku.selectedSku.skuCode,
        quantity,
        price: sku.selectedSku.price,
        specSnapshot: sku.selectedSpecs,
      });
      if (result.success) {
        message.success(t('productDetail.addedToCart'));
        redirectToAdmin('cart');
      } else {
        message.error(result.message || t('productDetail.addCartFailed'));
      }
    } catch {
      message.error(t('productDetail.addCartFailed'));
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = (quantity: number) => {
    if (!isConnected) {
      message.warning(t('productDetail.connectWalletFirst'));
      return;
    }
    if (!product || !sku.selectedSku) return;
    const params = new URLSearchParams({
      skuId: String(sku.selectedSku.id),
      quantity: String(quantity),
      productCode: product.spu.code,
    });
    navigate(`/marketplace/payment?${params.toString()}`);
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
    const payload = { productId: product.spu.id, productCode: product.spu.code };
    if (isFavorited) {
      await favoriteApi.removeFavorite(payload);
      setIsFavorited(false);
      message.info(t('productDetail.removedFavorite'));
    } else {
      await favoriteApi.addFavorite(payload);
      setIsFavorited(true);
      message.success(t('productDetail.addedFavorite'));
    }
  };

  if (loading) {
    return <ProductDetailStateView mode="loading" />;
  }

  if (error || !product) {
    const handleGoBack = () => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/marketplace');
      }
    };
    return (
      <ProductDetailStateView
        mode="error"
        error={error}
        productCode={productCode}
        onGoBack={handleGoBack}
        onRetry={reload}
      />
    );
  }
  return (
    <div className={styles.page}>
      <div className="mx-auto w-[95%] max-w-7xl pt-6">
        <Breadcrumb
          className={styles.breadcrumb}
          items={breadcrumbItems.map((item) => ({
            title: item.clickable ? (
              <span
                role="button"
                tabIndex={0}
                className={styles.breadcrumbLink}
                onClick={() =>
                  navigateToMarketplace(navigate, {
                    selectedCategoryId: item.categoryId,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigateToMarketplace(navigate, {
                      selectedCategoryId: item.categoryId,
                    });
                  }
                }}
              >
                {item.label}
              </span>
            ) : (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            ),
          }))}
        />
        <div className={`${styles.glassCard} p-6 mt-4`}>
          <div className={styles.mainGrid}>
            <div className={styles.galleryColumn}>
              <ProductGallery images={galleryImages} alt={product.spu.name} />
            </div>
            <div ref={buyBoxRef} className={styles.buyBoxColumn}>
              <ProductBuyBox
                product={product}
                specKeys={sku.specKeys}
                selectedSpecs={sku.selectedSpecs}
                selectedSku={sku.selectedSku}
                canPurchase={sku.canPurchase}
                purchaseBlockReason={sku.purchaseBlockReason}
                onSelectSpec={sku.onSelectSpec}
                isSpecValueAvailable={sku.isSpecValueAvailable}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isFavorited={isFavorited}
                onToggleFavorite={handleToggleFavorite}
                cartLoading={cartLoading}
              />
            </div>
          </div>
          <ProductTabs product={product} />
        </div>
        <RelatedProductsSection items={relatedItems} loading={relatedLoading} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
