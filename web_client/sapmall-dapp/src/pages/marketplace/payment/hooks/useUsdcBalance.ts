import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { getUsdcTokenConfig } from '../../../../config/walletTokens';

export function useUsdcBalance(chainId?: number, address?: `0x${string}`) {
  const config = getUsdcTokenConfig(chainId);
  const query = useReadContract({
    address: config?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: Boolean(config && address && chainId) },
  });

  let formatted = '0';
  if (query.data !== undefined && config) {
    const n = Number.parseFloat(formatUnits(query.data, config.decimals));
    formatted = Number.isNaN(n) ? '0' : n.toFixed(4);
  }

  return { formatted, symbol: config?.symbol ?? 'USDC', isLoading: query.isLoading };
}
