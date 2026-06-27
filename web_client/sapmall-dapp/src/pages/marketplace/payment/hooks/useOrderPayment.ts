import { useCallback, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import type { PublicClient } from 'viem';
import {
  CreateOrderReq,
  mockAdvancePaymentIntent,
  orderApi,
  paymentToIntentBundle,
  PaymentIntentBundle,
} from '../../../../services/api/orderApi';
import { ApiError } from '../../../../services/api/baseClient';
import { isPaymentChain } from '../../../../config/paymentChains';
import { config } from '../../../../config/wagmi';
import { PaymentPhase } from '../types/paymentTypes';
import { executePayOrder, PayOrderError } from '../utils/executePayOrder';
import { formatPayErrorMessage } from '../utils/formatPayErrorMessage';

type WagmiConfiguredChainId = (typeof config.chains)[number]['id'];

function resolveWagmiChainId(chainId: number): WagmiConfiguredChainId | null {
  if (!config.chains.some((c) => c.id === chainId)) return null;
  return chainId as WagmiConfiguredChainId;
}

const MODIFY_RETRY = 3;
const MODIFY_RETRY_MS = 600;
const PAID_STATUS = 3;
const CONFIRMING_STATUS = 2;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 可基于已有 intent 重新发起授权/支付的错误 */
const RETRYABLE_PAY_ERROR_KEYS = new Set([
  'paymentFailed',
  'authRejected',
  'payRejected',
  'duplicateSubmit',
]);

const reportedConfirmingKeys = new Set<string>();

function confirmingReportKey(orderCode: string, txHash: string): string {
  return `${orderCode}:${txHash.toLowerCase()}`;
}

async function reportConfirming(orderCode: string, txHash: string) {
  const hash = txHash.trim();
  if (!hash) return;

  const reportKey = confirmingReportKey(orderCode, hash);
  if (reportedConfirmingKeys.has(reportKey)) return;

  try {
    const status = await orderApi.getStatus({ orderCode, txHash: hash });
    if (status.paymentStatus === PAID_STATUS) {
      reportedConfirmingKeys.add(reportKey);
      return;
    }
    if (status.paymentStatus === CONFIRMING_STATUS && status.txHash?.trim()) {
      reportedConfirmingKeys.add(reportKey);
      return;
    }
  } catch {
    // 状态查询失败时仍尝试上报 confirming
  }

  for (let i = 0; i < MODIFY_RETRY; i += 1) {
    try {
      await orderApi.modify({ orderCode, action: 'confirming', txHash: hash }, { silent: true });
      reportedConfirmingKeys.add(reportKey);
      return;
    } catch (err) {
      if (err instanceof ApiError && err.isBusinessError) {
        reportedConfirmingKeys.add(reportKey);
        return;
      }
      if (i < MODIFY_RETRY - 1) await delay(MODIFY_RETRY_MS);
    }
  }
}

async function reportResumePay(orderCode: string) {
  for (let i = 0; i < MODIFY_RETRY; i += 1) {
    try {
      await orderApi.modify({ orderCode, action: 'resumePay' });
      return;
    } catch {
      if (i < MODIFY_RETRY - 1) await delay(MODIFY_RETRY_MS);
    }
  }
}

function mapPayFailure(err: unknown): { phase: PaymentPhase; errorKey: string } {
  if (err instanceof PayOrderError) {
    if (err.code === 'userRejected') {
      if (err.stage === 'pay') {
        return { phase: 'payCancelled', errorKey: 'payRejected' };
      }
      return { phase: 'authCancelled', errorKey: 'authRejected' };
    }
    if (err.code === 'chainMismatch') return { phase: 'error', errorKey: 'wrongNetwork' };
    if (err.code === 'tokenMismatch' || err.code === 'invalidIntent') {
      return { phase: 'error', errorKey: 'paymentFailed' };
    }
    return { phase: 'error', errorKey: err.code };
  }
  if (err instanceof ApiError && err.message.includes('请勿重复提交')) {
    return { phase: 'error', errorKey: 'duplicateSubmit' };
  }
  return { phase: 'error', errorKey: 'paymentFailed' };
}

function applyPayFailure(err: unknown): { phase: PaymentPhase; errorKey: string; detail: string | null } {
  const failure = mapPayFailure(err);
  let detail: string | null = null;
  if (err instanceof PayOrderError) {
    const msg = err.message && err.message !== err.code ? err.message : null;
    detail = formatPayErrorMessage(msg) ?? msg;
  } else if (err instanceof ApiError) {
    detail = formatPayErrorMessage(err.message);
  }
  return { ...failure, detail };
}

export function useOrderPayment() {
  const { address, chainId, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [phase, setPhase] = useState<PaymentPhase>('idle');
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [intent, setIntent] = useState<PaymentIntentBundle | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);

  const resetError = useCallback(() => {
    setErrorKey(null);
    setErrorDetail(null);
  }, []);

  const executeWalletPayment = useCallback(
    async (bundle: PaymentIntentBundle, code: string) => {
      const wagmiChainId = resolveWagmiChainId(bundle.chainId);
      const chainPublicClient = wagmiChainId ? getPublicClient(config, { chainId: wagmiChainId }) : undefined;
      if (!walletClient || !chainPublicClient || !address) {
        setErrorKey('walletNotConnected');
        setPhase('error');
        return;
      }
      if (!isPaymentChain(chainId) || chainId !== bundle.chainId) {
        setErrorKey('wrongNetwork');
        setPhase('error');
        setErrorDetail('请将钱包网络切换到与订单一致的支付链后再支付');
        return;
      }

      setErrorKey(null);
      setErrorDetail(null);
      setTxHash(null);

      const payHash = await executePayOrder({
        walletClient,
        publicClient: chainPublicClient as PublicClient,
        bundle,
        account: address,
        onPhase: (next) => setPhase(next),
        onPaySubmitted: async (hash) => {
          setTxHash(hash);
          mockAdvancePaymentIntent(code, hash);
          setPhase('confirming');
          await reportConfirming(code, hash);
        },
      });

      setTxHash(payHash);
      setPhase('confirming');
    },
    [address, chainId, walletClient],
  );

  const startPayment = useCallback(
    async (payload: CreateOrderReq) => {
      if (!isConnected || !address) {
        setErrorKey('walletNotConnected');
        setPhase('error');
        return;
      }
      if (!walletClient) {
        setErrorKey('walletNotConnected');
        setPhase('error');
        return;
      }
      const payChainId = payload.chainId && payload.chainId > 0 ? payload.chainId : chainId;
      const wagmiPayChainId = payChainId ? resolveWagmiChainId(Number(payChainId)) : null;
      if (!wagmiPayChainId || !getPublicClient(config, { chainId: wagmiPayChainId })) {
        setErrorKey('wrongNetwork');
        setPhase('error');
        setErrorDetail('当前支付链 RPC 未配置，请检查网络设置');
        return;
      }

      setErrorKey(null);
      setErrorDetail(null);
      setTxHash(null);
      setIntent(null);
      setPaidAmount(null);
      setOrderCode(null);

      try {
        setPhase('submitting');
        const created = await orderApi.create({
          ...payload,
          payerAddress: payload.payerAddress || address,
        });

        const code = created.order.orderCode;
        const bundle = paymentToIntentBundle(created.payment, code);
        setOrderCode(code);
        setIntent(bundle);
        setPaidAmount(created.order.payAmount ?? created.payment.payAmount ?? payload.payAmount);

        await executeWalletPayment(bundle, code);
      } catch (err) {
        const failure = applyPayFailure(err);
        setErrorKey(failure.errorKey);
        setErrorDetail(failure.detail);
        setPhase(failure.phase);
      }
    },
    [address, executeWalletPayment, isConnected, walletClient, chainId],
  );

  /** 订单已创建后，重新调起钱包授权/支付（不重复创单） */
  const continuePayment = useCallback(async () => {
    if (!intent || !orderCode) return;
    try {
      await executeWalletPayment(intent, orderCode);
    } catch (err) {
      const failure = applyPayFailure(err);
      setErrorKey(failure.errorKey);
      setErrorDetail(failure.detail);
      setPhase(failure.phase);
    }
  }, [executeWalletPayment, intent, orderCode]);

  /** 支付已关闭时恢复为可支付，再继续钱包流程 */
  const resumeAndContinue = useCallback(async () => {
    if (!intent || !orderCode) return;
    await reportResumePay(orderCode);
    await continuePayment();
  }, [continuePayment, intent, orderCode]);

  const canRetryWithIntent = useCallback(
    (phaseValue: PaymentPhase, errorKeyValue: string | null): boolean =>
      Boolean(
        intent &&
          orderCode &&
          (phaseValue === 'authCancelled' ||
            phaseValue === 'payCancelled' ||
            (phaseValue === 'error' &&
              errorKeyValue != null &&
              RETRYABLE_PAY_ERROR_KEYS.has(errorKeyValue))),
      ),
    [intent, orderCode],
  );

  const markSuccess = useCallback(() => {
    setPhase('success');
  }, []);

  /** 轮询发现订单支付已关闭：仅更新 UI，不自动重试钱包 */
  const markConfirmFailedFromPoll = useCallback((detail?: string | null) => {
    setPhase('error');
    setErrorKey('paymentFailed');
    setErrorDetail(formatPayErrorMessage(detail) ?? detail ?? '链上确认失败，订单已关闭');
  }, []);

  const retry = useCallback(() => {
    setPhase('idle');
    setErrorKey(null);
    setErrorDetail(null);
    setTxHash(null);
    setIntent(null);
    setOrderCode(null);
    setPaidAmount(null);
  }, []);

  return {
    phase,
    orderCode,
    intent,
    txHash,
    paidAmount,
    errorKey,
    errorDetail,
    startPayment,
    continuePayment,
    resumeAndContinue,
    canRetryWithIntent,
    markSuccess,
    markConfirmFailedFromPoll,
    retry,
    resetError,
    isConnected,
    chainId,
    address,
  };
}
