import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  Card,
  Row,
  Col,
  Image,
  Tag,
  Button,
  InputNumber,
  message,
  Tabs,
  Rate,
  List,
  Space,
  Avatar,
  Spin,
  Empty
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  RightOutlined,
  LeftOutlined,
  SafetyOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { 
  getProductDetail, 
  type Product,
  type ProductSku,
  getProductList,
  type CategoryProduct
} from '../../api/apiService';

import styles from './ProductDetail.module.scss';
import type { TabsProps } from 'antd';
import ProductCard from '../../components/ProductCard';

interface NestedAttrs {
  [key: string]: string | string[] | number | boolean | NestedAttrs;
}

interface ParsedAttr {
  key: string;
  value: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [isCollected, setIsCollected] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
  const [activeTab, setActiveTab] = useState('detail');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const tabsRef = useRef<HTMLDivElement>(null);

  // 为每个 tab 创建独立的 ref
  const detailTabRef = useRef<HTMLDivElement>(null);
  const specsTabRef = useRef<HTMLDivElement>(null);
  const serviceTabRef = useRef<HTMLDivElement>(null);
  const reviewsTabRef = useRef<HTMLDivElement>(null);

  // 从路由状态中获取分类和商品数据以及总数
  const categories = location.state?.categories || [];
  const categoryProducts = location.state?.categoryProducts || [];
  const totalCategoryProductCount = location.state?.totalCategoryProductCount || 0;
  
