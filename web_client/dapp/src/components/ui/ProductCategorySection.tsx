import React from 'react';
// import { useTranslation } from 'react-i18next';
// import '../../style/marketplace.css'
export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  badges?: string[];
}

interface ProductCategorySectionProps {
  title: string;
  iconClass: string;
  gradientFrom: string;
  gradientTo: string;
  count: number;
  products: Product[];
}

const badgeColor = (badge: string) => {
  if (badge.includes('热')) return 'bg-red-500';
  if (badge.includes('新')) return 'bg-green-500';
  if (badge.includes('精品')) return 'bg-purple-500';
  if (badge.includes('艺术')) return 'bg-pink-500';
  if (badge.includes('实战')) return 'bg-blue-500';
  if (badge.includes('投资')) return 'bg-yellow-500';
  if (badge.includes('安全')) return 'bg-blue-400';
  if (badge.includes('史诗')) return 'bg-indigo-500';
  if (badge.includes('传奇')) return 'bg-orange-500';
  if (badge.includes('神话')) return 'bg-emerald-500';
  return 'bg-sapphire-500';
};

const ProductCategorySection: React.FC<ProductCategorySectionProps> = ({
  title,
  iconClass,
  gradientFrom,
  gradientTo,
  count,
  products,
}) => {
  // const { t } = useTranslation();
  return (
    <section className="category-main-card mb-8">
      <div className="category-main-header flex items-center justify-between mb-4">
        <div className="category-main-title flex items-center gap-3">
          <div className={`category-main-icon w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
            <i className={`${iconClass} text-white text-lg`} />
          </div>
          <div className="category-main-info">
            <h3 className="text-lg font-bold">{title}</h3>
            <span className="category-item-count text-xs text-gray-400">{count}个商品</span>
          </div>
        </div>
        <button className="category-more-btn flex items-center gap-1 text-sapphire-400 hover:underline text-sm font-medium">
          <span>更多</span>
          <i className="fas fa-arrow-right" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className="product-card bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl group"
          >
            <div className="relative product-image-container overflow-hidden h-40 rounded-t-2xl">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
              />
              {product.badges && (
                <div className="product-badges absolute top-2 left-2 flex gap-1 z-10">
                  {product.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className={`product-badge px-2 py-0.5 rounded text-xs text-white font-semibold shadow ${badgeColor(badge)}`}
                    >
                      {badge}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col product-content">
              <h4 className="font-bold mb-1 product-title text-base text-white truncate">{product.title}</h4>
              <p className="text-xs text-gray-400 flex-1 product-description mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-2 product-meta">
                <span className="text-sapphire-400 font-extrabold text-lg product-price">{product.price}</span>
                <span className="flex items-center text-yellow-400 text-sm product-rating font-semibold"><i className="fas fa-star mr-1" />{product.rating}</span>
              </div>
              <button
                className="w-full mt-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 ease-in-out hover:from-indigo-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-sapphire-400 focus:ring-offset-2 border-none backdrop-blur-md"
                style={{
                  textTransform: 'none',
                  letterSpacing: '0.025em',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 3,
                }}
              >
                立即购买
                {/* {t('buyNow')} */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCategorySection; 