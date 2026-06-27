import { type PublicClient } from 'viem';
import { ARC_TESTNET_CHAIN_ID } from '../../../../config/chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from '../../../../config/chains/lineaSepolia';
import { BASE_SEPOLIA_CHAIN_ID } from '../../../../config/paymentChains';

/** 各链支付流程固定 Gas 上限（approve + payOrder，含 20% 余量，仅作 limit 与展示估算） */
export const PAYMENT_GAS_LIMITS: Record<
  number,
  { approve: number; payOrder: number }
> = {
  [ARC_TESTNET_CHAIN_ID]: { approve: 100_000, payOrder: 400_000 },
  [LINEA_SEPOLIA_CHAIN_ID]: { approve: 100_000, payOrder: 400_000 },
  [BASE_SEPOLIA_CHAIN_ID]: { approve: 100_000, payOrder: 400_000 },
};

const DEFAULT_GAS_LIMITS = { approve: 100_000, payOrder: 400_000 };

/** 各链静态 Gas 费展示（USDC 计价，不发起链上合约模拟） */
const STATIC_GAS_FEE_USDC: Record<number, number> = {
  [ARC_TESTNET_CHAIN_ID]: 0.01,
  [LINEA_SEPOLIA_CHAIN_ID]: 0.05,
  [BASE_SEPOLIA_CHAIN_ID]: 0.04,
};

export function getPaymentGasLimits(chainId: number) {
  return PAYMENT_GAS_LIMITS[chainId] ?? DEFAULT_GAS_LIMITS;
}

/** 预估链上 Gas（USDC 计价展示 / 创单 estGasFee，纯静态） */
export function estimateGasFeeUsdc(chainId?: number): number {
  if (chainId && chainId in STATIC_GAS_FEE_USDC) return STATIC_GAS_FEE_USDC[chainId];
  return 0.05;
}

/**
 * 用固定 gas 单位 + 当前 gasPrice 估算费用（仅读 gasPrice，不做 estimateContractGas 模拟）
 */
export async function estimateGasFeeUsdcFromGasPrice(
  publicClient: PublicClient,
  chainId: number,
  nativeTokenDecimals = 6,
): Promise<number> {
  const limits = getPaymentGasLimits(chainId);
  try {
    const gasPrice = await publicClient.getGasPrice();
    const totalGas =
      BigInt(Math.ceil((limits.approve + limits.payOrder) * 1.2));
    const costWei = totalGas * gasPrice;
    const divisor = 10n ** BigInt(nativeTokenDecimals);
    return Number(costWei * 10000n / divisor) / 10000;
  } catch {
    return estimateGasFeeUsdc(chainId);
  }
}

export function isArcTestnetChain(chainId?: number): boolean {
  return chainId === ARC_TESTNET_CHAIN_ID;
}
