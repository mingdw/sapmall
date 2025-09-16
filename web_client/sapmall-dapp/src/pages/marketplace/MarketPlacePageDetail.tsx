import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './MarketPlacePageDetail.module.scss';
import { commonApiService } from '../../services/api/commonApiService';
import { productApiService } from '../../services/api/productApiService';
import { CategoryTreeResp, AttrGroupResp } from '../../services/types/categoryTypes';
import { Product, FilterOptions, FILTER_OPTIONS, ProductQueryParams } from '../../services/types/productTypes';
import CategoryButton from './components/CategoryButton';
import AttrGroupFilter from './components/AttrGroupFilter';
import ProductCategoryComponent from '../../components/ProductCategoryCard';
import ProductDetailComponent from '../../components/ProductCard';  
import { useCategoryStore } from '../../store/categoryStore';
import { transformProductForDisplay } from '../../utils/productUtils';

const MarketPlacePageDetail: React.FC = () => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // 改为单选
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    price: [],
    rating: [],
    sales: [],
    time: [],
    type: [],
    seller: [],
    feature: []
  });
  const [attrGroupFilters, setAttrGroupFilters] = useState<{[key: number]: number[]}>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedAttrGroups, setDisplayedAttrGroups] = useState<AttrGroupResp[]>([]);
  const [displayedCategoriesCount, setDisplayedCategoriesCount] = useState(3); // 默认显示前3个分类
  
  // 使用状态管理
  const {
    categories,
    allAttrGroups,
    isLoading,
    setCategories,
    setLoading,
    setLastFetchTime,
    isCacheValid,
    collectAttrGroupsForCategory
  } = useCategoryStore();

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      // 检查缓存是否有效
      if (isCacheValid() && categories.length > 0) {
        console.log('使用缓存的分类数据');
        return;
      }

      try {
        setLoading(true);
        const response = await commonApiService.getCategoryTree(1); // 假设1是商品分类类型
        const categoryList = Array.isArray(response) ? response : [response];
        setCategories(categoryList);
        setLastFetchTime(Date.now());
        console.log('从API获取分类数据并缓存');
      } catch (error) {
        console.error('获取分类失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isCacheValid, categories.length, setCategories, setLoading, setLastFetchTime]);

  // 使用 useMemo 缓存分类相关的计算
  const firstLevelCategories = useMemo(() => {
    return categories.filter(cat => cat.level === 1);
  }, [categories]);

  const selectedCategoryData = useMemo(() => {
    if (selectedCategory === null || selectedCategory === 0) return null;
    return categories.find(cat => cat.id === selectedCategory);
  }, [selectedCategory, categories]);

  // 监听分类选择变化，更新显示的attrGroups
  useEffect(() => {
    const newDisplayedGroups = collectAttrGroupsForCategory(selectedCategory);
    setDisplayedAttrGroups(newDisplayedGroups);
    
    // 清空当前分类不相关的筛选条件
    const currentGroupIds = newDisplayedGroups.map(g => g.id);
    setAttrGroupFilters(prev => {
      const filtered: {[key: number]: number[]} = {};
      Object.keys(prev).forEach(key => {
        const groupId = parseInt(key);
        if (currentGroupIds.includes(groupId)) {
          filtered[groupId] = prev[groupId];
        }
      });
      return filtered;
    });
  }, [selectedCategory, categories]);

  // 使用 useCallback 缓存商品获取函数
  const fetchProducts = useCallback(async () => {
    try {
      let allProducts: Product[] = [];

      if (selectedCategory === null || selectedCategory === 0) {
        // 默认情况：获取前3个1级目录的商品
        const categoriesToFetch = firstLevelCategories.slice(0, 3);
        
        if (categoriesToFetch.length > 0) {
          // 获取每个分类的商品
          const categoryCodes = categoriesToFetch.map(cat => cat.code).join(',');
          
          const queryParams: ProductQueryParams = {
            categoryCodes: categoryCodes,
            page: 1,
            pageSize: 50, // 增加每页数量以获取更多商品
          };

          // 添加搜索条件
          if (searchQuery) {
            queryParams.productName = searchQuery;
          }

          const response = await productApiService.getProducts(queryParams);
          allProducts = response.products.map(transformProductForDisplay);
        }
      } else {
        // 选择特定分类：获取该分类的所有商品
        if (selectedCategoryData) {
          const queryParams: ProductQueryParams = {
            categoryCodes: selectedCategoryData.code,
            page: 1,
            pageSize: 100, // 获取更多商品
          };

          // 添加搜索条件
          if (searchQuery) {
            queryParams.productName = searchQuery;
          }

          const response = await productApiService.getProducts(queryParams);
          allProducts = response.products.map(transformProductForDisplay);
        }
      }

      setProducts(allProducts);
    } catch (error) {
      console.error('获取商品失败:', error);
      setProducts([]);
    }
  }, [selectedCategory, searchQuery, firstLevelCategories, selectedCategoryData]);

  // 获取商品数据
  useEffect(() => {
    // 只有在分类数据加载完成后才获取商品
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categories.length, fetchProducts]);


  // 处理分类选择 - 改为单选
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  // 处理子分类选择
  const handleSubCategorySelect = (categoryId: number, subCategoryId: number) => {
    // 选择子分类时，更新选中的分类ID
    setSelectedCategory(subCategoryId);
    console.log('选择子分类:', categoryId, subCategoryId);
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

  // 处理属性组筛选
  const handleAttrGroupFilter = (groupId: number, attrId: number) => {
    setAttrGroupFilters(prev => ({
      ...prev,
      [groupId]: prev[groupId]?.includes(attrId)
        ? prev[groupId].filter(id => id !== attrId)
        : [...(prev[groupId] || []), attrId]
    }));
  };

  // 清空所有筛选
  const clearAllFilters = () => {
    setSelectedCategory(null); // 重置为全部商品
    setSelectedFilters({
      price: [],
      rating: [],
      sales: [],
      time: [],
      type: [],
      seller: [],
      feature: []
    });
    setAttrGroupFilters({});
    setSearchQuery('');
  };

  // 处理搜索
  const handleSearch = () => {
    // 搜索逻辑将在API实现后添加
    console.log('搜索:', searchQuery);
  };

  // 处理加载更多分类
  const handleLoadMoreCategories = useCallback(() => {
    setDisplayedCategoriesCount(prev => prev + 3);
    
    // 重新获取商品数据以包含更多分类
    const fetchMoreProducts = async () => {
      try {
        const categoriesToFetch = firstLevelCategories.slice(0, displayedCategoriesCount + 3);
        
        if (categoriesToFetch.length > 0) {
          const categoryCodes = categoriesToFetch.map(cat => cat.code).join(',');
          
          const queryParams: ProductQueryParams = {
            categoryCodes: categoryCodes,
            page: 1,
            pageSize: 100,
          };

          if (searchQuery) {
            queryParams.productName = searchQuery;
          }

          const response = await productApiService.getProducts(queryParams);
          const processedProducts = response.products.map(transformProductForDisplay);
          setProducts(processedProducts);
        }
      } catch (error) {
        console.error('获取更多商品失败:', error);
      }
    };

    fetchMoreProducts();
  }, [firstLevelCategories, displayedCategoriesCount, searchQuery]);

  // 处理分类更多按钮点击
  const handleCategoryMoreClick = (categoryId: number) => {
    console.log('查看分类更多商品:', categoryId);
    // TODO: 跳转到分类详情页面或展开更多商品
  };

  // 处理商品点击
  const handleProductClick = (product: Product) => {
    console.log('点击商品:', product);
    // TODO: 跳转到商品详情页面
  };

  // 处理商品购买
  const handleProductBuy = (product: Product) => {
    console.log('购买商品:', product);
    // TODO: 实现购买逻辑
  };

  // 按分类分组商品
  const productsByCategory = products.reduce((acc, product) => {
    // 使用分类编码或分类名称作为分组键
    const categoryKey = product.category || product.categoryName || 'unknown';
    
    // 查找对应的分类ID
    const category = categories.find(cat => 
      cat.code === categoryKey || 
      cat.name === categoryKey || 
      cat.id.toString() === categoryKey
    );
    
    const categoryId = category ? category.id : 0;
    
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {} as {[key: number]: Product[]});

  // 创建"全部商品"选项
  const allProductsCategory = {
    id: 0,
    name: '全部商品',
    icon: 'fas fa-th-large'
  };

  if (isLoading) {
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
                    {/* 全部商品选项 */}
                    <CategoryButton
                      key={allProductsCategory.id}
                      category={allProductsCategory}
                      isActive={selectedCategory === null || selectedCategory === 0}
                      onClick={handleCategorySelect}
                    />
                    
                    {/* 其他分类选项 */}
                    {categories.map((category) => (
                      <CategoryButton
                        key={category.id}
                        category={{
                          id: category.id,
                          name: category.name,
                          icon: category.icon,
                          children: category.children // 使用children结构
                        }}
                        isActive={selectedCategory === category.id}
                        onClick={handleCategorySelect}
                        onSubCategoryClick={handleSubCategorySelect}
                      />
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
                {/* 默认显示前3个attrGroups */}
                {displayedAttrGroups.slice(0, 3).map((attrGroup, index) => {
                  const isLastVisible = !showMoreFilters && index === Math.min(2, displayedAttrGroups.length - 1);
                  const hasSelectedFilters = Object.values(attrGroupFilters).some(attrs => attrs.length > 0);
                  
                  return (
                    <div key={attrGroup.id} className="flex flex-wrap gap-2 items-center justify-between">
                      <AttrGroupFilter
                        attrGroup={attrGroup}
                        selectedAttrs={attrGroupFilters[attrGroup.id] || []}
                        onAttrSelect={handleAttrGroupFilter}
                      />
                      {/* 操作按钮 - 当收起时显示在最后一行右侧 */}
                      {isLastVisible && (
                        <div className="flex gap-2">
                          {/* 只要有筛选就显示清空筛选按钮 */}
                          {hasSelectedFilters && (
                            <button 
                              className={`${styles.clearBtn} px-3 py-1.5 rounded-lg font-medium text-xs`}
                              onClick={clearAllFilters}
                            >
                              <i className="fas fa-trash mr-1"></i>
                              清空筛选
                            </button>
                          )}
                          {/* 筛选行数大于3才显示展开筛选按钮 */}
                          {displayedAttrGroups.length > 3 && (
                            <button 
                              className={`${styles.moreBtn} px-3 py-1.5 rounded-lg font-medium text-xs`}
                              onClick={() => setShowMoreFilters(!showMoreFilters)}
                            >
                              {showMoreFilters ? '收起筛选' : '展开筛选'}
                              <i className={`fas fa-chevron-${showMoreFilters ? 'up' : 'down'} ml-1 text-xs`}></i>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 展开的筛选条件 - 显示剩余的attrGroups */}
                {showMoreFilters && displayedAttrGroups.length > 3 && (
                  <>
                    {displayedAttrGroups.slice(3).map((attrGroup, index) => {
                      const isLastExpanded = index === displayedAttrGroups.slice(3).length - 1;
                      const hasSelectedFilters = Object.values(attrGroupFilters).some(attrs => attrs.length > 0);
                      
                      return (
                        <div key={attrGroup.id} className="flex flex-wrap gap-2 items-center justify-between">
                          <AttrGroupFilter
                            attrGroup={attrGroup}
                            selectedAttrs={attrGroupFilters[attrGroup.id] || []}
                            onAttrSelect={handleAttrGroupFilter}
                          />
                          {/* 操作按钮 - 当展开时显示在最后一个筛选条件右侧 */}
                          {isLastExpanded && (
                            <div className="flex gap-2">
                              {/* 只要有筛选就显示清空筛选按钮 */}
                              {hasSelectedFilters && (
                                <button 
                                  className={`${styles.clearBtn} px-3 py-1.5 rounded-lg font-medium text-xs`}
                                  onClick={clearAllFilters}
                                >
                                  <i className="fas fa-trash mr-1"></i>
                                  清空筛选
                                </button>
                              )}
                              {/* 展开状态下显示收起筛选按钮 */}
                              <button 
                                className={`${styles.moreBtn} px-3 py-1.5 rounded-lg font-medium text-xs`}
                                onClick={() => setShowMoreFilters(false)}
                              >
                                收起筛选
                                <i className="fas fa-chevron-up ml-1 text-xs"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 商品列表展示区域 */}
        <div className="space-y-6">
          {(() => {
            // 根据选中的分类过滤商品
            let displayCategories: Array<{ category: CategoryTreeResp; products: Product[] }> = [];
            
            if (selectedCategory === null || selectedCategory === 0) {
              // 默认情况：显示指定数量的1级分类的商品
              const categoriesToShow = firstLevelCategories.slice(0, displayedCategoriesCount);
              displayCategories = categoriesToShow.map(category => {
                const categoryProducts = productsByCategory[category.id] || [];
                return { category, products: categoryProducts };
              }).filter(item => item.products.length > 0); // 只显示有商品的分类
            } else {
              // 只显示选中的分类
              if (selectedCategoryData) {
                const categoryProducts = productsByCategory[selectedCategory] || [];
                displayCategories = [{ category: selectedCategoryData, products: categoryProducts }];
              }
            }

            return displayCategories.map(({ category, products }) => (
              <ProductCategoryComponent
                key={category.id}
                categoryId={category.id}
                categoryName={category.name}
                categoryCode={category.code}
                categoryIcon={category.icon}
                productCount={products.length}
                products={products}
                onMoreClick={handleCategoryMoreClick}
                onProductClick={handleProductClick}
                onProductBuy={handleProductBuy}
                maxDisplayCount={10} // 2行5列
                showMoreButton={true}
              />
            ));
          })()}

          {/* 空状态 */}
          {products.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                <i className="fas fa-search text-4xl mb-4 block"></i>
                <p>暂无商品数据</p>
                <p className="text-sm mt-2">请稍后再试或联系管理员</p>
              </div>
            </div>
          )}

          {/* 加载更多类别链接 - 只在有更多分类时显示 */}
          {selectedCategory === null || selectedCategory === 0 ? (
            (() => {
              const hasMoreCategories = firstLevelCategories.length > 3;
              
              return hasMoreCategories ? (
                <div className="flex justify-center">
                  <button 
                    onClick={handleLoadMoreCategories}
                    className={`${styles.loadMoreCategoriesLink}`}
                  >
                    <span>加载更多类别</span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
              ) : null;
            })()
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MarketPlacePageDetail;