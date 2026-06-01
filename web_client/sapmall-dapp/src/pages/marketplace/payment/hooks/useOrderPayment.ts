import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  mockAdvancePaymentIntent,
  orderApi,
  PaymentIntentBundle,
} from '../../../../services/api/orderApi';
import { isPaymentChain } from '../../../../config/paymentChains';
import { PaymentPhase } from '../types/paymentTypes';

function mockTxHash() {
  return `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2, 18)}`;
}

export function useOrderPayment() {
  const { address, chainId, isConnected } = useAccount();
  const [phase, setPhase] = useState<PaymentPhase>('idle');
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [intent, setIntent] = useState<PaymentIntentBundle | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const resetError = useCallback(() => setErrorKey(null), []);

  const startPayment = useCallback(
    async (payload: { skuId: number; quantity: number; totalAmount: number }) => {
      if (!isConnected || !address) {
        setErrorKey('walletNotConnected');
        setPhase('error');
        return;
      }

      setErrorKey(null);
      setTxHash(null);
      setIntent(null);

      try {
        setPhase('submitting');
        const created = await orderApi.create({ skuId: payload.skuId, quantity: payload.quantity });
        setOrderCode(created.orderCode);

        setPhase('intentLoading');
        const bundle = await orderApi.createPaymentIntent(
          created.orderCode,
          address,
          payload.totalAmount,
        );
        setIntent(bundle);

        if (!isPaymentChain(chainId) || chainId !== bundle.chainId) {
          setErrorKey('wrongNetwork');
          setPhase('error');
          return;
        }

        setPhase('approving');
        await new Promise((r) => setTimeout(r, 1200));

        setPhase('paying');
        await new Promise((r) => setTimeout(r, 1400));
        const hash = mockTxHash();
        setTxHash(hash);
        mockAdvancePaymentIntent(bundle.intentId, hash);

        setPhase('confirming');
      } catch {
        setErrorKey('paymentFailed');
        setPhase('error');
      }
    },
    [address, chainId, isConnected],
  );

  const markSuccess = useCallback(() => {
    setPhase('success');
  }, []);

  const retry = useCallback(() => {
    setPhase('idle');
    setErrorKey(null);
    setTxHash(null);
  }, []);

  return {
    phase,
    orderCode,
    intent,
    txHash,
    errorKey,
    startPayment,
    markSuccess,
    retry,
    resetError,
    isConnected,
    chainId,
    address,
  };
}
