import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { isSapPayment } from '../../../../config/paymentCurrencies';
import { getSapTokenConfig, getUsdcTokenConfig, type WalletErc20Config } from '../../../../config/walletTokens';
import type { PaymentMethod } from '../types/paymentTypes';

function getPaymentTokenConfig(
  method: PaymentMethod,
  chainId?: number,
): WalletErc20Config | undefined {
  if (method === 'USDC') return getUsdcTokenConfig(chainId);
  if (isSapPayment(method)) return getSapTokenConfig();
  return undefined;
}

function formatBalanceDisplay(amount: number, symbol: string): string {
  if (Number.isNaN(amount)) return symbol === 'SAP' ? '0' : '0.0000';
  if (symbol === 'SAP') {
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toFixed(4);
  }
  if (amount >= 1000) return amount.toFixed(2);
  return amount.toFixed(4);
}

/** 当前支付币种钱包余额（USDC / SAP 接链上；其余代币待配置合约地址） */
export function usePaymentTokenBalance(
  method: PaymentMethod,
  chainId?: number,
  address?: `0x${string}`,
) {
  const config = getPaymentTokenConfig(method, chainId);
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
    formatted = formatBalanceDisplay(numeric, config.symbol);
  }

  return {
    formatted,
    numeric,
    symbol: config?.symbol ?? method,
    configured: Boolean(config),
    isLoading: query.isLoading,
  };
}
