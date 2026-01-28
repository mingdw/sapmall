// 商品管理 Mock 数据
import type { ProductSPU, ProductStats } from '../../../pages/business/products/types';
import { ProductStatus } from '../../../pages/business/products/constants';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 格式化日期时间
const formatDateTime = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// Mock 商品列表数据
const mockProducts: ProductSPU[] = [
  {
    id: 1,
    code: 'SPU001',
    name: 'Sapphire NFT 数字艺术品 - 蓝宝石系列 #001',
    category1Id: 1,
    category1Code: 'CAT001',
    category2Id: 11,
    category2Code: 'CAT011',
    category3Id: 111,
    category3Code: 'CAT111',
    brand: 'Sapphire Art',
    description: '这是一件精美的蓝宝石主题数字艺术品，采用独特的算法生成，每个NFT都是独一无二的。',
    price: '1000',
    realPrice: '800',
    status: ProductStatus.ACTIVE,
    chainStatus: '已上链' as const,
    chainId: 1, // Ethereum Mainnet
    chainTxHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    images: JSON.stringify([
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
    ]),
    totalSales: 156,
    totalStock: 44,
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-20 14:20:00',
    creator: 'admin',
    updator: 'admin',
  },
  {
    id: 2,
    code: 'SPU002',
    name: 'Web3 虚拟商品 - 游戏道具包',
    category1Id: 2,
    category1Code: 'CAT002',
    category2Id: 21,
    category2Code: 'CAT021',
    category3Id: 211,
    category3Code: 'CAT211',
    brand: 'GameFi Studio',
    description: '包含多种游戏道具的虚拟商品包，可在支持的Web3游戏中使用。',
    price: '500',
    realPrice: '450',
    status: ProductStatus.ACTIVE,
    chainStatus: '同步中' as const,
    chainId: 56, // BSC
    chainTxHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    images: JSON.stringify([
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
    ]),
    totalSales: 89,
    totalStock: 211,
    createdAt: '2024-01-16 09:15:00',
    updatedAt: '2024-01-19 16:45:00',
    creator: 'admin',
    updator: 'admin',
  },
  {
    id: 3,
    code: 'SPU003',
    name: 'DeFi 代币权益卡 - 高级会员',
    category1Id: 3,
    category1Code: 'CAT003',
    category2Id: 31,
    category2Code: 'CAT031',
    category3Id: 311,
    category3Code: 'CAT311',
    brand: 'DeFi Platform',
    description: '高级会员权益卡，享受平台交易手续费折扣、优先参与新项目等特权。',
    price: '2000',
    realPrice: '1800',
    status: ProductStatus.PENDING,
    chainStatus: '未上链' as const,
    images: JSON.stringify([
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
    ]),
    totalSales: 0,
    totalStock: 100,
    createdAt: '2024-01-18 11:20:00',
    updatedAt: '2024-01-18 11:20:00',
    creator: 'admin',
    updator: 'admin',
  },
  {
    id: 4,
    code: 'SPU004',
    name: '区块链域名 - .sap 域名',
    category1Id: 1,
    category1Code: 'CAT001',
    category2Id: 12,
    category2Code: 'CAT012',
    category3Id: 121,
    category3Code: 'CAT121',
    brand: 'Sapphire DNS',
    description: '去中心化域名服务，支持.sap后缀的区块链域名注册和交易。',
    price: '300',
    realPrice: '280',
    status: ProductStatus.ACTIVE,
    chainStatus: '已上链' as const,
    chainId: 137, // Polygon
    chainTxHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    images: JSON.stringify([
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
    ]),
    totalSales: 234,
    totalStock: 766,
    createdAt: '2024-01-10 08:00:00',
    updatedAt: '2024-01-20 10:30:00',
    creator: 'admin',
    updator: 'admin',
  },
  {
    id: 5,
    code: 'SPU005',
    name: 'NFT 盲盒系列 - 神秘宝箱',
    category1Id: 1,
    category1Code: 'CAT001',
    category2Id: 11,
    category2Code: 'CAT011',
    category3Id: 112,
    category3Code: 'CAT112',
    brand: 'Mystery Box',
    description: '神秘NFT盲盒，开启后随机获得稀有度不同的NFT艺术品，包含SSR、SR、R等不同等级。',
    price: '150',
    realPrice: '120',
    status: ProductStatus.ACTIVE,
    chainStatus: '同步失败' as const,
    images: JSON.stringify([
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
    ]),
    totalSales: 567,
    totalStock: 433,
    createdAt: '2024-01-12 14:30:00',
    updatedAt: '2024-01-20 15:00:00',
    creator: 'admin',
    updator: 'admin',
  },
  {
    id: 6,
    code: 'SPU006',
    name: '元宇宙土地 - 虚拟地块',
    category1Id: 4,
    category1Code: 'CAT004',
    category2Id: 41,
    category2Code: 'CAT041',
    category3Id: 411,
    category3Code: 'CAT411',
    brand: 'Metaverse Land',
    description: '虚拟世界中的土地NFT，可用于建设、租赁或交易，具有稀缺性和投资价值。',
    price: '5000',
    realPrice: '4800',
    status: ProductStatus.INACTIVE,
    chainStatus: '未上链' as const,
    images: JSON.stringify([
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
    ]),
    totalSales: 12,
    totalStock: 88,
    createdAt: '2024-01-05 10:00:00',
    updatedAt: '2024-01-15 09:00:00',
    creator: 'admin',
    updator: 'admin',
  },
  {
    id: 7,
    code: 'SPU007',
    name: '智能合约服务 - 代币发行',
    category1Id: 5,
    category1Code: 'CAT005',
    category2Id: 51,
    category2Code: 'CAT051',
    category3Id: 511,
    category3Code: 'CAT511',
    brand: 'Smart Contract Lab',
    description: '提供ERC-20代币发行服务，包含智能合约部署、代币配置、白名单管理等完整服务。',
    price: '10000',
    realPrice: '9500',
    status: ProductStatus.DRAFT,
    chainStatus: '未上链' as const,
    images: JSON.stringify([
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
    ]),
    totalSales: 0,
    totalStock: 0,
    createdAt: '2024-01-20 16:00:00',
    updatedAt: '2024-01-20 16:00:00',
    creator: 'admin',
    updator: 'admin',
  },
  {
    id: 8,
    code: 'SPU008',
    name: 'Web3 课程 - 区块链开发入门',
    category1Id: 6,
    category1Code: 'CAT006',
    category2Id: 61,
    category2Code: 'CAT061',
    category3Id: 611,
    category3Code: 'CAT611',
    brand: 'Web3 Academy',
    description: '系统化的区块链开发课程，从基础到进阶，包含Solidity、智能合约部署、DApp开发等内容。',
    price: '800',
    realPrice: '600',
    status: ProductStatus.ACTIVE,
    chainStatus: '已上链' as const,
    chainId: 8453, // Base
    chainTxHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    images: JSON.stringify([
      'https://sap01-1251895040.cos.ap-guangzhou.myqcloud.com/products_v1/20250506/b1f1ee54-895c-42b3-bbb5-e5f6e73bb795.jpg',
    ]),
    totalSales: 345,
    totalStock: 155,
    createdAt: '2024-01-08 09:00:00',
    updatedAt: '2024-01-19 11:30:00',
    creator: 'admin',
    updator: 'admin',
  },
];

