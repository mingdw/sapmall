import { useCallback, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import {
  erc20Abi,
  type Address,
  type Hash,
  type TransactionReceipt,
  UserRejectedRequestError,
  BaseError,
  ContractFunctionRevertedError,
  maxUint256,
} from 'viem';
import { tokenMessengerV2Abi } from '../../../config/abis/cctpV2Abi';
import { CCTP_CHAINS, CCTP_MVP_ROUTE, getCctpChainById } from '../../../config/cctp';
import { config } from '../../../config/wagmi';
import type { CctpBurnParams } from '../../../services/api/cctpApi';
import { ensureWalletOnChain } from '../../../utils/ensureWalletOnChain';
import { isChainMismatchError } from '../../../utils/wagmiChainMismatch';
import { sendContractCallsBatched } from '../../../utils/sendContractCallsBatched';
import { sumGasFees } from '../../../utils/txGasFee';
import { startCctpPerf } from '../../../utils/cctpPerfLog';

type WagmiChainId = (typeof config.chains)[number]['id'];

export type CctpBurnPhase = 'idle' | 'switching' | 'approving' | 'burning' | 'confirming' | 'success' | 'error';

/** burn 成功结果：主交易哈希 + 本链累计 Gas（wei） */
export type CctpBurnResult = {
  hash: Hash;
  gasFee: string;
};

interface UseCctpBurnResult {
  phase: CctpBurnPhase;
  txHash: string | null;
  error: string | null;
  executeBurn: (
    burnParams: CctpBurnParams,
    options?: { prefetchedAllowance?: bigint },
  ) => Promise<CctpBurnResult | null>;
  reset: () => void;
}

function isUserRejected(err: unknown): boolean {
  if (err instanceof UserRejectedRequestError) return true;
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return msg.includes('user rejected') || msg.includes('user denied');
}

function extractRevertReason(err: unknown, sourceName?: string): string {
  const raw =
    err instanceof BaseError
      ? err.shortMessage || err.message
      : err instanceof Error
        ? err.message
        : '';

  const chainHint = sourceName ? `（${sourceName}）` : '';

  if (isChainMismatchError(raw) || /does not match the (target|connection)|current chain of the (wallet|connector)/i.test(raw)) {
    return `钱包网络未同步到源链${chainHint}，请在 MetaMask 中手动切到所选源链后再试`;
  }
  if (/insufficient funds/i.test(raw)) {
    return `源链${chainHint}原生币不足以支付 Gas。跨链需要该链测试网 ETH（不是 USDC），请先领取后再试`;
  }
  if (/Unrecognized chain ID|4902/i.test(raw)) {
    return `钱包尚未添加源链${chainHint}，请在 MetaMask 中添加网络后重试`;
  }

  if (err instanceof BaseError) {
    const reverted = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (reverted instanceof ContractFunctionRevertedError) {
      return reverted.reason ?? reverted.shortMessage;
    }
    return err.shortMessage;
  }
  return err instanceof Error ? err.message : 'Burn 失败';
}

/** 源链上 approve + depositForBurn V2（优先批量签名） */
export function useCctpBurn(): UseCctpBurnResult {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [phase, setPhase] = useState<CctpBurnPhase>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setPhase('idle');
    setTxHash(null);
    setError(null);
  }, []);

  const executeBurn = useCallback(
    async (
      burnParams: CctpBurnParams,
      options?: { prefetchedAllowance?: bigint },
    ): Promise<CctpBurnResult | null> => {
      if (!address) {
        setError('请先连接钱包');
        setPhase('error');
        return null;
      }

      const sourceChainId = burnParams.sourceChainId || CCTP_CHAINS[CCTP_MVP_ROUTE.source].chainId;
      const source = getCctpChainById(sourceChainId) ?? CCTP_CHAINS[CCTP_MVP_ROUTE.source];
      const amount = BigInt(burnParams.amount);
      if (amount <= 0n) {
        setError('金额无效');
        setPhase('error');
        return null;
      }

      const perf = startCctpPerf('executeBurn', {
        source: source.name,
        sourceChainId: source.chainId,
        amount: amount.toString(),
      });

      try {
        setError(null);
        setPhase('switching');

        perf.mark('beforeEnsureSourceChain');
        const walletClient = await ensureWalletOnChain(
          config,
          source.chainId,
          switchChainAsync,
          source.name,
        );
        perf.mark('afterEnsureSourceChain');

        const publicClient = getPublicClient(config, { chainId: source.chainId as WagmiChainId });
        const chain = config.chains.find((c) => c.id === source.chainId);
        if (!publicClient || !chain) {
          setError(`${source.name} RPC 未配置`);
          setPhase('error');
          perf.done('FAIL-no-rpc');
          return null;
        }

        const usdc = burnParams.usdc as Address;
        const tokenMessenger = burnParams.tokenMessenger as Address;
        const maxFee = BigInt(burnParams.maxFee || '0');

        // 读 allowance 依赖 dapp→源链 RPC；公共节点断连时勿阻塞钱包弹窗
        // 若上游已预取 allowance（Direction B 并行化），直接使用，跳过 RPC 调用
        let needApprove = true;
        if (options?.prefetchedAllowance !== undefined) {
          needApprove = options.prefetchedAllowance < amount;
          perf.mark('usedPrefetchedAllowance', {
            needApprove,
            allowance: options.prefetchedAllowance.toString(),
          });
        } else {
          try {
            perf.mark('beforeReadAllowance');
            const allowance = await publicClient.readContract({
              address: usdc,
              abi: erc20Abi,
              functionName: 'allowance',
              args: [address, tokenMessenger],
            });
            needApprove = allowance < amount;
            perf.mark('afterReadAllowance', {
              needApprove,
              allowance: allowance.toString(),
            });
          } catch (allowanceErr) {
            console.warn(
              `[CCTP] 读取 ${source.name} allowance 失败，将走授权+Burn（RPC 可能不稳定）`,
              allowanceErr,
            );
            needApprove = true;
            perf.mark('allowanceFailedAssumeApprove');
          }
        }

        setPhase(needApprove ? 'approving' : 'burning');

        // 固定 Gas Limit：跳过钱包 eth_estimateGas 预估，加速弹窗（Direction F）
        // ERC20 approve ≈ 46k→留 80k；depositForBurn V2 ≈ 350k→留 500k
        const GAS_APPROVE = 80_000n;
        const GAS_BURN = 500_000n;

        const burnCall = {
          to: tokenMessenger,
          abi: tokenMessengerV2Abi,
          functionName: 'depositForBurn',
          args: [
            amount,
            burnParams.destinationDomain,
            burnParams.mintRecipient as `0x${string}`,
            usdc,
            burnParams.destinationCaller as `0x${string}`,
            maxFee,
            burnParams.minFinalityThreshold,
          ] as const,
          gas: GAS_BURN,
        };

        const calls = needApprove
          ? [
              {
                to: usdc,
                abi: erc20Abi,
                functionName: 'approve',
                args: [tokenMessenger, maxUint256] as const,
                gas: GAS_APPROVE,
              },
              burnCall,
            ]
          : [burnCall];

        // 需要授权时尽量 1 次弹窗完成 approve+burn；已授权则仅 burn
        perf.mark('beforeSendCalls_walletPopup', {
          needApprove,
          callCount: calls.length,
        });
        const { primaryHash: burnHash, hashes } = await sendContractCallsBatched({
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
          burnHash: burnHash.slice(0, 10),
        });

        // 顺序回退时：先等 approve 再等 burn；并累计本链 Gas
        setPhase('confirming');
        const receipts: TransactionReceipt[] = [];
        for (const h of hashes) {
          perf.mark('beforeWaitReceipt', { hash: h.slice(0, 10) });
          const receipt = await publicClient.waitForTransactionReceipt({
            hash: h,
            timeout: 180_000,
          });
          perf.mark('afterWaitReceipt', {
            hash: h.slice(0, 10),
            status: receipt.status,
          });
          if (receipt.status === 'reverted') {
            setError(needApprove && h === hashes[0] ? '授权交易被回滚' : 'Burn 交易被回滚');
            setPhase('error');
            perf.done('FAIL-reverted');
            return null;
          }
          receipts.push(receipt);
        }

        setTxHash(burnHash);
        setPhase('success');
        perf.done('ok');
        return { hash: burnHash, gasFee: sumGasFees(receipts) };
      } catch (err) {
        if (isUserRejected(err)) {
          setError(null);
          setPhase('idle');
          perf.done('user-rejected');
          return null;
        }
        setError(extractRevertReason(err, source.name));
        setPhase('error');
        perf.done('FAIL', {
          message: err instanceof Error ? err.message : String(err),
        });
        return null;
      }
    },
    [address, switchChainAsync],
  );

  return { phase, txHash, error, executeBurn, reset };
}
