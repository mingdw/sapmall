// 全局变量
let isFilterMode = false;
let currentFilterCategory = '';
let currentFilterPage = 1;
let filteredProducts = []; // 筛选后的商品数据

const productsPerPage = 10; // 每页显示10个商品（2行5列）

// 模拟商品数据库
const allProducts = [
    // 在线课程类商品 (15个商品)
    { id: 1, title: '区块链开发基础课程', price: 299, rating: 4.9, category: '在线课程', subcategory: '区块链开发', badge: 'hot', description: '从零开始学习区块链核心概念，掌握智能合约开发技能，适合初学者入门。', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop' },
    { id: 2, title: '智能合约开发实战', price: 399, rating: 4.8, category: '在线课程', subcategory: '智能合约', badge: 'new', description: '深入学习Solidity编程，实战开发DeFi项目，包含完整项目源码。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 3, title: 'DeFi协议深度分析', price: 199, rating: 4.7, category: '在线课程', subcategory: 'DeFi协议', badge: 'featured', description: '解析主流DeFi协议运作机制，掌握流动性挖矿和收益策略。', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop' },
    { id: 4, title: 'NFT创作与营销策略', price: 159, rating: 4.6, category: '在线课程', subcategory: 'NFT创作', badge: 'art', description: '学习NFT设计理念，掌握铸造流程和营销推广技巧。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 5, title: 'Web3全栈开发实战', price: 499, rating: 4.9, category: '在线课程', subcategory: '区块链开发', badge: 'hot', description: '构建完整Web3应用，包含前端交互和智能合约集成。', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop' },
    { id: 6, title: 'Ethereum开发完全指南', price: 349, rating: 4.8, category: '在线课程', subcategory: '区块链开发', badge: 'featured', description: '掌握以太坊生态系统，学习dApp开发的最佳实践。', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop' },
    { id: 7, title: 'DAO治理机制设计', price: 279, rating: 4.7, category: '在线课程', subcategory: 'DeFi协议', badge: 'new', description: '学习去中心化自治组织的治理模式和投票机制设计。', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop' },
    { id: 8, title: '跨链技术原理与实践', price: 429, rating: 4.9, category: '在线课程', subcategory: '区块链开发', badge: 'legendary', description: '深入理解跨链桥技术，掌握多链生态开发技能。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 9, title: 'Layer2扩容解决方案', price: 389, rating: 4.8, category: '在线课程', subcategory: '区块链开发', badge: 'hot', description: '学习Polygon、Arbitrum等Layer2技术的原理和应用。', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop' },
    { id: 10, title: 'MEV挖掘策略课程', price: 599, rating: 4.9, category: '在线课程', subcategory: 'DeFi协议', badge: 'epic', description: '学习最大可提取价值的机制，掌握套利和MEV策略。', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop' },
    { id: 11, title: '零知识证明入门', price: 459, rating: 4.7, category: '在线课程', subcategory: '区块链开发', badge: 'featured', description: '理解zk-SNARKs和zk-STARKs，学习隐私计算技术。', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop' },
    { id: 12, title: 'GameFi游戏经济设计', price: 329, rating: 4.6, category: '在线课程', subcategory: 'NFT创作', badge: 'mythical', description: '设计区块链游戏的经济模型和Play-to-Earn机制。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 13, title: '去中心化存储技术', price: 259, rating: 4.8, category: '在线课程', subcategory: '区块链开发', badge: 'tool', description: '学习IPFS、Arweave等去中心化存储解决方案。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 14, title: '区块链安全审计实战', price: 799, rating: 4.9, category: '在线课程', subcategory: '智能合约', badge: 'legendary', description: '掌握智能合约安全漏洞检测和审计技能。', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop' },
    { id: 15, title: 'Web3用户体验设计', price: 229, rating: 4.5, category: '在线课程', subcategory: 'NFT创作', badge: 'art', description: '设计友好的Web3应用界面，提升用户体验。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    
    // 数字艺术类商品
    { id: 21, title: 'AI生成艺术作品集', price: 399, rating: 4.8, category: '数字艺术', subcategory: 'AI生成艺术', badge: 'hot', description: '使用最新AI技术生成的独特艺术作品集合，每件作品都是独一无二的。', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop' },
    { id: 22, title: '3D数字雕塑模型', price: 299, rating: 4.7, category: '数字艺术', subcategory: '3D模型', badge: 'art', description: '高质量3D数字雕塑模型，适用于游戏开发和艺术展示。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    { id: 23, title: '动态NFT艺术', price: 799, rating: 4.9, category: '数字艺术', subcategory: '动画视频', badge: 'legendary', description: '创新动态NFT艺术作品，结合区块链技术的数字艺术新形式。', image: 'https://images.unsplash.com/photo-1582973322445-ad2040da8287?w=300&h=200&fit=crop' },
    
    // 开发工具类商品
    { id: 31, title: '智能合约模板库', price: 199, rating: 4.7, category: '开发工具', subcategory: '代码模板', badge: 'tool', description: '常用智能合约模板库，包含ERC标准和DeFi协议模板。', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop' },
    { id: 32, title: 'Web3开发框架', price: 399, rating: 4.8, category: '开发工具', subcategory: '开发框架', badge: 'featured', description: '完整的Web3开发框架，简化DApp开发流程。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    
    // 游戏道具类商品
    { id: 41, title: '传奇武器：雷霆之剑', price: 1299, rating: 4.9, category: '游戏道具', subcategory: '武器装备', badge: 'legendary', description: '拥有雷电之力的传奇武器，大幅提升攻击力和技能伤害。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    { id: 42, title: '限定角色皮肤：银河战士', price: 599, rating: 4.8, category: '游戏道具', subcategory: '角色皮肤', badge: 'epic', description: '限定版银河战士皮肤，独特的视觉效果和动画。', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop' },
    
    // 数据分析类商品
    { id: 51, title: 'DeFi交易分析器', price: 399, rating: 4.8, category: '数据分析', subcategory: '交易分析', badge: 'tool', description: '专业的DeFi交易数据分析工具，提供实时市场洞察和交易策略建议。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 52, title: '链上数据监控', price: 299, rating: 4.9, category: '数据分析', subcategory: '链上数据', badge: 'featured', description: '全面的区块链数据监控平台，追踪地址活动和资金流向分析。', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop' },
    
    // 虚拟现实类商品
    { id: 61, title: 'VR教育平台', price: 899, rating: 4.8, category: '虚拟现实', subcategory: 'VR应用', badge: 'featured', description: '沉浸式虚拟现实教育平台，提供丰富的3D学习体验和互动课程。', image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=300&h=200&fit=crop' },
    { id: 62, title: 'VR游戏引擎', price: 1299, rating: 4.9, category: '虚拟现实', subcategory: 'VR游戏', badge: 'epic', description: '专业的VR游戏开发引擎，支持多平台部署和高质量渲染。', image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=200&fit=crop' },
    { id: 63, title: '3D建模工具', price: 599, rating: 4.7, category: '虚拟现实', subcategory: '3D场景', badge: 'tool', description: '高效的3D建模和渲染工具，适用于VR内容创作和设计。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 64, title: 'VR社交空间', price: 399, rating: 4.6, category: '虚拟现实', subcategory: 'VR应用', badge: 'new', description: '虚拟现实社交平台，支持多人在线互动和虚拟聚会。', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    { id: 65, title: 'VR训练模拟器', price: 1599, rating: 4.8, category: '虚拟现实', subcategory: 'VR展示', badge: 'legendary', description: '专业级VR训练模拟器，用于职业技能培训和安全演练。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    
    // NFT市场类商品
    { id: 71, title: '艺术收藏NFT', price: 2199, rating: 4.9, category: 'NFT市场', subcategory: '艺术收藏', badge: 'art', description: '精选艺术家原创NFT收藏品，限量发行的数字艺术珍品。', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop' },
    { id: 72, title: '音乐NFT专辑', price: 799, rating: 4.8, category: 'NFT市场', subcategory: '音乐NFT', badge: 'featured', description: '独家音乐NFT专辑，包含高品质音频和独特的视觉艺术。', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop' },
    { id: 73, title: '域名NFT', price: 1299, rating: 4.7, category: 'NFT市场', subcategory: '域名NFT', badge: 'hot', description: '区块链域名NFT，永久拥有的去中心化网络身份标识。', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop' },
    { id: 74, title: 'PFP头像系列', price: 599, rating: 4.6, category: 'NFT市场', subcategory: 'PFP头像', badge: 'mythical', description: '独特的PFP头像NFT系列，展现个性化的数字身份。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    { id: 75, title: '游戏内NFT道具', price: 399, rating: 4.8, category: 'NFT市场', subcategory: '艺术收藏', badge: 'epic', description: '跨游戏通用的NFT道具，具有实用价值和收藏意义。', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop' },
    
    // 加密钱包类商品
    { id: 81, title: '硬件钱包Pro', price: 399, rating: 4.9, category: '加密钱包', subcategory: '硬件钱包', badge: 'featured', description: '军用级加密的硬件钱包，支持多种加密货币安全存储。', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop' },
    { id: 82, title: '多签钱包方案', price: 199, rating: 4.8, category: '加密钱包', subcategory: '多签钱包', badge: 'tool', description: '企业级多重签名钱包解决方案，提供最高级别的资产安全。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 83, title: '移动钱包App', price: 0, rating: 4.7, category: '加密钱包', subcategory: '软件钱包', badge: 'free', description: '功能全面的移动端加密货币钱包，支持DeFi和NFT交易。', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop' },
    { id: 84, title: '浏览器钱包插件', price: 0, rating: 4.6, category: '加密钱包', subcategory: '钱包插件', badge: 'free', description: '轻量级浏览器钱包插件，无缝集成Web3应用和DeFi协议。', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop' },
    
    // 元宇宙类商品
    { id: 91, title: '虚拟世界平台', price: 1899, rating: 4.9, category: '元宇宙', subcategory: '虚拟世界', badge: 'epic', description: '完整的虚拟世界创建平台，支持用户自定义3D空间和社交体验。', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop' },
    { id: 92, title: '数字身份系统', price: 699, rating: 4.8, category: '元宇宙', subcategory: '数字身份', badge: 'featured', description: '去中心化数字身份管理系统，跨平台统一虚拟形象。', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    { id: 93, title: '虚拟资产交易', price: 999, rating: 4.7, category: '元宇宙', subcategory: '虚拟资产', badge: 'hot', description: '元宇宙虚拟资产交易平台，支持土地、装备、道具的买卖。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 94, title: '社交空间构建器', price: 599, rating: 4.6, category: '元宇宙', subcategory: '社交空间', badge: 'tool', description: '可视化社交空间设计工具，轻松创建虚拟聚会场所。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 95, title: '元宇宙游戏引擎', price: 1499, rating: 4.8, category: '元宇宙', subcategory: '虚拟世界', badge: 'legendary', description: '专为元宇宙打造的游戏引擎，支持大规模多人在线体验。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    
    // Web3社交类商品
    { id: 101, title: '去中心化社交网络', price: 299, rating: 4.8, category: 'Web3社交', subcategory: '社交应用', badge: 'featured', description: '基于区块链的社交网络平台，用户完全拥有数据主权。', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop' },
    { id: 102, title: 'DAO治理工具', price: 799, rating: 4.9, category: 'Web3社交', subcategory: 'DAO治理', badge: 'tool', description: '完整的DAO治理系统，支持提案、投票、执行的全流程管理。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 103, title: '社区代币发行器', price: 599, rating: 4.7, category: 'Web3社交', subcategory: '社区代币', badge: 'hot', description: '社区代币一键发行工具，帮助社区建立专属经济体系。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 104, title: 'Web3聊天应用', price: 199, rating: 4.6, category: 'Web3社交', subcategory: '社交应用', badge: 'new', description: '端到端加密的Web3聊天应用，支持NFT头像和代币打赏。', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    { id: 105, title: '去中心化身份DID', price: 399, rating: 4.8, category: 'Web3社交', subcategory: '去中心化身份', badge: 'epic', description: '去中心化数字身份解决方案，实现跨平台身份认证。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    
    // DeFi协议类商品（额外的）
    { id: 111, title: '流动性挖矿平台', price: 1299, rating: 4.9, category: 'DeFi协议', subcategory: '流动性挖矿', badge: 'hot', description: '高收益流动性挖矿平台，支持多种DeFi协议的收益优化。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 112, title: '借贷协议套件', price: 999, rating: 4.8, category: 'DeFi协议', subcategory: '借贷协议', badge: 'featured', description: '完整的去中心化借贷协议，支持超额抵押和闪电贷功能。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 113, title: 'DEX聚合器', price: 699, rating: 4.7, category: 'DeFi协议', subcategory: 'DEX交易', badge: 'tool', description: '多DEX聚合交易工具，智能路由获取最优交易价格。', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    { id: 114, title: '收益聚合器', price: 899, rating: 4.8, category: 'DeFi协议', subcategory: '收益聚合器', badge: 'epic', description: '自动化收益聚合器，智能分配资金到最优收益策略。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    { id: 115, title: '跨链桥协议', price: 1599, rating: 4.9, category: 'DeFi协议', subcategory: '跨链桥', badge: 'legendary', description: '安全的跨链资产桥接协议，支持主流区块链网络。', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop' },
    
    // 区块链基础设施类商品
    { id: 121, title: '节点服务器租赁', price: 299, rating: 4.8, category: '区块链基础设施', subcategory: '节点服务', badge: 'featured', description: '专业区块链节点服务器租赁，提供稳定的网络连接服务。', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop' },
    { id: 122, title: 'API网关服务', price: 199, rating: 4.7, category: '区块链基础设施', subcategory: 'API服务', badge: 'tool', description: '高性能区块链API网关，统一管理多链数据访问接口。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 123, title: '去中心化存储', price: 599, rating: 4.9, category: '区块链基础设施', subcategory: '存储网络', badge: 'hot', description: '分布式存储网络服务，提供永久性数据存储解决方案。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 124, title: '跨链中继服务', price: 999, rating: 4.8, category: '区块链基础设施', subcategory: '跨链桥', badge: 'epic', description: '专业跨链中继服务，实现不同区块链网络间的通信。', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    
    // 人工智能类商品
    { id: 131, title: 'AI交易机器人', price: 1299, rating: 4.9, category: '人工智能', subcategory: 'AI交易', badge: 'hot', description: '智能加密货币交易机器人，基于机器学习的量化交易策略。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 132, title: 'NFT生成器', price: 699, rating: 4.8, category: '人工智能', subcategory: 'AI艺术', badge: 'art', description: 'AI驱动的NFT艺术生成器，创造独特的数字艺术作品。', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop' },
    { id: 133, title: '智能合约审计AI', price: 1599, rating: 4.9, category: '人工智能', subcategory: 'AI安全', badge: 'legendary', description: 'AI智能合约安全审计工具，自动检测潜在安全漏洞。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 134, title: '语言模型API', price: 399, rating: 4.7, category: '人工智能', subcategory: 'AI服务', badge: 'featured', description: '专为Web3领域优化的大语言模型API服务。', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    { id: 135, title: '预测分析平台', price: 899, rating: 4.8, category: '人工智能', subcategory: 'AI分析', badge: 'tool', description: 'AI驱动的市场预测分析平台，提供精准的趋势预测。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    
    // 物联网类商品
    { id: 141, title: '物联网数据Oracle', price: 799, rating: 4.8, category: '物联网', subcategory: 'IoT数据', badge: 'featured', description: '物联网设备数据上链Oracle服务，连接现实世界与区块链。', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { id: 142, title: '设备身份认证', price: 299, rating: 4.7, category: '物联网', subcategory: 'IoT安全', badge: 'tool', description: '基于区块链的IoT设备身份认证和管理系统。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 143, title: '智能家居控制器', price: 599, rating: 4.6, category: '物联网', subcategory: 'IoT应用', badge: 'new', description: '支持加密货币支付的智能家居控制系统。', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    { id: 144, title: '供应链追溯系统', price: 1199, rating: 4.9, category: '物联网', subcategory: 'IoT数据', badge: 'epic', description: '基于物联网和区块链的产品供应链追溯解决方案。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    
    // 新增类别商品 - 确保筛选模式能找到这些商品
    // 虚拟现实类别额外商品
    { id: 200, title: 'VR会议室', price: 1199, rating: 4.7, category: '虚拟现实', subcategory: 'VR应用', badge: 'featured', description: '专业VR会议解决方案，实现远程协作新体验。', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop' },
    { id: 201, title: 'VR驾驶培训', price: 2199, rating: 4.9, category: '虚拟现实', subcategory: 'VR训练', badge: 'legendary', description: '安全的VR驾驶培训系统，模拟各种路况。', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop' },
    { id: 202, title: 'VR建筑设计', price: 1899, rating: 4.8, category: '虚拟现实', subcategory: 'VR设计', badge: 'epic', description: '沉浸式建筑设计和可视化VR工具。', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop' },
    { id: 203, title: 'VR旅游体验', price: 499, rating: 4.5, category: '虚拟现实', subcategory: 'VR娱乐', badge: 'hot', description: '足不出户的VR旅游体验，探索世界名胜。', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop' },
    { id: 204, title: 'VR心理治疗', price: 1599, rating: 4.8, category: '虚拟现实', subcategory: 'VR医疗', badge: 'new', description: '专业VR心理治疗系统，辅助心理康复。', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop' },
    { id: 205, title: 'VR语言学习', price: 699, rating: 4.6, category: '虚拟现实', subcategory: 'VR教育', badge: 'featured', description: '沉浸式语言学习VR环境，快速提升语言技能。', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop' },
    { id: 206, title: 'VR工业设计', price: 2299, rating: 4.9, category: '虚拟现实', subcategory: 'VR设计', badge: 'epic', description: '工业级VR设计工具，提升产品开发效率。', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop' },
    { id: 207, title: 'VR音乐制作', price: 899, rating: 4.7, category: '虚拟现实', subcategory: 'VR创作', badge: 'art', description: '创新的VR音乐创作和演出平台。', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop' },
    { id: 208, title: 'VR安全培训', price: 1399, rating: 4.8, category: '虚拟现实', subcategory: 'VR训练', badge: 'tool', description: '企业安全培训VR解决方案。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 209, title: 'VR运动分析', price: 1099, rating: 4.6, category: '虚拟现实', subcategory: 'VR体育', badge: 'new', description: '专业运动员VR动作分析和训练系统。', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' },
    { id: 210, title: 'VR电影制作', price: 3299, rating: 4.9, category: '虚拟现实', subcategory: 'VR创作', badge: 'legendary', description: '专业VR电影制作和后期处理工具。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    { id: 211, title: 'VR数据可视化', price: 1699, rating: 4.7, category: '虚拟现实', subcategory: 'VR工具', badge: 'tool', description: '3D数据可视化VR平台，直观展示复杂数据。', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
    { id: 212, title: 'VR协作设计', price: 1599, rating: 4.8, category: '虚拟现实', subcategory: 'VR设计', badge: 'featured', description: '多人协作VR设计平台，实时同步创作。', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    { id: 213, title: 'VR模拟实验', price: 1299, rating: 4.6, category: '虚拟现实', subcategory: 'VR教育', badge: 'epic', description: '科学实验VR模拟环境，安全进行各种实验。', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=200&fit=crop' },
    { id: 214, title: 'VR历史重现', price: 899, rating: 4.5, category: '虚拟现实', subcategory: 'VR教育', badge: 'art', description: '历史场景VR重现，身临其境感受历史。', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop' },
    
    // NFT市场类别额外商品  
    { id: 220, title: '像素艺术NFT', price: 399, rating: 4.5, category: 'NFT市场', subcategory: '像素艺术', badge: 'art', description: '经典像素风格NFT艺术作品，致敬复古游戏文化。', image: 'https://images.unsplash.com/photo-1614850523060-8da8d5acc9b1?w=300&h=200&fit=crop' },
    { id: 221, title: '生成艺术NFT', price: 1299, rating: 4.8, category: 'NFT市场', subcategory: '生成艺术', badge: 'hot', description: '算法生成的独特艺术NFT，每个都是独一无二的创作。', image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=300&h=200&fit=crop' },
    { id: 222, title: '虚拟地产NFT', price: 4999, rating: 4.9, category: 'NFT市场', subcategory: '虚拟地产', badge: 'legendary', description: '元宇宙虚拟地产NFT，投资未来数字世界。', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop' },
    { id: 223, title: '会员卡NFT', price: 999, rating: 4.6, category: 'NFT市场', subcategory: '会员权益', badge: 'featured', description: '专属会员权益NFT，享受特殊服务和优惠。', image: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=300&h=200&fit=crop' },
    { id: 224, title: '证书NFT', price: 299, rating: 4.4, category: 'NFT市场', subcategory: '数字证书', badge: 'tool', description: '不可篡改的数字证书NFT，永久记录成就。', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop' },
    { id: 225, title: '票据NFT', price: 199, rating: 4.3, category: 'NFT市场', subcategory: '票据收藏', badge: 'new', description: '活动门票NFT，防伪且具有收藏价值。', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=200&fit=crop' },
    { id: 226, title: '宠物NFT', price: 799, rating: 4.7, category: 'NFT市场', subcategory: '虚拟宠物', badge: 'mythical', description: '可爱数字宠物NFT，可培养和交互的虚拟伙伴。', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop' },
    { id: 227, title: '漫画NFT', price: 1199, rating: 4.8, category: 'NFT市场', subcategory: '漫画收藏', badge: 'art', description: '原创漫画作品NFT，支持创作者的数字版权。', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=200&fit=crop' },
    { id: 228, title: 'Meme表情包NFT', price: 99, rating: 4.2, category: 'NFT市场', subcategory: 'Meme收藏', badge: 'hot', description: '爆火Meme表情包NFT，网络文化的数字收藏。', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop' },
    { id: 229, title: '建筑设计NFT', price: 1899, rating: 4.7, category: 'NFT市场', subcategory: '设计图纸', badge: 'featured', description: '建筑师原创设计图NFT，独特的建筑艺术作品。', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop' },
    { id: 230, title: '虚拟服装NFT', price: 599, rating: 4.5, category: 'NFT市场', subcategory: '虚拟时装', badge: 'new', description: '时尚虚拟服装NFT，元宇宙中的潮流单品。', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=200&fit=crop' },
    { id: 231, title: '收藏品盲盒NFT', price: 299, rating: 4.6, category: 'NFT市场', subcategory: '盲盒收藏', badge: 'mythical', description: '神秘盲盒NFT，开启惊喜收藏品。', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=300&h=200&fit=crop' },
    { id: 232, title: '数字雕塑NFT', price: 1599, rating: 4.8, category: 'NFT市场', subcategory: '数字雕塑', badge: 'art', description: '3D数字雕塑艺术NFT，立体艺术的数字化呈现。', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    { id: 233, title: '虚拟家具NFT', price: 399, rating: 4.4, category: 'NFT市场', subcategory: '虚拟家具', badge: 'tool', description: '虚拟空间家具NFT，装饰您的数字住所。', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop' },
    { id: 234, title: '抽象艺术NFT', price: 999, rating: 4.6, category: 'NFT市场', subcategory: '抽象艺术', badge: 'art', description: '抽象艺术作品NFT，探索色彩与形状的无限可能。', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop' }
];

/**
 * 筛选商品功能 - 支持子分类筛选
 */
function filterProducts(categoryName, searchTerm = '', subcategoryName = '') {
    let filtered = allProducts;
    
    // 按分类筛选
    if (categoryName !== '全部商品') {
        filtered = filtered.filter(product => product.category === categoryName);
    }
    
    // 按子分类筛选
    if (subcategoryName && subcategoryName.trim()) {
        filtered = filtered.filter(product => product.subcategory === subcategoryName);
    }
    
    // 按搜索词筛选
    if (searchTerm.trim()) {
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    return filtered;
}

/**
 * 切换到筛选模式 - 支持子分类
 */
function switchToFilterMode(categoryName, searchTerm = '', subcategoryName = '') {
    isFilterMode = true;
    currentFilterCategory = categoryName;
    currentFilterPage = 1;
    
    // 筛选商品
    filteredProducts = filterProducts(categoryName, searchTerm, subcategoryName);
    
    // 隐藏原有的商品展示区域
    const originalContainer = document.querySelector('.space-y-6');
    if (originalContainer) {
        originalContainer.style.display = 'none';
    }
    
    // 创建筛选模式的展示区域
    createFilterModeDisplay(subcategoryName);
}

/**
 * 创建筛选模式的展示区域 - 支持子分类标题
 */
function createFilterModeDisplay(subcategoryName = '') {
    // 检查是否已经存在筛选容器
    let filterContainer = document.getElementById('filterModeContainer');
    if (filterContainer) {
        filterContainer.remove();
    }
    
    // 创建筛选模式容器
    filterContainer = document.createElement('div');
    filterContainer.id = 'filterModeContainer';
    filterContainer.className = 'space-y-6';
    
    // 插入到原容器之后
    const originalContainer = document.querySelector('.space-y-6');
    if (originalContainer) {
        originalContainer.parentNode.insertBefore(filterContainer, originalContainer.nextSibling);
    }
    
    // 渲染筛选结果
    renderFilterResults(subcategoryName);
}

/**
 * 渲染筛选结果 - 支持子分类标题显示
 */
function renderFilterResults(subcategoryName = '') {
    const filterContainer = document.getElementById('filterModeContainer');
    if (!filterContainer) {
        console.error('筛选容器不存在');
        return;
    }
    
    // 清空容器
    filterContainer.innerHTML = '';
    
    // 计算分页
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentFilterPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
    
    console.log('当前页:', currentFilterPage, '总页数:', totalPages, '当前页商品:', currentPageProducts.length);
    
    // 创建筛选结果卡片
    const filterCard = document.createElement('div');
    filterCard.className = 'category-main-card';
    
    // 确定显示标题
    let displayTitle = currentFilterCategory === '全部商品' ? '全部商品' : currentFilterCategory;
    if (subcategoryName) {
        displayTitle = `${currentFilterCategory} > ${subcategoryName}`;
    }
    
    filterCard.innerHTML = `
        <div class="category-main-header">
            <div class="category-main-title">
                <div class="category-main-icon bg-gradient-to-br from-sapphire-500 to-blue-600">
                    <i class="fas ${getCategoryIcon(currentFilterCategory)}"></i>
                </div>
                <div class="category-main-info">
                    <h3>${displayTitle}</h3>
                    <span class="category-item-count">${filteredProducts.length}个商品</span>
                </div>
            </div>
            <button id="exitFilterMode" class="back-btn">
                <i class="fas fa-arrow-left"></i>
                <span>返回上一级</span>
            </button>
        </div>
        
        <!-- 商品网格 - 2行5列共10个商品，与主页布局保持一致 -->
        <div class="grid grid-cols-5 gap-4" id="filterProductGrid">
            ${currentPageProducts.map(product => createProductCard(product)).join('')}
        </div>
    `;
    
    filterContainer.appendChild(filterCard);
    
    // 添加分页控件
    if (totalPages > 1) {
        createPaginationControls(filterContainer, totalPages);
    }
    
    // 绑定退出筛选模式事件
    const exitBtn = document.getElementById('exitFilterMode');
    if (exitBtn) {
        exitBtn.addEventListener('click', exitFilterMode);
    }
    
    // 绑定商品卡片事件
    bindProductCardEvents(filterContainer);
}

/**
 * 创建分页控件
 */
function createPaginationControls(container, totalPages) {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'flex justify-center items-center space-x-2 mt-6';
    paginationContainer.id = 'paginationControls';
    
    // 上一页按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        currentFilterPage === 1 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-gray-600 text-white hover:bg-gray-500'
    }`;
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentFilterPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentFilterPage > 1) {
            currentFilterPage--;
            renderFilterResults();
        }
    });
    
    // 页码显示
    const pageInfo = document.createElement('span');
    pageInfo.className = 'px-4 py-2 text-sm text-gray-300';
    pageInfo.textContent = `第 ${currentFilterPage} 页，共 ${totalPages} 页`;
    
    // 下一页按钮
    const nextBtn = document.createElement('button');
    nextBtn.className = `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        currentFilterPage === totalPages 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-gray-600 text-white hover:bg-gray-500'
    }`;
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentFilterPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentFilterPage < totalPages) {
            currentFilterPage++;
            renderFilterResults();
        }
    });
    
    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextBtn);
    
    container.appendChild(paginationContainer);
}

/**
 * 创建商品卡片HTML
 */
function createProductCard(product) {
    const badgeClass = getBadgeClass(product.badge);
    const badgeText = getBadgeText(product.badge);
    
    return `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-badges">
                    <div class="product-badge ${badgeClass}">${badgeText}</div>
                </div>
            </div>
            <div class="product-content">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">${product.price}</span>
                    <div class="product-rating">
                        <i class="fas fa-star star"></i>
                        <span class="rating-text">${product.rating}</span>
                    </div>
                </div>
                <button class="buy-btn">立即购买</button>
            </div>
        </div>
    `;
}

/**
 * 获取分类图标
 */
function getCategoryIcon(categoryName) {
    const iconMap = {
        '全部商品': 'fa-th-large',
        '在线课程': 'fa-graduation-cap',
        '数字艺术': 'fa-palette',
        '开发工具': 'fa-code',
        '游戏道具': 'fa-gamepad',
        '数据分析': 'fa-chart-line',
        '虚拟现实': 'fa-vr-cardboard',
        'NFT市场': 'fa-image',
        '加密钱包': 'fa-wallet',
        '元宇宙': 'fa-globe',
        'Web3社交': 'fa-users',
        'DeFi协议': 'fa-coins',
        '区块链基础设施': 'fa-server',
        '人工智能': 'fa-brain',
        '物联网': 'fa-microchip'
    };
    return iconMap[categoryName] || 'fa-th-large';
}

/**
 * 获取徽章样式类
 */
function getBadgeClass(badge) {
    const badgeClasses = {
        'hot': 'hot',
        'new': 'new',
        'featured': 'featured',
        'art': 'art',
        'tool': 'tool',
        'legendary': 'legendary',
        'epic': 'epic',
        'mythical': 'mythical',
        'free': 'free'
    };
    return badgeClasses[badge] || 'featured';
}

/**
 * 获取徽章文本
 */
function getBadgeText(badge) {
    const badgeTexts = {
        'hot': '热门',
        'new': '新品',
        'featured': '精品',
        'art': '艺术',
        'tool': '工具',
        'legendary': '传奇',
        'epic': '史诗',
        'mythical': '神话',
        'free': '免费'
    };
    return badgeTexts[badge] || badge;
}

/**
 * 退出筛选模式
 */
function exitFilterMode() {
    console.log('退出筛选模式');
    
    isFilterMode = false;
    currentFilterCategory = '全部商品';
    currentFilterPage = 1;
    filteredProducts = [];
    
    // 移除筛选容器
    const filterContainer = document.getElementById('filterModeContainer');
    if (filterContainer) {
        filterContainer.remove();
    }
    
    // 显示原有的商品展示区域
    const originalContainer = document.querySelector('.space-y-6');
    if (originalContainer) {
        originalContainer.style.display = 'block';
    }
    
    // 重置分类选择状态
    resetCategorySelection();
}

/**
 * 重置分类选择状态
 */
function resetCategorySelection() {
    // 移除所有分类的 active 状态
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置"全部商品"为激活状态
    const allProductsCategory = document.querySelector('.category-item');
    if (allProductsCategory) {
        allProductsCategory.classList.add('active');
    }
}

/**
 * 初始化筛选商品按钮
 */
function initFilterButton() {
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            console.log('点击筛选商品按钮');
            
            // 获取当前选中的分类
            const activeCategory = document.querySelector('.category-item.active');
            let categoryName = '全部商品';
            
            if (activeCategory) {
                const categorySpan = activeCategory.querySelector('span[data-zh]');
                if (categorySpan) {
                    categoryName = categorySpan.getAttribute('data-zh');
                }
            }
            
            // 获取搜索词
            const searchInput = document.querySelector('.search-input');
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            
            console.log('筛选参数 - 分类:', categoryName, '搜索词:', searchTerm);
            
            // 切换到筛选模式
            switchToFilterMode(categoryName, searchTerm);
        });
    }
}

/**
 * 初始化分类选择功能 - 添加自动筛选
 */
function initCategorySelection() {
    const categoryItems = document.querySelectorAll('.category-item');
    console.log('初始化分类选择，找到', categoryItems.length, '个分类项');
    
    categoryItems.forEach((item, index) => {
        console.log('绑定分类项', index, ':', item.querySelector('span[data-zh]')?.getAttribute('data-zh'));
        
        item.addEventListener('click', function(e) {
            console.log('分类项被点击:', this.querySelector('span[data-zh]')?.getAttribute('data-zh'));
            
            // 检查是否点击了下拉箭头
            if (e.target.closest('.fas.fa-chevron-down')) {
                console.log('跳过处理：点击下拉箭头');
                return;
            }
            
            // 如果点击的是下拉菜单内的链接，不在这里处理（由下拉菜单事件处理）
            if (e.target.closest('.dropdown-menu a')) {
                console.log('跳过处理：点击下拉菜单项');
                return;
            }
            
            // 获取分类名称
            const categorySpan = this.querySelector('span[data-zh]');
            const categoryName = categorySpan ? categorySpan.getAttribute('data-zh') : '全部商品';
            
            // 检查是否有下拉菜单
            const dropdown = this.querySelector('.dropdown-menu');
            
            console.log('分类信息 - 名称:', categoryName, '有下拉菜单:', !!dropdown, '当前筛选模式:', isFilterMode);
            
            // 更新选中状态
            updateCategorySelection(this);
            
            // 无论是否在筛选模式，都可以切换到新的分类筛选
            console.log('进入筛选模式，分类:', categoryName);
            
            // 显示加载状态
            this.style.opacity = '0.6';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                // 进入筛选模式
                switchToFilterMode(categoryName);
                
                // 显示提示
                if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                    window.DAppCommon.showToast(
                        `正在浏览 ${categoryName} 分类商品`,
                        'info'
                    );
                }
                
                // 恢复状态
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
            }, 300);
        });
    });
}

/**
 * 初始化筛选标签功能
 */
function initFilterTags() {
    // 处理所有筛选标签的点击事件
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 切换选中状态
            this.classList.toggle('selected');
            
            // 查找父容器中的清除按钮
            const parentContainer = this.closest('.flex.flex-wrap.gap-2.items-center');
            if (parentContainer) {
                const clearBtn = parentContainer.querySelector('.clear-single-btn');
                const selectedTags = parentContainer.querySelectorAll('.filter-tag.selected');
                
                // 根据选中的标签数量显示或隐藏清除按钮
                if (clearBtn) {
                    if (selectedTags.length > 0) {
                        clearBtn.style.display = 'inline-block';
                    } else {
                        clearBtn.style.display = 'none';
                    }
                }
            }
            
            // 获取标签文本
            const tagText = this.textContent.trim();
            console.log(`筛选标签 ${this.classList.contains('selected') ? '选中' : '取消'}: ${tagText}`);
            
            // 显示提示
            if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                window.DAppCommon.showToast(
                    `已${this.classList.contains('selected') ? '选择' : '取消'}: ${tagText}`,
                    'info'
                );
            }
        });
    });
}

/**
 * 初始化展开筛选功能
 */
function initMoreFilters() {
    const moreFiltersBtn = document.getElementById('moreFiltersBtn');
    const moreFiltersBtn2 = document.getElementById('moreFiltersBtn2');
    const moreFilters = document.getElementById('moreFilters');
    const mainActionButtons = document.getElementById('mainActionButtons');
    const expandedActionButtons = document.getElementById('expandedActionButtons');

    if (moreFiltersBtn && moreFiltersBtn2 && moreFilters && mainActionButtons && expandedActionButtons) {
        // 处理主要的展开按钮
        moreFiltersBtn.addEventListener('click', function() {
            toggleFilterDisplay(true);
        });
        
        // 处理展开状态下的收起按钮
        moreFiltersBtn2.addEventListener('click', function() {
            toggleFilterDisplay(false);
        });
        
        function toggleFilterDisplay(isExpanding) {
            console.log('切换筛选展示，展开:', isExpanding);
            
            if (isExpanding) {
                // 展开筛选
                moreFilters.style.display = 'block';
                mainActionButtons.style.display = 'none';
                expandedActionButtons.style.display = 'flex';
                
                console.log('筛选已展开，按钮移至特色行');
            } else {
                // 收起筛选
                moreFilters.style.display = 'none';
                mainActionButtons.style.display = 'flex';
                expandedActionButtons.style.display = 'none';
                
                console.log('筛选已收起，按钮回到销量行');
            }
        }
    }
}

/**
 * 初始化单独清除按钮功能
 */
function initClearButtons() {
    // 处理单独清除按钮
    const clearButtons = [
        'clearPriceBtn', 'clearRatingBtn', 'clearSalesBtn', 
        'clearTimeBtn', 'clearTypeBtn', 'clearSellerBtn', 'clearFeatureBtn'
    ];
    
    clearButtons.forEach(buttonId => {
        const clearBtn = document.getElementById(buttonId);
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                // 查找父容器中的所有选中标签
                const parentContainer = this.closest('.flex.flex-wrap.gap-2.items-center');
                if (parentContainer) {
                    const selectedTags = parentContainer.querySelectorAll('.filter-tag.selected');
                    
                    // 移除所有选中状态
                    selectedTags.forEach(tag => {
                        tag.classList.remove('selected');
                    });
                    
                    // 隐藏清除按钮
                    this.style.display = 'none';
                    
                    // 获取筛选类型
                    const filterType = buttonId.replace('clear', '').replace('Btn', '');
                    console.log(`清除 ${filterType} 筛选`);
                    
                    // 显示提示
                    if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                        window.DAppCommon.showToast(
                            `已清除 ${getFilterTypeName(filterType)} 筛选`,
                            'success'
                        );
                    }
                }
            });
        }
    });
    
    // 处理主要的清空所有筛选按钮
    const clearAllBtn = document.getElementById('clearAllFiltersBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', handleClearAllFilters);
    }
    
    // 处理展开状态下的清空所有筛选按钮
    const clearAllBtn2 = document.getElementById('clearAllFiltersBtn2');
    if (clearAllBtn2) {
        clearAllBtn2.addEventListener('click', handleClearAllFilters);
    }
    
    function handleClearAllFilters() {
        console.log('清空所有筛选');
        
        // 移除所有选中的筛选标签
        const allSelectedTags = document.querySelectorAll('.filter-tag.selected');
        allSelectedTags.forEach(tag => {
            tag.classList.remove('selected');
        });
        
        // 隐藏所有清除按钮
        const allClearBtns = document.querySelectorAll('.clear-single-btn');
        allClearBtns.forEach(btn => {
            btn.style.display = 'none';
        });
        
        // 重置分类选择
        resetCategorySelection();
        
        // 清空搜索框
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // 显示提示
        if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
            window.DAppCommon.showToast('已清空所有筛选条件', 'success');
        }
    }
}

/**
 * 获取筛选类型名称
 */
function getFilterTypeName(filterType) {
    const typeNames = {
        'Price': '价格',
        'Rating': '评分',
        'Sales': '销量',
        'Time': '时间',
        'Type': '类型',
        'Seller': '商家',
        'Feature': '特色'
    };
    return typeNames[filterType] || filterType;
}

/**
 * 绑定商品卡片事件
 */
function bindProductCardEvents(container) {
    const productCards = container.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // 商品卡片点击事件 - 跳转到商品详情页面
        card.addEventListener('click', (e) => {
            // 如果点击的是购买按钮，不触发卡片点击事件
            if (e.target.closest('.buy-btn')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            const productName = card.querySelector('.product-title').textContent;
            const price = card.querySelector('.product-price').textContent;
            
            // 添加点击效果
            card.style.transform = 'scale(0.98)';
            card.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                card.style.transform = '';
            }, 100);
            
            // 获取商品完整信息
            const productElement = card.closest('[data-product-name]');
            const finalProductName = productElement?.getAttribute('data-product-name') || 
                              card.querySelector('.product-title')?.textContent?.trim() || 
                              productName;
            
            const priceElement = card.querySelector('.product-price');
            const finalPrice = priceElement?.textContent?.trim() || price;
            
            // 尝试从商品数据中获取完整信息
            let productData = null;
            
            // 从 allProducts 数组中查找匹配的商品
            if (typeof allProducts !== 'undefined') {
                productData = allProducts.find(product => 
                    product.title === finalProductName || 
                    product.title.includes(finalProductName) ||
                    finalProductName.includes(product.title)
                );
            }
            
            // 生成商品详情页URL（基于商品名称）
            const productSlug = finalProductName.toLowerCase()
                .replace(/[^\w\s-]/g, '') // 移除特殊字符
                .replace(/\s+/g, '-') // 空格替换为连字符
                .replace(/--+/g, '-') // 多个连字符合并为一个
                .trim();
            
            // 构建完整的URL参数
            let detailUrl = `product-detail.html?product=${encodeURIComponent(productSlug)}&name=${encodeURIComponent(finalProductName)}&price=${encodeURIComponent(finalPrice)}`;
            
            // 如果找到了完整的商品数据，添加更多参数
            if (productData) {
                detailUrl += `&category=${encodeURIComponent(productData.category)}`;
                if (productData.subcategory) {
                    detailUrl += `&subcategory=${encodeURIComponent(productData.subcategory)}`;
                }
                if (productData.description) {
                    detailUrl += `&description=${encodeURIComponent(productData.description)}`;
                }
                if (productData.rating) {
                    detailUrl += `&rating=${productData.rating}`;
                }
                if (productData.id) {
                    detailUrl += `&id=${productData.id}`;
                }
            }
            
            // 显示跳转提示
            if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                window.DAppCommon.showToast(
                    window.currentLang === 'zh' ? `正在查看 ${finalProductName} 详情...` : `Viewing ${finalProductName} details...`, 
                    'info'
                );
            }
            
            // 跳转到商品详情页
            setTimeout(() => {
                window.location.href = detailUrl;
            }, 300);
            
            console.log('Navigate to product detail via card click:', productName, price);
        });
        
        // 购买按钮
        const buyBtn = card.querySelector('.buy-btn');
        if (buyBtn) {
            buyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const productName = card.querySelector('.product-title').textContent;
                const price = card.querySelector('.product-price').textContent;
                
                // 按钮状态变化 - 添加加载效果
                const originalText = buyBtn.textContent;
                
                // 显示加载状态
                buyBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>正在跳转...';
                buyBtn.style.pointerEvents = 'none';
                
                // 保存对元素的引用，避免在setTimeout中this上下文丢失
                const currentCard = card;
                const currentBtn = buyBtn;
                
                // 模拟跳转延迟
                setTimeout(() => {
                    // 获取商品完整信息 - 使用保存的引用而不是this
                    const productElement = currentCard.closest('[data-product-name]');
                    const finalProductName = productElement?.getAttribute('data-product-name') || 
                                      currentCard.querySelector('.product-title')?.textContent?.trim() || 
                                      productName;
                    
                    const priceElement = currentCard.querySelector('.product-price');
                    const finalPrice = priceElement?.textContent?.trim() || price;
                    
                    // 尝试从商品数据中获取完整信息
                    let productData = null;
                    
                    // 从 allProducts 数组中查找匹配的商品
                    if (typeof allProducts !== 'undefined') {
                        productData = allProducts.find(product => 
                            product.title === finalProductName || 
                            product.title.includes(finalProductName) ||
                            finalProductName.includes(product.title)
                        );
                    }
                    
                    // 生成商品详情页URL（基于商品名称）
                    const productSlug = finalProductName.toLowerCase()
                        .replace(/[^\w\s-]/g, '') // 移除特殊字符
                        .replace(/\s+/g, '-') // 空格替换为连字符
                        .replace(/--+/g, '-') // 多个连字符合并为一个
                        .trim();
                    
                    // 构建完整的URL参数
                    let detailUrl = `product-detail.html?product=${encodeURIComponent(productSlug)}&name=${encodeURIComponent(finalProductName)}&price=${encodeURIComponent(finalPrice)}`;
                    
                    // 如果找到了完整的商品数据，添加更多参数
                    if (productData) {
                        detailUrl += `&category=${encodeURIComponent(productData.category)}`;
                        if (productData.subcategory) {
                            detailUrl += `&subcategory=${encodeURIComponent(productData.subcategory)}`;
                        }
                        if (productData.description) {
                            detailUrl += `&description=${encodeURIComponent(productData.description)}`;
                        }
                        if (productData.rating) {
                            detailUrl += `&rating=${productData.rating}`;
                        }
                        if (productData.id) {
                            detailUrl += `&id=${productData.id}`;
                        }
                    }
                    
                    // 显示跳转提示
                    if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                        window.DAppCommon.showToast(
                            window.currentLang === 'zh' ? `正在跳转到 ${finalProductName} 详情页...` : `Redirecting to ${finalProductName} details...`, 
                            'info'
                        );
                    }
                    
                    // 跳转到商品详情页
                    setTimeout(() => {
                        window.location.href = detailUrl;
                    }, 500);
                    
                }, 800);
                
                console.log('Navigate to product detail:', productName, price);
            });
        }
    });
}

/**
 * 初始化下拉菜单功能 - 增强子分类选择
 */
function initDropdownMenus() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown-menu');
        if (!dropdown) return;
        
        // 添加点击事件处理下拉菜单显示/隐藏
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 如果处于筛选模式，直接退出
            if (isFilterMode) return;
            
            // 关闭其他所有打开的下拉菜单
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // 切换当前下拉菜单
            dropdown.classList.toggle('show');
            
            console.log('切换下拉菜单:', this.querySelector('span[data-zh]')?.getAttribute('data-zh'));
        });
        
        // 处理下拉菜单项的点击
        const dropdownItems = dropdown.querySelectorAll('a');
        dropdownItems.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const subcategoryName = this.getAttribute('data-zh');
                const categorySpan = item.querySelector('span[data-zh]');
                const categoryName = categorySpan ? categorySpan.getAttribute('data-zh') : '';
                
                console.log('选择子分类进入筛选模式:', subcategoryName, '所属分类:', categoryName);
                
                // 关闭下拉菜单
                dropdown.classList.remove('show');
                
                // 更新分类选择状态
                updateCategorySelection(item);
                
                // 显示加载状态
                this.style.background = 'rgba(59, 130, 246, 0.3)';
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    // 进入筛选模式，传入子分类信息
                    switchToFilterMode(categoryName, '', subcategoryName);
                    
                    // 显示提示
                    if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                        window.DAppCommon.showToast(
                            `正在浏览 ${categoryName} > ${subcategoryName}`,
                            'info'
                        );
                    }
                    
                    // 恢复状态
                    this.style.background = '';
                    this.style.pointerEvents = 'auto';
                }, 500);
            });
        });
    });
    
    // 点击页面其他地方关闭所有下拉菜单
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}

/**
 * 更新分类选择状态
 */
function updateCategorySelection(selectedItem) {
    // 移除所有分类的 active 状态
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加当前分类的 active 状态
    selectedItem.classList.add('active');
}

/**
 * 修复下拉菜单层级问题
 */
function fixDropdownZIndex() {
    // 增强下拉菜单的z-index
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.style.zIndex = '99999';
        menu.style.position = 'absolute';
    });
    
    // 确保筛选区域的z-index较低
    const filterContainer = document.getElementById('filterContainer');
    if (filterContainer) {
        filterContainer.style.position = 'relative';
        filterContainer.style.zIndex = '1';
    }
    
    // 确保商品目录容器层级适中
    const categoryContainer = document.getElementById('categoryContainer');
    if (categoryContainer) {
        categoryContainer.style.position = 'relative';
        categoryContainer.style.zIndex = '10';
    }
    
    // 降低所有筛选相关元素的层级
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.style.position = 'relative';
        tag.style.zIndex = '1';
    });
    
    // 降低价格、评分、销量筛选行的层级
    const filterRows = document.querySelectorAll('#filterContainer > div > div');
    filterRows.forEach(row => {
        row.style.position = 'relative';
        row.style.zIndex = '1';
    });
}

/**
 * 初始化"更多"按钮功能
 */
function initMoreButtons() {
    const moreButtons = document.querySelectorAll('.category-more-btn');
    
    moreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('点击更多按钮');
            
            // 查找对应的分类信息
            const categoryCard = this.closest('.category-main-card');
            if (!categoryCard) return;
            
            // 获取分类名称
            const categoryTitle = categoryCard.querySelector('.category-main-info h3');
            let categoryName = '全部商品';
            
            if (categoryTitle) {
                const zhText = categoryTitle.getAttribute('data-zh');
                categoryName = zhText || categoryTitle.textContent.trim();
            }
            
            console.log('点击更多按钮，分类:', categoryName);
            
            // 显示加载状态
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span>加载中...</span>';
            this.style.pointerEvents = 'none';
            
            // 延迟进入筛选模式，给用户反馈
            setTimeout(() => {
                // 切换到筛选模式
                switchToFilterMode(categoryName);
                
                // 显示提示
                if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                    window.DAppCommon.showToast(
                        `正在浏览 ${categoryName} 分类的所有商品`,
                        'info'
                    );
                }
                
                // 恢复按钮状态（虽然已经切换页面了，但保险起见）
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
                
            }, 800);
        });
    });
}

/**
 * 初始化加载更多类别功能
 */
function initLoadMoreCategories() {
    const loadMoreBtn = document.getElementById('loadMoreCategories');
    let currentBatchIndex = 0;
    const batchSize = 3; // 每次加载3个类别
    
    // 准备所有待加载的类别数据
    const allAdditionalCategories = [
        // 第一批
        {
            name: '虚拟现实',
            nameEn: 'Virtual Reality',
            icon: 'fas fa-vr-cardboard',
            iconColor: 'from-cyan-500 to-blue-600',
            count: 28,
            products: [
                { title: 'VR教育平台', price: 899, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=300&h=200&fit=crop', description: '沉浸式虚拟现实教育平台，提供丰富的3D学习体验和互动课程。' },
                { title: 'VR游戏引擎', price: 1299, rating: 4.9, badge: 'epic', image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300&h=200&fit=crop', description: '专业的VR游戏开发引擎，支持多平台部署和高质量渲染。' },
                { title: '3D建模工具', price: 599, rating: 4.7, badge: 'tool', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: '高效的3D建模和渲染工具，适用于VR内容创作和设计。' },
                { title: 'VR社交空间', price: 399, rating: 4.6, badge: 'new', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '虚拟现实社交平台，支持多人在线互动和虚拟聚会。' },
                { title: 'VR训练模拟器', price: 1599, rating: 4.8, badge: 'legendary', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '专业级VR训练模拟器，用于职业技能培训和安全演练。' },
                { title: 'VR医疗系统', price: 2899, rating: 4.9, badge: 'epic', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop', description: '医疗级VR系统，用于手术培训和康复治疗。' },
                { title: 'VR购物体验', price: 799, rating: 4.5, badge: 'hot', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', description: '沉浸式虚拟购物体验，在线试用产品的全新方式。' },
                { title: 'VR房产展示', price: 999, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop', description: '虚拟现实房产展示系统，远程看房的革命性体验。' },
                { title: 'VR艺术画廊', price: 599, rating: 4.6, badge: 'art', image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop', description: '虚拟艺术画廊平台，沉浸式欣赏艺术作品。' },
                { title: 'VR健身系统', price: 699, rating: 4.8, badge: 'new', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', description: '虚拟现实健身平台，让运动变得更有趣。' },
                { title: 'VR会议室', price: 1199, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop', description: '专业VR会议解决方案，实现远程协作新体验。' },
                { title: 'VR驾驶培训', price: 2199, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop', description: '安全的VR驾驶培训系统，模拟各种路况。' },
                { title: 'VR建筑设计', price: 1899, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop', description: '沉浸式建筑设计和可视化VR工具。' },
                { title: 'VR旅游体验', price: 499, rating: 4.5, badge: 'hot', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop', description: '足不出户的VR旅游体验，探索世界名胜。' },
                { title: 'VR心理治疗', price: 1599, rating: 4.8, badge: 'new', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop', description: '专业VR心理治疗系统，辅助心理康复。' },
                { title: 'VR语言学习', price: 699, rating: 4.6, badge: 'featured', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop', description: '沉浸式语言学习VR环境，快速提升语言技能。' },
                { title: 'VR工业设计', price: 2299, rating: 4.9, badge: 'epic', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop', description: '工业级VR设计工具，提升产品开发效率。' },
                { title: 'VR音乐制作', price: 899, rating: 4.7, badge: 'art', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', description: '创新的VR音乐创作和演出平台。' },
                { title: 'VR安全培训', price: 1399, rating: 4.8, badge: 'tool', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '企业安全培训VR解决方案。' },
                { title: 'VR运动分析', price: 1099, rating: 4.6, badge: 'new', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', description: '专业运动员VR动作分析和训练系统。' },
                { title: 'VR电影制作', price: 3299, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', description: '专业VR电影制作和后期处理工具。' },
                { title: 'VR数据可视化', price: 1699, rating: 4.7, badge: 'tool', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '3D数据可视化VR平台，直观展示复杂数据。' },
                { title: 'VR协作设计', price: 1599, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '多人协作VR设计平台，实时同步创作。' },
                { title: 'VR模拟实验', price: 1299, rating: 4.6, badge: 'epic', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=200&fit=crop', description: '科学实验VR模拟环境，安全进行各种实验。' },
                { title: 'VR历史重现', price: 899, rating: 4.5, badge: 'art', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop', description: '历史场景VR重现，身临其境感受历史。' }
            ]
        },
        {
            name: 'NFT市场',
            nameEn: 'NFT Market',
            icon: 'fas fa-image',
            iconColor: 'from-rose-500 to-pink-600',
            count: 89,
            products: [
                { title: '艺术收藏NFT', price: 2199, rating: 4.9, badge: 'art', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop', description: '精选艺术家原创NFT收藏品，限量发行的数字艺术珍品。' },
                { title: '音乐NFT专辑', price: 799, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', description: '独家音乐NFT专辑，包含高品质音频和独特的视觉艺术。' },
                { title: '域名NFT', price: 1299, rating: 4.7, badge: 'hot', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop', description: '区块链域名NFT，永久拥有的去中心化网络身份标识。' },
                { title: 'PFP头像系列', price: 599, rating: 4.6, badge: 'mythical', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', description: '独特的PFP头像NFT系列，展现个性化的数字身份。' },
                { title: '游戏内NFT道具', price: 399, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop', description: '跨游戏通用的NFT道具，具有实用价值和收藏意义。' },
                { title: '数字时装NFT', price: 899, rating: 4.7, badge: 'new', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=200&fit=crop', description: '虚拟时装NFT系列，为您的数字形象增添时尚元素。' },
                { title: '体育收藏卡', price: 1599, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=200&fit=crop', description: '限量体育明星收藏卡NFT，具有稀有价值。' },
                { title: '动画NFT系列', price: 1099, rating: 4.6, badge: 'featured', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=200&fit=crop', description: '精美动画NFT作品集，展现动态艺术之美。' },
                { title: '3D模型NFT', price: 749, rating: 4.5, badge: 'tool', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop', description: '高质量3D模型NFT，适用于游戏和虚拟世界。' },
                { title: '摄影作品NFT', price: 649, rating: 4.8, badge: 'art', image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=300&h=200&fit=crop', description: '专业摄影师的数字摄影作品NFT收藏。' },
                { title: '像素艺术NFT', price: 399, rating: 4.5, badge: 'art', image: 'https://images.unsplash.com/photo-1614850523060-8da8d5acc9b1?w=300&h=200&fit=crop', description: '经典像素风格NFT艺术作品，致敬复古游戏文化。' },
                { title: '生成艺术NFT', price: 1299, rating: 4.8, badge: 'hot', image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=300&h=200&fit=crop', description: '算法生成的独特艺术NFT，每个都是独一无二的创作。' },
                { title: '虚拟地产NFT', price: 4999, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop', description: '元宇宙虚拟地产NFT，投资未来数字世界。' },
                { title: '会员卡NFT', price: 999, rating: 4.6, badge: 'featured', image: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=300&h=200&fit=crop', description: '专属会员权益NFT，享受特殊服务和优惠。' },
                { title: '证书NFT', price: 299, rating: 4.4, badge: 'tool', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop', description: '不可篡改的数字证书NFT，永久记录成就。' },
                { title: '票据NFT', price: 199, rating: 4.3, badge: 'new', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=200&fit=crop', description: '活动门票NFT，防伪且具有收藏价值。' },
                { title: '宠物NFT', price: 799, rating: 4.7, badge: 'mythical', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop', description: '可爱数字宠物NFT，可培养和交互的虚拟伙伴。' },
                { title: '漫画NFT', price: 1199, rating: 4.8, badge: 'art', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=200&fit=crop', description: '原创漫画作品NFT，支持创作者的数字版权。' },
                { title: 'Meme表情包NFT', price: 99, rating: 4.2, badge: 'hot', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop', description: '爆火Meme表情包NFT，网络文化的数字收藏。' },
                { title: '建筑设计NFT', price: 1899, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop', description: '建筑师原创设计图NFT，独特的建筑艺术作品。' },
                { title: '虚拟服装NFT', price: 599, rating: 4.5, badge: 'new', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=200&fit=crop', description: '时尚虚拟服装NFT，元宇宙中的潮流单品。' },
                { title: '收藏品盲盒NFT', price: 299, rating: 4.6, badge: 'mythical', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=300&h=200&fit=crop', description: '神秘盲盒NFT，开启惊喜收藏品。' },
                { title: '数字雕塑NFT', price: 1599, rating: 4.8, badge: 'art', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', description: '3D数字雕塑艺术NFT，立体艺术的数字化呈现。' },
                { title: '虚拟家具NFT', price: 399, rating: 4.4, badge: 'tool', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', description: '虚拟空间家具NFT，装饰您的数字住所。' },
                { title: '抽象艺术NFT', price: 999, rating: 4.6, badge: 'art', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop', description: '抽象艺术作品NFT，探索色彩与形状的无限可能。' }
            ]
        },
        {
            name: '加密钱包',
            nameEn: 'Crypto Wallet',
            icon: 'fas fa-wallet',
            iconColor: 'from-emerald-500 to-green-600',
            count: 24,
            products: [
                { title: '硬件钱包Pro', price: 399, rating: 4.9, badge: 'featured', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop', description: '军用级加密的硬件钱包，支持多种加密货币安全存储。' },
                { title: '多签钱包方案', price: 199, rating: 4.8, badge: 'tool', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '企业级多重签名钱包解决方案，提供最高级别的资产安全。' },
                { title: '移动钱包App', price: 0, rating: 4.7, badge: 'free', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop', description: '功能全面的移动端加密货币钱包，支持DeFi和NFT交易。' },
                { title: '浏览器钱包插件', price: 0, rating: 4.6, badge: 'free', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', description: '轻量级浏览器钱包插件，无缝集成Web3应用和DeFi协议。' },
                { title: '冷钱包存储器', price: 299, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&h=200&fit=crop', description: '离线冷存储钱包，提供最高级别的资产安全保护。' },
                { title: '企业钱包管理', price: 999, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop', description: '企业级钱包管理系统，支持团队协作和权限控制。' },
                { title: 'DeFi钱包套件', price: 159, rating: 4.7, badge: 'hot', image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=300&h=200&fit=crop', description: '专为DeFi优化的钱包，一键连接各大DeFi协议。' },
                { title: '智能合约钱包', price: 299, rating: 4.6, badge: 'new', image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&h=200&fit=crop', description: '基于智能合约的钱包，支持自动化交易和资产管理。' },
                { title: 'NFT钱包专版', price: 199, rating: 4.5, badge: 'art', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=200&fit=crop', description: '专为NFT收藏优化的钱包，完美展示您的数字收藏品。' },
                { title: '跨链钱包', price: 399, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '支持多条区块链的跨链钱包，统一管理多链资产。' },
                { title: '纸钱包生成器', price: 0, rating: 4.4, badge: 'free', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop', description: '安全的纸钱包生成工具，离线存储私钥。' },
                { title: '助记词钱包', price: 99, rating: 4.5, badge: 'tool', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', description: '基于助记词的HD钱包，方便备份和恢复。' },
                { title: '生物识别钱包', price: 599, rating: 4.7, badge: 'epic', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop', description: '支持指纹和面部识别的高安全性钱包。' },
                { title: '机构级钱包', price: 2999, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop', description: '金融机构专用钱包，满足监管要求。' },
                { title: '社交恢复钱包', price: 199, rating: 4.6, badge: 'new', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '通过社交网络恢复的创新钱包解决方案。' },
                { title: '法币网关钱包', price: 299, rating: 4.5, badge: 'featured', image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=300&h=200&fit=crop', description: '支持法币兑换的一站式钱包服务。' },
                { title: '游戏专用钱包', price: 199, rating: 4.4, badge: 'tool', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop', description: '为区块链游戏优化的专用钱包。' },
                { title: '闪电网络钱包', price: 99, rating: 4.3, badge: 'hot', image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&h=200&fit=crop', description: '支持比特币闪电网络的快速支付钱包。' },
                { title: '隐私币钱包', price: 399, rating: 4.6, badge: 'epic', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&h=200&fit=crop', description: '专为隐私币设计的匿名交易钱包。' },
                { title: '投票治理钱包', price: 199, rating: 4.5, badge: 'tool', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '支持DAO治理投票的专用钱包。' },
                { title: '质押专用钱包', price: 299, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=300&h=200&fit=crop', description: '专为代币质押优化的钱包解决方案。' },
                { title: '批量交易钱包', price: 499, rating: 4.6, badge: 'epic', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop', description: '支持批量操作的高效交易钱包。' },
                { title: '税务报告钱包', price: 299, rating: 4.4, badge: 'tool', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop', description: '自动生成税务报告的合规钱包。' },
                { title: '钱包即服务API', price: 999, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop', description: '为开发者提供的钱包API服务。' },
                { title: '学习型钱包', price: 0, rating: 4.2, badge: 'free', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop', description: '内置教程的新手友好型加密钱包。' }
            ]
        },
        // 第二批
        {
            name: '元宇宙',
            nameEn: 'Metaverse',
            icon: 'fas fa-globe',
            iconColor: 'from-teal-500 to-cyan-600',
            count: 45,
            products: [
                { title: '虚拟世界平台', price: 1899, rating: 4.9, badge: 'epic', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop', description: '完整的虚拟世界创建平台，支持用户自定义3D空间和社交体验。' },
                { title: '数字身份系统', price: 699, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '去中心化数字身份管理系统，跨平台统一虚拟形象。' },
                { title: '虚拟资产交易', price: 999, rating: 4.7, badge: 'hot', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: '元宇宙虚拟资产交易平台，支持土地、装备、道具的买卖。' },
                { title: '社交空间构建器', price: 599, rating: 4.6, badge: 'tool', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '可视化社交空间设计工具，轻松创建虚拟聚会场所。' },
                { title: '元宇宙游戏引擎', price: 1499, rating: 4.8, badge: 'legendary', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', description: '专为元宇宙打造的游戏引擎，支持大规模多人在线体验。' },
                { title: '虚拟土地系统', price: 2599, rating: 4.9, badge: 'epic', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop', description: '区块链虚拟土地所有权系统，投资您的数字房产。' },
                { title: '虚拟办公空间', price: 1299, rating: 4.7, badge: 'new', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop', description: '元宇宙办公环境，远程协作的全新体验。' },
                { title: '数字艺术展厅', price: 899, rating: 4.6, badge: 'art', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop', description: '虚拟艺术展览空间，展示和交易数字艺术品。' },
                { title: '虚拟活动平台', price: 1199, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1559223607-a43c990c692b?w=300&h=200&fit=crop', description: '举办虚拟活动的专业平台，支持大型线上聚会。' },
                { title: '元宇宙SDK工具', price: 799, rating: 4.5, badge: 'tool', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: '元宇宙应用开发工具包，快速构建虚拟世界应用。' }
            ]
        },
        {
            name: 'Web3社交',
            nameEn: 'Web3 Social',
            icon: 'fas fa-users',
            iconColor: 'from-amber-500 to-orange-600',
            count: 31,
            products: [
                { title: '去中心化社交网络', price: 299, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop', description: '基于区块链的社交网络平台，用户完全拥有数据主权。' },
                { title: 'DAO治理工具', price: 799, rating: 4.9, badge: 'tool', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '完整的DAO治理系统，支持提案、投票、执行的全流程管理。' },
                { title: '社区代币发行器', price: 599, rating: 4.7, badge: 'hot', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: '社区代币一键发行工具，帮助社区建立专属经济体系。' },
                { title: 'Web3聊天应用', price: 199, rating: 4.6, badge: 'new', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '端到端加密的Web3聊天应用，支持NFT头像和代币打赏。' },
                { title: '去中心化身份DID', price: 399, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', description: '去中心化数字身份解决方案，实现跨平台身份认证。' },
                { title: '社交代币经济', price: 899, rating: 4.7, badge: 'legendary', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', description: '基于代币的社交经济系统，创造价值分享机制。' },
                { title: '内容创作平台', price: 499, rating: 4.5, badge: 'art', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop', description: 'Web3内容创作和分发平台，创作者直接受益。' },
                { title: '链上声誉系统', price: 299, rating: 4.6, badge: 'featured', image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=300&h=200&fit=crop', description: '基于区块链的用户声誉和信用评估系统。' },
                { title: '社区治理协议', price: 699, rating: 4.8, badge: 'tool', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop', description: '去中心化社区治理协议，民主决策机制。' },
                { title: 'NFT社交网络', price: 599, rating: 4.7, badge: 'mythical', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop', description: '以NFT为核心的社交网络，展示和交流收藏品。' }
            ]
        },
        {
            name: 'DeFi协议',
            nameEn: 'DeFi Protocol',
            icon: 'fas fa-coins',
            iconColor: 'from-yellow-500 to-amber-600',
            count: 67,
            products: [
                { title: '流动性挖矿平台', price: 1299, rating: 4.9, badge: 'hot', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '高收益流动性挖矿平台，支持多种DeFi协议的收益优化。' },
                { title: '借贷协议套件', price: 999, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: '完整的去中心化借贷协议，支持超额抵押和闪电贷功能。' },
                { title: 'DEX聚合器', price: 699, rating: 4.7, badge: 'tool', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '多DEX聚合交易工具，智能路由获取最优交易价格。' },
                { title: '收益聚合器', price: 899, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', description: '自动化收益聚合器，智能分配资金到最优收益策略。' },
                { title: '跨链桥协议', price: 1599, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop', description: '安全的跨链资产桥接协议，支持主流区块链网络。' },
                { title: '合成资产协议', price: 1199, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop', description: '创建和交易合成资产的DeFi协议。' },
                { title: '预测市场平台', price: 799, rating: 4.6, badge: 'new', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', description: '去中心化预测市场，用智慧获得收益。' },
                { title: '保险协议', price: 599, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop', description: '去中心化保险协议，为DeFi资产提供保护。' },
                { title: '算法稳定币', price: 1399, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=200&fit=crop', description: '算法调节的去中心化稳定币系统。' },
                { title: '期权交易协议', price: 999, rating: 4.5, badge: 'tool', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop', description: '去中心化期权交易平台，高级金融衍生品。' }
            ]
        },
        // 第三批
        {
            name: '区块链基础设施',
            nameEn: 'Infrastructure',
            icon: 'fas fa-server',
            iconColor: 'from-slate-500 to-gray-600',
            count: 19,
            products: [
                { title: '节点服务器租赁', price: 299, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop', description: '专业区块链节点服务器租赁，提供稳定的网络连接服务。' },
                { title: 'API网关服务', price: 199, rating: 4.7, badge: 'tool', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '高性能区块链API网关，统一管理多链数据访问接口。' },
                { title: '去中心化存储', price: 599, rating: 4.9, badge: 'hot', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: '分布式存储网络服务，提供永久性数据存储解决方案。' },
                { title: '跨链中继服务', price: 999, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '专业跨链中继服务，实现不同区块链网络间的通信。' },
                { title: '区块链索引器', price: 399, rating: 4.6, badge: 'tool', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', description: '高效的区块链数据索引和查询服务。' },
                { title: 'RPC节点服务', price: 299, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&h=200&fit=crop', description: '稳定可靠的RPC节点服务，支持多链访问。' },
                { title: '链上数据分析', price: 799, rating: 4.8, badge: 'new', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '专业的区块链数据分析和可视化平台。' },
                { title: '去中心化CDN', price: 499, rating: 4.5, badge: 'legendary', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=200&fit=crop', description: '基于区块链的内容分发网络服务。' },
                { title: '智能合约监控', price: 699, rating: 4.9, badge: 'epic', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: '实时监控智能合约状态和性能的专业工具。' },
                { title: '区块链安全审计', price: 1299, rating: 4.8, badge: 'legendary', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop', description: '专业的区块链项目安全审计服务。' }
            ]
        },
        {
            name: '人工智能',
            nameEn: 'Artificial Intelligence',
            icon: 'fas fa-brain',
            iconColor: 'from-indigo-500 to-purple-600',
            count: 33,
            products: [
                { title: 'AI交易机器人', price: 1299, rating: 4.9, badge: 'hot', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '智能加密货币交易机器人，基于机器学习的量化交易策略。' },
                { title: 'NFT生成器', price: 699, rating: 4.8, badge: 'art', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop', description: 'AI驱动的NFT艺术生成器，创造独特的数字艺术作品。' },
                { title: '智能合约审计AI', price: 1599, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: 'AI智能合约安全审计工具，自动检测潜在安全漏洞。' },
                { title: '语言模型API', price: 399, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '专为Web3领域优化的大语言模型API服务。' },
                { title: '预测分析平台', price: 899, rating: 4.8, badge: 'tool', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', description: 'AI驱动的市场预测分析平台，提供精准的趋势预测。' },
                { title: 'AI代码生成器', price: 799, rating: 4.6, badge: 'new', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop', description: '智能代码生成工具，自动化智能合约开发。' },
                { title: '情感分析引擎', price: 499, rating: 4.5, badge: 'tool', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', description: '分析社交媒体情感的AI引擎，预测市场趋势。' },
                { title: 'AI风险评估', price: 999, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&h=200&fit=crop', description: '基于AI的DeFi项目风险评估系统。' },
                { title: '自动化投研AI', price: 1199, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: 'AI驱动的投资研究和分析助手。' },
                { title: '深度学习框架', price: 1499, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop', description: '专为区块链应用优化的深度学习开发框架。' }
            ]
        },
        {
            name: '物联网',
            nameEn: 'Internet of Things',
            icon: 'fas fa-microchip',
            iconColor: 'from-green-500 to-teal-600',
            count: 26,
            products: [
                { title: '物联网数据Oracle', price: 799, rating: 4.8, badge: 'featured', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop', description: '物联网设备数据上链Oracle服务，连接现实世界与区块链。' },
                { title: '设备身份认证', price: 299, rating: 4.7, badge: 'tool', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', description: '基于区块链的IoT设备身份认证和管理系统。' },
                { title: '智能家居控制器', price: 599, rating: 4.6, badge: 'new', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop', description: '支持加密货币支付的智能家居控制系统。' },
                { title: '供应链追溯系统', price: 1199, rating: 4.9, badge: 'epic', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', description: '基于物联网和区块链的产品供应链追溯解决方案。' },
                { title: '智能农业监控', price: 999, rating: 4.8, badge: 'hot', image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=200&fit=crop', description: '物联网智能农业监控系统，优化农作物生长。' },
                { title: '工业4.0平台', price: 1599, rating: 4.9, badge: 'legendary', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop', description: '工业物联网平台，实现智能制造和数字化工厂。' },
                { title: '车联网系统', price: 1299, rating: 4.7, badge: 'featured', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop', description: '基于区块链的车联网数据管理和服务系统。' },
                { title: '环境监测网络', price: 699, rating: 4.6, badge: 'tool', image: 'https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=300&h=200&fit=crop', description: '分布式环境监测物联网，实时追踪环境数据。' },
                { title: '能源管理IoT', price: 899, rating: 4.8, badge: 'epic', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', description: '智能能源管理物联网系统，优化能源使用效率。' },
                { title: '健康监测设备', price: 499, rating: 4.5, badge: 'new', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=300&h=200&fit=crop', description: '个人健康监测物联网设备，数据隐私保护。' }
            ]
        }
    ];
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('加载更多类别，当前批次:', currentBatchIndex);
            
            // 计算当前批次要加载的类别
            const startIndex = currentBatchIndex * batchSize;
            const endIndex = Math.min(startIndex + batchSize, allAdditionalCategories.length);
            const currentBatch = allAdditionalCategories.slice(startIndex, endIndex);
            
            if (currentBatch.length === 0) {
                console.log('没有更多类别可加载');
                return;
            }
            
            // 显示加载状态
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span data-zh="加载中..." data-en="Loading...">加载中...</span>';
            this.style.pointerEvents = 'none';
            
            // 模拟加载延迟
            setTimeout(() => {
                // 创建当前批次的类别
                createCategoriesBatch(currentBatch);
                
                currentBatchIndex++;
                
                // 检查是否还有更多类别
                const hasMoreCategories = (currentBatchIndex * batchSize) < allAdditionalCategories.length;
                
                if (hasMoreCategories) {
                    // 还有更多类别，恢复按钮
                    this.innerHTML = originalText;
                    this.style.pointerEvents = 'auto';
                    
                    // 显示提示
                    if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                        window.DAppCommon.showToast(`已加载 ${currentBatch.length} 个新类别，还有更多内容`, 'success');
                    }
                } else {
                    // 没有更多类别了
                    this.innerHTML = '<span data-zh="已加载全部类别" data-en="All Categories Loaded">已加载全部类别</span><i class="fas fa-check ml-2"></i>';
                    this.style.opacity = '0.6';
                    this.style.cursor = 'default';
                    this.style.pointerEvents = 'none';
                    
                    // 显示提示
                    if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                        window.DAppCommon.showToast('所有商品类别已全部加载完成！', 'info');
                    }
                }
                
                console.log(`加载批次 ${currentBatchIndex} 完成，加载了 ${currentBatch.length} 个类别`);
                
            }, 1500);
        });
    }
}

/**
 * 创建当前批次的类别
 */
function createCategoriesBatch(categoryBatch) {
    const container = document.querySelector('.space-y-6');
    const loadMoreContainer = container.querySelector('.flex.justify-center');
    
    // 在加载更多按钮前插入新类别
    categoryBatch.forEach(category => {
        const categoryCard = createCategoryCard(category);
        container.insertBefore(categoryCard, loadMoreContainer);
    });
    
    // 为新加载的卡片添加动画
    const newCards = container.querySelectorAll('.category-main-card');
    const lastNewCards = Array.from(newCards).slice(-categoryBatch.length);
    
    lastNewCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

/**
 * 创建类别卡片
 */
function createCategoryCard(categoryData) {
    const card = document.createElement('div');
    card.className = 'category-main-card';
    
    // 确保每个类别展示10个商品（2行5列）
    let displayProducts = [...categoryData.products];
    
    // 如果商品不足10个，重复前面的商品来填充到10个
    while (displayProducts.length < 10) {
        const remainingSlots = 10 - displayProducts.length;
        const productsToAdd = categoryData.products.slice(0, Math.min(categoryData.products.length, remainingSlots));
        displayProducts = displayProducts.concat(productsToAdd);
    }
    
    // 如果超过10个，只取前10个
    displayProducts = displayProducts.slice(0, 10);
    
    card.innerHTML = `
        <div class="category-main-header">
            <div class="category-main-title">
                <div class="category-main-icon bg-gradient-to-br ${categoryData.iconColor}">
                    <i class="${categoryData.icon}"></i>
                </div>
                <div class="category-main-info">
                    <h3 data-zh="${categoryData.name}" data-en="${categoryData.nameEn}">${categoryData.name}</h3>
                    <span class="category-item-count" data-zh="${categoryData.count}个商品" data-en="${categoryData.count} items">${categoryData.count}个商品</span>
                </div>
            </div>
            <button class="category-more-btn">
                <span data-zh="更多" data-en="More">更多</span>
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
        
        <!-- 商品网格 - 2行5列共10个商品 -->
        <div class="grid grid-cols-5 gap-4">
            ${displayProducts.map(product => createProductHTML(product)).join('')}
        </div>
    `;
    
    // 绑定新卡片的事件
    const moreBtn = card.querySelector('.category-more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('点击更多按钮，分类:', categoryData.name);
            
            // 显示加载状态
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span>加载中...</span>';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                // 切换到筛选模式
                switchToFilterMode(categoryData.name);
                
                // 显示提示
                if (typeof window.DAppCommon !== 'undefined' && window.DAppCommon.showToast) {
                    window.DAppCommon.showToast(
                        `正在浏览 ${categoryData.name} 分类的所有商品`,
                        'info'
                    );
                }
                
                // 恢复按钮状态
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
                
            }, 800);
        });
    }
    
    // 绑定商品卡片事件
    bindProductCardEvents(card);
    
    return card;
}

/**
 * 创建商品HTML（重用现有函数）
 */
function createProductHTML(product) {
    const badgeClass = getBadgeClass(product.badge);
    const badgeText = getBadgeText(product.badge);
    
    return `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-badges">
                    <div class="product-badge ${badgeClass}">${badgeText}</div>
                </div>
            </div>
            <div class="product-content">
                <h4 class="product-title">${product.title}</h4>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">${product.price === 0 ? '免费' : product.price}</span>
                    <div class="product-rating">
                        <i class="fas fa-star star"></i>
                        <span class="rating-text">${product.rating}</span>
                    </div>
                </div>
                <button class="buy-btn">${product.price === 0 ? '立即下载' : '立即购买'}</button>
            </div>
        </div>
    `;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化筛选和交互功能
    initFilterButton();
    initCategorySelection();
    initFilterTags();
    initClearButtons();
    initMoreFilters();
    initDropdownMenus();
    initMoreButtons();
    initLoadMoreCategories();
    fixDropdownZIndex();
    
    // 为页面上现有的所有商品卡片绑定事件
    const mainContainer = document.querySelector('.space-y-6');
    if (mainContainer) {
        bindProductCardEvents(mainContainer);
        console.log('All existing product cards events bound');
    }
    
    console.log('Marketplace filter functionality initialized');
}); 