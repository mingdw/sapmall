import { useCallback, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import {
  CreateOrderReq,
  mockAdvancePaymentIntent,
  orderApi,
  paymentToIntentBundle,
  PaymentIntentBundle,
} from '../../../../services/api/orderApi';
import { ApiError } from '../../../../services/api/baseClient';
import { isPaymentChain } from '../../../../config/paymentChains';
import { PaymentPhase } from '../types/paymentTypes';
import { executePayOrder, PayOrderError } from '../utils/executePayOrder';

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

export function useOrderPayment() {
  const { address, chainId, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [phase, setPhase] = useState<PaymentPhase>('idle');
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [intent, setIntent] = useState<PaymentIntentBundle | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);

  const resetError = useCallback(() => setErrorKey(null), []);

  const executeWalletPayment = useCallback(
    async (bundle: PaymentIntentBundle, code: string) => {
      if (!walletClient || !publicClient || !address) {
        setErrorKey('walletNotConnected');
        setPhase('error');
        return;
      }
      if (!isPaymentChain(chainId) || chainId !== bundle.chainId) {
        setErrorKey('wrongNetwork');
        setPhase('error');
        return;
      }

      setErrorKey(null);
      setTxHash(null);
      setPhase('approving');

      const payHash = await executePayOrder({
        walletClient,
        publicClient,
        bundle,
        account: address,
        onPhase: (next) => setPhase(next),
      });

      setTxHash(payHash);
      mockAdvancePaymentIntent(code, payHash);
      setPhase('confirming');
    },
    [address, chainId, publicClient, walletClient],
  );

  const startPayment = useCallback(
    async (payload: CreateOrderReq) => {
      if (!isConnected || !address) {
        setErrorKey('walletNotConnected');
        setPhase('error');
        return;
      }
      if (!walletClient || !publicClient) {
        setErrorKey('walletNotConnected');
        setPhase('error');
        return;
      }

      setErrorKey(null);
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
        const failure = mapPayFailure(err);
        setErrorKey(failure.errorKey);
        setPhase(failure.phase);
      }
    },
    [address, executeWalletPayment, isConnected, publicClient, walletClient],
  );

  /** 订单已创建后，重新调起钱包授权/支付（不重复创单） */
  const continuePayment = useCallback(async () => {
    if (!intent || !orderCode) return;
    try {
      await executeWalletPayment(intent, orderCode);
    } catch (err) {
      const failure = mapPayFailure(err);
      setErrorKey(failure.errorKey);
      setPhase(failure.phase);
    }
  }, [executeWalletPayment, intent, orderCode]);

  const markSuccess = useCallback(() => {
    setPhase('success');
  }, []);

  const retry = useCallback(() => {
    setPhase('idle');
    setErrorKey(null);
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
    startPayment,
    continuePayment,
    markSuccess,
    retry,
    resetError,
    isConnected,
    chainId,
    address,
  };
}
