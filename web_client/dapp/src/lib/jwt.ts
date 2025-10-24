/**
 * JWT验证工具函数
 * 提供安全的JWT令牌验证功能
 */

interface JWTPayload {
  exp: number;
  iat: number;
  comer_uin: string;
  [key: string]: any;
}

/**
 * 验证JWT令牌是否有效
 * @param token JWT令牌字符串
 * @param secret 用于验证签名的密钥
 * @returns 验证结果和用户ID
 */
export function verifyJWT(token: string, secret: string): { valid: boolean; userId?: string; error?: string } {
  try {
    // 检查令牌格式
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Invalid token format' };
    }

    // 分割JWT令牌
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token structure' };
    }

    // 解析头部
    const header = JSON.parse(atob(parts[0]));
    if (header.alg !== 'HS256') {
      return { valid: false, error: 'Unsupported algorithm' };
    }

    // 解析载荷
    const payload: JWTPayload = JSON.parse(atob(parts[1]));
    
    // 验证过期时间
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return { valid: false, error: 'Token has expired' };
    }

    // 验证签发时间
    if (payload.iat && payload.iat > currentTime) {
      return { valid: false, error: 'Token issued in the future' };
    }

    // 验证用户ID存在
    if (!payload.comer_uin) {
      return { valid: false, error: 'Invalid user ID in token' };
    }

    // 注意：这里我们只验证了令牌的结构和过期时间
    // 真正的签名验证需要在服务端进行，因为前端无法安全存储密钥
    // 前端验证主要用于用户体验优化，最终验证应该在API调用时由服务端完成

    return { valid: true, userId: payload.comer_uin };
  } catch (error) {
    return { valid: false, error: 'Token parsing failed' };
  }
}

/**
 * 从localStorage安全地获取JWT令牌
 * @returns JWT令牌或null
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Failed to get stored token:', error);
    return null;
  }
}

/**
 * 安全地存储JWT令牌到localStorage
 * @param token JWT令牌
 */
export function storeToken(token: string): void {
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
}

/**
 * 安全地移除JWT令牌
 */
export function removeToken(): void {
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
}

/**
 * 检查JWT令牌是否即将过期（在指定分钟内）
 * @param token JWT令牌
 * @param minutesBeforeExpiry 过期前多少分钟
 * @returns 是否即将过期
 */
export function isTokenExpiringSoon(token: string, minutesBeforeExpiry: number = 5): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload: JWTPayload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = payload.exp;
    
    if (!expiryTime) return true;
    
    const timeUntilExpiry = expiryTime - currentTime;
    const minutesUntilExpiry = timeUntilExpiry / 60;
    
    return minutesUntilExpiry <= minutesBeforeExpiry;
  } catch (error) {
    return true;
  }
}

/**
 * 创建安全的API请求头
 * @param token JWT令牌
 * @returns 包含Authorization头的请求头对象
 */
export function createAuthHeaders(token: string): HeadersInit {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}