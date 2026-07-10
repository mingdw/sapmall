// ========== 交易管理类型定义（个人视角 · 细粒度） ==========

/** 交易方向 */
export type TxDirection = 'in' | 'out' | 'self';

/** 交易类型（比余额管理更细分） */
export type TxType =
  | 'payment'      // 商品支付
  | 'refund'       // 退款
  | 'swap'         // 兑换
  | 'transfer'     // 转账
  | 'stake'        // 质押
  | 'unstake'      // 解除质押
  | 'claim'        // 领取奖励
  | 'approval'     // 授权
  | 'contract';    // 合约交互

/** 交易状态 */
export type TxStatus = 'success' | 'pending' | 'failed' | 'dropped';

/** 代币符号 */
export type TokenSymbol = 'SAP' | 'USDC' | 'EURC' | 'cirBTC' | 'ETH';

/** 链网络标识 */
export interface ChainInfo {
  chainId: number;
  chainName: string;
  nativeSymbol: string;
  explorerUrl: string;
}

/** 交易记录 — 细粒度版 */
export interface TxRecord {
  id: number;
  txHash: string;
  type: TxType;
  direction: TxDirection;
  from: string;
  to: string;
  contractAddress?: string;   // 交互的合约地址
  methodName?: string;        // 调用的合约方法
  amount: number;
  tokenSymbol: TokenSymbol;
  tokenDecimals: number;
  chainId: number;
  chainName: string;
  status: TxStatus;
  blockNumber: number;
  confirmations: number;
  nonce: number;
  gasUsed: number;            // 实际消耗 Gas
  gasPrice: number;           // Gas 单价（Gwei）
  gasFeeNative: number;       // 原生代币手续费
  gasFeeUSD: number;          // USD 手续费
  timestamp: string;
  memo?: string;
  orderId?: string;           // 关联订单号
}

/** 交易统计概览 */
export interface TxSummary {
  totalCount: number;
  successCount: number;
  pendingCount: number;
  failedCount: number;
  totalVolumeUSD: number;     // 交易总金额（USD）
  totalGasFeeUSD: number;     // 总 Gas 费（USD）
  successRate: number;        // 成功率 %
  avgGasFeeUSD: number;       // 平均 Gas 费
}

/** 日期范围筛选 */
export interface DateRange {
  start: string;
  end: string;
}

/** 筛选条件 */
export interface TxFilter {
  type: TxType | 'all';
  status: TxStatus | 'all';
  direction: TxDirection | 'all';
  token: TokenSymbol | 'all';
  chainId: number | 'all';
  dateRange: DateRange | null;
  keyword: string;
}
