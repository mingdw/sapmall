import React, { useState, useEffect } from 'react';
import styles from './MarketPlacePageDetail.module.scss';
import { commonApiService } from '../../services/api/commonApiService';
import { CategoryTreeResp } from '../../services/types/categoryTypes';
import { Product, FilterOptions, FILTER_OPTIONS } from '../../services/types/productTypes';

const MarketPlacePageDetail: React.FC = () => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    price: [],
    rating: [],
    sales: [],
    time: [],
    type: [],
    seller: [],
    feature: []
  });
  const [categories, setCategories] = useState<CategoryTreeResp[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await commonApiService.getCategoryTree(1); // 假设1是商品分类类型
        // 修复：response 本身就是 CategoryTreeResp 类型，不需要 .data
        setCategories(Array.isArray(response) ? response : [response]);
      } catch (error) {
        console.error('获取分类失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 获取商品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // TODO: 实现商品API接口
        // const response = await productApiService.getProducts({
        //   categoryIds: selectedCategories,
        //   filters: selectedFilters,
        //   search: searchQuery
        // });
        // setProducts(response);
        
        // 临时空数据，等待API实现
        setProducts([]);
      } catch (error) {
        console.error('获取商品失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, selectedFilters, searchQuery]);

  // 处理分类选择
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 处理筛选标签
  const handleFilterSelect = (filterType: keyof FilterOptions, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value) 
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  // 清空所有筛选
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedFilters({
      price: [],
      rating: [],
      sales: [],
      time: [],
      type: [],
      seller: [],
      feature: []
    });
    setSearchQuery('');
  };

  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑将在API实现后添加
    console.log('搜索:', searchQuery);
  };

  // 按分类分组商品
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.categoryId]) {
      acc[product.categoryId] = [];
    }
    acc[product.categoryId].push(product);
    return acc;
  }, {} as {[key: number]: Product[]});

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* 主容器 - 修改为全宽度，与导航栏保持一致 */}
      <div className="w-full px-6 py-4">
        {/* 商品筛选区域 */}
        <div className="mb-6">
          <div className={`${styles.filterCard} rounded-xl p-4`}>
            {/* 商品目录筛选 */}
            <div className="mb-2">
              <div className="flex flex-wrap items-start justify-between">
                <div className="flex flex-wrap gap-2 items-start flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-400 flex-shrink-0 w-[68px] h-[36px] flex items-center">
                    商品目录
                  </span>
                  
                  {/* 筛选按钮区域 */}
                  <div className="flex flex-wrap gap-2 items-center flex-1">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`${styles.categoryItem} px-3 py-2 rounded-lg font-medium cursor-pointer relative ${
                          selectedCategories.includes(category.id) ? styles.active : ''
                        }`}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <i className={`${category.icon} ${styles.categoryIcon} text-blue-400`} style={{ fontSize: '0.875rem' }}></i>
                            <span className="text-sm font-medium">{category.name}</span>
                            {category.attrGroups && category.attrGroups.length > 0 && (
                              <i className="fas fa-chevron-down text-xs opacity-50 ml-1"></i>
                            )}
                          </div>
                          <span className={`${styles.categoryCount} rounded-full`}>
                            {/* TODO: 从API获取商品数量 */}
                            0
                          </span>
                        </div>
                        
                        {/* 下拉菜单 */}
                        {category.attrGroups && category.attrGroups.length > 0 && (
                          <div className={`${styles.dropdownMenu} absolute top-full left-0 mt-2 rounded-lg shadow-lg min-w-[160px] z-50`}>
                            <div className="py-2">
                              {category.attrGroups.map((attrGroup) => (
                                <a 
                                  key={attrGroup.id}
                                  href="#" 
                                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                                >
                                  {attrGroup.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 搜索框 */}
                <div className="flex-shrink-0 ml-6 flex items-center">
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                      <input 
                        type="text" 
                        placeholder="搜索商品..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className={`${styles.searchInput} w-72 pl-9 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-sapphire-500 focus:outline-none focus:bg-gray-700 transition-all text-sm`}
                      />
                    </div>
                    <button 
                      onClick={handleSearch}
                      className="bg-sapphire-600 hover:bg-sapphire-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                    >
                      筛选商品
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="border-t border-gray-600 my-4"></div>

            {/* 其他筛选条件 */}
            <div>
              <div className="space-y-3 relative">
                {/* 价格范围 */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-medium text-gray-400 min-w-[50px]">价格</span>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_OPTIONS.PRICE.map((price) => (
                        <button
                          key={price}
                          className={`${styles.filterTag} px-2.5 py-1 rounded-md text-xs ${
                            selectedFilters.price.includes(price) ? styles.active : ''
                          }`}
                          onClick={() => handleFilterSelect('price', price)}
                        >
                          {price}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 评分 */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-medium text-gray-400 min-w-[50px]">评分</span>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_OPTIONS.RATING.map((rating) => (
                        <button
                          key={rating}
                          className={`${styles.filterTag} px-2.5 py-1 rounded-md text-xs ${
                            selectedFilters.rating.includes(rating) ? styles.active : ''
                          }`}
                          onClick={() => handleFilterSelect('rating', rating)}
                        >
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 销量 */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-medium text-gray-400 min-w-[50px]">销量</span>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_OPTIONS.SALES.map((sales) => (
                        <button
                          key={sales}
                          className={`${styles.filterTag} px-2.5 py-1 rounded-md text-xs ${
                            selectedFilters.sales.includes(sales) ? styles.active : ''
                          }`}
                          onClick={() => handleFilterSelect('sales', sales)}
                        >
                          {sales}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button 
                      className={`${styles.clearBtn} px-3 py-1.5 rounded-lg font-medium text-xs`}
                      onClick={clearAllFilters}
                    >
                      <i className="fas fa-trash mr-1"></i>
                      清空筛选
                    </button>
                    <button 
                      className={`${styles.moreBtn} px-3 py-1.5 rounded-lg font-medium text-xs`}
                      onClick={() => setShowMoreFilters(!showMoreFilters)}
                    >
                      {showMoreFilters ? '收起筛选' : '展开筛选'}
                      <i className={`fas fa-chevron-${showMoreFilters ? 'up' : 'down'} ml-1 text-xs`}></i>
                    </button>
                  </div>
                </div>

                {/* 展开的筛选条件 */}
                {showMoreFilters && (
                  <div className="space-y-3">
                    {/* 发布时间 */}
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-medium text-gray-400 min-w-[50px]">时间</span>
                        <div className="flex flex-wrap gap-2">
                          {FILTER_OPTIONS.TIME.map((time) => (
                            <button
                              key={time}
                              className={`${styles.filterTag} px-2.5 py-1 rounded-md text-xs ${
                                selectedFilters.time.includes(time) ? styles.active : ''
                              }`}
                              onClick={() => handleFilterSelect('time', time)}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 商品类型 */}
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-medium text-gray-400 min-w-[50px]">类型</span>
                        <div className="flex flex-wrap gap-2">
                          {FILTER_OPTIONS.TYPE.map((type) => (
                            <button
                              key={type}
                              className={`${styles.filterTag} px-2.5 py-1 rounded-md text-xs ${
                                selectedFilters.type.includes(type) ? styles.active : ''
                              }`}
                              onClick={() => handleFilterSelect('type', type)}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 商家信誉 */}
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-medium text-gray-400 min-w-[50px]">商家</span>
                        <div className="flex flex-wrap gap-2">
                          {FILTER_OPTIONS.SELLER.map((seller) => (
                            <button
                              key={seller}
                              className={`${styles.filterTag} px-2.5 py-1 rounded-md text-xs ${
                                selectedFilters.seller.includes(seller) ? styles.active : ''
                              }`}
                              onClick={() => handleFilterSelect('seller', seller)}
                            >
                              {seller}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 特色标签 */}
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-medium text-gray-400 min-w-[50px]">特色</span>
                        <div className="flex flex-wrap gap-2">
                          {FILTER_OPTIONS.FEATURE.map((feature) => (
                            <button
                              key={feature}
                              className={`${styles.filterTag} px-2.5 py-1 rounded-md text-xs ${
                                selectedFilters.feature.includes(feature) ? styles.active : ''
                              }`}
                              onClick={() => handleFilterSelect('feature', feature)}
                            >
                              {feature}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 商品列表展示区域 */}
        <div className="space-y-6">
          {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
            const category = categories.find(cat => cat.id === parseInt(categoryId));
            if (!category) return null;

            return (
              <div key={categoryId} className={`${styles.categoryMainCard}`}>
                <div className={`${styles.categoryMainHeader}`}>
                  <div className={`${styles.categoryMainTitle}`}>
                    <div className={`${styles.categoryMainIcon} bg-gradient-to-br from-blue-500 to-indigo-600`}>
                      <i className={category.icon}></i>
                    </div>
                    <div className={`${styles.categoryMainInfo}`}>
                      <h3>{category.name}</h3>
                      <span className={`${styles.categoryItemCount}`}>
                        {categoryProducts.length}个商品
                      </span>
                    </div>
                  </div>
                  <button className={`${styles.categoryMoreBtn}`}>
                    <span>更多</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
                
                {/* 商品网格 */}
                <div className="grid grid-cols-5 gap-4">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className={`${styles.productCard}`}>
                      <div className={`${styles.productImageContainer}`}>
                        <img src={product.image} alt={product.title} className={`${styles.productImage}`} />
                        <div className={`${styles.productBadges}`}>
                          {product.badges.map((badge, badgeIndex) => (
                            <div key={badgeIndex} className={`${styles.productBadge} ${styles[badge.toLowerCase()]}`}>
                              {badge}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={`${styles.productContent}`}>
                        <h4 className={`${styles.productTitle}`}>{product.title}</h4>
                        <p className={`${styles.productDescription}`}>{product.description}</p>
                        <div className={`${styles.productMeta}`}>
                          <span className={`${styles.productPrice}`}>{product.price}</span>
                          <div className={`${styles.productRating}`}>
                            <i className="fas fa-star star"></i>
                            <span className={`${styles.ratingText}`}>{product.rating}</span>
                          </div>
                        </div>
                        <button className={`${styles.buyBtn}`}>立即购买</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 空状态 */}
          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                <i className="fas fa-search text-4xl mb-4 block"></i>
                <p>暂无商品数据</p>
                <p className="text-sm mt-2">请稍后再试或联系管理员</p>
              </div>
            </div>
          )}

          {/* 加载更多类别链接 */}
          <div className="flex justify-center">
            <a href="#" className={`${styles.loadMoreCategoriesLink}`}>
              <span>加载更多类别</span>
              <i className="fas fa-chevron-down"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlacePageDetail;