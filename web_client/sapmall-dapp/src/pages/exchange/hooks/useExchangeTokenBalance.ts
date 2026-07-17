import { useReadContract, useAccount, useBalance } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';
import { useExchangeTokenConfig } from './useExchangeTokenConfig';
import { useSwapRouterAddress } from './useSwapRouterAddress';
import { swapRouterAbi } from '../../../config/abis/swapRouterAbi';

interface UseExchangeTokenBalanceResult {
  balance: string;
  formattedBalance: string;
  isLoading: boolean;
  /** 合约中该代币的池子余额 */
  poolBalance: string;
  poolBalanceLoading: boolean;
}

/**
 * 读取用户代币余额 + 合约池子余额
 */
export function useExchangeTokenBalance(symbol: string): UseExchangeTokenBalanceResult {
  const { address, chainId } = useAccount();
  const tokenConfig = useExchangeTokenConfig(symbol);
  const routerAddress = useSwapRouterAddress();

  // 用户 ERC20 余额
  const { data: userBalance, isLoading: userBalanceLoading } = useReadContract({
    address: tokenConfig?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenConfig,
      refetchInterval: 30_000,
    },
    chainId,
  });

  // 合约池子余额
  const { data: poolBalanceRaw, isLoading: poolBalanceLoading } = useReadContract({
    address: routerAddress,
    abi: swapRouterAbi,
    functionName: 'getStablecoinBalance',
    args: tokenConfig ? [tokenConfig.address] : undefined,
    query: {
      enabled: !!routerAddress && !!tokenConfig,
      refetchInterval: 45_000,
    },
    chainId,
  });

  const balance = userBalance && tokenConfig
    ? formatUnits(userBalance, tokenConfig.decimals)
    : '0';

  const formattedBalance = userBalance && tokenConfig
    ? Number(formatUnits(userBalance, tokenConfig.decimals)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00';

  const poolBalance = poolBalanceRaw && tokenConfig
    ? Number(formatUnits(poolBalanceRaw, tokenConfig.decimals)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '--';

  return {
    balance,
    formattedBalance,
    isLoading: userBalanceLoading,
    poolBalance,
    poolBalanceLoading,
  };
}