  const { 
    data: product, 
    isLoading: productLoading,
    error: productError,
    refetch: refetchProduct 
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        if (!id) return null;
        return await getProductDetail({ 
          productId: Number(id), 
          productCode: '' 
        });
      } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
      }
    },
  });

  const parsedAttributes = useMemo(() => {
    try {
      const parseJsonSafely = (jsonString: string | null | undefined) => {
        if (!jsonString) return {};
        try {
          return JSON.parse(jsonString);
        } catch {
          return {};
        }
      };

      return {
        basicAttrs: parseJsonSafely(product?.productSpuAttrParams?.basicAttrs),
        saleAttrs: parseJsonSafely(product?.productSpuAttrParams?.saleAttrs),
        specAttrs: parseJsonSafely(product?.productSpuAttrParams?.specAttrs)
      };
    } catch (error) {
      console.error('解析商品属性失败:', error);
      return {
        basicAttrs: {},
        saleAttrs: {},
        specAttrs: {}
      };
    }
  }, [product?.productSpuAttrParams]);

  const categoryInfo = useMemo(() => {
    if (!product || !categories || !Array.isArray(categories) || categories.length === 0) {
      return {
        category1: null,
        category2: null,
        category3: null
      };
    }

    const category1 = categories.find((c: { code: string; }) => c.code === product.productSpu?.category1Code);
    const category2 = category1?.children?.find((c: { code: string; }) => c.code === product.productSpu?.category2Code);
    const category3 = category2?.children?.find((c: { code: string; }) => c.code === product.productSpu?.category3Code);

    return {
      category1,
      category2,
      category3
    };
  }, [product, categories]);

  const breadcrumbItems = useMemo(() => {
    if (!product || !categories || !Array.isArray(categories)) return [];

    const items = [
      {
        title: (
          <span onClick={() => navigate('/mall')} className={styles.breadcrumbLink}>
            全部商品
          </span>
        ),
      }
    ];

    if (product.productSpu?.category1Code) {
      const category1 = categories.find((c: { code: string; }) => c.code === product.productSpu.category1Code);
      const category2 = category1?.children?.find((c: { code: string; }) => c.code === product.productSpu.category2Code);
      const category3 = category2?.children?.find((c: { code: string; }) => c.code === product.productSpu.category3Code);

      if (category1) {
        items.push({
          title: (
            <span 
              onClick={() => navigate(`/mall?category=${category1.code}&scroll=true`)} 
              className={styles.breadcrumbLink}
            >
              {category1.name}
            </span>
          ),
        });
      }

      if (category2) {
        items.push({
          title: (
            <span 
              onClick={() => navigate(`/mall?category=${category2.code}&scroll=true`)} 
              className={styles.breadcrumbLink}
            >
              {category2.name}
            </span>
          ),
        });
      }

      if (category3) {
        items.push({
          title: (
            <span 
              onClick={() => navigate(`/mall?category=${category3.code}&scroll=true`)} 
              className={styles.breadcrumbLink}
            >
              {category3.name}
            </span>
          ),
        });
      }
    }

    if (product?.productSpu.name) {
      items.push({
        title: <span className={styles.currentItem}>{product.productSpu.name}</span>,
      });
    }

    return items;
  }, [categories, product, navigate]);

  // 修改相关商品逻辑
  const fetchRelatedProducts = useCallback(async () => {
    if (!product?.productSpu?.category1Code) return;
    
    try {
      setLoadingRelated(true);
      
      // 如果有传递总数，且有足够的同类商品，直接使用
      if (totalCategoryProductCount > 0 && categoryProducts.length > 0) {
        const filteredProducts = categoryProducts.filter(
          (p: { id: number; }) => p.id !== product.productSpu.id
        );
        setRelatedProducts(filteredProducts.slice(0, 8));
        // 使用 API 返回的总数减1
        setCategoryProductsCount(totalCategoryProductCount - 1);
        return;
      }
      
      // 否则，通过API获取同类商品
      const relatedData = await getProductList({
        categoryCodes: product.productSpu.category1Code,
        productName: '',
        page: 1,
        pageSize: 9 // 多获取一个，以便过滤当前商品后仍有8个
      });
      
      if (relatedData?.categories && relatedData.categories.length > 0) {
        const allRelatedProducts = relatedData.categories
          .filter((cat: CategoryProduct) => cat.products !== null)
          .flatMap((cat: CategoryProduct) => cat.products || []);
        
        // 过滤掉当前商品
        const filteredProducts = allRelatedProducts.filter(
          (p: Product) => p.id !== product.productSpu.id
        );
        
        setRelatedProducts(filteredProducts.slice(0, 8));
        
        // 从API响应中获取该分类的总商品数
        const categoryData = relatedData.categories.find(
          (cat: CategoryProduct) => cat.categoryCode === product.productSpu.category1Code
        );
        
        if (categoryData) {
          // 使用API返回的总数减1
          setCategoryProductsCount(categoryData.productCount - 1);
        } else {
          // 如果找不到分类数据，使用过滤后的数量
          setCategoryProductsCount(filteredProducts.length);
        }
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    } finally {
      setLoadingRelated(false);
    }
  }, [product?.productSpu?.id, product?.productSpu?.category1Code, categoryProducts, totalCategoryProductCount]);

  // 添加状态来存储分类商品总数
  const [categoryProductsCount, setCategoryProductsCount] = useState(0);

  // 修改useEffect，调用获取相关商品的函数
  useEffect(() => {
    if (product?.productSpu?.id) {
      fetchRelatedProducts();
    }
  }, [product?.productSpu?.id, fetchRelatedProducts]);

  useEffect(() => {
    if (product?.productSpu.category1Code && categoryProducts.length > 0) {
      // 过滤掉当前商品
      const filteredProducts = categoryProducts.filter(
        (p: { id: number; }) => p.id !== product.productSpu.id
      );
      // 限制最多显示 8 件推荐商品
      setRelatedProducts(filteredProducts.slice(0, 8));
    }
  }, [product?.productSpu.category1Code, categoryProducts]);

  useEffect(() => {
    if (product?.productSku?.length) {
      try {
        // 找出销量最高的 SKU
        const defaultSku = product.productSku.reduce((prev, current) => {
          return (prev.saleCount || 0) > (current.saleCount || 0) ? prev : current;
        });

        if (defaultSku) {
          setSelectedSku(defaultSku);
          
          // 如果有规格属性，根据 indexs 设置选中状态
          if (product.productSpuAttrParams?.specAttrs && defaultSku.indexs) {
            const specAttrs = JSON.parse(product.productSpuAttrParams.specAttrs);
            const indexes = defaultSku.indexs.split('_').map(Number);
            const initialSpecs: Record<string, string> = {};
            
            Object.keys(specAttrs).forEach((key, i) => {
              const values = specAttrs[key];
              if (Array.isArray(values) && typeof indexes[i] === 'number') {
                initialSpecs[key] = values[indexes[i]];
              }
            });
            
            setSelectedSpecs(initialSpecs);
          }
        }
      } catch (error) {
        console.error('初始化规格选择失败:', error);
      }
    }
  }, [product]);

  useEffect(() => {
    if (productError) {
      message.error('获取商品详情失败');
    }
  }, [productError]);

  useEffect(() => {
    if (product?.productSpuAttrParams?.specAttrs) {
      try {
        const specAttrs = JSON.parse(product.productSpuAttrParams.specAttrs);
        const initialSpecs: Record<string, string> = {};
        
        Object.entries(specAttrs).forEach(([key, values]) => {
          if (Array.isArray(values) && values.length > 0) {
            initialSpecs[key] = values[0];
          }
        });
        
        setSelectedSpecs(initialSpecs);
        
        const matchingSku = product.productSku?.find(sku => {
          if (!sku.indexs) return true; // 如果没有 indexs，说明是默认 SKU
          
          // 将 indexs 字符串转换为数组
          const indexArray = sku.indexs.split('_').map(Number);
          
          // 按顺序检查每个规格是否匹配
          return Object.entries(initialSpecs).every(([key, value], index) => {
            const specValues = specAttrs[key];
            return specValues[indexArray[index]] === value;
          });
        });
        
        if (matchingSku) {
          setSelectedSku(matchingSku);
        }
      } catch (error) {
        console.error('初始化规格选择失败:', error);
      }
    }
  }, [product?.productSpuAttrParams?.specAttrs, product?.productSku]);

  // 修改生成 indexs 的工具函数
  const generateSkuIndexs = (specs: Record<string, string>, specAttrs: Record<string, string[]>): string => {
    if (Object.keys(specs).length === 0) return '';
    
    // 按照键名排序，确保生成的 indexs 顺序一致
    const sortedKeys = Object.keys(specAttrs).sort();
    const indexes = sortedKeys.map(key => {
      const values = specAttrs[key];
      const selectedValue = specs[key];
      const index = values.indexOf(selectedValue);
      return index === -1 ? 0 : index; // 如果找不到对应的值，默认使用 0
    });
    
    return indexes.join('_');
  };

  // 修改规格切换处理函数
  const handleSpecChange = useCallback((specKey: string, specValue: string) => {
    if (!product?.productSku || !product.productSpuAttrParams?.specAttrs) return;
    
    try {
      const specAttrs = JSON.parse(product.productSpuAttrParams.specAttrs);
      const newSelectedSpecs = {
        ...selectedSpecs,
        [specKey]: specValue
      };
      setSelectedSpecs(newSelectedSpecs);
      
      // 生成新选择的规格组合的 indexs
      const newIndexs = generateSkuIndexs(newSelectedSpecs, specAttrs);
      
      // 通过 indexs 快速匹配 SKU
      const matchingSku = product.productSku.find(sku => {
        // 处理空字符串的情况
        if (!sku.indexs && newIndexs === '') return true;
        return sku.indexs === newIndexs;
      });
      
      if (matchingSku) {
        setSelectedSku(matchingSku);
        // 如果当前数量超过新 SKU 的库存，调整数量
        if (quantity > matchingSku.stock) {
          setQuantity(matchingSku.stock);
        }
      }
    } catch (error) {
      console.error('规格切换失败:', error);
    }
  }, [product?.productSku, product?.productSpuAttrParams?.specAttrs, selectedSpecs, quantity]);
  

  // 修改初始 SKU 选择逻辑
  useEffect(() => {
    if (product?.productSpuAttrParams?.specAttrs && product.productSku?.length) {
      try {
        const specAttrs = JSON.parse(product.productSpuAttrParams.specAttrs);
        
        // 初始化选择第一个可用的 SKU 的规格组合
        const firstAvailableSku = product.productSku.find(sku => sku.stock > 0) || product.productSku[0];
        
        if (firstAvailableSku) {
          // 处理空字符串的情况
          if (!firstAvailableSku.indexs) {
            // 如果没有 indexs，使用第一个规格值
            const initialSpecs: Record<string, string> = {};
            Object.keys(specAttrs).forEach(key => {
              const values = specAttrs[key];
              if (Array.isArray(values) && values.length > 0) {
                initialSpecs[key] = values[0];
              }
            });
            setSelectedSpecs(initialSpecs);
          } else {
            // 从 indexs 还原规格选择
            const indexes = firstAvailableSku.indexs.split('_').map(Number);
            const initialSpecs: Record<string, string> = {};
            
            Object.keys(specAttrs).forEach((key, i) => {
              const values = specAttrs[key];
              if (Array.isArray(values) && typeof indexes[i] === 'number') {
                initialSpecs[key] = values[indexes[i]] || values[0];
              }
            });
            
            setSelectedSpecs(initialSpecs);
          }
          setSelectedSku(firstAvailableSku);
        }
      } catch (error) {
        console.error('初始化规格选择失败:', error);
      }
    }
  }, [product?.productSpuAttrParams?.specAttrs, product?.productSku]);

  const handleCategoryClick = useCallback((categoryCode: string) => {
    if (!categoryCode) return;
    navigate(`/mall/category/${categoryCode}`);
  }, [navigate]);

  // 修改推荐商品点击处理函数，传递总数
  const handleRecommendClick = useCallback(async (productId: number) => {
    setCurrentImage(0);
    setSelectedSku(null);
    setActiveTab('detail');
    
    // 在导航时传递categories数据和总数
    navigate(`/mall/product/${productId}`, { 
      replace: true,
      state: {
        categories: categories,
        categoryProducts: categoryProducts,
        totalCategoryProductCount: totalCategoryProductCount // 保持总数不变
      }
    });
  }, [navigate, categories, categoryProducts, totalCategoryProductCount]);

  useEffect(() => {
    if (!id) {
      navigate('/mall');
      return;
    }
  }, [id, navigate]);

  const formatEthAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const mockReviews = [
    {
      id: 1,
      user: {
        address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=1"
      },
      rating: 5,
      date: "2024-03-15",
      content: "商品质量非常好，包装也很完整，物流速度快，很满意的一次购物体验！",
      images: [
        "https://picsum.photos/400/400?random=1",
        "https://picsum.photos/400/400?random=2",
        "https://picsum.photos/400/400?random=3"
      ],
      specs: "规格：标准版 | 颜色：深空灰"
    },
    {
      id: 2,
      user: {
        address: "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=2"
      },
      rating: 4,
      date: "2024-03-14",
      content: "商品不错，性价比很高，就是发货稍微有点慢。整体来说还是很满意的购物体验，会继续关注店铺的其他商品。",
      images: [],
      specs: "规格：豪华版 | 颜色：银色"
    },
    {
      id: 3,
      user: {
        address: "0x8d3B5AD5c4795c026514f8317c7a215E218DcCD6",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=3"
      },
      rating: 5,
      date: "2024-03-13",
      content: "第二次购买了，一如既往的好，客服态度也很好，发货速度快，物流给力！",
      images: [
        "https://picsum.photos/400/400?random=4"
      ],
      specs: "规格：标准版 | 颜色：银色"
    }
  ];

  const renderBasicAttributes = () => {
    const { basicAttrs } = parsedAttributes;
    if (!basicAttrs || Object.keys(basicAttrs).length === 0) return null;
    
    return (
      <div className={styles.basicAttrs}>
        {Object.values(basicAttrs)
          .filter((value): value is string => Boolean(value))
          .map((value, index) => (
            <Tag 
              key={index}
              className={styles.basicAttrTag}
            >
              {value}
            </Tag>
          ))}
      </div>
    );
  };

  // 修改规格渲染函数
  const renderSaleAttributes = () => {
    const { specAttrs } = parsedAttributes;
    if (!specAttrs || Object.keys(specAttrs).length === 0) return null;

    return (
      <div className={styles.specifications}>
        {Object.entries(specAttrs).map(([key, values]) => {
          if (!Array.isArray(values) || values.length === 0) return null;
          return (
            <div key={key} className={styles.specGroup}>
              <span className={styles.specLabel}>{key}：</span>
              <div className={styles.specOptions}>
                {values.map((value, index) => {
                  if (!value) return null;
                  
                  // 生成当前规格组合的 indexs
                  const tempSpecs = { ...selectedSpecs, [key]: value };
                  const tempIndexs = generateSkuIndexs(tempSpecs, specAttrs);
                  
                  // 检查是否有对应的 SKU 且有库存
                  const matchingSku = product?.productSku && Array.isArray(product.productSku) 
                    ? product.productSku.find(sku => sku.indexs === tempIndexs)
                    : null;
                  const isOutOfStock = matchingSku && matchingSku.stock <= 0;
                  const isSelected = selectedSpecs[key] === value;
                  
                  return (
                    <Tag
                      key={value}
                      className={`${styles.specOption} 
                        ${isSelected ? styles.selected : ''} 
                        ${isOutOfStock ? styles.disabled : ''}`}
                      onClick={() => !isOutOfStock && handleSpecChange(key, value)}
                    >
                      {value}
                      {isOutOfStock && <span className={styles.outOfStock}>已售罄</span>}
                    </Tag>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderNestedAttrs = (
    attrs: NestedAttrs,
    prefix = ''
  ): ParsedAttr[] => {
    if (!attrs || typeof attrs !== 'object') return [];
    
    return Object.entries(attrs).flatMap(([key, value]): ParsedAttr[] => {
      // 如果值是对象且不是数组，递归处理
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return renderNestedAttrs(value as NestedAttrs, prefix ? `${prefix}-${key}` : key);
      }
      
      // 处理各种可能的值类型
      let displayValue: string;
      if (Array.isArray(value)) {
        displayValue = value.join('、');
      } else if (value === null || value === undefined) {
        displayValue = '';
      } else {
        displayValue = String(value);
      }
      
      return [{
        key: prefix ? `${prefix}-${key}` : key,
        value: displayValue
      }];
    });
  };

  const renderSpecsTab = () => (
    <div className={styles.specsContent}>
      {/* 规格参数 */}
      <div className={styles.specSection}>
        <h3 className={styles.sectionTitle}>规格参数</h3>
        <table className={styles.specTable}>
          <tbody>
            {/* 基础属性 */}
            {renderNestedAttrs(parsedAttributes.basicAttrs).map(({ key, value }: { key: string; value: string }) => (
              <tr key={`basic-${key}`}>
                <td className={styles.specLabel}>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
            
            {/* 销售属性 */}
            {renderNestedAttrs(parsedAttributes.saleAttrs).map(({ key, value }: { key: string; value: string }) => (
              <tr key={`sale-${key}`}>
                <td className={styles.specLabel}>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
            
            {/* 当前选中 SKU 的规格 */}
            {selectedSku && Object.entries(selectedSpecs).map(([key, value]) => (
              <tr key={`spec-${key}`}>
                <td className={styles.specLabel}>{key}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 包装清单 */}
      <div className={styles.packingSection}>
        <h3 className={styles.sectionTitle}>包装清单</h3>
        {product?.productSpuDetail?.packingList ? (
          <div 
            className={styles.packingContent}
            dangerouslySetInnerHTML={{ __html: product.productSpuDetail.packingList }}
          />
        ) : (
          <Empty 
            className={styles.emptyPacking}
            description="暂无包装清单信息" 
          />
        )}
      </div>
    </div>
  );

  const renderDetailTab = () => (
    <div className={styles.detailContent}>
      {/* 基本属性展示 */}
      {product?.productSpuAttrParams?.basicAttrs && (
        <div className={styles.basicAttributesWrapper}>
          <div className={styles.basicAttributes}>
            {Object.entries(JSON.parse(product.productSpuAttrParams.basicAttrs))
              .filter(([_, value]) => value) // 过滤掉空值
              .map(([key, value], index) => (
                <div key={index} className={styles.attributeItem}>
                  <span className={styles.attrKey}>{key}：</span>
                  <span className={styles.attrValue}>{value as string}</span>
                </div>
              ))}
          </div>
          <div className={styles.viewMoreWrapper}>
            <span 
              className={styles.viewMore}
              onClick={() => setActiveTab('specs')}
            >
              查看更多参数 <RightOutlined />
            </span>
          </div>
        </div>
      )}

      {/* 商品详情展示 */}
      {product?.productSpuDetail?.detail ? (
        <div 
          className={styles.detailHtml}
          dangerouslySetInnerHTML={{ __html: product.productSpuDetail.detail }} 
        />
      ) : (
        <Empty 
          className={styles.emptyDetail}
          description="暂无商品详情" 
        />
      )}
    </div>
  );

  const productImages = useMemo(() => {
    if (selectedSku?.images) {
      const skuImages = selectedSku.images.split(',').filter(Boolean);
      return skuImages.length > 0 ? skuImages : product?.productSpu.images || [];
    }
    return product?.productSpu.images || [];
  }, [selectedSku, product?.productSpu.images]);

  useEffect(() => {
    setCurrentImage(0);
  }, [selectedSku]);

  // 修改价格展示组件
  const renderPrice = () => (
    <div className={styles.priceBlock}>
      <div className={styles.priceRow}>
        <span className={styles.priceLabel}>价格</span>
        <div className={styles.priceWrapper}>
          {product?.productSku?.length ? (
            // 有 SKU 时显示选中 SKU 的价格
            <span className={styles.price}>
              <span className={styles.symbol}>¥</span>
              {selectedSku?.price.toFixed(2) || product.productSpu.realPrice.toFixed(2)}
            </span>
          ) : (
            // 无 SKU 时显示 SPU 价格
            <span className={styles.price}>
              <span className={styles.symbol}>¥</span>
              {product?.productSpu.realPrice.toFixed(2)}
            </span>
          )}
          {selectedSku && product?.productSpu.price && selectedSku.price !== product.productSpu.price && (
            <span className={styles.originalPrice}>
              ¥{product.productSpu.price.toFixed(2)}
            </span>
          )}
        </div>
        <div className={styles.stockInfo}>
          <span className={styles.infoItem}>
            库存: {product?.productSku?.length ? (selectedSku?.stock ?? '-') : (product?.productSpu.totalStock ?? '-')}
          </span>
          <span className={styles.divider}>|</span>
          <span className={styles.infoItem}>
            月销: {product?.productSku?.length ? (selectedSku?.saleCount ?? '-') : (product?.productSpu.totalSales ?? '-')}
          </span>
        </div>
      </div>
    </div>
  );

  const handleCollect = () => {
    setIsCollected(!isCollected);
    message.success(isCollected ? '已取消收藏' : '收藏成功');
  };

  const handleShare = () => {
    message.success('分享链接已复制到剪贴板');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoom) return;
    
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setMousePosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const renderTitle = () => (
    <div className={styles.titleRow}>
      <h1 className={styles.title}>
        {selectedSku?.title || product?.productSpu.name}
        {selectedSku?.subTitle && (
          <span className={styles.subTitle}>{selectedSku.subTitle}</span>
        )}
      </h1>
      {renderBasicAttributes()}
    </div>
  );

  const renderProductImages = () => (
    <div className={styles.imageWrapper}>
      <div className={styles.mainImageContainer}>
        <div 
          ref={imageRef}
          className={styles.imageBox}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={productImages[currentImage]}
            alt={selectedSku?.title || product?.productSpu.name}
            className={styles.mainImage}
            preview={false}
          />
        </div>
        {showZoom && (
          <div className={styles.zoomContainer}>
            <div 
              className={styles.zoomImage}
              style={{
                backgroundImage: `url(${productImages[currentImage]})`,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`
              }}
            />
          </div>
        )}
      </div>
      
      {productImages.length > 1 && (
        <div className={styles.thumbnailContainer}>
          <Button 
            className={styles.navButton} 
            icon={<LeftOutlined />}
            onClick={() => {
              const container = document.querySelector(`.${styles.thumbnailScroll}`);
              if (container) {
                container.scrollLeft -= 80;
              }
            }}
          />
          <div className={styles.thumbnailScroll}>
            {productImages.map((image: string, index: number) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${currentImage === index ? styles.active : ''}`}
                onClick={() => setCurrentImage(index)}
              >
                <Image
                  src={image}
                  alt={`缩略图${index + 1}`}
                  preview={false}
                />
              </div>
            ))}
          </div>
          <Button 
            className={styles.navButton} 
            icon={<RightOutlined />}
            onClick={() => {
              const container = document.querySelector(`.${styles.thumbnailScroll}`);
              if (container) {
                container.scrollLeft += 80;
              }
            }}
          />
        </div>
      )}
    </div>
  );

  const renderSummary = () => (
    <div className={styles.summary}>
      {selectedSku?.description || product?.productSpu.description}
    </div>
  );

  const renderServicePromise = () => (
    <div className={styles.servicePromise}>
      <div className={styles.promiseItem}>
        <CheckCircleOutlined />
        <span>企业认证</span>
      </div>
      <div className={styles.promiseItem}>
        <SafetyOutlined />
        <span>正品保障</span>
      </div>
    </div>
  );

  const renderPurchaseSection = () => (
    <div className={styles.purchaseSection}>
      <div className={styles.quantitySection}>
        <div className={styles.quantityRow}>
          <div className={styles.quantityLeft}>
            <span className={styles.quantityLabel}>数量</span>
            <InputNumber
              min={1}
              max={product?.productSku?.length ? (selectedSku?.stock || 0) : (product?.productSpu?.totalStock || 0)}
              value={quantity}
              onChange={(value) => {
                const newValue = value || 1;
                const maxStock = product?.productSku?.length ? 
                  (selectedSku?.stock || 0) : 
                  (product?.productSpu.totalStock || 0);
                setQuantity(Math.min(newValue, maxStock));
              }}
              className={styles.quantityInput}
              disabled={product?.productSku?.length ? 
                (!selectedSku || selectedSku.stock <= 0) : 
                (!product?.productSpu?.totalStock || product.productSpu.totalStock <= 0)}
            />
          </div>
        </div>
      </div>
      <div className={styles.actionButtons}>
        <Space direction="horizontal" size={40}>
          <Button
            type="primary"
            size="middle"
            icon={<ShoppingCartOutlined />}
            onClick={handleBuyNow}
            disabled={product?.productSku?.length ? 
              (!selectedSku || selectedSku.stock <= 0) : 
              (!product?.productSpu?.totalStock || product.productSpu.totalStock <= 0)}
            className={styles.exchangeButton}
          >
            {product?.productSku?.length ? (
              !selectedSku ? '请选择规格' : 
              selectedSku.stock <= 0 ? '已售罄' : '立即兑换'
            ) : (
              (!product?.productSpu?.totalStock || product.productSpu.totalStock <= 0) ? '已售罄' : '立即兑换'
            )}
          </Button>

          <Button
            type="text"
            size="middle"
            icon={isCollected ? <HeartFilled className={styles.collected} /> : <HeartOutlined />}
            onClick={handleCollect}
            className={styles.iconButton}
          />

          <Button
            type="text"
            size="middle"
            icon={<ShareAltOutlined />}
            onClick={handleShare}
            className={styles.iconButton}
          />
        </Space>
      </div>
    </div>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'detail',
      label: '商品详情',
      children: (
        <div ref={detailTabRef} className={styles.tabContent}>
          {renderDetailTab()}
        </div>
      )
    },
    {
      key: 'specs',
      label: '规格与包装',
      children: (
        <div ref={specsTabRef} className={styles.tabContent}>
          {renderSpecsTab()}
        </div>
      )
    },
    {
      key: 'service',
      label: '售后保障',
      children: (
        <div ref={serviceTabRef} className={styles.tabContent}>
          <div className={styles.serviceContent}>
            <div className={styles.serviceItem}>
              <h4><SafetyOutlined /> 厂家服务</h4>
              <p>本产品全国联保，享受三包服务</p>
            </div>
            
            <div className={styles.serviceItem}>
              <h4><CheckCircleOutlined /> 正品保证</h4>
              <p>商城向您保证所售商品均为正品行货</p>
            </div>
            
            <div className={styles.guaranteeInfo}>
              <h4>权益保障</h4>
              <ul>
                <li>商品自签收后7天内可申请无理由退换货</li>
                <li>在线支付购买商品，支持7天无理由退换货</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'reviews',
      label: (
        <span className={styles.reviewsTab}>
          商品评价
          <span className={styles.reviewCount}>({product?.reviews?.length || 0})</span>
        </span>
      ),
      children: (
        <div ref={reviewsTabRef} className={styles.tabContent}>
          <div className={styles.reviewsContent}>
            <div className={styles.reviewsSummary}>
              <div className={styles.overallRating}>
                <div className={styles.ratingScore}>
                  {(() => {
                    const reviews = product?.reviews || mockReviews;
                    if (!reviews.length) return "5.0";
                    return (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1);
                  })()}
                </div>
                <div className={styles.ratingStars}>
                  <Rate 
                    disabled 
                    defaultValue={Number((product?.reviews || mockReviews)
                      .reduce((acc, review) => acc + review.rating, 0) / 
                      (product?.reviews?.length || mockReviews.length) || 5)} 
                    allowHalf 
                  />
                  <div className={styles.ratingCount}>
                    共 <span>{product?.reviews?.length || mockReviews.length}</span> 条评价
                  </div>
                </div>
              </div>
            </div>

            <List
              className={styles.reviewsList}
              itemLayout="vertical"
              dataSource={product?.reviews || mockReviews}
              renderItem={(review) => (
                <List.Item className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.userInfo}>
                      <Avatar src={review.user.avatar} size={40} />
                      <div className={styles.userMeta}>
                        <span className={styles.userName}>
                          {formatEthAddress(review.user.address)}
                        </span>
                        <Rate disabled defaultValue={review.rating} />
                      </div>
                    </div>
                    <div className={styles.reviewDate}>{review.date}</div>
                  </div>
                  <div className={styles.reviewSpecs}>{review.specs}</div>
                  <div className={styles.reviewContent}>{review.content}</div>
                  {review.images.length > 0 && (
                    <div className={styles.reviewImages}>
                      <Image.PreviewGroup>
                        {review.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            width={100}
                            height={100}
                            className={styles.reviewImage}
                          />
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  )}
                </List.Item>
              )}
            />
          </div>
        </div>
      )
    },
  ];

  const handleAddToCart = () => {
    message.success('已加入购物车');
  };

  const handleBuyNow = () => {
    if (!id) {
      message.error('商品ID不能为空');
      return;
    }

    // 判断是否有 SKU
    if (product?.productSku?.length) {
      // 有 SKU 时的逻辑
      if (!selectedSku) {
        message.warning('请选择商品规格');
        return;
      }
      if (selectedSku.stock <= 0) {
        message.warning('该规格商品已售罄');
        return;
      }
    } else {
      // 无 SKU 时直接判断 SPU 库存
      if (!product?.productSpu?.totalStock || product.productSpu.totalStock <= 0) {
        message.warning('商品已售罄');
        return;
      }
    }
    
    // 更新跳转路径
    navigate(`/mall/order/confirm/${id}`, {
      state: {
        quantity: quantity,
        selectedSku: selectedSku,
        product: product
      }
    });
  };

  // 修改推荐商品区域的标题显示
  const renderRecommendTitle = () => {
    const categoryName = categoryInfo.category1?.name || '同类商品';
    return (
      <div className={styles.recommendTitle}>
        <div className={styles.titleLeft}>
          <span className={styles.mainTitle}>{categoryName}推荐</span>
          <span className={styles.subTitle}>
            共 {categoryProductsCount} 件商品
          </span>
        </div>
        {categoryProductsCount > 8 && (
          <Button 
            type="link" 
            onClick={() => navigate(`/mall?category=${product?.productSpu.category1Code}`)}
            className={styles.moreButton}
          >
            查看更多 <RightOutlined />
          </Button>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (!id || productLoading) {
      return <Spin size="large" className={styles.loading} />;
    }

    if (!product) {
      return <Empty description="商品不存在" />;
    }

    return (
      <div className={styles.container}>
        <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
        <div className={styles.mainContent}>
          <Row gutter={40}>
            <Col span={10}>
              {renderProductImages()}
            </Col>
            
            <Col span={14}>
              <div className={styles.productInfo}>
                {renderTitle()}
                {renderSummary()}
                {renderPrice()}
                {renderSaleAttributes()}
                {renderServicePromise()}
                {renderPurchaseSection()}
              </div>
            </Col>
          </Row>
        </div>

        <Card className={styles.detailsCard}>
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            destroyInactiveTabPane
          />
        </Card>

        <Card
          title={renderRecommendTitle()}
          className={styles.recommendCard}
        >
          <List
            grid={{
              gutter: 24,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={relatedProducts}
            loading={loadingRelated}
            renderItem={(item: Product) => (
              <List.Item>
                <ProductCard 
                  product={item}
                  showExchangeButton={false}
                  onClick={() => handleRecommendClick(item.id)}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  };

  return renderContent();
};

export default ProductDetail;
