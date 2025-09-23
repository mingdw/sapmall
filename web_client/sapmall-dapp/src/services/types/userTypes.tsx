// 用户相关类型定义，与后端Go模型保持一致
export interface User {
  id: number;
  unique_id: string;
  user_code: string;
  nickname: string;
  avatar: string;
  gender: number;
  birthday: string | null;
  email: string;
  phone: string;
  password: string;
  status: number;
  status_desc: string;
  type: number;
  type_desc: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
  creator: string;
  updator: string;
  user_roles?: UserRole[];
}

// 登录接口返回的用户信息（简化版）
export interface LoginUserInfo {
  id: number;
  address: string;
  nickname: string;
  avatar: string;
  status: number;
  roles: string[];
  created_at: string;
  updated_at: string;
}

// 登录接口响应
export interface LoginResp {
  token: string;
  user_info: LoginUserInfo;
}

// 用户角色类型
export interface UserRole {
  id: number;
  role_name: string;
  role_code: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 0, // 正常
  INACTIVE = 1, // 禁用
  DELETED = 2 // 删除
}

// 用户类型枚举
export enum UserType {
  ADMIN = 0,
  MERCHANT = 1,
  USER = 2
}

// 性别枚举
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2
}

// API请求类型
export interface GetUserInfoRequest {
  user_id: number;
}

export interface CreateUserRequest {
  unique_id?: string;
  user_code: string;
  nickname: string;
  avatar?: string;
  gender?: number;
  birthday?: string;
  email: string;
  phone: string;
  password: string;
  status?: number;
  type?: number;
  creator: string;
}

export interface UpdateUserRequest {
  id: number;
  nickname?: string;
  avatar?: string;
  gender?: number;
  birthday?: string;
  email?: string;
  phone?: string;
  status?: number;
  type?: number;
  updator: string;
}

export interface GetUserListRequest {
  page: number;
  page_size: number;
  keyword?: string;
  status?: number;
  type?: number;
  gender?: number;
  start_date?: string;
  end_date?: string;
}

export interface ChangePasswordRequest {
  user_id: number;
  old_password: string;
  new_password: string;
}

export interface ResetPasswordRequest {
  user_id: number;
  new_password: string;
  updator: string;
}

// API响应类型
export interface GetUserInfoResponse {
  code: number;
  message: string;
  data: User;
}

export interface GetUserListResponse {
  code: number;
  message: string;
  data: {
    list: User[];
    total: number;
    page: number;
    page_size: number;
  };
}

export interface CreateUserResponse {
  code: number;
  message: string;
  data: User;
}

export interface UpdateUserResponse {
  code: number;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  code: number;
  message: string;
  data: null;
}

export interface ChangePasswordResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
  };
}

export interface ResetPasswordResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
  };
}

// 用户统计信息
export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  new_users_today: number;
  new_users_this_month: number;
}

export interface GetUserStatsResponse {
  code: number;
  message: string;
  data: UserStats;
}
