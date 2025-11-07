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
import Pagination from '../../components/Pagination';
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
  const [searchQuery, setSearchQuery] = useState(''); // 实际用于搜索的查询词
  const [searchInput, setSearchInput] = useState(''); // 搜索输入框的值
  const [displayedAttrGroups, setDisplayedAttrGroups] = useState<AttrGroupResp[]>([]);
  const [displayedCategoriesCount, setDisplayedCategoriesCount] = useState(3); // 默认显示前3个分类
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 每页显示10个商品
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
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
        const response = await commonApiService.getCategoryTree(0); // 0表示商品分类类型
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

  // 递归查找分类数据（包括子分类）
  const findCategoryById = useCallback((categories: CategoryTreeResp[], targetId: number): CategoryTreeResp | null => {
    for (const category of categories) {
      if (category.id === targetId) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(category.children, targetId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  const selectedCategoryData = useMemo(() => {
    if (selectedCategory === null || selectedCategory === 0) return null;
    return findCategoryById(categories, selectedCategory);
  }, [selectedCategory, categories, findCategoryById]);

  // 监听分类选择变化，更新显示的attrGroups
  useEffect(() => {
    const newDisplayedGroups = collectAttrGroupsForCategory(selectedCategory);
    // 过滤条件：
    // 1. 只显示状态为0（启用）的属性组
    // 2. 属性组必须有属性（attrs不为空）
    // 3. 属性组至少有一个启用状态的属性（status === 0）
    const filteredGroups = newDisplayedGroups.filter(
      group => {
        // 检查属性组状态
        if (group.status !== 0) {
          return false; // 只显示启用状态的属性组（0=启用，1=禁用）
        }
        // 检查属性组是否有属性
        if (!group.attrs || !Array.isArray(group.attrs) || group.attrs.length === 0) {
          return false;
        }
        // 检查是否至少有一个启用状态的属性
        const hasEnabledAttr = group.attrs.some(attr => attr.status === 0);
        return hasEnabledAttr;
      }
    );
    setDisplayedAttrGroups(filteredGroups);
    
    // 清空当前分类不相关的筛选条件
    const currentGroupIds = filteredGroups.map(g => g.id);
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
  }, [selectedCategory, categories, collectAttrGroupsForCategory]);

  // 使用 useCallback 缓存商品获取函数
  const fetchProductsWithQuery = useCallback(async (query: string, page: number = currentPage, resetPage: boolean = false) => {
    try {
      setIsLoadingProducts(true);
      
      if (resetPage) {
        setCurrentPage(1);
        page = 1;
      }

      let categoryCodes = '';
      
      if (selectedCategory === null || selectedCategory === 0) {
        // 全部商品：不传categoryCodes或传空字符串
        categoryCodes = '';
      } else {
        // 选择特定分类：传递分类编码
        if (selectedCategoryData) {
          categoryCodes = selectedCategoryData.code;
        }
      }

      const queryParams: ProductQueryParams = {
        categoryCodes: categoryCodes,
        productName: query, // 使用传入的查询参数
        page: page,
        pageSize: pageSize,
      };

      console.log('商品查询参数:', queryParams);
      console.log('当前状态 - selectedCategory:', selectedCategory, 'searchQuery:', query);

      const response = await productApiService.getProducts(queryParams);
      const processedProducts = response.products.map(transformProductForDisplay);
      
      setProducts(processedProducts);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error('获取商品失败:', error);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [selectedCategory, currentPage, pageSize, selectedCategoryData]);

  const fetchProducts = useCallback(async (page: number = currentPage, resetPage: boolean = false) => {
    // 调用fetchProductsWithQuery，使用当前的searchQuery
    return fetchProductsWithQuery(searchQuery, page, resetPage);
  }, [fetchProductsWithQuery, searchQuery]);

  // 获取商品数据的统一逻辑
  useEffect(() => {
    if (categories.length === 0) return; // 分类数据未加载时不执行

    if (selectedCategory === null || selectedCategory === 0) {
      // 全部商品：获取前几个分类的商品数据
      const fetchInitialProducts = async () => {
        try {
          const categoriesToFetch = firstLevelCategories.slice(0, displayedCategoriesCount);
          
          if (categoriesToFetch.length > 0) {
            const categoryCodes = categoriesToFetch.map(cat => cat.code).join(',');
            
            const queryParams: ProductQueryParams = {
              categoryCodes: categoryCodes,
              page: 1,
              pageSize: 100, // 获取每个分类的前100个商品用于展示
            };

            if (searchQuery) {
              queryParams.productName = searchQuery;
            }

            console.log('获取初始分类商品:', {
              categoriesToFetch: categoriesToFetch.map(cat => ({ id: cat.id, name: cat.name, code: cat.code })),
              categoryCodes,
              searchQuery
            });

            const response = await productApiService.getProducts(queryParams);
            const processedProducts = response.products.map(transformProductForDisplay);
            setProducts(processedProducts);
            setTotalItems(response.total || 0);
          }
        } catch (error) {
          console.error('获取初始商品失败:', error);
          setProducts([]);
          setTotalItems(0);
        }
      };

      fetchInitialProducts();
    } else {
      // 选择特定分类：使用分页逻辑
      fetchProducts(currentPage, false);
    }
  }, [categories.length, selectedCategory, displayedCategoriesCount, searchQuery, currentPage, pageSize]); // 合并所有依赖


  // 处理分类选择 - 改为单选
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // 清空搜索条件
    setSearchQuery('');
    setSearchInput('');
    // 重置到第一页
    setCurrentPage(1);
  };

  // 处理子分类选择
  const handleSubCategorySelect = (categoryId: number, subCategoryId: number) => {
    // 选择子分类时，更新选中的分类ID
    setSelectedCategory(subCategoryId);
    // 清空搜索条件
    setSearchQuery('');
    setSearchInput('');
    // 重置到第一页
    setCurrentPage(1);
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
    // 将输入框的值设置为搜索查询词
    setSearchQuery(searchInput);
    // 搜索时重置到第一页，并立即触发搜索
    // 使用searchInput而不是searchQuery，因为状态更新是异步的
    setTimeout(() => {
      fetchProductsWithQuery(searchInput, 1, true);
    }, 0);
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 处理每页条数变化
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理加载更多分类
  const handleLoadMoreCategories = useCallback(async () => {
    const newDisplayedCount = displayedCategoriesCount + 3;
    setDisplayedCategoriesCount(newDisplayedCount);
    
    // 获取新显示的分类的商品数据
    const fetchNewCategoriesProducts = async () => {
      try {
        // 获取新显示的分类（从当前显示数量到新的显示数量）
        const newCategories = firstLevelCategories.slice(displayedCategoriesCount, newDisplayedCount);
        
        if (newCategories.length > 0) {
          const categoryCodes = newCategories.map(cat => cat.code).join(',');
          
          const queryParams: ProductQueryParams = {
            categoryCodes: categoryCodes,
            page: 1,
            pageSize: 100, // 获取每个分类的前100个商品用于展示
          };

          if (searchQuery) {
            queryParams.productName = searchQuery;
          }

          console.log('加载更多分类:', {
            newCategories: newCategories.map(cat => ({ id: cat.id, name: cat.name, code: cat.code })),
            categoryCodes,
            searchQuery
          });

          const response = await productApiService.getProducts(queryParams);
          const newProcessedProducts = response.products.map(transformProductForDisplay);
          
          // 将新商品数据添加到现有数据中
          setProducts(prevProducts => {
            // 合并现有商品和新商品，去重
            const existingProductIds = new Set(prevProducts.map(p => p.id));
            const uniqueNewProducts = newProcessedProducts.filter(p => !existingProductIds.has(p.id));
            return [...prevProducts, ...uniqueNewProducts];
          });
        }
      } catch (error) {
        console.error('获取更多分类商品失败:', error);
      }
    };

    await fetchNewCategoriesProducts();
  }, [firstLevelCategories, displayedCategoriesCount, searchQuery]);

  // 处理分类更多按钮点击
  const handleCategoryMoreClick = (categoryId: number) => {
    console.log('查看分类更多商品:', categoryId);
    // 设置选中的分类并重置分页和搜索条件
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setSearchQuery(''); // 清空搜索条件
    setSearchInput(''); // 清空搜索输入框
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

  // 按分类分组商品和商品总数
  const productsByCategory = products.reduce((acc, product) => {
    // 使用商品的分类信息
    const categoryId = (product as any).categoryId || 0;
    
    if (!acc[categoryId]) {
      acc[categoryId] = {
        products: [],
        totalCount: (product as any).categoryProductCount || 0
      };
    }
    acc[categoryId].products.push(product);
    return acc;
  }, {} as {[key: number]: {products: Product[], totalCount: number}});

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
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
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
                  // 再次检查属性组状态和属性（防御性编程）
                  // 注意：0=启用，1=禁用，只显示启用状态的属性组和属性
                  if (
                    attrGroup.status !== 0 || 
                    !attrGroup.attrs || 
                    !Array.isArray(attrGroup.attrs) || 
                    attrGroup.attrs.length === 0 ||
                    !attrGroup.attrs.some(attr => attr.status === 0) // 至少有一个启用状态的属性
                  ) {
                    return null;
                  }
                  
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
                      // 再次检查属性组状态和属性（防御性编程）
                      // 注意：0=启用，1=禁用，只显示启用状态的属性组和属性
                      if (
                        attrGroup.status !== 0 || 
                        !attrGroup.attrs || 
                        !Array.isArray(attrGroup.attrs) || 
                        attrGroup.attrs.length === 0 ||
                        !attrGroup.attrs.some(attr => attr.status === 0) // 至少有一个启用状态的属性
                      ) {
                        return null;
                      }
                      
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
            if (selectedCategory === null || selectedCategory === 0) {
              // 如果有搜索条件，显示"全部商品"分类卡片
              if (searchQuery) {
                return (
                  <ProductCategoryComponent
                    key="all-products-search"
                    categoryId={0}
                    categoryName="全部商品"
                    categoryCode=""
                    categoryIcon="fas fa-search"
                    productCount={totalItems}
                    products={products}
                    onMoreClick={() => {
                      setSearchQuery('');
                      setSearchInput('');
                    }}
                    onProductClick={handleProductClick}
                    onProductBuy={handleProductBuy}
                    maxDisplayCount={pageSize}
                    showMoreButton={true}
                    showPagination={true}
                    paginationProps={{
                      currentPage,
                      totalPages: Math.ceil(totalItems / pageSize),
                      totalItems,
                      itemsPerPage: pageSize,
                      onPageChange: handlePageChange,
                      onPageSizeChange: handlePageSizeChange,
                      isLoading: isLoadingProducts
                    }}
                  />
                );
              }

              // 没有搜索条件时：显示分类卡片形式
              const categoriesToShow = firstLevelCategories.slice(0, displayedCategoriesCount);
              const displayCategories = categoriesToShow.map(category => {
                const categoryData = productsByCategory[category.id];
                const categoryProducts = categoryData ? categoryData.products : [];
                const categoryTotalCount = categoryData ? categoryData.totalCount : 0;
                return { category, products: categoryProducts, totalCount: categoryTotalCount };
              }).filter(item => item.products.length > 0);

              return (
                <>
                  {displayCategories.map(({ category, products, totalCount }) => (
                    <ProductCategoryComponent
                      key={category.id}
                      categoryId={category.id}
                      categoryName={category.name}
                      categoryCode={category.code}
                      categoryIcon={category.icon}
                      productCount={totalCount}
                      products={products}
                      onMoreClick={handleCategoryMoreClick}
                      onProductClick={handleProductClick}
                      onProductBuy={handleProductBuy}
                      maxDisplayCount={10} // 2行5列
                      showMoreButton={true}
                      showPagination={false}
                    />
                  ))}

                  {/* 加载更多类别链接 */}
                  {firstLevelCategories.length > displayedCategoriesCount && (
                    <div className="flex justify-center">
                      <button 
                        onClick={handleLoadMoreCategories}
                        className={`${styles.loadMoreCategoriesLink}`}
                      >
                        <span>加载更多类别</span>
                        <i className="fas fa-chevron-down"></i>
                      </button>
                    </div>
                  )}
                </>
              );
            } else {
              // 选择特定分类：只显示该分类的分页商品，其他分类隐藏
              if (selectedCategoryData) {
                return (
                  <ProductCategoryComponent
                    key={`selected-${selectedCategory}`}
                    categoryId={selectedCategory}
                    categoryName={selectedCategoryData.name}
                    categoryCode={selectedCategoryData.code}
                    categoryIcon={selectedCategoryData.icon}
                    productCount={totalItems}
                    products={products}
                    onMoreClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                      setSearchInput('');
                    }} // 点击返回商城按钮
                    onProductClick={handleProductClick}
                    onProductBuy={handleProductBuy}
                    maxDisplayCount={pageSize} // 使用分页大小
                    showMoreButton={true}
                    showPagination={true} // 显示分页
                    paginationProps={{
                      currentPage,
                      totalPages: Math.ceil(totalItems / pageSize),
                      totalItems,
                      itemsPerPage: pageSize,
                      onPageChange: handlePageChange,
                      onPageSizeChange: handlePageSizeChange,
                      isLoading: isLoadingProducts
                    }}
                  />
                );
              }
              return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default MarketPlacePageDetail;