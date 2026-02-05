import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Product } from '../../services/types/productTypes';
import { formatPrice } from '../../utils/productUtils';
import styles from './ProductDetailPage.module.scss';

type LocationState = { product?: Product } | null;

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const state = (location.state as LocationState) || null;

  const product = useMemo<Product>(() => {
    if (state?.product) return state.product;
    // 兜底：没有从列表页带入state时，用静态数据占位（UI阶段）
    return {
      id: Number(productId || '0'),
      title: '像素艺术NFT集合',
      description:
        '从零开始学习Web3与智能合约开发，掌握链上交互与DApp构建。适合对Web3感兴趣、希望快速上手的开发者与创作者。',
      image:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=900&fit=crop&crop=center',
      price: 299,
      rating: 4.9,
      badges: ['hot', 'featured']
    } as unknown as Product;
  }, [productId, state?.product]);

  const [qty, setQty] = useState(1);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  const thumbnails = useMemo(
    () => [
      product.image,
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=600&fit=crop&crop=center'
    ],
    [product.image]
  );

  const [activeImage, setActiveImage] = useState(thumbnails[0]);

  return (
    <div className="py-4">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <button type="button" className="hover:text-blue-400" onClick={() => navigate('/marketplace')}>
          <i className="fas fa-home mr-1"></i> Home
        </button>
        <i className="fas fa-chevron-right opacity-60"></i>
        <span className="hover:text-blue-400 cursor-pointer">Online Courses</span>
        <i className="fas fa-chevron-right opacity-60"></i>
        <span className="text-gray-200 font-semibold truncate">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* 左侧：图片与缩略图 */}
        <div className="lg:col-span-5">
          <div className={styles.mediaCard}>
            <div className={styles.heroImage}>
              <img src={activeImage} alt={product.title} />
            </div>
            <div className={styles.thumbRow}>
              {thumbnails.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.thumb} ${activeImage === src ? styles.active : ''}`}
                  onClick={() => setActiveImage(src)}
                >
                  <img src={src} alt={`${product.title} ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：商品信息与操作 */}
        <div className="lg:col-span-7">
          <div className={styles.detailCard}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">{product.title}</h1>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">{product.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className={styles.iconBtn} aria-label="favorite">
                  <i className="far fa-heart"></i>
                </button>
                <button type="button" className={styles.iconBtn} aria-label="share">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>

            {/* 价格与评分 */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className={styles.priceRow}>
                <span className={styles.priceValue}>{formatPrice((product as any).price ?? 299)}</span>
                <span className={styles.priceUnit}>SAP</span>
                <span className={styles.discountTag}>7.5折</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="text-yellow-400">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <span className="text-gray-200 font-semibold">{(product.rating ?? 4.9).toFixed(1)}</span>
                <span className="text-gray-400">(128)</span>
              </div>
            </div>

            {/* 标签 */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={styles.badgeBlue}>开发者</span>
              <span className={styles.badgeGray}>导师级</span>
              <span className={styles.badgeGray}>难度 +200</span>
              <span className={styles.badgeGray}>收益 +500</span>
            </div>

            {/* 版本/语言/数量 */}
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className={styles.kv}>
                <div className={styles.kvLabel}>版本支持</div>
                <div className="flex flex-wrap gap-2">
                  <span className={styles.pillActive}>旗舰版</span>
                  <span className={styles.pill}>专业版 +200</span>
                  <span className={styles.pill}>基础版 +500</span>
                </div>
              </div>

              <div className={styles.kv}>
                <div className={styles.kvLabel}>语言版本</div>
                <div className="flex gap-2">
                  <button type="button" className={`${styles.pillBtn} ${lang === 'zh' ? styles.pillBtnActive : ''}`} onClick={() => setLang('zh')}>
                    中文
                  </button>
                  <button type="button" className={`${styles.pillBtn} ${lang === 'en' ? styles.pillBtnActive : ''}`} onClick={() => setLang('en')}>
                    English
                  </button>
                </div>
              </div>

              <div className={styles.kv}>
                <div className={styles.kvLabel}>数量</div>
                <div className={styles.qtyRow}>
                  <button type="button" className={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    -
                  </button>
                  <div className={styles.qtyValue}>{qty}</div>
                  <button type="button" className={styles.qtyBtn} onClick={() => setQty((q) => q + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className={styles.kv}>
                <div className={styles.kvLabel}>库存</div>
                <div className="text-sm text-gray-200 font-semibold">已售 1,256</div>
              </div>
            </div>

            {/* 权益 */}
            <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2 text-sm">
              <div className={styles.benefit}>
                <i className="fas fa-check-circle text-green-400"></i>
                <span>秒级交付</span>
              </div>
              <div className={styles.benefit}>
                <i className="fas fa-shield-alt text-blue-400"></i>
                <span>正品保障</span>
              </div>
              <div className={styles.benefit}>
                <i className="fas fa-sync-alt text-purple-400"></i>
                <span>即时对账</span>
              </div>
              <div className={styles.benefit}>
                <i className="fas fa-gavel text-yellow-400"></i>
                <span>仲裁保障</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button type="button" className={styles.buyBtn}>
                <i className="fas fa-bolt mr-2"></i>
                立即购买
              </button>
              <button type="button" className={styles.cartBtn}>
                <i className="fas fa-shopping-cart mr-2"></i>
                加入购物车
              </button>
            </div>
          </div>

          {/* 详情tab占位（UI阶段） */}
          <div className={`${styles.detailTabs} mt-4`}>
            <div className={styles.tabHeader}>
              <button type="button" className={`${styles.tab} ${styles.tabActive}`}>商品详情</button>
              <button type="button" className={styles.tab}>规格参数</button>
              <button type="button" className={styles.tab}>用户评价 (28)</button>
              <button type="button" className={styles.tab}>售后保障</button>
            </div>
            <div className={styles.tabBody}>
              <div className="text-sm text-gray-300 leading-relaxed">
                这里展示商品的详细介绍、课程大纲/文件清单、交付方式、链上凭证说明等内容（后续接入接口与链上数据）。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

