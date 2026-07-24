import { useCallback, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import {
  erc20Abi,
  parseUnits,
  type Address,
  type Hash,
  type TransactionReceipt,
  UserRejectedRequestError,
  BaseError,
  ContractFunctionRevertedError,
  maxUint256,
} from 'viem';
import { swapRouterAbi, SwapDirection } from '../../../config/abis/swapRouterAbi';
import { CCTP_CHAINS, CCTP_MVP_ROUTE } from '../../../config/cctp';
import { ARC_TESTNET_CHAIN_ID } from '../../../config/chains/arcTestnet';
import { config } from '../../../config/wagmi';
import { useSwapRouterAddress } from './useSwapRouterAddress';
import { useSwapQuote } from './useSwapQuote';
import { ensureWalletOnChain } from '../../../utils/ensureWalletOnChain';
import { isChainMismatchError } from '../../../utils/wagmiChainMismatch';
import { sendContractCallsBatched } from '../../../utils/sendContractCallsBatched';
import { sumGasFees } from '../../../utils/txGasFee';
import { startCctpPerf } from '../../../utils/cctpPerfLog';

type WagmiChainId = (typeof config.chains)[number]['id'];

export type CctpSwapPhase = 'idle' | 'switching' | 'approving' | 'swapping' | 'confirming' | 'success' | 'error';

/** swap 成功结果：主交易哈希 + 本链累计 Gas */
export type CctpSwapResult = {
  hash: Hash;
  gasFee: string;
};

interface UseCctpSwapOnArcParams {
  amountInRaw: string;
  slippagePercent?: number;
}

interface UseCctpSwapOnArcResult {
  phase: CctpSwapPhase;
  txHash: string | null;
  error: string | null;
  executeSwap: () => Promise<CctpSwapResult | null>;
  reset: () => void;
}

function isUserRejected(err: unknown): boolean {
  if (err instanceof UserRejectedRequestError) return true;
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return msg.includes('user rejected') || msg.includes('user denied');
}

function extractRevertReason(err: unknown): string {
  const raw =
    err instanceof BaseError
      ? err.shortMessage || err.message
      : err instanceof Error
        ? err.message
        : '';

  if (isChainMismatchError(raw) || /does not match the (target|connection)|current chain of the (wallet|connector)/i.test(raw)) {
    return '钱包网络未同步到 Arc，请在 MetaMask 中手动切到 Arc Testnet 后再试';
  }
  if (/insufficient funds/i.test(raw)) {
    return 'Arc 原生币不足以支付 Gas，请先领取测试网资金后再试';
  }

  if (err instanceof BaseError) {
    const reverted = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (reverted instanceof ContractFunctionRevertedError) {
      return reverted.reason ?? reverted.shortMessage;
    }
    return err.shortMessage;
  }
  return err instanceof Error ? err.message : 'Swap 失败';
}

/** Arc Testnet 上将跨链 USDC 兑换为 SAP（优先批量签名） */
export function useCctpSwapOnArc({
  amountInRaw,
  slippagePercent = 0.5,
}: UseCctpSwapOnArcParams): UseCctpSwapOnArcResult {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const routerAddress = useSwapRouterAddress(ARC_TESTNET_CHAIN_ID);

  const arcUsdc = CCTP_CHAINS[CCTP_MVP_ROUTE.destination].usdc;
  const humanAmount = Number(amountInRaw) / 10 ** CCTP_CHAINS[CCTP_MVP_ROUTE.destination].usdcDecimals;
  const { amountOut } = useSwapQuote({
    tokenSymbol: 'USDC',
    amountIn: humanAmount > 0 ? String(humanAmount) : '0',
    chainId: ARC_TESTNET_CHAIN_ID,
  });

  const [phase, setPhase] = useState<CctpSwapPhase>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setPhase('idle');
    setTxHash(null);
    setError(null);
  }, []);

  const executeSwap = useCallback(async (): Promise<CctpSwapResult | null> => {
    if (!address || !routerAddress) {
      setError('钱包未连接或 SwapRouter 未配置');
      setPhase('error');
      return null;
    }

    const amountInBigInt = BigInt(amountInRaw);
    if (amountInBigInt <= 0n) {
      setError('金额无效');
      setPhase('error');
      return null;
    }

    const perf = startCctpPerf('executeSwap', {
      amountInRaw,
      hasCachedQuote: Boolean(amountOut),
      slippagePercent,
    });

    try {
      setError(null);
      setPhase('switching');

      perf.mark('beforeEnsureArc');
      const walletClient = await ensureWalletOnChain(
        config,
        ARC_TESTNET_CHAIN_ID,
        switchChainAsync,
        'Arc Testnet',
      );
      perf.mark('afterEnsureArc');

      const publicClient = getPublicClient(config, { chainId: ARC_TESTNET_CHAIN_ID as WagmiChainId });
      const chain = config.chains.find((c) => c.id === ARC_TESTNET_CHAIN_ID);
      if (!publicClient || !chain) {
        setError('Arc Testnet RPC 未配置');
        setPhase('error');
        perf.done('FAIL-no-rpc');
        return null;
      }

      const tokenIn = arcUsdc as Address;

      // 读 allowance / quote 依赖 Arc RPC；失败时不阻塞钱包弹窗
      let needApprove = true;
      try {
        perf.mark('beforeReadAllowance');
        const allowance = await publicClient.readContract({
          address: tokenIn,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, routerAddress],
        });
        needApprove = allowance < amountInBigInt;
        perf.mark('afterReadAllowance', {
          needApprove,
          allowance: allowance.toString(),
        });
      } catch (allowanceErr) {
        console.warn('[CCTP] 读取 Arc USDC allowance 失败，将走授权+Swap', allowanceErr);
        needApprove = true;
        perf.mark('allowanceFailedAssumeApprove');
      }

      let minAmountOutBigInt: bigint;
      try {
        if (amountOut) {
          const quotedOut = parseUnits(amountOut, 18);
          const slippageMultiplier = BigInt(Math.floor((1 - slippagePercent / 100) * 10000));
          minAmountOutBigInt = (quotedOut * slippageMultiplier) / 10000n;
          perf.mark('useCachedQuote', { minAmountOut: minAmountOutBigInt.toString() });
        } else {
          perf.mark('beforeQuoteSwapRpc');
          const [quotedOut] = await publicClient.readContract({
            address: routerAddress,
            abi: swapRouterAbi,
            functionName: 'quoteSwap',
            args: [tokenIn, amountInBigInt, SwapDirection.STABLE_TO_SAP],
          });
          const slippageMultiplier = BigInt(Math.floor((1 - slippagePercent / 100) * 10000));
          minAmountOutBigInt = (quotedOut * slippageMultiplier) / 10000n;
          perf.mark('afterQuoteSwapRpc', { minAmountOut: minAmountOutBigInt.toString() });
        }
      } catch (quoteErr) {
        console.warn('[CCTP] Arc quoteSwap 失败，使用保守 minAmountOut=1', quoteErr);
        // 极小下限，避免 RPC 抖动时完全卡死；链上仍受滑点/池子约束
        minAmountOutBigInt = 1n;
        perf.mark('quoteFailedUseFallback');
      }

      if (minAmountOutBigInt <= 0n) {
        setError('报价无效，请稍后重试');
        setPhase('error');
        perf.done('FAIL-bad-quote');
        return null;
      }

      setPhase(needApprove ? 'approving' : 'swapping');

      // 固定 Gas Limit：跳过钱包 eth_estimateGas 预估，加速弹窗（Direction F）
      // ERC20 approve ≈ 46k→留 80k；swap ≈ 250k→留 400k
      const GAS_APPROVE = 80_000n;
      const GAS_SWAP = 400_000n;

      const swapCall = {
        to: routerAddress,
        abi: swapRouterAbi,
        functionName: 'swap',
        args: [tokenIn, amountInBigInt, minAmountOutBigInt, SwapDirection.STABLE_TO_SAP] as const,
        gas: GAS_SWAP,
      };

      const calls = needApprove
        ? [
            {
              to: tokenIn,
              abi: erc20Abi,
              functionName: 'approve',
              args: [routerAddress, maxUint256] as const,
              gas: GAS_APPROVE,
            },
            swapCall,
          ]
        : [swapCall];

      perf.mark('beforeSendCalls_walletPopup', {
        needApprove,
        callCount: calls.length,
      });
      const { primaryHash: swapHash, hashes } = await sendContractCallsBatched({
        walletClient,
        account: address,
        chain,
        calls: calls.map((c) => ({
          to: c.to,
          abi: c.abi as typeof erc20Abi,
          functionName: c.functionName,
          args: c.args as readonly unknown[],
          ...(c.gas ? { gas: c.gas } : {}),
        })),
      });
      perf.mark('afterSendCalls_userSigned', {
        hashCount: hashes.length,
        swapHash: swapHash.slice(0, 10),
      });

      setPhase('confirming');
      const receipts: TransactionReceipt[] = [];
      for (const h of hashes) {
        perf.mark('beforeWaitReceipt', { hash: h.slice(0, 10) });
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: h,
          timeout: 120_000,
        });
        perf.mark('afterWaitReceipt', {
          hash: h.slice(0, 10),
          status: receipt.status,
        });
        if (receipt.status === 'reverted') {
          setError(needApprove && h === hashes[0] ? '授权交易被回滚' : 'Swap 交易被回滚');
          setPhase('error');
          perf.done('FAIL-reverted');
          return null;
        }
        receipts.push(receipt);
      }

      setTxHash(swapHash);
      setPhase('success');
      perf.done('ok');
      return { hash: swapHash, gasFee: sumGasFees(receipts) };
    } catch (err) {
      if (isUserRejected(err)) {
        setError(null);
        setPhase('idle');
        perf.done('user-rejected');
        return null;
      }
      setError(extractRevertReason(err));
      setPhase('error');
      perf.done('FAIL', {
        message: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }, [address, routerAddress, switchChainAsync, amountInRaw, amountOut, slippagePercent, arcUsdc]);

  return { phase, txHash, error, executeSwap, reset };
}
