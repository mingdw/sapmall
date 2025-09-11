'use client'
import React, { useState } from 'react';
import ProductCategorySection, { Product } from '@/components/ui/ProductCategorySection';
import '../../style/glass-header.css';

// 分类、筛选等数据结构
const categories = [
  {
    key: 'all',
    icon: <i className="fas fa-th-large category-icon" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '全部商品', en: 'All Products' },
    count: 198,
    active: true,
    children: [],
  },
  {
    key: 'online-course',
    icon: <i className="fas fa-graduation-cap category-icon text-blue-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '在线课程', en: 'Online Courses' },
    count: 15,
    children: [
      { zh: '区块链开发', en: 'Blockchain Dev' },
      { zh: '智能合约', en: 'Smart Contract' },
      { zh: 'DeFi协议', en: 'DeFi Protocol' },
      { zh: 'NFT创作', en: 'NFT Creation' },
    ],
  },
  {
    key: 'digital-art',
    icon: <i className="fas fa-palette category-icon text-pink-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '数字艺术', en: 'Digital Art' },
    count: 22,
    children: [
      { zh: 'AI生成艺术', en: 'AI Generated Art' },
      { zh: '3D模型', en: '3D Models' },
      { zh: '动画视频', en: 'Animated Videos' },
      { zh: '插画设计', en: 'Illustrations' },
    ],
  },
  // ... 其余分类同理 ...
];

const priceFilters = [
  { label: { zh: '0-50 SAP', en: '0-50 SAP' } },
  { label: { zh: '50-200 SAP', en: '50-200 SAP' } },
  { label: { zh: '200-500 SAP', en: '200-500 SAP' } },
  { label: { zh: '500+ SAP', en: '500+ SAP' } },
];
const ratingFilters = ['4.5+', '4.0+', '3.5+'];
const salesFilters = [
  { label: { zh: '100+ 销量', en: '100+ Sales' } },
  { label: { zh: '500+ 销量', en: '500+ Sales' } },
  { label: { zh: '1000+ 销量', en: '1000+ Sales' } },
];

// 商品数据（后续可用接口替换）
const mockProducts: Product[] = [
  {
    id: '1',
    title: '区块链开发基础课程',
    description: '从零开始学习区块链核心概念，掌握智能合约开发技能，适合初学者入门。',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
    price: 299,
    rating: 4.9,
    badges: ['热门'],
  },
  // ... 其余商品 ...
];

const MarketplacePage: React.FC = () => {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState(categories[0].key);
  const [search, setSearch] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedSales, setSelectedSales] = useState<string | null>(null);
  // ... 其余筛选项 ...

  // 过滤后的商品（后续可用接口/后端过滤）
  const filteredProducts = mockProducts.filter(p => {
    // 示例：按分类、搜索、价格等过滤
    let match = true;
    if (search && !p.title.includes(search)) match = false;
    // ... 其余过滤条件 ...
    return match;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <main className="flex-1 w-full mx-auto px-6 py-4" style={{ width: '90%' }}>
        {/* 商品筛选区域 */}
        <div className="mb-6">
          <div className="filter-card rounded-xl p-4">
            {/* 商品目录筛选 */}
            <div className="mb-2">
              <div className="flex flex-wrap items-start justify-between">
                <div className="flex flex-wrap gap-2 items-start flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-400 flex-shrink-0 w-[68px] h-[36px] flex items-center">商品目录</span>
                  <div className="flex flex-wrap gap-2 items-center flex-1">
                    {categories.map(cat => (
                      <div
                        key={cat.key}
                        className={`category-item px-3 py-2 rounded-lg font-medium cursor-pointer${selectedCategory === cat.key ? ' active' : ''}`}
                        onClick={() => setSelectedCategory(cat.key)}
                        style={{ position: 'relative' }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            {cat.icon}
                            <span className="text-sm font-medium">{cat.label.zh}</span>
                            {cat.children && cat.children.length > 0 && (
                              <i className="fas fa-chevron-down text-xs opacity-50 ml-1"></i>
                            )}
                                        </div>
                          <span className="category-count rounded-full">
                            <span>{cat.count}</span>
                                        </span>
                                    </div>
                        {/* 下拉子分类 */}
                        {cat.children && cat.children.length > 0 && (
                          <div className="dropdown-menu absolute top-full left-0 mt-2 rounded-lg shadow-lg min-w-[160px] z-50">
                            <div className="py-2">
                              {cat.children.map((child, idx) => (
                                <a key={idx} href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white">{child.zh}</a>
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
                        className="search-input w-72 pl-9 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-sapphire-500 focus:outline-none focus:bg-gray-700 transition-all text-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                                </div>
                    <button className="bg-sapphire-600 hover:bg-sapphire-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
                      筛选商品
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {/* 其他筛选条件（价格、评分、销量等）可继续用state管理并渲染按钮，略） */}
                                </div>
                            </div>
        {/* 商品列表展示区域 */}
        <div className="space-y-6">
          {/* 示例：只渲染一组商品，后续可按分类分组 */}
          <ProductCategorySection
            title="在线课程"
            products={filteredProducts} iconClass={''} gradientFrom={''} gradientTo={''} count={0}          />
    </div>
      </main>
    </div>
  );
};

export default MarketplacePage; 