// 通用类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 用户相关类型
export interface User {
  id: string;
  address: string;
  username: string;
  email: string;
  role: 'admin' | 'merchant' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 商品相关类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// 订单相关类型
export interface Order {
  id: string;
  buyerAddress: string;
  sellerAddress: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  txHash?: string;
  createdAt: string;
  updatedAt: string;
}

// 钱包相关类型
export interface Wallet {
  address: string;
  balance: number;
  currency: string;
  isConnected: boolean;
}

// DAO相关类型
export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}
