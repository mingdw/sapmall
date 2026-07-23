import { useMemo } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { swapRouterAbi, SwapDirection } from '../../../config/abis/swapRouterAbi';
import { useSwapRouterAddress } from './useSwapRouterAddress';
import { useExchangeTokenConfig } from './useExchangeTokenConfig';

interface UseSwapQuoteParams {
  tokenSymbol: string;
  amountIn: string;
  /** 指定报价链（跨链兑换时在 Arc 上 quote） */
  chainId?: number;
}

interface UseSwapQuoteResult {
  amountOut: string;
  fee: string;
  rate: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useSwapQuote({ tokenSymbol, amountIn, chainId: chainIdOverride }: UseSwapQuoteParams): UseSwapQuoteResult {
  const { chainId: walletChainId } = useAccount();
  const chainId = chainIdOverride ?? walletChainId;
  const routerAddress = useSwapRouterAddress(chainId);
  const tokenConfig = useExchangeTokenConfig(tokenSymbol, chainId);

  const amountInBigInt = useMemo(() => {
    if (!amountIn || !tokenConfig) return undefined;
    const parsed = parseFloat(amountIn);
    if (isNaN(parsed) || parsed <= 0) return undefined;
    return parseUnits(amountIn, tokenConfig.decimals);
  }, [amountIn, tokenConfig]);

  const { data, isLoading, isError, error } = useReadContract({
    address: routerAddress,
    abi: swapRouterAbi,
    functionName: 'quoteSwap',
    args: amountInBigInt !== undefined && tokenConfig
      ? [tokenConfig.address, amountInBigInt, SwapDirection.STABLE_TO_SAP]
      : undefined,
    query: {
      enabled: amountInBigInt !== undefined && !!routerAddress && !!tokenConfig,
      retry: 1,
      staleTime: 10_000,
    },
    chainId,
  });

  if (!data || !tokenConfig) {
    return {
      amountOut: '',
      fee: '',
      rate: 0,
      isLoading,
      isError,
      error,
    };
  }

  const [rawAmountOut, rawFee] = data;
  const sapDecimals = 18;
  const amountOut = formatUnits(rawAmountOut, sapDecimals);
  const fee = formatUnits(rawFee, tokenConfig.decimals);
  const rate = rawAmountOut > 0n && amountInBigInt
    ? Number(rawAmountOut) / 10 ** sapDecimals / (Number(amountInBigInt) / 10 ** tokenConfig.decimals)
    : 0;

  return {
    amountOut,
    fee,
    rate,
    isLoading,
    isError,
    error,
  };
}
