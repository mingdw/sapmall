import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import { useBalance, useReadContract } from 'wagmi';
import { getChainNativeCurrency, getSapTokenConfig } from '../../../config/walletTokens';

function formatTokenAmount(raw: bigint | undefined, decimals: number, displayDecimals = 4): string {
  if (raw === undefined) return '0';
  const formatted = formatUnits(raw, decimals);
  const n = Number.parseFloat(formatted);
  if (Number.isNaN(n) || n === 0) return '0';
  if (n < 0.0001) return '<0.0001';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return n.toFixed(displayDecimals);
}

function useErc20Balance(
  config: ReturnType<typeof getSapTokenConfig>,
  chainId?: number,
  address?: `0x${string}`,
) {
  return useReadContract({
    address: config?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: Boolean(config && address && chainId) },
  });
}

export function useWalletTokenBalances(
  chainId?: number,
  address?: `0x${string}`,
) {
  const nativeCurrency = getChainNativeCurrency(chainId);
  const sapConfig = getSapTokenConfig();

  const nativeQuery = useBalance({
    address,
    chainId,
    query: { enabled: Boolean(address && chainId) },
  });

  const sapQuery = useErc20Balance(sapConfig, chainId, address);

  const isLoading =
    nativeQuery.isLoading || (Boolean(sapConfig) && sapQuery.isLoading);
  const isFetching =
    nativeQuery.isFetching || (Boolean(sapConfig) && sapQuery.isFetching);

  return {
    nativeSymbol: nativeCurrency.symbol,
    nativeAmount: formatTokenAmount(nativeQuery.data?.value, nativeCurrency.decimals),
    sapConfig,
    sapAmount: sapConfig
      ? formatTokenAmount(sapQuery.data, sapConfig.decimals)
      : '0',
    isLoading,
    isFetching,
    refetch: () => {
      void nativeQuery.refetch();
      if (sapConfig) void sapQuery.refetch();
    },
  };
}
