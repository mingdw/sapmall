// 通用类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 用户相关类型
export interface User {
  id: string;
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
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 订单相关类型
export interface Order {
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
