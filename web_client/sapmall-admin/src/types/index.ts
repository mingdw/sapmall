// 通用类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// iframe传递的参数类型
export interface IframeParams {
  menu?: string;           // 目标菜单项
  userId?: string;         // 用户ID
  userToken?: string;      // 用户认证token
  userAddress?: string;    // 用户钱包地址
  userRoles?: string;      // 用户角色列表（逗号分隔）
  nickname?: string;       // 用户昵称
  status?: string;         // 用户状态
}

