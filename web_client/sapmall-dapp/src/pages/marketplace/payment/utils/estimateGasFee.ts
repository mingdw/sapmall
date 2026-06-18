import { type Address, type PublicClient } from 'viem';
import { erc20Abi } from 'viem';
import { ARC_TESTNET_CHAIN_ID } from '../../../../config/chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from '../../../../config/chains/lineaSepolia';
import { BASE_SEPOLIA_CHAIN_ID } from '../../../../config/paymentChains';
import { paymentRouterAbi } from '../../../../config/abis/paymentRouterAbi';

/** 静态预估 Gas（fallback 用） */
const STATIC_GAS_USDC: Record<number, number> = {
  [ARC_TESTNET_CHAIN_ID]: 0.01,
  [LINEA_SEPOLIA_CHAIN_ID]: 0.05,
  [BASE_SEPOLIA_CHAIN_ID]: 0.04,
};

/** 预估链上 Gas（USDC 计价展示用，静态 fallback） */
export function estimateGasFeeUsdc(chainId?: number): number {
  if (chainId && chainId in STATIC_GAS_USDC) return STATIC_GAS_USDC[chainId];
  return 0.05;
}

export function isArcTestnetChain(chainId?: number): boolean {
  return chainId === ARC_TESTNET_CHAIN_ID;
}

/** 链上实时预估 approve + payOrder 的 gas 费用（USDC 计价） */
export async function estimateRealGasFeeUsdc(params: {
  publicClient: PublicClient;
  account: Address;
  tokenAddress: Address;
  routerAddress: Address;
  intentId: string;
  orderCode: string;
  amount: bigint;
  nativeTokenDecimals: number;
}): Promise<number> {
  const { publicClient, account, tokenAddress, routerAddress, intentId, orderCode, amount, nativeTokenDecimals } = params;

  try {
    const [approveGas, payGas, gasPrice] = await Promise.all([
      publicClient.estimateContractGas({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [routerAddress, amount],
        account,
      }),
      publicClient.estimateContractGas({
        address: routerAddress,
        abi: paymentRouterAbi,
        functionName: 'payOrder',
        args: [intentId, orderCode, tokenAddress, amount],
        account,
      }),
      publicClient.getGasPrice(),
    ]);

    const totalGas = (approveGas + payGas) * 120n / 100n;
    const totalCostWei = totalGas * gasPrice;
    const divisor = 10n ** BigInt(nativeTokenDecimals);
    return Number(totalCostWei * 10000n / divisor) / 10000;
  } catch {
    return estimateGasFeeUsdc(params.publicClient.chain?.id);
  }
}
