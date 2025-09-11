'use client'
import { useState } from 'react';
// import styles from './ProductFilterPanel.module.css';

// 完整分类数据，包含所有主流分类及子分类
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
  {
    key: 'dev-tools',
    icon: <i className="fas fa-code category-icon text-green-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '开发工具', en: 'Dev Tools' },
    count: 18,
    children: [
      { zh: '代码模板', en: 'Code Templates' },
      { zh: '开发框架', en: 'Frameworks' },
      { zh: '测试工具', en: 'Testing Tools' },
      { zh: '部署脚本', en: 'Deploy Scripts' },
    ],
  },
  {
    key: 'game-items',
    icon: <i className="fas fa-gamepad category-icon text-orange-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '游戏道具', en: 'Game Items' },
    count: 35,
    children: [
      { zh: '武器装备', en: 'Weapons & Gear' },
      { zh: '角色皮肤', en: 'Character Skins' },
      { zh: '虚拟土地', en: 'Virtual Land' },
      { zh: '收藏品', en: 'Collectibles' },
    ],
  },
  {
    key: 'data-analytics',
    icon: <i className="fas fa-chart-line category-icon text-purple-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '数据分析', en: 'Data Analytics' },
    count: 12,
    children: [
      { zh: '交易分析', en: 'Trading Analysis' },
      { zh: '链上数据', en: 'On-chain Data' },
      { zh: '价格预测', en: 'Price Prediction' },
    ],
  },
  {
    key: 'vr',
    icon: <i className="fas fa-vr-cardboard category-icon text-cyan-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '虚拟现实', en: 'Virtual Reality' },
    count: 28,
    children: [
      { zh: 'VR应用', en: 'VR Apps' },
      { zh: 'VR游戏', en: 'VR Games' },
      { zh: '3D场景', en: '3D Scenes' },
      { zh: 'VR展示', en: 'VR Exhibition' },
    ],
  },
  {
    key: 'metaverse',
    icon: <i className="fas fa-globe category-icon text-teal-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '元宇宙', en: 'Metaverse' },
    count: 45,
    children: [
      { zh: '虚拟世界', en: 'Virtual Worlds' },
      { zh: '数字身份', en: 'Digital Identity' },
      { zh: '虚拟资产', en: 'Virtual Assets' },
      { zh: '社交空间', en: 'Social Spaces' },
    ],
  },
  {
    key: 'web3-social',
    icon: <i className="fas fa-users category-icon text-amber-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: 'Web3社交', en: 'Web3 Social' },
    count: 31,
    children: [
      { zh: '社交应用', en: 'Social Apps' },
      { zh: 'DAO治理', en: 'DAO Governance' },
      { zh: '社区代币', en: 'Community Tokens' },
      { zh: '去中心化身份', en: 'DID' },
    ],
  },
  {
    key: 'defi',
    icon: <i className="fas fa-coins category-icon text-yellow-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: 'DeFi协议', en: 'DeFi Protocol' },
    count: 67,
    children: [
      { zh: '流动性挖矿', en: 'Liquidity Mining' },
      { zh: '借贷协议', en: 'Lending Protocol' },
      { zh: 'DEX交易', en: 'DEX Trading' },
      { zh: '收益聚合器', en: 'Yield Aggregator' },
    ],
  },
  {
    key: 'nft-market',
    icon: <i className="fas fa-image category-icon text-rose-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: 'NFT市场', en: 'NFT Market' },
    count: 89,
    children: [
      { zh: '艺术收藏', en: 'Art Collection' },
      { zh: '音乐NFT', en: 'Music NFT' },
      { zh: '域名NFT', en: 'Domain NFT' },
      { zh: 'PFP头像', en: 'PFP Avatar' },
    ],
  },
  {
    key: 'crypto-wallet',
    icon: <i className="fas fa-wallet category-icon text-emerald-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '加密钱包', en: 'Crypto Wallet' },
    count: 24,
    children: [
      { zh: '硬件钱包', en: 'Hardware Wallet' },
      { zh: '软件钱包', en: 'Software Wallet' },
      { zh: '多签钱包', en: 'Multi-sig Wallet' },
      { zh: '钱包插件', en: 'Wallet Extensions' },
    ],
  },
  {
    key: 'blockchain-infra',
    icon: <i className="fas fa-server category-icon text-slate-400" style={{ fontSize: '0.875rem' }}></i>,
    label: { zh: '区块链基础设施', en: 'Infrastructure' },
    count: 19,
    children: [
      { zh: '节点服务', en: 'Node Services' },
      { zh: 'API服务', en: 'API Services' },
      { zh: '存储网络', en: 'Storage Network' },
      { zh: '跨链桥', en: 'Cross-chain Bridge' },
    ],
  },
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

