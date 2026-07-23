import baseClient from './baseClient';

/** CCTP burn 参数（depositForBurn V2） */
export interface CctpBurnParams {
  sourceChainId: number;
  destinationDomain: number;
  tokenMessenger: string;
  usdc: string;
  amount: string;
  mintRecipient: string;
  minFinalityThreshold: number;
  destinationCaller: string;
  /** Fast Transfer 最大手续费（USDC 最小单位） */
  maxFee: string;
}

export interface CreateCctpIntentResp {
  intentId: string;
  status: number;
  tokenSymbol: string;
  tokenDecimals: number;
  burnParams: CctpBurnParams;
}

export interface CctpIntentStatus {
  intentId: string;
  userAddress: string;
  sourceChainId: number;
  destChainId: number;
  sourceDomain: number;
  destDomain: number;
  tokenSymbol: string;
  tokenDecimals: number;
  amountIn: string;
  burnTxHash?: string;
  burnGasFee?: string;
  messageHash?: string;
  mintTxHash?: string;
  mintGasFee?: string;
  swapTxHash?: string;
  swapGasFee?: string;
  status: number;
  statusDesc: string;
  errorMsg?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** CCTP 跨链兑换 API */
export const cctpApi = {
  /** 创建 burn 意图 */
  async createIntent(params: {
    sourceChainId: number;
    destChainId: number;
    amountIn: string;
    tokenSymbol?: string;
    tokenDecimals?: number;
  }): Promise<CreateCctpIntentResp> {
    const resp = await baseClient.post<CreateCctpIntentResp>('/api/cctp/intent/create', params, { timeout: 20000 });
    return resp.data;
  },

  /** 提交 burn 交易哈希与 Gas */
  async submitBurn(intentId: string, burnTxHash: string, burnGasFee?: string): Promise<void> {
    await baseClient.post('/api/cctp/intent/burn-submitted', {
      intentId,
      burnTxHash,
      ...(burnGasFee ? { burnGasFee } : {}),
    });
  },

  /** 查询意图状态 */
  async getIntent(intentId: string): Promise<CctpIntentStatus> {
    const resp = await baseClient.get<CctpIntentStatus>(`/api/cctp/intent/${encodeURIComponent(intentId)}`);
    return resp.data;
  },

  /** 提交 Arc swap 交易哈希与 Gas */
  async submitSwap(intentId: string, swapTxHash: string, swapGasFee?: string): Promise<void> {
    await baseClient.post('/api/cctp/intent/swap-submitted', {
      intentId,
      swapTxHash,
      ...(swapGasFee ? { swapGasFee } : {}),
    });
  },
};

export default cctpApi;
