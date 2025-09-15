import baseClient from "./baseClient";

// 定义类型
interface GetNonceByAddressResp {
  nonce: string;
}

interface LoginReq {
  wallet_address: string;
  signature: string;
}

interface LoginResp {
  token: string;
  user_id: string;
}

interface HealthCheckResp {
  status: string;
  time: number;
}

interface VersionResp {
  version: string;
  build_time: string;
  git_commit: string;
  go_version: string;
}

export const commonApiService = {  
  // 获取随机数 - 修正路径参数
  getNonceByAddress: async (address: string): Promise<GetNonceByAddressResp> => {
    const response = await baseClient.get<GetNonceByAddressResp>(`/api/common/${address}/nonce`, {
      skipAuth: true, // 获取nonce不需要认证
    });
    return response.data;
  },

  // 登录
  login: async (walletAddress: string, signature: string): Promise<LoginResp> => {
    const response = await baseClient.post<LoginResp>('/api/common/login', {
      wallet_address: walletAddress,
      signature: signature,
    }, {
      skipAuth: true, // 登录不需要认证
    });
    return response.data;
  },

  // 健康检查
  healthCheck: async (service?: string): Promise<HealthCheckResp> => {
    const response = await baseClient.get<HealthCheckResp>('/api/common/health', {
      skipAuth: true, // 健康检查不需要认证
    });
    return response.data;
  },

  // 获取版本信息
  getVersion: async (): Promise<VersionResp> => {
    const response = await baseClient.get<VersionResp>('/api/common/version', {
      skipAuth: true, // 版本信息不需要认证
    });
    return response.data;
  },
};