export const ProductFilterPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].key);
  const [search, setSearch] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedSales, setSelectedSales] = useState<string | null>(null);

  return (
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
                        <span className="text-sm font-medium text-white">{cat.label.zh}</span>
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
                  {priceFilters.map((item, idx) => (
                    <button
                      key={idx}
                      className={`filter-tag px-2.5 py-1 rounded-md text-xs${selectedPrice === item.label.zh ? ' bg-sapphire-600 text-white' : ''}`}
                      onClick={() => setSelectedPrice(item.label.zh)}
                    >
                      {item.label.zh}
                    </button>
                  ))}
                  {selectedPrice && (
                    <button className={" clear-single-btn px-2.5 py-1 rounded-md text-xs"} onClick={() => setSelectedPrice(null)}>
                      <i className="fas fa-times mr-1"></i>清除
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* 评分 */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-medium text-gray-400 min-w-[50px]">评分</span>
                <div className="flex flex-wrap gap-2">
                  {ratingFilters.map((item, idx) => (
                    <button
                      key={idx}
                      className={` filter-tag px-2.5 py-1 rounded-md text-xs${selectedRating === item ? ' bg-sapphire-600 text-white' : ''}`}
                      onClick={() => setSelectedRating(item)}
                    >
                      <i className="fas fa-star text-yellow-400 mr-1"></i>{item}
                    </button>
                  ))}
                  {selectedRating && (
                    <button className={" clear-single-btn px-2.5 py-1 rounded-md text-xs"} onClick={() => setSelectedRating(null)}>
                      <i className="fas fa-times mr-1"></i>清除
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* 销量 */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-medium text-gray-400 min-w-[50px]">销量</span>
                <div className="flex flex-wrap gap-2">
                  {salesFilters.map((item, idx) => (
                    <button
                      key={idx}
                      className={` filter-tag px-2.5 py-1 rounded-md text-xs${selectedSales === item.label.zh ? ' bg-sapphire-600 text-white' : ''}`}
                      onClick={() => setSelectedSales(item.label.zh)}
                    >
                      {item.label.zh}
                    </button>
                  ))}
                  {selectedSales && (
                    <button className={" clear-single-btn px-2.5 py-1 rounded-md text-xs"} onClick={() => setSelectedSales(null)}>
                      <i className="fas fa-times mr-1"></i>清除
                    </button>
                  )}
                </div>
              </div>
              {/* 操作按钮 */}
              <div className="flex gap-2">
                <button className={" clear-btn px-3 py-1.5 rounded-lg font-medium text-xs"} onClick={() => {
                  setSelectedPrice(null); setSelectedRating(null); setSelectedSales(null);
                }}>
                  <i className="fas fa-trash mr-1"></i>清空筛选
                </button>
                <button className={" more-btn px-3 py-1.5 rounded-lg font-medium text-xs"} onClick={() => setExpanded(v => !v)}>
                  {expanded ? <><span>收起筛选</span><i className="fas fa-chevron-up ml-1 text-xs"></i></> : <><span>展开筛选</span><i className="fas fa-chevron-down ml-1 text-xs"></i></>}
                </button>
              </div>
            </div>
            {/* 展开的筛选条件 */}
            {expanded && (
              <div>
                {/* 时间 */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-medium text-gray-400 min-w-[50px]">时间</span>
                    <div className="flex flex-wrap gap-2">
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>最近一周</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>最近一月</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>最近三月</button>
                    </div>
                  </div>
                </div>
                {/* 类型 */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-medium text-gray-400 min-w-[50px]">类型</span>
                    <div className="flex flex-wrap gap-2">
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>数字商品</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>服务类</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>订阅制</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>一次性购买</button>
                    </div>
                  </div>
                </div>
                {/* 商家信誉 */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-medium text-gray-400 min-w-[50px]">商家</span>
                    <div className="flex flex-wrap gap-2">
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>官方认证</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>高信誉商家</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>新商家</button>
                    </div>
                  </div>
                </div>
                {/* 特色标签 */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-medium text-gray-400 min-w-[50px]">特色</span>
                    <div className="flex flex-wrap gap-2">
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>限时折扣</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>免费试用</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>开源项目</button>
                      <button className={" filter-tag px-2.5 py-1 rounded-md text-xs"}>独家发布</button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className={" clear-btn px-3 py-1.5 rounded-lg font-medium text-xs"} onClick={() => {
                      setSelectedPrice(null); setSelectedRating(null); setSelectedSales(null);
                    }}>
                      <i className="fas fa-trash mr-1"></i>清空筛选
                    </button>
                    <button className={" more-btn px-3 py-1.5 rounded-lg font-medium text-xs"} onClick={() => setExpanded(false)}>
                      <span>收起筛选</span><i className="fas fa-chevron-up ml-1 text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
