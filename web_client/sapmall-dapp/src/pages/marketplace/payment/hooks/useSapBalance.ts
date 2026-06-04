import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { getSapTokenConfig } from '../../../../config/walletTokens';

export function useSapBalance(chainId?: number, address?: `0x${string}`) {
  const config = getSapTokenConfig();
  const query = useReadContract({
    address: config?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: Boolean(config && address && chainId) },
  });

  let formatted = '0';
  let numeric = 0;
  if (query.data !== undefined && config) {
    const n = Number.parseFloat(formatUnits(query.data, config.decimals));
    numeric = Number.isNaN(n) ? 0 : n;
    formatted = numeric >= 1000 ? `${(numeric / 1000).toFixed(1)}K` : numeric.toFixed(4);
  }

  return {
    formatted,
    numeric,
    symbol: config?.symbol ?? 'SAP',
    configured: Boolean(config),
    isLoading: query.isLoading,
  };
}
