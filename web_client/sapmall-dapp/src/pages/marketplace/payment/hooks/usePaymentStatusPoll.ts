import { useCallback, useEffect, useRef, useState } from 'react';
import { orderApi, OrderPaymentStatus, OrderStatusResp } from '../../../../services/api/orderApi';
import { ApiError } from '../../../../services/api/baseClient';

const POLL_MS = 3000;

function toPaymentStatus(resp: OrderStatusResp): OrderPaymentStatus {
  return {
    intentId: '',
    orderCode: '',
    paymentStatus: resp.paymentStatus,
    txHash: resp.txHash,
    confirmations: resp.paymentStatus === 3 ? 6 : 0,
    requiredConfirmations: 6,
  };
}

export function usePaymentStatusPoll(orderCode: string | null, txHash: string | null, enabled: boolean) {
  const [status, setStatus] = useState<OrderPaymentStatus | null>(null);
  const [polling, setPolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollOnce = useCallback(async () => {
    if (!orderCode) return null;
    try {
      const resp = await orderApi.getStatus({ orderCode, txHash: txHash || undefined });
      const next = toPaymentStatus(resp);
      setStatus(next);
      return next;
    } catch (err) {
      if (err instanceof ApiError && err.status === 405) {
        console.warn('[usePaymentStatusPoll] /api/order/status 返回 405，后端路由可能未注册，跳过本次轮询');
        return null;
      }
      throw err;
    }
  }, [orderCode, txHash]);

  useEffect(() => {
    if (!enabled || !orderCode) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setPolling(false);
      return;
    }

    setPolling(true);
    pollOnce().catch(() => {});

    timerRef.current = setInterval(() => {
      pollOnce().catch(() => {});
    }, POLL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setPolling(false);
    };
  }, [enabled, orderCode, pollOnce]);

  return { status, polling, refresh: pollOnce };
}
