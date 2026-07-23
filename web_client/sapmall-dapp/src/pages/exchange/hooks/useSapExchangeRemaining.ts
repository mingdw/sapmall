import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { useSwapRouterAddress } from './useSwapRouterAddress';
import { swapRouterAbi } from '../../../config/abis/swapRouterAbi';
import { ARC_TESTNET_CHAIN_ID } from '../../../config/chains/arcTestnet';

const SAP_DECIMALS = 18;
// 合约中 EXCHANGE_COMMUNITY_CAP = 250_000_000 ether，即 2.5 亿 SAP（含 18 位精度）
const EXCHANGE_CAP = 250_000_000n * 10n ** BigInt(SAP_DECIMALS);

interface UseSapExchangeRemainingResult {
  /** 剩余可兑换 SAP 数量 */
  remaining: string;
  /** 总额度 */
  totalCap: string;
  /** 已兑换 SAP 总量（合约 totalSAPMinted） */
  swapped: string;
  /** 已兑换比例 (0-100) */
  usedPercent: number;
  isLoading: boolean;
}

/**
 * 读取 SAP 兑换额度：总额度 - 已铸造量。
 * 固定读 Arc Testnet 上的 SwapRouter（与钱包当前链无关）。
 */
export function useSapExchangeRemaining(): UseSapExchangeRemainingResult {
  const routerAddress = useSwapRouterAddress(ARC_TESTNET_CHAIN_ID);

  const { data, isLoading } = useReadContract({
    address: routerAddress,
    abi: swapRouterAbi,
    functionName: 'getSwapStats',
    chainId: ARC_TESTNET_CHAIN_ID,
    query: {
      enabled: !!routerAddress,
      refetchInterval: 60_000,
    },
  });

  if (!data) {
    return {
      remaining: formatUnits(EXCHANGE_CAP, SAP_DECIMALS),
      totalCap: formatUnits(EXCHANGE_CAP, SAP_DECIMALS),
      swapped: '0',
      usedPercent: 0,
      isLoading,
    };
  }

  const [totalSAPMinted] = data;
  const remaining = EXCHANGE_CAP - totalSAPMinted;
  // 乘以 1_000_000 提高精度，最终除以 10_000 得到百分比（保留 2 位小数）
  const usedPercent = Number((totalSAPMinted * 1_000_000n) / EXCHANGE_CAP) / 10_000;

  return {
    remaining: formatUnits(remaining > 0n ? remaining : 0n, SAP_DECIMALS),
    totalCap: formatUnits(EXCHANGE_CAP, SAP_DECIMALS),
    swapped: formatUnits(totalSAPMinted, SAP_DECIMALS),
    usedPercent,
    isLoading,
  };
}
