import { useCallback, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import { erc20Abi, parseUnits, type Address, type Hash, type PublicClient, type WalletClient, UserRejectedRequestError, BaseError, ContractFunctionRevertedError } from 'viem';
import { swapRouterAbi, SwapDirection } from '../../../config/abis/swapRouterAbi';
import { config } from '../../../config/wagmi';
import { useSwapRouterAddress } from './useSwapRouterAddress';
import { useExchangeTokenConfig } from './useExchangeTokenConfig';

type WagmiChainId = (typeof config.chains)[number]['id'];

export type SwapPhase = 'idle' | 'approving' | 'swapping' | 'confirming' | 'success' | 'error';

interface UseSwapExecutionParams {
  tokenSymbol: string;
  amountIn: string;
  minAmountOut?: string;
  slippagePercent?: number;
  /** 预获取的合约报价（来自 useSwapQuote），避免 execute 时重复 RPC 调用 */
  quotedAmountOut?: string;
  /** 预获取的 allowance（来自 useReadContract），避免 execute 时重复 RPC 调用 */
  prefetchedAllowance?: bigint;
}

interface UseSwapExecutionResult {
  phase: SwapPhase;
  txHash: string | null;
  error: string | null;
  execute: () => Promise<void>;
  reset: () => void;
}

function isUserRejected(err: unknown): boolean {
  if (err instanceof UserRejectedRequestError) return true;
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return msg.includes('user rejected') || msg.includes('user denied') || msg.includes('rejected the request');
}

function extractRevertReason(err: unknown): string {
  if (err instanceof BaseError) {
    const reverted = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (reverted instanceof ContractFunctionRevertedError) {
      return reverted.reason ?? reverted.data?.errorName ?? reverted.shortMessage;
    }
    return err.shortMessage;
  }
  return err instanceof Error ? err.message : '交易失败';
}

export function useSwapExecution({
  tokenSymbol,
  amountIn,
  minAmountOut,
  slippagePercent = 0.5,
  quotedAmountOut,
  prefetchedAllowance,
}: UseSwapExecutionParams): UseSwapExecutionResult {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const routerAddress = useSwapRouterAddress();
  const tokenConfig = useExchangeTokenConfig(tokenSymbol);

  const [phase, setPhase] = useState<SwapPhase>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setPhase('idle');
    setTxHash(null);
    setError(null);
  }, []);

  const execute = useCallback(async () => {
    if (!address || !walletClient || !chainId || !routerAddress || !tokenConfig) {
      setError('钱包未连接或合约地址未配置');
      setPhase('error');
      return;
    }

    const amountInBigInt = parseUnits(amountIn, tokenConfig.decimals);
    if (amountInBigInt <= 0n) {
      setError('请输入有效的兑换金额');
      setPhase('error');
      return;
    }

    const chain = config.chains.find((c) => c.id === chainId);
    if (!chain) {
      setError('当前网络未支持');
      setPhase('error');
      return;
    }

    const publicClient = getPublicClient(config, { chainId: chainId as WagmiChainId });
    if (!publicClient) {
      setError('RPC 未配置');
      setPhase('error');
      return;
    }

    try {
      setError(null);

      // 1. 检查 allowance（优先使用预获取值，避免阻塞 RPC 调用）
      let allowance: bigint;
      if (prefetchedAllowance !== undefined) {
        allowance = prefetchedAllowance;
      } else {
        allowance = await publicClient.readContract({
          address: tokenConfig.address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, routerAddress],
        });
      }

      // 2. Approve（如需要）
      if (allowance < amountInBigInt) {
        setPhase('approving');
        const approveHash = await walletClient.writeContract({
          account: address,
          chain,
          address: tokenConfig.address,
          abi: erc20Abi,
          functionName: 'approve',
          args: [routerAddress, amountInBigInt],
          gas: 100_000n,
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash, timeout: 120_000 });
      }

      // 3. 计算 minAmountOut（滑点保护）
      let minAmountOutBigInt: bigint;
      if (minAmountOut) {
        minAmountOutBigInt = parseUnits(minAmountOut, 18);
      } else if (quotedAmountOut) {
        // 使用预获取的合约报价，避免重复 RPC 调用
        const quotedOut = parseUnits(quotedAmountOut, 18);
        const slippageMultiplier = BigInt(Math.floor((1 - slippagePercent / 100) * 10000));
        minAmountOutBigInt = (quotedOut * slippageMultiplier) / 10000n;
      } else {
        // 降级：从合约获取 quote，再应用滑点
        const [quotedOut] = await publicClient.readContract({
          address: routerAddress,
          abi: swapRouterAbi,
          functionName: 'quoteSwap',
          args: [tokenConfig.address, amountInBigInt, SwapDirection.STABLE_TO_SAP],
        });
        const slippageMultiplier = BigInt(Math.floor((1 - slippagePercent / 100) * 10000));
        minAmountOutBigInt = (quotedOut * slippageMultiplier) / 10000n;
      }

      // 4. 执行 swap
      setPhase('swapping');
      const swapHash = await walletClient.writeContract({
        account: address,
        chain,
        address: routerAddress,
        abi: swapRouterAbi,
        functionName: 'swap',
        args: [tokenConfig.address, amountInBigInt, minAmountOutBigInt, SwapDirection.STABLE_TO_SAP],
        gas: 500_000n,
      });

      setTxHash(swapHash);
      setPhase('confirming');

      // 5. 等待确认
      const receipt = await publicClient.waitForTransactionReceipt({ hash: swapHash, timeout: 120_000 });
      if (receipt.status === 'reverted') {
        setError('交易在链上被回滚');
        setPhase('error');
        return;
      }

      setPhase('success');
    } catch (err) {
      if (isUserRejected(err)) {
        setError(null);
        setPhase('idle');
        return;
      }
      setError(extractRevertReason(err));
      setPhase('error');
    }
  }, [address, walletClient, chainId, routerAddress, tokenConfig, amountIn, minAmountOut, slippagePercent, quotedAmountOut, prefetchedAllowance]);

  return { phase, txHash, error, execute, reset };
}