// Mock 统计数据
const mockStats: Record<'day' | 'week' | 'month', ProductStats> = {
  day: {
    totalProducts: 8,
    totalOrders: 156,
    totalRevenue: '125,680',
    newUsers: 23,
    totalProductsTrend: '+2',
    totalOrdersTrend: '+12.5%',
    totalRevenueTrend: '+8.3%',
    newUsersTrend: '+15.0%',
  },
  week: {
    totalProducts: 8,
    totalOrders: 1024,
    totalRevenue: '856,320',
    newUsers: 156,
    totalProductsTrend: '+3',
    totalOrdersTrend: '+25.8%',
    totalRevenueTrend: '+18.6%',
    newUsersTrend: '+22.4%',
  },
  month: {
    totalProducts: 8,
    totalOrders: 4567,
    totalRevenue: '3,856,900',
    newUsers: 678,
    totalProductsTrend: '+5',
    totalOrdersTrend: '+45.2%',
    totalRevenueTrend: '+32.1%',
    newUsersTrend: '+38.7%',
  },
};

// 模拟 API 响应
export const mockProductApi = {
  // 获取商品列表
  getProductList: async (params: any = {}) => {
    await delay(500); // 模拟网络延迟
    
    let filteredProducts = [...mockProducts];
    
    // 按商品名称搜索
    if (params.productName) {
      const searchTerm = params.productName.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.code.toLowerCase().includes(searchTerm)
      );
    }
    
    // 按状态筛选
    if (params.status !== undefined && params.status !== '') {
      filteredProducts = filteredProducts.filter(p => p.status === params.status);
    }
    
    // 按分类筛选
    if (params.categoryCodes) {
      const categoryCodes = params.categoryCodes.split(',').map((c: string) => c.trim());
      filteredProducts = filteredProducts.filter(p => 
        categoryCodes.includes(p.category1Code) ||
        categoryCodes.includes(p.category2Code) ||
        categoryCodes.includes(p.category3Code)
      );
    }
    
    // 分页
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProducts = filteredProducts.slice(start, end);
    
    return {
      code: 0,
      message: 'success',
      data: {
        list: paginatedProducts,
        total: filteredProducts.length,
      },
    };
  },
  
  // 获取商品详情
  getProductDetail: async (id: number) => {
    await delay(300);
    
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return {
        code: 404,
        message: '商品不存在',
        data: null,
      };
    }
    
    return {
      code: 0,
      message: 'success',
      data: product,
    };
  },
  
  // 保存商品（新增/编辑）
  saveProduct: async (data: any) => {
    await delay(800);
    
    if (data.id && data.id > 0) {
      // 编辑
      const index = mockProducts.findIndex(p => p.id === data.id);
      if (index === -1) {
        return {
          code: 404,
          message: '商品不存在',
          data: null,
        };
      }
      
      const updatedProduct: ProductSPU = {
        ...mockProducts[index],
        ...data,
        updatedAt: formatDateTime(),
        updator: 'admin',
      };
      
      mockProducts[index] = updatedProduct;
      
      return {
        code: 0,
        message: '更新成功',
        data: updatedProduct,
      };
    } else {
      // 新增
      const newProduct: ProductSPU = {
        id: mockProducts.length + 1,
        code: data.code || `SPU${String(mockProducts.length + 1).padStart(3, '0')}`,
        name: data.name,
        category1Id: data.category1Id,
        category1Code: data.category1Code,
        category2Id: data.category2Id || 0,
        category2Code: data.category2Code || '',
        category3Id: data.category3Id || 0,
        category3Code: data.category3Code || '',
        brand: data.brand || '',
        description: data.description || '',
        price: data.price || '0',
        realPrice: data.realPrice || data.price || '0',
        status: data.status,
        images: data.images || JSON.stringify([]),
        totalSales: 0,
        totalStock: 0,
        createdAt: formatDateTime(),
        updatedAt: formatDateTime(),
        creator: 'admin',
        updator: 'admin',
      };
      
      mockProducts.push(newProduct);
      
      return {
        code: 0,
        message: '创建成功',
        data: newProduct,
      };
    }
  },
  
  // 删除商品
  deleteProduct: async (id: number) => {
    await delay(400);
    
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return {
        code: 404,
        message: '商品不存在',
        data: null,
      };
    }
    
    mockProducts.splice(index, 1);
    
    return {
      code: 0,
      message: '删除成功',
      data: null,
    };
  },
  
  // 批量删除商品
  batchDeleteProducts: async (ids: number[]) => {
    await delay(600);
    
    ids.forEach(id => {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
      }
    });
    
    return {
      code: 0,
      message: '批量删除成功',
      data: null,
    };
  },
  
  // 批量下架商品
  batchDeactivateProducts: async (ids: number[]) => {
    await delay(500);
    
    ids.forEach(id => {
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        product.status = ProductStatus.INACTIVE;
        product.updatedAt = formatDateTime();
        product.updator = 'admin';
      }
    });
    
    return {
      code: 0,
      message: '批量下架成功',
      data: null,
    };
  },
  
  // 获取商品统计信息
  getProductStats: async (period: 'day' | 'week' | 'month' = 'day') => {
    await delay(400);
    
    return {
      code: 0,
      message: 'success',
      data: mockStats[period],
    };
  },
  
  // 导出商品数据
  exportProducts: async (params: any) => {
    await delay(1000);
    
    // 模拟导出文件
    const csvContent = [
      ['商品编码', '商品名称', '分类', '价格', '状态', '销量', '库存'].join(','),
      ...mockProducts.map(p => [
        p.code,
        p.name,
        `${p.category1Code}/${p.category2Code}/${p.category3Code}`,
        p.price,
        p.status === ProductStatus.ACTIVE ? '上架中' : 
        p.status === ProductStatus.PENDING ? '待审核' :
        p.status === ProductStatus.INACTIVE ? '已下架' : '草稿',
        p.totalSales,
        p.totalStock,
      ].join(',')),
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    return blob;
  },
};
