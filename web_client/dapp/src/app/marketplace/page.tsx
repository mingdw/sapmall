import React from 'react';
import ProductCategorySection, { Product } from '@/components/ui/ProductCategorySection';
import { ProductFilterPanel } from '@/components/ui/ProductFilterPanel';

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
  {
    id: '2',
    title: '智能合约开发实战',
    description: '深入学习Solidity编程，实战开发DeFi项目，包含完整项目源码。',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    price: 399,
    rating: 4.8,
    badges: ['新品'],
  },
  {
    id: '3',
    title: 'DeFi协议深度分析',
    description: '解析主流DeFi协议运作机制，掌握流动性挖矿和收益策略。',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop',
    price: 199,
    rating: 4.7,
    badges: ['精品'],
  },
  {
    id: '4',
    title: 'NFT创作与营销策略',
    description: '学习NFT设计理念，掌握铸造流程和营销推广技巧。',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    price: 159,
    rating: 4.6,
    badges: ['艺术', '精品'],
  },
  {
    id: '5',
    title: 'Web3全栈开发实战',
    description: '构建完整Web3应用，包含前端交互和智能合约集成。',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
    price: 499,
    rating: 4.9,
    badges: ['实战', '热门'],
  },
];

const MarketplacePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <main className="flex-1 w-full mx-auto px-6 py-4" style={{ width: '90%' }}>
        {/* 商品目录+筛选面板整体卡片 */}
        <ProductFilterPanel />
        {/* 商品分类区块放在筛选面板下方 */}
        <ProductCategorySection
          title="在线课程"
          iconClass="fas fa-graduation-cap"
          gradientFrom="from-blue-500"
          gradientTo="to-indigo-600"
          count={15}
          products={mockProducts}
        />
        {/* 可继续添加更多分类区块 */}
      </main>
    </div>
  );
};

export default MarketplacePage; 