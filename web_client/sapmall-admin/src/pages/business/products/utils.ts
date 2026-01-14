// 商品管理工具函数

import { ProductStatus, PRODUCT_STATUS_CONFIG, CHAIN_STATUS_CONFIG } from './constants';
import type { ProductStats, ChainStatus } from './types';

/**
 * 解析趋势字符串，转换为StatCard需要的格式
 * @param trendStr 趋势字符串，如 "+5.2%" 或 "-2.1%"
 * @returns trend对象或undefined
 */
export const parseTrend = (trendStr?: string): { value: string; type: 'positive' | 'negative' | 'neutral' } | undefined => {
  if (!trendStr) return undefined;
  
  const trimmed = trendStr.trim();
  if (trimmed.startsWith('+')) {
    return {
      value: trimmed,
      type: 'positive',
    };
  } else if (trimmed.startsWith('-')) {
    return {
      value: trimmed,
      type: 'negative',
    };
  } else {
    return {
      value: trimmed,
      type: 'neutral',
    };
  }
};

/**
 * 解析商品图片字符串
 * @param images 图片字符串（JSON或逗号分隔）
 * @returns 图片URL数组
 */
export const parseProductImages = (images?: string): string[] => {
  if (!images) return [];
  
  try {
    // 尝试解析JSON
    if (images.trim().startsWith('[') || images.trim().startsWith('{')) {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    // 按逗号分割
    return images.split(',').map(url => url.trim()).filter(Boolean);
  } catch {
    // 解析失败，按逗号分割
    return images.split(',').map(url => url.trim()).filter(Boolean);
  }
};

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export const formatDateTime = (date?: string | Date): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
};

/**
 * 获取商品状态标签配置
 * @param status 商品状态
 * @returns 状态配置对象
 */
export const getProductStatusConfig = (status: ProductStatus) => {
  return PRODUCT_STATUS_CONFIG[status] || PRODUCT_STATUS_CONFIG[ProductStatus.DRAFT];
};

/**
 * 检查是否为有效的商品状态
 * @param status 状态值
 * @returns 是否为有效状态
 */
export const isValidProductStatus = (status: any): status is ProductStatus => {
  return Object.values(ProductStatus).includes(status);
};

/**
 * 获取链上状态标签配置
 * @param chainStatus 链上状态
 * @returns 状态配置对象
 */
export const getChainStatusConfig = (chainStatus?: ChainStatus) => {
  if (!chainStatus) {
    return { color: 'default' as const, text: '未上链' };
  }
  const validStatuses: Array<keyof typeof CHAIN_STATUS_CONFIG> = ['未上链', '同步中', '已上链', '同步失败'];
  if (validStatuses.includes(chainStatus as keyof typeof CHAIN_STATUS_CONFIG)) {
    return CHAIN_STATUS_CONFIG[chainStatus as keyof typeof CHAIN_STATUS_CONFIG];
  }
  return { color: 'default' as const, text: '未上链' };
};

/**
 * 根据链ID获取区块链浏览器URL
 * @param chainId 链ID
 * @param txHash 交易哈希
 * @returns 区块链浏览器URL
 */
export const getBlockchainExplorerUrl = (chainId?: number, txHash?: string): string | null => {
  if (!chainId || !txHash) {
    return null;
  }

  // 根据链ID返回对应的区块链浏览器URL
  const explorerMap: Record<number, string> = {
    1: 'https://etherscan.io/tx/',           // Ethereum Mainnet
    5: 'https://goerli.etherscan.io/tx/',    // Goerli
    11155111: 'https://sepolia.etherscan.io/tx/', // Sepolia
    17000: 'https://holesky.etherscan.io/tx/', // Holesky
    56: 'https://bscscan.com/tx/',           // BSC
    97: 'https://testnet.bscscan.com/tx/',   // BSC Testnet
    137: 'https://polygonscan.com/tx/',      // Polygon
    80001: 'https://mumbai.polygonscan.com/tx/', // Polygon Mumbai
    8453: 'https://basescan.org/tx/',        // Base
    84532: 'https://sepolia.basescan.org/tx/', // Base Sepolia
    42161: 'https://arbiscan.io/tx/',        // Arbitrum
    421613: 'https://goerli.arbiscan.io/tx/', // Arbitrum Goerli
    10: 'https://optimistic.etherscan.io/tx/', // Optimism
    420: 'https://goerli-optimism.etherscan.io/tx/', // Optimism Goerli
  };

  const baseUrl = explorerMap[chainId];
  if (!baseUrl) {
    // 默认使用以太坊浏览器
    return `https://etherscan.io/tx/${txHash}`;
  }

  return `${baseUrl}${txHash}`;
};
