import { Product } from '../services/types/productTypes';

/**
 * 将后端商品数据转换为前端显示格式
 */
export const transformProductForDisplay = (product: Product): Product => {
  return {
    ...product,
    // 使用后端返回的字段
    title: product.name,
    description: product.description,
    image: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x200',
    badges: generateProductBadges(product),
    categoryId: product.category1Id,
    categoryName: product.category1Code, // 可以根据需要映射到分类名称
    category: product.category1Code,
    rating: 4.5 + Math.random() * 0.5, // 临时随机评分
    // 兼容旧字段
    creator_id: product.creator_id || '',
    title_en: product.title_en || product.name,
    title_zh: product.title_zh || product.name,
    description_en: product.description_en || product.description,
    description_zh: product.description_zh || product.description,
    ipfs_hash: product.ipfs_hash || '',
    inventory: product.totalStock,
    sales_count: product.totalSales,
    created_at: product.created_at || Date.now() / 1000,
    updated_at: product.updated_at || Date.now() / 1000,
  };
};

/**
 * 生成商品徽章
 */
export const generateProductBadges = (product: Product): string[] => {
  const badges: string[] = [];
  
  // 使用新的字段名
  const salesCount = product.totalSales || product.sales_count || 0;
  const inventory = product.totalStock || product.inventory || 0;
  
  if (salesCount > 1000) {
    badges.push('热门');
  }
  if (inventory < 10) {
    badges.push('限量');
  }
  if (product.status === 1) { // 后端返回的是数字状态
    badges.push('在售');
  }
  if (salesCount > 500) {
    badges.push('精品');
  }
  if (product.status === 2) { // 假设2是推荐状态
    badges.push('推荐');
  }
  if (inventory === 0) {
    badges.push('售罄');
  }
  
  // 根据品牌添加特殊徽章
  if (product.brand?.includes('Legendary') || product.brand?.includes('传奇')) {
    badges.push('传奇');
  }
  if (product.brand?.includes('Mythical') || product.brand?.includes('神话')) {
    badges.push('神话');
  }
  if (product.brand?.includes('Epic') || product.brand?.includes('史诗')) {
    badges.push('史诗');
  }
  
  return badges;
};

/**
 * 格式化价格显示
 */
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'number' ? price : parseFloat(price);
  if (isNaN(numPrice)) return String(price);
  
  if (numPrice >= 1000) {
    return `${(numPrice / 1000).toFixed(1)}K SAP`;
  }
  return `${numPrice} SAP`;
};

/**
 * 格式化时间显示
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return '刚刚';
  }
};
